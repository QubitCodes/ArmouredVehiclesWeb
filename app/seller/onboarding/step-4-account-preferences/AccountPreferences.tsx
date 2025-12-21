"use client";

import React, { useState } from "react";

const categories = [
    "Engine Systems",
    "Transmission & Drivetrain",
    "Chassis & Suspension",
    "Electrical Systems (Controlled if MI Standard)",
    "Runflat & Tire Systems",
    "Surveillance & Monitoring",
    "Turrets & Mounts (Controlled Item MOD/EOCN)",
    "Lighting Systems (Controlled if MI Standard)",
    "HVAC & Thermal Management",
    "Ballistic Protection (Controlled Item MOD/EOCN)",
    "Body & Structure Reinforcement",
    "Braking Systems",
    "Gunports, Hinges & Weapon-Mount Interfaces",
    "Countermeasures",
    "Fuel & Water Systems",
    "Communication Equipment (Controlled Items)",
    "Interior Kits",
    "Fabrication & Integration",
    "Controlled Item MOD/ITAR Design Control",
    "Drive-Side Conversion Components",
    "Interior Accessories",
    "OEM Components",
    "Low-Profile OEM Chassis",
    "Military & Tactical Chassis Suppliers",
    "End-user Declaration",
    "Recovery & Mobility",
];

export default function AccountPreferences({
    onPrev,
    onNext,
}: {
    onPrev: () => void;
    onNext: () => void;
}) {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([
        "Engine Systems",
        "Runflat & Tire Systems",
        "Turrets & Mounts (Controlled Item MOD/EOCN)",
        "Braking Systems",
    ]);

    const [registerAs] = useState("Verified Supplier");
    const [currency, setCurrency] = useState("AED");
    const [sponsor, setSponsor] = useState("No");

    const toggleCategory = (item: string) => {
        setSelectedCategories((prev) =>
            prev.includes(item)
                ? prev.filter((i) => i !== item)
                : [...prev, item]
        );
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="font-orbitron font-bold text-black mb-4 text-[28px]">
                ACCOUNT PREFERENCES
            </h1>


            <div className="p-6 space-y-8 text-black ">

                {/* ================= CATEGORIES ================= */}
                <div className="bg-[#F0EBE3] p-4">
                    <div className=" p-4">
                        <label className="label mb-2 block">
                            Select Categories You Want to Sell In:
                        </label>

                        {/* Selected Chips */}
                        <div className="relative border border-[#C7B88A] bg-[#EFE8DC] p-3 flex flex-wrap gap-2 mb-3">
                            {selectedCategories.map((item) => (
                                <span
                                    key={item}
                                    className="flex items-center gap-2 px-3 py-1 text-xs
                                   border border-[#C7B88A] bg-[#EBE3D6]"
                                >
                                    {item}
                                    <button
                                        onClick={() => toggleCategory(item)}
                                        className="text-sm"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}

                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                                {selectedCategories.length}
                            </span>
                        </div>

                        {/* Checkbox Grid */}
                        <div className="flex flex-wrap gap-2 text-xs">
                            {categories.map((item) => {
                                const checked = selectedCategories.includes(item);
                                return (
                                    <label
                                        key={item}
                                        onClick={() => toggleCategory(item)}
                                        className={`flex items-center gap-2 px-3 py-2 border cursor-pointer
                            ${checked
                                                ? "bg-[#E6D8C3] border-[#C7B88A] text-black"
                                                : "bg-[#EFE8DC] border-[#D6C7A3] text-[#8A8A8A]"
                                            }`}
                                    >
                                        <span
                                            className={`w-[16px] h-[16px] border border-[#C7B88A]
                            flex items-center justify-center text-[12px]
                            ${checked
                                                    ? "bg-[#C7B88A] text-white"
                                                    : "bg-[#EBE3D6] text-transparent"
                                                }`}
                                        >
                                            ✓
                                        </span>
                                        {item}
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ================= REGISTER + CURRENCY ================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-5">

                    <div className="p-4 bg-[#F0EBE3]">
                        {/* REGISTER AS */}
                        <div>
                            <label className="text-sm font-semibold block mb-3">
                                Request to Register As:
                            </label>

                            <label className="flex items-center gap-3 text-sm cursor-pointer">
                                <span className="w-[16px] h-[16px] rounded-full border border-[#C7B88A] flex items-center justify-center">
                                    <span className="w-[8px] h-[8px] rounded-full bg-[#C7B88A]" />
                                </span>
                                Verified Supplier
                            </label>
                        </div>
                    </div>

                    {/* CURRENCY */}
                    <div className="p-4 bg-[#F0EBE3] ">
                        <div>
                            <label className="text-sm font-semibold block mb-3">
                                Preferred Currency:
                            </label>

                            <div className="flex flex-wrap gap-6 text-sm">
                                {["AED", "USD", "EUR", "Other"].map((item) => {
                                    const checked = currency === item;
                                    return (
                                        <label
                                            key={item}
                                            onClick={() => setCurrency(item)}
                                            className="flex items-center gap-3 cursor-pointer"
                                        >
                                            <span className="w-[16px] h-[16px] rounded-full border border-[#C7B88A] flex items-center justify-center">
                                                <span
                                                    className={`w-[8px] h-[8px] rounded-full ${checked ? "bg-[#C7B88A]" : ""
                                                        }`}
                                                />
                                            </span>
                                            {item}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= SPONSOR ================= */}
                <div className="p-4 bg-[#F0EBE3]">
                    <label className="text-sm font-semibold block mb-3">
                        Do you wish to sponsor content/listings?
                    </label>

                    <div className="flex gap-10 text-sm">
                        {["Yes", "No"].map((item) => {
                            const checked = sponsor === item;
                            return (
                                <label
                                    key={item}
                                    onClick={() => setSponsor(item)}
                                    className="flex items-center gap-3 cursor-pointer"
                                >
                                    <span className="w-[16px] h-[16px] rounded-full border border-[#C7B88A] flex items-center justify-center">
                                        <span
                                            className={`w-[8px] h-[8px] rounded-full ${checked ? "bg-[#C7B88A]" : ""
                                                }`}
                                        />
                                    </span>
                                    {item}
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* ================= PASSWORD ================= */}
                <div className="p-4 bg-[#F0EBE3]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-semibold block mb-1">
                                Set Platform Password:
                            </label>
                            <input
                                type="password"
                                placeholder="Enter Your New Password"
                                className="w-full bg-[#EBE3D6] border border-[#C2B280] px-4 py-2 text-sm"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold block mb-1">
                                Confirm Password:
                            </label>
                            <input
                                type="password"
                                placeholder="Re-enter Your Password"
                                className="w-full bg-[#EBE3D6] border border-[#C2B280] px-4 py-2 text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* ================= CAPTCHA ================= */}
                <div className="p-4 bg-[#F0EBE3]">
                    <label className="text-sm font-semibold block mb-2">
                        CAPTCHA Verification
                    </label>

                    <div
                        className="flex items-center justify-between
               border border-[#C7B88A]
               bg-[#EFE8DC]
               px-4 py-3
               w-[300px]"
                    >
                        {/* Left: Checkbox + text */}
                        <label className="flex items-center gap-3 cursor-pointer text-xs">
                            <input
                                type="checkbox"
                                className="w-[18px] h-[18px] border border-[#C7B88A]"
                            />
                            <span>I’m not a robot</span>
                        </label>

                        {/* Right: reCAPTCHA logo */}
                        <div className="flex flex-col items-center text-[9px] text-[#6B6B6B]">
                            <img
                                src="/icons/recaptcha.png"
                                alt="reCAPTCHA"
                                className="w-[36px] mb-1"
                            />
                            <span>reCAPTCHA</span>
                        </div>
                    </div>
                </div>

            </div>


            {/* ================= ACTION BUTTONS ================= */}
            <div className="flex justify-center items-center mt-10 gap-6">
                <button
                    onClick={onPrev}
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
                        Previous
                    </span>
                </button>



                {/* NEXT */}
                <button
                    onClick={onNext}
                    className="w-[280px] h-[42px]
               bg-[#D35400]
               font-orbitron font-bold
               text-[12px] uppercase
               text-white hover:bg-[#39482C] transition-colors
               clip-next clip-path-supplier"
                >
                    NEXT
                </button>
            </div>
        </div >
    );
}
