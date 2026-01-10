"use client";
import { Edit, Plus, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAddresses } from "@/app/services/address";
import { Address } from "@/lib/types";
import AddressForm from "@/components/checkout/AddressForm";

export default function SelectAddressModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAddresses();
        setAddresses(res.data);
        const def = res.data.find((a) => a.isDefault);
        setSelectedId(def ? def.id : res.data[0]?.id || null);
      } catch (e) {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreated = (addr: Address) => {
    setShowForm(false);
    setAddresses((prev) => [addr, ...prev]);
    setSelectedId(addr.id);
  };

  const handleConfirm = () => {
    if (selectedId) {
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("selectedAddressId", String(selectedId));
        }
      } catch {}
    }
    onClose();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      <div className="relative bg-[#EBE3D6] w-full max-w-[950px] rounded-md border border-[#E2DACB] shadow-lg animate-fadeIn overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2DACB] flex items-center justify-between">
          <h2 className="font-orbitron font-bold text-[22px] uppercase text-black">Select Delivery Address</h2>
          <div className="text-sm font-semibold flex text-black items-center gap-2">
            <span className="text-[#006A4E]">🇦🇪</span> Ship to UAE ▼
          </div>
        </div>

        {!showForm && (
          <div className="p-6 space-y-3 bg-white border-b border-[#C2B280]">
            {loading && <p className="text-sm text-[#666]">Loading addresses...</p>}
            {!loading && addresses.length === 0 && (
              <p className="text-sm text-[#666]">No addresses found. Add a new one below.</p>
            )}
            {addresses.map((addr) => (
              <label key={addr.id} className="flex items-start justify-between p-3 border border-[#E2DACB]">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 border flex items-center justify-center transition-colors shadow-sm ${
                      selectedId === addr.id ? "bg-[#D7C6AF] border-[#C2B280]" : "bg-[#F0EBE3] border-[#C2B280]"
                    }`}
                    onClick={() => setSelectedId(addr.id)}
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
                    <p className="text-[13px] text-black">
                      <span className="font-semibold">Address: </span>
                      {addr.addressLine1}
                      {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}, {addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                    <p className="text-[13px] text-black">
                      <span className="font-semibold">Phone: </span>
                      {addr.phone}
                    </p>
                  </div>
                </div>
                <button className="text-sm flex items-center gap-1 text-[#515151] hover:text-black">
                  <Edit size={15} /> Edit
                </button>
                <input type="radio" className="sr-only" name="address" checked={selectedId === addr.id} onChange={() => setSelectedId(addr.id)} />
              </label>
            ))}
          </div>
        )}

        {showForm ? (
          <div className="p-6 bg-white border-b border-[#C2B280]">
            <AddressForm onCreated={handleCreated} onCancel={() => setShowForm(false)} />
          </div>
        ) : (
          <button className="px-6 py-4 text-sm text-[#444] flex items-center gap-2 hover:bg-gray-50 w-full text-left" onClick={() => setShowForm(true)}>
            <Plus size={16} /> Add New Address
          </button>
        )}

        <div className="p-6 flex justify-end gap-4">
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
