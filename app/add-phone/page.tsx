"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
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

      // Prepare split phone number
      // countryCode is set by onChange (e.g. "971")
      let dialCode = countryCode ? countryCode.replace('+', '') : '';
      let fullPhone = phone.replace('+', ''); // phone state contains full digits now
      let localPhone = fullPhone;

      // Remove dial code from start of phone if present
      if (dialCode && fullPhone.startsWith(dialCode)) {
        localPhone = fullPhone.substring(dialCode.length);
      }
      localPhone = localPhone.replace(/^0+/, ''); // clean leading zeros

      await setPhone({
        userId: user?.id || '',
        phone: localPhone,
        countryCode: dialCode ? `+${dialCode}` : '+971'
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
        <div className="mb-6">
          <PhoneInput
            country={'ae'}
            value={phone}
            onChange={(value, data: any) => {
              setPhoneInput(value);
              setCountryCode(data.dialCode);
            }}
            enableSearch={true}
            disableSearchIcon={true}
            searchPlaceholder="Search Country..."
            searchStyle={{
              width: '94%',
              height: '36px',
              margin: '4px auto',
              backgroundColor: '#F0EBE3',
              border: '1px solid #C7B88A',
              borderRadius: '2px',
              padding: '8px',
              color: 'black'
            }}
            inputStyle={{
              width: '100%',
              height: '50px',
              backgroundColor: 'transparent',
              border: '1px solid #C7B88A',
              fontFamily: 'inherit',
              color: '#000000',
              paddingLeft: '65px',
              borderRadius: '0px'
            }}
            buttonStyle={{
              border: '1px solid #C7B88A',
              borderRight: '1px solid #C7B88A', // Ensure separator visible
              backgroundColor: '#EBE3D6',
              justifyContent: 'flex-start',
              padding: '8px',
              borderRadius: '0px'
            }}
            dropdownStyle={{
              backgroundColor: '#F0EBE3',
              color: 'black',
              width: '300px'
            }}
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
