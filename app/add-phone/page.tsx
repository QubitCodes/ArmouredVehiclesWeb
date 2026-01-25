"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { setPhone } from "@/app/services/auth";
import { toast } from "sonner";

export default function AddPhonePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [phone, setPhoneInput] = useState("");
  const [countryCode, setCountryCode] = useState("+971"); // Default
  const [loading, setLoading] = useState(false);

  // Import Dynamically to avoid SSR issues with PhoneInput if needed, 
  // but page is client component so standard import is fine usually.
  // However, recreating the UI from the original snippet:

  const handleContinue = async () => {
    if (!phone) {
      toast.error("Please enter a phone number");
      return;
    }

    try {
      setLoading(true);
      const fullPhone = phone.replace(/^0+/, ''); // clean leading zeros

      await setPhone({
        userId: user?.id || '',
        phone: fullPhone,
        countryCode: countryCode
      });

      toast.success("OTP Sent!");
      await refreshUser(); // Update user context so phone number is locally available
      router.push("/verify-phone");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add phone");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex items-center border border-[#C7B88A] bg-transparent mb-3 h-[50px]">

          {/* Country - simplified for now, can use react-phone-input-2 if needed but keeping styling consistent */}
          <div className="flex items-center gap-2 px-3 border-r border-[#C7B88A] h-full bg-[#EBE3D6]">
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
            value={phone}
            onChange={(e) => setPhoneInput(e.target.value.replace(/[^0-9]/g, ""))}
            className="flex-1 px-4 py-3 bg-transparent text-sm text-black 
                       placeholder:text-[#9D9A95] focus:outline-none h-full"
          />
        </div>

        {/* Info text */}
        <p className="text-xs text-gray-600 mb-6">
          By selecting Continue, you agree to receive a text message with a
          security code. Standard rates may apply.
        </p>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-[250px] h-[48px] mx-auto bg-[#D35400] clip-path-supplier
                     hover:bg-[#39482C] transition-colors disabled:opacity-50"
        >
          <span
            className="flex items-center justify-center h-full w-full
                       font-orbitron font-bold text-[16px] uppercase text-white"
          >
            {loading ? "Sending..." : "Continue"}
          </span>
        </button>


      </div>
    </section>
  );
}
