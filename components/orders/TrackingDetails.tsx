"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Package, User } from "lucide-react";
import { useOrder } from "@/lib/hooks/orders";

interface TrackingDetailsProps {
  orderId: string;
}

export default function TrackingDetails({ orderId }: TrackingDetailsProps) {
  const router = useRouter();
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

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
  });

  const deliveryAddress = order.address || {
      name: "N/A",
      address_line1: "Address not available",
      city: "",
      country: "",
      phone: ""
  };

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
          Tracking Details
        </h1>
      </div>

      {/* Item ID and Order Date */}
      <div className="bg-[#EBE3D6] p-4 lg:p-5 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
          <p className="text-sm text-[#666]">
            Order ID: <span className="text-black font-medium">#{order.order_id || order.id}</span>
          </p>
          <p className="text-sm text-[#666]">
            Order Date: <span className="text-sm text-[#666]">{formattedDate}</span>
          </p>
        </div>
      </div>

      {/* Status Section */}
      <div className="bg-[#EBE3D6] p-4 lg:p-5 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#666] flex items-center justify-center flex-shrink-0">
              <Image
                src="/order/Track1.png"
                alt="Status"
                width={16}
                height={16}
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-sm">
                <span className="font-medium text-black capitalize">{order.order_status.replace('_', ' ')}</span>
              </p>
              {order.order_status === 'cancelled' && (
                <p className="text-sm text-[#666]">
                    Reason: <span className="text-[#D35400]">{order.comments || "N/A"}</span>
                </p>
              )}
            </div>
          </div>
          {(order.order_status === 'pending_review' || order.order_status === 'pending_approval') && (
             <div className="relative clip-path-supplier bg-[#3D4A26] p-[1px] w-full lg:w-auto">
                <button 
                  className="clip-path-supplier bg-[#EBE3D6] hover:bg-[#3D4A26] text-[#000] hover:text-white px-6 py-2 text-sm font-bold font-orbitron uppercase tracking-wide transition-colors w-full lg:w-auto"
                >
                  Cancel Order
                </button>
             </div>
          )}
        </div>
      </div>

      {/* Delivery Address Section */}
      <div className="bg-[#EBE3D6] p-4 lg:p-5 mb-4">
        <h2 className="font-orbitron font-bold text-sm uppercase tracking-wider text-black mb-3">
          Delivery Address
        </h2>
        <div className="space-y-1">
          <p className="font-semibold text-sm text-black">{deliveryAddress.name}</p>
          <p className="text-sm text-[#666]">{deliveryAddress.address_line1}, {deliveryAddress.city}, {deliveryAddress.country}</p>
          <p className="text-sm text-[#666] flex items-center gap-2">
            {deliveryAddress.phone}
          </p>
        </div>
      </div>

      {/* View Order / Invoice Summary */}
      <div className="bg-[#EBE3D6] p-4 lg:p-5 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
          <h2 className="font-orbitron font-bold text-sm uppercase tracking-wider text-black">
            View Order / Invoice Summary
          </h2>
          <span className="text-sm text-[#D35400] hover:underline font-medium cursor-pointer">
            Find invoice and shipping details here &gt;
          </span>
        </div>
      </div>

      {/* Item Summary */}
      <div className="bg-[#EBE3D6] overflow-hidden">
        <div className="p-4 lg:p-5 border-b border-[#C2B280]">
          <h2 className="font-orbitron font-bold text-sm uppercase tracking-wider text-black">
            Item Summary
          </h2>
        </div>

        {/* Item List */}
        {order.items?.map((item) => (
          <div key={item.id} className="p-4 lg:p-5 flex items-start gap-4">
            <div className="w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0 bg-white p-1">
                <Image
                src={item.product?.media?.[0]?.url || item.image || item.product?.image || "/product/placeholder.svg"}
                alt={item.name || item.product_name || "Product"}
                width={80}
                height={80}
                className="w-full h-full object-contain"
                />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-black mb-1 line-clamp-2">
                {item.name || item.product_name || item.product?.name || "Product"}
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

