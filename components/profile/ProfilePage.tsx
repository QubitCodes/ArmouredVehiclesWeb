"use client";

import { useState } from "react";
import Image from "next/image";

// Country codes data
const countryCodes = [
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
];

// Nationalities
const nationalities = [
  "Emirati",
  "Saudi",
  "Qatari",
  "Bahraini",
  "Omani",
  "Kuwaiti",
  "American",
  "British",
  "Indian",
  "Pakistani",
  "Filipino",
  "Egyptian",
  "Jordanian",
  "Lebanese",
  "Syrian",
  "Other",
];

export default function ProfilePage() {
  // Contact Information
  const [email] = useState("info@john.martin.com");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+971");
  const [phoneNumber, setPhoneNumber] = useState("58-234-6790");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // Personal Information
  const [fullName, setFullName] = useState("John Martin");
  const [nationality, setNationality] = useState("");
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("male");

  // Edit states
  const [editingFullName, setEditingFullName] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{
    fullName?: string;
    phoneNumber?: string;
    nationality?: string;
    birthday?: string;
  }>({});

  const selectedCountry = countryCodes.find((c) => c.code === phoneCountryCode);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Validate Full Name
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    // Validate Phone Number
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[\d-]+$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    // Validate Nationality
    if (!nationality) {
      newErrors.nationality = "Please select your nationality";
    }

    // Validate Birthday
    if (!birthday) {
      newErrors.birthday = "Please select your birthday";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = () => {
    if (!validateForm()) {
      return;
    }

    // Handle profile update
    console.log("Profile updated:", {
      email,
      phoneCountryCode,
      phoneNumber,
      fullName,
      nationality,
      birthday,
      gender,
    });

    // Show success message or redirect
    alert("Profile updated successfully!");
  };

  return (
    <main className="flex-1">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-orbitron font-black text-xl lg:text-[32px] uppercase tracking-wide text-black">
          Profile
        </h1>
        <a href="#" className="font-inter text-sm text-[#D35400] underline hover:text-[#B84700]">
          View & Update Your Personal and Contact Information
        </a>
      </div>

      {/* Contact Information */}
      <div className="bg-[#EBE3D6] p-5 lg:p-6 mb-6">
        <h2 className="font-orbitron font-black text-base lg:text-lg uppercase tracking-wide text-black mb-4">
          Contact Information
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Email */}
          <div>
            <label className="block font-inter font-semibold text-[16px] leading-[24px] text-black mb-2">Email</label>
            <div className="bg-[#F0EBE3] border border-[#E8E3D9] px-4 py-3">
              <span className="font-inter text-sm text-black">{email}</span>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block font-inter font-semibold text-[16px] leading-[24px] text-black mb-2">Phone Number</label>
            <div className="flex items-center bg-[#F0EBE3] border border-[#E8E3D9]">
              {/* Country Code Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  className="flex items-center gap-2 px-3 py-3 border-r border-[#E8E3D9] hover:bg-[#F5F5F5]"
                >
                  <Image
                    src="/icons/flags/uae.svg"
                    alt="UAE"
                    width={24}
                    height={16}
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <span className="text-lg">{selectedCountry?.flag}</span>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {showCountryDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#E8E3D9] shadow-lg z-10 max-h-48 overflow-y-auto">
                    {countryCodes.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => {
                          setPhoneCountryCode(country.code);
                          setShowCountryDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#F5F5F5] text-left"
                      >
                        <span className="text-lg">{country.flag}</span>
                        <span className="font-inter text-sm text-black">{country.code}</span>
                        <span className="font-inter text-xs text-[#666]">{country.country}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Phone Input */}
              <input
                type="tel"
                value={`${phoneCountryCode}-${phoneNumber}`}
                onChange={(e) => setPhoneNumber(e.target.value.replace(phoneCountryCode + "-", ""))}
                className="flex-1 px-3 py-3 font-inter text-sm text-black bg-transparent outline-none"
                readOnly={!editingPhone}
              />

              {/* Edit Button */}
              <button
                onClick={() => setEditingPhone(!editingPhone)}
                className="px-3 py-3 hover:bg-[#F5F5F5]"
              >
                <Image
                  src="/order/pfsv1.svg"
                  alt="Edit"
                  width={16}
                  height={16}
                  className="object-contain"
                />
              </button>
            </div>
            {errors.phoneNumber && (
              <p className="font-inter text-xs text-[#D35400] mt-1">{errors.phoneNumber}</p>
            )}
            <p className="font-inter text-xs text-[#666] mt-2">
              This contact information can be used to log in across all Armored Mart platforms.
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-[#EBE3D6] p-5 lg:p-6 mb-6">
        <h2 className="font-orbitron font-black text-base lg:text-lg uppercase tracking-wide text-black mb-4">
          Personal Information
        </h2>

        {/* Full Name and Nationality Row - 8/4 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mb-4 lg:mb-6">
          {/* Full Name - 8 columns */}
          <div className="lg:col-span-8">
            <label className="block font-inter font-semibold text-[16px] leading-[24px] text-black mb-2">Full Name</label>
            <div className={`flex items-center bg-[#F0EBE3] border ${errors.fullName ? 'border-[#D35400]' : 'border-[#E8E3D9]'}`}>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }));
                }}
                className="flex-1 px-4 py-3 font-inter text-sm text-black bg-transparent outline-none"
                readOnly={!editingFullName}
              />
              <button
                onClick={() => setEditingFullName(!editingFullName)}
                className="px-3 py-3 hover:bg-[#F5F5F5]"
              >
                <Image
                  src="/order/pfsv1.svg"
                  alt="Edit"
                  width={16}
                  height={16}
                  className="object-contain"
                />
              </button>
            </div>
            {errors.fullName && (
              <p className="font-inter text-xs text-[#D35400] mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Nationality - 4 columns */}
          <div className="lg:col-span-4">
            <label className="block font-inter font-semibold text-[16px] leading-[24px] text-black mb-2">Nationality</label>
            <div className="relative">
              <button
                onClick={() => setShowNationalityDropdown(!showNationalityDropdown)}
                className={`w-full flex items-center justify-between bg-[#F0EBE3] border ${errors.nationality ? 'border-[#D35400]' : 'border-[#E8E3D9]'} px-4 py-3`}
              >
                <span className={`font-inter text-sm ${nationality ? "text-black" : "text-[#D35400]"}`}>
                  {nationality || "Select Nationality"}
                </span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {showNationalityDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E8E3D9] shadow-lg z-10 max-h-48 overflow-y-auto">
                  {nationalities.map((nat) => (
                    <button
                      key={nat}
                      onClick={() => {
                        setNationality(nat);
                        setShowNationalityDropdown(false);
                        if (errors.nationality) setErrors(prev => ({ ...prev, nationality: undefined }));
                      }}
                      className="w-full px-4 py-2 text-left font-inter text-sm text-black hover:bg-[#F5F5F5]"
                    >
                      {nat}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.nationality && (
              <p className="font-inter text-xs text-[#D35400] mt-1">{errors.nationality}</p>
            )}
          </div>
        </div>

        {/* Birthday and Gender Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Birthday */}
          <div>
            <label className="block font-inter font-semibold text-[16px] leading-[24px] text-black mb-2">Birthday</label>
            <div className="relative">
              <input
                type="date"
                value={birthday}
                onChange={(e) => {
                  setBirthday(e.target.value);
                  if (errors.birthday) setErrors(prev => ({ ...prev, birthday: undefined }));
                }}
                className={`w-full bg-[#F0EBE3] border ${errors.birthday ? 'border-[#D35400]' : 'border-[#E8E3D9]'} px-4 py-3 pr-10 font-inter text-sm text-black outline-none cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                style={{ colorScheme: 'light' }}
              />
              {/* Calendar Icon */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2V5" stroke="#666" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 2V5" stroke="#666" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.5 9.09H20.5" stroke="#666" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#666" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.6947 13.7H15.7037" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.6947 16.7H15.7037" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.9955 13.7H12.0045" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.9955 16.7H12.0045" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.29431 13.7H8.30329" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.29431 16.7H8.30329" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            {errors.birthday ? (
              <p className="font-inter text-xs text-[#D35400] mt-1">{errors.birthday}</p>
            ) : (
              <p className="font-inter text-xs text-[#666] mt-1">
                This cannot be changed later.
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block font-inter font-semibold text-[16px] leading-[24px] text-black mb-2">Gender</label>
            <div className="flex items-center gap-6 h-[46px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setGender("male")}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    gender === "male" ? "border-[#D35400]" : "border-[#C2B280]"
                  }`}
                >
                  {gender === "male" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#D35400]"></div>
                  )}
                </div>
                <span className="font-inter text-sm text-black">Male</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setGender("female")}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    gender === "female" ? "border-[#D35400]" : "border-[#C2B280]"
                  }`}
                >
                  {gender === "female" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#D35400]"></div>
                  )}
                </div>
                <span className="font-inter text-sm text-black">Female</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Update Profile Button */}
      <div className="flex justify-end">
        <button
          onClick={handleUpdateProfile}
          className="bg-[#D35400] hover:bg-[#39482C] text-white clip-path-supplier-refund flex items-center justify-center h-[45px] px-[40px] cursor-pointer transition-colors"
        >
          <span className="font-black text-[16px] font-orbitron uppercase">Update Profile</span>
        </button>
      </div>
    </main>
  );
}

