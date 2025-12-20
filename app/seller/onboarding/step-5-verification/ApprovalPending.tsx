"use client";

import Image from "next/image";



export default function ApprovalPending() {
    const handleEdit = () => {
        localStorage.removeItem("seller-verification-step");
        window.location.reload();
    };

    return (
        <div className="max-w-6xl mx-auto">

            {/* ================= GREEN STATUS BANNER ================= */}
<div className="text-center mb-6">
  <p className="text-sm font-bold text-black font-orbitron">
    YOUR LEGAL ENTITY IS PENDING FOR APPROVAL
  </p>
  <p className="text-xs text-[#2E7D32] mt-1">
    Please wait for the approval to be completed.
  </p>
</div>


            {/* ================= EDIT LINK (ACTIVE) ================= */}
            <div className="text-center mb-6">
                <button
                    onClick={handleEdit}
                    className="text-xs underline text-[#D35400]"
                >
                    Edit previous information (dev only)
                </button>
            </div>

            {/* ================= PAGE CONTENT (DISABLED) ================= */}
            <div className="opacity-60 pointer-events-none">

                <h1 className="font-orbitron font-bold text-black mb-4 text-[26px] text-center">
                    IDENTITY VERIFICATION
                </h1>

                <p className="text-xs text-center text-[#6B6B6B] mb-8 max-w-3xl mx-auto">
                    Please choose one of the available options to connect with an Armored
                    Mart associate to complete your verification (note: not all options may
                    be available in your area).
                </p>

                <div className="border border-[#E2D6C3] bg-[#F0EBE3] p-6 space-y-6">

                    {/* OPTION 1 */}
                    <div className="flex items-start gap-3 p-4 border border-[#C7B88A]
                          bg-[#EFE8DC]">
                        <span className="mt-1 w-[14px] h-[14px] rounded-full
                             border border-[#C7B88A]
                             flex items-center justify-center">
                            <span className="w-[7px] h-[7px] rounded-full bg-[#C7B88A]" />
                        </span>

                        <div>
                            <p className="font-semibold text-sm mb-1">
                                Over a Live Video Call
                            </p>
                            <p className="text-xs text-[#6B6B6B]">
                                Join a secure video call from any location at your preferred
                                date and time to complete your identity verification.
                            </p>
                        </div>
                    </div>

                    {/* OPTION 2 */}
                    <div className="flex items-start gap-3 p-4 border border-[#D6C7A3]
                          bg-[#EFE8DC]">
                        <span className="mt-1 w-[14px] h-[14px] rounded-full
                             border border-[#C7B88A]" />
                        <div>
                            <p className="font-semibold text-sm mb-1">
                                Verification at Your Location (currently not available)
                            </p>
                        </div>
                    </div>

                    {/* OPTION 3 */}
                    <div className="flex items-start gap-3 p-4 border border-[#D6C7A3]
                          bg-[#EFE8DC]">
                        <span className="mt-1 w-[14px] h-[14px] rounded-full
                             border border-[#C7B88A]" />
                        <div>
                            <p className="font-semibold text-sm mb-1">
                                Meet at a Local Verification Center (currently not available)
                            </p>
                        </div>
                    </div>
                </div>

                {/* ================= DISABLED BUTTON ================= */}
                <div className="flex justify-between mt-10">
                    <button
                        disabled
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

                        {/* Content */}
                        <span
                            className="relative z-10 flex items-center justify-center gap-2
                           h-full w-full
                           font-orbitron font-bold text-[13px]
                           uppercase text-black"
                        >
                            {/* Settings Icon */}
                            <Image
                                src="/icons/settings.svg"
                                alt="Edit"
                                width={14}
                                height={14}
                            />

                            EDIT PREFERENCE
                        </span>
                    </button>
                    <button
                        disabled
                        className="clip-next w-[260px] h-[42px]
                       bg-[#D6C7A3]
                       text-white
                       font-orbitron text-[12px]
                       cursor-not-allowed "
                    >
                        SUBMIT FOR APPROVAL
                    </button>
                </div>
            </div>
        </div>
    );
}
