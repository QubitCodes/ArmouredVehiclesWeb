"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Home, Package } from "lucide-react";
import { api } from "@/lib/api";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!sessionId || !orderId) {
          console.error("No session ID or Order ID provided");
          setLoading(false);
          return;
        }

        const data = await api.checkout.verifySession({ sessionId, orderId });
        setOrderData(data);
      } catch (error: any) {
        console.error("Error verifying payment:", error);
        // If the error object has response data, log it
        if (error.response) {
             console.error("Server Error Response:", error.response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin">
          <Package className="w-16 h-16 text-[#D35400]" />
        </div>
        <p className="text-lg text-[#6E6E6E]">Verifying your payment...</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="space-y-4">
        <h1 className="font-orbitron font-black text-2xl text-black">
          Payment Verification Failed
        </h1>
        <p className="text-[#6E6E6E]">
          We couldn&apos;t verify your payment. Please check your email or contact support.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-[#D35400] text-white font-bold uppercase rounded-lg hover:bg-[#B84A00] transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <CheckCircle className="w-20 h-20 text-green-500" />
      </div>

      <div>
        <h1 className="font-orbitron font-black text-3xl text-black mb-2">
          Order Confirmed!
        </h1>
        <p className="text-[#6E6E6E] text-lg">Thank you for your purchase</p>
      </div>

      <div className="bg-[#F0EBE3] rounded-lg p-6 space-y-3 text-left">
        <div className="flex justify-between">
          <span className="text-[#6E6E6E]">Order ID:</span>
          <span className="font-semibold text-black">{orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#6E6E6E]">Session ID:</span>
          <span className="font-semibold text-black break-all text-sm">{sessionId}</span>
        </div>
        {orderData?.amount && (
          <div className="flex justify-between">
            <span className="text-[#6E6E6E]">Amount Paid:</span>
            <span className="font-semibold text-black">AED {(orderData.amount / 100).toFixed(2)}</span>
          </div>
        )}
        {orderData?.status && (
          <div className="flex justify-between">
            <span className="text-[#6E6E6E]">Status:</span>
            <span className="font-semibold text-green-600 uppercase">{orderData.status}</span>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
        <p className="text-sm text-blue-900">
          <strong>📧 Confirmation Email:</strong> A receipt and shipping details have been sent to your email address.
        </p>
      </div>

      <div className="flex gap-4 flex-col sm:flex-row">
        <button
          onClick={() => router.push("/orders")}
          className="flex-1 px-6 py-3 bg-[#D35400] text-white font-bold uppercase rounded-lg hover:bg-[#B84A00] transition-colors flex items-center justify-center gap-2"
        >
          <Package className="w-5 h-5" />
          Track Order
        </button>
        <button
          onClick={() => router.push("/")}
          className="flex-1 px-6 py-3 border-2 border-[#D35400] text-[#D35400] font-bold uppercase rounded-lg hover:bg-[#FFF8F0] transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </button>
      </div>
    </div>
  );
}
