"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText, ShieldCheck } from "lucide-react";
import { Pencil } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { ShieldAlert } from "lucide-react";

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

const regions = [
  { name: "United Arab Emirates", code: "UAE", flag: "/icons/flags/uae.svg" },
  { name: "Saudi Arabia", code: "KSA", flag: "/icons/flags/ksa.png" },
  { name: "Qatar", code: "QAT", flag: "/icons/flags/qatar.png" },
  { name: "Oman", code: "OMN", flag: "/icons/flags/oman.png" },
];

export default function ProfilePage() {
  // Contact Information
  const [email] = useState("info@john.martin.com");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+971");
  const [phoneNumber, setPhoneNumber] = useState("58-234-6790");

  // Personal Information
  const [fullName, setFullName] = useState("John Martin");
  const [username] = useState("john.martin");


  // Edit states
  const [editingFullName, setEditingFullName] = useState(false);


  // Validation errors
  const [errors, setErrors] = useState<{
    fullName?: string;
    phoneNumber?: string;
    nationality?: string;
    birthday?: string;
  }>({});


  const [modStatus, setModStatus] = useState<"APPROVED" | "PENDING">("APPROVED");
  const [econStatus, setEconStatus] = useState<"APPROVED" | "PENDING">("APPROVED");

  const [modFileName, setModFileName] = useState("MOD-License.pdf");
  const [econFileName, setEconFileName] = useState("ECON-Certificate.pdf");
  ;

  const [idStatus, setIdStatus] = useState<"APPROVED" | "PENDING">("APPROVED");
  const [idFileName, setIdFileName] = useState("EmiratesID-JohnMartin.pdf");



  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Validate Full Name
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }



    // Validate Nationality
  

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
   
    });

    // Show success message or redirect
    alert("Profile updated successfully!");
  };

  const handleModReplace = (file: File) => {
    setModFileName(file.name);
    setModStatus("PENDING");

    // later → API call
    // uploadDocument({ type: "MOD", file });
  };

  const handleEconReplace = (file: File) => {
    setEconFileName(file.name);
    setEconStatus("PENDING");

    // later → API call
    // uploadDocument({ type: "ECON", file });
  };


  const handleIdReplace = (file: File) => {
    setIdFileName(file.name);
    setIdStatus("PENDING");

    // Later → backend
    // uploadDocument({ type: "ID", file });
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
            <label className="block font-inter font-semibold text-[16px] leading-[24px] text-black mb-2">
              Email
            </label>

            <div className="flex items-center justify-between bg-[#F0EBE3] border border-[#E8E3D9] px-4 py-3">
              <span className="font-inter text-sm text-black">
                {email}
              </span>

             
            </div>
          </div>



          {/* Phone Number */}
          <div>
            <label className="block font-inter font-semibold text-[16px] leading-[24px] text-black mb-2">
              Phone Number
            </label>

            <div className="flex items-center justify-between bg-[#F0EBE3] border border-[#E8E3D9] px-4 py-3">
              <span className="font-inter text-sm text-black">
                {phoneCountryCode} {phoneNumber}
              </span>

              <button
                onClick={() => window.location.href = "/add-phone"}
                className="p-1 rounded hover:bg-[#E6E0D6] transition"
                aria-label="Edit phone number"
              >
                <Pencil className="w-4 h-4 text-[#D35400]" />
              </button>

            </div>

            <p className="font-inter text-xs text-[#666] mt-2">
              This contact information is used for login and verification.
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

            </div>
            {errors.fullName && (
              <p className="font-inter text-xs text-[#D35400] mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* username */}
          <div className="lg:col-span-4">
            <label className="block font-inter font-semibold text-[16px] leading-[24px] text-black mb-2">
              Username
            </label>

            <div className="flex items-center bg-[#F0EBE3] border border-[#E8E3D9]">
              <input
                type="text"
                value={username}
                readOnly
                className="flex-1 px-4 py-3 font-inter text-sm text-black bg-transparent outline-none cursor-not-allowed"
              />

              {/* <button
                onClick={() => window.location.href = "/change-username"}
                className="px-3 py-3 hover:bg-[#F5F5F5]"
                title="Change username"
              >
                <Pencil className="w-4 h-4 text-[#D35400]" />
              </button> */}
            </div>

            <p className="font-inter text-xs text-[#666] mt-1">
              Username was set during registration and can be changed only once.
            </p>
          </div>


        </div>


      </div>




      {/* Organization / Buyer Information */}
      <div className="bg-[#EBE3D6] p-5 lg:p-6 mb-6 text-black">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <p className="text-xs text-green-600 mb-1">
              Organization information is locked after onboarding verification.
            </p>

            <h2 className="font-orbitron font-black text-base lg:text-lg uppercase tracking-wide text-black">
              Organization / Buyer Information
            </h2>


          </div>


        </div>



        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <label className="profile-label font-semibold">Type of Buyer</label>
            <div className="profile-view">Government Entity</div>
          </div>

          <div>
            <label className="profile-label font-semibold">Company / Organization Name</label>
            <div className="profile-view">Blueweb LLC</div>
          </div>

          <div>
            <label className="profile-label font-semibold">Country & City of Registration</label>
            <div className="profile-view">United Arab Emirates, Dubai</div>
          </div>

          <div>
            <label className="profile-label font-semibold">Year of Establishment</label>
            <div className="profile-view">2014</div>
          </div>

          <div className="lg:col-span-2">
            <label className="profile-label font-semibold">Physical Address</label>
            <div className="profile-view">
              Warehouse No. 12, Al Qusais Industrial Area 3, Dubai
            </div>
          </div>

          <div className="lg:col-span-2">
            <label className="profile-label font-semibold">Website</label>
            <div className="profile-view">www.blueweb2.com</div>
          </div>
        </div>

        <div className="mt-4">
          <label className="profile-label font-semibold">
            Govt. / Compliance Registration Documents
          </label>
          <div className="mt-2 space-y-2">
            {/* MOD License */}
            <div className="flex items-center gap-3 bg-[#F0EBE3] border border-dashed border-[#E8E3D9] px-4 py-3 rounded-md">
              <FileText className="w-5 h-5 text-[#D35400]" />

              <div className="flex-1 text-sm">
                <p className="font-medium text-black">{modFileName}</p>
                <p className="text-xs text-gray-500">
                  {modStatus === "APPROVED"
                    ? "Government approved document"
                    : "New document submitted — awaiting admin verification"}
                </p>
              </div>

              {/* Status */}
              {modStatus === "APPROVED" ? (
                <ShieldCheck className="w-4 h-4 text-green-600" />
              ) : (
                <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                  Under Review
                </span>
              )}

              {/* Replace (disabled when pending) */}
              <label
                className={`ml-3 text-sm ${modStatus === "PENDING"
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-[#D35400] cursor-pointer hover:underline"
                  }`}
              >
                edit
                <input
                  type="file"
                  accept=".pdf"
                  disabled={modStatus === "PENDING"}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleModReplace(file);
                  }}
                />
              </label>
            </div>


            {/* ECON Certificate */}
            <div className="flex items-center gap-3 bg-[#F0EBE3] border border-dashed border-[#E8E3D9] px-4 py-3 rounded-md">
              <FileText className="w-5 h-5 text-[#D35400]" />

              <div className="flex-1 text-sm">
                <p className="font-medium text-black">{econFileName}</p>
                <p className="text-xs text-gray-500">
                  {econStatus === "APPROVED"
                    ? "Compliance registration document"
                    : "New document submitted — awaiting admin verification"}
                </p>
              </div>

              {econStatus === "APPROVED" ? (
                <ShieldCheck className="w-4 h-4 text-green-600" />
              ) : (
                <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                  Under Review
                </span>
              )}

              <label
                className={`ml-3 text-sm ${econStatus === "PENDING"
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#D35400] cursor-pointer hover:underline"
                  }`}
              >
                edit
                <input
                  type="file"
                  accept=".pdf"
                  disabled={econStatus === "PENDING"}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleEconReplace(file);
                  }}
                />
              </label>
            </div>

          </div>

          {/* Section-level note */}
          <p className="text-xs text-[#666] mt-2">
            Uploading a new document requires admin verification.
            The currently verified document remains active until approval.
          </p>




        </div>

      </div>





      {/* Authorized Buyer Contact */}
      <div className="bg-[#EBE3D6] p-5 lg:p-6 mb-6 text-black">
        {/* Status note */}
        <p className="text-xs font-inter text-green-600 mb-1">
          Authorized buyer contact details are verified and locked.
        </p>

        {/* Heading */}
        <h2 className="font-orbitron font-black text-base lg:text-lg uppercase tracking-wide text-black mb-4">
          Authorized Buyer Contact
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Full Name */}
          <div className="lg:col-span-2">
            <label className="profile-label font-semibold">Full Name:</label>
            <div className="profile-view">John Martin</div>

          </div>

          {/* Job Title */}
          <div>
            <label className="profile-label font-semibold">Job Title / Designation:</label>
            <div className="profile-view">Procurement Manager</div>
          </div>

          {/* Official Email */}
          <div>
            <label className="profile-label font-semibold">Official Email Address:</label>
            <div className="profile-view">john.martin@blueweb2.com</div>
          </div>

          {/* ID Document */}
          <div>
            <label className="profile-label font-semibold">
              Passport Copy / Emirates ID:
            </label>

            <div className="flex items-center justify-between bg-[#F0EBE3] border border-dashed border-[#E8E3D9] px-4 py-3 rounded-md">
              {/* Left: File info */}
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#D35400]" />

                <div className="text-sm">
                  <p className="font-medium text-black">{idFileName}</p>
                  <p className="text-xs text-gray-500">
                    {idStatus === "APPROVED"
                      ? "Verified document"
                      : "New document submitted — awaiting admin verification"}
                  </p>
                </div>
              </div>

              {/* Right: Status + Replace */}
              <div className="flex items-center gap-3">
                {idStatus === "APPROVED" ? (
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                ) : (
                  <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                    Under Review
                  </span>
                )}

                <label
                  className={`text-sm ${idStatus === "PENDING"
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#D35400] cursor-pointer hover:underline"
                    }`}
                >
                  edit
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    disabled={idStatus === "PENDING"}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleIdReplace(file);
                    }}
                  />
                </label>
              </div>
            </div>


            {/* Section-level note (optional, if not already shown above) */}
            <p className="text-xs text-[#666] mt-2">
              Uploading a new ID document requires admin verification.
              The currently verified document remains active until approval.
            </p>
          </div>


          {/* Mobile / WhatsApp */}
          <div>
            <label className="profile-label font-semibold">Mobile / WhatsApp Number:</label>
            <div className="profile-view"> +971 58 234 6790</div>
          </div>
        </div>

      </div>




      {/* Compliance & End-Use Declaration */}
      <div className="bg-[#EBE3D6] p-5 lg:p-6 mb-6 text-black">
        {/* Status note */}
        <p className="text-xs font-inter text-green-600 mb-1">
          Compliance declaration is verified and legally binding.
        </p>

        {/* Heading */}
        <h2 className="font-orbitron font-black text-base lg:text-lg uppercase tracking-wide text-black mb-4">
          Compliance & End-Use Declaration
        </h2>

        {/* Purpose & End-User */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <label className="profile-label font-semibold">Purpose of Procurement</label>
            <div className="profile-view">Internal Use</div>
          </div>

          <div>
            <label className="profile-label font-semibold">End-User Type</label>
            <div className="profile-view">Military</div>
          </div>
        </div>

        {/* Countries */}
        <div className="mt-5">
          <label className="profile-label font-semibold">Countries of Use / Export</label>
          <div className="bg-[#F0EBE3] border border-[#E8E3D9] p-4 mt-2 rounded-md">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Service Regions
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {regions.map((region) => (
                <div
                  key={region.code}
                  className="flex items-center gap-3 bg-white border border-[#E8E3D9] rounded-md px-3 py-2"
                >
                  <Image
                    src={region.flag}
                    alt={region.name}
                    width={28}
                    height={20}
                    className="object-contain"
                  />

                  <div className="text-sm leading-tight">
                    <p className="font-medium text-gray-900">
                      {region.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {region.code}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controlled items */}
        <div className="mt-5">
          <label className="profile-label font-semibold">
            Do you require controlled items?
          </label>

          <div className="flex gap-6 mt-2">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-[#C2B280] flex items-center justify-center">
                {/* empty */}
              </span>
              <span className="text-sm text-[#666]">Yes</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-[#D35400] flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#D35400]" />
              </span>
              <span className="text-sm text-black font-medium">No</span>
            </div>
          </div>
        </div>

        {/* Compliance agreement */}
        <div className="mt-5 bg-[#F0EBE3] border border-[#E8E3D9] p-4">
          <p className="text-sm font-inter text-black">
            ✓ I acknowledge that all transactions are subject to UAE and international
            laws and may be screened, paused, or reported in accordance with ArmoredMart’s
            regulatory obligations.
          </p>
        </div>


      </div>




      {/* Account Setup */}
      <div className="bg-[#EBE3D6] p-5 lg:p-6 mb-6 text-black">
        {/* Status note */}
        <p className="text-xs font-inter text-green-600 mb-1">
          Account preferences were finalized during onboarding.
        </p>

        {/* Heading */}
        <h2 className="font-orbitron font-black text-base lg:text-lg uppercase tracking-wide text-black mb-4">
          Account Setup
        </h2>

        {/* Categories */}
        <div className="mb-5">
          <label className="profile-label font-semibold">
            Categories Selected for Purchase
          </label>

          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <span>Engine Systems</span>
            </li>

            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <span>Braking Systems</span>
            </li>

            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <span>Runflat & Tire Systems</span>
            </li>

            <li className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-[#D35400] mt-0.5" />
              <div>
                <span>Turrets & Mounts</span>
                <span className="block text-xs text-gray-500">
                  Controlled item – MOD / ECON
                </span>
              </div>
            </li>

            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <span>Countermeasures</span>
            </li>
          </ul>


        </div>

        {/* Register As + Currency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <label className="profile-label font-semibold">Registered As</label>
            <div className="profile-view">Buyer / End User</div>
          </div>

          <div>
            <label className="profile-label font-semibold">Preferred Currency</label>
            <div className="profile-view">AED</div>
          </div>
        </div>

        {/* Account status */}
        <div className="mt-5">
          <label className="profile-label font-semibold">Account Status</label>
          <div className="profile-view text-green-700 font-semibold">
            Approved
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

