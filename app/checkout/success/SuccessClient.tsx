"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Home, Package, XCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id") || searchParams.get("orderId");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        console.log('[DEBUG] SuccessClient: Starting payment verification');
        console.log('[DEBUG] sessionId:', sessionId);
        console.log('[DEBUG] orderId:', orderId);
        
        if (!sessionId || !orderId) {
          console.error("[DEBUG] No session ID or Order ID provided");
          setLoading(false);
          return;
        }

        console.log('[DEBUG] Calling api.checkout.verifySession...');
        const response = await api.checkout.verifySession({ sessionId, orderId });
        console.log('[DEBUG] verifySession response:', response);
        // Unwrap the response if it's nested in a 'data' property (standard API wrapper)
        const data = (response as any).data || response;
        setOrderData(data);
        
        // Redirect to order summary with success flag
        if (data.id) {
            router.push(`/orders/summary/${data.id}?payment_success=true`);
        }
      } catch (error: any) {
        console.error("[DEBUG] Error verifying payment:", error);
        console.error("[DEBUG] Error message:", error?.message);
        console.error("[DEBUG] Error status:", error?.status);
        // If the error object has response data, log it
        if (error.response) {
             console.error("[DEBUG] Server Error Response:", error.response.data);
        }
        if (error.data) {
             console.error("[DEBUG] Error data:", error.data);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, orderId]);

  if (loading || orderData) {
     return (
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#D35400] border-t-transparent"></div>
          <p className="font-orbitron text-lg font-medium text-[#1A1A1A]">
            {orderData ? "Redirecting to order summary..." : "Verifying your payment..."}
          </p>
        </div>
     );
  }

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <XCircle className="h-10 w-10 text-red-600" />
      </div>
      <div>
        <h1 className="font-orbitron text-2xl font-bold text-[#1A1A1A]">
          Payment Verification Failed
        </h1>
        <p className="mt-2 max-w-md text-[#6E6E6E]">
          We couldn't verify your payment details. Please check your bank statement or try again.
        </p>
      </div>
      <div className="flex gap-4">
        <button
            onClick={() => window.location.reload()}
            className="bg-[#1A1A1A] text-white px-6 py-3 font-orbitron font-bold uppercase hover:bg-black/90 transition-colors"
        >
            Try Again
        </button>
        <button
            onClick={() => router.push("/contact")}
            className="border border-[#1A1A1A] text-[#1A1A1A] px-6 py-3 font-orbitron font-bold uppercase hover:bg-gray-50 transition-colors"
        >
            Contact Support
        </button>
      </div>
    </div>
  );
}
