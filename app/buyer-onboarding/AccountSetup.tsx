"use client";

import { useState } from "react";

export default function AccountSetup({
  onPrev,
  onSubmit,
}: {
  onPrev: () => void;
  onSubmit: () => void;
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

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  /* ---------------- Radios ---------------- */
  const [currency, setCurrency] = useState("AED");

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
                  ${
                    checked
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

      {/* ---------------- Password ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 bg-[#F0EBE3] p-6">
        <div>
          <label className="text-xs font-semibold mb-1 block">
            Set Platform Password:
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 border border-[#C7B88A] bg-[#EBE3D6]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold mb-1 block">
            Confirm Password:
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 border border-[#C7B88A] bg-[#EBE3D6]"
          />
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
          onClick={onSubmit}
          className="w-[300px] h-[48px] bg-[#D35400] text-white font-orbitron font-bold clip-path-supplier hover:bg-[#39482C]"
        >
          Submit for Review
        </button>
      </div>
    </div>
  );
}
