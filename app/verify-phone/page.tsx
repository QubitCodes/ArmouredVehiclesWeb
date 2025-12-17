"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";


export default function VerifyPhonePage() {
    const router = useRouter();
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [timer, setTimer] = useState(59);
    const inputsRef = useRef<HTMLInputElement[]>([]);

    // Countdown timer
    useEffect(() => {
        if (timer === 0) return;
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
                    <span className="font-semibold">+91xxxxxx50</span>
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
                <p className="text-xs text-gray-600 text-center mb-4">
                    You can resend the security code in{" "}
                    <span className="font-semibold">{timer}</span> seconds.
                </p>

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
