"use client";

import { useState } from "react";
import { createAddress, updateAddress } from "@/app/services/address";
import { Address } from "@/lib/types";
import { getStoredUser } from "@/lib/api";

type NewAddress = Omit<Address, "id" | "userId" | "isVerified" | "createdAt">;

export default function AddressForm({
  onCreated,
  onCancel,
  initialData,
  formId,
  hideActions,
  onSubmitting,
  className
}: {
  onCreated: (addr: Address) => void;
  onCancel?: () => void;
  initialData?: Address;
  formId?: string;
  hideActions?: boolean;
  onSubmitting?: (loading: boolean) => void;
  className?: string;
}) {
  const [form, setForm] = useState<NewAddress>({
    label: initialData?.label || "",
    addressType: initialData?.addressType || "home",
    fullName: initialData?.fullName || (initialData as any)?.full_name || "",
    phone: initialData?.phone || "",
    addressLine1: initialData?.addressLine1 || (initialData as any)?.address_line1 || "",
    addressLine2: initialData?.addressLine2 || (initialData as any)?.address_line2 || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    postalCode: initialData?.postalCode || (initialData as any)?.postal_code || "",
    country: initialData?.country || "United Arab Emirates",
    isDefault: initialData?.isDefault || (initialData as any)?.is_default || false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof NewAddress, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    onSubmitting?.(true);
    try {
      let resAddress: Address;
      // Inject phone from profile
      const user = getStoredUser();
      const phoneToUse = user?.phone ? user.phone : "0000000000";

      console.log("DEBUG: AddressForm user:", user);
      console.log("DEBUG: Phone to use:", phoneToUse);

      const payload = {
        ...form,
        phone: phoneToUse,
        addressType: "home" as "home" | "work" | "other" // Default since UI is removed
      };

      console.log("DEBUG: Payload:", payload);

      if (initialData?.id) {
        await updateAddress(initialData.id, payload);
        // Manually merge
        resAddress = { ...initialData, ...payload } as Address;
      } else {
        resAddress = await createAddress(payload);
      }
      onCreated(resAddress);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save address");
    } finally {
      setSubmitting(false);
      onSubmitting?.(false);
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className={className || "p-4 bg-white border border-[#E2DACB] space-y-3"}>
      {error && <p className="text-[#D35400] text-sm">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-black mb-1">Label</label>
          <input
            type="text"
            value={form.label}
            onChange={(e) => update("label", e.target.value)}
            className="w-full bg-[#F0EBE3] border border-[#C2B280] px-3 py-2 text-sm text-black outline-none"
            placeholder="e.g. Home, Work"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-black mb-1">Full Name</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className="w-full bg-[#F0EBE3] border border-[#C2B280] px-3 py-2 text-sm text-black outline-none"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-black mb-1">Address Line 1</label>
          <input
            type="text"
            value={form.addressLine1}
            onChange={(e) => update("addressLine1", e.target.value)}
            className="w-full bg-[#F0EBE3] border border-[#C2B280] px-3 py-2 text-sm text-black outline-none"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-black mb-1">Address Line 2 (optional)</label>
          <input
            type="text"
            value={form.addressLine2 || ""}
            onChange={(e) => update("addressLine2", e.target.value)}
            className="w-full bg-[#F0EBE3] border border-[#C2B280] px-3 py-2 text-sm text-black outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-black mb-1">City</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            className="w-full bg-[#F0EBE3] border border-[#C2B280] px-3 py-2 text-sm text-black outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-black mb-1">State</label>
          <input
            type="text"
            value={form.state}
            onChange={(e) => update("state", e.target.value)}
            className="w-full bg-[#F0EBE3] border border-[#C2B280] px-3 py-2 text-sm text-black outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-black mb-1">Postal Code</label>
          <input
            type="text"
            value={form.postalCode}
            onChange={(e) => update("postalCode", e.target.value)}
            className="w-full bg-[#F0EBE3] border border-[#C2B280] px-3 py-2 text-sm text-black outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-black mb-1">Country</label>
          <input
            type="text"
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
            className="w-full bg-[#F0EBE3] border border-[#C2B280] px-3 py-2 text-sm text-black outline-none"
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => update("isDefault", !form.isDefault)}
          className={`w-10 h-5 rounded-full transition-colors relative ${form.isDefault ? "bg-[#D35400]" : "bg-[#C2B280]"}`}
        >
          <span className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${form.isDefault ? "translate-x-[22px] left-0.5" : "translate-x-0 left-0.5"}`} />
        </button>
        <span className="text-sm text-black">Set as default</span>
      </div>

      {!hideActions && (
        <div className="flex justify-end gap-3">
          {onCancel && (
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-[#C8C0A8] text-black font-semibold">
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-[#D34D24] text-white font-orbitron font-bold uppercase"
          >
            {submitting ? "Saving..." : "Save Address"}
          </button>
        </div>
      )}
    </form>
  );
}
