"use client";

import { useState } from "react";
import Image from "next/image";


const businessTypes = [
  "Manufacturer",
  "OEM Dealer",
  "Wholesaler / Distributor",
  "Retailer",
  "E-commerce Seller",
  "Importer / Exporter",
  "Trading Company",
  "Service Provider",
  "Defense Supplier",
  "Vehicle Armoring",
  "Government Agency",
  "Contractor / Subcontractor",
  "Logistics / Freight Services",
  "Construction / Engineering",
  "Technology / IT Solutions Provider",
  "Healthcare / Medical Supplier",
  "Education / Training Provider",
  "Financial / Consulting Services",
  "Nonprofit / NGO",
  "Other",
];

const endUseOptions = [
  "Civilian",
  "Military",
  "Law Enforcement",
  "Government",
  "Export",
];

const licenseOptions = [
  "MOD License",
  "EOCN Approval",
  "ITAR Registration",
  "Local approval from authorities",
  "None",
];

export default function Declaration({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) {
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<string[]>([
    "Manufacturer",
    "OEM Dealer",
    "Retailer",
    "Defense Supplier",
    "Vehicle Armoring",
  ]);

  const [endUseMarket, setEndUseMarket] = useState<string[]>([
    "Civilian",
    "Military",
  ]);

  const [license, setLicense] = useState("EOCN Approval");


  const countryOptions = [
    { code: "AE", name: "United Arab Emirates (UAE)", flag: "https://flagcdn.com/w40/ae.png" },
    { code: "SA", name: "Saudi Arabia (KSA)", flag: "https://flagcdn.com/w40/sa.png" },
    { code: "QA", name: "Qatar", flag: "https://flagcdn.com/w40/qa.png" },
    { code: "OM", name: "Oman", flag: "https://flagcdn.com/w40/om.png" },
    { code: "IN", name: "India", flag: "https://flagcdn.com/w40/in.png" },
    { code: "ID", name: "Indonesia", flag: "https://flagcdn.com/w40/id.png" },
    { code: "IR", name: "Iran", flag: "https://flagcdn.com/w40/ir.png" },
    { code: "IQ", name: "Iraq", flag: "https://flagcdn.com/w40/iq.png" },
    { code: "IE", name: "Ireland", flag: "https://flagcdn.com/w40/ie.png" },
  ];

  const [selectedCountries, setSelectedCountries] = useState<string[]>([
    "United Arab Emirates (UAE)",
    "Saudi Arabia (KSA)",
    "Qatar",
    "Oman",
  ]);

  const [countrySearch, setCountrySearch] = useState("");


  /* ---------- TOGGLES ---------- */
  const toggleBusinessType = (item: string) => {
    setSelectedBusinessTypes((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const toggleEndUse = (item: string) => {
    setEndUseMarket((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const [sanctionsStatus, setSanctionsStatus] = useState<"Yes" | "No">("No");
  const [controlledItems, setControlledItems] = useState(false);


  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="font-orbitron font-bold text-black mb-4 text-[28px]">
        COMPLIANCE & ACTIVITY DECLARATION
      </h1>

      <div className=" text-black ">

        {/* ================= NATURE OF BUSINESS ================= */}
        <div className="bg-[#F0EBE3] p-4">
          <label className="label mb-2 block">Nature of Business:</label>

          {/* Selected chips */}
          <div className="relative border border-[#C7B88A] bg-[#EFE8DC] p-3 flex flex-wrap gap-2 mb-3">
            {selectedBusinessTypes.map((item) => (
              <span
                key={item}
                className="flex items-center gap-2 px-3 py-1 text-xs
                           border border-[#C7B88A] bg-[#EBE3D6]"
              >
                {item}
                <button onClick={() => toggleBusinessType(item)}>×</button>
              </span>
            ))}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
              {selectedBusinessTypes.length}
            </span>
          </div>

          {/* Checkbox grid */}
          <div className="flex flex-wrap gap-2 text-xs">
            {businessTypes.map((item) => {
              const checked = selectedBusinessTypes.includes(item);
              return (
                <label
                  key={item}
                  onClick={() => toggleBusinessType(item)}
                  className={`flex items-center gap-2 px-3 py-2 border cursor-pointer
                    ${checked
                      ? "bg-[#E6D8C3] border-[#C7B88A] text-black"
                      : "bg-[#EFE8DC] border-[#D6C7A3] text-[#8A8A8A]"
                    }`}
                >
                  <input type="checkbox" checked={checked} readOnly className="hidden" />
                  <span
                    className={`w-[16px] h-[16px] border border-[#C7B88A] flex items-center justify-center text-[12px]
                      ${checked ? "bg-[#C7B88A] text-white" : "bg-[#EBE3D6] text-transparent"}`}
                  >
                    ✓
                  </span>
                  {item}
                </label>
              );
            })}
          </div>
        </div>

        {/* ================= CONTROLLED + END USE + LICENSE ================= */}
        <div className="bg-[#F0EBE3] mt-5 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* LEFT */}
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold block mb-1">
                  Are you dealing with any controlled / dual use items?
                </label>
                <div className="flex items-center gap-2 mt-2">
                    <span className={`text-sm ${!controlledItems ? 'font-bold' : ''}`}>No</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={controlledItems}
                            onChange={(e) => setControlledItems(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C7B88A]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C7B88A]"></div>
                    </label>
                    <span className={`text-sm ${controlledItems ? 'font-bold' : ''}`}>Yes</span>
                </div>
              </div>

              {/* END USE */}
              <div>
                <label className="text-sm font-semibold block mb-2">
                  End-Use Market:
                </label>

                {/* Selected chips */}
                <div className="relative border border-[#C7B88A] bg-[#EFE8DC] p-3 flex flex-wrap gap-2 mb-3">
                  {endUseMarket.map((item) => (
                    <span
                      key={item}
                      className="flex items-center gap-2 px-3 py-1 text-xs
                                 border border-[#C7B88A] bg-[#EBE3D6]"
                    >
                      {item}
                      <button onClick={() => toggleEndUse(item)}>×</button>
                    </span>
                  ))}
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
                    {endUseMarket.length}
                  </span>
                </div>

                {/* Checkbox cards */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {endUseOptions.map((item) => {
                    const checked = endUseMarket.includes(item);
                    return (
                      <label
                        key={item}
                        onClick={() => toggleEndUse(item)}
                        className={`flex items-center gap-2 px-3 py-2 border cursor-pointer
                          ${checked
                            ? "bg-[#E6D8C3] border-[#C7B88A] text-black"
                            : "bg-[#EFE8DC] border-[#D6C7A3] text-[#8A8A8A]"
                          }`}
                      >
                        <span
                          className={`w-[16px] h-[16px] border border-[#C7B88A] flex items-center justify-center text-[12px]
                            ${checked ? "bg-[#C7B88A] text-white" : "bg-[#EBE3D6] text-transparent"}`}
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

            {/* RIGHT — LICENSE */}
            <div>
              <label className="text-sm font-semibold block mb-3">
                Do you hold any of the following licenses?
              </label>

              <div className="space-y-4 text-sm">
                {licenseOptions.map((item) => {
                  const checked = license === item;
                  return (
                    <label
                      key={item}
                      onClick={() => setLicense(item)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <span className="w-[16px] h-[16px] rounded-full border border-[#C7B88A] flex items-center justify-center">
                        <span
                          className={`w-[8px] h-[8px] rounded-full ${checked ? "bg-[#C7B88A]" : ""
                            }`}
                        />
                      </span>
                      <span className={checked ? "text-black" : "text-[#6B6B6B]"}>
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {/* ================= COUNTRIES ================= */}
        <div className="bg-[#F0EBE3] mt-5 p-4" >
          <label className="label mb-2 block">
            Countries you operate in or export to:
          </label>

          {/* Selected countries */}
          <div className="border border-[#C7B88A] bg-[#EFE8DC] p-3 mb-3">
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedCountries.map((name) => {
                const country = countryOptions.find((c) => c.name === name);
                if (!country) return null;

                return (
                  <span
                    key={name}
                    className="flex items-center gap-2 px-3 py-1 text-xs
                       border border-[#C7B88A] bg-[#EBE3D6]"
                  >
                    <img
                      src={country.flag}
                      alt={name}
                      className="w-5 h-3 object-cover rounded-[2px]"
                    />
                    {name}
                    <button
                      onClick={() =>
                        setSelectedCountries((prev) =>
                          prev.filter((c) => c !== name)
                        )
                      }
                      className="text-sm"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>

            {/* Search */}
            <input
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              placeholder="In"
              className="w-full bg-transparent outline-none text-xs"
            />
          </div>

          {/* Country list */}
          <div className="space-y-2 text-xs">
            {countryOptions
              .filter((c) =>
                c.name.toLowerCase().includes(countrySearch.toLowerCase())
              )
              .map((country) => {
                const checked = selectedCountries.includes(country.name);

                return (
                  <label
                    key={country.code}
                    onClick={() =>
                      setSelectedCountries((prev) =>
                        checked
                          ? prev.filter((c) => c !== country.name)
                          : [...prev, country.name]
                      )
                    }
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      readOnly
                      className="hidden"
                    />

                    <span
                      className={`w-[16px] h-[16px] border border-[#C7B88A] flex items-center justify-center text-[12px]
                ${checked
                          ? "bg-[#C7B88A] text-white"
                          : "bg-[#EBE3D6] text-transparent"
                        }`}
                    >
                      ✓
                    </span>

                    <span>{country.name}</span>
                  </label>
                );
              })}
          </div>
        </div>

        {/* ================= SANCTIONS & DOCUMENT UPLOADS ================= */}
        <div className="bg-[#F0EBE3] mt-5 p-4">
          <div className="space-y-8">


            {/* SANCTIONS QUESTION */}
            <div>
              <label className="text-sm font-semibold block mb-3">
                Are you or your company on any international sanctions or watchlists?
              </label>

              <div className="flex items-center gap-10 text-sm">
                {["Yes", "No"].map((option) => {
                  const checked = sanctionsStatus === option;
                  return (
                    <label
                      key={option}
                      onClick={() => setSanctionsStatus(option as "Yes" | "No")}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <span className="w-[16px] h-[16px] rounded-full border border-[#C7B88A] flex items-center justify-center">
                        <span
                          className={`w-[8px] h-[8px] rounded-full ${checked ? "bg-[#C7B88A]" : ""
                            }`}
                        />
                      </span>
                      <span className={checked ? "text-black" : "text-[#6B6B6B]"}>
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>


            {/* UPLOADS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* BUSINESS LICENSE */}
              <div>
                <label className="text-sm font-semibold block mb-2">
                  Upload Business License<span className="text-red-600">*</span>
                </label>

                <div
                  className="border border-dashed border-[#C7B88A] bg-[#EFE8DC]
                     h-[120px] flex flex-col items-center justify-center
                     text-center cursor-pointer"
                >
                  <Image
  src="/icons/upload.png"
  alt="Upload"
  width={28}
  height={28}
  className="mb-2"
/>

                  <p className="text-xs font-medium">
                    Choose a File or Drag & Drop It Here.
                  </p>
                  <p className="text-[10px] text-[#6B6B6B] mt-1">
                    JPEG, PNG, PDF, and MP4 formats, up to 10 MB.
                  </p>
                </div>
              </div>

              {/* DEFENSE APPROVAL */}
              <div>
                <label className="text-sm font-semibold block mb-2">
                  Upload Any Defense-Related Approval
                </label>

                <div
                  className="border border-dashed border-[#C7B88A] bg-[#EFE8DC]
                     h-[120px] flex flex-col items-center justify-center
                     text-center cursor-pointer"
                >
                <Image
  src="/icons/upload.png"
  alt="Upload"
  width={28}
  height={28}
  className="mb-2"
/>

                  <p className="text-xs font-medium">
                    Choose a File or Drag & Drop It Here.
                  </p>
                  <p className="text-[10px] text-[#6B6B6B] mt-1">
                    JPEG, PNG, PDF, and MP4 formats, up to 10 MB.
                  </p>
                </div>
              </div>

              {/* COMPANY PROFILE */}
              <div className="md:col-span-1">
                <label className="text-sm font-semibold block mb-2">
                  Upload Company Profile / Product Catalog
                  <span className="text-[#6B6B6B] font-normal">
                    {" "} (Recommended)
                  </span>
                </label>

                <div
                  className="border border-dashed border-[#C7B88A] bg-[#EFE8DC]
                     h-[120px] flex flex-col items-center justify-center
                     text-center cursor-pointer"
                >
                  <Image
  src="/icons/upload.png"
  alt="Upload"
  width={28}
  height={28}
  className="mb-2"
/>

                  <p className="text-xs font-medium">
                    Choose a File or Drag & Drop It Here.
                  </p>
                  <p className="text-[10px] text-[#6B6B6B] mt-1">
                    JPEG, PNG, PDF, and MP4 formats, up to 10 MB.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>



        {/* ================= CONFIRM ================= */}
        <div className="bg-[#F0EBE3] mt-6 p-4 border border-[#E2D6C3] px-4 py-8">
          <label className="flex items-start gap-3 text-sm cursor-pointer">
            <input type="checkbox" className="mt-1 w-[14px] h-[14px]" />
            <span>
              I acknowledge that all transactions are subject to UAE and
              international laws and may be screened.
            </span>
          </label>
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
    </div>
  );
}
