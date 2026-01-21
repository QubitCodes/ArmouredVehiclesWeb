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
  const [existingFile, setExistingFile] = useState<string | null>(null);

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
      let contactIdDocumentUrl = existingFile;

      // 1. Upload File if selected
      if (idFile) {
        const uploadData = new FormData();
        uploadData.append("files", idFile);
        uploadData.append("label", "CONTACT_ID_DOCUMENT"); // Use appropriate label

        // Generic Upload API
        const uploadRes = await API.post("/upload/files", uploadData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        if (uploadRes.data.status && uploadRes.data.data.length > 0) {
          contactIdDocumentUrl = uploadRes.data.data[0];
        } else {
          throw new Error("File upload failed");
        }
      }

      // 2. Submit Form Data as JSON
      const payload = {
        contactFullName,
        termsAccepted,
        contactJobTitle,
        contactWorkEmail,
        contactMobile,
        contactMobileCountryCode: "+91", // Hardcoded per existing logic or improve if needed
        contactIdDocumentUrl
      };

      await API.post("/onboarding/step2", payload);

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

      if (initialData.contact_mobile) {
        setContactMobile(initialData.contact_mobile);
      }

      if (initialData.terms_accepted) setTermsAccepted(true);
      if (initialData.contact_id_document_url) setExistingFile(initialData.contact_id_document_url);
    }
  }, [initialData]);

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdFile(e.target.files[0]);
    }
  };

  // Helper for preview
  const getPreviewContent = () => {
    if (idFile) {
      // New file selected
      return (
        <div className="mt-4 p-4 border rounded bg-white">
          <p className="font-semibold text-green-600">New File Selected:</p>
          <p className="text-sm">{idFile.name} ({(idFile.size / 1024).toFixed(2)} KB)</p>
        </div>
      );
    }

    if (existingFile) {
      // Existing file
      const isPdf = existingFile.toLowerCase().endsWith('.pdf');
      const isImage = /\.(jpg|jpeg|png|webp)$/i.test(existingFile);

      return (
        <div className="mt-4">
          <p className="mb-2 font-medium text-gray-700">Uploaded Document:</p>
          <div className="border rounded overflow-hidden bg-gray-50 border-gray-200">
            {isPdf ? (
              <iframe
                src={existingFile}
                className="w-full h-[300px]"
                title="Document Preview"
              />
            ) : isImage ? (
              <img
                src={existingFile}
                alt="Document Preview"
                className="max-w-full h-auto max-h-[300px] object-contain mx-auto"
              />
            ) : (
              <div className="p-4 text-center">
                <a href={existingFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  View Document
                </a>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

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
              className="border border-dashed border-[#C7B88A] bg-[#EBE3D6] p-6 text-center relative cursor-pointer"
            >
              <div className="flex justify-center mb-2">
                <Image src="/icons/upload.png" alt="Upload" width={28} height={28} />
              </div>

              <p className="text-sm mb-1 text-black">
                {idFile ? idFile.name : (existingFile ? "Current File Uploaded (Click to Change)" : "Choose a File or Drag & Drop It Here.")}
              </p>

              <p className="text-xs text-gray-600">
                JPEG, PNG, PDF, and MP4 formats, up to 10 MB.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.mp4"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </div>

            {/* Document Preview Section */}
            {getPreviewContent()}
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
