"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startOtpRegister, verifyEmailOtp, setPhone, verifyPhoneOtp, resendPhoneOtp } from "@/app/services/auth";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useRef, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    countryCode: "+971",
  });
  const [stage, setStage] = useState<"start" | "verify_email" | "set_phone" | "verify_phone">("start");
  const [userId, setUserId] = useState<string>("");
  const [emailOtp, setEmailOtp] = useState<string[]>(Array(6).fill(""));
  const [phoneOtp, setPhoneOtp] = useState<string[]>(Array(6).fill(""));
  const emailRefs = useRef<HTMLInputElement[]>([]);
  const phoneRefs = useRef<HTMLInputElement[]>([]);
  const [debugOtp, setDebugOtp] = useState<string>("");
  const [phoneResendTimer, setPhoneResendTimer] = useState<number>(0);

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Start registration: send email OTP
  const handleStart = async () => {
    if (!form.email || !form.name || !form.username) {
      alert("Name, username and email are required");
      return;
    }
    try {
      setLoading(true);
      const res = await startOtpRegister({
        email: form.email.trim(),
        username: form.username.trim(),
        name: form.name.trim(),
        userType: 'customer',
      });
      const data = res.data;
      setUserId(data.userId);
      setDebugOtp(data.debugOtp || "");
      setStage("verify_email");
      // Focus first OTP box
      setTimeout(() => emailRefs.current[0]?.focus(), 0);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to start OTP registration";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailOtpChange = (index: number, value: string) => {
    const val = value.replace(/[^0-9]/g, "").slice(0, 1);
    const updated = [...emailOtp];
    updated[index] = val;
    setEmailOtp(updated);
    if (val && index < emailOtp.length - 1) emailRefs.current[index + 1]?.focus();
  };

  const handleEmailOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (emailOtp[index]) {
        const updated = [...emailOtp];
        updated[index] = "";
        setEmailOtp(updated);
        return;
      }
      if (index > 0) emailRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) emailRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < emailOtp.length - 1) emailRefs.current[index + 1]?.focus();
    if (e.key === "Enter") handleVerifyEmail();
  };

  const handleVerifyEmail = async () => {
    const code = emailOtp.join("");
    if (code.length !== 6) {
      alert("Please enter the 6-digit email OTP");
      return;
    }
    try {
      setLoading(true);
      const res = await verifyEmailOtp({ userId, email: form.email.trim(), code });
      const data = res.data;
      // if (data.nextStep === 'phone_number') {
        setStage('set_phone');
      // } else {
      //   alert('Unexpected next step: ' + data.nextStep);
      // }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to verify email";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPhone = async () => {
    if (!form.phone || !form.countryCode) {
      alert("Please enter phone and country code");
      return;
    }
    try {
      setLoading(true);
      const res = await setPhone({ userId, phone: form.phone.trim(), countryCode: form.countryCode.trim() });
      const data = res.data as { debugOtp?: string; expiresIn?: number };
      setStage('verify_phone');
      setTimeout(() => phoneRefs.current[0]?.focus(), 0);
      // Show debug OTP from set-phone API (dev only) and start countdown if provided
      setDebugOtp(data?.debugOtp || "");
      setPhoneResendTimer(typeof data?.expiresIn === 'number' ? data.expiresIn : 0);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to set phone";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneOtpChange = (index: number, value: string) => {
    const val = value.replace(/[^0-9]/g, "").slice(0, 1);
    const updated = [...phoneOtp];
    updated[index] = val;
    setPhoneOtp(updated);
    if (val && index < phoneOtp.length - 1) phoneRefs.current[index + 1]?.focus();
  };

  const handlePhoneOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (phoneOtp[index]) {
        const updated = [...phoneOtp];
        updated[index] = "";
        setPhoneOtp(updated);
        return;
      }
      if (index > 0) phoneRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) phoneRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < phoneOtp.length - 1) phoneRefs.current[index + 1]?.focus();
    if (e.key === "Enter") handleVerifyPhone();
  };

  const handleVerifyPhone = async () => {
    const code = phoneOtp.join("");
    if (code.length !== 6) {
      alert("Please enter the 6-digit phone OTP");
      return;
    }
    try {
      setLoading(true);
      // Compose E.164-like phone for verify: +<countryCode><number>
      const fullPhone = `${form.countryCode.trim()}${form.phone.trim()}`.replace(/\s+/g, "");
      const res = await verifyPhoneOtp({ userId, phone: fullPhone, code });
      const { user, accessToken, refreshToken, expiresIn } = res.data;
      const ttl = typeof expiresIn === 'number' ? expiresIn : 3600; // fallback 1h
      // Store tokens using both conventions
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("expiresIn", String(ttl));
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("token_expiry", String(Date.now() + ttl * 1000));
      await refreshUser();
      router.push('/create-account');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to verify phone";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // Resend Phone OTP
  const handleResendPhone = async () => {
    if (!userId || !form.phone) return;
    try {
      setLoading(true);
      const res = await resendPhoneOtp({ userId, phone: form.phone.trim() });
      const data = res.data;
      setDebugOtp(data.debugOtp || "");
      setPhoneResendTimer(typeof data.expiresIn === 'number' ? data.expiresIn : 60);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to resend OTP";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // Countdown for resend availability
  useEffect(() => {
    if (phoneResendTimer <= 0) return;
    const t = setInterval(() => setPhoneResendTimer((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [phoneResendTimer]);

  return (
    <section className="relative w-full min-h-[calc(100vh-140px)] bg-[#EFE8DC]">
      <Image
        src="/images/register-bg.jpg"
        alt="Register Background"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 max-w-[1720px] mx-auto px-6 lg:px-[140px] flex items-center min-h-[calc(100vh-140px)]">
        <div className="bg-[#F3EDE3] w-full max-w-[420px] p-8 shadow-md text-center">
          <h2 className="text-[22px] font-bold mb-2 uppercase text-black font-orbitron">
            Create Your Customer Account
          </h2>

          <p className="text-sm text-gray-700 mb-6">
            {stage === 'start' && 'Enter your details to get started'}
            {stage === 'verify_email' && `Enter the OTP sent to ${form.email}`}
            {stage === 'set_phone' && 'Add your phone number'}
            {stage === 'verify_phone' && `Enter the OTP sent to ${form.phone}`}
          </p>

          {stage === 'start' && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                className="w-full mb-3 px-4 py-3 border border-[#D6CFC2] bg-transparent text-sm text-black focus:outline-none"
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                className="w-full mb-3 px-4 py-3 border border-[#D6CFC2] bg-transparent text-sm text-black focus:outline-none"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleChange}
                className="w-full mb-5 px-4 py-3 border border-[#D6CFC2] bg-transparent text-sm text-black focus:outline-none"
              />
            </>
          )}

          {stage === 'verify_email' && (
            <div className="mb-5">
              <div className="flex gap-2 justify-center mb-2">
                {emailOtp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleEmailOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleEmailOtpKeyDown(index, e)}
                    ref={(el) => { if (el) emailRefs.current[index] = el; }}
                    className="w-10 h-12 text-center border border-[#C7B88A] bg-transparent text-sm text-black focus:outline-none"
                  />
                ))}
              </div>
              {debugOtp && (
                <p className="text-xs text-gray-600 text-center">Debug OTP: {debugOtp}</p>
              )}
            </div>
          )}

          {stage === 'set_phone' && (
            <>
              <input
                type="text"
                name="countryCode"
                placeholder="Country Code (e.g. +971)"
                value={form.countryCode}
                onChange={handleChange}
                className="w-full mb-3 px-4 py-3 border border-[#D6CFC2] bg-transparent text-sm text-black focus:outline-none"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
                className="w-full mb-5 px-4 py-3 border border-[#D6CFC2] bg-transparent text-sm text-black focus:outline-none"
              />
            </>
          )}

          {stage === 'verify_phone' && (
            <div className="mb-5">
              <div className="flex gap-2 justify-center mb-2">
                {phoneOtp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePhoneOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handlePhoneOtpKeyDown(index, e)}
                    ref={(el) => { if (el) phoneRefs.current[index] = el; }}
                    className="w-10 h-12 text-center border border-[#C7B88A] bg-transparent text-sm text-black focus:outline-none"
                  />
                ))}
              </div>
              <div className="flex items-center justify-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={handleResendPhone}
                  disabled={loading || phoneResendTimer > 0}
                  className="text-sm font-semibold text-[#D35400] disabled:text-gray-400"
                >
                  {phoneResendTimer > 0 ? `Resend in ${phoneResendTimer}s` : 'Resend OTP'}
                </button>
              </div>
              {debugOtp && (
                <p className="text-xs text-gray-600 text-center mt-1">Debug OTP: {debugOtp}</p>
              )}
            </div>
          )}

          {stage === 'start' && (
            <button
              onClick={handleStart}
              disabled={loading}
              className="w-full h-[52px] bg-[#D35400] text-white font-black text-[16px] clip-path-supplier hover:bg-[#39482C] transition-colors uppercase"
            >
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          )}

          {stage === 'verify_email' && (
            <button
              onClick={handleVerifyEmail}
              disabled={loading}
              className="w-full h-[52px] bg-[#D35400] text-white font-black text-[16px] clip-path-supplier hover:bg-[#39482C] transition-colors uppercase"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          )}

          {stage === 'set_phone' && (
            <button
              onClick={handleSetPhone}
              disabled={loading}
              className="w-full h-[52px] bg-[#D35400] text-white font-black text-[16px] clip-path-supplier hover:bg-[#39482C] transition-colors uppercase"
            >
              {loading ? "Submitting..." : "Continue"}
            </button>
          )}

          {stage === 'verify_phone' && (
            <button
              onClick={handleVerifyPhone}
              disabled={loading}
              className="w-full h-[52px] bg-[#D35400] text-white font-black text-[16px] clip-path-supplier hover:bg-[#39482C] transition-colors uppercase"
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>
          )}

          <p className="text-xs mt-4 text-gray-700">
            Already have an account?{" "}
            <Link href="/login" className="text-[#D35400] font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
