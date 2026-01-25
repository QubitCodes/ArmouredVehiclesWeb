"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { startOtpRegister, verifyEmailOtp } from "@/app/services/auth";
import { toast } from "sonner";

export default function VerifyEmailPage() {
    const router = useRouter();
    const { user, refreshUser } = useAuth();
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const inputsRef = useRef<HTMLInputElement[]>([]);
    const [loading, setLoading] = useState(false);
    const [canResend, setCanResend] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    // Auto-trigger OTP on mount if not recently sent
    useEffect(() => {
        const init = async () => {
            // If user already verified, leave
            if (user && user.email_verified) {
                router.replace('/add-phone');
                return;
            }

            // Check local storage for last sent
            const lastSent = localStorage.getItem('last_email_otp_sent');
            const now = Date.now();

            if (!lastSent || (now - parseInt(lastSent) > 60000)) {
                if (user?.email) {
                    await handleResend(user.email);
                }
            } else {
                // Set timer based on remaining time
                const diff = Math.ceil((60000 - (now - parseInt(lastSent))) / 1000);
                if (diff > 0) setResendTimer(diff);
            }
        };

        if (user) init();
    }, [user]);

    // Timer logic
    useEffect(() => {
        if (resendTimer > 0) {
            const interval = setInterval(() => setResendTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    const handleResend = async (emailToUse?: string) => {
        const email = emailToUse || user?.email;
        if (!email) return;

        try {
            setCanResend(false);
            // using startOtpRegister to trigger email OTP for existing or new user
            await startOtpRegister({
                email,
                name: user?.name || 'User',
                username: user?.username || email.split('@')[0],
                userType: 'customer' // assume customer context for now
            });

            localStorage.setItem('last_email_otp_sent', Date.now().toString());
            setResendTimer(60);
            toast.success("Verification code sent!");
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to send OTP.");
            setCanResend(true);
        }
    };

    const handleChange = (value: string, index: number) => {
        if (!/^[0-9]?$/.test(value)) return;

        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        if (!user) return;
        const code = otp.join("");
        if (code.length !== 6) {
            toast.error("Please enter complete code");
            return;
        }

        try {
            setLoading(true);
            await verifyEmailOtp({
                userId: user.id || localStorage.getItem('registration_userId') || '',
                email: user.email!,
                code
            });

            toast.success("Email Verified!");
            await refreshUser();
            router.push("/add-phone");
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Verification failed";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative w-full min-h-[calc(100vh-140px)] bg-[#EBE3D6] flex items-center justify-center">


            <div className="absolute inset-0 bg-black/10" />

            {/* Card */}
            <div className="relative z-10 bg-[#F0EBE3] w-full max-w-[520px] p-10 text-center shadow-md text-black">

                <h2
                    className="text-[22px] font-bold uppercase mb-2"
                    style={{ fontFamily: "Orbitron" }}
                >
                    Verify Your Email Address
                </h2>

                <p className="text-sm text-gray-700 mb-1">
                    We've emailed a security code to
                </p>

                <p className="font-semibold mb-3 text-black">
                    {user?.email || 'your email'}
                </p>

                <p className="text-xs text-gray-600 mb-6">
                    If you can't find it, check your spam folder.{" "}
                    <button onClick={() => router.push('/login')} className="text-[#D35400] font-semibold hover:underline">
                        Wrong email?
                    </button>
                </p>

                {/* OTP Inputs */}
                <div className="flex justify-center gap-3 mb-6 text-black">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => {
                                if (el) inputsRef.current[index] = el;
                            }}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-[48px] h-[52px] text-center border border-[#C7B88A] bg-transparent text-lg focus:outline-none"
                        />
                    ))}
                </div>


                {/* Buttons */}
                <div className="flex justify-center gap-6 mb-5">

                    <button
                        onClick={() => router.push('/login')}
                        className="relative w-[160px] h-[42px] bg-transparent"
                    >
                        {/* Border shape */}
                        <span
                            className="absolute inset-0 clip-path-supplier bg-[#C7B88A]"
                            aria-hidden
                        />

                        {/* Inner fill to create border thickness */}
                        <span
                            className="absolute inset-[1.5px] clip-path-supplier bg-[#F0EBE3]"
                            aria-hidden
                        />

                        {/* Text */}
                        <span className="relative z-10 flex items-center justify-center h-full w-full font-orbitron font-bold text-[12px] uppercase text-black leading-none">
                            Back
                        </span>
                    </button>


                    {/* Verify */}
                    <button
                        onClick={handleVerify}
                        disabled={loading}
                        className="w-[160px] h-[42px] bg-[#D35400] clip-path-supplier hover:bg-[#39482C] transition-colors disabled:opacity-50"
                    >
                        <span
                            className="flex items-center justify-center h-full w-full font-orbitron font-bold text-[12px] uppercase text-white leading-none"
                        >
                            {loading ? "Verifying..." : "Verify"}
                        </span>
                    </button>


                </div>


                {/* Resend */}
                <div className="text-xs text-gray-700">
                    Still no code?{" "}
                    {resendTimer > 0 ? (
                        <span className="text-gray-500">Resend in {resendTimer}s</span>
                    ) : (
                        <button
                            onClick={() => handleResend()}
                            className="text-[#D35400] font-semibold hover:underline"
                        >
                            Get another one.
                        </button>
                    )}
                </div>

            </div>
        </section>
    );
}
