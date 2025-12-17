"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddPhonePage() {
    const router = useRouter();
  return (
    <section className="relative w-full min-h-[calc(100vh-140px)] bg-[#EFE8DC] flex items-center justify-center">
      
      {/* Background */}
      <Image
        src="/images/register-bg.jpg"
        alt="Add Phone Background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/10" />

      {/* Card */}
      <div className="relative z-10 bg-[#F0EBE3] w-full max-w-[520px] p-10 text-center shadow-md text-black">
        
        {/* Heading */}
        <h2
          className="text-[22px] font-bold uppercase mb-2"
          style={{ fontFamily: "Orbitron" }}
        >
          Add Your Phone Number
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-6">
          We'll text a security code to your mobile phone to finish setting
          up your account.
        </p>

        {/* Phone Input */}
        <div className="flex items-center border border-[#C7B88A] bg-transparent mb-3">
          
          {/* Country */}
          <div className="flex items-center gap-2 px-3 border-r border-[#C7B88A]">
            <Image
              src="/icons/flags/uae.svg"
              alt="UAE"
              width={24}
              height={16}
            />
            <span className="text-sm font-medium">+971</span>
          </div>

          {/* Number */}
          <input
            type="tel"
            placeholder="Phone number"
            className="flex-1 px-4 py-3 bg-transparent text-sm text-black 
                       placeholder:text-[#9D9A95] focus:outline-none"
          />
        </div>

        {/* Info text */}
        <p className="text-xs text-gray-600 mb-6">
          By selecting Continue, you agree to receive a text message with a
          security code. Standard rates may apply.
        </p>

        {/* Continue Button */}
        <button
          onClick={() => router.push("/verify-phone")}
          className="w-[250px] h-[48px] mx-auto bg-[#D35400] clip-path-supplier
                     hover:bg-[#39482C] transition-colors"
        >
          <span
            className="flex items-center justify-center h-full w-full
                       font-orbitron font-bold text-[16px] uppercase text-white"
          >
            Continue
          </span>
        </button>


      </div>
    </section>
  );
}
