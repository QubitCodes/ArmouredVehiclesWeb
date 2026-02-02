"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import { startOtpLogin, verifyOtpLogin } from "../services/auth";
import { useAuth } from "@/lib/auth-context";
import { storeTokens, storeUser, api } from "@/lib/api"; // Added api
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"; // Added hook

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [identifier, setIdentifier] = useState("");
    const [stage, setStage] = useState<"start" | "verify" | "magic_link_sent">("start");
    const { refreshUser } = useAuth();
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [debugOtp, setDebugOtp] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef<HTMLInputElement[]>([]);

    // Firebase Hook
    const { sendPhoneOtp, verifyPhoneOtp, sendMagicLink, verifyMagicLink, isMagicLink } = useFirebaseAuth();
    const [confirmationResult, setConfirmationResult] = useState<any>(null); // Store Firebase confirmation result

    const isEmail = (value: string) => value.includes("@");
    const isPhone = (value: string) => /^[+0-9\s]+$/.test(value);

    // Magic Link Verification Effect
    useEffect(() => {
        const checkMagicLink = async () => {
            if (isMagicLink(window.location.href)) {
                setLoading(true);
                try {
                    // Try to get email from storage
                    let email = window.localStorage.getItem('emailForSignIn');
                    if (!email) {
                        email = window.prompt('Please provide your email for confirmation');
                    }
                    if (!email) return; // User cancelled

                    const credential = await verifyMagicLink(email);
                    const idToken = await credential.user.getIdToken();
                    await completeLogin(idToken, credential.user);
                } catch (err: any) {
                    alert(err.message || "Failed to verify magic link");
                } finally {
                    setLoading(false);
                }
            }
        };
        checkMagicLink();
    }, []);

    const completeLogin = async (idToken: string, firebaseUser: any) => {
        try {
            const res = await api.auth.verifyFirebase(idToken);
            // res = { status: true, data: { user, accessToken, ... } }
            // Note: api.auth.verifyFirebase returns AuthResponse which has user, accessToken, etc. directly at top level 
            // OR nested in data depending on how we standardized it. 
            // Looking at api.ts storeTokens() usage inside it, it seems to return data object directly.
            // Let's rely on api.ts doing storeTokens internaly as per my recent edit?
            // Wait, api.ts verifyFirebase calls storeTokens internaly.

            // Just refresh user context
            await refreshUser();

            console.log(`[LOGIN] Success. User: ${res.user.email}`);

            // Handle Redirection
            handleRedirect(res.user);
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Login failed on server");
        }
    };

    const handleRedirect = (user: any) => {
        const returnUrl = searchParams.get('returnUrl');
        if (returnUrl && !returnUrl.includes('/login')) {
            router.replace(returnUrl);
            return;
        }

        switch (true) {
            // case !user.email_verified && user.email: router.push('/verify-email'); break;
            case !user.phone: router.push('/add-phone'); break;
            // case !user.phone_verified: router.push('/verify-phone'); break;
            case !user.profile: router.push('/create-account'); break;
            case ((user.onboardingStep ?? user.onboarding_step) && (user.onboardingStep ?? user.onboarding_step) > 0):
                const step = user.onboardingStep ?? user.onboarding_step;
                router.push(`/buyer-onboarding/step/${step}`);
                break;
            default: router.push('/'); break;
        }
    };

    const handleContinue = async () => {
        let input = identifier.trim();
        if (input.length > 0) {
            const first = input.charAt(0);
            if (isEmail(input) && first !== first.toLowerCase()) {
                input = first.toLowerCase() + input.slice(1);
            }
        }
        if (!input) {
            alert("Please enter your email or phone number");
            return;
        }

        try {
            setLoading(true);

            // 1. Check if user exists
            const { exists, data, bypass } = await api.auth.checkUser(input);
            console.log("[Login] CheckUser Response:", { exists, data, bypass });

            // DEV BACKDOOR HANDLER
            if (bypass && data?.user) {
                console.log('[DEV-AUTH] Backdoor triggered for:', data.user.email);
                await refreshUser();
                handleRedirect(data.user);
                return;
            }

            if (!exists) {
                alert("User not found. Please create an account first.");
                router.push('/register');
                return;
            }

            // 2. Trigger Firebase Auth
            if (isEmail(input)) {
                await sendMagicLink(input);
                setStage("magic_link_sent");
                alert(`Magic link sent to ${input}. Please check your inbox.`);
            } else {
                // Phone
                // Use the standardized identifier from backend (e.g. +97150...)
                const phoneToUse = data.identifier || (input.startsWith('+') ? input : `+${input.replace(/\D/g, '')}`);

                // We need a recaptcha container
                const res = await sendPhoneOtp(phoneToUse, 'recaptcha-container');
                setConfirmationResult(res);
                setStage("verify");
            }
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Failed to start login");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        const code = otp.join("");
        if (code.length !== 6) {
            alert("Please enter the 6-digit OTP");
            return;
        }

        if (!confirmationResult) {
            alert("Session expired. Please try again.");
            setStage('start');
            return;
        }

        try {
            setLoading(true);
            const credential = await verifyPhoneOtp(confirmationResult, code);
            const idToken = await credential.user.getIdToken();
            await completeLogin(idToken, credential.user);
        } catch (err: any) {
            alert(err.message || "Invalid Code");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        const val = value.replace(/[^0-9]/g, "").slice(0, 1);
        const updated = [...otp];
        updated[index] = val;
        setOtp(updated);
        if (val && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (otp[index]) {
                const updated = [...otp];
                updated[index] = "";
                setOtp(updated);
                return;
            }
            if (index > 0) inputRefs.current[index - 1]?.focus();
        }
        if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
        if (e.key === "ArrowRight" && index < otp.length - 1) inputRefs.current[index + 1]?.focus();
        if (e.key === "Enter" && stage === "verify") {
            e.preventDefault();
            handleVerify();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const paste = e.clipboardData.getData("text");
        const digits = paste.replace(/\D/g, "").slice(0, otp.length).split("");
        if (digits.length > 0) {
            e.preventDefault();
            const filled = [...otp];
            for (let i = 0; i < digits.length; i++) {
                filled[i] = digits[i];
            }
            setOtp(filled);
            const nextIndex = Math.min(digits.length, otp.length - 1);
            inputRefs.current[nextIndex]?.focus();
        }
    };

    useEffect(() => {
        if (stage === "verify") {
            setTimeout(() => inputRefs.current[0]?.focus(), 0);
        }
    }, [stage]);

    return (
        <>
            <section className="relative w-full min-h-[calc(100vh-140px)] bg-[#EFE8DC]">
                <Image
                    src="/images/register-bg.jpg"
                    alt="Login Background"
                    fill
                    priority
                    className="object-cover hidden md:block"
                />
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />

                <div className="relative z-10 max-w-[1720px] mx-auto px-6 lg:px-[140px] flex items-start lg:items-center min-h-[calc(100vh-140px)] top-28 lg:mt-0">
                    <div className="bg-[#F0EBE3] w-full max-w-[420px] p-8 shadow-md text-center pointer-events-auto">
                        <h2
                            className="text-[22px] font-bold mb-2 uppercase text-black"
                            style={{ fontFamily: "Orbitron" }}
                        >
                            Welcome Back
                        </h2>

                        <p className="text-sm text-gray-700 mb-6">
                            Login to your account below.
                            <br />
                            New around here?{" "}
                            <Link href="/register" className="text-[#D35400] font-semibold">
                                Create an account
                            </Link>
                        </p>

                        <input
                            type="text"
                            placeholder="Email or Phone (e.g. +971 55...)"
                            value={identifier}
                            disabled={stage !== 'start'}
                            onChange={(e) => setIdentifier(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleContinue(); } }}
                            className="w-full mb-3 px-4 py-3 border border-[#C7B88A] bg-transparent text-sm text-black placeholder:text-[#9D9A95] focus:outline-none disabled:opacity-50"
                        />

                        {/* Hidden Recaptcha Container */}
                        <div id="recaptcha-container"></div>

                        {stage === "verify" && (
                            <div className="mb-3">
                                <div className="flex gap-2 justify-center mb-2">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            onPaste={index === 0 ? handleOtpPaste : undefined}
                                            ref={(el) => { if (el) inputRefs.current[index] = el; }}
                                            className="w-10 h-12 text-center border border-[#C7B88A] bg-transparent text-sm text-black placeholder:text-[#9D9A95] focus:outline-none"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {stage === "magic_link_sent" && (
                            <div className="mb-4 p-3 bg-green-100 text-green-800 text-sm rounded">
                                We have sent a login link to <strong>{identifier}</strong>.
                                Please check your email and click the link to continue.
                            </div>
                        )}

                        <div className="flex items-start gap-2 text-xs text-gray-700 mb-5 text-center">
                            <p>
                                By continuing, I confirm that I have read the{" "}
                                <Link
                                    href="/privacy-policy"
                                    className="text-[#D35400] font-semibold hover:underline"
                                >
                                    Privacy Policy
                                </Link>
                                .
                            </p>
                        </div>

                        {stage === "start" ? (
                            <button
                                onClick={handleContinue}
                                disabled={loading}
                                className="w-full h-[52px] bg-[#D35400] text-white font-black font-orbitron clip-path-supplier text-[16px] hover:bg-[#39482C] transition-colors uppercase disabled:opacity-60"
                            >
                                {loading ? "Checking..." : "Continue"}
                            </button>
                        ) : stage === 'verify' ? (
                            <button
                                onClick={() => handleVerify()}
                                disabled={loading}
                                className="w-full h-[52px] bg-[#D35400] text-white font-black font-orbitron clip-path-supplier text-[16px] hover:bg-[#39482C] transition-colors uppercase disabled:opacity-60"
                            >
                                {loading ? "Verifying..." : "Verify & Login"}
                            </button>
                        ) : null}
                    </div>
                </div>
            </section>
        </>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
