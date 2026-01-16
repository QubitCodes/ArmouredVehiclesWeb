"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ChevronDown, ChevronUp, Package } from "lucide-react";
import { useState } from "react";
import { useOrder } from "@/lib/hooks/orders";
import type { Order } from "@/lib/types";

interface TrackOrderProps {
  orderId: string;
}

const ORDER_STATUS_STEPS = [
  { status: "pending", label: "Confirmed", icon: "/order/Track.png", activeIcon: "/order/Track2.png" },
  { status: "processing", label: "Packed", icon: "/order/Track.png", activeIcon: "/order/Track2.png" },
  { status: "shipped", label: "Dispatched", icon: "/order/Track14.png", activeIcon: "/order/Track15.png" }, // Simplified icons mapping
  { status: "delivered", label: "Delivered", icon: "/order/Track1.png", activeIcon: "/order/Track2.png" },
];

function getTrackingSteps(order: Order) {
  const currentStatusIndex = ORDER_STATUS_STEPS.findIndex(s => s.status === order.order_status) || 0;
  
  // Custom logic to show the flow
  // If status is 'shipped', then 'pending' and 'processing' are completed.
  // If status is 'pending', nothing is completed except maybe 'Confirmed'.
  
  // Simplified mapping for now based on index
  return ORDER_STATUS_STEPS.map((step, index) => {
    let completed = false;
    let current = false;

    // Very basic status flow logic
    const statusOrder = ["pending", "processing", "shipped", "delivered"];
    const orderStatusIdx = statusOrder.indexOf(order.order_status);
    const stepIdx = statusOrder.indexOf(step.status);

    if (orderStatusIdx >= stepIdx) {
        completed = true;
    }
    if (orderStatusIdx === stepIdx) {
        current = true;
    }

    // specific override for cancelled
    if (order.order_status === 'cancelled') {
        completed = false;
        current = false;
    }

    return {
      status: step.label,
      date: index === 0 ? new Date(order.createdAt).toLocaleDateString() : "", // Show date only for first step for now
      completed,
      current,
      message: current ? `Your order is currently ${step.label}` : "",
    };
  });
}

export default function TrackOrder({ orderId }: TrackOrderProps) {
  const router = useRouter();
  const [showFullTracking, setShowFullTracking] = useState(true);
  const { data: order, isLoading, error } = useOrder(orderId);

  if (isLoading) {
    return (
        <div className="flex-1 flex items-center justify-center min-h-[50vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin">
                <Package className="w-12 h-12 text-[#D35400]" />
              </div>
              <p className="text-[#6E6E6E]">Loading order details...</p>
            </div>
        </div>
    );
  }

  if (error || !order) {
    return (
        <div className="flex-1 flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Order not found</h2>
                <button
                  onClick={() => router.back()}
                  className="px-6 py-2 bg-[#D35400] text-white rounded hover:bg-[#B84A00]"
                >
                  Go Back
                </button>
            </div>
        </div>
    );
  }

  const trackingSteps = getTrackingSteps(order);
  const deliveryAddress = order.address || {
      name: "N/A",
      address_line1: "Address not available",
      city: "",
      country: "",
      phone: ""
  }; // Fallback

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-[#E8E0D4] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
        <h1 className="font-orbitron font-black text-xl lg:text-2xl uppercase tracking-wide text-black">
          Track Your Order
        </h1>
      </div>

      {/* Shipment Info */}
      <div className="bg-[#EBE3D6] p-4 lg:p-5 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
          <p className="text-sm text-[#666]">
            Order ID: <span className="text-black font-medium text-xs lg:text-sm">#{order.id}</span>
          </p>
          <p className="text-sm self-end lg:self-auto text-[#666]">
            Order Date: <span className="text-sm text-[#666]">{formattedDate}</span>
          </p>
        </div>
      </div>

      {/* Delivery Address Section */}
      <div className="bg-[#EBE3D6] p-4 lg:p-5 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-orbitron font-bold text-sm uppercase tracking-wider text-black mb-3">
              Delivery Address
            </h2>
            <div className="space-y-1">
              <p className="font-semibold text-sm text-black">{deliveryAddress.name}</p>
              <p className="text-sm text-[#666]">
                  {deliveryAddress.address_line1}, {deliveryAddress.city}, {deliveryAddress.country}
              </p>
              <p className="text-sm text-[#666]">
                {deliveryAddress.phone} · {deliveryAddress.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="bg-[#EBE3D6] p-4 lg:p-5 mb-4">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Timeline */}
          <div className="relative flex-1">
            {trackingSteps.map((step, index) => (
              <div key={index} className="flex gap-4 relative">
                {/* Timeline Line */}
                {index < trackingSteps.length - 1 && (
                  <div
                    className={`absolute left-[11px] top-6 w-0.5 h-full ${
                      step.completed ? "bg-[#D35400]" : "bg-[#CCCCCC]"
                    }`}
                    style={{ height: step.current ? "100px" : "32px" }}
                  />
                )}

                {/* Status Icon */}
                <div 
                  className={`relative z-10 w-7 h-7 flex items-center justify-center flex-shrink-0 ${
                    step.completed 
                      ? "bg-[#D35400] rounded-full" 
                      : ""
                  }`}
                >
                  <Image
                    src={
                        step.completed 
                        ? step.current 
                          ? "/order/Track2.png" 
                          : "/order/Track.png"
                        : "/order/Track1.png" // Default inactive
                    }
                    alt={step.status}
                    width={step.completed ? 14 : 20}
                    height={step.completed ? 14 : 20}
                    className="object-contain"
                  />
                </div>

                {/* Status Content */}
                <div className={`pb-6 ${step.current ? "pb-8" : ""}`}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-medium text-sm ${
                        step.current ? "text-[#D35400]" : step.completed ? "text-black" : "text-[#666]"
                      }`}
                    >
                      {step.status}
                    </span>
                    {step.date && (
                      <span className="text-sm text-[#666]">on {step.date}</span>
                    )}
                  </div>
                  {step.message && (
                    <p className="text-sm text-[#666] mt-2 max-w-lg">{step.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Toggle Tracking */}
        <div className="mt-4 -mx-4 lg:-mx-5 border-t border-[#C2B280]">
          <button
            onClick={() => setShowFullTracking(!showFullTracking)}
            className="flex items-center justify-center gap-1 text-sm text-[#666] hover:text-black transition-colors w-full py-3"
          >
            {showFullTracking ? "Hide" : "Show"} full tracking
            {showFullTracking ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Item Summary */}
      <div className="bg-[#EBE3D6] overflow-hidden">
        <div className="p-4 lg:p-5 border-b border-[#C2B280]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="font-orbitron font-bold text-sm uppercase tracking-wider text-black">
                Item Summary
              </h2>
              <p className="text-xs text-[#666] mt-1">
                Total Amount: <span className="font-bold text-black">{Number(order.total_amount || 0).toFixed(2)} AED</span>
              </p>
            </div>
            {(order.order_status === 'pending_review' || order.order_status === 'pending_approval') && (
                <div className="relative clip-path-supplier bg-[#3D4A26] p-[1px] w-full lg:w-auto">
                <button className="clip-path-supplier bg-[#EBE3D6] hover:bg-[#3D4A26] text-[#000] hover:text-white px-6 py-2 text-sm font-bold font-orbitron uppercase tracking-wide transition-colors w-full lg:w-auto">
                    Cancel Order
                </button>
                </div>
            )}
          </div>
        </div>

        {/* Item List */}
        {order.items?.map((item: any) => (
          <div key={item.id} className="p-4 lg:p-5 flex items-start gap-4">
            <div className="w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0 bg-white p-1">
                <Image
                src={item.image || "/product/product 1.png"}
                alt={item.name || item.product?.name || "Product"}
                width={80}
                height={80}
                className="w-full h-full object-contain"
                />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-black mb-1 line-clamp-2">
                {item.name || item.product?.name}
              </h3>
              <div className="flex items-center gap-1 mb-1">
                <span className="font-semibold text-sm text-black">
                  {parseFloat(item.price).toFixed(2)} AED
                </span>
                <span className="text-xs text-[#666]">x {item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

