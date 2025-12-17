"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const languages = [
  { id: "en", label: "English" },
  { id: "ar", label: "Arabic" },
  { id: "fr", label: "French" },
  { id: "de", label: "German" },
];

export default function NotificationsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  // Marketing preferences toggles
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);

  const selectedLanguageLabel = languages.find(l => l.id === selectedLanguage)?.label || "English";

  return (
    <main className="flex-1">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-orbitron font-black text-xl lg:text-[32px] uppercase tracking-wide text-black">
          Notifications
        </h1>
      </div>

      {/* Receive Communications In */}
      <div className="bg-[#EBE3D6] p-5 lg:p-6 mb-6">
        <h2 className="font-orbitron font-black text-sm lg:text-base uppercase tracking-wide text-black mb-4">
          Receive Communications In
        </h2>

        {/* Language Dropdown */}
        <div className="relative w-full md:w-1/2">
          <label className="block font-inter text-sm text-[#666] mb-2">Language</label>
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="w-full bg-[#F0EBE3] border border-[#C2B280] px-4 py-3 flex items-center justify-between"
          >
            <span className="font-inter text-sm text-black">{selectedLanguageLabel}</span>
            <ChevronDown 
              size={18} 
              className={`text-[#666] transition-transform ${showLanguageDropdown ? "rotate-180" : ""}`} 
            />
          </button>

          {/* Dropdown Options */}
          {showLanguageDropdown && (
            <div className="absolute top-full left-0 w-full bg-[#F0EBE3] border border-[#C2B280] border-t-0 z-10">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setSelectedLanguage(lang.id);
                    setShowLanguageDropdown(false);
                  }}
                  className={`w-full px-4 py-3 text-left font-inter text-sm hover:bg-[#E8E3D9] transition-colors ${
                    selectedLanguage === lang.id ? "bg-[#E8E3D9] text-black" : "text-[#666]"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Marketing Preferences */}
      <div className="bg-[#EBE3D6] p-5 lg:p-6">
        <h2 className="font-orbitron font-black text-sm lg:text-base uppercase tracking-wide text-black mb-4">
          Marketing Preferences
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Email Toggle */}
          <div className="bg-[#F0EBE3] border border-[#C2B280] px-4 py-3 flex items-center gap-3">
            <Image
              src="/order/email.svg"
              alt="Email"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="font-inter text-sm text-black flex-1">Email</span>
            <button
              onClick={() => setEmailEnabled(!emailEnabled)}
              className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${
                emailEnabled ? "bg-[#D35400]" : "bg-[#C2B280]"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
                  emailEnabled ? "translate-x-[26px] left-0.5" : "translate-x-0 left-0.5"
                }`}
              />
            </button>
          </div>

          {/* SMS Toggle */}
          <div className="bg-[#F0EBE3] border border-[#C2B280] px-4 py-3 flex items-center gap-3">
            <Image
              src="/order/chat.svg"
              alt="SMS"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="font-inter text-sm text-black flex-1">SMS</span>
            <button
              onClick={() => setSmsEnabled(!smsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${
                smsEnabled ? "bg-[#D35400]" : "bg-[#C2B280]"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
                  smsEnabled ? "translate-x-[26px] left-0.5" : "translate-x-0 left-0.5"
                }`}
              />
            </button>
          </div>

          {/* WhatsApp Toggle */}
          <div className="bg-[#F0EBE3] border border-[#C2B280] px-4 py-3 flex items-center gap-3">
            <Image
              src="/order/whatsapp.svg"
              alt="WhatsApp"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="font-inter text-sm text-black flex-1">WhatsApp</span>
            <button
              onClick={() => setWhatsappEnabled(!whatsappEnabled)}
              className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${
                whatsappEnabled ? "bg-[#D35400]" : "bg-[#C2B280]"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
                  whatsappEnabled ? "translate-x-[26px] left-0.5" : "translate-x-0 left-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

