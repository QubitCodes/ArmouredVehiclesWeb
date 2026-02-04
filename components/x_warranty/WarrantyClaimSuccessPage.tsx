"use client";

import Image from "next/image";
import Link from "next/link";

export default function WarrantyClaimSuccessPage() {
  return (
    <main className="flex-1">
      {/* Success Content */}
      <div className="flex flex-col items-center justify-center text-center py-16 lg:py-24">
        {/* Success Illustration */}
        <div className="mb-8">
          <Image
            src="/order/successclaim.svg"
            alt="Claim Submitted Successfully"
            width={180}
            height={160}
            className="mx-auto"
          />
        </div>

        {/* Title */}
        <h1 className="font-orbitron font-black text-xl lg:text-2xl uppercase tracking-wide text-black mb-3">
          Claim Request Submitted Successfully
        </h1>

        {/* Subtitle */}
        <p className="font-inter text-sm lg:text-base text-[#666] max-w-md mb-8">
          We&apos;ve received your claim and will contact you soon with the next steps.
        </p>

        {/* Back to Claims Button */}
        <Link href="/warranty-claims">
          <button className="bg-[#D35400] hover:bg-[#39482C] text-white clip-path-supplier-refund flex items-center justify-center h-[45px] px-[40px] cursor-pointer transition-colors">
            <span className="font-black text-[16px] font-orbitron uppercase">Back to Claims</span>
          </button>
        </Link>
      </div>
    </main>
  );
}

