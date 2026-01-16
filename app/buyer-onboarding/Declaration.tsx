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
  const [selected, setSelected] = useState<Country[]>([
    { name: "United Arab Emirates (UAE)", code: "AE", flag: "/icons/flags/uae.svg" },
    { name: "Saudi Arabia (KSA)", code: "SA", flag: "/icons/flags/ksa.png" },
    { name: "Qatar", code: "QA", flag: "/icons/flags/qatar.png" },
    { name: "Oman", code: "OM", flag: "/icons/flags/oman.png" },
  ]);

  const [agreed, setAgreed] = useState(false);
  const [controlledItems, setControlledItems] = useState(false);
  const [procurementPurpose, setProcurementPurpose] = useState("Internal Use");
  const [endUserType, setEndUserType] = useState("Military");

  const [businessLicenseFile, setBusinessLicenseFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill effect
  useEffect(() => {
    if (initialData) {
        if (initialData.procurement_purpose) setProcurementPurpose(initialData.procurement_purpose);
        if (initialData.end_user_type) setEndUserType(initialData.end_user_type);
        if (initialData.controlled_items !== undefined) {
             // Backend now sends boolean, but handle legacy/string just in case or direct map
             if (initialData.controlled_items === true || initialData.controlled_items === "Yes") {
                setControlledItems(true);
             } else {
                setControlledItems(false);
             }
        }
        
        if (initialData.compliance_terms_accepted) setAgreed(true);

        if (initialData.end_use_markets && Array.isArray(initialData.end_use_markets)) {
             // Map strings to Country objects
             const mapped = initialData.end_use_markets.map((name: string) => {
                 return ALL_COUNTRIES.find(c => c.name === name);
             }).filter(Boolean) as Country[];
             if (mapped.length > 0) setSelected(mapped);
        }
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

    // if (!businessLicenseFile) {
    //   setError("Please upload the mandatory Business License file");
    //   return;
    // }

    setError(null);
    setSubmitting(true);

    try {
      const formData = new FormData();

      // Required arrays
      formData.append("natureOfBusiness[]", ""); // optional, can add items
      formData.append("endUseMarkets[]", selected.map(c => c.name).join(",")); // selected countries

      // Other optional arrays / strings
      formData.append("licenseTypes[]", ""); // optional
      formData.append("controlledItems", String(controlledItems));
      formData.append("procurementPurpose", procurementPurpose);
      formData.append("endUserType", endUserType);

      // Files
      if (businessLicenseFile) {
        formData.append("businessLicenseFile", businessLicenseFile);
      } else {
        formData.append("businessLicenseFile", "");
      }
      // other files optional, skipped for now
      formData.append("defenseApprovalFile", "");
      formData.append("companyProfileFile", "");
      formData.append("modLicenseFile", "");
      formData.append("eocnApprovalFile", "");
      formData.append("itarRegistrationFile", "");
      formData.append("localAuthorityApprovalFile", "");

      // Other fields
      formData.append("isOnSanctionsList", "false");
      formData.append("complianceTermsAccepted", "true");

      await API.post("/onboarding/step3", formData);

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
              <option>Internal Use</option>
              <option>Resale</option>
              <option>Government Contract</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold mb-1 block">End-User Type:</label>
            <select
              value={endUserType}
              onChange={(e) => setEndUserType(e.target.value)}
              className="w-full px-4 py-3 border border-[#C7B88A] bg-[#EBE3D6] text-sm focus:outline-none"
            >
              <option>Military</option>
              <option>Law Enforcement</option>
              <option>Commercial</option>
              <option>Civilian</option>
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
    </div>
  );
}
