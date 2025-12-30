"use client";

import Image from "next/image";
import API from "@/app/services/api";

export default function ContactPerson({
    onNext,
    onPrev,
}: {
    onNext: () => void;
    onPrev: () => void;
}) {
    // Local API helper: submit Step 2 payload to vendor endpoint (token is attached via axios interceptors)
    const submitVendorOnboardingStep2 = (payload: {
        contactFullName: string;
        contactJobTitle?: string;
        contactWorkEmail: string;
        contactIdDocumentUrl?: string;
        contactMobile: string;
        contactMobileCountryCode: string;
        termsAccepted: boolean;
    }) => {
        return API.post("/vendor/onboarding/step2", payload);
    };

    return (
        <div className="max-w-[1200px] mx-auto bg-[#EBE3D6] p-8 mt-8 text-black">

            {/* Title */}
            <h2
                className="text-[22px] font-bold uppercase mb-6"
                style={{ fontFamily: "Orbitron" }}
            >
                Authorized Buyer Contact
            </h2>

            <div className="bg-[#F0EBE3] py-2 px-5">
                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#F0EBE3] px-4 py-6">

                    {/* Full Name */}
                    <div className="md:col-span-2">
                        <label className="text-xs font-semibold mb-1 block">
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 border border-[#C7B88A] bg-[#EBE3D6]  text-sm focus:outline-none text-black"
                        />
                        <p className="text-xs text-gray-600 mt-1">
                            Enter your complete name as it appears on your passport or ID.
                        </p>
                    </div>

                    {/* Job Title */}
                    <div>
                        <label className="text-xs font-semibold mb-1 block">
                            Job Title / Designation:
                        </label>
                        <input
                            type="text"
                            placeholder="Type Your Job Title"
                            className="w-full px-4 py-3 border border-[#C7B88A] bg-[#EBE3D6] text-sm focus:outline-none text-black"
                        />
                    </div>

                    {/* Official Email */}
                    <div>
                        <label className="text-xs font-semibold mb-1 block">
                            Official Email Address:
                        </label>
                        <input
                            type="email"
                            placeholder="Type Your Official Email Address"
                            className="w-full px-4 py-3 border border-[#C7B88A] bg-[#EBE3D6]  text-sm focus:outline-none text-black"
                        />
                    </div>

                    {/* Upload ID */}
                    <div className="md:col-span-1">
                        <label className="text-xs font-semibold mb-2 block text-black">
                            Upload Passport Copy or Emirates ID:
                        </label>

                        <div className="border border-dashed border-[#C7B88A] bg-[#EBE3D6] p-6 text-center relative">
                            <div className="flex justify-center mb-2">
                                <Image
                                    src="/icons/upload.png"
                                    alt="Upload"
                                    width={28}
                                    height={28}
                                />
                            </div>

                            <p className="text-sm mb-1 text-black">
                                Choose a File or Drag & Drop It Here.
                            </p>

                            <p className="text-xs text-gray-600">
                                JPEG, PNG, PDF, and MP4 formats, up to 10 MB.
                            </p>

                            {/* Invisible file input overlay to preserve UI while enabling click */}
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf,.mp4"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                aria-label="Upload Passport or Emirates ID"
                            />
                        </div>
                    </div>

                    {/* Mobile / WhatsApp */}
                    <div className="md:col-span-1">
                        <label className="text-xs font-semibold mb-1 block text-black">
                            Mobile / WhatsApp Number:
                        </label>

                        <div className="flex items-center border border-[#C7B88A] h-[48px] bg-[#EBE3D6]">
                            <div className="flex items-center gap-2 px-3 border-r border-[#C7B88A] bg-[#EBE3D6]">
                                <Image
                                    src="/icons/flags/india.png"
                                    alt="India"
                                    width={22}
                                    height={16}
                                />
                                <span className="text-sm text-black">+91</span>
                                {/* Hidden input to capture country code for API without changing UI */}
                                <input type="hidden" name="contactMobileCountryCode" value="+91" />
                            </div>

                            <input
                                type="tel"
                                placeholder="Phone number"
                                className="flex-1 px-3 bg-[#EBE3D6] text-sm focus:outline-none text-black "
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= Acknowledgment Section ================= */}
            <div className="mt-8 bg-[#F0EBE3] px-6 py-5">
                <h3 className="text-sm font-semibold text-[#2B2B2B] mb-3">
                    Acknowledgment
                </h3>

                <label className="flex items-start gap-3 text-sm text-[#3A3A3A] cursor-pointer">
                    <input
                        type="checkbox"
                        className="
        mt-[2px]
        w-[16px] h-[16px]
        border border-[#C7B88A]
        bg-[#EBE3D6]
        accent-[#C7B88A]
      "
                    />

                    <span className="leading-relaxed">
                        I confirm the accuracy of the above details and that I am authorized to
                        submit this request.
                    </span>
                </label>
            </div>





            {/* Buttons */}
            <div className="flex justify-center gap-6 mt-10">
                <button
                    onClick={onPrev}
                    className="relative w-[220px] h-[48px] bg-transparent"
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
                        Previous
                    </span>
                </button>


                <button
                    onClick={onNext}
                    className="w-[280px] h-[48px] bg-[#D35400] text-white font-black
                     clip-path-supplier uppercase hover:bg-[#39482C] transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
