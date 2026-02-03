"use client";
import { useState, useEffect } from "react";
import { X, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface PaymentMethodModalProps {
  onClose: () => void;
  subtotal?: number;
  onPaymentSuccess?: () => void;
}

export default function PaymentMethodModal({
  onClose,
  subtotal = 0,
  onPaymentSuccess,
}: PaymentMethodModalProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [error, setError] = useState<string | null>(null);

  // Handle Stripe checkout
  const createCheckoutSession = useMutation({
    mutationFn: async () => {
      return await api.checkout.createSession();
    },
    onSuccess: (data) => {
      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else if (data.redirectUrl) {
        // Redirect to internal page (e.g. approval summary)
        window.location.href = data.redirectUrl;
      } else if (data.testMode) {
        // In test mode, show the order ID
        setError(`Order created in test mode: ${data.orderId}`);
        setIsProcessing(false);
      } else {
        throw new Error(data.error || "No checkout URL returned");
      }
    },
    onError: (error: any) => {
      setError(error.message || "Payment processing failed");
      setIsProcessing(false);
    },
  });

  const handleSubmit = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      if (selectedPaymentMethod === "card") {
        // For Stripe card payment, create a checkout session
        await createCheckoutSession.mutateAsync();
      } else {
        // For other payment methods (coming soon)
        setError(`${selectedPaymentMethod} payment is coming soon`);
        setIsProcessing(false);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-[#EBE3D6] w-full max-w-[500px] rounded-md border border-[#E2DACB] shadow-lg overflow-hidden">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-[#666] hover:text-black transition-colors z-10"
          onClick={onClose}>
          <X size={24} />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="font-orbitron font-bold text-[22px] uppercase text-black">
            Complete Payment
          </h2>
          <p className="text-sm text-[#6E6E6E] mt-2">
            Secure payment powered by Stripe
          </p>
        </div>

        {/* Form */}
        <div className="px-6 pb-6 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-semibold text-black mb-3">
              PAYMENT METHOD
            </label>

            {/* Card Option */}
            <label
              className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all mb-3 ${selectedPaymentMethod === "card"
                  ? "border-[#D35400] bg-[#FFF8F0]"
                  : "border-[#C2B280] bg-white"
                }`}>
              <input
                type="radio"
                name="payment-method"
                value="card"
                checked={selectedPaymentMethod === "card"}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="w-4 h-4 cursor-pointer"
              />
              <div>
                <p className="font-semibold text-black">Debit/Credit Card</p>
                <p className="text-xs text-[#6E6E6E]">
                  Visa, Mastercard, American Express
                </p>
              </div>
            </label>

            {/* Tabby Option (Coming Soon) */}
            <label className="flex items-center gap-3 p-4 border-2 border-[#C2B280] rounded-lg cursor-not-allowed opacity-60 mb-3 bg-[#F5F5F5]">
              <input
                type="radio"
                name="payment-method"
                value="tabby"
                disabled
                className="w-4 h-4 cursor-not-allowed"
              />
              <div>
                <p className="font-semibold text-black">Tabby</p>
                <p className="text-xs text-[#6E6E6E]">
                  Split into 4 payments (Coming Soon)
                </p>
              </div>
            </label>

            {/* Tamara Option (Coming Soon) */}
            <label className="flex items-center gap-3 p-4 border-2 border-[#C2B280] rounded-lg cursor-not-allowed opacity-60 bg-[#F5F5F5]">
              <input
                type="radio"
                name="payment-method"
                value="tamara"
                disabled
                className="w-4 h-4 cursor-not-allowed"
              />
              <div>
                <p className="font-semibold text-black">Tamara</p>
                <p className="text-xs text-[#6E6E6E]">
                  Pay in 4 intervals (Coming Soon)
                </p>
              </div>
            </label>
          </div>

          {/* Security Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-900">
              <strong>🔒 Secure Payment:</strong> Your payment information is
              encrypted and secured by Stripe. We never store your complete card
              details.
            </p>
          </div>

          {/* Amount Display */}
          {subtotal > 0 && (
            <div className="p-4 bg-[#F9F7F3] border border-[#DBD4C3] rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-black">
                  Total Amount
                </span>
                <span className="text-xl font-bold text-[#D35400]">
                  AED {subtotal.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isProcessing || createCheckoutSession.isPending}
            className="w-full bg-[#D35400] text-white font-orbitron font-bold text-[16px] uppercase py-4 hover:bg-[#B84A00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              clipPath:
                "polygon(15px 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 15px 100%, 0 50%)",
            }}>
            {isProcessing || createCheckoutSession.isPending ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </button>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            disabled={isProcessing || createCheckoutSession.isPending}
            className="w-full border-2 border-[#D35400] text-[#D35400] font-orbitron font-bold text-[14px] uppercase py-3 hover:bg-[#FFF8F0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
