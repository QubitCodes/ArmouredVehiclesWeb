"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useAuth } from "@/lib/auth-context";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"; // Use Firebase Hook
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

export default function AddPhonePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  // Firebase Hook
  const { linkPhone, verifyPhoneLink, loading: firebaseLoading } = useFirebaseAuth();

  // State
  const [stage, setStage] = useState<"input" | "verify">("input");
  const [phone, setPhoneInput] = useState("");
  const [countryCode, setCountryCode] = useState("971");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  // Missing Data Recovery
  const [missingData, setMissingData] = useState({ name: "", username: "" });
  const [needsRecovery, setNeedsRecovery] = useState(false);

  const inputsRef = useRef<HTMLInputElement[]>([]);
  const loadingState = loading || firebaseLoading;

  // Init Recovery Data from LocalStorage if redirect came from Register
  useEffect(() => {
    const savedForm = localStorage.getItem('reg_form');
    if (savedForm) {
      const parsed = JSON.parse(savedForm);
      setMissingData({ name: parsed.name, username: parsed.username });
      // If we have data, we assume we might need it, but let's check `user` context too
    }
  }, []);

  // Only check needsRecovery when stage matches or on init
  useEffect(() => {
    // If we are missing Name/Username, we cannot proceed with creating the user.
    // Since we hid the inputs, we must redirect back to Register to restart/recover.
    if (user && (!user.name || !(user as any).username) && !missingData.name) {
      toast.error("Session incomplete. Please start registration again.");
      router.push('/register');
    } else if (!user && !missingData.name) {
      // No user, no data -> redirect
      // router.push('/register'); // Actually, let's wait a bit or check if loading?
    }
  }, [user, missingData, router]);


  // --- Handlers ---

  const handleSendOtp = async () => {
    if (!phone) {
      toast.error("Please enter a phone number");
      return;
    }

    // Check if missing data is filled
    if (needsRecovery && (!missingData.name || !missingData.username)) {
      toast.error("Please provide your Name and Username");
      return;
    }

    try {
      setLoading(true);

      // Clean Phone
      const dialCode = countryCode.replace('+', '');
      let fullPhone = phone.replace('+', '');
      // If phone input includes country code at start, strip it to get local
      let localPhone = fullPhone;
      if (dialCode && fullPhone.startsWith(dialCode)) {
        localPhone = fullPhone.substring(dialCode.length);
      }
      localPhone = localPhone.replace(/^0+/, ''); // clean leading zeros

      // Construct E.164 for Firebase
      const phoneToUse = `+${dialCode}${localPhone}`;

      // Check existence
      const { exists } = await api.auth.checkUser(phoneToUse);
      if (exists) {
        toast.error("Phone already registered. Please login.");
        setLoading(false);
        return;
      }

      // Send OTP
      const res = await linkPhone(phoneToUse, 'recaptcha-container');
      setConfirmationResult(res);
      setTimer(60);
      setStage("verify");
      toast.success("OTP Sent!");

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Enter complete code");
      return;
    }

    if (!confirmationResult) {
      toast.error("Session expired. Please resend OTP.");
      setStage("input");
      return;
    }

    try {
      setLoading(true);
      // Verify & Link
      const userCred = await verifyPhoneLink(confirmationResult, code);
      const idToken = await userCred.user.getIdToken();

      // Prepare final payload
      const dialCode = countryCode.replace('+', '');
      let fullPhone = phone.replace('+', '');
      let localPhone = fullPhone;
      if (dialCode && fullPhone.startsWith(dialCode)) {
        localPhone = fullPhone.substring(dialCode.length);
      }
      localPhone = localPhone.replace(/^0+/, '');

      // Complete Registration on Backend
      const res = await api.auth.registerFirebase({
        idToken,
        name: missingData.name || user?.name || "User",
        username: missingData.username || (user as any)?.username || "User",
        userType: 'customer',
        phone: localPhone,
        countryCode: `+${dialCode}`
      });

      toast.success("Account created successfully!");
      await refreshUser();

      // Clear temp
      localStorage.removeItem('reg_form');

      router.push('/buyer-onboarding');

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };


  // --- OTP Input Helpers ---
  const handleOtpChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "Enter") handleVerify();
  };

  // Timer
  useEffect(() => {
    if (timer > 0) {
      const t = setInterval(() => setTimer(s => s - 1), 1000);
      return () => clearInterval(t);
    }
  }, [timer]);


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

        {stage === 'input' && (
          <>
            {/* Heading */}
            <h2 className="text-[22px] font-bold uppercase mb-2" style={{ fontFamily: "Orbitron" }}>
              Add Your Phone Number
            </h2>

            <p className="text-sm text-gray-700 mb-6">
              We'll text a security code to your mobile phone to finish setting up your account.
            </p>

            {/* Missing Data Inputs Removed as per User Request - will handle via redirect if needed */}


            {/* Phone Input */}
            <div className="mb-6">
              {/* Recaptcha */}
              <div id="recaptcha-container"></div>

              <PhoneInput
                country={'ae'}
                value={phone}
                onChange={(value, data: any) => {
                  setPhoneInput(value);
                  setCountryCode(data.dialCode);
                }}
                inputProps={{
                  onKeyDown: (e: any) => {
                    if (e.key === 'Enter' && !loadingState) {
                      e.preventDefault();
                      handleSendOtp();
                    }
                  }
                }}
                enableSearch={true}
                disableSearchIcon={true}
                searchPlaceholder="Search Country..."
                containerClass="mb-5"
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
                  borderRight: '1px solid #C7B88A',
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

            <p className="text-xs text-gray-600 mb-6">
              By selecting Continue, you agree to receive a text message with a security code.
            </p>

            <button
              onClick={handleSendOtp}
              disabled={loadingState}
              className="w-[250px] h-[48px] mx-auto bg-[#D35400] clip-path-supplier hover:bg-[#39482C] transition-colors disabled:opacity-50"
            >
              <span className="flex items-center justify-center h-full w-full font-orbitron font-bold text-[16px] uppercase text-white">
                {loadingState ? "Sending..." : "Continue"}
              </span>
            </button>
          </>
        )}

        {stage === 'verify' && (
          <>
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setStage('input')} className="p-1 rounded hover:bg-[#E6E0D6]">
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-[22px] font-bold uppercase" style={{ fontFamily: "Orbitron" }}>
                Enter Security Code
              </h2>
            </div>

            <p className="text-sm text-gray-700 mb-6">
              We sent a security code to your phone.
            </p>

            {/* OTP boxes */}
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { if (el) inputsRef.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="w-[52px] h-[56px] text-center border border-[#C7B88A] bg-transparent text-lg focus:outline-none"
                />
              ))}
            </div>

            {/* Timer */}
            <p className="text-xs text-center mb-4 min-h-[20px]">
              {timer > 0 ? (
                <span className="text-gray-600">Resend code in <span className="font-semibold">{timer}</span>s</span>
              ) : (
                <button onClick={handleSendOtp} className="text-[#D35400] font-semibold hover:underline">
                  Resend Code
                </button>
              )}
            </p>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={loadingState}
              className="w-full h-[52px] bg-[#D35400] text-white font-black text-[16px] clip-path-supplier hover:bg-[#39482C] transition-colors uppercase disabled:opacity-50 mb-4"
            >
              {loadingState ? "Verifying..." : "Verify & Continue"}
            </button>
          </>
        )}

      </div>
    </section>
  );
}
