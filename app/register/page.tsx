"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  // Firebase Hook
  const { sendMagicLink, verifyMagicLink, isMagicLink, loading: firebaseLoading } = useFirebaseAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    countryCode: "971",
  });

  // Stages: start -> magic_link_sent
  const [stage, setStage] = useState<"start" | "magic_link_sent">("start");

  const [loading, setLoading] = useState(false);
  const loadingState = loading || firebaseLoading;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showError = (msg: string) => {
    toast.error(msg, {
      style: { background: '#EF4444', color: 'white', border: 'none' }
    });
  };

  // 1. Handle Magic Link Return
  useEffect(() => {
    const checkMagicLink = async () => {
      if (isMagicLink(window.location.href)) {
        setLoading(true);
        try {
          // Retrieve email
          // 1. Try URL Query Params (Robust cross-device)
          const urlParams = new URLSearchParams(window.location.search);
          let email = urlParams.get('email');

          // 2. Try LocalStorage (Firebase default)
          if (!email) {
            email = window.localStorage.getItem('emailForSignIn');
          }

          // 3. Try Saved Form (Fallback)
          if (!email) {
            const savedForm = localStorage.getItem('reg_form');
            if (savedForm) {
              try {
                const parsed = JSON.parse(savedForm);
                if (parsed.email) {
                  email = parsed.email;
                  console.log("Recovered email from reg_form");
                }
              } catch (e) { console.error("Failed to parse reg_form"); }
            }
          }

          if (!email) {
            email = window.prompt("Please enter your email to confirm registration");
          }

          if (!email) {
            showError("Email required to verify.");
            setLoading(false);
            return;
          }

          await verifyMagicLink(email);

          // User is now signed in with Email.
          // Save form data for recovery in next step
          // const savedForm = localStorage.getItem('reg_form');

          // Redirect to Phone Linking Step
          toast.success("Email Verified! Redirecting to add phone...");
          router.push('/add-phone');

        } catch (err: any) {
          showError(err.message || "Failed to verify email link");
          setLoading(false);
        }
      }
    };

    checkMagicLink();
  }, []);

  // 2. Start Registration (Send Magic Link)
  const handleStart = async () => {
    if (!form.email || !form.name || !form.username) {
      showError("Name, username and email are required");
      return;
    }
    try {
      setLoading(true);

      // Check if user exists first
      const { exists } = await api.auth.checkUser(form.email);
      if (exists) {
        showError("User with this email already exists. Please login.");
        return;
      }

      // Save form for recovery
      localStorage.setItem('reg_form', JSON.stringify(form));

      // Send Magic Link
      await sendMagicLink(form.email);
      setStage('magic_link_sent');

    } catch (err: any) {
      showError(err.message || "Failed to start registration");
    } finally {
      setLoading(false);
    }
  };

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
            Create Your <br /> Customer Account
          </h2>

          <p className="text-sm text-gray-700 mb-6">
            {stage === 'start' && 'Enter your details to get started'}
            {stage === 'magic_link_sent' && 'Please check your email'}
          </p>

          {stage === 'start' && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full mb-3 px-4 py-3 border border-[#D6CFC2] bg-transparent text-sm text-black focus:outline-none"
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="w-full mb-3 px-4 py-3 border border-[#D6CFC2] bg-transparent text-sm text-black focus:outline-none"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full mb-5 px-4 py-3 border border-[#D6CFC2] bg-transparent text-sm text-black focus:outline-none"
              />
              <button
                onClick={handleStart}
                disabled={loadingState}
                className="w-full h-[52px] bg-[#D35400] text-white font-black text-[16px] clip-path-supplier hover:bg-[#39482C] transition-colors uppercase"
              >
                {loadingState ? "Processing..." : "Continue"}
              </button>
            </>
          )}

          {stage === 'magic_link_sent' && (
            <div className="mb-5 p-4 bg-white/50 rounded text-sm text-gray-800">
              <p className="font-bold mb-2">Check your inbox!</p>
              <p>We sent a verification link to:</p>
              <p className="font-mono my-2">{form.email}</p>
              <p>Click the link to verify your email and continue registration.</p>
              <p className="text-xs text-gray-500 mt-4">
                Can't find it? Check spam or <button onClick={handleStart} className="text-blue-600 underline">resend</button>.
              </p>
            </div>
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
