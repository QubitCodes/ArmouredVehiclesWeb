"use client";

import Image from "next/image";
import Stepper from "./Stepper";
import { useEffect, useState, useRef } from "react";
import API from "../services/api";

type BuyerTypeOption = {
  value: string;
  label: string;
};

type CountryOption = {
  value: string;
  label: string;
};

type Props = {
  onNext: () => void;
};

export default function BuyerInfo({ onNext }: Props) {
  const [buyerTypes, setBuyerTypes] = useState<BuyerTypeOption[]>([]);
  const [buyerTypesLoading, setBuyerTypesLoading] = useState<boolean>(false);
  const [buyerTypesError, setBuyerTypesError] = useState<string | null>(null);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [countriesLoading, setCountriesLoading] = useState<boolean>(false);
  const [countriesError, setCountriesError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form state for Step 0 payload
  const [typeOfBuyer, setTypeOfBuyer] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [companyEmail, setCompanyEmail] = useState<string>("");
  const [companyPhone, setCompanyPhone] = useState<string>("");
  const [companyPhoneCountryCode, setCompanyPhoneCountryCode] = useState<string>("+971");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchBuyerTypes = async () => {
      try {
        setBuyerTypesLoading(true);
        setBuyerTypesError(null);
        const res = await API.get("/reference/type-of-buyer");
        const data = res?.data;

        let options: BuyerTypeOption[] = [];
        if (Array.isArray(data)) {
          options = data
            .map((item: any): BuyerTypeOption | null => {
              if (typeof item === "string") {
                return { value: item, label: item };
              }
              if (item && typeof item === "object") {
                const label = (item.name ?? item.title ?? item.label ?? "").toString();
                const valueRaw = (item.id ?? item.value ?? item.code ?? label);
                const value = valueRaw != null ? String(valueRaw) : label;
                if (label || value) {
                  return { value, label: label || value };
                }
              }
              return null;
            })
            .filter(Boolean) as BuyerTypeOption[];
        }

        if (mounted) {
          setBuyerTypes(options);
          // Preselect first option if none chosen
          if (!typeOfBuyer && options.length > 0) {
            setTypeOfBuyer(options[0].value);
          }
        }
      } catch (err: any) {
        if (mounted) setBuyerTypesError(err?.message ?? "Failed to load buyer types");
      } finally {
        if (mounted) setBuyerTypesLoading(false);
      }
    };

    fetchBuyerTypes();
    return () => {
      mounted = false;
    };
  }, []);

    useEffect(() => {
      let mounted = true;
      const fetchCountries = async () => {
        try {
          setCountriesLoading(true);
          setCountriesError(null);
          const res = await API.get("/reference/countries");
          const data = res?.data;

          let options: CountryOption[] = [];
          if (Array.isArray(data)) {
            options = data
              .map((item: any): CountryOption | null => {
                if (typeof item === "string") {
                  return { value: item, label: item };
                }
                if (item && typeof item === "object") {
                  const label = (item.name ?? item.label ?? item.country ?? "").toString();
                  const valueRaw = (item.code ?? item.id ?? item.value ?? label);
                  const value = valueRaw != null ? String(valueRaw) : label;
                  if (label || value) {
                    return { value, label: label || value };
                  }
                }
                return null;
              })
              .filter(Boolean) as CountryOption[];
          }

          if (mounted) {
            setCountries(options);
            // Preselect first country if none chosen
            if (!country && options.length > 0) {
              setCountry(options[0].value);
            }
          }
        } catch (err: any) {
          if (mounted) setCountriesError(err?.message ?? "Failed to load countries");
        } finally {
          if (mounted) setCountriesLoading(false);
        }
      };

      fetchCountries();
      return () => {
        mounted = false;
      };
    }, []);
  const handleSubmitStep0 = async () => {
    setSubmitError(null);
    // Basic validation for required fields
    console.log("Submitting:", { typeOfBuyer, companyName, country, companyEmail, companyPhone, companyPhoneCountryCode });
    if (!typeOfBuyer || !companyName || !country || !companyEmail || !companyPhone || !companyPhoneCountryCode) {
      setSubmitError("Please complete all required fields.");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        country,
        companyName,
        companyEmail,
        companyPhone,
        companyPhoneCountryCode,
        typeOfBuyer,
      };
      await API.post("/vendor/onboarding/step0", payload);
      onNext();
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Failed to submit";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    
    <>

        <div className="max-w-[1200px] mx-auto bg-[#F3EDE3] p-8 shadow-sm">
    
          {/* TITLE */}
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-[20px] font-bold uppercase text-black"
              style={{ fontFamily: "Orbitron" }}
            >
              Organization / Buyer Information
            </h2>
    
            {/* collapse icon (optional) */}
            <span className="text-xl cursor-pointer">⌃</span>
          </div>
    
          {/* FORM GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 text-sm text-black">
    
            {/* Type of Buyer */}
            <div>
              <label className="font-semibold mb-1 block">Type of Buyer:</label>
              <select
                className="w-full border border-[#C7B88A] bg-transparent px-3 py-2 focus:outline-none"
                value={typeOfBuyer}
                onChange={(e) => setTypeOfBuyer(e.target.value)}
              >
                {buyerTypesLoading && <option>Loading...</option>}
                {buyerTypesError && !buyerTypesLoading && (
                  <option>Error loading buyer types</option>
                )}
                {!buyerTypesLoading && !buyerTypesError && buyerTypes.length === 0 && (
                  <option>No types available</option>
                )}
                {!buyerTypesLoading && !buyerTypesError &&
                  buyerTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
              </select>
            </div>
    
            {/* Company Name */}
            <div>
              <label className="font-semibold mb-1 block">
                Company / Organization Name:
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full border border-[#C7B88A] bg-transparent px-3 py-2 focus:outline-none"
              />
            </div>
    
            {/* Country & City */}
            <div>
              <label className="font-semibold mb-1 block">
                Country & City of Registration:
              </label>
              <select
                className="w-full border border-[#C7B88A] bg-transparent px-3 py-2 focus:outline-none"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {countriesLoading && <option>Loading...</option>}
                {countriesError && !countriesLoading && (
                  <option>Error loading countries</option>
                )}
                {!countriesLoading && !countriesError && countries.length === 0 && (
                  <option>No countries available</option>
                )}
                {!countriesLoading && !countriesError &&
                  countries.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
              </select>
            </div>
    
            {/* Company Email */}
            <div>
              <label className="font-semibold mb-1 block">Company Email:</label>
              <input
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                className="w-full border border-[#C7B88A] bg-transparent px-3 py-2 focus:outline-none"
              />
            </div>

            {/* Company Phone */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="font-semibold mb-1 block">Country Code:</label>
                <input
                  type="text"
                  value={companyPhoneCountryCode}
                  onChange={(e) => setCompanyPhoneCountryCode(e.target.value)}
                  className="w-full border border-[#C7B88A] bg-transparent px-3 py-2 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="font-semibold mb-1 block">Company Phone:</label>
                <input
                  type="tel"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  className="w-full border border-[#C7B88A] bg-transparent px-3 py-2 focus:outline-none"
                />
              </div>
            </div>

            {/* Year */}
            <div>
              <label className="font-semibold mb-1 block">
                Year of Establishment:
              </label>
              <input
                type="text"
                placeholder="Office Address / Address Line"
                className="w-full border border-[#C7B88A] bg-transparent px-3 py-2 focus:outline-none"
              />
            </div>
    
            {/* Physical Address */}
            <div>
              <label className="font-semibold mb-1 block">
                Physical Address:
              </label>
              <input
                type="text"
                placeholder="eg : Warehouse No. 12, Al Quasis Industrial Area 3, Dubai, United Arab Emirates"
                className="w-full border border-[#C7B88A] bg-transparent px-3 py-2 focus:outline-none"
              />
            </div>
    
            {/* Website */}
            <div>
              <label className="font-semibold mb-1 block">
                Website (if any):
              </label>
              <input
                type="text"
                placeholder="eg: www.blueweb2.com"
                className="w-full border border-[#C7B88A] bg-transparent px-3 py-2 focus:outline-none"
              />
            </div>
          </div>
    
          {/* UPLOAD SECTION */}
          <div className="mt-6">
            <label className="font-semibold mb-2 block text-sm">
              Govt. or Compliance Registration (MOD, EOCN, etc.):
            </label>
    
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile(file);
                }
              }}
              accept=".jpeg,.jpg,.png,.pdf,.mp4"
              className="hidden"
            />
            
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  setSelectedFile(file);
                }
              }}
              className="border border-dashed border-[#C7B88A] rounded-sm py-10 text-center bg-[#EFE8DC] cursor-pointer hover:bg-[#E5DDD1] transition-colors"
            >
              <div className="flex flex-col items-center gap-2">
                <Image
                  src="/icons/upload.png"
                  alt="upload"
                  width={28}
                  height={28}
                />
                {selectedFile ? (
                  <>
                    <p className="text-sm text-black font-semibold">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-black">
                      Choose a File or Drag & Drop It Here.
                    </p>
                    <p className="text-xs text-gray-600">
                      JPEG, PNG, PDF, and MP4 formats, up to 10 MB.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
    
          {/* NEXT BUTTON */}
          <div className="flex justify-center mt-10">
            <button
              onClick={handleSubmitStep0}
              className="w-[280px] h-[42px] bg-[#D35400] text-white font-black font-orbitron clip-path-supplier uppercase text-sm hover:bg-[#39482C] transition-colors"
            >
              {submitting ? "Submitting..." : "Next"}
            </button>
          </div>

          {/* Submit error */}
          {submitError && (
            <p className="mt-3 text-center text-sm text-red-600">{submitError}</p>
          )}
        </div>
    </>
  );
}
