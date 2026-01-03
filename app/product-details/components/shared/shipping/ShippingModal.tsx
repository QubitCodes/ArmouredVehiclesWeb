"use client";

import { X } from "lucide-react";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ShippingModal({ open, onClose }: Props) {
  const [selected, setSelected] = useState("standard");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-xl rounded-lg p-6 z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Select shipping service</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Ship from <b>Dubai</b>; Deliver to <b>India</b>; Quantity: <b>50 pieces</b>
        </p>

        <div className="space-y-3">
          {[
            {
              id: "standard",
              label: "Standard armourdmart.com Logistics",
              date: "11 Feb",
              price: "₹49,377.58",
            },
            {
              id: "premium",
              label: "Premium armourdmart.com Logistics",
              date: "10 Feb",
              price: "₹53,879.52",
            },
            {
              id: "seller",
              label: "Seller's Shipping Method (DHL)",
              date: "17 Feb",
              price: "₹1,83,375.20",
            },
          ].map((opt) => (
            <label
              key={opt.id}
              className="border rounded-lg p-4 flex justify-between cursor-pointer"
            >
              <div className="flex gap-3">
                <input
                  type="radio"
                  checked={selected === opt.id}
                  onChange={() => setSelected(opt.id)}
                />
                <div>
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-sm">
                    Guaranteed delivery by <b>{opt.date}</b>
                  </div>
                </div>
              </div>
              <div className="font-semibold">{opt.price}</div>
            </label>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-[#FF6A00] text-white py-3 rounded-full font-semibold"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
