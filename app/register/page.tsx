"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const handleContinue = () => {
    // later you can validate email/username here
    router.push("/verify-email");
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[calc(100vh-140px)] bg-[#EFE8DC]">

        {/* Background Image */}
        <Image
          src="/images/register-bg.jpg"
          alt="Register Background"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Content */}
        <div className="relative z-10 max-w-[1720px] mx-auto px-6 lg:px-[140px] flex items-center min-h-[calc(100vh-140px)]">
          
          {/* Register Card */}
          <div className="bg-[#F3EDE3] w-full max-w-[420px] p-8 shadow-md text-center">
            
            <h2
              className="text-[22px] font-bold mb-2 uppercase text-black"
              style={{ fontFamily: "Orbitron" }}
            >
              Create Your Customer Account
            </h2>

            <p className="text-sm text-gray-700 mb-6">
              Enter your details to get started
            </p>

            {/* Email */}
            <input
              type="email"
              placeholder="Email Address"
              className="w-full mb-3 px-4 py-3 border border-[#D6CFC2] bg-transparent text-sm text-black focus:outline-none"
            />

            {/* Username */}
            <input
              type="text"
              placeholder="Enter Your Username"
              className="w-full mb-5 px-4 py-3 border border-[#D6CFC2] bg-transparent text-sm text-black focus:outline-none"
            />

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full h-[52px] bg-[#D35400] text-white font-black text-[16px] clip-path-supplier hover:bg-[#39482C] transition-colors uppercase"
            >
              Continue
            </button>

            {/* Login Link */}
            <p className="text-xs mt-4 text-gray-700">
              Already have an account?{" "}
              <Link href="/login" className="text-[#D35400] font-semibold">
                Login
              </Link>
            </p>

          </div>
        </div>
      </section>
    </>
  );
}
