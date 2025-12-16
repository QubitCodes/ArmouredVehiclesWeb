"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface Address {
  id: string;
  label: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  isDefault: boolean;
  isVerified: boolean;
}

// Mock addresses data
const mockAddresses: Address[] = [
  {
    id: "1",
    label: "Martin Automobiles",
    name: "John Martin",
    address: "Al Qusais",
    city: "Dubai",
    country: "United Arab Emirates",
    phone: "+971 501234567",
    isDefault: true,
    isVerified: true,
  },
];

export default function AddressPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasProcessedNew = useRef(false);
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [toggleStates, setToggleStates] = useState<{ [key: string]: boolean }>({
    "1": true, // Default address toggle is ON initially
  });

  // Check for new address from details page
  useEffect(() => {
    const isNew = searchParams.get("new");
    console.log("AddressPage: isNew =", isNew, "hasProcessed =", hasProcessedNew.current);
    
    if (isNew === "true" && !hasProcessedNew.current) {
      const storedAddress = localStorage.getItem("newAddress");
      console.log("AddressPage: storedAddress =", storedAddress);
      
      if (storedAddress) {
        hasProcessedNew.current = true;
        
        try {
          const parsed = JSON.parse(storedAddress);
          console.log("AddressPage: parsed =", parsed);
          const newId = parsed.id || String(Date.now());
          
          // Check if this is from the details form (has location object) or old format
          let newAddress: Address;
          
          if (parsed.fullAddress || parsed.contact) {
            // New format from AddressDetailsPage
            newAddress = {
              id: newId,
              label: parsed.label || "Home",
              name: parsed.contact?.fullName || "John Martin",
              address: parsed.fullAddress || parsed.location?.area || "Address not specified",
              city: parsed.location?.city || "Dubai",
              country: parsed.location?.country || "United Arab Emirates",
              phone: parsed.contact?.phone || "+971 501234567",
              isDefault: parsed.isDefault || false,
              isVerified: false,
            };
          } else if (parsed.address) {
            // Old format (just address string)
            const addressParts = (parsed.address || "").split(", ");
            newAddress = {
              id: newId,
              label: "Home",
              name: "John Martin",
              address: addressParts[0] || parsed.address,
              city: addressParts[1] || "Dubai",
              country: addressParts.slice(2).join(", ") || "United Arab Emirates",
              phone: "+971 501234567",
              isDefault: false,
              isVerified: false,
            };
          } else {
            // Fallback - minimal data
            newAddress = {
              id: newId,
              label: "Home",
              name: "Unknown",
              address: "Address not specified",
              city: "Dubai",
              country: "United Arab Emirates",
              phone: "+971 501234567",
              isDefault: false,
              isVerified: false,
            };
          }

          // Add the new address
          setAddresses((prev) => [...prev, newAddress]);
          setToggleStates((prev) => ({ ...prev, [newId]: newAddress.isDefault }));
          
          // Clear localStorage
          localStorage.removeItem("newAddress");
          
          // Remove the ?new=true from URL
          router.replace("/address", { scroll: false });
        } catch (e) {
          console.error("Error parsing new address:", e);
        }
      }
    }
  }, [searchParams, router]);

  const defaultAddress = addresses[0]; // First address is always shown in Default section
  const otherAddresses = addresses.slice(1); // Rest are in Other Addresses section

  const handleToggleDefault = (id: string) => {
    setToggleStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  return (
    <main className="flex-1">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-orbitron font-black text-xl lg:text-[32px] uppercase tracking-wide text-black">
          Addresses
        </h1>
        <p className="font-inter text-sm text-[#666] mt-1">
          Manage your saved addresses for quicker, hassle-free checkout across all Armored Mart marketplaces.
        </p>
      </div>

      {/* Add New Address Button */}
      <div className="mb-8">
        <Link href="/address/new">
          <button className="bg-[#D35400] hover:bg-[#39482C] text-white clip-path-supplier flex items-center justify-center h-[40px] px-6 cursor-pointer transition-colors">
            <span className="font-black text-[13px] font-orbitron uppercase">Add New Address</span>
          </button>
        </Link>
      </div>

      {/* Default Address Section */}
      <div className="mb-8">
        <h2 className="font-orbitron font-black text-base lg:text-lg uppercase tracking-wide text-black mb-4">
          Default Address
        </h2>

        {defaultAddress ? (
          <div className="bg-[#EBE3D6] border border-[#E8E3D9] p-5">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-inter font-semibold text-base text-black">
                {defaultAddress.label}
              </h3>
              <div className="flex items-center gap-4">
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(defaultAddress.id)}
                  className="flex items-center gap-1 text-[#666] hover:text-[#D35400] transition-colors"
                >
                  <Image
                    src="/order/deletesvg.svg"
                    alt="Delete"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                  <span className="font-inter text-sm underline">Delete</span>
                </button>

                {/* Edit Button */}
                <Link
                  href={`/address/edit/${defaultAddress.id}`}
                  className="flex items-center gap-1 text-[#666] hover:text-[#D35400] transition-colors"
                >
                  <Image
                    src="/order/pfsv1.svg"
                    alt="Edit"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                  <span className="font-inter text-sm underline">Edit</span>
                </Link>

                {/* Default Address Toggle */}
                <div className="flex items-center gap-2">
                  <span className="font-inter font-normal text-[14px] text-black">Default Address</span>
                  <button
                    onClick={() => handleToggleDefault(defaultAddress.id)}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${
                      toggleStates[defaultAddress.id] ? "bg-[#D35400]" : "bg-[#C2B280]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
                        toggleStates[defaultAddress.id] ? "translate-x-[26px] left-0.5" : "translate-x-0 left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-2">
              <div className="flex">
                <span className="font-inter text-sm text-[#666] w-20">Name</span>
                <span className="font-inter text-sm text-black">{defaultAddress.name}</span>
              </div>
              <div className="flex">
                <span className="font-inter text-sm text-[#666] w-20">Address</span>
                <span className="font-inter text-sm text-black">
                  {defaultAddress.address}, <strong>{defaultAddress.city}</strong>, {defaultAddress.country}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-inter text-sm text-[#666] w-20">Phone</span>
                <span className="font-inter text-sm text-black">{defaultAddress.phone}</span>
                {defaultAddress.isVerified && (
                  <span className="ml-2 flex items-center gap-1 bg-[#E8F5E9] text-[#27AE60] px-2 py-0.5 rounded text-xs">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#27AE60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="#27AE60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="font-inter text-sm text-[#666]">No default address set.</p>
        )}
      </div>

      {/* Other Addresses Section */}
      <div>
        <h2 className="font-orbitron font-black text-base lg:text-lg uppercase tracking-wide text-black mb-4">
          Other Addresses
        </h2>

        {otherAddresses.length > 0 ? (
          <div className="space-y-4">
            {otherAddresses.map((address) => (
              <div key={address.id} className="bg-[#EBE3D6] border border-[#E8E3D9] p-5">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-inter font-semibold text-base text-black">
                    {address.label}
                  </h3>
                  <div className="flex items-center gap-4">
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="flex items-center gap-1 text-[#666] hover:text-[#D35400] transition-colors"
                    >
                      <Image
                        src="/order/deletesvg.svg"
                        alt="Delete"
                        width={16}
                        height={16}
                        className="object-contain"
                      />
                      <span className="font-inter text-sm underline">Delete</span>
                    </button>

                    {/* Edit Button */}
                    <Link
                      href={`/address/edit/${address.id}`}
                      className="flex items-center gap-1 text-[#666] hover:text-[#D35400] transition-colors"
                    >
                      <Image
                        src="/order/pfsv1.svg"
                        alt="Edit"
                        width={16}
                        height={16}
                        className="object-contain"
                      />
                      <span className="font-inter text-sm underline">Edit</span>
                    </Link>

                    {/* Default Address Toggle */}
                    <div className="flex items-center gap-2">
                      <span className="font-inter font-normal text-[14px] text-black">Default Address</span>
                      <button
                        onClick={() => handleToggleDefault(address.id)}
                        className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${
                          toggleStates[address.id] ? "bg-[#D35400]" : "bg-[#C2B280]"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
                            toggleStates[address.id] ? "translate-x-[26px] left-0.5" : "translate-x-0 left-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Address Details */}
                <div className="space-y-2">
                  <div className="flex">
                    <span className="font-inter text-sm text-[#666] w-20">Name</span>
                    <span className="font-inter text-sm text-black">{address.name}</span>
                  </div>
                  <div className="flex">
                    <span className="font-inter text-sm text-[#666] w-20">Address</span>
                    <span className="font-inter text-sm text-black">
                      {address.address}, <strong>{address.city}</strong>, {address.country}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-inter text-sm text-[#666] w-20">Phone</span>
                    <span className="font-inter text-sm text-black">{address.phone}</span>
                    {address.isVerified && (
                      <span className="ml-2 flex items-center gap-1 bg-[#E8F5E9] text-[#27AE60] px-2 py-0.5 rounded text-xs">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#27AE60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="#27AE60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-inter text-sm text-[#666]">No other addresses saved.</p>
        )}
      </div>
    </main>
  );
}

