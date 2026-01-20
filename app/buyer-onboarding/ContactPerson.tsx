"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import API from "@/app/services/api";

export default function ContactPerson({
  onNext,
  onPrev,
  initialData,
}: {
  onNext: () => void;
  onPrev: () => void;
  initialData?: any;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // -------- state (NO UI change) --------
  const [contactFullName, setContactFullName] = useState("");
  const [contactJobTitle, setContactJobTitle] = useState("");
  const [contactWorkEmail, setContactWorkEmail] = useState("");
  const [contactMobile, setContactMobile] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [idFile, setIdFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // -------- submit --------
  const handleSubmit = async () => {
    setError(null);

    // ✅ ONLY REQUIRED VALIDATION
    if (!contactFullName.trim()) {
      setError("Please fill the required fields");
      return;
    }

    if (!termsAccepted) {
      setError("Please fill the required fields");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("contactFullName", contactFullName);
      formData.append("termsAccepted", "true");

      if (contactJobTitle)
        formData.append("contactJobTitle", contactJobTitle);

      if (contactWorkEmail)
        formData.append("contactWorkEmail", contactWorkEmail);

      if (contactMobile) {
        formData.append("contactMobile", contactMobile);
        formData.append("contactMobileCountryCode", "+91");
      }

      if (idFile) {
        formData.append("contactIdDocumentFile", idFile);
      }

      await API.post("/onboarding/step2", formData);

      onNext();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Submission failed"
      );
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (initialData) {
        if (initialData.contact_full_name) setContactFullName(initialData.contact_full_name);
        if (initialData.contact_job_title) setContactJobTitle(initialData.contact_job_title);
        if (initialData.contact_work_email) setContactWorkEmail(initialData.contact_work_email);
        
        // Handle contact mobile if available. Similar to step 0, might conflict with hardcoded +91 in UI.
        // If data has contact_mobile, set it. Country code might be separate.
        if (initialData.contact_mobile) {
            setContactMobile(initialData.contact_mobile);
        }
        
        // If terms were accepted previously
        if (initialData.terms_accepted) setTermsAccepted(true);
    }
  }, [initialData]);

  return (
    <div className="max-w-[1200px] mx-auto bg-[#EBE3D6] p-8 mt-8 text-black">

      {/* Title (UNCHANGED) */}
      <h2
        className="text-[22px] font-bold uppercase mb-6"
        style={{ fontFamily: "Orbitron" }}
      >
        Authorized Buyer Contact
      </h2>

      <div className="bg-[#F0EBE3] py-2 px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#000000] px-4 py-6 ">

          {/* Full Name */}
          <div className="md:col-span-2">
            <label className="text-xs font-semibold mb-1 block text-black">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-[#C7B88A] bg-[#EBE3D6] text-sm focus:outline-none text-black"
              value={contactFullName}
              onChange={(e) => setContactFullName(e.target.value)}
            />
            <p className="text-xs text-gray-600 mt-1">
              Enter your complete name as it appears on your passport or ID.
            </p>
          </div>

          {/* Job Title */}
          <div>
            <label className="text-xs font-semibold mb-1 block">
              Job Title / Designation:
            </label>
            <input
              type="text"
              placeholder="Type Your Job Title"
              className="w-full px-4 py-3 border border-[#C7B88A] bg-[#EBE3D6] text-sm focus:outline-none text-black"
              value={contactJobTitle}
              onChange={(e) => setContactJobTitle(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold mb-1 block">
              Official Email Address:
            </label>
            <input
              type="email"
              placeholder="Type Your Official Email Address"
              className="w-full px-4 py-3 border border-[#C7B88A] bg-[#EBE3D6] text-sm focus:outline-none text-black"
              value={contactWorkEmail}
              onChange={(e) => setContactWorkEmail(e.target.value)}
            />
          </div>

          {/* Upload */}
          <div className="md:col-span-1">
            <label className="text-xs font-semibold mb-2 block text-black">
              Upload Passport Copy or Emirates ID:
            </label>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-[#C7B88A] bg-[#EBE3D6] p-6 text-center relative cursor-pointer"
            >
              <div className="flex justify-center mb-2">
                <Image src="/icons/upload.png" alt="Upload" width={28} height={28} />
              </div>

              <p className="text-sm mb-1 text-black">
                {idFile ? idFile.name : "Choose a File or Drag & Drop It Here."}
              </p>

              <p className="text-xs text-gray-600">
                JPEG, PNG, PDF, and MP4 formats, up to 10 MB.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.mp4"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setIdFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="md:col-span-1">
            <label className="text-xs font-semibold mb-1 block text-black">
              Mobile / WhatsApp Number:
            </label>

            <div className="flex items-center border border-[#C7B88A] h-[48px] bg-[#EBE3D6]">
              <div className="flex items-center gap-2 px-3 border-r border-[#C7B88A]">
                <Image src="/icons/flags/india.png" alt="India" width={22} height={16} />
                <span className="text-sm text-black">+91</span>
              </div>

              <input
                type="tel"
                placeholder="Phone number"
                className="flex-1 px-3 bg-[#EBE3D6] text-sm focus:outline-none text-black"
                value={contactMobile}
                onChange={(e) => setContactMobile(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Acknowledgment */}
      <div className="mt-8 bg-[#F0EBE3] px-6 py-5">
        <h3 className="text-sm font-semibold text-[#2B2B2B] mb-3"> Acknowledgment </h3>
        <label className="flex items-start gap-3 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          <span>
            I confirm the accuracy of the above details and that I am authorized to
            submit this request.
          </span>
        </label>
      </div>

    

      {/* Buttons */}
      <div className="flex justify-center gap-6 mt-10">
        <button onClick={onPrev} className="relative w-[220px] h-[48px] bg-transparent">
          <span className="absolute inset-0 clip-path-supplier bg-[#C7B88A]" />
          <span className="absolute inset-[1.5px] clip-path-supplier bg-[#F0EBE3]" />
          <span className="relative z-10 flex items-center justify-center h-full font-orbitron font-bold text-[13px] uppercase">
            Previous
          </span>
        </button>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-[280px] h-[48px] bg-[#D35400] text-white font-black clip-path-supplier uppercase"
        >
          {submitting ? "Submitting..." : "Next"}
        </button>
      </div>
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
    </div>
  );
}
