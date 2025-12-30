"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { loginSeller } from "@/app/services/auth";

export default function SellerLoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    setLoading(true);

    const res = await loginSeller({
      email,
      password,
    });

    const { user, accessToken, refreshToken, expiresIn } = res.data;

    // Store tokens (same pattern as consumer)
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("expiresIn", expiresIn.toString());
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem(
      "token_expiry",
      String(Date.now() + expiresIn * 1000)
    );

    await refreshUser();
    router.push("/seller/dashboard");
  } catch (err: any) {
    alert(
      err?.response?.data?.message ||
        err?.message ||
        "Seller login failed"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <section className="relative w-full min-h-[calc(100vh-140px)] bg-[#EFE8DC]">
      {/* Background Image */}
      <Image
        src="/images/register-bg.jpg"
        alt="Seller Login Background"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-[1720px] mx-auto px-6 lg:px-[140px] flex items-center min-h-[calc(100vh-140px)]">
        <div className="bg-[#F0EBE3] w-full max-w-[420px] p-8 shadow-md text-center">
          <h2
            className="text-[22px] font-bold mb-2 uppercase text-black"
            style={{ fontFamily: "Orbitron" }}
          >
            Seller Login
          </h2>

          <p className="text-sm text-gray-700 mb-6">
            Access your supplier dashboard.
            <br />
            New seller?{" "}
            <Link
              href="/seller/register"
              className="text-[#D35400] font-semibold"
            >
              Apply here
            </Link>
          </p>

          {/* Email */}
          <input
            type="email"
            placeholder="Business Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 px-4 py-3 border border-[#C7B88A] bg-transparent text-sm text-black placeholder:text-[#9D9A95] focus:outline-none"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-4 py-3 border border-[#C7B88A] bg-transparent text-sm text-black placeholder:text-[#9D9A95] focus:outline-none"
          />

          {/* Privacy */}
          <div className="text-xs text-gray-700 mb-5">
            By continuing, you agree to our{" "}
            <Link
              href="/terms-of-use"
              className="text-[#D35400] font-semibold hover:underline"
            >
              Terms of Use
            </Link>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-[52px] bg-[#39482C] text-white font-black font-orbitron clip-path-supplier text-[16px] hover:bg-[#D35400] transition-colors uppercase disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login as Seller"}
          </button>
        </div>
      </div>
    </section>
  );
}
