"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const addressLabels = [
  "Head Office",
  "Warehouse",
  "Branch Office",
  "Factory / Plant",
  "Agency",
  "Service Center",
];

interface ValidationErrors {
  fullAddress?: string;
  fullName?: string;
  phoneNumber?: string;
}

export default function AddressDetailsPage() {
  const router = useRouter();
  
  const [location, setLocation] = useState({
    area: "Al Qusais",
    city: "Dubai",
    country: "United Arab Emirates",
  });
  const [fullAddress, setFullAddress] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [isDefault, setIsDefault] = useState(true);
  const [fullName, setFullName] = useState("John Martin");
  const [phoneCode, setPhoneCode] = useState("+971");
  const [phoneNumber, setPhoneNumber] = useState("58-234-6790");
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Load saved location from localStorage
  useEffect(() => {
    const savedAddress = localStorage.getItem("newAddress");
    if (savedAddress) {
      try {
        const parsed = JSON.parse(savedAddress);
        if (parsed.address) {
          const parts = parsed.address.split(", ");
          setLocation({
            area: parts[0] || "Al Qusais",
            city: parts[1] || "Dubai",
            country: parts.slice(2).join(", ") || "United Arab Emirates",
          });
        }
      } catch (e) {
        console.error("Error parsing address:", e);
      }
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Full Address validation
    if (!fullAddress.trim()) {
      newErrors.fullAddress = "Full address is required";
    } else if (fullAddress.trim().length < 5) {
      newErrors.fullAddress = "Please enter a valid address";
    }

    // Full Name validation
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Please enter a valid name";
    }

    // Phone Number validation
    const phoneDigits = phoneNumber.replace(/\D/g, "");
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (phoneDigits.length < 7) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {

    
    if (!validateForm()) {
      console.log("Validation failed");
      return;
    }



    // Save the complete address
    const completeAddress = {
      id: String(Date.now()),
      location,
      fullAddress,
      label: selectedLabel || "Home",
      isDefault,
      contact: {
        fullName,
        phone: `${phoneCode}-${phoneNumber}`,
      },
      timestamp: Date.now(),
    };


    localStorage.setItem("newAddress", JSON.stringify(completeAddress));

    router.push("/address?new=true");
  };

  const clearError = (field: keyof ValidationErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <main className="flex-1">
      {/* Back Link */}
      <Link
        href="/address/new"
        className="inline-flex items-center gap-2 text-[#666] hover:text-black transition-colors mb-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="font-inter text-sm">Back to Addresses</span>
      </Link>

      {/* Title */}
      <h1 className="font-orbitron font-black text-xl lg:text-[32px] uppercase tracking-wide text-black">
        Add New Address
      </h1>
      <p className="font-inter text-sm text-[#666] mt-1 mb-6">
        Select your location on the map for faster delivery
      </p>

      {/* Location Details Section */}
      <div className="bg-[#EBE3D6] border border-[#E8E3D9] p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-orbitron font-black text-base uppercase tracking-wide text-black">
            Location Details
          </h2>
          <Image
            src="/icons/flags/uae.svg"
            alt="UAE"
            width={24}
            height={16}
            className="object-contain"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map Preview */}
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-[#E8E3D9] shrink-0 overflow-hidden">
              <Image
                src="/order/mapreview.svg"
                alt="Map Preview"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-inter font-semibold text-sm text-black">{location.area},</p>
              <p className="font-inter font-semibold text-sm text-black">{location.city},</p>
              <p className="font-inter text-sm text-black">{location.country}</p>
            </div>
          </div>

          {/* Full Address Input */}
          <div>
            <label className="block font-inter text-sm text-black mb-2">Full Address</label>
            <input
              type="text"
              placeholder="e.g. Apartment 4, Building name, Street 3"
              value={fullAddress}
              onChange={(e) => {
                setFullAddress(e.target.value);
                clearError("fullAddress");
              }}
              className={`w-full bg-[#F0EBE3] border px-4 py-3 font-inter text-sm text-black placeholder-[#999] outline-none focus:border-[#D35400] ${
                errors.fullAddress ? "border-[#D35400]" : "border-[#C2B280]"
              }`}
            />
            {errors.fullAddress && (
              <p className="font-inter text-xs text-[#D35400] mt-1">{errors.fullAddress}</p>
            )}
          </div>
        </div>

        {/* Address Label */}
        <div className="mt-6">
          <label className="block font-inter text-sm text-[#666] mb-3">
            Address Label <span className="text-[#999]">(optional)</span>
          </label>
          <div className="flex flex-wrap gap-4">
            {addressLabels.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setSelectedLabel(selectedLabel === label ? "" : label)}
                className="inline-flex items-center gap-2 cursor-pointer"
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedLabel === label
                      ? "border-[#D35400]"
                      : "border-[#C2B280]"
                  }`}
                >
                  {selectedLabel === label && (
                    <div className="w-2 h-2 rounded-full bg-[#D35400]" />
                  )}
                </div>
                <span className="font-inter text-sm text-black">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Set as Default Toggle */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => setIsDefault(!isDefault)}
            className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${
              isDefault ? "bg-[#D35400]" : "bg-[#C2B280]"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 shadow ${
                isDefault ? "translate-x-[26px] left-0.5" : "translate-x-0 left-0.5"
              }`}
            />
          </button>
          <span className="font-inter text-sm text-black">Set as Default Address</span>
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="bg-[#EBE3D6] border border-[#E8E3D9] p-5 mb-6">
        <h2 className="font-orbitron font-black text-base uppercase tracking-wide text-black mb-4">
          Your Contact Details
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block font-inter text-sm text-black mb-2">Full Name</label>
            <div className={`flex items-center bg-[#F0EBE3] border ${
              errors.fullName ? "border-[#D35400]" : "border-[#C2B280]"
            }`}>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  clearError("fullName");
                }}
                className="flex-1 px-4 py-3 font-inter text-sm text-black bg-transparent outline-none"
              />
              <button 
                type="button"
                onClick={() => setFullName("")}
                className="px-3 py-3 hover:bg-[#E8E3D9]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#666" strokeWidth="1.5"/>
                  <path d="M15 9L9 15M9 9L15 15" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            {errors.fullName && (
              <p className="font-inter text-xs text-[#D35400] mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block font-inter text-sm text-black mb-2">Phone Number</label>
            <div className={`flex items-center bg-[#F0EBE3] border ${
              errors.phoneNumber ? "border-[#D35400]" : "border-[#C2B280]"
            }`}>
              {/* Country Code Dropdown */}
              <div className="flex items-center gap-2 px-3 py-3 border-r border-[#C2B280]">
                <Image
                  src="/icons/flags/uae.svg"
                  alt="UAE"
                  width={20}
                  height={14}
                  className="object-contain"
                />
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                type="tel"
                value={`${phoneCode}-${phoneNumber}`}
                onChange={(e) => {
                  const value = e.target.value.replace(phoneCode + "-", "");
                  setPhoneNumber(value);
                  clearError("phoneNumber");
                }}
                className="flex-1 px-4 py-3 font-inter text-sm text-black bg-transparent outline-none"
              />
            </div>
            {errors.phoneNumber && (
              <p className="font-inter text-xs text-[#D35400] mt-1">{errors.phoneNumber}</p>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-[#D35400] hover:bg-[#39482C] text-white clip-path-supplier flex items-center justify-center h-11 px-8 cursor-pointer transition-colors"
        >
          <span className="font-black text-[14px] font-orbitron uppercase">Save Address</span>
        </button>
      </div>
    </main>
  );
}
