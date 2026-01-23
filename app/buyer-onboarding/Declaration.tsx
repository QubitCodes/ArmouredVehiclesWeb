"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import API from "@/app/services/api";

type Country = {
  name: string;
  code: string;
  flag?: string;
};

export default function Declaration({ onNext, onPrev, initialData }: { onNext: () => void; onPrev: () => void; initialData?: any }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Country[]>([]); // Selected countries
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Dynamic countries from API
  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);

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

  // Fetch Countries from External API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setCountriesLoading(true);
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,flag");
        const data = await response.json();

        if (Array.isArray(data)) {
          const options = data
            .map((c: any) => ({
              name: c.name.common,
              code: c.cca2,
              flag: c.flag
            }))
            .sort((a: Country, b: Country) => a.name.localeCompare(b.name));

          setCountries(options);
        }
      } catch (err: any) {
        console.error("Failed to fetch countries", err);
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []);

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
      if (initialData.controlled_items) setControlledItems(initialData.controlled_items);
      if (initialData.compliance_terms_accepted) setAgreed(initialData.compliance_terms_accepted);
      if (initialData.business_license_url) setBusinessLicenseUrl(initialData.business_license_url);

      // Pre-fill selected countries from end_use_markets
      if (initialData.end_use_markets && Array.isArray(initialData.end_use_markets)) {
        // Map country names to country objects (will be populated after countries load)
        const countryNames = initialData.end_use_markets;
        // Store for later matching once countries are loaded
        setSelected(countryNames.map((name: string) => ({ name, code: name })));
      }
    }
  }, [initialData]);

  // Update selected countries with proper codes once countries are loaded
  useEffect(() => {
    if (countries.length > 0 && selected.length > 0 && selected[0].code === selected[0].name) {
      // Re-map with proper codes
      const updated = selected.map(s => {
        const found = countries.find(c => c.name === s.name);
        return found || s;
      });
      setSelected(updated);
    }
  }, [countries]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = useMemo(() => {
    const term = search.trim().toLowerCase();
    let filtered = countries;
    if (term) {
      filtered = countries.filter((c) => c.name.toLowerCase().includes(term));
    }
    // Exclude already selected
    return filtered.filter(c => !selected.some(s => s.code === c.code));
  }, [search, countries, selected]);

  const isSelected = (code: string) => selected.some((c) => c.code === code);

  const addCountry = (country: Country) => {
    if (!isSelected(country.code)) {
      setSelected((prev) => [...prev, country]);
    }
    setSearch("");
    // Keep dropdown open and refocus on input for continuous selection
    searchInputRef.current?.focus();
  };

  const removeCountry = (code: string) => {
    setSelected((prev) => prev.filter((c) => c.code !== code));
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

      {/* Countries - Multi-Select with Chips */}
      <div className="bg-[#F0EBE3] py-2 px-5 mb-4">
        <label className="text-xs font-semibold mb-2 block">Countries of Use / Export:</label>

        {/* Selected chips - only show when countries are selected */}
        {selected.length > 0 && (
          <div className="border border-[#C7B88A] bg-[#EFE8DC] p-3 flex flex-wrap gap-2 mb-2">
            {selected.map((country) => (
              <span
                key={country.code}
                className="flex items-center gap-2 px-3 py-1 border border-[#C7B88A] bg-[#EBE3D6] text-xs"
              >
                {country.flag && <span>{country.flag}</span>}
                {country.name}
                <button onClick={() => removeCountry(country.code)} className="text-gray-600 hover:text-black">×</button>
              </span>
            ))}
          </div>
        )}

        {/* Dropdown Search */}
        <div className="relative" ref={dropdownRef}>
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder={countriesLoading ? "Loading countries..." : "Search and select countries..."}
            className="w-full px-4 py-3 border border-[#C7B88A] bg-[#EBE3D6] text-sm focus:outline-none"
          />

          {isDropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-[#EBE3D6] border border-[#C7B88A] shadow-lg max-h-60 overflow-auto">
              {filteredCountries.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">No countries found</div>
              ) : (
                filteredCountries.slice(0, 20).map((country) => (
                  <div
                    key={country.code}
                    onClick={() => addCountry(country)}
                    className="px-4 py-3 cursor-pointer hover:bg-[#E6D8C3] flex items-center gap-2 text-sm"
                  >
                    {country.flag && <span>{country.flag}</span>}
                    {country.name}
                  </div>
                ))
              )}
              {filteredCountries.length > 20 && (
                <div className="px-4 py-2 text-xs text-gray-500 text-center">
                  Type to search more...
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Controlled Items & Business License - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Controlled Items */}
        <div className="bg-[#F0EBE3] py-2 px-5">
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
        <div className="bg-[#F0EBE3] py-2 px-5">
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
