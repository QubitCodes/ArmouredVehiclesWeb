"use client";
import { useState } from "react";
import { X } from "lucide-react";
import AddressForm from "@/components/checkout/AddressForm";
import { Address } from "@/lib/types";

interface AddEditAddressModalProps {
  onClose: () => void;
  onSuccess: (addr: Address) => void;
  initialData?: Address;
}

export default function AddEditAddressModal({ onClose, onSuccess, initialData }: AddEditAddressModalProps) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative bg-[#EBE3D6] w-full max-w-[800px] max-h-[85vh] flex flex-col rounded-md border border-[#E2DACB] shadow-lg animate-fadeIn">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2DACB] flex items-center justify-between shrink-0">
          <h2 className="font-orbitron font-bold text-[22px] uppercase text-black">
            {initialData ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#515151] hover:text-black transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Form Area */}
        <div className="bg-white flex-1 overflow-y-auto">
          <AddressForm 
            className="p-6 space-y-3"
            onCreated={onSuccess} 
            onCancel={onClose} 
            initialData={initialData}
            formId="address-form-modal"
            hideActions={true}
            onSubmitting={setLoading}
          />
        </div>

        {/* Fixed Footer */}
        <div className="p-6 border-t border-[#E2DACB] flex justify-end gap-4 shrink-0 bg-[#EBE3D6]">
          <button
            className="bg-[#C8C0A8] text-black font-semibold text-[14px] px-10 py-2 relative clip-path-[polygon(7%_0%,100%_0%,93%_100%,0%_100%)]"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="bg-[#D34D24] text-white font-orbitron font-bold text-[14px] uppercase px-10 py-2 relative clip-path-[polygon(7%_0%,100%_0%,93%_100%,0%_100%)] disabled:opacity-50"
            type="submit"
            form="address-form-modal"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Address"}
          </button>
        </div>
      </div>
    </div>
  );
}
