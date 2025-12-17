"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

/* ✅ Countries data MUST be defined before useState */
const countries = [
  {
    name: "India",
    code: "+91",
    flag: "/icons/flags/india.png",
  },
  {
    name: "United Arab Emirates",
    code: "+971",
    flag: "/icons/flags/uae.svg",
  },
  {
    name: "United States",
    code: "+1",
    flag: "/icons/flags/usa.png",
  },
];

export default function CreateAccountPage() {
  const router = useRouter();

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");

  return (
    <section className="relative w-full min-h-[calc(100vh-140px)] bg-[#EFE8DC] flex">

      {/* ================= LEFT SIDE ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-20 text-black">
        <div className="bg-[#F3EDE3] w-full max-w-[420px] p-8 shadow-md">

          {/* COUNTRY */}
          <label className="text-xs font-semibold mb-1 block">
            Country*
          </label>
          <div className="flex items-center border border-[#C7B88A] px-3 py-3 mb-4 bg-[#EFE8DC]">
            <Image
              src={selectedCountry.flag}
              alt={selectedCountry.name}
              width={22}
              height={16}
            />
            <span className="ml-2 text-sm">{selectedCountry.name}</span>
          </div>

          {/* USER NAME */}
          <label className="text-xs font-semibold mb-1 block">
            User Name*
          </label>
          <input
            type="text"
            placeholder="John Martin"
            className="w-full mb-4 px-4 py-3 border border-[#C7B88A] bg-transparent text-sm focus:outline-none"
          />

          {/* EMAIL */}
          <label className="text-xs font-semibold mb-1 block">
            Email*
          </label>
          <input
            type="email"
            placeholder="info@blueweb2.com"
            className="w-full mb-4 px-4 py-3 border border-[#C7B88A] bg-transparent text-sm focus:outline-none"
          />

          {/* PHONE NUMBER */}
          <label className="text-xs font-semibold mb-1 block">
            Phone Number*
          </label>

          <div className="relative mb-6">
            <div className="flex items-center border border-[#C7B88A] h-[48px]">

              {/* COUNTRY DROPDOWN */}
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 h-full border-r border-[#C7B88A] bg-[#EFE8DC]"
              >
                <Image
                  src={selectedCountry.flag}
                  alt={selectedCountry.name}
                  width={22}
                  height={16}
                />
                <span className="text-sm">{selectedCountry.code}</span>
                <span className="text-xs">▼</span>
              </button>

              {/* PHONE INPUT */}
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9072725777"
                className="flex-1 px-3 bg-transparent text-sm focus:outline-none"
              />
            </div>

            {/* DROPDOWN LIST */}
            {open && (
              <div className="absolute z-20 w-full bg-[#F3EDE3] border border-[#C7B88A] mt-1 shadow">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      setSelectedCountry(country);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#E6E0D6] text-left"
                  >
                    <Image
                      src={country.flag}
                      alt={country.name}
                      width={22}
                      height={16}
                    />
                    <span className="text-sm flex-1">{country.name}</span>
                    <span className="text-sm">{country.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CREATE BUTTON */}
          <button
            onClick={() => router.push("/dashboard")} // change later
            className="w-full h-[42px] bg-[#D35400] text-white font-orbitron text-[16px] clip-path-supplier uppercase hover:bg-[#39482C] transition-colors"
          >
            Create
          </button>
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="hidden lg:flex w-1/2 bg-[#D35400] text-white items-center px-20 py-20">
        <div>
          <h2 className="text-[34px] font-light mb-4 leading-tight">
            Create Your Account
            <br />
            on <span className="font-bold">Armored Mart</span>
          </h2>

          <p className="text-sm leading-relaxed mb-6 max-w-[420px]">
            Discover trusted suppliers in the defense and automotive industries.
            Creating your Armored Mart account is the first step toward smarter,
            more secure sourcing online.
          </p>

          <p className="text-sm font-semibold">
            Join 10,000+ verified buyers today.
          </p>
        </div>
      </div>

    </section>
  );
}
