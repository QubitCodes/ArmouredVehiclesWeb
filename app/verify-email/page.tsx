"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
    const router = useRouter();
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const inputsRef = useRef<HTMLInputElement[]>([]);

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

    // temporory route handler
  const handleContinue = () => {
    router.push("/add-phone"); // ✅ NEXT STEP
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

                <p className="text-sm font-semibold mb-3">
                    verify@gmail.com
                </p>

                <p className="text-xs text-gray-600 mb-6">
                    If you can't find it, check your spam folder.{" "}
                    <Link href="/login" className="text-[#D35400] font-semibold hover:underline">
                        Wrong email?
                    </Link>
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
                        onClick={() => router.back()}
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
                            Cancel
                        </span>
                    </button>


                    {/* Verify */}
                    <button
                    onClick={handleContinue}
                        className="w-[160px] h-[42px] bg-[#D35400] clip-path-supplier hover:bg-[#39482C] transition-colors"
                    >
                        <span
                            className="flex items-center justify-center h-full w-full font-orbitron font-bold text-[12px] uppercase text-white leading-none"
                        >
                            Verify
                        </span>
                    </button>


                </div>


                {/* Resend */}
                <p className="text-xs text-gray-700">
                    Still no code?{" "}
                    <button className="text-[#D35400] font-semibold hover:underline">
                        Get another one.
                    </button>
                </p>

            </div>
        </section>
    );
}
