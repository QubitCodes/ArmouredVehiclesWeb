"use client";

import Image from "next/image";
import Link from "next/link";

export default function DeleteAccountSuccessPage() {
  return (
    <main className="min-h-screen bg-[#F0EBE3] flex items-center justify-center p-4">
      {/* Success Content */}
      <div className="flex flex-col items-center justify-center text-center py-16 lg:py-24">
        {/* Success Illustration */}
        <div className="mb-8">
          <Image
            src="/order/deleteaccount.svg"
            alt="Account Deleted"
            width={180}
            height={160}
            className="mx-auto"
          />
        </div>

        {/* Title */}
        <h1 className="font-orbitron font-black text-xl lg:text-2xl uppercase tracking-wide text-black mb-3">
        Account Required
                </h1>

        {/* Subtitle */}
        <p className="font-inter text-sm lg:text-base text-[#666] max-w-md mb-8">
        Please sign in or create an account to access this content.        </p>

        {/* Back to Home Button */}
        <Link href="/">
          <button className="bg-[#D35400] hover:bg-[#39482C] text-white clip-path-supplier-refund flex items-center justify-center h-[45px] px-[40px] cursor-pointer transition-colors">
            <span className="font-black text-[16px] font-orbitron uppercase">Login</span>
          </button>
        </Link>
      </div>
    </main>
  );
}

