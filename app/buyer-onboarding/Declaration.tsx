"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import API from "@/app/services/api";

type Country = {
  name: string;
  code: string;
  flag?: string;
};

const ALL_COUNTRIES: Country[] = [
  { name: "United Arab Emirates (UAE)", code: "AE", flag: "/icons/flags/uae.svg" },
  { name: "Saudi Arabia (KSA)", code: "SA", flag: "/icons/flags/ksa.png" },
  { name: "Qatar", code: "QA", flag: "/icons/flags/qatar.png" },
  { name: "Oman", code: "OM", flag: "/icons/flags/oman.png" },
  { name: "India", code: "IN", flag: "/icons/flags/India.png" },
  { name: "Indonesia", code: "ID" },
  { name: "Iran", code: "IR" },
  { name: "Iraq", code: "IQ" },
  { name: "Ireland", code: "IE" },
  { name: "United States", code: "US", flag: "/icons/flags/usa.png" },
];

export default function Declaration({ onNext, onPrev, initialData }: { onNext: () => void; onPrev: () => void; initialData?: any }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Country[]>([]); // Unchecked by default

  const [agreed, setAgreed] = useState(false);
  const [controlledItems, setControlledItems] = useState(false);
  const [procurementPurpose, setProcurementPurpose] = useState("");
  const [endUserType, setEndUserType] = useState("");

  const [procurementOptions, setProcurementOptions] = useState<{ id: number; name: string }[]>([]);
  const [endUserOptions, setEndUserOptions] = useState<{ id: number; name: string }[]>([]);

  // Local UI state (errors, submission, files)
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [businessLicenseFile, setBusinessLicenseFile] = useState<File | null>(null);
  const [businessLicenseUrl, setBusinessLicenseUrl] = useState<string>(""
  );

  // Fetch References
  useEffect(() => {
    const fetchRefs = async () => {
      try {
        const [procRes, endUserRes] = await Promise.all([
          API.get("/references/procurement-purpose"),
          API.get("/references/end-user-type")
        ]);

        if (procRes?.data?.data) {
          setProcurementOptions(procRes.data.data);
          // Default Select
          if (!procurementPurpose && procRes.data.data.length > 0 && !initialData?.procurement_purpose) {
            setProcurementPurpose(procRes.data.data[0].id);
          }
        }

        if (endUserRes?.data?.data) {
          setEndUserOptions(endUserRes.data.data);
          if (!endUserType && endUserRes.data.data.length > 0 && !initialData?.end_user_type) {
            setEndUserType(endUserRes.data.data[0].id);
          }
        }
      } catch (e) {
        console.error("Failed to fetch declaration references", e);
      }
    };
    fetchRefs();
  }, []); // Run once

  // Pre-fill effect
  useEffect(() => {
    if (initialData) {
      if (initialData.procurement_purpose) setProcurementPurpose(initialData.procurement_purpose);
      if (initialData.end_user_type) setEndUserType(initialData.end_user_type);
      // ... existing code ...
    }
  }, [initialData]);

  const filteredCountries = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return ALL_COUNTRIES;
    return ALL_COUNTRIES.filter((c) => c.name.toLowerCase().includes(term));
  }, [search]);

  const isSelected = (code: string) => selected.some((c) => c.code === code);
  const toggleCountry = (country: Country) => {
    if (isSelected(country.code)) setSelected((prev) => prev.filter((c) => c.code !== country.code));
    else setSelected((prev) => [...prev, country]);
  };

  // ----------- Handle Next & API call -----------
  const handleNext = async () => {
    if (!agreed) {
      setError("You must agree to compliance terms to continue");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      let uploadedBusinessLicenseUrl = businessLicenseUrl;

      // Upload file if new file selected
      if (businessLicenseFile) {
        const uploadData = new FormData();
        uploadData.append("files", businessLicenseFile);
        uploadData.append("label", "CUSTOMER_BUSINESS_LICENSE");

        const uploadRes = await API.post("/upload/files", uploadData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        if (uploadRes.data.status && uploadRes.data.data.length > 0) {
          uploadedBusinessLicenseUrl = uploadRes.data.data[0];
        } else {
          throw new Error("File upload failed");
        }
      }

      // Prepare JSON Payload
      const payload = {
        natureOfBusiness: [], // Add if UI captures it, currently sending empty
        endUseMarkets: selected.map(c => c.name), // JSON Array of country names
        licenseTypes: [],
        operatingCountries: [],
        controlledItems: controlledItems,
        procurementPurpose: procurementPurpose,
        endUserType: endUserType,
        isOnSanctionsList: false,
        complianceTermsAccepted: true,

        businessLicenseUrl: uploadedBusinessLicenseUrl,
        // Add other file URLs if captured in UI
      };

      await API.post("/onboarding/step3", payload);

      onNext();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto bg-[#EBE3D6] p-8 mt-8 text-black">
      {/* Title */}
      <h2 className="text-[22px] font-bold uppercase mb-6" style={{ fontFamily: "Orbitron" }}>
        Compliance & End-Use Declaration
      </h2>

      {/* Procurement & End User */}
      <div className="bg-[#F0EBE3] py-2 px-5 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-semibold mb-1 block">Purpose of Procurement:</label>
            <select
              value={procurementPurpose}
              onChange={(e) => setProcurementPurpose(e.target.value)}
              className="w-full px-4 py-3 border border-[#C7B88A] bg-[#EBE3D6] text-sm focus:outline-none"
            >
              {procurementOptions.length === 0 ? <option>Loading...</option> :
                procurementOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))
              }
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block">End-User Type:</label>
            <select
              value={endUserType}
              onChange={(e) => setEndUserType(e.target.value)}
              className="w-full px-4 py-3 border border-[#C7B88A] bg-[#EBE3D6] text-sm focus:outline-none"
            >
              {endUserOptions.length === 0 ? <option>Loading...</option> :
                endUserOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))
              }
            </select>
          </div>
        </div>
      </div>

      {/* Countries */}
      <div className="bg-[#F0EBE3] py-2 px-5 mb-4">
        <label className="text-xs font-semibold mb-2 block">Countries of Use / Export:</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {filteredCountries.map((country) => (
            <label key={country.code} className="flex items-center gap-2 cursor-pointer text-black">
              <input
                type="checkbox"
                className="w-[16px] h-[16px] border border-[#DDCFBC] bg-[#EBE3D6] accent-[#C7B88A]"
                checked={isSelected(country.code)}
                onChange={() => toggleCountry(country)}
              />
              {country.name}
            </label>
          ))}
        </div>
      </div>

      {/* Controlled Items */}
      <div className="bg-[#F0EBE3] py-2 px-5 mb-4">
        <label className="text-xs font-semibold mb-2 block">
          Do you require controlled items? (Ballistic, Electronic, etc.)
        </label>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-sm ${!controlledItems ? 'font-bold' : ''}`}>No</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={controlledItems}
              onChange={(e) => setControlledItems(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C7B88A]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C7B88A]"></div>
          </label>
          <span className={`text-sm ${controlledItems ? 'font-bold' : ''}`}>Yes</span>
        </div>
      </div>

      {/* Business License Upload */}
      <div className="bg-[#F0EBE3] py-2 px-5 mb-4">
        <label className="text-xs font-semibold mb-2 block">Upload Business License *</label>
        <input type="file" onChange={(e) => setBusinessLicenseFile(e.target.files?.[0] || null)} />

        {/* Document Preview */}
        {businessLicenseUrl && (
          <div className="mt-4 p-4 border border-[#C7B88A]">
            <p className="text-xs font-semibold mb-2">Uploaded Document:</p>
            {businessLicenseUrl.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={businessLicenseUrl}
                className="w-full h-64 border border-gray-300"
                title="Business License Preview"
              />
            ) : (
              <img
                src={businessLicenseUrl}
                alt="Business License"
                className="max-w-full h-auto max-h-64 object-contain mx-auto"
              />
            )}
          </div>
        )}
      </div>

      {/* Compliance Checkbox */}
      <div className="bg-[#F0EBE3] py-2 px-5 mb-4">
        <label className="flex items-start gap-3 text-xs text-[#2B2B2B] cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-[2px] w-[16px] h-[16px] border border-[#C7B88A] bg-[#EBE3D6] accent-[#C7B88A]"
          />
          I acknowledge that all transactions are subject to UAE and international laws and may be screened, paused, or reported in accordance with ArmoredMart’s regulatory obligations.
        </label>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-6 mt-10">
        <button onClick={onPrev} className="relative w-[220px] h-[48px] bg-transparent">
          <span className="absolute inset-0 clip-path-supplier bg-[#C7B88A]" />
          <span className="absolute inset-[1.5px] clip-path-supplier bg-[#F0EBE3]" />
          <span className="relative z-10 flex items-center justify-center h-full w-full font-orbitron font-bold text-[13px] uppercase text-black">
            Previous
          </span>
        </button>
        <button
          onClick={handleNext}
          className="w-[280px] h-[48px] bg-[#D35400] text-white font-black clip-path-supplier uppercase hover:bg-[#39482C] transition-colors"
        >
          {submitting ? "Submitting..." : "Next"}
        </button>
      </div>

      {error && <p className="text-red-600 text-center mt-2">{error}</p>}
    </div >
  );
}
