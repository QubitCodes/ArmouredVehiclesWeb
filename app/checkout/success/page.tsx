"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Home, Package } from "lucide-react";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!sessionId) {
          console.error("No session ID provided");
          setLoading(false);
          return;
        }

        // Verify payment with your backend
        const response = await fetch("/api/checkout/verify-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              localStorage.getItem("access_token") || ""
            }`,
          },
          body: JSON.stringify({ sessionId, orderId }),
        });

        if (response.ok) {
          const data = await response.json();
          setOrderData(data);
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, orderId]);

  return (
    <section className="bg-[#F0EBE3] min-h-screen flex items-center justify-center p-4">
      <div className="max-w-[600px] w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin">
              <Package className="w-16 h-16 text-[#D35400]" />
            </div>
            <p className="text-lg text-[#6E6E6E]">Verifying your payment...</p>
          </div>
        ) : orderData ? (
          <div className="space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <CheckCircle className="w-20 h-20 text-green-500" />
            </div>

            {/* Success Message */}
            <div>
              <h1 className="font-orbitron font-black text-3xl text-black mb-2">
                Order Confirmed!
              </h1>
              <p className="text-[#6E6E6E] text-lg">
                Thank you for your purchase
              </p>
            </div>

            {/* Order Details */}
            <div className="bg-[#F0EBE3] rounded-lg p-6 space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-[#6E6E6E]">Order ID:</span>
                <span className="font-semibold text-black">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E6E6E]">Session ID:</span>
                <span className="font-semibold text-black break-all text-sm">
                  {sessionId}
                </span>
              </div>
              {orderData?.amount && (
                <div className="flex justify-between">
                  <span className="text-[#6E6E6E]">Amount Paid:</span>
                  <span className="font-semibold text-black">
                    AED {(orderData.amount / 100).toFixed(2)}
                  </span>
                </div>
              )}
              {orderData?.status && (
                <div className="flex justify-between">
                  <span className="text-[#6E6E6E]">Status:</span>
                  <span className="font-semibold text-green-600 uppercase">
                    {orderData.status}
                  </span>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <p className="text-sm text-blue-900">
                <strong>📧 Confirmation Email:</strong> A receipt and shipping
                details have been sent to your email address.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-col sm:flex-row">
              <button
                onClick={() => router.push("/orders")}
                className="flex-1 px-6 py-3 bg-[#D35400] text-white font-bold uppercase rounded-lg hover:bg-[#B84A00] transition-colors flex items-center justify-center gap-2">
                <Package className="w-5 h-5" />
                Track Order
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 px-6 py-3 border-2 border-[#D35400] text-[#D35400] font-bold uppercase rounded-lg hover:bg-[#FFF8F0] transition-colors flex items-center justify-center gap-2">
                <Home className="w-5 h-5" />
                Back to Home
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="font-orbitron font-black text-2xl text-black">
              Payment Verification Failed
            </h1>
            <p className="text-[#6E6E6E]">
              We couldn&apos;t verify your payment. Please check your email or
              contact support.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-[#D35400] text-white font-bold uppercase rounded-lg hover:bg-[#B84A00] transition-colors">
              Back to Home
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
