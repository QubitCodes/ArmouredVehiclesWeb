"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Package, Truck, MapPin, ArrowRight } from "lucide-react";

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [orderId] = useState(() => `ORD-${Date.now().toString(36).toUpperCase()}`);

  return (
    <section className="bg-[#F0EBE3] min-h-screen">
      <div className="max-w-[800px] mx-auto px-6 py-16">
        {/* Success Icon & Message */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-[#27AE60] rounded-full flex items-center justify-center animate-bounce-once">
            <CheckCircle className="w-14 h-14 text-white" strokeWidth={2} />
          </div>
          <h1 className="font-orbitron font-black text-[32px] uppercase tracking-wide text-[#1A1A1A] mb-3">
            Order Confirmed!
          </h1>
          <p className="text-[#6E6E6E] text-lg">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#EBE3D6] p-8 mb-8">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#DBD4C3]">
            <div>
              <p className="font-orbitron font-bold text-xs uppercase tracking-wider text-[#6E6E6E] mb-1">
                Order Number
              </p>
              <p className="font-orbitron font-bold text-xl text-[#1A1A1A]">{orderId}</p>
            </div>
            <div className="text-right">
              <p className="font-orbitron font-bold text-xs uppercase tracking-wider text-[#6E6E6E] mb-1">
                Order Date
              </p>
              <p className="font-semibold text-[#1A1A1A]">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="mb-8">
            <p className="font-orbitron font-bold text-xs uppercase tracking-wider text-[#6E6E6E] mb-4">
              Order Status
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#27AE60] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-[#27AE60]">Confirmed</span>
              </div>
              <div className="flex-1 h-1 bg-[#DBD4C3]">
                <div className="w-0 h-full bg-[#27AE60]" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#DBD4C3] rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-[#6E6E6E]" />
                </div>
                <span className="text-sm text-[#6E6E6E]">Processing</span>
              </div>
              <div className="flex-1 h-1 bg-[#DBD4C3]" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#DBD4C3] rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-[#6E6E6E]" />
                </div>
                <span className="text-sm text-[#6E6E6E]">Shipped</span>
              </div>
              <div className="flex-1 h-1 bg-[#DBD4C3]" />
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#DBD4C3] rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#6E6E6E]" />
                </div>
                <span className="text-sm text-[#6E6E6E]">Delivered</span>
              </div>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="bg-[#F0EBE3] p-4 flex items-center justify-between">
            <div>
              <p className="font-orbitron font-bold text-xs uppercase tracking-wider text-[#6E6E6E] mb-1">
                Estimated Delivery
              </p>
              <p className="font-semibold text-[#1A1A1A]">
                {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#27AE60] font-semibold">Free Shipping</p>
            </div>
          </div>
        </div>

        {/* Confirmation Email Notice */}
        <div className="bg-[#39482C] p-6 mb-8 text-center">
          <p className="text-white text-sm">
            A confirmation email has been sent to your registered email address with order details and tracking information.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/orders")}
            className="flex items-center justify-center gap-2 bg-[#D35400] text-white font-orbitron font-bold text-sm uppercase px-8 py-4 hover:bg-[#B51E17] transition-colors"
            style={{ clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0 50%)' }}
          >
            View My Orders
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center gap-2 bg-[#EBE3D6] text-[#1A1A1A] font-orbitron font-bold text-sm uppercase px-8 py-4 border border-[#C2B280] hover:bg-[#E8E0D4] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </section>
  );
}

