"use client";

import { registerSeller } from "@/app/services/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SellerRegisterPage() {
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
  
        const res = await registerSeller(form);
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
    <section className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/register-bg.jpg')",
        }}
      />

      {/* Light overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center px-6 lg:px-20">
        {/* Card */}
        <div className="w-full max-w-md bg-[#F4EFE6] p-8 shadow-lg">
          {/* Title */}
          <h1 className="text-2xl font-orbitron font-bold uppercase leading-tight text-black text-center">
            Create Your <br /> Supplier Account
          </h1>

          <p className="mt-2 text-sm text-gray-700 text-center">
            Enter your details to get started
          </p>

          {/* Form */}
          <form className="mt-6 space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full border border-[#C7B88A] bg-[#EFE8DC]
                         px-4 py-2 text-sm text-black
                         placeholder:text-gray-500
                         focus:outline-none focus:border-black"
            />

            <input
              type="text"
              name="name"
              placeholder="Enter Your Username"
              onChange={handleChange}
              className="w-full border border-[#C7B88A] bg-[#EFE8DC]
                         px-4 py-2 text-sm text-black
                         placeholder:text-gray-500
                         focus:outline-none focus:border-black"
            />

            <input
              type="password"
              name="password"
              placeholder="Enter Your Password"
              onChange={handleChange}
              className="w-full border border-[#C7B88A] bg-[#EFE8DC]
                         px-4 py-2 text-sm text-black
                         placeholder:text-gray-500
                         focus:outline-none focus:border-black"
            />
            {/* Continue Button */}
            <button
              type="button"
            onClick={handleSubmit}
              className="relative w-full bg-[#D35400] py-3
                         text-sm font-semibold uppercase text-white
                         hover:bg-[#b94700] transition"
            >
              Continue
            </button>
          </form>

          {/* Login link */}
          <p className="mt-4 text-xs text-gray-700">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#D35400] hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
