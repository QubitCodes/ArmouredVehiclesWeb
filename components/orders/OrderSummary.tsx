"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ChevronDown, Check, MoreVertical } from "lucide-react";
import { useState } from "react";

// Completed orders data (same as OrdersPage)
const completedOrders = [
  {
    id: "AMZ-12345678-987654",
    status: "delivered",
    statusText: "Delivered on Monday, November 3, at 4:08 PM.",
    product: {
      name: "DFC® - 4000 HybriDynamic Hybrid Rear Brake Pads",
      price: 679.0,
      image: "/product/product 1.png",
    },
  },
  {
    id: "AMZ-12345678-987654",
    status: "cancelled",
    statusText: "Cancelled on Monday, 4th Nov, 6:14 PM.",
    product: {
      name: "Duralast 45084DL High-Performance Disc Brake Rotor",
      price: 475.0,
      image: "/product/brake-rotor-1.jpg",
    },
  },
  {
    id: "AMZ-12345678-987654",
    status: "cancelled",
    statusText: "Cancelled on Monday, 5th Nov, 12:20 PM.",
    product: {
      name: "Duralast Heavy-Duty Disc Brake Rotor 54094DL Reliable OEM-Grade Performance",
      price: 1625.0,
      image: "/product/rim.png",
    },
  },
];

// Mock order data
const orderData = {
  shipmentId: "ARMHB0092259108",
  orderDate: "3rd Nov 2025",
  orderDetails: {
    itemsValue: 679.00,
    itemsCount: 3,
    fees: "Free",
    shippingFee: "Free",
    orderTotal: 679.00,
  },
  paymentMethod: "Tamara",
  deliveryAddress: {
    type: "Work",
    name: "John Martin",
    address: "Al Qusais, Dubai, United Arab Emirates",
    phone: "+971 501234567",
    verified: true,
  },
  deliveryOptions: ["Two-Day Delivery", "Get Items Together"],
  items: [
    {
      id: 1,
      name: "DFC® - 4000 HybriDynamic Hybrid Rear Brake Pads",
      price: 679.0,
      image: "/product/product 1.png",
      orderId: "AMZ-12345678-987654",
      status: "delivered",
      statusText: "Delivered on Monday, November 3, at 4:08 PM.",
    },
    {
      id: 2,
      name: "Duralast 45084DL High-Performance Disc Brake Rotor",
      price: 475.0,
      image: "/product/brake-rotor-1.jpg",
      orderId: "AMZ-12345678-987654",
      status: "cancelled",
      statusText: "Cancelled on Monday, 4th Nov, 6:14 PM.",
    },
    {
      id: 3,
      name: "Duralast Heavy-Duty Disc Brake Rotor 54094DL Reliable OEM-Grade Performance",
      price: 1625.0,
      image: "/product/rim.png",
      orderId: "AMZ-12345678-987654",
      status: "cancelled",
      statusText: "Cancelled on Monday, 5th Nov, 12:20 PM.",
    },
  ],
};

interface OrderSummaryProps {
  orderId: string;
}

export default function OrderSummary({ orderId }: OrderSummaryProps) {
  const router = useRouter();
  const [showFees, setShowFees] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
          Order Summary
        </h1>
      </div>

      {/* Shipment Info */}
      <div className="bg-[#EBE3D6] p-4 lg:p-5 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
          <p className="text-sm text-[#666]">
            Order/Shipment ID <span className="text-black font-medium">{orderData.shipmentId}</span>
          </p>
          <p className="text-sm text-[#666]">
            Order Date: <span className="text-sm text-[#666]">{orderData.orderDate}</span>
          </p>
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
                <span className="font-inter font-normal text-[14px] leading-[100%] tracking-[0%] text-[#666]">Items value <span className="text-[#666]">({orderData.orderDetails.itemsCount} items)</span></span>
                <div className="flex items-center gap-1">
                  <svg width="14" height="12" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5011 0.0172414C1.5079 0.0275862 1.5453 0.0741379 1.581 0.118966C1.8411 0.432759 2.0366 0.943104 2.142 1.58621C2.2117 2.00862 2.2151 2.14138 2.2151 3.75172V5.25172H1.5045C0.8551 5.25172 0.7803 5.24828 0.6528 5.22241C0.4522 5.17931 0.2448 5.06379 0.1054 4.91552C-0.0051 4.79655 -0.0017 4.78966 0.0051 5.15C0.0136 5.44828 0.017 5.48103 0.0595 5.6431C0.1275 5.9 0.221 6.09138 0.3621 6.26207C0.5542 6.49655 0.7497 6.62759 1.0285 6.71552C1.088 6.73276 1.2138 6.73966 1.6592 6.7431L2.2151 6.75172V7.49828V8.24655L1.4314 8.24138L0.6443 8.23621L0.5083 8.18104C0.3468 8.11552 0.2737 8.06724 0.1156 7.92414L0 7.81897L0.0068 8.14828C0.0153 8.45345 0.017 8.48793 0.0595 8.6431C0.2074 9.19138 0.5644 9.58276 1.0353 9.71035C1.1526 9.7431 1.1985 9.74483 1.6898 9.75173L2.2151 9.75862V11.3034C2.2151 12.2362 2.21 12.9241 2.2015 13.0414C2.193 13.1483 2.1658 13.3483 2.142 13.4879C2.0315 14.131 1.8326 14.6155 1.547 14.9293L1.4892 14.9931H4.3639C6.0826 14.9931 7.3678 14.9862 7.5565 14.9776C7.888 14.9603 8.6275 14.8862 8.7941 14.85C8.8468 14.8397 8.9454 14.8241 9.01 14.8138C9.1477 14.7931 9.3755 14.7448 9.7036 14.6603C10.166 14.5431 10.5876 14.3966 11.0007 14.2103C11.1299 14.1517 11.5005 13.9603 11.5991 13.9C11.6518 13.869 11.7147 13.831 11.7385 13.819C11.8048 13.7828 11.9153 13.7103 12.0768 13.5931C12.1567 13.5345 12.2366 13.4776 12.2536 13.4655C12.325 13.4172 12.5715 13.2086 12.6837 13.1034C13.1104 12.7052 13.4674 12.2621 13.7445 11.7879C13.7836 11.719 13.8346 11.6328 13.8567 11.5966C13.9128 11.5 14.144 11.0172 14.1661 10.9448C14.1763 10.9121 14.1899 10.8776 14.1967 10.8707C14.2409 10.8121 14.4959 9.99828 14.5265 9.82069C14.5367 9.76379 14.5418 9.75517 14.5843 9.74655C14.6115 9.74138 15.0076 9.74138 15.4649 9.74483C16.3795 9.75173 16.3795 9.75173 16.5818 9.84655C16.6957 9.9 16.7297 9.92414 16.8555 10.0397C17.0204 10.1897 17.0051 10.2138 16.9949 9.83793C16.9881 9.61724 16.9796 9.48104 16.9643 9.42586C16.9065 9.21379 16.8929 9.16897 16.8419 9.06207C16.6753 8.6931 16.3965 8.42931 16.0395 8.30345L15.9001 8.25173L15.3323 8.24483L14.7662 8.23621L14.773 8.03448C14.7798 7.76897 14.7798 7.2431 14.7713 6.97241L14.7645 6.75517L15.5227 6.75172C16.1721 6.74828 16.2928 6.75173 16.3642 6.77069C16.5784 6.83104 16.7229 6.91379 16.8997 7.07759L16.9983 7.17069V6.91552C16.9983 6.61207 16.983 6.47759 16.9218 6.27759C16.8011 5.87241 16.5631 5.57069 16.2231 5.38448C16.0021 5.26379 15.9885 5.26034 15.2286 5.25517C14.7832 5.25172 14.5503 5.24483 14.5384 5.23448C14.5282 5.22414 14.5197 5.2069 14.5197 5.1931C14.5197 5.17931 14.4942 5.07069 14.4602 4.95345C14.0624 3.52759 13.3195 2.39483 12.2332 1.55517C12.0853 1.43966 11.7232 1.19655 11.577 1.11379C11.5209 1.08103 11.4597 1.04655 11.4444 1.03621C11.373 0.996552 10.9633 0.793104 10.8613 0.75C10.8001 0.722414 10.7202 0.687931 10.6845 0.674138C10.0844 0.410345 9.078 0.160345 8.3096 0.0827586C8.1838 0.0706897 8.0172 0.0517241 7.9407 0.0448276C7.5939 0.00517241 7.1128 0 4.3809 0C2.0723 0 1.4926 0.00517241 1.5011 0.0172414ZM7.123 0.763793C7.6976 0.798276 8.0512 0.843104 8.4643 0.944828C9.7257 1.24828 10.6131 1.88966 11.2574 2.96207C11.3169 3.06207 11.5685 3.58276 11.6059 3.68793C11.7844 4.17586 11.8711 4.46552 11.9476 4.84828C11.9663 4.94138 11.9918 5.06552 12.0037 5.12414C12.0156 5.18104 12.0207 5.23448 12.0156 5.23966C12.0071 5.24655 10.3003 5.25 8.2195 5.24828L4.437 5.24483L4.4319 3.02931C4.4302 1.81207 4.4319 0.8 4.437 0.781035L4.4438 0.748276H5.6525C6.3155 0.748276 6.9785 0.755172 7.123 0.763793ZM12.1805 6.80345C12.1924 6.87759 12.1924 8.13621 12.1805 8.19828L12.1703 8.24483L8.3028 8.24138L4.437 8.23621L4.4336 7.50517C4.4302 7.10345 4.4336 6.76897 4.437 6.76207C4.4421 6.75345 6.0894 6.74828 8.3079 6.74828H12.1703L12.1805 6.80345ZM12.0071 9.76379C12.0156 9.78966 11.9748 10.0017 11.8915 10.3466C11.7963 10.7345 11.6671 11.1259 11.5362 11.4155C11.4716 11.5638 11.3101 11.8845 11.271 11.9448C11.2523 11.9724 11.1979 12.0603 11.1503 12.1379C10.8443 12.6241 10.4074 13.0672 9.9093 13.3948C9.7274 13.5121 9.3534 13.7121 9.2531 13.7431C9.2327 13.7483 9.2106 13.7586 9.2021 13.7655C9.1902 13.7759 9.0355 13.8345 8.8553 13.9C8.5238 14.019 7.8931 14.1483 7.3865 14.2017C7.0584 14.2345 7.0057 14.2362 5.7426 14.2362H4.4353V12V9.76207L8.1906 9.75517C10.2561 9.75173 11.9578 9.74655 11.9714 9.7431C11.9867 9.74138 12.002 9.75173 12.0071 9.76379Z" fill="currentColor" />
                  </svg>
                  <span className="text-sm text-black">{orderData.orderDetails.itemsValue.toFixed(2)}</span>
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
                <span className="text-sm text-[#009900] font-medium">{orderData.orderDetails.fees}</span>
              </div>
              
              <div className="flex items-center justify-between bg-[#EBE3D6] p-3">
                <span className="text-sm text-[#666]">Shipping Fee</span>
                <span className="text-sm text-[#009900] font-medium">{orderData.orderDetails.shippingFee}</span>
              </div>
              
              <div className="flex items-center justify-between pt-3">
                <span className="font-inter font-semibold text-[16px] leading-[100%] tracking-[0%] text-[#6E6E6E]">Order total <span className="font-normal text-[#666]">inc. VAT</span></span>
                <div className="flex items-center gap-1">
                  <svg width="14" height="12" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5011 0.0172414C1.5079 0.0275862 1.5453 0.0741379 1.581 0.118966C1.8411 0.432759 2.0366 0.943104 2.142 1.58621C2.2117 2.00862 2.2151 2.14138 2.2151 3.75172V5.25172H1.5045C0.8551 5.25172 0.7803 5.24828 0.6528 5.22241C0.4522 5.17931 0.2448 5.06379 0.1054 4.91552C-0.0051 4.79655 -0.0017 4.78966 0.0051 5.15C0.0136 5.44828 0.017 5.48103 0.0595 5.6431C0.1275 5.9 0.221 6.09138 0.3621 6.26207C0.5542 6.49655 0.7497 6.62759 1.0285 6.71552C1.088 6.73276 1.2138 6.73966 1.6592 6.7431L2.2151 6.75172V7.49828V8.24655L1.4314 8.24138L0.6443 8.23621L0.5083 8.18104C0.3468 8.11552 0.2737 8.06724 0.1156 7.92414L0 7.81897L0.0068 8.14828C0.0153 8.45345 0.017 8.48793 0.0595 8.6431C0.2074 9.19138 0.5644 9.58276 1.0353 9.71035C1.1526 9.7431 1.1985 9.74483 1.6898 9.75173L2.2151 9.75862V11.3034C2.2151 12.2362 2.21 12.9241 2.2015 13.0414C2.193 13.1483 2.1658 13.3483 2.142 13.4879C2.0315 14.131 1.8326 14.6155 1.547 14.9293L1.4892 14.9931H4.3639C6.0826 14.9931 7.3678 14.9862 7.5565 14.9776C7.888 14.9603 8.6275 14.8862 8.7941 14.85C8.8468 14.8397 8.9454 14.8241 9.01 14.8138C9.1477 14.7931 9.3755 14.7448 9.7036 14.6603C10.166 14.5431 10.5876 14.3966 11.0007 14.2103C11.1299 14.1517 11.5005 13.9603 11.5991 13.9C11.6518 13.869 11.7147 13.831 11.7385 13.819C11.8048 13.7828 11.9153 13.7103 12.0768 13.5931C12.1567 13.5345 12.2366 13.4776 12.2536 13.4655C12.325 13.4172 12.5715 13.2086 12.6837 13.1034C13.1104 12.7052 13.4674 12.2621 13.7445 11.7879C13.7836 11.719 13.8346 11.6328 13.8567 11.5966C13.9128 11.5 14.144 11.0172 14.1661 10.9448C14.1763 10.9121 14.1899 10.8776 14.1967 10.8707C14.2409 10.8121 14.4959 9.99828 14.5265 9.82069C14.5367 9.76379 14.5418 9.75517 14.5843 9.74655C14.6115 9.74138 15.0076 9.74138 15.4649 9.74483C16.3795 9.75173 16.3795 9.75173 16.5818 9.84655C16.6957 9.9 16.7297 9.92414 16.8555 10.0397C17.0204 10.1897 17.0051 10.2138 16.9949 9.83793C16.9881 9.61724 16.9796 9.48104 16.9643 9.42586C16.9065 9.21379 16.8929 9.16897 16.8419 9.06207C16.6753 8.6931 16.3965 8.42931 16.0395 8.30345L15.9001 8.25173L15.3323 8.24483L14.7662 8.23621L14.773 8.03448C14.7798 7.76897 14.7798 7.2431 14.7713 6.97241L14.7645 6.75517L15.5227 6.75172C16.1721 6.74828 16.2928 6.75173 16.3642 6.77069C16.5784 6.83104 16.7229 6.91379 16.8997 7.07759L16.9983 7.17069V6.91552C16.9983 6.61207 16.983 6.47759 16.9218 6.27759C16.8011 5.87241 16.5631 5.57069 16.2231 5.38448C16.0021 5.26379 15.9885 5.26034 15.2286 5.25517C14.7832 5.25172 14.5503 5.24483 14.5384 5.23448C14.5282 5.22414 14.5197 5.2069 14.5197 5.1931C14.5197 5.17931 14.4942 5.07069 14.4602 4.95345C14.0624 3.52759 13.3195 2.39483 12.2332 1.55517C12.0853 1.43966 11.7232 1.19655 11.577 1.11379C11.5209 1.08103 11.4597 1.04655 11.4444 1.03621C11.373 0.996552 10.9633 0.793104 10.8613 0.75C10.8001 0.722414 10.7202 0.687931 10.6845 0.674138C10.0844 0.410345 9.078 0.160345 8.3096 0.0827586C8.1838 0.0706897 8.0172 0.0517241 7.9407 0.0448276C7.5939 0.00517241 7.1128 0 4.3809 0C2.0723 0 1.4926 0.00517241 1.5011 0.0172414ZM7.123 0.763793C7.6976 0.798276 8.0512 0.843104 8.4643 0.944828C9.7257 1.24828 10.6131 1.88966 11.2574 2.96207C11.3169 3.06207 11.5685 3.58276 11.6059 3.68793C11.7844 4.17586 11.8711 4.46552 11.9476 4.84828C11.9663 4.94138 11.9918 5.06552 12.0037 5.12414C12.0156 5.18104 12.0207 5.23448 12.0156 5.23966C12.0071 5.24655 10.3003 5.25 8.2195 5.24828L4.437 5.24483L4.4319 3.02931C4.4302 1.81207 4.4319 0.8 4.437 0.781035L4.4438 0.748276H5.6525C6.3155 0.748276 6.9785 0.755172 7.123 0.763793ZM12.1805 6.80345C12.1924 6.87759 12.1924 8.13621 12.1805 8.19828L12.1703 8.24483L8.3028 8.24138L4.437 8.23621L4.4336 7.50517C4.4302 7.10345 4.4336 6.76897 4.437 6.76207C4.4421 6.75345 6.0894 6.74828 8.3079 6.74828H12.1703L12.1805 6.80345ZM12.0071 9.76379C12.0156 9.78966 11.9748 10.0017 11.8915 10.3466C11.7963 10.7345 11.6671 11.1259 11.5362 11.4155C11.4716 11.5638 11.3101 11.8845 11.271 11.9448C11.2523 11.9724 11.1979 12.0603 11.1503 12.1379C10.8443 12.6241 10.4074 13.0672 9.9093 13.3948C9.7274 13.5121 9.3534 13.7121 9.2531 13.7431C9.2327 13.7483 9.2106 13.7586 9.2021 13.7655C9.1902 13.7759 9.0355 13.8345 8.8553 13.9C8.5238 14.019 7.8931 14.1483 7.3865 14.2017C7.0584 14.2345 7.0057 14.2362 5.7426 14.2362H4.4353V12V9.76207L8.1906 9.75517C10.2561 9.75173 11.9578 9.74655 11.9714 9.7431C11.9867 9.74138 12.002 9.75173 12.0071 9.76379Z" fill="currentColor" />
                  </svg>
                  <span className="font-inter font-semibold text-[16px] leading-[100%] tracking-[0%] text-[#6E6E6E]">{orderData.orderDetails.orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 - Delivery Address */}
          <div className="bg-[#F0EBE3] border border-[#C2B280] p-4 lg:p-5 mb-4 lg:mb-0">
            <h2 className="font-orbitron font-bold text-sm uppercase tracking-wider text-black mb-4">
              Delivery Address <span className="text-[#666] font-normal normal-case">({orderData.deliveryAddress.type})</span>
            </h2>
            
            <div className="space-y-2">
              <p className="font-inter font-semibold text-[16px] leading-[100%] tracking-[0%] text-[#6E6E6E]">{orderData.deliveryAddress.name}</p>
              <p className="font-inter font-normal text-[14px] leading-[100%] tracking-[0%] text-[#666]">{orderData.deliveryAddress.address}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#666]">{orderData.deliveryAddress.phone}</span>
                {orderData.deliveryAddress.verified && (
                  <span className="flex items-center gap-1 text-xs text-[#009900]">
                    <Check size={12} /> Verified
                  </span>
                )}
              </div>
            </div>

            {/* Delivery Options */}
            <div className="flex flex-wrap gap-2 mt-4">
              {orderData.deliveryOptions.map((option, index) => (
                <span 
                  key={index}
                  className="px-3 py-1.5 font-inter font-normal text-[14px] leading-[100%] tracking-[0%] text-[#666] border border-[#C2B280] bg-transparent"
                >
                  {option}
                </span>
              ))}
            </div>
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
              <button 
                onClick={() => router.push(`/orders/refund/${orderId}`)}
                className="text-sm text-[#D35400] underline font-medium"
              >
                Refund Details
              </button>
            </div>
            <div className="inline-flex items-center gap-2 bg-[#EBE3D6] p-3">
              <Image src="/order/paysvg3.svg" alt={orderData.paymentMethod} width={80} height={32} />
              <span className="text-sm text-[#666]">{orderData.paymentMethod}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Summary */}
      <div className="mb-6 lg:mb-8 px-3 py-4 lg:px-5 lg:py-5 bg-[#EBE3D6] border border-[#EBE3D6] overflow-hidden">
        <h2 className="font-orbitron font-bold text-xs lg:text-sm uppercase tracking-wider text-black mb-3 lg:mb-4">
          Items Summary
        </h2>

        <div className="space-y-3 lg:space-y-4">
          {completedOrders.map((order, index) => (
            <div key={index} className="bg-[#F0EBE3] border border-[#C2B280] overflow-hidden">
              {/* Order Header */}
              <div className="px-3 lg:px-5 py-3 lg:py-4 flex items-center gap-2 lg:gap-3">
                {order.status === "delivered" ? (
                  <div className="w-5 h-5 lg:w-6 lg:h-6 bg-[#27AE60] rounded flex items-center justify-center flex-shrink-0">
                    <svg width="12" height="8" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="lg:w-[14px] lg:h-[10px]">
                      <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                ) : (
                  <div className="w-5 h-5 lg:w-6 lg:h-6 bg-[#C2B280] rounded flex items-center justify-center flex-shrink-0">
                    <Image src="/order/Frame12.png" alt="Cancelled" width={12} height={12} className="lg:w-[14px] lg:h-[14px]" />
                  </div>
                )}
                <p className="text-sm text-black">{order.statusText}</p>
              </div>
              
              {/* Divider */}
              <div className="mx-3 lg:mx-5 border-b border-[#C2B280]"></div>

              {/* Order Content */}
              <div className="p-3 lg:p-5 flex items-start gap-3 lg:gap-5">
                <img
                  src={order.product.image}
                  alt={order.product.name}
                  className="w-16 h-16 lg:w-20 lg:h-20 object-contain flex-shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col">
                  <h3 className="text-xs lg:text-sm font-medium text-black mb-1 line-clamp-2">
                    {order.product.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <svg width="12" height="10" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="lg:w-[14px] lg:h-[12px]">
                      <path d="M1.5011 0.0172414C1.5079 0.0275862 1.5453 0.0741379 1.581 0.118966C1.8411 0.432759 2.0366 0.943104 2.142 1.58621C2.2117 2.00862 2.2151 2.14138 2.2151 3.75172V5.25172H1.5045C0.8551 5.25172 0.7803 5.24828 0.6528 5.22241C0.4522 5.17931 0.2448 5.06379 0.1054 4.91552C-0.0051 4.79655 -0.0017 4.78966 0.0051 5.15C0.0136 5.44828 0.017 5.48103 0.0595 5.6431C0.1275 5.9 0.221 6.09138 0.3621 6.26207C0.5542 6.49655 0.7497 6.62759 1.0285 6.71552C1.088 6.73276 1.2138 6.73966 1.6592 6.7431L2.2151 6.75172V7.49828V8.24655L1.4314 8.24138L0.6443 8.23621L0.5083 8.18104C0.3468 8.11552 0.2737 8.06724 0.1156 7.92414L0 7.81897L0.0068 8.14828C0.0153 8.45345 0.017 8.48793 0.0595 8.6431C0.2074 9.19138 0.5644 9.58276 1.0353 9.71035C1.1526 9.7431 1.1985 9.74483 1.6898 9.75173L2.2151 9.75862V11.3034C2.2151 12.2362 2.21 12.9241 2.2015 13.0414C2.193 13.1483 2.1658 13.3483 2.142 13.4879C2.0315 14.131 1.8326 14.6155 1.547 14.9293L1.4892 14.9931H4.3639C6.0826 14.9931 7.3678 14.9862 7.5565 14.9776C7.888 14.9603 8.6275 14.8862 8.7941 14.85C8.8468 14.8397 8.9454 14.8241 9.01 14.8138C9.1477 14.7931 9.3755 14.7448 9.7036 14.6603C10.166 14.5431 10.5876 14.3966 11.0007 14.2103C11.1299 14.1517 11.5005 13.9603 11.5991 13.9C11.6518 13.869 11.7147 13.831 11.7385 13.819C11.8048 13.7828 11.9153 13.7103 12.0768 13.5931C12.1567 13.5345 12.2366 13.4776 12.2536 13.4655C12.325 13.4172 12.5715 13.2086 12.6837 13.1034C13.1104 12.7052 13.4674 12.2621 13.7445 11.7879C13.7836 11.719 13.8346 11.6328 13.8567 11.5966C13.9128 11.5 14.144 11.0172 14.1661 10.9448C14.1763 10.9121 14.1899 10.8776 14.1967 10.8707C14.2409 10.8121 14.4959 9.99828 14.5265 9.82069C14.5367 9.76379 14.5418 9.75517 14.5843 9.74655C14.6115 9.74138 15.0076 9.74138 15.4649 9.74483C16.3795 9.75173 16.3795 9.75173 16.5818 9.84655C16.6957 9.9 16.7297 9.92414 16.8555 10.0397C17.0204 10.1897 17.0051 10.2138 16.9949 9.83793C16.9881 9.61724 16.9796 9.48104 16.9643 9.42586C16.9065 9.21379 16.8929 9.16897 16.8419 9.06207C16.6753 8.6931 16.3965 8.42931 16.0395 8.30345L15.9001 8.25173L15.3323 8.24483L14.7662 8.23621L14.773 8.03448C14.7798 7.76897 14.7798 7.2431 14.7713 6.97241L14.7645 6.75517L15.5227 6.75172C16.1721 6.74828 16.2928 6.75173 16.3642 6.77069C16.5784 6.83104 16.7229 6.91379 16.8997 7.07759L16.9983 7.17069V6.91552C16.9983 6.61207 16.983 6.47759 16.9218 6.27759C16.8011 5.87241 16.5631 5.57069 16.2231 5.38448C16.0021 5.26379 15.9885 5.26034 15.2286 5.25517C14.7832 5.25172 14.5503 5.24483 14.5384 5.23448C14.5282 5.22414 14.5197 5.2069 14.5197 5.1931C14.5197 5.17931 14.4942 5.07069 14.4602 4.95345C14.0624 3.52759 13.3195 2.39483 12.2332 1.55517C12.0853 1.43966 11.7232 1.19655 11.577 1.11379C11.5209 1.08103 11.4597 1.04655 11.4444 1.03621C11.373 0.996552 10.9633 0.793104 10.8613 0.75C10.8001 0.722414 10.7202 0.687931 10.6845 0.674138C10.0844 0.410345 9.078 0.160345 8.3096 0.0827586C8.1838 0.0706897 8.0172 0.0517241 7.9407 0.0448276C7.5939 0.00517241 7.1128 0 4.3809 0C2.0723 0 1.4926 0.00517241 1.5011 0.0172414ZM7.123 0.763793C7.6976 0.798276 8.0512 0.843104 8.4643 0.944828C9.7257 1.24828 10.6131 1.88966 11.2574 2.96207C11.3169 3.06207 11.5685 3.58276 11.6059 3.68793C11.7844 4.17586 11.8711 4.46552 11.9476 4.84828C11.9663 4.94138 11.9918 5.06552 12.0037 5.12414C12.0156 5.18104 12.0207 5.23448 12.0156 5.23966C12.0071 5.24655 10.3003 5.25 8.2195 5.24828L4.437 5.24483L4.4319 3.02931C4.4302 1.81207 4.4319 0.8 4.437 0.781035L4.4438 0.748276H5.6525C6.3155 0.748276 6.9785 0.755172 7.123 0.763793ZM12.1805 6.80345C12.1924 6.87759 12.1924 8.13621 12.1805 8.19828L12.1703 8.24483L8.3028 8.24138L4.437 8.23621L4.4336 7.50517C4.4302 7.10345 4.4336 6.76897 4.437 6.76207C4.4421 6.75345 6.0894 6.74828 8.3079 6.74828H12.1703L12.1805 6.80345ZM12.0071 9.76379C12.0156 9.78966 11.9748 10.0017 11.8915 10.3466C11.7963 10.7345 11.6671 11.1259 11.5362 11.4155C11.4716 11.5638 11.3101 11.8845 11.271 11.9448C11.2523 11.9724 11.1979 12.0603 11.1503 12.1379C10.8443 12.6241 10.4074 13.0672 9.9093 13.3948C9.7274 13.5121 9.3534 13.7121 9.2531 13.7431C9.2327 13.7483 9.2106 13.7586 9.2021 13.7655C9.1902 13.7759 9.0355 13.8345 8.8553 13.9C8.5238 14.019 7.8931 14.1483 7.3865 14.2017C7.0584 14.2345 7.0057 14.2362 5.7426 14.2362H4.4353V12V9.76207L8.1906 9.75517C10.2561 9.75173 11.9578 9.74655 11.9714 9.7431C11.9867 9.74138 12.002 9.75173 12.0071 9.76379Z" fill="currentColor" />
                    </svg>
                    <span className="font-semibold text-xs lg:text-sm text-black">
                      {order.product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] lg:text-xs text-[#666] flex-shrink-0 self-end">Order ID: #{order.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    
    </div>
  );
}

