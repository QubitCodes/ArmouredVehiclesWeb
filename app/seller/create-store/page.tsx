"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const countries = [
  { name: "India", code: "+91", flag: "/icons/flags/India.png" },
  { name: "United Arab Emirates", code: "+971", flag: "/icons/flags/uae.svg" },
  { name: "Saudi Arabia", code: "+966", flag: "/icons/flags/ksa.png" },
  { name: "Qatar", code: "+974", flag: "/icons/flags/qatar.png" },
  { name: "Oman", code: "+968", flag: "/icons/flags/oman.png" },
  { name: "United States", code: "+1", flag: "/icons/flags/usa.png" },
];

export default function SellerCreateStorePage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(countries[0]);

  return (
    <section className="min-h-screen flex bg-[#EFE8DC] font-inter">
      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-20">
        <div className="relative w-full max-w-sm bg-[#F4EFE6] p-6 shadow-md">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="absolute -top-12 left-0 w-8 h-8 rounded-full
                       border border-[#C7B88A]
                       flex items-center justify-center
                       text-sm text-gray-700"
          >
            ←
          </button>

          {/* Country */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-700 flex items-center gap-1 text-black">
              Country*
              <img
                src="/icons/info2.svg"
                alt="Info"
                className="w-[14px] h-[14px] object-contain"
              />
            </label>

            <div className="mt-1 h-[40px] flex items-center gap-2 px-3
                            border border-[#C7B88A] bg-[#EFE8DC]">
              <img src="/icons/flags/uae.svg" className="w-5 h-4" />
              <span className="text-sm">United Arab Emirates</span>
            </div>
          </div>

          {/* Company Name */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
              Company Name*
              <img
                src="/icons/info2.svg"
                alt="Info"
                className="w-[14px] h-[14px] object-contain"
              />
            </label>

            <input
              type="text"
              defaultValue="Blueweb"
              className="mt-1 w-full h-[40px] px-3
                         border border-[#C7B88A] bg-[#EFE8DC]
                         text-sm focus:outline-none text-black"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-700">
              Email*
            </label>
            <input
              type="email"
              defaultValue="info@blueweb2.com"
              className="mt-1 w-full h-[40px] px-3
                         border border-[#C7B88A] bg-[#EFE8DC]
                         text-sm focus:outline-none text-black"
            />
          </div>

          {/* Phone */}
          <div className="mb-6 relative">
            <label className="text-xs font-semibold text-gray-700">
              Store Phone Number*
            </label>

            {/* Input */}
            <div className="mt-1 flex h-[44px] border border-[#C7B88A] bg-[#EFE8DC]">
              {/* Country selector */}
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 border-r border-[#C7B88A]
                           text-sm text-black focus:outline-none"
              >
                <img src={selected.flag} className="w-5 h-4 object-cover" />
                <span>{selected.code}</span>
                <span className="text-gray-600">▾</span>
              </button>

              {/* Phone number */}
              <input
                type="tel"
                defaultValue="9072725777"
                className="flex-1 bg-transparent px-3 text-sm
                           focus:outline-none text-black"
              />
            </div>

            {/* Dropdown */}
            {open && (
              <div className="absolute z-20 mt-1 w-[220px]
                              bg-[#F4EFE6] border border-[#C7B88A] shadow-md">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      setSelected(country);
                      setOpen(false);
                    }}
                    className="w-full flex items-center px-3 py-2
                               text-sm hover:bg-[#EFE8DC] text-left"
                  >
                    <img
                      src={country.flag}
                      className="w-5 h-4 object-cover mr-3"
                    />

                    <span className="text-black mr-6">
                      {country.name}
                    </span>

                    <span className="ml-auto text-black">
                      {country.code}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CREATE BUTTON */}
          <button
            onClick={() =>
              router.push("/seller/onboarding/step-1-company-information")
            }
            className="w-full h-[40px] bg-[#D35400] clip-path-supplier
                       hover:bg-[#39482C] transition-colors"
          >
            <span className="flex items-center justify-center h-full w-full
                             font-orbitron font-bold text-[12px] uppercase text-white">
              Create
            </span>
          </button>
        </div>
      </div>

      {/* RIGHT SIDE – ORANGE PANEL */}
      <div className="hidden lg:flex w-1/2 bg-[#D35400] items-center px-20">
        <div className="max-w-[520px] text-white font-inter">
          <h1 className="text-[40px] leading-[1.25] mb-8 font-normal">
            Create Your Store <br />
            on <span className="font-semibold">Armored Mart</span>
          </h1>

          <p className="text-[16px] leading-[1.6] mb-8 font-normal">
            Reach thousands of verified buyers in the defense and automotive
            industries. Setting up your Armored Mart store is the first step
            toward growing your business online.
          </p>

          <p className="text-[14px] font-normal">
            Join 10,000+ trusted sellers today.
          </p>
        </div>
      </div>
    </section>
  );
}
