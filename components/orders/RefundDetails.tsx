"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ChevronDown, ChevronUp, Info } from "lucide-react";
import { OrderInfoBar, CurrencyIcon, ItemCard, ClipPathButton } from "./shared";
import RefundBreakupModal from "../modal/RefundBreakupModal";

// Mock refund data
const refundData = {
  status: "Triggered Refunds",
  statusMessage: "Money sent, reaching your account soon.",
  amount: 679.00,
  paymentMethod: "Tamara",
  triggerDate: "Monday, 3rd Nov",
  estimatedCreditDate: "Monday, 10th Nov",
  orderTotal: 679.00,
  refundedAmount: 679.00,
  helpInfo: {
    title: "NEED FURTHER SUPPORT?",
    description: "Check our Refund FAQ for details on refund policies, amount calculations, processing timelines, and payment methods.",
  },
  refundMessage: {
    title: "Haven't received your refund yet?",
    description: "Your refund was processed and sent to your Tamara account by Armored Mart on",
    highlightDate: "Monday, 3rd Nov",
    additionalInfo: "Banks usually take 5-7 business days to credit the amount.",
    contactInfo: "If you don't see it by",
    contactDate: "Monday, 10th Nov",
    contactAction: "please contact Tamara for assistance.",
  },
  items: [
    {
      id: 1,
      name: "DFC® - 4000 HybriDynamic Hybrid Rear Brake Pads",
      price: 679.0,
      image: "/order/refundpop1.svg",
      orderId: "AMZ-12345678-987654",
    },
    {
      id: 2,
      name: "Duralast 45084DL High-Performance Disc Brake Rotor",
      price: 475.0,
      image: "/order/refundpop2.svg",
      orderId: "AMZ-12345678-987655",
    },
    {
      id: 3,
      name: "Duralast Heavy-Duty Disc Brake Rotor 54094DL",
      price: 1625.0,
      image: "/order/refundpop3.svg",
      orderId: "AMZ-12345678-987656",
    },
  ],
};

interface RefundDetailsProps {
  orderId: string;
}

export default function RefundDetails({ orderId }: RefundDetailsProps) {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(true);
  const [expandedInfo, setExpandedInfo] = useState(true);
  const [showRefundBreakup, setShowRefundBreakup] = useState(false);

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[#6E6E6E]  hover:text-black transition-colors mb-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[18px] leading-[18px]">Back to Order Details</span>
        </button>
        <h1 className="font-orbitron font-black text-xl lg:text-[32px] uppercase tracking-wide text-black">
          Refund Details
        </h1>
        <p className="text-sm text-[#6E6E6E] mt-0 text-[18px]">Track your refund and view the next steps</p>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Triggered Refunds Status & Refund Amount Card Combined */}
          <div className="bg-[#EBE3D6] p-4 lg:p-5">
            {/* Triggered Refunds Info */}
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-inter font-semibold text-[18px] leading-[100%] tracking-[0%] text-[#6E6E6E] mb-2">{refundData.status}</h2>
              <button className="hover:opacity-80 transition-opacity">
                <Image src="/order/Vector.svg" alt="Info" width={20} height={20} />
              </button>
            </div>
            <p className="font-inter font-normal text-[16px] leading-[100%] tracking-[0%] text-[#666]">{refundData.statusMessage}</p>

            {/* Separator Line */}
            <div className="border-t border-[#C2B280] my-4 -mx-4 lg:-mx-5"></div>

            {/* Refund Amount */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CurrencyIcon className="w-4 h-4" />
                  <span className="font-semibold text-lg text-black">{refundData.amount.toFixed(2)}</span>
                </div>
                <span className="font-inter font-semibold text-[16px] leading-[100%] tracking-[0%] text-[#666] w-[160px] block">Processed to {refundData.paymentMethod}</span>
              </div>
              <Image src="/order/paysvg3.svg" alt={refundData.paymentMethod} width={80} height={32} />
            </div>

            {/* Dates */}
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="font-inter font-[400] text-[14px] leading-[100%] tracking-[0%] text-[#666] mb-2">Trigger date</p>
                <p className="font-inter font-semibold text-[16px] leading-[100%] tracking-[0%] text-black">{refundData.triggerDate}</p>
              </div>
              <div className="text-right">
                <p className="font-inter font-normal text-[14px] leading-[100%] tracking-[0%] text-[#666] mb-2" >Est. Credit Date</p>
                <p className="font-inter font-semibold text-[16px] leading-[100%] tracking-[0%] text-black">{refundData.estimatedCreditDate}</p>
              </div>
            </div>

            {/* Refund Info Expandable - Box */}
            <div className="bg-[#F0EBE3] border border-[#C2B280] p-4 mt-6">
              <button
                onClick={() => setExpandedInfo(!expandedInfo)}
                className="w-full flex items-start justify-between"
              >
                <div className="flex items-start gap-3">
                  <Image src="/order/Vector.svg" alt="Info" width={20} height={20} className="flex-shrink-0 mt-0.5" />
                  <span className="font-medium text-black text-left">{refundData.refundMessage.title}</span>
                </div>
                {expandedInfo ? <ChevronUp className="w-5 h-5 text-[#666]" /> : <ChevronDown className="w-5 h-5 text-[#666]" />}
              </button>

              {expandedInfo && (
                <div className="mt-4 pl-8">
                  <p className="text-sm text-[#666]">
                    {refundData.refundMessage.description}{" "}
                    <span className="text-[#D35400] font-medium">{refundData.refundMessage.highlightDate}</span>.{" "}
                    {refundData.refundMessage.additionalInfo}
                  </p>
                  <p className="text-sm text-[#666] mt-2">
                    {refundData.refundMessage.contactInfo}{" "}
                    <span className="text-[#D35400] font-medium">{refundData.refundMessage.contactDate}</span>,{" "}
                    {refundData.refundMessage.contactAction}
                  </p>

                  {/* Contact Button */}
                  <div className="mt-4 mb-4">
                    <button 
                      onClick={() => setShowRefundBreakup(true)}
                      className="bg-[#D35400] hover:bg-[#39482C] text-white clip-path-supplier-refund flex items-center justify-center w-full h-[45px] cursor-pointer"
                    >
                      <span className="font-black text-[20px] font-orbitron uppercase">CONTACT {refundData.paymentMethod.toUpperCase()}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Separator Line */}
            <div className="border-t border-[#C2B280] my-6 -mx-4 lg:-mx-5"></div>

            {/* Triggered Items */}
            <h3 className="font-orbitron font-bold text-sm uppercase tracking-wider text-black mb-4">
              Triggered Items <span className="text-[#666] font-normal">({refundData.items.length} items)</span>
            </h3>
            <div className="bg-[#F0EBE3] p-3 flex items-center justify-between">
              <div className="flex gap-3 overflow-x-auto">
                {refundData.items.map((item) => (
                  <div key={item.id} className="w-16 h-16 flex-shrink-0 bg-white border border-[#C2B280] p-1">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
              <button className="w-8 h-16 flex-shrink-0 flex items-center justify-center text-[#666] hover:text-black ml-3">
                <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="mt-4 lg:mt-0 space-y-4">
          {/* Order Total */}
          <div className="bg-[#EBE3D6] p-4 lg:p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-inter font-semibold text-[16px] leading-[100%] tracking-[0%] text-black">Order Total</span>
              <div className="flex items-center gap-1">
                <CurrencyIcon className="w-3 h-3" />
                <span className="font-inter font-semibold text-[16px] leading-[100%] tracking-[0%] text-black">{refundData.orderTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-[#C2B280]">
              <div className="flex items-center gap-2">
                <Image src="/order/paysvg3.svg" alt={refundData.paymentMethod} width={60} height={24} />
                <span className="text-sm text-[#666]">{refundData.paymentMethod}</span>
              </div>
              <div className="flex items-center gap-1">
                <CurrencyIcon className="w-3 h-3 text-[#666]" />
                <span className="text-sm text-[#666]">{refundData.orderTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Refunded Amount */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#C2B280]">
              <span className="font-inter font-semibold text-[16px] leading-[100%] tracking-[0%] text-black">Refunded Amount</span>
              <div className="flex items-center gap-1">
                <CurrencyIcon className="w-3 h-3" />
                <span className="font-inter font-semibold text-[16px] leading-[100%] tracking-[0%] text-black">{refundData.refundedAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Hide/Show Details */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 text-sm text-[#D35400] mt-3 hover:underline"
            >
              {showDetails ? "Hide" : "Show"} Details
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Need Further Support */}
          <div className="bg-[#EBE3D6] p-4 lg:p-5">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <h3 className="font-orbitron font-bold text-xs uppercase tracking-wider text-black mb-2">
                  {refundData.helpInfo.title}
                </h3>
                <p className="font-inter text-[13px] leading-[100%] tracking-[0%] text-[#666]">
                  {refundData.helpInfo.description}
                </p>
              </div>
              <ChevronDown className="w-5 h-5 text-[#666] rotate-[-90deg] flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Refund Breakup Modal */}
      {showRefundBreakup && (
        <RefundBreakupModal
          onClose={() => setShowRefundBreakup(false)}
          items={refundData.items}
          totalRefundedAmount={refundData.refundedAmount}
        />
      )}
    </div>
  );
}

