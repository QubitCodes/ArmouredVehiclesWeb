"use client";
import { useState } from "react";
import { X, CreditCard, Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentMethodModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [rememberCard, setRememberCard] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join("   ") : value;
  };

  const handleSubmit = () => {
    onClose();
    // Navigate to order confirmation or process payment
    router.push("/order-confirmation");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-[#EBE3D6] w-full max-w-[450px] rounded-md border border-[#E2DACB] shadow-lg animate-fadeIn overflow-hidden">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-[#666] hover:text-black transition-colors"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="font-orbitron font-bold text-[22px] uppercase text-black">
            Payment Method
          </h2>
        </div>

        {/* Form */}
        <div className="px-6 pb-6 space-y-5">
          {/* Card Number */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              CARD NUMBER
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="***   ***   *****"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={22}
                className="w-full bg-white border border-[#C2B280] px-4 py-3 text-[15px] outline-none focus:border-[#D35400] transition-colors"
              />
            </div>
          </div>

          {/* Expiry Date & CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                EXPIRY DATE
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="MM"
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, "").slice(0, 2))}
                  maxLength={2}
                  className="w-16 bg-white border border-[#C2B280] px-3 py-3 text-[15px] text-center outline-none focus:border-[#D35400] transition-colors"
                />
                <span className="flex items-center text-[#999]">/</span>
                <input
                  type="text"
                  placeholder="YY"
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, "").slice(0, 2))}
                  maxLength={2}
                  className="w-16 bg-white border border-[#C2B280] px-3 py-3 text-[15px] text-center outline-none focus:border-[#D35400] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2 flex items-center gap-2">
                CVV
                <Info size={14} className="text-[#999]" />
              </label>
              <input
                type="text"
                placeholder="Code"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                maxLength={4}
                className="w-full bg-white border border-[#C2B280] px-4 py-3 text-[15px] outline-none focus:border-[#D35400] transition-colors"
              />
            </div>
          </div>

          {/* Remember Card */}
          <div className="space-y-1">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                  rememberCard
                    ? "bg-[#39482C] border-[#39482C]"
                    : "bg-white border-[#C2B280]"
                }`}
                onClick={() => setRememberCard(!rememberCard)}
              >
                {rememberCard && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-black">Remember this card</span>
            </label>
            <p className="text-[11px] text-[#666] ml-8">
              ArmoredMart will securely store this card for a faster payment experience. CVV number will not be stored.
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-[#D35400] text-white font-orbitron font-bold text-[16px] uppercase py-4 hover:bg-[#B51E17] transition-colors"
            style={{ clipPath: 'polygon(15px 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 15px 100%, 0 50%)' }}
          >
            ADD MY CARD
          </button>
        </div>
      </div>
    </div>
  );
}

