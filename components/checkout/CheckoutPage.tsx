"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  Package,
  Info,
  Phone,
  MapPin,
  Loader,
} from "lucide-react";
import OrderSummary from "@/components/cart/OrderSummary";
import PaymentMethodModal from "@/components/modal/PaymentMethodModal";
import { getAccessToken } from "@/lib/api";

// Mock data for demonstration
const mockAddress = {
  label: "Deliver to: Work",
  address:
    "2 23rd St, Al Khayl - Dubai Dubai Dubai, D - SW 0, Al Khayl - Dubai - Dubai, United Arab Emirates",
};

const mockShipments = [
  {
    id: 1,
    items: 2,
    products: [
      {
        id: 1,
        name: "DFC4+ 4300i HybriDynamic Hybrid Rear Brake Pads",
        price: 679.0,
        image: "/product/product 1.png",
        notReturnable: true,
      },
    ],
    deliveryDate: "Wed, Nov 5",
  },
  {
    id: 2,
    items: 1,
    products: [
      {
        id: 2,
        name: "Duralast 65956ADL High-Performance Disc Brake Rotor",
        price: 475.0,
        image: "/product/brake-rotor-1.jpg",
      },
    ],
    deliveryDate: "Wed, Nov 5",
  },
  {
    id: 3,
    items: 1,
    products: [
      {
        id: 3,
        name: "Duralast Heavy-Duty Disc Brake Rotor 54094DL - Reliable OEM-Grade Performance",
        price: 1625.0,
        image: "/product/rim.png",
      },
    ],
    deliveryDate: "Wed, Nov 5",
  },
];

const paymentMethods = [
  {
    id: "card",
    label: "Debit/Credit Card",
    description: "Pay via your Visa and MasterCard etc.",
    icon: "visa",
    selected: true,
  },
  {
    id: "tabby",
    label: "Tabby",
    description: "Split into 4. 0 payments",
    icon: "tabby",
  },
  {
    id: "tamara",
    label: "Tamara",
    description: "Pay in 4 intervals, interest free payments of AED 934.25",
    icon: "tamara",
  },
  { id: "apple", label: "Apple Pay", icon: "apple" },
  { id: "paypal", label: "Paypal", icon: "paypal" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedReceiver, setSelectedReceiver] = useState<"self" | "other">(
    "self"
  );
  const [deliveryInstructions, setDeliveryInstructions] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculations
  const subtotal = mockShipments.reduce(
    (sum, shipment) => sum + shipment.products.reduce((s, p) => s + p.price, 0),
    0
  );
  const shippingFee = subtotal > 500 ? 0 : 40; // Free shipping on orders > 500 AED
  const discount = -9.85;
  const estimatedVAT = subtotal * 0.05; // 5% VAT
  const total = subtotal + shippingFee + estimatedVAT + discount;

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      // Check if user is authenticated
      const token = localStorage.getItem("access_token");
      if (!token) {
        // Redirect to login if not authenticated
        router.push("/login?redirect=/checkout");
        return;
      }

      setShowPaymentModal(true);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="bg-[#F0EBE3] min-h-screen">
      {/* Back to Cart */}
      <div className="max-w-[1660px] mx-auto px-6 pt-6">
        <button
          className="flex items-center gap-3 hover:opacity-70 transition-opacity"
          onClick={() => router.push("/cart")}>
          <ArrowLeft className="w-5 h-5 text-[#D35400]" strokeWidth={2.5} />
          <span className="font-orbitron font-bold text-sm uppercase tracking-wider text-[#1A1A1A]">
            Back to Cart
          </span>
          <span className="text-[#6E6E6E] text-sm">(3 Items)</span>
        </button>
      </div>

      <div className="max-w-[1660px] mx-auto px-6 py-[5px] grid lg:grid-cols-[1fr_400px] gap-10 items-start">
        {/* LEFT COLUMN */}
        <div className="space-y-8">
          {/* SHIPPING ADDRESS */}
          <div>
            <h2 className="font-orbitron font-black text-[32px] text-black uppercase tracking-wide mb-4">
              Shipping Address
            </h2>

            {/* ADDRESS BOX */}
            <div className="bg-[#EBE3D6] p-5 mb-4">
              <p className="font-orbitron font-bold text-[16px] uppercase tracking-wider mb-3 text-black">
                Address
              </p>
              {/* Inner address card */}
              <div className="bg-[#F0EBE3] p-4 flex items-center justify-between">
                <div className="flex gap-3 items-start">
                  <MapPin className="w-5 h-5 text-[#39482C] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm mb-1 text-black">
                      Deliver to <span className="font-bold">Work</span>
                    </p>
                    <p className="text-[16px] text-[#6E6E6E] max-w-md leading-relaxed">
                      3-56th St - Al Wasl - Dubai - Dubai Dubai, 3 - 56th St Al
                      Wasl - Dubai - Dubai, Dubai, United Arab Emirates
                    </p>
                  </div>
                </div>
                <button className="p-1 hover:bg-[#E8E0D4] transition-colors rounded">
                  <ChevronRight className="w-5 h-5 text-[#6E6E6E]" />
                </button>
              </div>
            </div>

            {/* DELIVERY INSTRUCTIONS BOX */}
            <div className="bg-[#EBE3D6] p-5 mb-4 text-black">
              <div className="flex items-center justify-between mb-3">
                <p className="font-orbitron font-bold text-[16px] uppercase tracking-wider">
                  Delivery Instructions
                </p>
                <button className="hover:opacity-80 transition-opacity">
                  <Image
                    src="/order/Vector.svg"
                    alt="Info"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
              <label
                className="inline-flex items-center gap-3 cursor-pointer px-4 py-2 border border-[#C2B280] bg-[#F0EBE3]"
                onClick={() => setDeliveryInstructions(!deliveryInstructions)}>
                <div
                  className={`w-5 h-5 flex items-center justify-center border shadow-sm transition-colors ${
                    deliveryInstructions
                      ? "bg-[#D7C6AF] border-[#C2B280]"
                      : "bg-[#F0EBE3] border-[#C2B280]"
                  }`}>
                  {deliveryInstructions && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-sm text-black">Get items together</span>
              </label>
            </div>

            {/* WHO WILL RECEIVE BOX */}
            <div className="bg-[#EBE3D6] p-5 text-black">
              <p className="font-orbitron font-bold text-[16px] uppercase tracking-wider mb-4">
                Who will receive this order?
              </p>
              <div className="flex gap-3">
                {/* Self option */}
                <label
                  className={`flex items-center gap-3 px-4 py-3 border cursor-pointer transition-all ${
                    selectedReceiver === "self"
                      ? "border-[#C2B280] bg-[#F0EBE3]"
                      : "border-[#C2B280] bg-[#F0EBE3]"
                  }`}
                  onClick={() => setSelectedReceiver("self")}>
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-[#004E5E] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[16px] font-bold">JM</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold block">
                      John Martin
                    </span>
                    <p className="text-[16px] text-[#6E6E6E]">
                      +91-77335-00000
                    </p>
                  </div>
                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 border flex items-center justify-center transition-colors shadow-sm ${
                      selectedReceiver === "self"
                        ? "bg-[#D7C6AF] border-[#C2B280] color-[#fff]"
                        : "bg-[#F0EBE3] border-[#C2B280]"
                    }`}>
                    {selectedReceiver === "self" && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="receiver"
                    className="sr-only"
                    checked={selectedReceiver === "self"}
                    onChange={() => setSelectedReceiver("self")}
                  />
                </label>

                {/* Someone else option */}
                <label
                  className="flex bg-[#F0EBE3] items-center gap-3 px-4 py-3 bg-transparent cursor-pointer transition-all"
                  onClick={() => setSelectedReceiver("other")}>
                  <Phone className="w-5 h-5 text-[#D35400]" />
                  <span className="text-sm">Someone else will receive it</span>
                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 border flex items-center justify-center transition-colors shadow-sm ${
                      selectedReceiver === "other"
                        ? "bg-[#39482C] border-[#39482C]"
                        : "bg-[#F0EBE3] border-[#C2B280]"
                    }`}>
                    {selectedReceiver === "other" && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="receiver"
                    className="sr-only"
                    checked={selectedReceiver === "other"}
                    onChange={() => setSelectedReceiver("other")}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* YOUR ORDER */}
          <div>
            <h2 className="font-orbitron font-black text-[32px] uppercase tracking-wide mb-4">
              Your Order
            </h2>

            <div className="space-y-4">
              {mockShipments.map((shipment, index) => (
                <div key={shipment.id} className="bg-[#EBE3D6] p-5">
                  {/* Shipment Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-orbitron font-bold text-sm text-black uppercase tracking-wide">
                      Shipment {index + 1} of {mockShipments.length}
                    </span>
                    <span className="text-sm text-[#6E6E6E]">
                      ({shipment.items} Items)
                    </span>
                  </div>

                  {shipment.products.map((product) => (
                    <div key={product.id} className="flex gap-5 items-start">
                      {/* Product Image */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-24 object-contain flex-shrink-0"
                      />

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-inter font-medium text-[14px] text-[#1A1A1A] leading-snug">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          <svg
                            width="14"
                            height="12"
                            viewBox="0 0 17 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true">
                            <g clipPath="url(#clip0_260_315)">
                              <path
                                d="M1.5011 0.0172414C1.5079 0.0275862 1.5453 0.0741379 1.581 0.118966C1.8411 0.432759 2.0366 0.943104 2.142 1.58621C2.2117 2.00862 2.2151 2.14138 2.2151 3.75172V5.25172H1.5045C0.8551 5.25172 0.7803 5.24828 0.6528 5.22241C0.4522 5.17931 0.2448 5.06379 0.1054 4.91552C-0.0051 4.79655 -0.0017 4.78966 0.0051 5.15C0.0136 5.44828 0.017 5.48103 0.0595 5.6431C0.1275 5.9 0.221 6.09138 0.3621 6.26207C0.5542 6.49655 0.7497 6.62759 1.0285 6.71552C1.088 6.73276 1.2138 6.73966 1.6592 6.7431L2.2151 6.75172V7.49828V8.24655L1.4314 8.24138L0.6443 8.23621L0.5083 8.18104C0.3468 8.11552 0.2737 8.06724 0.1156 7.92414L0 7.81897L0.0068 8.14828C0.0153 8.45345 0.017 8.48793 0.0595 8.6431C0.2074 9.19138 0.5644 9.58276 1.0353 9.71035C1.1526 9.7431 1.1985 9.74483 1.6898 9.75173L2.2151 9.75862V11.3034C2.2151 12.2362 2.21 12.9241 2.2015 13.0414C2.193 13.1483 2.1658 13.3483 2.142 13.4879C2.0315 14.131 1.8326 14.6155 1.547 14.9293L1.4892 14.9931H4.3639C6.0826 14.9931 7.3678 14.9862 7.5565 14.9776C7.888 14.9603 8.6275 14.8862 8.7941 14.85C8.8468 14.8397 8.9454 14.8241 9.01 14.8138C9.1477 14.7931 9.3755 14.7448 9.7036 14.6603C10.166 14.5431 10.5876 14.3966 11.0007 14.2103C11.1299 14.1517 11.5005 13.9603 11.5991 13.9C11.6518 13.869 11.7147 13.831 11.7385 13.819C11.8048 13.7828 11.9153 13.7103 12.0768 13.5931C12.1567 13.5345 12.2366 13.4776 12.2536 13.4655C12.325 13.4172 12.5715 13.2086 12.6837 13.1034C13.1104 12.7052 13.4674 12.2621 13.7445 11.7879C13.7836 11.719 13.8346 11.6328 13.8567 11.5966C13.9128 11.5 14.144 11.0172 14.1661 10.9448C14.1763 10.9121 14.1899 10.8776 14.1967 10.8707C14.2409 10.8121 14.4959 9.99828 14.5265 9.82069C14.5367 9.76379 14.5418 9.75517 14.5843 9.74655C14.6115 9.74138 15.0076 9.74138 15.4649 9.74483C16.3795 9.75173 16.3795 9.75173 16.5818 9.84655C16.6957 9.9 16.7297 9.92414 16.8555 10.0397C17.0204 10.1897 17.0051 10.2138 16.9949 9.83793C16.9881 9.61724 16.9796 9.48104 16.9643 9.42586C16.9065 9.21379 16.8929 9.16897 16.8419 9.06207C16.6753 8.6931 16.3965 8.42931 16.0395 8.30345L15.9001 8.25173L15.3323 8.24483L14.7662 8.23621L14.773 8.03448C14.7798 7.76897 14.7798 7.2431 14.7713 6.97241L14.7645 6.75517L15.5227 6.75172C16.1721 6.74828 16.2928 6.75173 16.3642 6.77069C16.5784 6.83104 16.7229 6.91379 16.8997 7.07759L16.9983 7.17069V6.91552C16.9983 6.61207 16.983 6.47759 16.9218 6.27759C16.8011 5.87241 16.5631 5.57069 16.2231 5.38448C16.0021 5.26379 15.9885 5.26034 15.2286 5.25517C14.7832 5.25172 14.5503 5.24483 14.5384 5.23448C14.5282 5.22414 14.5197 5.2069 14.5197 5.1931C14.5197 5.17931 14.4942 5.07069 14.4602 4.95345C14.0624 3.52759 13.3195 2.39483 12.2332 1.55517C12.0853 1.43966 11.7232 1.19655 11.577 1.11379C11.5209 1.08103 11.4597 1.04655 11.4444 1.03621C11.373 0.996552 10.9633 0.793104 10.8613 0.75C10.8001 0.722414 10.7202 0.687931 10.6845 0.674138C10.0844 0.410345 9.078 0.160345 8.3096 0.0827586C8.1838 0.0706897 8.0172 0.0517241 7.9407 0.0448276C7.5939 0.00517241 7.1128 0 4.3809 0C2.0723 0 1.4926 0.00517241 1.5011 0.0172414ZM7.123 0.763793C7.6976 0.798276 8.0512 0.843104 8.4643 0.944828C9.7257 1.24828 10.6131 1.88966 11.2574 2.96207C11.3169 3.06207 11.5685 3.58276 11.6059 3.68793C11.7844 4.17586 11.8711 4.46552 11.9476 4.84828C11.9663 4.94138 11.9918 5.06552 12.0037 5.12414C12.0156 5.18104 12.0207 5.23448 12.0156 5.23966C12.0071 5.24655 10.3003 5.25 8.2195 5.24828L4.437 5.24483L4.4319 3.02931C4.4302 1.81207 4.4319 0.8 4.437 0.781035L4.4438 0.748276H5.6525C6.3155 0.748276 6.9785 0.755172 7.123 0.763793ZM12.1805 6.80345C12.1924 6.87759 12.1924 8.13621 12.1805 8.19828L12.1703 8.24483L8.3028 8.24138L4.437 8.23621L4.4336 7.50517C4.4302 7.10345 4.4336 6.76897 4.437 6.76207C4.4421 6.75345 6.0894 6.74828 8.3079 6.74828H12.1703L12.1805 6.80345ZM12.0071 9.76379C12.0156 9.78966 11.9748 10.0017 11.8915 10.3466C11.7963 10.7345 11.6671 11.1259 11.5362 11.4155C11.4716 11.5638 11.3101 11.8845 11.271 11.9448C11.2523 11.9724 11.1979 12.0603 11.1503 12.1379C10.8443 12.6241 10.4074 13.0672 9.9093 13.3948C9.7274 13.5121 9.3534 13.7121 9.2531 13.7431C9.2327 13.7483 9.2106 13.7586 9.2021 13.7655C9.1902 13.7759 9.0355 13.8345 8.8553 13.9C8.5238 14.019 7.8931 14.1483 7.3865 14.2017C7.0584 14.2345 7.0057 14.2362 5.7426 14.2362H4.4353V12V9.76207L8.1906 9.75517C10.2561 9.75173 11.9578 9.74655 11.9714 9.7431C11.9867 9.74138 12.002 9.75173 12.0071 9.76379Z"
                                fill="currentColor"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_260_315">
                                <rect width="17" height="15" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          <span className="font-semibold text-[14px] text-[#1A1A1A]">
                            {product.price.toFixed(2)}
                          </span>
                        </div>

                        {/* Not Returnable Badge */}
                        {"notReturnable" in product &&
                          product.notReturnable && (
                            <div className="flex items-center gap-2 mt-2 text-[12px] text-[#E74C3C]">
                              <svg
                                className="w-4 h-4"
                                viewBox="0 0 21 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_260_56)">
                                  <path
                                    d="M10.2339 25C9.70907 24.576 9.17751 24.1519 8.65267 23.7213C7.97981 23.1668 7.31368 22.6122 6.64755 22.0512C6.2371 21.7119 6.2371 21.3401 6.64082 21.0008C7.74431 20.0809 8.8478 19.1676 9.94457 18.2477C10.1464 18.078 10.355 17.9867 10.6107 18.1041C10.8664 18.2151 10.9404 18.4303 10.9337 18.6848C10.9269 19.0436 10.9337 19.3959 10.9337 19.7678C11.0279 19.7743 11.1019 19.7808 11.1759 19.7808C12.4678 19.7808 13.7597 19.7808 15.0516 19.7808C15.4015 19.7808 15.4553 19.7286 15.4553 19.3828C15.4553 17.9606 15.4553 16.5319 15.4553 15.1096C15.4553 14.5094 15.6841 14.2876 16.3031 14.2876C16.9558 14.2876 17.6152 14.2876 18.2679 14.2876C18.7725 14.2876 19.0349 14.542 19.0349 15.0248C19.0349 16.5449 19.0484 18.0715 19.0282 19.5916C19.0013 21.5684 17.4133 23.1537 15.3813 23.2451C14.9372 23.2646 14.4931 23.2581 14.049 23.2516C13.7866 23.2516 13.6251 23.1081 13.6184 22.8993C13.6117 22.684 13.7799 22.5274 14.049 22.5209C14.4864 22.5144 14.9237 22.5274 15.3611 22.5078C16.9558 22.4296 18.2342 21.203 18.2679 19.6503C18.3015 18.1433 18.2746 16.6362 18.2746 15.1357C18.2746 15.1031 18.2611 15.077 18.2544 15.0313C17.5815 15.0313 16.9087 15.0313 16.2022 15.0313C16.2022 15.1292 16.2022 15.2205 16.2022 15.3119C16.2022 16.6623 16.2022 18.0128 16.2022 19.3633C16.2022 20.1331 15.8254 20.505 15.0381 20.505C13.6588 20.505 12.2861 20.505 10.9068 20.505C10.355 20.505 10.1666 20.3223 10.1666 19.7873C10.1666 19.5525 10.1666 19.3176 10.1666 19.0175C9.63505 19.4546 9.15059 19.8591 8.66613 20.2636C8.17494 20.6681 7.68375 21.0791 7.15892 21.5162C8.15476 22.3447 9.13041 23.1602 10.1666 24.0149C10.1666 23.6952 10.1666 23.4277 10.1666 23.1668C10.1733 22.7362 10.3819 22.5209 10.8327 22.5209C11.371 22.5144 11.9093 22.5144 12.4476 22.5209C12.7504 22.5209 12.9052 22.6579 12.8984 22.8928C12.8917 23.1211 12.7437 23.2451 12.4543 23.2516C11.9497 23.2581 11.4518 23.2516 10.9269 23.2516C10.9269 23.6104 10.9135 23.9431 10.9337 24.2759C10.9539 24.6021 10.8462 24.8434 10.53 24.987C10.4358 25 10.3348 25 10.2339 25Z"
                                    fill="#E74C3C"
                                  />
                                  <path
                                    d="M12.9796 2.79881C13.1949 2.53132 13.39 2.25079 13.6188 2.0094C14.4397 1.14823 15.4759 0.724173 16.6803 0.685029C16.7543 0.685029 16.8351 0.678505 16.9091 0.691553C17.1244 0.724173 17.2657 0.893798 17.2388 1.08299C17.2119 1.28524 17.084 1.38962 16.8687 1.41572C16.4919 1.45486 16.1084 1.46139 15.7518 1.55925C14.0764 2.01593 13.0402 3.59474 13.2689 5.2975C13.4842 6.87631 14.9578 8.16154 16.5996 8.19416C18.3759 8.22678 19.8697 7.06551 20.1725 5.40189C20.4416 3.92746 19.6947 2.47261 18.3288 1.78759C18.275 1.76149 18.2212 1.73539 18.1741 1.7093C17.9655 1.59187 17.8982 1.40267 17.9924 1.21347C18.0933 1.02428 18.2885 0.959038 18.5038 1.0569C19.1834 1.357 19.7553 1.79411 20.1725 2.39432C21.1683 3.81003 21.2962 5.31707 20.4282 6.81107C19.5602 8.30507 18.1741 8.99009 16.4112 8.9118C16.0882 8.89876 15.772 8.81394 15.4288 8.75523C15.4288 8.84004 15.4288 8.93137 15.4288 9.01619C15.4288 10.0796 15.4288 11.1495 15.4288 12.213C15.4288 12.5848 15.2808 12.8784 14.9443 13.0676C12.697 14.3267 10.4429 15.5859 8.18882 16.845C7.85912 17.0277 7.53615 17.0211 7.20644 16.8385C4.97927 15.5989 2.73865 14.3463 0.504746 13.0937C0.168315 12.9045 0.000100016 12.6305 0.000100016 12.2521C0.00682863 11.554 0.000100016 10.8494 0.000100016 10.1514C0.000100016 9.87736 0.134672 9.72078 0.356716 9.70773C0.592218 9.70121 0.746976 9.86431 0.753705 10.1448C0.760433 10.8233 0.760433 11.4953 0.753705 12.1738C0.753705 12.3173 0.794076 12.4152 0.928649 12.487C3.00779 13.6482 5.08693 14.8095 7.15934 15.9708C7.19972 15.9969 7.24682 16.0099 7.32756 16.0491C7.32756 15.9382 7.32756 15.8599 7.32756 15.7816C7.32756 13.4917 7.32756 11.2083 7.32756 8.91833C7.32756 8.76827 7.29392 8.67041 7.14589 8.5856C5.0802 7.43738 3.02125 6.28263 0.955563 5.12788C0.901734 5.09526 0.841177 5.07569 0.753705 5.03654C0.753705 5.29098 0.753705 5.51932 0.753705 5.74114C0.753705 6.66102 0.753705 7.58091 0.753705 8.50079C0.753705 8.59865 0.767162 8.72261 0.713333 8.78132C0.612404 8.87918 0.464374 9.00966 0.343259 8.99661C0.222144 8.98357 0.121215 8.82699 0.0135572 8.72261C-0.0066286 8.70303 0.000100016 8.65737 0.000100016 8.62475C0.000100016 7.30037 0.000100016 5.96948 0.000100016 4.6451C0.000100016 4.30585 0.181773 4.05794 0.477831 3.89484C2.71846 2.63571 4.96582 1.3831 7.20644 0.123965C7.57652 -0.0848035 7.91968 -0.0391355 8.27629 0.156585C9.7835 1.00471 11.2974 1.8463 12.8047 2.69442C12.8652 2.74009 12.9258 2.77271 12.9796 2.79881Z"
                                    fill="#E74C3C"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_260_56">
                                    <rect width="21" height="25" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                              <span>Not Returnable</span>
                            </div>
                          )}
                      </div>

                      {/* Delivery Date - Right Side */}
                      <p className="text-[16px] text-[#6E6E6E] flex-shrink-0 self-end">
                        Get it by{" "}
                        <span className="text-[#27AE60] font-semibold">
                          {shipment.deliveryDate}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* PAYMENT */}
          <div>
            <h2 className="font-orbitron font-black text-[32px] uppercase tracking-wide mb-4 text-black">
              Payment
            </h2>

            <div className="bg-[#EBE3D6] p-5">
              {paymentMethods.map((method, index) => (
                <label
                  key={method.id}
                  className={`flex items-center justify-between p-4 cursor-pointer transition-all ${
                    index !== paymentMethods.length - 1
                      ? "border-b border-[#DBD4C3]"
                      : ""
                  }`}>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPayment === method.id
                          ? "border-[#D35400]"
                          : "border-[#6E6E6E]"
                      }`}>
                      {selectedPayment === method.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#D35400]" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-semibold">
                        {method.label}
                      </span>
                      {method.description && (
                        <p className="text-[16px] text-[#6E6E6E]">
                          {method.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.id === "card" && (
                      <>
                        <Image
                          src="/order/paysvg.svg"
                          alt="Card Payment"
                          width={80}
                          height={24}
                          className="h-6 w-auto object-contain"
                        />
                        <Image
                          src="/order/paysvg1.svg"
                          alt="Card Payment"
                          width={80}
                          height={24}
                          className="h-6 w-auto object-contain"
                        />
                      </>
                    )}
                    {method.id === "tabby" && (
                      <Image
                        src="/order/paysvg2.svg"
                        alt="Tabby"
                        width={60}
                        height={24}
                        className="h-6 w-auto object-contain"
                      />
                    )}
                    {method.id === "tamara" && (
                      <Image
                        src="/order/paysvg3.svg"
                        alt="Tamara"
                        width={60}
                        height={24}
                        className="h-6 w-auto object-contain"
                      />
                    )}
                    {method.id === "apple" && (
                      <Image
                        src="/order/paysvg4.svg"
                        alt="Apple Pay"
                        width={50}
                        height={24}
                        className="h-6 w-auto object-contain"
                      />
                    )}
                    {method.id === "paypal" && (
                      <Image
                        src="/order/paysvg5.svg"
                        alt="PayPal"
                        width={60}
                        height={24}
                        className="h-6 w-auto object-contain"
                      />
                    )}
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

              {/* Add New Card Button */}
              {selectedPayment === "card" && (
                <button className="w-full p-4 mt-3 border-2 border-dashed border-[#6E6E6E] text-sm text-[#6E6E6E] font-semibold hover:border-[#D35400] hover:text-[#D35400] transition-colors">
                  ADD NEW CARD
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - ORDER SUMMARY */}
        <div className="self-start sticky top-30">
          <h2 className="font-orbitron font-black text-[32px] uppercase tracking-wide mb-4">
            Order Summary
          </h2>
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
          onClose={() => setShowPaymentModal(false)}
          subtotal={total}
          onPaymentSuccess={() => {
            setShowPaymentModal(false);
            // Payment will redirect to Stripe, then to success page
          }}
        />
      )}
    </section>
  );
}
