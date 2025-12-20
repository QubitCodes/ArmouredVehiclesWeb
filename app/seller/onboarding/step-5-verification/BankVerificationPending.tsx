"use client";

import Image from "next/image";



export default function BankVerificationPending({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="font-orbitron font-bold text-black mb-6 text-[26px]">
        BANK ACCOUNT VERIFICATION PENDING
      </h1>

      <div className=" bg-[#DAD4C5] px-6 py-5 text-sm mb-10">
        <div className="flex items-start gap-3">
<Image
  src="/icons/infoorange.svg"
  alt="Info"
  width={14}
  height={14}
  className="mt-[2px]"
/>

          <div>
            <p className="font-semibold mb-1 text-black">
              Bank Account Verification Pending
            </p>

            <p className="text-[#6B6B6B] text-xs leading-relaxed">
              The financial institution you selected is not eligible for instant
              verification. You will need to upload a bank statement later during
              registration to complete manual bank account verification.
              Please click Continue to proceed with the next steps in
              registration.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 items-center">
         <button
                    onClick={onBack}
                    className="relative w-[280px] h-[42px] bg-transparent"
                >
                    {/* Border shape */}
                    <span
                        className="absolute inset-0 clip-path-supplier bg-[#C7B88A]"
                        aria-hidden
                    />

                    {/* Inner fill */}
                    <span
                        className="absolute inset-[1.5px] clip-path-supplier bg-[#F0EBE3]"
                        aria-hidden
                    />

                    {/* Text */}
                    <span className="relative z-10 flex items-center justify-center h-full w-full
                   font-orbitron font-bold text-[13px] uppercase text-black">
                        BACK
                    </span>
                </button>

        <button
          onClick={onContinue}
          className="clip-next w-[240px] h-[42px]
                     bg-[#D35400] text-white
                     font-orbitron text-[12px]  hover:bg-[#39482C] transition-colors
               clip-next clip-path-supplier"
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
