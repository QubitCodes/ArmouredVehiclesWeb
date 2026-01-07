"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Check, Phone } from "lucide-react";
import OrderSummary from "@/components/cart/OrderSummary";
import PaymentMethodModal from "@/components/modal/PaymentMethodModal";
import { getAccessToken } from "@/lib/api";
import { useCartStore } from "@/lib/cart-store";
import { hydrateCartFromServer } from "@/lib/cart-sync";

// Address placeholder (future: fetch default from addresses)
const mockAddress = {
  label: "Deliver to: Work",
  address:
    "2 23rd St, Al Khayl - Dubai Dubai Dubai, D - SW 0, Al Khayl - Dubai - Dubai, United Arab Emirates",
};

type PaymentMethod = "card" | "tabby" | "tamara" | "apple" | "paypal";

export default function CheckoutPage() {
  const router = useRouter();

  const storeItems = useCartStore((s) => s.items);
  const cartSubtotal = useCartStore((s) => s.subtotal());
  const cartCount = useCartStore((s) => s.count());

  const [deliveryInstructions, setDeliveryInstructions] = useState(false);
  const [selectedReceiver, setSelectedReceiver] = useState<"self" | "other">("self");
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("card");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (getAccessToken()) {
      hydrateCartFromServer();
    }
  }, []);

  const uiItems = useMemo(
    () =>
      storeItems.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty,
        image: i.image || "/product/product1.svg",
      })),
    [storeItems]
  );

  const subtotal = cartSubtotal;
  const shippingFee = subtotal > 500 ? 0 : 40;
  const estimatedVAT = subtotal * 0.05;
  const discount = 0;
  const total = subtotal + shippingFee + estimatedVAT - discount;

  const handleCheckout = () => {
    setIsProcessing(true);
    setShowPaymentModal(true);
  };

  return (
    <section className="max-w-[1200px] mx-auto px-4 lg:px-8 py-6 lg:py-10">
      {/* Back to cart */}
      <button
        className="flex items-center gap-2 text-[#3D4A26] hover:underline mb-6"
        onClick={() => router.push("/cart")}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Cart ({cartCount} Items)
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 lg:gap-10">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* ADDRESS */}
          <div>
            <h2 className="font-orbitron font-black text-[28px] lg:text-[32px] uppercase tracking-wide mb-4 text-black">
              Address
            </h2>
            <div className="bg-[#EBE3D6] p-5 text-black">
              <p className="text-sm font-semibold">{mockAddress.label}</p>
              <p className="text-[14px] text-[#6E6E6E] mt-1">{mockAddress.address}</p>
            </div>
          </div>

          {/* DELIVERY INSTRUCTIONS */}
          <div className="bg-[#EBE3D6] p-5 text-black">
            <div className="flex items-center justify-between mb-3">
              <p className="font-orbitron font-bold text-[16px] uppercase tracking-wider">
                Delivery Instructions
              </p>
            </div>
            <label
              className="inline-flex items-center gap-3 cursor-pointer px-4 py-2 border border-[#C2B280] bg-[#F0EBE3]"
              onClick={() => setDeliveryInstructions(!deliveryInstructions)}
            >
              <div
                className={`w-5 h-5 flex items-center justify-center border shadow-sm transition-colors ${
                  deliveryInstructions ? "bg-[#D7C6AF] border-[#C2B280]" : "bg-[#F0EBE3] border-[#C2B280]"
                }`}
              >
                {deliveryInstructions && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm text-black">Get items together</span>
            </label>
          </div>

          {/* WHO WILL RECEIVE */}
          <div className="bg-[#EBE3D6] p-5 text-black">
            <p className="font-orbitron font-bold text-[16px] uppercase tracking-wider mb-4">
              Who will receive this order?
            </p>
            <div className="flex gap-3">
              {/* Self option */}
              <label
                className={`flex items-center gap-3 px-4 py-3 border cursor-pointer transition-all ${
                  selectedReceiver === "self" ? "border-[#C2B280] bg-[#F0EBE3]" : "border-[#C2B280] bg-[#F0EBE3]"
                }`}
                onClick={() => setSelectedReceiver("self")}
              >
                <div className="w-9 h-9 rounded-full bg-[#004E5E] flex items-center justify-center shrink-0">
                  <span className="text-white text-[16px] font-bold">JM</span>
                </div>
                <div className="flex-1">
                  <span className="text-sm font-semibold block">John Martin</span>
                  <p className="text-[16px] text-[#6E6E6E]">+91-77335-00000</p>
                </div>
                <div
                  className={`w-5 h-5 border flex items-center justify-center transition-colors shadow-sm ${
                    selectedReceiver === "self" ? "bg-[#D7C6AF] border-[#C2B280]" : "bg-[#F0EBE3] border-[#C2B280]"
                  }`}
                >
                  {selectedReceiver === "self" && <Check className="w-3 h-3 text-white" />}
                </div>
                <input type="radio" name="receiver" className="sr-only" checked={selectedReceiver === "self"} onChange={() => setSelectedReceiver("self")} />
              </label>

              {/* Someone else option */}
              <label
                className="flex bg-[#F0EBE3] items-center gap-3 px-4 py-3 cursor-pointer transition-all"
                onClick={() => setSelectedReceiver("other")}
              >
                <Phone className="w-5 h-5 text-[#D35400]" />
                <span className="text-sm">Someone else will receive it</span>
                <div
                  className={`w-5 h-5 border flex items-center justify-center transition-colors shadow-sm ${
                    selectedReceiver === "other" ? "bg-[#39482C] border-[#39482C]" : "bg-[#F0EBE3] border-[#C2B280]"
                  }`}
                >
                  {selectedReceiver === "other" && <Check className="w-3 h-3 text-white" />}
                </div>
                <input type="radio" name="receiver" className="sr-only" checked={selectedReceiver === "other"} onChange={() => setSelectedReceiver("other")} />
              </label>
            </div>
          </div>

          {/* YOUR ORDER */}
          <div>
            <h2 className="font-orbitron font-black text-[28px] lg:text-[32px] uppercase tracking-wide mb-4 text-black">
              Your Order
            </h2>
            <div className="bg-[#EBE3D6] p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-bold text-sm text-black uppercase tracking-wide">
                  Items ({cartCount})
                </span>
              </div>
              {uiItems.length === 0 && <p className="text-[#6E6E6E]">Your cart is empty.</p>}
              {uiItems.map((product) => (
                <div key={product.id} className="flex gap-5 items-start py-2">
                  <Image src={product.image} alt={product.name} width={96} height={96} className="w-24 h-24 object-contain shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-inter font-medium text-[14px] text-[#1A1A1A] leading-snug">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[13px] text-[#6E6E6E]">Qty: {product.qty}</span>
                      <span className="font-semibold text-[14px] text-[#1A1A1A]">{product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PAYMENT */}
          <div>
            <h2 className="font-orbitron font-black text-[28px] lg:text-[32px] uppercase tracking-wide mb-4 text-black">
              Payment
            </h2>
            <div className="bg-[#EBE3D6] p-5 space-y-3 text-black">
              {([
                { id: "card", label: "Debit/Credit Card", description: "Pay via Visa/MasterCard" },
                { id: "tabby", label: "Tabby", description: "Split into 4 payments (Coming Soon)" },
                { id: "tamara", label: "Tamara", description: "Pay in 4 intervals (Coming Soon)" },
                { id: "apple", label: "Apple Pay" },
                { id: "paypal", label: "PayPal" },
              ] as { id: PaymentMethod; label: string; description?: string }[]).map((method, index, arr) => (
                <label
                  key={method.id}
                  className={`flex items-center justify-between p-4 cursor-pointer transition-all ${index !== arr.length - 1 ? "border-b border-[#DBD4C3]" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPayment === method.id ? "border-[#D35400]" : "border-[#6E6E6E]"
                      }`}
                    >
                      {selectedPayment === method.id && <div className="w-2.5 h-2.5 rounded-full bg-[#D35400]" />}
                    </div>
                    <div>
                      <span className="text-sm font-semibold">{method.label}</span>
                      {method.description && <p className="text-[13px] text-[#6E6E6E]">{method.description}</p>}
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    className="sr-only"
                    checked={selectedPayment === method.id}
                    onChange={() => setSelectedPayment(method.id)}
                  />
                </label>
              ))}

              {selectedPayment === "card" && (
                <button className="w-full p-4 mt-1 border-2 border-dashed border-[#6E6E6E] text-sm text-[#6E6E6E] font-semibold hover:border-[#D35400] hover:text-[#D35400] transition-colors">
                  ADD NEW CARD
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - ORDER SUMMARY */}
        <div className="self-start">
          <h2 className="font-orbitron font-black text-[28px] lg:text-[32px] uppercase tracking-wide mb-4">Order Summary</h2>
          <div className="bg-[#EBE3D6]">
            <OrderSummary
              subtotal={subtotal}
              onCheckout={handleCheckout}
              buttonText="PLACE ORDER"
              isLoading={isProcessing}
            />
          </div>
        </div>
      </div>

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <PaymentMethodModal
          onClose={() => {
            setShowPaymentModal(false);
            setIsProcessing(false);
          }}
          subtotal={total}
          onPaymentSuccess={() => {
            setShowPaymentModal(false);
            setIsProcessing(false);
          }}
        />
      )}
    </section>
  );
}
 
