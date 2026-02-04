"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SelectReasonModal from "@/components/modal/SelectReasonModal";

// Mock claimable items data - set to empty array [] to see empty state
const mockClaimableItemsData = [
  {
    id: "1",
    orderId: "#AMZ-12345678-987654",
    productName: "DFC® - 4000 HybriDynamic Hybrid Rear Brake Pads",
    productImage: "/order/wishlist2.svg",
    warrantyEligible: true,
    warrantyEndDate: "Mon, Oct 17, 2022",
  },
  {
    id: "2",
    orderId: "#AMZ-12345678-987654",
    productName: "Duralast 45084DL High-Performance Disc Brake Rotor",
    productImage: "/order/wishlist3.svg",
    warrantyEligible: true,
    warrantyEndDate: "Mon, Oct 17, 2022",
  },
  {
    id: "3",
    orderId: "#AMZ-12345678-987654",
    productName: "Duralast Heavy-Duty Disc Brake Rotor 54094DL Reliable OEM-Grade Performance",
    productImage: "/order/wishlist4.svg",
    warrantyEligible: true,
    warrantyEndDate: "Mon, Oct 17, 2022",
  },
];

// Mock pickup addresses
const mockPickupAddresses = [
  {
    id: "1",
    name: "John Martin",
    address: "Al Qusais, Dubai, United Arab Emirates",
    phone: "+971 501234567",
    isVerified: true,
    isDefault: true,
  },
];

interface CreateWarrantyClaimPageProps {
  itemId?: string;
}

export default function CreateWarrantyClaimPage({ itemId }: CreateWarrantyClaimPageProps) {
  const [claimableItems] = useState(mockClaimableItemsData);
  const [selectedClaimType, setSelectedClaimType] = useState<string>("manufacturer");
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [pickupAddresses] = useState(mockPickupAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(mockPickupAddresses[0]?.id || "");
  
  // Find the specific item if itemId is provided
  const currentItem = itemId ? claimableItems.find(item => item.id === itemId) : null;

  // If itemId is provided, show the claim form for that specific item
  if (currentItem) {
    return (
      <main className="flex-1">
        {/* Header with Back Arrow */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/warranty-claims/new" className="text-black hover:opacity-70">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="font-orbitron font-black text-xl lg:text-[32px] uppercase tracking-wide text-black">
              File a New Claim
            </h1>
          </div>
          <Link href="/warranty-claims">
            <div className="bg-[#C2B280] clip-path-supplier p-[1px] cursor-pointer">
              <div className="bg-[#EBE3D6] hover:bg-[#E3DDD0] clip-path-supplier flex items-center justify-center px-6 h-[38px]">
                <span className="font-black text-[14px] font-orbitron uppercase text-black">Cancel</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Selected Product Card */}
        <div className="bg-[#EBE3D6] p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#F0EBE3] flex-shrink-0 flex items-center justify-center p-2">
              <Image
                src={currentItem.productImage}
                alt={currentItem.productName}
                width={60}
                height={60}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-inter text-sm lg:text-base font-medium text-black mb-1">
                {currentItem.productName}
              </h3>
              <p className="font-inter text-xs text-[#666]">
                Order ID: {currentItem.orderId}
              </p>
            </div>
          </div>
        </div>

        {/* Select a Reason Dropdown */}
        <div 
          onClick={() => setShowReasonModal(true)}
          className="bg-[#EBE3D6] p-4 mb-6 flex items-center justify-between cursor-pointer hover:bg-[#E3DDD0]"
        >
          <span className={`font-inter text-sm ${selectedReason ? "text-black" : "text-[#666]"}`}>
            {selectedReason || "Select a Reason"}
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Reason Modal */}
        {showReasonModal && (
          <SelectReasonModal
            onClose={() => setShowReasonModal(false)}
            onSelect={(reason) => setSelectedReason(reason)}
            selectedReason={selectedReason}
          />
        )}

        {/* Select a Claim Type */}
        <div className="mb-6">
          <h2 className="font-orbitron font-black text-lg uppercase tracking-wide text-black mb-4">
            Select a Claim Type
          </h2>
          
          {/* Manufacturer Warranty Option */}
          <div 
            onClick={() => setSelectedClaimType("manufacturer")}
            className="bg-[#EBE3D6] p-4 flex items-center gap-4 cursor-pointer hover:bg-[#E3DDD0]"
          >
            <div className="w-10 h-10 flex-shrink-0">
              <Image
                src="/order/fileclaimsvg.svg"
                alt="Warranty"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-inter text-sm font-medium text-black">Manufacturer Warranty</h3>
              <p className="font-inter text-xs">
                <span className="text-[#6E6E6E]">Valid until </span>
                <span className="text-[#009900]">{currentItem.warrantyEndDate}</span>
              </p>
            </div>
            {/* Radio Button */}
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedClaimType === "manufacturer" 
                ? "border-[#D35400]" 
                : "border-[#C2B280]"
            }`}>
              {selectedClaimType === "manufacturer" && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#D35400]"></div>
              )}
            </div>
          </div>
        </div>

        {/* Select Your Pickup Address */}
        <div className="mb-6">
          <h2 className="font-orbitron font-black text-lg uppercase tracking-wide text-black mb-4">
            Select Your Pickup Address
          </h2>
          
          {/* Address Cards */}
          <div className="space-y-3">
            {pickupAddresses.map((address) => (
              <div 
                key={address.id}
                onClick={() => setSelectedAddressId(address.id)}
                className="bg-[#EBE3D6] p-4 cursor-pointer hover:bg-[#E3DDD0] transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-inter text-sm font-semibold text-black mb-1">
                      {address.name}
                    </h3>
                    <p className="font-inter text-xs text-[#666] mb-1">
                      {address.address}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-inter text-xs text-[#666]">
                        {address.phone}
                      </span>
                      {address.isVerified && (
                        <span className="flex items-center gap-1 text-xs text-[#009900]">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" fill="#009900"/>
                            <path d="M4 6L5.5 7.5L8 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Radio Button */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                    selectedAddressId === address.id 
                      ? "border-[#D35400]" 
                      : "border-[#C2B280]"
                  }`}>
                    {selectedAddressId === address.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#D35400]"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-orbitron font-black text-xl lg:text-[32px] uppercase tracking-wide text-black">
            File a New Claim
          </h1>
          <p className="font-inter text-sm text-[#666] mt-1">
            Select the product you&apos;d like to file a claim for.<br />
            Please note that only one product can be claimed at a time.
          </p>
        </div>
        <Link href="/warranty-claims">
          <div className="bg-[#C2B280] clip-path-supplier p-[1px] cursor-pointer">
            <div className="bg-[#EBE3D6] hover:bg-[#E3DDD0] clip-path-supplier flex items-center justify-center px-6 h-[38px]">
              <span className="font-black text-[14px] font-orbitron uppercase text-black">Cancel</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Content */}
      {claimableItems.length === 0 ? (
        /* Empty State - No Claimable Items */
        <div className="flex flex-col items-center justify-center text-center py-16 lg:py-24" >
          <Image
            src="/order/waranty1.svg"
            alt="No Claimable Items"
            width={200}
            height={180}
            className="mb-8"
          />
          <h2 className="font-orbitron font-bold text-lg lg:text-xl uppercase tracking-wide text-black mb-3">
            No Claimable Items
          </h2>
          <p className="font-inter text-sm lg:text-base text-[#666] max-w-md mb-6">
            None of the items from your previous <span className="font-semibold text-black">Armored Mart</span> orders are currently covered under warranty.
          </p>
          <Link href="/warranty-claims">
            <button className="bg-[#D35400] hover:bg-[#39482C] text-white clip-path-supplier-refund flex items-center justify-center w-full h-[45px] px-[30px] py-[15px] cursor-pointer">
              <span className="font-black text-[16px] font-orbitron uppercase">Back to Existing Claims</span>
            </button>
          </Link>
        </div>
      ) : (
        /* Claimable Items List */
        <div className="space-y-3">
          {claimableItems.map((item) => (
            <Link
              key={item.id}
              href={`/warranty-claims/new/${item.id}`}
              className={`block bg-[#F0EBE3] p-4 transition-all border border-[#E8E3D9] hover:border-[#C2B280]`}
            >
              <div className="flex items-center gap-4">
                {/* Product Image */}
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#EBE3D6] flex-shrink-0 flex items-center justify-center p-2">
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    width={60}
                    height={60}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-inter text-sm lg:text-base font-medium text-black mb-1 line-clamp-2">
                    {item.productName}
                  </h3>
                  <p className="font-inter text-xs text-[#666]">
                    Order ID: {item.orderId}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

