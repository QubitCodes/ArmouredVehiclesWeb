"use client";
import { useState } from "react";

export default function PromoInput() {
  const [promo, setPromo] = useState("");
  const [msg, setMsg] = useState("");

  const handleApply = () => {
    if (promo === "DISCOUNT10") {
      setMsg("Promo applied (Not reducing subtotal - Mock)!");
    } else {
      setMsg("Invalid promo code");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Promo Code"
        className="w-full border rounded-md px-3 py-2 text-sm"
        value={promo}
        onChange={(e) => setPromo(e.target.value)}
      />
      <button
        onClick={handleApply}
        className="bg-green-700 hover:bg-green-600 text-white w-full mt-2 py-2 rounded-md text-sm"
      >
        APPLY
      </button>

      {msg && <p className="text-xs mt-1 text-gray-700">{msg}</p>}
    </div>
  );
}
