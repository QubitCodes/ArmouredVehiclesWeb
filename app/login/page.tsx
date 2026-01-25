"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { startOtpLogin, verifyOtpLogin } from "../services/auth";
import { useAuth } from "@/lib/auth-context";
import { storeTokens, storeUser } from "@/lib/api";


import { Suspense } from 'react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [identifier, setIdentifier] = useState("");
    const [stage, setStage] = useState<"start" | "verify">("start");
    const { refreshUser } = useAuth();
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [debugOtp, setDebugOtp] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef<HTMLInputElement[]>([]);



    const isEmail = (value: string) => {
        return value.includes("@");
    };

    const isPhone = (value: string) => {
        return /^[+0-9\s]+$/.test(value);
    };

    const handleContinue = async () => {
        let email = identifier.trim();
        if (email.length > 0) {
            const first = email.charAt(0);
            // if first character is an uppercase letter, convert it to lowercase
            if (first !== first.toLowerCase()) {
                email = first.toLowerCase() + email.slice(1);
            }
        }
        if (!email) {
            alert("Please enter your email or phone number");
            return;
        }

        try {
            setLoading(true);
            const res = await startOtpLogin(email);
            const { message, expiresIn, debugOtp } = res.data;
            setStage("verify");
            setDebugOtp(debugOtp || "");
        } catch (err: any) {
            alert(err?.response?.data?.message || err?.message || "Failed to start OTP login");
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
                // Clear current value
                const updated = [...otp];
                updated[index] = "";
                setOtp(updated);
                return; // keep focus
            }
            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === "ArrowRight" && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
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
            // Autofocus first OTP input
            setTimeout(() => inputRefs.current[0]?.focus(), 0);
        }
    }, [stage]);

    const ignoreRedirectRef = useRef(false);

    // Redirect if already logged in
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    useEffect(() => {
        if (!authLoading && isAuthenticated && !ignoreRedirectRef.current) {
            const returnUrl = searchParams.get('returnUrl') || '/';
            // Prevent loop if returnUrl is login
            if (returnUrl.includes('/login')) {
                router.replace('/');
            } else {
                router.replace(returnUrl);
            }
        }
    }, [authLoading, isAuthenticated, router, searchParams]);

    const handleVerify = async (manualEmail?: string, manualCode?: string) => {
        // Normalize email/identifier similar to handleContinue: prefer a provided manualEmail
        // but fall back to the current identifier. Trim and ensure the first character is
        // lowercased if it was uppercase.
        let email = manualEmail && manualEmail.trim().length > 0 ? manualEmail.trim() : identifier.trim();
        if (email.length > 0) {
            const first = email.charAt(0);
            if (first !== first.toLowerCase()) {
                email = first.toLowerCase() + email.slice(1);
            }
        }

        const code = manualCode || otp.join("");

        if (code.length !== 6) {
            alert("Please enter the 6-digit OTP");
            return;
        }
        try {
            setLoading(true);
            const res = await verifyOtpLogin(email, code);
            // API response is nested: res.data = { status, message, code, data: { user, accessToken, ... } }
            const { user, accessToken, refreshToken, expiresIn } = res.data.data;

            // Set flag to ignore the auto-redirect effect, since we will handle it manually here
            ignoreRedirectRef.current = true;

            // Store tokens (both legacy and lib/api.ts keys)
            // Store tokens using centralized logic (handles cookies for middleware)
            storeTokens(accessToken, refreshToken, expiresIn);
            storeUser(user);

            console.log(`[CHECKOUT DEBUG] LOGIN SUCCESS. Token: ${accessToken.substring(0, 20)}...`);

            // Update auth context immediately so Navbar reflects logged-in state
            await refreshUser();

            // Merge guest cart
            // await api.cart.merge();

            // Redirection Logic
            const redirect = searchParams.get('redirect');

            // Switch-case logic for redirection priority
            switch (true) {
                // 1. Email Verification
                case !user.email_verified:
                    router.push('/verify-email');
                    break;

                // 2. Phone Existence
                case !user.phone:
                    router.push('/add-phone');
                    break;

                // 3. Phone Verification
                case !user.phone_verified:
                    router.push('/verify-phone');
                    break;

                // 4. Profile Creation (Check if profile exists)
                // Note: AuthController now returns nested profile object
                case !user.profile:
                    router.push('/create-account');
                    break;

                // 5. In-progress Onboarding ( Specific Step )
                case (user.onboardingStep && (user as any).onboardingStep > 0):
                    console.log(`Redirecting to onboarding step: ${user.onboardingStep}`);
                    router.push(`/buyer-onboarding/step/${user.onboardingStep}`);
                    break;

                // 6. Redirect URL
                case !!redirect:
                    router.push(redirect!);
                    break;

                // 7. Default Dashboard/Home
                default:
                    router.push('/');
                    break;
            }
        } catch (err: any) {
            alert(err?.response?.data?.message || err?.message || "Failed to verify OTP");
            ignoreRedirectRef.current = false; // Reset on error
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {/* HERO SECTION */}
            <section className="relative w-full min-h-[calc(100vh-140px)] bg-[#EFE8DC]">
                {/* Background Image */}
                <Image
                    src="/images/register-bg.jpg" // same image as register
                    alt="Login Background"
                    fill
                    priority
                    className="object-cover hidden md:block"
                />

                {/* Light overlay */}
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 max-w-[1720px] mx-auto px-6 lg:px-[140px] flex items-start lg:items-center min-h-[calc(100vh-140px)] top-28 lg:mt-0">

                    {/* Login Card */}
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

                        {/* Email or Phone */}
                        <input
                            type="text"
                            placeholder="Email or Phone"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full mb-3 px-4 py-3 border border-[#C7B88A] bg-transparent text-sm text-black placeholder:text-[#9D9A95] focus:outline-none"
                        />

                        {/* OTP Inputs (shown after starting login) */}
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
                                            ref={(el) => {
                                                if (el) inputRefs.current[index] = el;
                                            }}
                                            className="w-10 h-12 text-center border border-[#C7B88A] bg-transparent text-sm text-black placeholder:text-[#9D9A95] focus:outline-none"
                                        />
                                    ))}
                                </div>
                                {debugOtp && (
                                    <p className="text-xs text-gray-600 text-center">Debug OTP: {debugOtp}</p>
                                )}
                            </div>
                        )}


                        {/* Privacy Policy Confirmation */}
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

                        {/* Continue / Verify Button */}
                        {stage === "start" ? (
                            <button
                                onClick={handleContinue}
                                disabled={loading}
                                className="w-full h-[52px] bg-[#D35400] text-white font-black font-orbitron clip-path-supplier text-[16px] hover:bg-[#39482C] transition-colors uppercase disabled:opacity-60"
                            >
                                {loading ? "Sending OTP..." : "Continue"}
                            </button>
                        ) : (
                            <button
                                onClick={() => handleVerify()}
                                disabled={loading}
                                className="w-full h-[52px] bg-[#D35400] text-white font-black font-orbitron clip-path-supplier text-[16px] hover:bg-[#39482C] transition-colors uppercase disabled:opacity-60"
                            >
                                {loading ? "Verifying..." : "Verify & Login"}
                            </button>
                        )}

                        {/* Quick Login Buttons (Dev Only) */}
                        {/* <div className="mt-4 grid grid-cols-2 gap-2">
                             <button
                                type="button"
                                onClick={async () => {
                                    const phone = "9400143527";
                                    setIdentifier(phone);
                                    try {
                                        setLoading(true);
                                        await startOtpLogin(phone);
                                        setStage("verify");
                                        setOtp(['1','2','3','4','5','6']);
                                        // Auto Verify
                                        await handleVerify(phone, '123456');
                                    } catch (err: any) {
                                        alert(err?.response?.data?.message || err?.message || "Failed");
                                        setLoading(false);
                                    }
                                }}
                                className="text-xs bg-gray-200 text-gray-700 py-1 px-2 rounded hover:bg-gray-300"
                            >
                                Dev: 9400143527
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    const phone = "8281300882";
                                    setIdentifier(phone);
                                    try {
                                        setLoading(true);
                                        await startOtpLogin(phone);
                                        setStage("verify");
                                        setOtp(['1','2','3','4','5','6']);
                                        // Auto Verify
                                        await handleVerify(phone, '123456');
                                    } catch (err: any) {
                                        alert(err?.response?.data?.message || err?.message || "Failed");
                                        setLoading(false);
                                    }
                                }}
                                className="text-xs bg-gray-200 text-gray-700 py-1 px-2 rounded hover:bg-gray-300"
                            >
                                Dev: 8281300882
                            </button>
                        </div> */}

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
