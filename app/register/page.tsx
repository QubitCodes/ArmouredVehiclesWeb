"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerConsumer } from "@/app/services/auth";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.email || !form.name || !form.password) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await registerConsumer(form);
      const { user, accessToken, refreshToken, expiresIn } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("expiresIn", expiresIn.toString());

      router.push("/verify-email");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Unexpected client error";

      console.error("REGISTER ERROR:", msg);
      alert(msg);
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
            Create Your Customer Account
          </h2>

          <p className="text-sm text-gray-700 mb-6">
            Enter your details to get started
          </p>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="w-full mb-3 px-4 py-3 border border-[#D6CFC2] bg-transparent text-sm text-black focus:outline-none"
          />

          <input
            type="text"
            name="name"
            placeholder="Enter Your Username"
            onChange={handleChange}
            className="w-full mb-3 px-4 py-3 border border-[#D6CFC2] bg-transparent text-sm text-black focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Create Password"
            onChange={handleChange}
            className="w-full mb-5 px-4 py-3 border border-[#D6CFC2] bg-transparent text-sm text-black focus:outline-none"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-[52px] bg-[#D35400] text-white font-black text-[16px] clip-path-supplier hover:bg-[#39482C] transition-colors uppercase"
          >
            {loading ? "Creating..." : "Continue"}
          </button>

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
