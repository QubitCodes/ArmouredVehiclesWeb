"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FileText, ShieldCheck, Pencil, CheckCircle, ShieldAlert } from "lucide-react";
import api from "@/lib/api";
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

          // If profile data exists (nested)
          if (userData.profile) {
            const p = userData.profile;

            // Map Documents
            // MOD -> Defense Approval
            if (p.defenseApprovalUrl) {
              setModFileName(getFileName(p.defenseApprovalUrl));
            }
            // ECON -> Business License
            if (p.businessLicenseUrl) {
              setEconFileName(getFileName(p.businessLicenseUrl));
            }
            // ID -> Contact ID
            if (p.contactIdDocumentUrl) {
              setIdFileName(getFileName(p.contactIdDocumentUrl));
            }

            // Map Status
            // Using global onboarding status as proxy for document verification status for now
            const isApproved = p.onboardingStatus && p.onboardingStatus.includes('approved');
            const status = isApproved ? "APPROVED" : "PENDING";

            setModStatus(status);
            setEconStatus(status);
            setIdStatus(status);
          }
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
    const newErrors: typeof errors = {};
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
  const profile = user.profile || {};
  const companyName = profile.companyName || profile.registeredCompanyName || "N/A";
  const buyerType = profile.companyType || profile.typeOfBuyer || "N/A";
  const country = profile.country || "N/A";
  const city = profile.city || "N/A";
  const yearEst = profile.foundedYear || profile.yearOfEstablishment || "N/A";
  const address = profile.addressLine1 ? `${profile.addressLine1}, ${profile.city || ""}` : (profile.address || "N/A");
  const website = profile.companyWebsite || profile.website || "N/A";

  const contactJob = profile.authorizedContactRole || profile.contactJobTitle || "N/A";
  const contactEmail = profile.authorizedContactEmail || profile.contactWorkEmail || user.email;
  const contactPhone = profile.authorizedContactPhone || profile.contactMobile || user.phone || "N/A";

  // Compliance
  const procurement = profile.natureOfBusiness ? profile.natureOfBusiness.join(', ') : "Internal Use";
  const endUserType = profile.companyType || "N/A";

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
                {user.email || "No Email"}
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

      {/* Personal Information */}
      <div className="bg-[#EBE3D6] p-5 lg:p-6 mb-6">
        <h2 className="font-orbitron font-black text-base lg:text-lg uppercase tracking-wide text-black mb-4">
          Personal Information
        </h2>

        {/* Full Name and Username Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mb-4 lg:mb-6">
          {/* Full Name */}
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

          {/* Username */}
          <div className="lg:col-span-4">
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
            <label className="profile-label font-semibold">Country & City of Registration</label>
            <div className="profile-view">{country}, {city}</div>
          </div>

          <div>
            <label className="profile-label font-semibold">Year of Establishment</label>
            <div className="profile-view">{yearEst}</div>
          </div>

          <div className="lg:col-span-2">
            <label className="profile-label font-semibold">Physical Address</label>
            <div className="profile-view">
              {address}
            </div>
          </div>

          <div className="lg:col-span-2">
            <label className="profile-label font-semibold">Website</label>
            <div className="profile-view">{website}</div>
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

              {modStatus === "APPROVED" ? (
                <ShieldCheck className="w-4 h-4 text-green-600" />
              ) : (
                <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                  Under Review
                </span>
              )}

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

          <p className="text-xs text-[#666] mt-2">
            Uploading a new document requires admin verification.
            The currently verified document remains active until approval.
          </p>
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
            <div className="profile-view">{user.name}</div>
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
                  <p className="font-medium text-black">{idFileName}</p>
                  <p className="text-xs text-gray-500">
                    {idStatus === "APPROVED"
                      ? "Verified document"
                      : "New document submitted — awaiting admin verification"}
                  </p>
                </div>
              </div>

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
            <p className="text-xs text-[#666] mt-2">
              Uploading a new ID document requires admin verification.
              The currently verified document remains active until approval.
            </p>
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
          <div>
            <label className="profile-label font-semibold">Purpose of Procurement</label>
            <div className="profile-view">{procurement}</div>
          </div>

          <div>
            <label className="profile-label font-semibold">End-User Type</label>
            <div className="profile-view">{endUserType}</div>
          </div>
        </div>

        <div className="mt-5">
          <label className="profile-label font-semibold">Countries of Use / Export</label>
          <div className="bg-[#F0EBE3] border border-[#E8E3D9] p-4 mt-2 rounded-md">
            <p>{profile.service_regions || "All Regions"}</p>
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
            <div className="profile-view uppercase">{user.userType}</div>
          </div>

          <div>
            <label className="profile-label font-semibold">Preferred Currency</label>
            <div className="profile-view">AED</div>
          </div>
        </div>

        <div className="mt-5">
          <label className="profile-label font-semibold">Account Status</label>
          <div className="profile-view text-green-700 font-semibold">
            Approved
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
