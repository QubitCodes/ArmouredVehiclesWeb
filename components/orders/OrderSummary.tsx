"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ChevronDown, Check, MoreVertical } from "lucide-react";
import { useState } from "react";
import { useOrder } from "@/lib/hooks/orders";

interface OrderSummaryProps {
  orderId: string;
}

/**
 * OrderSummary Component
 * Displays detailed summary of a specific order.
 * Fetches real order data using orderId prop.
 */
export default function OrderSummary({ orderId }: OrderSummaryProps) {
  const router = useRouter();
  const [showFees, setShowFees] = useState(false);
  const { data: order, isLoading, error } = useOrder(orderId);

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-10">
        <p className="text-[#666]">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10">
        <p className="text-red-600 mb-4">Failed to load order details.</p>
        <button
          onClick={() => router.back()}
          className="text-[#D35400] underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Extract data from order (API returns snake_case)
  const orderDate = formatDate((order as any).created_at || order.createdAt);
  const shipmentId = (order as any).shipment_id || (order as any).tracking_number || null;
  const itemsCount = order.items?.length || 0;
  const orderTotal = parseFloat((order as any).total_amount) || order.totalAmount || 0;

  // Address from order (populated by ProfileController)
  const address = order.address || {};

  // Payment details from transaction_details if available
  const transactionDetails = (order as any).transaction_details || {};
  const paymentMethod = transactionDetails?.payment_method_type ||
    transactionDetails?.brand ||
    (order as any).payment_method ||
    "Card";
  const paymentLast4 = transactionDetails?.last4 || "";

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push('/orders')}
          className="p-2 hover:bg-[#E8E0D4] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
        <h1 className="font-orbitron font-black text-xl lg:text-2xl uppercase tracking-wide text-black">
          Order Summary
        </h1>
      </div>

      {/* Shipment Info */}
      <div className="bg-[#EBE3D6] p-4 lg:p-5 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
          <p className="text-sm text-[#666]">
            Order ID: <span className="text-black font-medium">{order.id}</span>
          </p>
          <p className="text-sm text-[#666]">
            Shipment ID: <span className="text-black font-medium">{shipmentId || "null"}</span>
          </p>
        </div>
        <p className="text-sm text-[#666] mt-2">
          Order Date: <span className="text-sm text-[#666]">{orderDate}</span>
        </p>
      </div>

      {/* Items Summary */}
      <div className="mb-4 lg:mb-4 px-3 py-4 lg:px-5 lg:py-5 bg-[#EBE3D6] border border-[#EBE3D6] overflow-hidden">
        <h2 className="font-orbitron font-bold text-xs lg:text-sm uppercase tracking-wider text-black mb-3 lg:mb-4">
          Items Summary
        </h2>

        <div className="space-y-3 lg:space-y-4">
          {order.items?.map((item: any, index: number) => {
            const itemName = item.product?.name || item.product_name || item.name || "Product";
            const itemImage = item.product?.image || item.image || "/product/placeholder.svg";
            const itemPrice = item.price ? parseFloat(item.price) : 0;
            // Dummy status text as requested
            const statusText = "Delivered";
            const isDelivered = order.status === "delivered";

            return (
              <div key={item.id || index} className="bg-[#F0EBE3] border border-[#C2B280] overflow-hidden">
                {/* Order Header */}
                {/* <div className="px-3 lg:px-5 py-3 lg:py-4 flex items-center gap-2 lg:gap-3">
                  {isDelivered ? (
                    <div className="w-5 h-5 lg:w-6 lg:h-6 bg-[#27AE60] rounded flex items-center justify-center flex-shrink-0">
                      <svg width="12" height="8" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="lg:w-[14px] lg:h-[10px]">
                        <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  ) : (
                    <div className="w-5 h-5 lg:w-6 lg:h-6 bg-[#C2B280] rounded flex items-center justify-center flex-shrink-0">
                      <Image src="/order/Frame12.png" alt="Status" width={12} height={12} className="lg:w-[14px] lg:h-[14px]" />
                    </div>
                  )}
                  {statusText == "Delivered" && (
                    <p className="text-sm text-black">Delivered on Monday, November 3, at 4:08 PM.</p>
                  )}
                  {statusText == "Cancelled" && (
                    <p className="text-sm text-black">Cancelled on Monday, November 3, at 4:08 PM.</p>
                  )}
                </div> */}
                
                {/* Divider */}
                <div className="mx-3 lg:mx-5 border-b border-[#C2B280]"></div>

                {/* Order Content - NO Order ID displayed here */}
                <div className="p-3 lg:p-5 flex items-start gap-3 lg:gap-5">
                  <img
                    src={itemImage}
                    alt={itemName}
                    className="w-16 h-16 lg:w-20 lg:h-20 object-contain flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col">
                    <h3 className="text-xs lg:text-sm font-medium text-black mb-1 line-clamp-2">
                      {itemName}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Image
                        src="/icons/currency/dirham.svg"
                        alt="AED"
                        width={12}
                        height={10}
                        className="lg:w-[14px] lg:h-[12px]"
                      />
                      <span className="font-semibold text-xs lg:text-sm text-black">
                        {itemPrice.toFixed(2)}
                      </span>
                    </div>
                    {item.quantity > 1 && (
                      <p className="text-xs text-[#666] mt-1">Qty: {item.quantity}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content - Common Background Wrapper */}
      <div className="bg-[#EBE3D6] p-4 lg:p-5 mb-4">
        {/* First Row: 2 Columns */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-4 mb-4">
          {/* Column 1 - Order Details */}
          <div className="bg-[#F0EBE3] border border-[#C2B280] p-4 lg:p-5 mb-4 lg:mb-0">
            <h2 className="font-orbitron font-bold text-sm uppercase tracking-wider text-black mb-4">
              Order Details
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-inter font-normal text-[14px] leading-[100%] tracking-[0%] text-[#666]">Items value <span className="text-[#666]">({itemsCount} items)</span></span>
                <div className="flex items-center gap-1">
                  <Image
                    src="/icons/currency/dirham.svg"
                    alt="AED"
                    width={14}
                    height={12}
                  />
                  <span className="text-sm text-black">{orderTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setShowFees(!showFees)}
                  className="flex items-center gap-1 text-sm text-[#666]"
                >
                  Fees
                  <ChevronDown size={14} className={`transition-transform ${showFees ? 'rotate-180' : ''}`} />
                </button>
                <span className="text-sm text-[#009900] font-medium">Free</span>
              </div>
              
              <div className="flex items-center justify-between bg-[#EBE3D6] p-3">
                <span className="text-sm text-[#666]">Shipping Fee</span>
                <span className="text-sm text-[#009900] font-medium">Free</span>
              </div>
              
              <div className="flex items-center justify-between pt-3">
                <span className="font-inter font-semibold text-[16px] leading-[100%] tracking-[0%] text-[#6E6E6E]">Order total <span className="font-normal text-[#666]">inc. VAT</span></span>
                <div className="flex items-center gap-1">
                  <Image
                    src="/icons/currency/dirham.svg"
                    alt="AED"
                    width={14}
                    height={12}
                  />
                  <span className="font-inter font-semibold text-[16px] leading-[100%] tracking-[0%] text-[#6E6E6E]">{orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 - Delivery Address */}
          <div className="bg-[#F0EBE3] border border-[#C2B280] p-4 lg:p-5 mb-4 lg:mb-0">
            <h2 className="font-orbitron font-bold text-sm uppercase tracking-wider text-black mb-4">
              Delivery Address
            </h2>
            
            <div className="space-y-2">
              <p className="font-inter font-semibold text-[16px] leading-[100%] tracking-[0%] text-[#6E6E6E]">{address.name || "N/A"}</p>
              <p className="font-inter font-normal text-[14px] leading-[140%] tracking-[0%] text-[#666]">
                {address.address_line1 || ""}{address.city ? `, ${address.city}` : ""}{address.country ? `, ${address.country}` : ""}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#666]">{address.phone || ""}</span>
              </div>
              {address.email && (
                <p className="text-sm text-[#666]">{address.email}</p>
              )}
            </div>

            {/* Delivery Options - HIDDEN as per request */}
            {/* 
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1.5 text-[#666] border border-[#C2B280]">Two-Day Delivery</span>
              <span className="px-3 py-1.5 text-[#666] border border-[#C2B280]">Get Items Together</span>
            </div>
            */}
          </div>
        </div>

        {/* Second Row: 1 Column (same width as columns above) */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-4">
          {/* Payment Details - takes 1 column width */}
          <div className="bg-[#F0EBE3] border border-[#C2B280] p-4 lg:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-orbitron font-bold text-sm uppercase tracking-wider text-black">
                Payment Details
              </h2>
              {/* <button 
                onClick={() => router.push(`/orders/refund/${orderId}`)}
                className="text-sm text-[#D35400] underline font-medium"
              >
                Refund Details
              </button> */}
            </div>
            <div className="inline-flex items-center gap-2 bg-[#EBE3D6] p-3">
              <Image src="/order/paysvg3.svg" alt={paymentMethod} width={80} height={32} />
              <span className="text-sm text-[#666]">
                {paymentMethod}{paymentLast4 ? ` ****${paymentLast4}` : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    
    </div>
  );
}
