"use client";

import { useRouter } from "next/navigation";

export default function SellerVerifyPhonePage() {
  const router = useRouter();

  return (
    <section className="min-h-screen bg-[#EFE8DC] flex items-center justify-center px-4 font-inter">
      {/* Card */}
      <div className="w-full max-w-xl bg-[#F4EFE6] p-10 shadow-md text-center relative">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 w-8 h-8 rounded-full
                     border border-[#C7B88A]
                     flex items-center justify-center
                     text-sm text-gray-700
                     hover:bg-[#EFE8DC]"
        >
          ←
        </button>

        {/* Heading – ORBITRON */}
        <h1 className="text-xl font-orbitron font-bold uppercase text-black tracking-wide">
          Enter Security Code
        </h1>

        {/* Body text – INTER */}
        <p className="mt-3 text-sm text-gray-700 font-normal">
          We sent a security code to:{" "}
          <span className="font-semibold">+91xxxxxx50</span>
        </p>

        {/* OTP Boxes */}
        <div className="mt-8 flex justify-center gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <input
              key={i}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              autoFocus={i === 0}
              className="w-14 h-14 border border-[#C7B88A]
                         bg-[#EFE8DC]
                         text-center text-xl font-semibold
                         focus:outline-none focus:border-black"
            />
          ))}
        </div>

        {/* Timer – INTER */}
        <p className="mt-6 text-xs text-gray-600 font-normal">
          You can resend the security code in 59 seconds.
        </p>

        {/* Help link – INTER */}
        <div className="mt-4 text-left">
          <button className="text-xs font-semibold underline text-gray-700 hover:text-black">
            Need Help?
          </button>
        </div>
      </div>
    </section>
  );
}
