"use client";
import { Edit, Plus, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAddresses } from "@/app/services/address";
import { Address } from "@/lib/types";
import AddEditAddressModal from "./AddEditAddressModal";

// ... existing imports

import { useAddressStore } from "@/lib/address-store";

// ... imports

export default function SelectAddressModal({ onClose, onSelect }: { onClose: () => void; onSelect?: (id: number) => void }) {
  const router = useRouter();

  // Store
  const addresses = useAddressStore((s) => s.addresses);
  const selectedId = useAddressStore((s) => s.selectedId);
  const isLoading = useAddressStore((s) => s.isLoading);
  const fetchAddresses = useAddressStore((s) => s.fetchAddresses);
  const selectAddress = useAddressStore((s) => s.selectAddress);

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    // Fetch if empty or stale? Just fetch to be safe and get latest
    fetchAddresses();
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleCreated = async (addr: Address) => {
    // Inject phone from user profile
    // This logic seems to be misplaced here, as handleCreated is a callback
    // from AddEditAddressModal. The actual creation/saving logic with phone injection
    // should be within AddEditAddressModal.
    // Applying the diff as requested, but noting potential logical inconsistency.
    // The original handleCreated was:
    // setShowForm(false);
    // setEditingAddress(undefined);
    // await fetchAddresses(); // Refresh list from server to get sync state
    // // Store logic handles selection of new if needed, or we can manually select
    // selectAddress(addr.id);
    // The provided diff seems to be a mix of AddEditAddressModal's save logic and this component's callback.
    // Attempting to merge based on the provided diff structure.
    // The diff provided for handleCreated is syntactically incorrect and appears to be a mix of different functions.
    // Given the instruction to make it syntactically correct, and the context of SelectAddressModal,
    // I will assume the intent was to *replace* the existing handleCreated with the new logic,
    // and then the original fetch/select logic should still follow.
    // However, the provided diff is too malformed to apply directly and maintain syntax.
    // I will revert to the original handleCreated and assume the "Inject phone" instruction
    // is meant for the AddEditAddressModal component, which is not part of this file.
    // If the user intended to add new logic to *this* handleCreated, it needs to be provided in a syntactically valid way.
    // For now, I will keep the original handleCreated as it is the only syntactically correct interpretation
    // of the existing code, and the diff provided for it is broken.
    setShowForm(false);
    setEditingAddress(undefined);
    await fetchAddresses(); // Refresh list from server to get sync state
    // Store logic handles selection of new if needed, or we can manually select
    selectAddress(addr.id);
  };

  const handleEdit = (addr: Address) => {
    setEditingAddress(addr);
    setShowForm(true);
  };

  const openNew = () => {
    setEditingAddress(undefined);
    setShowForm(true);
  };

  const handleConfirm = () => {
    if (selectedId) {
      // Store already persisted selectedId
      if (onSelect) {
        onSelect(selectedId); // For custom callbacks
      }
      onClose();
    }
  };

  if (showForm) {
    return (
      <AddEditAddressModal
        onClose={() => { setShowForm(false); setEditingAddress(undefined); }}
        onSuccess={handleCreated}
        initialData={editingAddress}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      <div className="relative bg-[#EBE3D6] w-full max-w-[950px] rounded-md border border-[#E2DACB] shadow-lg animate-fadeIn overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-[#E2DACB] flex items-center justify-between shrink-0">
          <h2 className="font-orbitron font-bold text-[22px] uppercase text-black">Select Delivery Address</h2>
        </div>

        <div className="p-6 space-y-3 bg-white border-b border-[#C2B280] overflow-y-auto">
          {isLoading && addresses.length === 0 && <p className="text-sm text-[#666]">Loading addresses...</p>}
          {!isLoading && addresses.length === 0 && (
            <p className="text-sm text-[#666]">No addresses found. Add a new one below.</p>
          )}
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`flex items-start justify-between p-3 border cursor-pointer transition-colors ${selectedId === addr.id ? "border-[#C2B280] bg-[#FFF8F0]" : "border-[#E2DACB]"}`}
              onClick={() => selectAddress(addr.id)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 border flex items-center justify-center transition-colors shadow-sm mt-1 ${selectedId === addr.id ? "bg-[#D7C6AF] border-[#C2B280]" : "bg-[#F0EBE3] border-[#C2B280]"
                    }`}
                >
                  {selectedId === addr.id && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <div className="flex items-center text-black gap-2 mb-1">
                    <span className="font-bold">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] bg-[#FF8A00] text-black px-2 py-0.5 rounded-md">Default</span>
                    )}
                  </div>
                  <p className="text-[13px] text-black">
                    <span className="font-semibold">Name: </span>
                    {addr.fullName}
                  </p>
                  <div className="text-[13px] text-black">
                    <span className="font-semibold block mb-1">Address: </span>
                    <p>{addr.addressLine1 || (addr as any).address_line1}</p>
                    {(addr.addressLine2 || (addr as any).address_line2) && (
                      <p>{addr.addressLine2 || (addr as any).address_line2}</p>
                    )}
                    <p>
                      {[addr.city, addr.state].filter(Boolean).join(", ")}
                      {(addr.postalCode || (addr as any).postal_code) ? ` - ${addr.postalCode || (addr as any).postal_code}` : ""}
                    </p>
                    <p>{addr.country}</p>
                  </div>


                </div>
              </div>
              <button
                className="text-sm flex items-center gap-1 text-[#515151] hover:text-black px-2 py-1"
                onClick={(e) => { e.stopPropagation(); handleEdit(addr); }}
              >
                <Edit size={15} /> Edit
              </button>
            </div>
          ))}

          <button className="px-2 py-4 text-sm text-[#444] flex items-center gap-2 hover:bg-gray-50 w-full text-left" onClick={openNew}>
            <Plus size={16} /> Add New Address
          </button>
        </div>

        <div className="p-6 flex justify-end gap-4 shrink-0 bg-[#EBE3D6]">
          <button
            className="bg-[#C8C0A8] text-black font-semibold text-[14px] px-10 py-2 relative clip-path-[polygon(7%_0%,100%_0%,93%_100%,0%_100%)]"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-[#D34D24] text-white font-orbitron font-bold text-[14px] uppercase px-10 py-2 relative clip-path-[polygon(7%_0%,100%_0%,93%_100%,0%_100%)]"
            onClick={handleConfirm}
            disabled={!selectedId}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
