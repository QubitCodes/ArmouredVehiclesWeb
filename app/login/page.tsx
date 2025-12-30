"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { startOtpLogin, verifyOtpLogin } from "../services/auth";
import { useAuth } from "@/lib/auth-context";


export default function LoginPage() {


    const router = useRouter();
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
        const email = identifier.trim();
        if (!email) {
            alert("Please enter your email address");
            return;
        }
        if (!isEmail(email)) {
            alert("OTP login currently supports email only.");
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

    const handleVerify = async () => {
        const email = identifier.trim();
        const code = otp.join("");
        if (code.length !== 6) {
            alert("Please enter the 6-digit OTP");
            return;
        }
        try {
            setLoading(true);
            const res = await verifyOtpLogin(email, code);
            const { user, accessToken, refreshToken, expiresIn } = res.data;
            // Store tokens (both legacy and lib/api.ts keys)
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("expiresIn", expiresIn.toString());
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);
            localStorage.setItem("token_expiry", String(Date.now() + expiresIn * 1000));
            // Update auth context immediately so Navbar reflects logged-in state
            await refreshUser();
            router.push('/');
        } catch (err: any) {
            alert(err?.response?.data?.message || err?.message || "Failed to verify OTP");
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
                    className="object-cover"
                />

                {/* Light overlay */}
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 max-w-[1720px] mx-auto px-6 lg:px-[140px] flex items-center min-h-[calc(100vh-140px)]">

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
                            placeholder="Please Enter Email or Mobile Number"
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
                                onClick={handleVerify}
                                disabled={loading}
                                className="w-full h-[52px] bg-[#D35400] text-white font-black font-orbitron clip-path-supplier text-[16px] hover:bg-[#39482C] transition-colors uppercase disabled:opacity-60"
                            >
                                {loading ? "Verifying..." : "Verify & Login"}
                            </button>
                        )}

                    </div>
                </div>

            </section>
        </>
    );
}
