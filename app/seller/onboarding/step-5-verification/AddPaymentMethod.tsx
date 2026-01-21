"use client";

import Image from "next/image";
import { useState } from "react";


const paymentMethods = [
    {
        id: "card",
        label: "Credit or debit card",
        icons: ["/icons/payment/credictcard.svg"],
    },
    // {
    //     id: "tamara",
    //     label: "Tamara",
    //     icons: ["/icons/payment/tamara.svg"],
    // },
    // {
    //     id: "tabby",
    //     label: "Tabby",
    //     icons: ["/icons/payment/tabby.svg"],
    // },
    {
        id: "apple",
        label: "Apple Pay",
        icons: ["/icons/payment/apple-pay.svg"],
    },
    {
        id: "paypal",
        label: "paypal",
        icons: ["/icons/payment/paypal.svg"],
    },
];

const countries = [
    { code: "uae", name: "United Arab Emirates", flag: "/icons/flags/uae.svg" },
    { code: "ksa", name: "Saudi Arabia", flag: "/icons/flags/ksa.png" },
    { code: "qatar", name: "Qatar", flag: "/icons/flags/qatar.png" },
    { code: "oman", name: "Oman", flag: "/icons/flags/oman.png" },
    { code: "india", name: "India", flag: "/icons/flags/india.png" },
];



const banks = [
    "Emirates NBD",
    "ADCB",
    "FAB",
    "Mashreq Bank",
    "RAK Bank",
];

const proofTypes = [
    "Bank Statement",
    "Cancelled Cheque",
];





export default function AddPaymentMethod({
    onBack,
    onContinue,
}: {
    onBack: () => void;
    onContinue: () => void;
}) {
    const [paymentMethod, setPaymentMethod] = useState("card");


    // to country dropdown 
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(countries[0]); // UAE default

    // Bank dropdown
    const [bankOpen, setBankOpen] = useState(false);
    const [selectedBank, setSelectedBank] = useState("Select");

    // Proof dropdown
    const [proofOpen, setProofOpen] = useState(false);
    const [selectedProof, setSelectedProof] = useState("Bank Statement");


    return (
        <div className="max-w-6xl mx-auto">

            {/* ================= TITLE ================= */}
            <h1 className="font-orbitron font-bold text-black mb-2 text-[26px]">
                ADD PAYMENT METHOD
            </h1>

            <p className="text-xs text-[#6B6B6B] mb-4">
                Check out faster when you add a payment method. Your payment details are
                secure and private.
            </p>

            {/* ================= PAYMENT METHOD STRIP ================= */}
            <div className="bg-[#EFE8DC] border border-[#E2D6C3] px-6 py-4 mb-4">
                <div className="flex flex-wrap items-center gap-14 text-sm">

                    {paymentMethods.map((item) => {
                        const checked = paymentMethod === item.id;

                        return (
                            <label
                                key={item.id}
                                onClick={() => setPaymentMethod(item.id)}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                {/* Radio */}
                                <span className="w-[14px] h-[14px] rounded-full border border-[#C7B88A]
                           flex items-center justify-center">
                                    <span
                                        className={`w-[7px] h-[7px] rounded-full ${checked ? "bg-[#C7B88A]" : ""
                                            }`}
                                    />
                                </span>

                                {/* Icons */}
                                <div className="flex items-center gap-3">
                                    {item.icons.map((icon) => (
                                        <Image
                                            key={icon}
                                            src={icon}
                                            alt={item.label}
                                            width={28}
                                            height={18}
                                        />
                                    ))}
                                </div>

                                {/* Label */}
                                <span className="text-[#2B2B2B] whitespace-nowrap">
                                    {item.label}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>


            {/* ================= INFO MESSAGE (BLUE BORDER) ================= */}
            <div
                className="flex items-start gap-2 text-xs
             bg-[#DAD4C5]
             px-5 py-4 mb-8"
            >
                <Image
                    src="/icons/info2.svg"
                    alt="Info"
                    width={14}
                    height={14}
                    className="mt-[2px]"
                />

                <span className="text-[#2B2B2B] leading-relaxed">
                    You are adding your bank account for the UAE marketplace. You can add
                    additional bank accounts for other regions you choose to sell in once
                    registration is complete.
                </span>
            </div>


            {/* ================= ADD BANK ACCOUNT ================= */}
            <div>
                <h3 className="font-semibold text-sm mb-4 text-black font-orbitron">
                    ADD A BANK ACCOUNT
                </h3>

                <div className="bg-[#F0EBE3] p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-black">

                        {/* LEFT COLUMN */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs mb-1 font-semibold">Country</label>

                                <div className="relative">
                                    {/* Selected value */}
                                    <button
                                        type="button"
                                        onClick={() => setOpen(!open)}
                                        className="w-full bg-[#EBE3D6] border border-[#C7B88A]
                     px-3 py-2 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src={selected.flag}
                                                alt={selected.name}
                                                width={22}
                                                height={16}
                                            />
                                            <span className="text-sm">{selected.name}</span>
                                        </div>

                                        {/* Arrow */}
                                        <span className="text-[#6B6B6B]">▾</span>
                                    </button>

                                    {/* Dropdown */}
                                    {open && (
                                        <div className="absolute z-10 mt-1 w-full
                          bg-[#EBE3D6] border border-[#C7B88A]">
                                            {countries.map((country) => (
                                                <div
                                                    key={country.code}
                                                    onClick={() => {
                                                        setSelected(country);
                                                        setOpen(false);
                                                    }}
                                                    className="flex items-center gap-2 px-3 py-2
                           hover:bg-[#E6D8C3] cursor-pointer"
                                                >
                                                    <Image
                                                        src={country.flag}
                                                        alt={country.name}
                                                        width={22}
                                                        height={16}
                                                    />
                                                    <span className="text-sm">{country.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>


                            <div>
                                <label className="flex items-center gap-1 text-xs mb-1 font-semibold">
                                    <span>Routing or SWIFT code (depending on your region)</span>

                                    <Image
                                        src="/icons/quesmark.svg"
                                        alt="Help"
                                        width={14}
                                        height={14}
                                        className="cursor-pointer"
                                    />
                                </label>

                                <input
                                    className="w-full bg-[#EBE3D6] border border-[#C7B88A] px-3 py-2"
                                    placeholder="Enter your IBAN number"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-1 text-xs mb-1 font-semibold">
                                    <span>Bank Account Number</span>

                                    <Image
                                        src="/icons/quesmark.svg"
                                        alt="Help"
                                        width={14}
                                        height={14}
                                        className="cursor-pointer"
                                    />
                                </label>

                                <input
                                    className="w-full bg-[#EBE3D6] border border-[#C7B88A] px-3 py-2"
                                    placeholder="Enter account number"
                                />
                            </div>

                            <div>
                                <label className="block text-xs mb-1 font-semibold">
                                    Re-Type Bank Account Number
                                </label>
                                <input
                                    className="w-full bg-[#EBE3D6] border border-[#C7B88A] px-3 py-2"
                                    placeholder="Confirm account number"
                                />
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs mb-1 font-semibold">
                                    Financial Institution Name
                                </label>

                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setBankOpen(!bankOpen)}
                                        className="w-full bg-[#EBE3D6] border border-[#C7B88A]
                     px-3 py-2 flex items-center justify-between"
                                    >
                                        <span className="text-sm">
                                            {selectedBank}
                                        </span>
                                        <span className="text-[#6B6B6B]">▾</span>
                                    </button>

                                    {bankOpen && (
                                        <div className="absolute z-10 mt-1 w-full
                          bg-[#EBE3D6] border border-[#C7B88A]">
                                            {banks.map((bank) => (
                                                <div
                                                    key={bank}
                                                    onClick={() => {
                                                        setSelectedBank(bank);
                                                        setBankOpen(false);
                                                    }}
                                                    className="px-3 py-2 text-sm
                           hover:bg-[#E6D8C3] cursor-pointer"
                                                >
                                                    {bank}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs mb-1 font-semibold">
                                    Proof Type*
                                </label>

                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setProofOpen(!proofOpen)}
                                        className="w-full bg-[#EBE3D6] border border-[#C7B88A]
                     px-3 py-2 flex items-center justify-between"
                                    >
                                        <span className="text-sm">
                                            {selectedProof}
                                        </span>
                                        <span className="text-[#6B6B6B]">▾</span>
                                    </button>

                                    {proofOpen && (
                                        <div className="absolute z-10 mt-1 w-full
                          bg-[#EBE3D6] border border-[#C7B88A]">
                                            {proofTypes.map((type) => (
                                                <div
                                                    key={type}
                                                    onClick={() => {
                                                        setSelectedProof(type);
                                                        setProofOpen(false);
                                                    }}
                                                    className="px-3 py-2 text-sm
                           hover:bg-[#E6D8C3] cursor-pointer"
                                                >
                                                    {type}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>


                            <div>
                                <label className="block text-xs mb-2 font-semibold text-black">
                                    Upload Proof
                                </label>

                                <div
                                    className="border border-dashed border-[#C7B88A]
               bg-[#EFE8DC]
               px-6 py-5
               h-[120px]
               flex flex-col items-center justify-center
               text-center cursor-pointer"
                                >
                                    {/* Upload Icon */}
                                    <Image
                                        src="/icons/upload.png"
                                        alt="Upload"
                                        width={26}
                                        height={26}
                                        className="mb-2"
                                    />

                                    {/* Main Text */}
                                    <p className="text-xs font-semibold text-[#2B2B2B]">
                                        Choose a File or Drag & Drop It Here.
                                    </p>

                                    {/* Helper Description */}
                                    <p className="text-[10px] text-[#6B6B6B] mt-1 leading-relaxed max-w-[320px]">
                                        Make sure the document details match your entry. Upload all pages in
                                        clear, colored format. Accepted files: JPEG, PNG, PDF, or MP4 (max 10 MB).
                                    </p>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>

            {/* ================= ACTION BUTTONS ================= */}
            <div className="flex justify-center items-center mt-10 gap-6">

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
