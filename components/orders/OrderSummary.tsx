"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ChevronDown, Check, MoreVertical, X, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useOrderGroup } from "@/lib/hooks/orders";
import api from "@/lib/api";
import dynamic from 'next/dynamic';

const EmbeddedPayment = dynamic(() => import('@/components/checkout/EmbeddedPayment'), { ssr: false });

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
  const { data: group, isLoading, error, refetch } = useOrderGroup(orderId);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  // Embedded Payment State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Retry Logic
  const [isRetrying, setIsRetrying] = useState(false);
  const handleRetryPayment = async () => {
    if (!group?.group_id) return;
    setIsRetrying(true);
    try {
      // Try embedded first
      const res = await api.checkout.retryPayment({ orderGroupId: group.group_id, embedded: true });
      const data = (res as any).data || res;

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowPaymentModal(true);
      } else if (data.paymentUrl) {
        // Fallback to hosted
        window.location.href = data.paymentUrl;
      } else {
        console.error("No payment option returned", data);
      }
    } catch (err) {
      console.error("Retry payment failed", err);
    } finally {
      setIsRetrying(false);
    }
  };

  // If group is loaded, extracting common details from first order or group root
  const subOrders = group?.orders || [];
  const primaryOrder = subOrders[0] || {};
  const orderDate = primaryOrder.created_at || primaryOrder.createdAt ? new Date(primaryOrder.created_at || primaryOrder.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "N/A";
  const totalAmount = group?.total_amount || 0;
  const currency = group?.currency || 'AED';
  const address = primaryOrder.address || {};

  // Flatten items for count
  const allItemsCount = subOrders.reduce((c: number, o: any) => c + (o.items?.length || 0), 0);

  // Payment Logic (Assume common payment across group)
  const transactionDetails = (() => {
    const raw = (primaryOrder as any).transaction_details;
    if (!raw) return {};

    try {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      const payments = Array.isArray(parsed) ? parsed : [parsed];
      // Find FIRST successful payment
      return payments.find((p: any) => p.payment_status === 'paid' || p.payment_status === 'no_payment_required') || payments[payments.length - 1] || {};
    } catch (e) {
      return {};
    }
  })();

  const paymentMethod = (transactionDetails as any)?.payment_details?.brand || (transactionDetails as any)?.brand || (primaryOrder as any).payment_method || "Card";
  const paymentLast4 = (transactionDetails as any)?.payment_details?.last4 || (transactionDetails as any)?.last4 || "";

  useEffect(() => {
    // If we have a session_id and order_id (from URL redirect), verify the payment
    if (sessionId && orderId && !showSuccessPopup && !isVerifying) {
      setIsVerifying(true);
      // Verify payment using Checkout API
      import("@/lib/api").then(({ api }) => {
        api.checkout.verifySession({ sessionId, orderId })
          .then((response: any) => {
            const data = response.data || response;
            setPaymentStatus(data.status || 'paid');
            setShowSuccessPopup(true);
            refetch();
          })
          .catch(err => {
            console.error("Payment verification failed:", err);
            setPaymentStatus('failed');
          })
          .finally(() => setIsVerifying(false));
      });
    }
  }, [sessionId, orderId]);

  // Handle manual flag
  useEffect(() => {
    if (searchParams.get('payment_success') === 'true') setShowSuccessPopup(true);
    if (searchParams.get('cancelled') === 'true') {
      setShowCancelPopup(true);
      // Still verify to record the "incomplete" status in DB
      if (sessionId && orderId && !isVerifying) {
        setIsVerifying(true);
        import("@/lib/api").then(({ api }) => {
          api.checkout.verifySession({ sessionId, orderId })
            .catch(err => console.error("Verify session for cancellation failed", err))
            .finally(() => setIsVerifying(false));
        });
      }
    }
    if (searchParams.get('approval_required') === 'true') {
      setPaymentStatus('pending_approval');
      setShowSuccessPopup(true);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-10">
        <p className="text-[#666]">Loading order details...</p>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10">
        <p className="text-red-600 mb-4">Failed to load order details {error?.message}</p>
        <button onClick={() => router.back()} className="text-[#D35400] underline">Go Back</button>
      </div>
    );
  }

  // Popup Logic
  const isApprovalReq = searchParams.get('approval_required') === 'true';
  const popupTitle = isApprovalReq ? "Request Submitted!" : "Order Confirmed!";
  const popupMessage = isApprovalReq
    ? "Your purchase request has been submitted for approval."
    : "Thank you for your purchase";
  // Determine overall status for popup? If any paid, it's paid.
  const popupStatus = isApprovalReq ? "Pending Approval" : (paymentStatus || 'Paid');
  const popupStatusColor = isApprovalReq ? "text-[#D35400]" : (paymentStatus === 'failed' ? 'text-red-600' : 'text-[#27AE60]');
  const popupIconBg = isApprovalReq ? "bg-[#D35400]" : "bg-[#27AE60]";

  return (
    <div className="flex-1 relative">
      {/* Embedded Payment Modal */}
      {/* Embedded Payment Modal */}
      {showPaymentModal && clientSecret && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-300 backdrop-blur-sm">
          <div
            className="bg-[#EBE3D6] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl relative border-2 border-[#C2B280] flex flex-col"
            style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-[#C2B280] bg-[#F0EBE3]">
              <h3 className="text-xl font-orbitron font-black uppercase text-[#1A1A1A] tracking-wider">
                Complete Secure Payment
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-[#666] hover:text-[#D35400] transition-colors p-1 rounded-full hover:bg-black/5"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Stripe Container */}
            <div className="p-6 flex-1 overflow-y-auto bg-white/50">
              {/* Wrapper to control stripe padding/width if needed */}
              <div className="min-h-[400px]">
                <EmbeddedPayment clientSecret={clientSecret} />
              </div>
            </div>

            {/* Footer / Trust Badge area */}
            <div className="p-3 bg-[#39482C] text-center">
              <p className="text-[#F0EBE3] text-xs uppercase font-medium tracking-widest flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#27AE60]"></span>  Encrypted & Secure
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Popup Modal */}
      {showCancelPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-300">
          <div className="bg-[#EBE3D6] max-w-md w-full p-8 shadow-2xl relative border-2 border-[#C2B280]" style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}>
            <button
              onClick={() => setShowCancelPopup(false)}
              className="absolute top-4 right-4 text-[#666] hover:text-[#D35400]"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-10 h-10 text-red-600" strokeWidth={3} />
              </div>
              <h2 className="font-orbitron font-black text-2xl uppercase tracking-wide text-[#1A1A1A] mb-2">
                Payment Cancelled
              </h2>
              <p className="text-[#6E6E6E]">
                Your payment process was incomplete or cancelled.
              </p>
            </div>

            <div className="bg-[#F0EBE3] p-4 mb-6 border border-[#C2B280]">
              <p className="text-sm text-[#666] text-center">
                No charges were made to your account. You can retry the payment whenever you are ready.
              </p>
            </div>

            <button
              onClick={() => setShowCancelPopup(false)}
              className="w-full bg-[#D35400] text-white font-orbitron font-bold text-sm uppercase py-3 hover:bg-[#B51E17] transition-colors"
              style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

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
              <div className={`w-20 h-20 mx-auto mb-4 ${popupIconBg} rounded-full flex items-center justify-center animate-bounce-once`}>
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
              </div>
              <h2 className="font-orbitron font-black text-2xl uppercase tracking-wide text-[#1A1A1A] mb-2">
                {popupTitle}
              </h2>
              <p className="text-[#6E6E6E]">
                {popupMessage}
              </p>
            </div>

            <div className="bg-[#F0EBE3] p-4 mb-6 border border-[#C2B280]">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-[#666]">Order ID:</span>
                <span className="text-sm font-bold text-black">{group.group_id || orderId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-[#666]">Status:</span>
                <span className={`text-sm font-bold uppercase ${popupStatusColor}`}>
                  {popupStatus}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#C2B280] pt-2 mt-2">
                <span className="text-sm text-[#666]">Total Amount:</span>
                <span className="text-lg font-bold text-black flex items-center gap-1">
                  <Image src="/icons/currency/dirham.svg" alt="AED" width={16} height={14} className="inline-block" />
                  {totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-[#39482C] p-4 text-center mb-6">
              <p className="text-white text-xs">
                {isApprovalReq
                  ? "Our team will review your request and notify you shortly."
                  : "A confirmation email has been sent to your registered email address."}
              </p>
            </div>

            <button
              onClick={() => setShowSuccessPopup(false)}
              className="w-full bg-[#D35400] text-white font-orbitron font-bold text-sm uppercase py-3 hover:bg-[#B51E17] transition-colors"
              style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            >
              View Details
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

      {/* Group Info / Shipment Info */}
      <div className="bg-[#EBE3D6] p-4 lg:p-5 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
          <p className="text-sm text-[#666]">
            Order ID: <span className="text-black font-medium">{group.group_id || orderId}</span>
          </p>
          <p className="text-sm text-[#666]">
            Date: <span className="text-black font-medium">{orderDate}</span>
          </p>
        </div>
      </div>

      {/* Sub-Orders List */}
      <div className="space-y-4 mb-4">
        {subOrders.map((order: any, idx: number) => {
          // Format status
          const rawStatus = order.order_status;
          let showStatus = "";
          let statusColor = "bg-[#C2B280]";

          if (["delivered", "shipped"].includes(rawStatus)) {
            statusColor = "bg-[#27AE60]";
            showStatus = rawStatus === "delivered" ? "Delivered" : "Shipped";
          } else if (["cancelled", "rejected"].includes(rawStatus)) {
            statusColor = "bg-red-600";
            showStatus = "Cancelled";
          } else if (["processed", "processing", "approved"].includes(rawStatus)) {
            showStatus = "Processing";
            statusColor = "bg-[#D35400]";
          } else {
            showStatus = rawStatus.replace(/_/g, ' ');
          }

          const shipmentId = order.shipment_id || order.tracking_number;

          return (
            <div key={order.id || idx} className="space-y-3 lg:space-y-4">
              <div className="bg-[#EBE3D6] border border-[#EBE3D6] overflow-hidden">
                {/* Sub-Order Header / Status Strip or Info */}
                <div className="px-3 py-2 bg-[#F0EBE3] flex items-center justify-between border-b border-[#C2B280]">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${statusColor}`}></div>
                    <span className="text-sm font-bold text-black uppercase">{showStatus}</span>
                    {shipmentId && (
                      <span className="text-xs text-[#666] ml-2">Tracking: {shipmentId}</span>
                    )}
                    {order.estimatedDelivery && (
                      <span className="text-xs text-[#666] ml-2">Legacy ETA: {order.estimatedDelivery}</span>
                    )}
                  </div>
                </div>

                <div className="p-3 lg:p-5 space-y-3">
                  {order.items?.map((item: any, i: number) => {
                    const getImageUrl = (path: string | undefined | null) => {
                      if (!path) return "/placeholder.jpg";
                      if (path.startsWith("http")) return path;
                      // Remove leading slash if present to avoid double slashes if base has trailing slash
                      const cleanPath = path.startsWith('/') ? path.slice(1) : path;
                      return `${process.env.NEXT_PUBLIC_API_BASE_URL}/${cleanPath}`;
                    };

                    const itemName = item.product?.name || item.product_name || item.name || "Product";
                    const itemImage = getImageUrl(item.product?.image || item.image);
                    const itemPrice = item.price ? parseFloat(item.price) : 0;
                    return (
                      <div key={item.id || i} className="flex items-start gap-3 lg:gap-5 border-b border-[#C2B280] last:border-0 pb-3 last:pb-0 cursor-pointer hover:bg-black/5 p-2 rounded transition-colors"
                        onClick={() => router.push(`/product/${item.product_id || item.product?.id}`)}>
                        <img
                          src={itemImage}
                          alt={itemName}
                          className="w-16 h-16 lg:w-20 lg:h-20 object-contain flex-shrink-0 bg-white"
                          onError={(e) => {
                            // If full URL fails, might be a different issue, but fallback is safe
                            (e.target as HTMLImageElement).src = '/placeholder.jpg';
                          }}
                        />
                        <div className="flex-1 min-w-0 flex flex-col">
                          <h3 className="text-xs lg:text-sm font-medium text-black mb-1 line-clamp-2 hover:text-[#D35400] transition-colors">
                            {itemName}
                          </h3>
                          <div className="flex items-center gap-1">
                            <Image src="/icons/currency/dirham.svg" alt="AED" width={14} height={12} className="inline-block" />
                            <span className="font-semibold text-xs lg:text-sm text-black">
                              {itemPrice.toFixed(2)}
                            </span>
                          </div>
                          {item.quantity > 1 && (
                            <p className="text-xs text-[#666] mt-1">Qty: {item.quantity}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>


      {/* Main Content - Common Background Wrapper */}
      <div className="bg-[#EBE3D6] p-4 lg:p-5 mb-4">
        {/* First Row: 2 Columns */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-4 mb-4">
          {/* Column 1 - Order Details */}
          <div className="bg-[#F0EBE3] border border-[#C2B280] p-4 lg:p-5 mb-4 lg:mb-0">
            <h2 className="font-orbitron font-bold text-sm uppercase tracking-wider text-black mb-4">
              Totals
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-inter font-normal text-[14px] leading-[100%] tracking-[0%] text-[#666]">Items value <span className="text-[#666]">({allItemsCount} items)</span></span>
                <div className="flex items-center gap-1">
                  <Image src="/icons/currency/dirham.svg" alt="AED" width={14} height={12} className="inline-block" />
                  <span className="text-sm text-black">
                    {/* Calculate Item Subtotal (Total - VAT - Shipping - Packing) or sum item prices? */}
                    {/* Simplified: Sum of line items price * qty */}
                    {subOrders.reduce((acc: number, o: any) => acc + (o.items?.reduce((iAcc: number, item: any) => iAcc + (Number(item.price) * item.quantity), 0) || 0), 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Shipping & Packing */}
              {(() => {
                const totalShipping = subOrders.reduce((acc: number, o: any) => acc + Number(o.total_shipping || 0), 0);
                const totalPacking = subOrders.reduce((acc: number, o: any) => acc + Number(o.total_packing || 0), 0);

                return (
                  <>
                    {totalShipping > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="font-inter font-normal text-[14px] leading-[100%] tracking-[0%] text-[#666]">Shipping</span>
                        <div className="flex items-center gap-1">
                          <Image src="/icons/currency/dirham.svg" alt="AED" width={14} height={12} className="inline-block" />
                          <span className="text-sm text-black">
                            {totalShipping.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}

                    {totalPacking > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="font-inter font-normal text-[14px] leading-[100%] tracking-[0%] text-[#666]">Packing</span>
                        <div className="flex items-center gap-1">
                          <Image src="/icons/currency/dirham.svg" alt="AED" width={14} height={12} className="inline-block" />
                          <span className="text-sm text-black">
                            {totalPacking.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}

              <div className="flex items-center justify-between">
                <span className="font-inter font-normal text-[14px] leading-[100%] tracking-[0%] text-[#666]">VAT</span>
                <div className="flex items-center gap-1">
                  <Image src="/icons/currency/dirham.svg" alt="AED" width={14} height={12} className="inline-block" />
                  <span className="text-sm text-black">
                    {subOrders.reduce((acc: number, o: any) => acc + Number(o.vat_amount || 0), 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#C2B280] mt-2">
                <span className="font-inter font-semibold text-[16px] leading-[100%] tracking-[0%] text-[#6E6E6E]">Order total <span className="font-normal text-[#666]">inc. VAT</span></span>
                <div className="flex items-center gap-1">
                  <Image src="/icons/currency/dirham.svg" alt="AED" width={16} height={14} className="inline-block" />
                  <span className="font-inter font-semibold text-[16px] leading-[100%] tracking-[0%] text-[#6E6E6E]">{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 - Payment Details */}
          <div className="bg-[#F0EBE3] border border-[#C2B280] p-4 lg:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-orbitron font-bold text-sm uppercase tracking-wider text-black">
                Payment Details
              </h2>
            </div>
            {(() => {
              const isPaid = subOrders.every((o: any) => o.payment_status === 'paid');
              const isRequest = subOrders.some((o: any) => o.type === 'request');

              if (isPaid) {
                const details = transactionDetails as any;
                // Handle both new nested structure and potential flat structure fallback
                const brand = details?.payment_details?.brand || details?.brand || 'Card';
                const last4 = details?.payment_details?.last4 || details?.last4 || '';
                const receiptUrl = details?.receipt_url;
                const paidAt = details?.timestamp ? new Date(details.timestamp).toLocaleDateString() : orderDate;

                return (
                  <div className="flex flex-col gap-3 bg-[#EBE3D6] p-4 border border-[#C2B280]/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Generic Card Icon or Brand Specific */}
                        <div className="bg-white p-1 rounded border border-[#C2B280]">
                          <span className="font-bold text-xs uppercase text-black">{brand}</span>
                        </div>
                        <span className="text-sm font-medium text-black">
                          **** {last4}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded-full border border-green-200">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                        <span className="text-[10px] font-bold text-green-700 uppercase">Paid</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 text-xs text-[#666]">
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium text-black">{paidAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transaction ID:</span>
                        <span className="font-medium text-black truncate max-w-[150px]" title={details?.transaction_id}>{details?.transaction_id || 'N/A'}</span>
                      </div>
                    </div>

                    {receiptUrl && (
                      <a
                        href={receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#D35400] underline hover:text-[#B51E17] flex items-center gap-1 mt-1"
                      >
                        <Download className="w-3 h-3" />
                        Download Receipt
                      </a>
                    )}
                  </div>
                );
              } else if (isRequest) {
                return (
                  <div className="bg-[#EBE3D6] p-3 text-sm text-[#666]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-[#D35400]"></div>
                      <span className="font-bold text-[#D35400] text-xs uppercase">Request Submitted</span>
                    </div>
                    <p className="text-xs">Your purchase request is pending approval. You will be notified once updates are available.</p>
                  </div>
                );
              } else {
                // Not a request, and NOT paid
                return (
                  <div className="bg-[#EBE3D6] p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="font-bold text-red-600 text-sm uppercase">Payment Pending</span>
                    </div>
                    <p className="text-xs text-[#666] mb-4 leading-relaxed">
                      The payment for this order was not completed. Please proceed to payment to confirm your order.
                    </p>
                    <button
                      onClick={handleRetryPayment}
                      disabled={isRetrying}
                      className="w-full bg-[#D35400] text-white font-orbitron font-bold text-xs uppercase py-3 hover:bg-[#B51E17] transition-colors disabled:opacity-50"
                      style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                    >
                      {isRetrying ? 'Processing...' : 'Complete Payment'}
                    </button>
                  </div>
                );
              }
            })()}
          </div>
        </div>

        {/* Second Row: 1 Column - Delivery Address */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-4">

          <div className="bg-[#F0EBE3] border border-[#C2B280] p-4 lg:p-5 mb-4 lg:mb-0">
            <h2 className="font-orbitron font-bold text-sm uppercase tracking-wider text-black mb-4">
              Delivery Address
            </h2>

            <div className="space-y-4 font-inter text-sm text-[#666]">
              {(() => {
                // Prioritize shipment_details (stored snapshot), fallback to current user address relation
                const shipping = (primaryOrder as any).shipment_details || {};
                // Use address from order relation if shipment_details is empty/invalid
                const addr = (Object.keys(shipping).length > 0) ? shipping : (address || {});

                const name = addr.name || addr.full_name || "N/A";
                const addressLine1 = addr.address_line1 || addr.addressLine1 || "N/A";
                const addressLine2 = addr.address_line2 || addr.addressLine2;
                const city = addr.city;
                const state = addr.state;
                const postalCode = addr.postal_code || addr.postalCode;
                const country = addr.country || "UAE";
                const phone = addr.phone || addr.mobile_number || "N/A";
                const email = addr.email;

                return (
                  <>
                    <div className="flex flex-col">
                      <span className="font-bold text-black uppercase text-xs mb-1">Name:</span>
                      <span className="font-medium text-[#6E6E6E]">{name}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-bold text-black uppercase text-xs mb-1">Address:</span>
                      <div className="font-normal leading-relaxed text-[#6E6E6E]">
                        <p>{addressLine1}</p>
                        {addressLine2 && <p>{addressLine2}</p>}
                        <p>
                          {[city, state].filter(Boolean).join(", ")}
                          {postalCode ? ` - ${postalCode}` : ""}
                        </p>
                        <p>{country}</p>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-bold text-black uppercase text-xs mb-1">Phone:</span>
                      <span className="font-medium text-[#6E6E6E]">{phone}</span>
                    </div>

                    {email && (
                      <div className="flex flex-col">
                        <span className="font-bold text-black uppercase text-xs mb-1">Email:</span>
                        <span className="font-medium text-[#6E6E6E]">{email}</span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
