"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SellerVerifyEmailPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/seller/add-phone"); // ✅ seller flow
  };

  return (
    <section className="min-h-screen bg-[#EFE8DC] flex items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-lg bg-[#F4EFE6] p-10 shadow-md text-center">
        {/* Title */}
        <h1 className="text-xl font-orbitron font-bold uppercase text-black">
          Verify Your Email Address
        </h1>

        <p className="mt-3 text-sm text-gray-700">
          We&apos;ve emailed a security code to <br />
          <span className="font-semibold">verify@gmail.com</span>
        </p>

        <p className="mt-1 text-xs text-gray-600">
          If you can&apos;t find it, check your spam folder.{" "}
          <Link href="#" className="text-[#D35400] hover:underline">
            Wrong email?
          </Link>
        </p>

        {/* OTP Boxes */}
        <div className="mt-6 flex justify-center gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <input
              key={i}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              autoFocus={i === 0}
              className="h-12 w-12 border border-[#C7B88A] bg-[#EFE8DC]
                         text-center text-lg font-semibold
                         focus:outline-none focus:border-black"
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          {/* Cancel */}
          <button
            onClick={() => router.back()}
            className="relative w-[160px] h-[42px] bg-transparent"
          >
            {/* Border shape */}
            <span
              className="absolute inset-0 clip-path-supplier bg-[#C7B88A]"
              aria-hidden
            />

            {/* Inner fill */}
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
            <span className="flex items-center justify-center h-full w-full font-orbitron font-bold text-[12px] uppercase text-white leading-none">
              Verify
            </span>
          </button>
        </div>

        {/* Resend */}
        <p className="mt-6 text-xs text-gray-700">
          Still no code?{" "}
          <Link href="#" className="text-[#D35400] hover:underline">
            Get another one.
          </Link>
        </p>
      </div>
    </section>
  );
}
