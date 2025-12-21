"use client";

import Image from "next/image";
import { useState } from "react";


export default function IdentityVerification({
    onBack,
    onSubmit,
}: {
    onBack: () => void;
    onSubmit: () => void;
}) {
    const [method, setMethod] = useState("video");
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="max-w-6xl mx-auto">
                {/* ================= TITLE ================= */}
                <h1 className="font-orbitron font-bold text-black mb-4 text-[26px] text-center">
                    IDENTITY VERIFICATION
                </h1>

                <p className="text-[12px] text-center text-[#6B6B6B] mb-8 max-w-3xl mx-auto text-semibold">
                    Please choose one of the available options to connect with an Armored
                    Mart associate to complete your verification (note: not all options may
                    be available in your area).
                </p>

                <div className="border border-[#E2D6C3] bg-[#F0EBE3] p-6 space-y-6 text-black">

                    {/* OPTION 1 – ACTIVE */}
                    <label
                        onClick={() => setMethod("video")}
                        className="flex items-start gap-3 p-4 border border-[#C7B88A]
               bg-[#EFE8DC] cursor-pointer"
                    >
                        {/* Radio */}
                        <span className="mt-1 w-[14px] h-[14px] rounded-full border border-[#C7B88A]
                     flex items-center justify-center">
                            <span className="w-[7px] h-[7px] rounded-full bg-[#C7B88A]" />
                        </span>

                        <div>
                            <p className="font-semibold text-sm mb-1">
                                Over a Live Video Call
                            </p>
                            <p className="text-xs text-[#6B6B6B] leading-relaxed">
                                Join a secure video call from any location at your preferred date and
                                time to complete your identity verification. We may also send a
                                postcard with a one-time passcode and additional instructions to
                                your registered address for address verification.
                            </p>
                        </div>
                    </label>

                    {/* OPTION 2 – DISABLED */}
                    <div className="flex items-start gap-3 p-4 border border-[#D6C7A3]
                  bg-[#EFE8DC] opacity-60 cursor-not-allowed">
                        {/* Radio */}
                        <span className="mt-1 w-[14px] h-[14px] rounded-full
                     border border-[#C7B88A]" />

                        <div>
                            <p className="font-semibold text-sm mb-1">
                                Verification at Your Location (currently not available in your area)
                            </p>
                            <p className="text-xs text-[#6B6B6B] leading-relaxed">
                                An Armored Mart representative will visit your business address at a
                                scheduled date and time to help you complete the verification process.
                            </p>
                        </div>
                    </div>

                    {/* OPTION 3 – DISABLED */}
                    <div className="flex items-start gap-3 p-4 border border-[#D6C7A3]
                  bg-[#EFE8DC] opacity-60 cursor-not-allowed">
                        {/* Radio */}
                        <span className="mt-1 w-[14px] h-[14px] rounded-full
                     border border-[#C7B88A]" />

                        <div>
                            <p className="font-semibold text-sm mb-1">
                                Meet at a Local Verification Center (currently not available in your area)
                            </p>
                            <p className="text-xs text-[#6B6B6B] leading-relaxed">
                                You can visit a nearby Armored Mart verification center and meet with
                                one of our associates to complete your verification.
                            </p>
                        </div>
                    </div>

                </div>


                {/* ================= ACTION BUTTONS ================= */}
                <div className="flex justify-between items-center mt-10">
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
                        onClick={() => setShowModal(true)}
                        className="clip-next w-[260px] h-[42px]
                       bg-[#D35400] text-white
                       font-orbitron text-[12px]  font-orbitron text-[12px]  hover:bg-[#39482C] transition-colors
               clip-next clip-path-supplier"
                    >
                        SUBMIT FOR APPROVAL
                    </button>
                </div>
            </div>

            {/* ================= MODAL ================= */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setShowModal(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white w-[420px]
                          border border-[#C7B88A] p-6 z-10">
                        <h3 className="font-orbitron font-bold text-black mb-3">
                            START APPROVAL PROCESS
                        </h3>

                        <p className="text-xs text-[#6B6B6B] mb-6 leading-relaxed">
                            Are you sure that you want to start the approval process for this
                            legal entity? Note that you will not be able to edit any details
                            during the approval process.
                        </p>

                        <div className="flex justify-center">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    onSubmit();
                                }}
                                className="bg-[#2E7D32] text-white px-6 py-2
                           text-xs font-orbitron clip-path-supplier w-[280px]"
                            >
                                START APPROVAL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
