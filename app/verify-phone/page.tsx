"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { resendPhoneOtp, verifyPhoneOtp } from "@/app/services/auth";
import { toast } from "sonner";


export default function VerifyPhonePage() {
    const router = useRouter();
    const { user, refreshUser } = useAuth();
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [timer, setTimer] = useState(0);
    const inputsRef = useRef<HTMLInputElement[]>([]);
    const [loading, setLoading] = useState(false);
    const [canResend, setCanResend] = useState(false);

    // Auto-trigger OTP on mount if not recently sent
    useEffect(() => {
        const init = async () => {
            if (user && user.phone_verified) {
                // Check onboarding
                const nextStep = (user as any).onboarding_step ?? (user as any).onboardingStep;
                if (nextStep === 0) router.push('/create-account');
                else if (nextStep > 0) router.push('/buyer-onboarding');
                else router.push('/dashboard');
                return;
            }

            // Check local storage for last sent
            const lastSent = localStorage.getItem('last_phone_otp_sent');
            const now = Date.now();

            if (!lastSent || (now - parseInt(lastSent) > 60000)) {
                if (user?.id && user?.phone) {
                    await handleResend();
                }
            } else {
                const diff = Math.ceil((60000 - (now - parseInt(lastSent))) / 1000);
                if (diff > 0) setTimer(diff);
            }
        };

        if (user) init();
    }, [user]);

    // Countdown timer
    useEffect(() => {
        if (timer === 0) {
            setCanResend(true);
            return;
        }
        const interval = setInterval(() => setTimer((t) => t - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (value: string, index: number) => {
        if (!/^[0-9]?$/.test(value)) return;

        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleResend = async () => {
        if (!user?.phone) return;
        try {
            setCanResend(false);
            await resendPhoneOtp({
                userId: user.id || '',
                phone: user.phone
            });
            localStorage.setItem('last_phone_otp_sent', Date.now().toString());
            setTimer(60);
            toast.success("Code sent to your phone");
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to resend code");
            setCanResend(true);
        }
    };

    const handleVerify = async () => {
        if (!user) return;
        const code = otp.join("");
        if (code.length !== 6) {
            toast.error("Enter complete code");
            return;
        }

        try {
            setLoading(true);
            await verifyPhoneOtp({
                userId: user.id || '',
                phone: user.phone || '', // verifyPhoneOtp logic in controller might ignore this if using user context, but API requires it usually
                code
            });

            toast.success("Phone Verified!");
            await refreshUser();

            // Redirect Logic
            // Force fetch updated user to be sure
            // But refreshUser() should update context.
            // Check step:
            const updatedUser = (await import("@/lib/api")).getStoredUser(); // fallback or rely on context update
            // Context update is async but we awaited it.

            // Default next step
            router.push("/create-account");
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
            <div className="relative z-10 bg-[#F0EBE3] w-full max-w-[520px] p-10 shadow-md text-black">

                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <button
                        onClick={() => router.push("/add-phone")}
                        className="p-1 rounded hover:bg-[#E6E0D6]"
                    >
                        <ChevronLeft size={20} />
                    </button>


                    <h2
                        className="text-[22px] font-bold uppercase"
                        style={{ fontFamily: "Orbitron" }}
                    >
                        Enter Security Code
                    </h2>
                </div>

                <p className="text-sm text-gray-700 mb-6">
                    We sent a security code to:
                    <span className="font-semibold ml-1">{user?.phone || 'your phone'}</span>
                </p>

                {/* OTP boxes */}
                <div className="flex justify-center gap-3 mb-6">
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
                            className="w-[52px] h-[56px] text-center border border-[#C7B88A] bg-transparent text-lg focus:outline-none"
                        />
                    ))}
                </div>

                {/* Timer */}
                <p className="text-xs text-center mb-4 min-h-[20px]">
                    {timer > 0 ? (
                        <span className="text-gray-600">You can resend the security code in <span className="font-semibold">{timer}</span> seconds.</span>
                    ) : (
                        <button onClick={handleResend} className="text-[#D35400] font-semibold hover:underline">
                            Resend Code
                        </button>
                    )}
                </p>

                {/* Verify Button */}
                <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="w-full h-[52px] bg-[#D35400] text-white font-black text-[16px] clip-path-supplier hover:bg-[#39482C] transition-colors uppercase disabled:opacity-50 mb-4"
                >
                    {loading ? "Verifying..." : "Verify & Continue"}
                </button>

                {/* Help */}
                <div className="text-left">
                    <Link
                        href="#"
                        className="text-xs underline text-gray-700 hover:text-[#D35400]"
                    >
                        Need Help?
                    </Link>
                </div>

            </div>
        </section>
    );
}
