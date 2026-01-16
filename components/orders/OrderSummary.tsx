"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ChevronDown, Check, MoreVertical, X } from "lucide-react";
import { useState, useEffect } from "react";
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
  const { data: order, isLoading, error, refetch } = useOrder(orderId);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    // If we have a session_id and order_id (from URL redirect), verify the payment
    if (sessionId && orderId && !showSuccessPopup && !isVerifying) {
        setIsVerifying(true);
        // Verify payment
        import("@/lib/api").then(({ api }) => {
            api.checkout.verifySession({ sessionId, orderId })
                .then((response: any) => {
                    // Unwrap response as per BaseController structure
                    const data = response.data || response;
                    setPaymentStatus(data.status || 'paid');
                    setShowSuccessPopup(true);
                    refetch(); // Refresh order data to show "paid" status
                })
                .catch(err => {
                    console.error("Payment verification failed:", err);
                    setPaymentStatus('failed'); // Or handle error state
                })
                .finally(() => setIsVerifying(false));
        });
    }
  }, [sessionId, orderId]);

  // Handle manual flag for backward compatibility or direct testing
  useEffect(() => {
     if (searchParams.get('payment_success') === 'true') {
         setShowSuccessPopup(true);
     }
  }, [searchParams]);

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
  const orderTotal = parseFloat(String(order.total_amount || 0));

  // Address from order (populated by ProfileController)
  const address = order.address || {};

  // Payment details from transaction_details if available
  const transactionDetails = (order as any).transaction_details || {};
  const paymentMethod = transactionDetails?.payment_method_type ||
    transactionDetails?.brand ||
    (order as any).payment_method ||
    "Card";
  const paymentLast4 = transactionDetails?.last4 || "";

  // Payment details from transaction_details if available

  return (
    <div className="flex-1 relative">
      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-300">
          <div className="bg-[#EBE3D6] max-w-md w-full p-8 shadow-2xl relative border-2 border-[#C2B280]" style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}>
            <button 
              onClick={() => setShowSuccessPopup(false)}
              className="absolute top-4 right-4 text-[#666] hover:text-[#D35400]"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-[#27AE60] rounded-full flex items-center justify-center animate-bounce-once">
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
              </div>
              <h2 className="font-orbitron font-black text-2xl uppercase tracking-wide text-[#1A1A1A] mb-2">
                Order Confirmed!
              </h2>
              <p className="text-[#6E6E6E]">
                Thank you for your purchase
              </p>
            </div>

            <div className="bg-[#F0EBE3] p-4 mb-6 border border-[#C2B280]">
               <div className="flex justify-between mb-2">
                  <span className="text-sm text-[#666]">Order ID:</span>
                  <span className="text-sm font-bold text-black">{orderId}</span>
               </div>
               <div className="flex justify-between mb-2">
                  <span className="text-sm text-[#666]">Status:</span>
                  <span className={`text-sm font-bold uppercase ${paymentStatus === 'failed' ? 'text-red-600' : 'text-[#27AE60]'}`}>
                    {paymentStatus || 'Paid'}
                  </span>
               </div>
               <div className="flex justify-between border-t border-[#C2B280] pt-2 mt-2">
                  <span className="text-sm text-[#666]">Total Amount:</span>
                  <span className="text-lg font-bold text-black">AED {orderTotal.toFixed(2)}</span>
               </div>
            </div>

            <div className="bg-[#39482C] p-4 text-center mb-6">
              <p className="text-white text-xs">
                 A confirmation email has been sent to your registered email address.
              </p>
            </div>

            <button
               onClick={() => router.replace(`/orders/summary/${orderId}`)}
               className="w-full bg-[#D35400] text-white font-orbitron font-bold text-sm uppercase py-3 hover:bg-[#B51E17] transition-colors"
               style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            >
               View Order Details
            </button>
          </div>
        </div>
      )}

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
            const itemImage = item.product?.image || item.image || "/placeholder.jpg";
            const itemPrice = item.price ? parseFloat(item.price) : 0;
            // Dummy status text as requested
            const statusText = "Delivered";
            const isDelivered = order.order_status === "delivered";

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
