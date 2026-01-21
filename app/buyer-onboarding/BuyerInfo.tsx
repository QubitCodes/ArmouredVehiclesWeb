"use client";

import Image from "next/image";
import Stepper from "./Stepper";
import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

type BuyerTypeOption = {
  value: string;
  label: string;
};

type CountryOption = {
  value: string;
  label: string;
};

type Props = {
  onNext: () => void;
  initialData?: any;
};

export default function BuyerInfo({ onNext, initialData }: Props) {
  const [buyerTypes, setBuyerTypes] = useState<BuyerTypeOption[]>([]);
  const [buyerTypesLoading, setBuyerTypesLoading] = useState<boolean>(false);
  const [buyerTypesError, setBuyerTypesError] = useState<string | null>(null);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [countriesLoading, setCountriesLoading] = useState<boolean>(false);
  const [countriesError, setCountriesError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form state for Step 0 payload
  const [typeOfBuyer, setTypeOfBuyer] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [companyEmail, setCompanyEmail] = useState<string>("");
  const [companyPhone, setCompanyPhone] = useState<string>("");
  const [companyPhoneCountryCode, setCompanyPhoneCountryCode] = useState<string>("+971");

  // New States
  const [yearOfEstablishment, setYearOfEstablishment] = useState<string>("");
  const [cityOfficeAddress, setCityOfficeAddress] = useState<string>("");
  const [officialWebsite, setOfficialWebsite] = useState<string>("");
  const [existingFile, setExistingFile] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pre-fill effect
  useEffect(() => {
    if (initialData) {
      if (initialData.type_of_buyer) setTypeOfBuyer(initialData.type_of_buyer);
      if (initialData.company_name) setCompanyName(initialData.company_name);
      if (initialData.country) setCountry(initialData.country);

      if (initialData.company_email) {
        setCompanyEmail(initialData.company_email);
      } else if (initialData.email) {
        setCompanyEmail(initialData.email);
      }

      if (initialData.company_phone) {
        if (initialData.company_phone_country_code) {
          setCompanyPhoneCountryCode(initialData.company_phone_country_code);
          setCompanyPhone(initialData.company_phone);
        } else {
          setCompanyPhone(initialData.company_phone);
        }
      } else if (initialData.phone) {
        if (initialData.countryCode) {
          setCompanyPhoneCountryCode(initialData.countryCode);
        }
        setCompanyPhone(initialData.phone);
      }

      // New fields
      if (initialData.year_of_establishment) setYearOfEstablishment(String(initialData.year_of_establishment));
      if (initialData.city_office_address) setCityOfficeAddress(initialData.city_office_address);
      if (initialData.official_website) setOfficialWebsite(initialData.official_website);
      if (initialData.business_license_url) setExistingFile(initialData.business_license_url);
    }
  }, [initialData]);

  useEffect(() => {
    let mounted = true;
    const fetchBuyerTypes = async () => {
      try {
        setBuyerTypesLoading(true);
        setBuyerTypesError(null);
        const res = await API.get("/references/type-of-buyer");
        // API returns { status: true, data: [...] }
        const data = res?.data?.data;

        let options: BuyerTypeOption[] = [];
        if (Array.isArray(data)) {
          options = data
            .map((item: any): BuyerTypeOption | null => {
              if (typeof item === "string") {
                return { value: item, label: item };
              }
              if (item && typeof item === "object") {
                const label = (item.name ?? item.title ?? item.label ?? "").toString();
                const valueRaw = (item.id ?? item.value ?? item.code ?? label);
                const value = valueRaw != null ? String(valueRaw) : label;
                if (label || value) {
                  return { value, label: label || value };
                }
              }
              return null;
            })
            .filter(Boolean) as BuyerTypeOption[];
        }

        if (mounted) {
          setBuyerTypes(options);
          // Preselect first option if none chosen AND not already set by initial data
          if (!typeOfBuyer && options.length > 0 && !initialData?.type_of_buyer) {
            setTypeOfBuyer(options[0].value);
          }
        }
      } catch (err: any) {
        if (mounted) setBuyerTypesError(err?.message ?? "Failed to load buyer types");
      } finally {
        if (mounted) setBuyerTypesLoading(false);
      }
    };

    fetchBuyerTypes();
    return () => {
      mounted = false;
    };
  }, [initialData]);

  useEffect(() => {
    let mounted = true;
    const fetchCountries = async () => {
      try {
        setCountriesLoading(true);
        setCountriesError(null);

        // Use external API for countries
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,flag");
        const data = await response.json();

        if (mounted && Array.isArray(data)) {
          const options = data
            .map((c: any) => ({
              value: c.name.common,
              label: c.name.common,
              flag: c.flag
            }))
            .sort((a: any, b: any) => a.label.localeCompare(b.label));

          setCountries(options);

          // Preselect 'United Arab Emirates' or first option IF NOT PREFILLED
          if (!country && options.length > 0 && !initialData?.country) {
            const ae = options.find((o: any) => o.value === 'United Arab Emirates');
            setCountry(ae ? ae.value : options[0].value);
          }
        }
      } catch (err: any) {
        if (mounted) setCountriesError(err?.message ?? "Failed to load countries");
      } finally {
        if (mounted) setCountriesLoading(false);
      }
    };

    fetchCountries();
    return () => {
      mounted = false;
    };
  }, [initialData]);

  const handleSubmitStep0 = async () => {
    setSubmitError(null);
    // Basic validation for required fields
    if (!typeOfBuyer || !companyName || !country || !companyEmail || !companyPhone || !companyPhoneCountryCode) {
      setSubmitError("Please complete all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      let businessLicenseUrl = "";

      // 1. Upload File if selected
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("files", selectedFile);
        uploadFormData.append("label", "CUSTOMER_REGISTRATION_FILE");
        // data can include user_id if needed, but endpoint handles it from auth token. 
        // We might need to pass empty data object if no specific path vars needed
        uploadFormData.append("data", JSON.stringify({}));

        const uploadRes = await API.post("/upload/files", uploadFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        if (uploadRes.data && uploadRes.data.data && uploadRes.data.data.length > 0) {
          businessLicenseUrl = uploadRes.data.data[0];
        }
      }

      // 2. Submit JSON Payload
      // Prepare split phone number
      let dialCode = companyPhoneCountryCode ? companyPhoneCountryCode.replace('+', '') : '';
      let fullPhone = companyPhone.replace('+', '');
      let localPhone = fullPhone;

      if (dialCode && fullPhone.startsWith(dialCode)) {
        localPhone = fullPhone.substring(dialCode.length);
      }
      localPhone = localPhone.replace(/^0+/, '');

      const formattedDialCode = dialCode ? `+${dialCode}` : '+1';

      const payload = {
        country,
        companyName,
        companyEmail,
        typeOfBuyer,
        companyPhone: localPhone,
        companyPhoneCountryCode: formattedDialCode,
        yearOfEstablishment,
        cityOfficeAddress,
        officialWebsite,
        businessLicenseUrl,
      };

      await API.post("/onboarding/step0", payload);
      onNext();
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Failed to submit";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (

    <>

      <div className="max-w-[1200px] mx-auto bg-[#F3EDE3] p-8 shadow-sm">

        {/* TITLE */}
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-[20px] font-bold uppercase text-black"
            style={{ fontFamily: "Orbitron" }}
          >
            Organization / Buyer Information
          </h2>

          {/* collapse icon (optional) */}
          <span className="text-xl cursor-pointer">⌃</span>
        </div>

        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 text-sm text-black">

          {/* Type of Buyer */}
          <div>
            <label className="font-semibold mb-1 block">Type of Buyer:</label>
            <select
              className="w-full border border-[#C7B88A] bg-transparent px-3 py-2 focus:outline-none"
              value={typeOfBuyer}
              onChange={(e) => setTypeOfBuyer(e.target.value)}
            >
              {buyerTypesLoading && <option>Loading...</option>}
              {buyerTypesError && !buyerTypesLoading && (
                <option>Error loading buyer types</option>
              )}
              {!buyerTypesLoading && !buyerTypesError && buyerTypes.length === 0 && (
                <option>No types available</option>
              )}
              {!buyerTypesLoading && !buyerTypesError &&
                buyerTypes.map((t) => (
                  <option key={t.value} value={t.value} className="bg-[#F3EDE3] focus:outline-none">
                    {t.label}
                  </option>
                ))}
            </select>
          </div>

          {/* Company Name */}
          <div>
            <label className="font-semibold mb-1 block">
              Company / Organization Name:
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border border-[#C7B88A] bg-transparent px-3 py-2 focus:outline-none"
            />
          </div>

          {/* Country & City */}
          <div>
            <label className="font-semibold mb-1 block">
              Country & City of Registration:
            </label>
            <select
              className="w-full border border-[#C7B88A] bg-transparent px-3 py-2 focus:outline-none"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {countriesLoading && <option>Loading...</option>}
              {countriesError && !countriesLoading && (
                <option>Error loading countries</option>
              )}
              {!countriesLoading && !countriesError && countries.length === 0 && (
                <option>No countries available</option>
              )}
              {!countriesLoading && !countriesError &&
                countries.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
            </select>
          </div>

          {/* Company Email */}
          <div>
            <label className="font-semibold mb-1 block">Company Email:</label>
            <input
              type="email"
              value={companyEmail}
              readOnly
              className="w-full border border-[#C7B88A] bg-[#EBE3D6] text-gray-600 px-3 py-2 focus:outline-none cursor-not-allowed"
            />
          </div>

          {/* Company Phone */}
          <div className="col-span-1 md:col-span-1">
            <label className="font-semibold mb-1 block">Company Phone:</label>
            <PhoneInput
              country={'ae'}
              value={companyPhone}
              onChange={(phone, data: any) => {
                setCompanyPhone(`+${phone}`);
                setCompanyPhoneCountryCode(data.dialCode);
              }}
              enableSearch={true}
              disableSearchIcon={true}
              searchPlaceholder="Search Country..."
              searchStyle={{
                width: '94%',
                height: '36px',
                margin: '4px auto',
                backgroundColor: '#F3EDE3',
                border: '1px solid #C7B88A',
                borderRadius: '2px',
                padding: '8px',
                color: 'black'
              }}
              inputStyle={{
                width: '100%',
                height: '42px',
                backgroundColor: '#F3EDE3',
                border: '1px solid #C7B88A',
                color: '#000000',
                fontFamily: 'inherit',
                paddingLeft: '65px'
              }}
              buttonStyle={{
                border: '1px solid #C7B88A',
                backgroundColor: '#C7B88A',
                // width: '70px',
                justifyContent: 'flex-start',
                padding: '8px'
              }}
              dropdownStyle={{
                backgroundColor: '#F3EDE3',
                color: 'black',
                width: '300px'
              }}
            />
          </div>

          {/* Year */}
          <div>
            <label className="font-semibold mb-1 block">
              Year of Establishment:
            </label>
            <input
              type="text"
              placeholder="YYYY"
              value={yearOfEstablishment}
              onChange={(e) => setYearOfEstablishment(e.target.value)}
              className="w-full border border-[#C7B88A] bg-transparent px-3 py-2 focus:outline-none"
            />
          </div>

          {/* Physical Address */}
          <div>
            <label className="font-semibold mb-1 block">
              Physical Address:
            </label>
            <input
              type="text"
              placeholder="eg : Warehouse No. 12, Al Quasis Industrial Area 3, Dubai, United Arab Emirates"
              value={cityOfficeAddress}
              onChange={(e) => setCityOfficeAddress(e.target.value)}
              className="w-full border border-[#C7B88A] bg-transparent px-3 py-2 focus:outline-none"
            />
          </div>

          {/* Website */}
          <div>
            <label className="font-semibold mb-1 block">
              Website (if any):
            </label>
            <input
              type="text"
              placeholder="eg: www.blueweb2.com"
              value={officialWebsite}
              onChange={(e) => setOfficialWebsite(e.target.value)}
              className="w-full border border-[#C7B88A] bg-transparent px-3 py-2 focus:outline-none"
            />
          </div>
        </div>

        {/* UPLOAD SECTION */}
        <div className="mt-6">
          <label className="font-semibold mb-2 block text-sm text-black">
            Govt. or Compliance Registration (MOD, EOCN, etc.):
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setSelectedFile(file);
              }
            }}
            accept=".jpeg,.jpg,.png,.pdf,.mp4"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const file = e.dataTransfer.files?.[0];
              if (file) {
                setSelectedFile(file);
              }
            }}
            className="border border-dashed border-[#C7B88A] rounded-sm py-10 text-center bg-[#EFE8DC] cursor-pointer hover:bg-[#E5DDD1] transition-colors"
          >
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/icons/upload.png"
                alt="upload"
                width={28}
                height={28}
              />
              {selectedFile ? (
                <>
                  <p className="text-sm text-black font-semibold">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              ) : existingFile ? (
                <>
                  <p className="text-sm text-black font-semibold">
                    Current File Uploaded
                  </p>
                  <p className="text-xs text-black">
                    {existingFile.split('/').pop()}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Click or Drop to Replace
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-black">
                    Choose a File or Drag & Drop It Here.
                  </p>
                  <p className="text-xs text-gray-600">
                    JPEG, PNG, PDF, and MP4 formats, up to 10 MB.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* PREVIEW SECTION BELOW UPLOAD BOX */}
          {existingFile && !selectedFile && (
            <div className="mt-4 border border-[#C7B88A] bg-[#F3EDE3] p-4 text-center">
              <p className="text-sm font-bold text-black mb-2">Document Preview</p>
              {existingFile.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={existingFile}
                  className="w-full h-[500px]"
                />
              ) : (
                <div className="relative w-full h-[auto] min-h-[300px]">
                  <img
                    src={existingFile}
                    alt="Document Preview"
                    className="max-w-full h-auto mx-auto object-contain"
                  />
                </div>
              )}
              <a
                href={existingFile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 underline mt-2 block"
              >
                Open in New Tab
              </a>
            </div>
          )}
        </div>

        {/* NEXT BUTTON */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleSubmitStep0}
            className="w-[280px] h-[42px] bg-[#D35400] text-white font-black font-orbitron clip-path-supplier uppercase text-sm hover:bg-[#39482C] transition-colors"
          >
            {submitting ? "Submitting..." : "Next"}
          </button>
        </div>

        {/* Submit error */}
        {submitError && (
          <p className="mt-3 text-center text-sm text-red-600">{submitError}</p>
        )}
      </div>
    </>
  );
}
