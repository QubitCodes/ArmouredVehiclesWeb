"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import API from "../services/api";


export default function AccountSetup({
    onPrev,
    onSubmit,
    initialData,
}: {
    onPrev: () => void;
    onSubmit: () => void;
    initialData?: any;
}) {
    /* ---------------- Categories ---------------- */
    const categories = [
        "Engine Systems",
        "Braking Systems",
        "Runflat & Tire Systems",
        "Turrets & Mounts (Controlled item MOD/EOCN)",
        "Transmission & Drivetrain",
        "Chassis & Suspension",
        "Electrical Systems (Controlled if Mil Standard)",
        "Surveillance & Monitoring",
        "Lighting Systems (Controlled if Mil Standard)",
        "HVAC & Thermal Management",
        "Ballistic Protection (Controlled item MOD/EOCN)",
        "Body & Structure Reinforcements",
        "Countermeasures",
        "Fuel & Water Systems",
        "Interior Kits",
        "Exterior Accessories",
        "OEM Components",
        "Value-Oriented OEM Chassis",
        "Communication Equipment (Controlled items)",
        "Military & Tactical Chassis Suppliers (Controlled – End User declaration)",
        "Recovery & Mobility",
        "Gunports, Hinges & Weapon-Mount Interfaces (Controlled item MOD/EOCN)",
        "Fabrication & Integration (Controlled item MOD/TAR-Design Control)",
        "Drive-Side Conversion Components (LHD ↔ RHD)",
    ];

    const [selectedCategories, setSelectedCategories] = useState<string[]>([
        "Engine Systems",
        "Braking Systems",
        "Runflat & Tire Systems",
        "Turrets & Mounts (Controlled item MOD/EOCN)",
    ]);
    const [captchaChecked, setCaptchaChecked] = useState(false);


    const toggleCategory = (cat: string) => {
        setSelectedCategories((prev) =>
            prev.includes(cat)
                ? prev.filter((c) => c !== cat)
                : [...prev, cat]
        );
    };
    const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill effect
  useEffect(() => {
    if (initialData) {
        if (initialData.selling_categories && Array.isArray(initialData.selling_categories)) {
            // Need to map if formats differ, but assuming array of strings
            setSelectedCategories(initialData.selling_categories);
        }
        
        if (initialData.preferred_currency) {
            setCurrency(initialData.preferred_currency);
        }
    }
  }, [initialData]);

    /* ---------------- Radios ---------------- */
    const [currency, setCurrency] = useState("AED");

// ✅ ADDED: validation before submit
const handleSubmit = async () => {
  setError(null);

  try {
    setSubmitting(true);

     const payload = {
    sellingCategories: selectedCategories, // ✅ ARRAY
    registerAs: "Buyer / End User",
    preferredCurrency: currency,
    sponsorContent: true,
    isDraft: false,
  };

    await API.post("/onboarding/step4", payload);

    onSubmit();
  } catch (err: any) {
    setError(
      err?.response?.data?.message ||
      err?.message ||
      "Submission failed"
    );
  } finally {
    setSubmitting(false);
  }
};




    return (
        <div className="max-w-[1200px] mx-auto bg-[#EBE3D6] p-8 mt-8 text-black">
            {/* Title */}
            <h2
                className="text-[22px] font-bold uppercase mb-6"
                style={{ fontFamily: "Orbitron" }}
            >
                Account Setup
            </h2>

            {/* ---------------- Categories ---------------- */}
            <div className="bg-[#F0EBE3] py-2 px-5">
                <label className="text-xs font-semibold mb-2 block">
                    Select Categories You Want to Purchase From:
                </label>

                {/* Selected chips */}
                <div className="border border-[#C7B88A] bg-[#EFE8DC] p-3 flex flex-wrap gap-2 mb-4">
                    {selectedCategories.map((cat) => (
                        <span
                            key={cat}
                            className="flex items-center gap-2 px-3 py-1 border border-[#C7B88A] bg-[#EBE3D6] text-xs"
                        >
                            {cat}
                            <button onClick={() => toggleCategory(cat)}>×</button>
                        </span>
                    ))}
                </div>

                {/* Flex-wrap list */}
                <div className="flex flex-wrap gap-2 text-xs">
                    {categories.map((cat) => {
                        const checked = selectedCategories.includes(cat);
                        return (
                            <label
                                key={cat}
                                className={`flex items-center gap-2 px-3 py-2 border cursor-pointer
                  ${checked
                                        ? "bg-[#E6D8C3] border-[#C7B88A]"
                                        : "bg-[#EFE8DC] border-[#D6C7A3] text-[#8A8A8A]"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleCategory(cat)}
                                    className="w-4 h-4 accent-[#C7B88A]"
                                />
                                {cat}
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* ---------------- Register & Currency ---------------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Register */}
                <div className="bg-[#F0EBE3] p-4">
                    <label className="text-xs font-semibold mb-3 block">Register As:</label>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="w-4 h-4 rounded-full border border-[#C7B88A] flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-[#C7B88A]" />
                        </span>
                        Buyer / End User
                    </div>
                </div>

                {/* Preferred Currency (FIXED) */}
                <div className="bg-[#F0EBE3] p-4">
                    <label className="text-xs font-semibold mb-3 block">
                        Preferred Currency:
                    </label>

                    <div className="flex gap-8 text-sm">
                        {["AED", "USD", "EUR", "Other"].map((cur) => (
                            <label
                                key={cur}
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => setCurrency(cur)}
                            >
                                <span className="w-4 h-4 rounded-full border border-[#C7B88A] flex items-center justify-center">
                                    {currency === cur && (
                                        <span className="w-2 h-2 rounded-full bg-[#C7B88A]" />
                                    )}
                                </span>
                                <span
                                    className={
                                        currency === cur ? "text-black" : "text-[#8A8A8A]"
                                    }
                                >
                                    {cur}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>



            {/* ---------------- CAPTCHA ---------------- */}
            <div className="bg-[#F0EBE3] p-6 mt-6">
                <label className="text-xs font-semibold mb-3 block">
                    CAPTCHA Verification
                </label>

                <div className="flex items-center gap-4 border border-[#C7B88A] bg-[#F9F9F9] p-4 max-w-[320px]">
                    {/* Fake checkbox */}
                    <label
                        className="flex items-center gap-3 cursor-pointer select-none"
                        onClick={() => setCaptchaChecked(!captchaChecked)}
                    >
                        <span
                            className={`w-5 h-5 border border-[#C7B88A] flex items-center justify-center bg-white`}
                        >
                            {captchaChecked && (
                                <span className="text-xs font-bold text-[#39482C]">✓</span>
                            )}
                        </span>

                        <span className="text-sm text-black">I'm not a robot</span>
                    </label>

                    {/* reCAPTCHA logo */}
                    <div className="ml-auto flex flex-col items-center text-[9px] text-[#6E6E6E]">
                        <Image
                            src="/icons/recaptcha.png"
                            alt="reCAPTCHA"
                            width={36}
                            height={36}
                            priority
                        />
                       
                        <span>Privacy • Terms</span>
                    </div>
                </div>
            </div>


            {/* ---------------- Buttons ---------------- */}
            <div className="flex justify-center gap-6 mt-10">
                <button
                    onClick={onPrev}
                    className="relative w-[220px] h-[48px]"
                >
                    <span className="absolute inset-0 clip-path-supplier bg-[#C7B88A]" />
                    <span className="absolute inset-[1.5px] clip-path-supplier bg-[#F0EBE3]" />
                    <span className="relative z-10 flex items-center justify-center h-full font-orbitron font-bold text-sm">
                        Previous
                    </span>
                </button>

                <button
                   onClick={handleSubmit} 
                    disabled={!captchaChecked}
                    className={`w-[300px] h-[48px] font-orbitron font-bold clip-path-supplier
    ${captchaChecked
                            ? "bg-[#D35400] text-white hover:bg-[#39482C]"
                            : "bg-[#C7B88A] text-[#8A8A8A] cursor-not-allowed"
                        }`}
                >
                    Submit for Review
                </button>

            </div>
           
        </div>
    );
}
