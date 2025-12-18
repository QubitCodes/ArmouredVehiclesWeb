"use client";

import Link from "next/link";

export default function SellerRegisterPage() {
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
              placeholder="Email Address"
              className="w-full border border-[#C7B88A] bg-[#EFE8DC]
                         px-4 py-2 text-sm
                         placeholder:text-gray-500
                         focus:outline-none focus:border-black"
            />

            <input
              type="text"
              placeholder="Enter Your Username"
              className="w-full border border-[#C7B88A] bg-[#EFE8DC]
                         px-4 py-2 text-sm
                         placeholder:text-gray-500
                         focus:outline-none focus:border-black"
            />

            {/* Continue Button */}
            <button
              type="button"
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
