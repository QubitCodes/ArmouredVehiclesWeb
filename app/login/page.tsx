"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginConsumer } from "../services/auth";


export default function LoginPage() {


    const router = useRouter();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
  


    const isEmail = (value: string) => {
        return value.includes("@");
    };

    const isPhone = (value: string) => {
        return /^[+0-9\s]+$/.test(value);
    };

    const handleContinue = async () => {
        if (!identifier.trim()) {
            alert("Please enter email or phone number");
            return;
        }

        if (!password.trim()) {
            alert("Please enter your password");
            return;
        }

        const loginData: { identifier: string; password: string } = {
            identifier: identifier.trim(),
            password: password.trim(),
        };

        // Proceed with login
       const res = await loginConsumer(loginData);
           const { user, accessToken, refreshToken, expiresIn } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("expiresIn", expiresIn.toString());
      router.push('/')
    //   if (isEmail(identifier)) {
    //         router.push("/verify-email");
    //     } else if (isPhone(identifier)) {
    //         router.push("/verify-phone");
    //     } else {
    //         alert("Enter a valid email or phone number");
    //     }
    };


    return (
        <>
            {/* HERO SECTION */}
            <section className="relative w-full min-h-[calc(100vh-140px)] bg-[#EFE8DC]">
                {/* Background Image */}
                <Image
                    src="/images/register-bg.jpg" // same image as register
                    alt="Login Background"
                    fill
                    priority
                    className="object-cover"
                />

                {/* Light overlay */}
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 max-w-[1720px] mx-auto px-6 lg:px-[140px] flex items-center min-h-[calc(100vh-140px)]">

                    {/* Login Card */}
                    <div className="bg-[#F0EBE3] w-full max-w-[420px] p-8 shadow-md text-center pointer-events-auto">
                        <h2
                            className="text-[22px] font-bold mb-2 uppercase text-black"
                            style={{ fontFamily: "Orbitron" }}
                        >
                            Welcome Back
                        </h2>

                        <p className="text-sm text-gray-700 mb-6">
                            Login to your account below.
                            <br />
                            New around here?{" "}
                            <Link href="/register" className="text-[#D35400] font-semibold">
                                Create an account
                            </Link>
                        </p>

                        {/* Email or Phone */}
                        <input
                            type="text"
                            placeholder="Please Enter Email or Mobile Number"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full mb-3 px-4 py-3 border border-[#C7B88A] bg-transparent text-sm text-black placeholder:text-[#9D9A95] focus:outline-none"
                        />

                        {/* Password */}
                        <input
                            type="password"
                            placeholder="Please Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mb-3 px-4 py-3 border border-[#C7B88A] bg-transparent text-sm text-black placeholder:text-[#9D9A95] focus:outline-none"
                        />


                        {/* Privacy Policy Confirmation */}
                        <div className="flex items-start gap-2 text-xs text-gray-700 mb-5 text-center">
                            <p>
                                By continuing, I confirm that I have read the{" "}
                                <Link
                                    href="/privacy-policy"
                                    className="text-[#D35400] font-semibold hover:underline"
                                >
                                    Privacy Policy
                                </Link>
                                .
                            </p>
                        </div>

                        {/* Sign In Button */}
                        <button
                            onClick={handleContinue}
                            className="w-full h-[52px] bg-[#D35400] text-white font-black font-orbitron clip-path-supplier text-[16px] hover:bg-[#39482C] transition-colors uppercase"
                        >
                            Continue
                        </button>

                    </div>
                </div>

            </section>
        </>
    );
}
