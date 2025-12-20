"use client";
import React from 'react'
import Image from "next/image";
import { useState } from "react";
const countries = [
    { code: "uae", name: "United Arab Emirates", flag: "/icons/flags/uae.svg" },
    { code: "india", name: "India", flag: "/icons/flags/India.png" },
    { code: "ksa", name: "Saudi Arabia", flag: "/icons/flags/ksa.png" },
    { code: "oman", name: "Oman", flag: "/icons/flags/oman.png" },
    { code: "qatar", name: "Qatar", flag: "/icons/flags/qatar.png" },
    { code: "usa", name: "United States", flag: "/icons/flags/usa.png" },
]

export default function SellerInformation({
  onNext,
}: {
  onNext: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(countries[0]);
    return (
        <div className="max-w-6xl mx-auto">
            {/* PAGE HEADER */}
            <div className="flex items-center justify-between mb-4">
                <h1 className=" font-orbitron font-bold text-black">
                    COMPANY INFORMATION
                </h1>

                {/* Collapse icon (UI only) */}
                <span className="text-gray-500 cursor-pointer">⌃</span>
            </div>

            {/* FORM CARD */}
            <div className=" border border-[#E2D6C3] p-6 bg-[#F0EBE3]">
                <div className="mb-4 relative">
                    <label className="label">Country of Registration</label>

                    {/* Selected */}
                    <div
                        className="flex items-center justify-between input cursor-pointer"
                        onClick={() => setOpen(!open)}
                    >
                        <div className="flex items-center gap-2 text-black">
                            <Image
                                src={selected.flag}
                                alt={selected.name}
                                width={18}
                                height={14}
                            />
                            <span >{selected.name}</span>
                        </div>

                        {/* Arrow */}
                        <svg
                            className="w-4 h-4 text-[#6B6B6B]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>

                    </div>

                    {/* Dropdown */}
                    {open && (
                        <div
                            className="absolute z-20 w-full mt-1
                        border border-[#C7B88A]
                        bg-[#EFE8DC]"
                        >
                            {countries.map((c) => (
                                <div
                                    key={c.code}
                                    onClick={() => {
                                        setSelected(c);
                                        setOpen(false);
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 text-black
                            cursor-pointer hover:bg-[#F0EBE3]"
                                >
                                    <Image
                                        src={c.flag}
                                        alt={c.name}
                                        width={18}
                                        height={14}
                                    />
                                    <span className="text-sm">{c.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">


                    {/* Registered Company Name */}
                    <div>
                        <label className="label">Registered Company Name*</label>
                        <input
                            className="input bg-[#EBE3D6]"
                            defaultValue="Blueweb LLC"
                        />
                    </div>

                    {/* Trade / Brand Name */}
                    <div>
                        <label className="label">
                            Trade/Brand Name (if different):
                        </label>
                        <input
                            className="input"
                            defaultValue="Blueweb LLC"
                        />
                    </div>
                    {/* year */}
                    <div>
                        <label className="label">Year of establishment</label>
                        <input
                            className="input"
                            placeholder="eg : 1985"
                        />
                    </div>

                    {/* Legal Entity / CR No */}
                    <div>
                        <label className="label">Legal Entity ID / CR No*</label>
                        <input
                            className="input"
                            placeholder="Enter Trade License Number"
                        />
                    </div>

                    {/* Issue Date */}
                    <div>
                        <label className="label">Issue Date</label>
                        <input type="date" className="input" />
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label className="label">Expiry Date</label>
                        <input type="date" className="input" />
                    </div>

                    {/* City & Office Address */}
                    <div>
                        <label className="label">
                            City & Office Address
                        </label>
                        <input
                            className="input"
                            placeholder="Office Address, Address Line"
                        />
                    </div>

                    {/* Official Website */}
                    <div>
                        <label className="label">Official Website</label>
                        <input
                            className="input"
                            placeholder="www.example.com"
                        />
                    </div>

                    {/* Entity Type */}
                    <div>
                        <label className="label">Entity Type</label>

                        <div className="relative">
                            <select
                                className="input appearance-none pr-12"
                            >
                                <option>Distributor</option>
                                <option>Manufacturer</option>
                                <option>Trader</option>
                            </select>

                            {/* Right Arrow Box */}
                            <div
                                className="pointer-events-none
                    absolute top-1/2 right-1
                    -translate-y-1/2
                    h-[34px] w-[34px]
                   
                    bg-[#EFE8DC]
                    flex items-center justify-center"
                            >
                                <svg
                                    className="w-3 h-3 text-black"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>


                    {/* DUNS Number */}
                    <div>
                        <label className="label">
                            DUNS Number (if applicable)
                        </label>
                        <input
                            className="input"
                            placeholder="eg: 79-567-1234"
                        />
                    </div>
                </div>

                {/* TAX INFORMATION */}
                <div className="mt-8">
                    <h3 className="font-orbitron font-bold text-black mb-4">
                        TAX INFORMATION
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Upload VAT Certificate */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-black">
                                Upload VAT Registration Certificate<span className="">*</span>
                            </label>

                            <label
                                htmlFor="vatCertificate"
                                className="flex flex-col items-center justify-center
                  bg-[#EFE8DC]
                  border border-dashed border-[#C7B88A]
                  rounded-sm
                  px-6 py-8
                  text-center
                  cursor-pointer
                  hover:bg-[#F0EBE3]
                  transition"
                            >
                                {/* Upload Icon */}
                                <svg
                                    className="w-8 h-8 text-[#D35400] mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a4 4 0 010 8m-4-4v8m0 0l-3-3m3 3l3-3"
                                    />
                                </svg>

                                {/* Text */}
                                <p className="text-sm font-medium text-black mb-1">
                                    Choose a File or Drag & Drop It Here.
                                </p>

                                <p className="text-xs text-gray-600">
                                    Make sure the document details match your entry. Upload all pages in clear,
                                    colored format.
                                </p>

                                <p className="text-xs text-gray-600 mt-1">
                                    Accepted files: JPEG, PNG, PDF, MP4 (max 10 MB).
                                </p>

                                {/* Hidden Input */}
                                <input
                                    id="vatCertificate"
                                    type="file"
                                    className="hidden"
                                    accept=".jpg,.jpeg,.png,.pdf,.mp4"
                                />
                            </label>
                        </div>


                        {/* Tax Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 mt-2">
                                <label className="label">Tax / VAT Number<span className="">*</span></label>
                                <input
                                    className="input"
                                    placeholder="eg: 100345670200003"
                                />
                            </div>

                            <div>
                                <label className="label">Issuing Date</label>
                                <input type="date" className="input" />
                            </div>

                            <div>
                                <label className="label">Expiry Date</label>
                                <input type="date" className="input" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* NEXT BUTTON */}
                <div className="flex justify-center mt-10">
                    <button
                    onClick={onNext}
                        className="w-[280px] h-[42px] bg-[#D35400]
                          clip-path-supplier hover:bg-[#39482C]
                          transition-colors"
                    >
                        <span
                            className="flex items-center justify-center
                            font-orbitron font-bold
                            text-[12px] uppercase text-white"
                        >
                            NEXT
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );

}
