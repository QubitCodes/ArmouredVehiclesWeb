"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FileText, ShieldCheck, Pencil, CheckCircle, ShieldAlert } from "lucide-react";
import api from "@/lib/api";
import API from "@/app/services/api"; // Direct Axios instance for references
import { User } from "@/lib/types";

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

const regions = [
  { name: "United Arab Emirates", code: "UAE", flag: "/icons/flags/uae.svg" },
  { name: "Saudi Arabia", code: "KSA", flag: "/icons/flags/ksa.png" },
  { name: "Qatar", code: "QAT", flag: "/icons/flags/qatar.png" },
  { name: "Oman", code: "OMN", flag: "/icons/flags/oman.png" },
];

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | any>(null);

  // States for editable fields
  const [fullName, setFullName] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+971");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Documents States (from profile)
  const [modStatus, setModStatus] = useState<"APPROVED" | "PENDING">("PENDING");
  const [econStatus, setEconStatus] = useState<"APPROVED" | "PENDING">("PENDING");
  const [idStatus, setIdStatus] = useState<"APPROVED" | "PENDING">("PENDING");

  const [modFileName, setModFileName] = useState("No Document");
  const [econFileName, setEconFileName] = useState("No Document");
  const [idFileName, setIdFileName] = useState("No Document");

  // Edit states
  const [editingFullName, setEditingFullName] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{
    fullName?: string;
    phoneNumber?: string;
  }>({});

  const getFileName = (url: string) => {
    try {
      return url.split('/').pop() || "Document.pdf";
    } catch {
      return "Document.pdf";
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userData = await api.user.getCurrent();
        setUser(userData);

        // Populate states
        if (userData) {
          setFullName(userData.name || "");

          if (userData.phone) {
            setPhoneNumber(userData.phone);
          }

          // Populate documents and other profile fields from the flattened userData
          const p: any = userData; // Use userData directly as the profile source

          // Phone State (if not already set from user root)
          if (!phoneNumber && p.mobile) setPhoneNumber(p.mobile);
          if (p.mobile_country_code) setPhoneCountryCode(p.mobile_country_code);

          // Map Documents
          // MOD -> Defense Approval
          if (p.defenseApprovalUrl || p.defense_approval_url) {
            setModFileName(getFileName(p.defenseApprovalUrl || p.defense_approval_url));
            setModStatus("APPROVED"); // Assuming existence means approved/submitted for now
          }
          // ECON -> Business License (or Govt Compliance)
          // The backend might return govt_compliance_reg_url OR business_license_url
          if (p.businessLicenseUrl || p.business_license_url) {
            setEconFileName(getFileName(p.businessLicenseUrl || p.business_license_url));
            setEconStatus("APPROVED");
          } else if (p.govt_compliance_reg_url) {
            setEconFileName(getFileName(p.govt_compliance_reg_url));
            setEconStatus("APPROVED");
          }

          // ID -> Contact ID
          if (p.contactIdDocumentUrl || p.contact_id_document_url) {
            setIdFileName(getFileName(p.contactIdDocumentUrl || p.contact_id_document_url));
            setIdStatus("APPROVED");
          }

          // Map Status
          // Using global onboarding status as proxy for document verification status for now
          const isApproved = (p.onboardingStatus && p.onboardingStatus.includes('approved')) || (p.onboarding_status && p.onboarding_status.includes('approved'));
          const status = isApproved ? "APPROVED" : "PENDING";

          setModStatus(status);
          setEconStatus(status);
          setIdStatus(status);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validateForm = () => {
    const newErrors: any = {};
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validateForm()) return;

    try {
      await api.auth.updateProfile({
        name: fullName,
      });
      alert("Profile updated successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to update profile.");
    }
  };

  const handleModReplace = (file: File) => {
    setModFileName(file.name);
    setModStatus("PENDING");
  };

  const handleEconReplace = (file: File) => {
    setEconFileName(file.name);
    setEconStatus("PENDING");
  };

  const handleIdReplace = (file: File) => {
    setIdFileName(file.name);
    setIdStatus("PENDING");
  };

  // Reference Data
  const [buyerTypes, setBuyerTypes] = useState<{ value: string, label: string }[]>([]);

  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const res = await API.get("/references/type-of-buyer");
        if (res?.data?.data) {
          setBuyerTypes(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch buyer types", err);
      }
    };
    fetchReferences();
  }, []);

  const getBuyerTypeLabel = (value?: string) => {
    if (!value) return "N/A";
    const found = buyerTypes.find(t => t.value === value || t.value === String(value));
    return found ? found.label : value;
  };

  if (loading) {
    return (
      <main className="flex-1 p-10 flex justify-center text-black">
        Loading Profile...
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex-1 p-10 flex justify-center text-black">
        <div className="text-center">
          <p className="mb-4">Please log in to view your profile.</p>
          <a href="/login" className="text-[#D35400] underline">Go to Login</a>
        </div>
      </main>
    );
  }

  // Safe accessors - Map camelCase API response to UI
  // Flattened User object IS the profile
  const p: any = user || {};

  // Use p directly for fields
  const companyName = p.company_name || p.companyName || p.registeredCompanyName || "N/A";
  const buyerType = p.buyerType?.name || p.type_of_buyer || p.buyer_type || p.companyType || "N/A"; // Prioritize relation then column
  const country = p.country || p.country_of_registration || "N/A";
  const city = p.city || "N/A";
  const yearEst = p.founded_year || p.foundedYear || p.yearOfEstablishment || p.year_of_establishment || "N/A";
  const address = p.address_line1 ? `${p.address_line1}, ${p.city || ""}` : (p.address || "N/A");
  const website = p.official_website || p.company_website || p.website || "N/A";

  const contactJob = p.job_title || p.authorizedContactRole || p.contactJobTitle || "N/A";
  const contactEmail = p.contact_email || p.authorizedContactEmail || p.contactWorkEmail || user.email;

  // Construct full phone with country code if available
  const contactPhoneRaw = p.mobile || p.authorizedContactPhone || p.contactMobile || user.phone;
  const contactCountryCode = p.mobile_country_code || "";
  const contactPhone = contactPhoneRaw ? (contactCountryCode ? `${contactCountryCode} ${contactPhoneRaw}` : contactPhoneRaw) : "N/A";

  // Compliance
  const procurement = p.procurement_purpose || (p.nature_of_business && typeof p.nature_of_business === 'string' ? p.nature_of_business : "N/A");
  const endUserType = p.end_user_type || "N/A";

  return (
    <main className="flex-1">
      {/* Header */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="font-orbitron font-black text-xl lg:text-[32px] uppercase tracking-wide text-black">
            My Profile
          </h1>
          <a href="#" className="font-inter text-sm text-[#D35400] underline hover:text-[#B84700]">
            Manage your account settings
          </a>
        </div>
        <div className={`inline-flex items-center px-3 py-1 rounded-full border ${p.onboarding_status === 'approved_general' ? 'bg-[#EAFBF1] border-[#27AE60] text-[#27AE60]' :
          p.onboarding_status === 'rejected' ? 'bg-red-50 border-red-500 text-red-600' :
            'bg-[#FFF5EC] border-[#E67E22] text-[#E67E22]'
          }`}>
          <span className="text-xs font-bold uppercase tracking-wider">
            {p.onboarding_status?.replace('_', ' ') || "PENDING VERIFICATION"}
          </span>
        </div>
      </div>

      {/* Organization Details */}
      <div className="bg-[#EBE3D6] p-5 lg:p-6 mb-6">
        <h2 className="font-orbitron font-black text-base lg:text-lg uppercase tracking-wide text-black mb-4">
          Organization Details
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">

          {/* Company Name */}
          <div>
            <label className="block font-inter font-semibold text-[16px] leading-[24px] text-black mb-2">
              Company Name
            </label>
            <div className="bg-[#F0EBE3] border border-[#E8E3D9] px-4 py-3">
              <span className="font-inter text-sm text-black">
                {companyName}
              </span>
            </div>
          </div>

          {/* Type of Buyer */}
          <div>
            <label className="block font-inter font-semibold text-[16px] leading-[24px] text-black mb-2">
              Type of Buyer
            </label>
            <div className="bg-[#F0EBE3] border border-[#E8E3D9] px-4 py-3">
              <span className="font-inter text-sm text-black">
                {getBuyerTypeLabel(buyerType)}
              </span>
            </div>
          </div>

          {/* Year of Establishment */}
          <div>
            <label className="block font-inter font-semibold text-[16px] leading-[24px] text-black mb-2">
              Year of Establishment
            </label>
            <div className="bg-[#F0EBE3] border border-[#E8E3D9] px-4 py-3">
              <span className="font-inter text-sm text-black">
                {yearEst}
              </span>
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block font-inter font-semibold text-[16px] leading-[24px] text-black mb-2">
              Website
            </label>
            <div className="bg-[#F0EBE3] border border-[#E8E3D9] px-4 py-3">
              {website !== "N/A" ? (
                <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className="font-inter text-sm text-[#D35400] underline">
                  {website}
                </a>
              ) : (
                <span className="font-inter text-sm text-black">N/A</span>
              )}
            </div>
          </div>

          {/* Business Address */}
          <div>
            <label className="block font-inter font-semibold text-[16px] leading-[24px] text-black mb-2">
              Office Address
            </label>
            <div className="bg-[#F0EBE3] border border-[#E8E3D9] px-4 py-3">
              <span className="font-inter text-sm text-black truncate max-w-full block" title={p.city_office_address || address}>
                {p.city_office_address || address}
              </span>
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block font-inter font-semibold text-[16px] leading-[24px] text-black mb-2">
              Country
            </label>
            <div className="bg-[#F0EBE3] border border-[#E8E3D9] px-4 py-3">
              <span className="font-inter text-sm text-black">
                {country}
              </span>
            </div>
          </div>

          {/* Purpose of Procurement */}
          <div>
            <label className="block font-inter font-semibold text-[16px] leading-[24px] text-black mb-2">
              Purpose of Procurement
            </label>
            <div className="bg-[#F0EBE3] border border-[#E8E3D9] px-4 py-3">
              <span className="font-inter text-sm text-black">
                {procurement}
              </span>
            </div>
          </div>

          {/* End-User Type */}
          <div>
            <label className="block font-inter font-semibold text-[16px] leading-[24px] text-black mb-2">
              End-User Type
            </label>
            <div className="bg-[#F0EBE3] border border-[#E8E3D9] px-4 py-3">
              <span className="font-inter text-sm text-black">
                {endUserType}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-[#EBE3D6] p-5 lg:p-6 mb-6">
        <h2 className="font-orbitron font-black text-base lg:text-lg uppercase tracking-wide text-black mb-4">
          Personal Information
        </h2>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">

          {/* Row 1: Full Name */}
          <div>
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
              {!editingFullName && (
                <button onClick={() => setEditingFullName(true)} className="px-3 text-[#D35400]">
                  <Pencil size={14} />
                </button>
              )}
            </div>
            {errors.fullName && (
              <p className="font-inter text-xs text-[#D35400] mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Row 1: Username */}
          <div>
            <label className="block font-inter font-semibold text-[16px] leading-[24px] text-black mb-2">
              Username
            </label>

            <div className="flex items-center bg-[#F0EBE3] border border-[#E8E3D9]">
              <input
                type="text"
                value={user.username || ""}
                readOnly
                className="flex-1 px-4 py-3 font-inter text-sm text-black bg-transparent outline-none cursor-not-allowed"
              />
            </div>

            <p className="font-inter text-xs text-[#666] mt-1">
              Username was set during registration and can be changed only once.
            </p>
          </div>

          {/* Row 2: Email */}
          <div>
            <label className="block font-inter font-semibold text-[16px] leading-[24px] text-black mb-2">
              Email
            </label>

            <div className="flex items-center justify-between bg-[#F0EBE3] border border-[#E8E3D9] px-4 py-3">
              <span className="font-inter text-sm text-black">
                {user.email || "No Email"}
              </span>
            </div>
          </div>

          {/* Row 2: Phone Number */}
          <div>
            <label className="block font-inter font-semibold text-[16px] leading-[24px] text-black mb-2">
              Phone Number
            </label>

            <div className="flex items-center justify-between bg-[#F0EBE3] border border-[#E8E3D9] px-4 py-3">
              <span className="font-inter text-sm text-black">
                {user.phone || (phoneNumber ? `${phoneCountryCode} ${phoneNumber}` : "No Phone")}
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
            <div className="profile-view">{buyerType}</div>
          </div>

          <div>
            <label className="profile-label font-semibold">Company / Organization Name</label>
            <div className="profile-view">{companyName}</div>
          </div>

          <div>
            <label className="profile-label font-semibold">Country</label>
            <div className="profile-view">{country}</div>
          </div>

          <div>
            <label className="profile-label font-semibold">Physical Address</label>
            <div className="profile-view">{p.city_office_address || p.address_line1 || "N/A"}</div>
          </div>

          <div>
            <label className="profile-label font-semibold">Year of Establishment</label>
            <div className="profile-view">{yearEst}</div>
          </div>

          <div>
            <label className="profile-label font-semibold">Company Phone</label>
            <div className="profile-view">
              {p.company_phone ? `${p.company_phone_country_code || ""} ${p.company_phone}` : "N/A"}
            </div>
          </div>

          <div className="lg:col-span-2">
            <label className="profile-label font-semibold">Website</label>
            <div className="profile-view">{website}</div>
          </div>
        </div>

        <div className="mt-4">
          <label className="profile-label font-semibold mb-2 block">
            Registration Documents
          </label>
          <div className="space-y-2">

            {/* Govt Registration (Step 0) */}
            <div className="flex items-center gap-3 bg-[#F0EBE3] border border-dashed border-[#E8E3D9] px-4 py-3 rounded-md">
              <FileText className="w-5 h-5 text-[#D35400]" />
              <div className="flex-1 text-sm">
                <p className="font-medium text-black">
                  {p.govt_compliance_reg_url ? getFileName(p.govt_compliance_reg_url) : "Govt. Compliance Registration"}
                </p>
                <p className="text-xs text-gray-500">
                  {p.govt_compliance_reg_url ? "Uploaded" : "Not uploaded"}
                </p>
              </div>
              {p.govt_compliance_reg_url && (
                <a href={p.govt_compliance_reg_url} target="_blank" className="text-xs text-[#D35400] underline">View</a>
              )}
            </div>

            {/* Business License (Step 3) */}
            <div className="flex items-center gap-3 bg-[#F0EBE3] border border-dashed border-[#E8E3D9] px-4 py-3 rounded-md">
              <FileText className="w-5 h-5 text-[#D35400]" />
              <div className="flex-1 text-sm">
                <p className="font-medium text-black">
                  {p.business_license_url ? getFileName(p.business_license_url) : "Business License"}
                </p>
                <p className="text-xs text-gray-500">
                  {p.business_license_url ? "Uploaded" : "Not uploaded"}
                </p>
              </div>
              {p.business_license_url && (
                <a href={p.business_license_url} target="_blank" className="text-xs text-[#D35400] underline">View</a>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Authorized Buyer Contact */}
      <div className="bg-[#EBE3D6] p-5 lg:p-6 mb-6 text-black">
        <p className="text-xs font-inter text-green-600 mb-1">
          Authorized buyer contact details are verified and locked.
        </p>

        <h2 className="font-orbitron font-black text-base lg:text-lg uppercase tracking-wide text-black mb-4">
          Authorized Buyer Contact
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="lg:col-span-2">
            <label className="profile-label font-semibold">Full Name:</label>
            <div className="profile-view">{p.contact_full_name || user.name}</div>
          </div>

          <div>
            <label className="profile-label font-semibold">Job Title / Designation:</label>
            <div className="profile-view">{contactJob}</div>
          </div>

          <div>
            <label className="profile-label font-semibold">Official Email Address:</label>
            <div className="profile-view">{contactEmail}</div>
          </div>

          <div>
            <label className="profile-label font-semibold">
              Passport Copy / Emirates ID:
            </label>

            <div className="flex items-center justify-between bg-[#F0EBE3] border border-dashed border-[#E8E3D9] px-4 py-3 rounded-md">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#D35400]" />
                <div className="text-sm">
                  <p className="font-medium text-black">
                    {p.contact_id_document_url ? getFileName(p.contact_id_document_url) : "ID Document"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {p.contact_id_document_url ? "Verified document" : "Not uploaded"}
                  </p>
                </div>
              </div>
              {p.contact_id_document_url && (
                <a href={p.contact_id_document_url} target="_blank" className="text-xs text-[#D35400] underline">View</a>
              )}
            </div>
          </div>

          <div>
            <label className="profile-label font-semibold">Mobile / WhatsApp Number:</label>
            <div className="profile-view">{contactPhone}</div>
          </div>
        </div>
      </div>

      {/* Compliance & End-Use Declaration */}
      <div className="bg-[#EBE3D6] p-5 lg:p-6 mb-6 text-black">
        <p className="text-xs font-inter text-green-600 mb-1">
          Compliance declaration is verified and legally binding.
        </p>

        <h2 className="font-orbitron font-black text-base lg:text-lg uppercase tracking-wide text-black mb-4">
          Compliance & End-Use Declaration
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Note: Procurement Purpose might be missing in DB/API if not mapped, showing Nature if available fallback */}
          <div>
            <label className="profile-label font-semibold">Purpose of Procurement</label>
            <div className="profile-view">{p.procurement_purpose || procurement || "N/A"}</div>
          </div>

          <div>
            <label className="profile-label font-semibold">End-User Type</label>
            <div className="profile-view">{p.end_user_type || endUserType}</div>
          </div>

          <div>
            <label className="profile-label font-semibold">Controlled Items Required?</label>
            <div className="profile-view">{p.controlled_items ? "Yes" : "No"}</div>
          </div>
        </div>

        <div className="mt-5">
          <label className="profile-label font-semibold">Countries of Use / Export</label>
          <div className="bg-[#F0EBE3] border border-[#E8E3D9] p-4 mt-2 rounded-md">
            <p>
              {Array.isArray(p.end_use_markets) ? p.end_use_markets.join(", ") : (p.end_use_markets || p.service_regions || "All Regions")}
            </p>
          </div>
        </div>

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
        <p className="text-xs font-inter text-green-600 mb-1">
          Account preferences were finalized during onboarding.
        </p>

        <h2 className="font-orbitron font-black text-base lg:text-lg uppercase tracking-wide text-black mb-4">
          Account Setup
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <label className="profile-label font-semibold">Registered As</label>
            <div className="profile-view uppercase">{p.register_as || user.userType}</div>
          </div>

          <div>
            <label className="profile-label font-semibold">Preferred Currency</label>
            <div className="profile-view">{p.preferred_currency || "AED"}</div>
          </div>
        </div>

        <div className="mt-5">
          <label className="profile-label font-semibold">Categories of Interest</label>
          <div className="bg-[#F0EBE3] border border-[#E8E3D9] p-4 mt-2 rounded-md">
            <div className="flex flex-wrap gap-2">
              {Array.isArray(p.selling_categories) && p.selling_categories.length > 0
                ? p.selling_categories.map((cat: string) => (
                  <span key={cat} className="px-2 py-1 bg-[#EBE3D6] border border-[#D3CFBC] text-xs rounded">{cat}</span>
                ))
                : <span className="text-sm text-gray-500">None Selected</span>
              }
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label className="profile-label font-semibold">Account Status</label>
          <div className="profile-view text-green-700 font-semibold uppercase">
            {p.onboarding_status ? p.onboarding_status.replace('_', ' ') : "Approved"}
          </div>
        </div>
      </div>

      {/* Update Profile Button */}
      {editingFullName && (
        <div className="flex justify-end">
          <button
            onClick={handleUpdateProfile}
            className="bg-[#D35400] hover:bg-[#39482C] text-white clip-path-supplier-refund flex items-center justify-center h-[45px] px-[40px] cursor-pointer transition-colors"
          >
            <span className="font-black text-[16px] font-orbitron uppercase">Save Changes</span>
          </button>
        </div>
      )}
    </main>
  );
}
