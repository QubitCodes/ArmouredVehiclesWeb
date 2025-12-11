"use client";

import { useEffect, useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import Image from "next/image";

interface OrdersSupportPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const supportOptions = [
  {
    id: 1,
    title: "Why was my item cancelled?",
    subtitle: "What should I do next?",
    icon: "/order/needhelpsvg.svg",
    detailTitle: "CANCELLATION",
    detailHeading: "Why was my item canceled?",
    detailDescription: "We had to cancel your order because payment confirmation was not received.",
    detailAction: "Please place a new order to purchase this item.",
    relatedQuestions: [
      {
        title: "How can I track my refund?",
        subtitle: "How long will my refund take?",
      },
    ],
  },
  {
    id: 2,
    title: "How can I track my refund?",
    subtitle: "How long will my refund take?",
    icon: "/order/needhelpsvg.svg",
    detailTitle: "REFUND",
    detailHeading: "How can I track my refund?",
    detailDescription: "You can track your refund status from the Orders page by clicking on Track Refund.",
    detailAction: "Refunds typically take 5-7 business days to reflect in your account.",
    relatedQuestions: [
      {
        title: "Why was my item cancelled?",
        subtitle: "What should I do next?",
      },
    ],
  },
];

export default function OrdersSupportPanel({ isOpen, onClose }: OrdersSupportPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [selectedOption, setSelectedOption] = useState<typeof supportOptions[0] | null>(null);
  const [feedbackSelected, setFeedbackSelected] = useState<string | null>(null);
  const [isFeedbackExpanded, setIsFeedbackExpanded] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setSelectedOption(null);
        setFeedbackSelected(null);
        setIsFeedbackExpanded(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleBack = () => {
    setSelectedOption(null);
    setFeedbackSelected(null);
    setIsFeedbackExpanded(true);
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      ></div>

      {/* Side Panel */}
      <div 
        className={`relative bg-[#EBE3D6] w-full max-w-[450px] h-full shadow-2xl transform transition-transform duration-300 ease-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {!selectedOption ? (
          <>
            {/* Main View Header */}
            <div className="relative flex items-center justify-center px-6 py-5">
              <h2 className="font-orbitron font-bold text-[18px] uppercase tracking-wide text-black">
                Orders Support
              </h2>
              <button
                className="absolute right-6 text-[#666] hover:text-black transition-colors p-1"
                onClick={onClose}
              >
                <X size={24} />
              </button>
            </div>

            {/* Main View Content */}
            <div className="overflow-y-auto h-[calc(100%-80px)] px-6">
              {supportOptions.map((option) => (
                <div key={option.id}>
                  <button
                    onClick={() => setSelectedOption(option)}
                    className="w-full py-4 flex items-start gap-4 hover:bg-[#E0D9CC] transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-[#D9D2C5] rounded-full flex items-center justify-center flex-shrink-0">
                      <Image
                        src={option.icon}
                        alt={option.title}
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-inter font-semibold text-[14px] text-black mb-1">
                        {option.title}
                      </h3>
                      <p className="font-inter font-normal text-[12px] text-[#666]">
                        {option.subtitle}
                      </p>
                    </div>
                  </button>
                  <div className="border-b border-[#C2B280]"></div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Detail View Header */}
            <div className="flex items-center justify-between px-6 py-5">
              <button
                className="text-[#666] hover:text-black transition-colors"
                onClick={handleBack}
              >
                <ArrowLeft size={24} />
              </button>
              <h2 className="font-orbitron font-bold text-[18px] uppercase tracking-wide text-black">
                {selectedOption.detailTitle}
              </h2>
              <button
                className="text-[#666] hover:text-black transition-colors"
                onClick={onClose}
              >
                <X size={24} />
              </button>
            </div>

            {/* Detail View Content */}
            <div className="overflow-y-auto h-[calc(100%-80px)] px-6">
              {/* Main Question */}
              <div className="py-4">
                <h3 className="font-inter font-semibold text-[16px] text-black mb-3">
                  {selectedOption.detailHeading}
                </h3>
                <p className="font-inter font-normal text-[14px] text-[#666] mb-2">
                  {selectedOption.detailDescription}
                </p>
                <p className="font-inter font-normal text-[14px] text-[#666]">
                  {selectedOption.detailAction}
                </p>
              </div>

              {/* Related Questions */}
              <div className="py-4">
                <h4 className="font-orbitron font-bold text-[14px] uppercase tracking-wide text-black mb-4">
                  Related Questions
                </h4>
                {selectedOption.relatedQuestions.map((question, index) => (
                  <div key={index} className="flex items-start gap-3 py-3">
                    <Image
                      src="/order/needhelpsvg.svg"
                      alt="Help"
                      width={20}
                      height={20}
                      className="flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="font-inter font-semibold text-[14px] text-black">
                        {question.title}
                      </p>
                      <p className="font-inter font-normal text-[12px] text-[#666]">
                        {question.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Feedback Section */}
              <div className="py-4 px-4 mt-4 bg-[#F0EBE3] border border-[#C2B280]">
                <button 
                  className="w-full flex flex-col"
                  onClick={() => setIsFeedbackExpanded(!isFeedbackExpanded)}
                >
                  <div className="flex items-center justify-between w-full">
                    <p className="font-inter font-semibold text-[14px] text-black">
                      How helpful is our Help Center?
                    </p>
                    <svg 
                      width="12" 
                      height="8" 
                      viewBox="0 0 12 8" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className={`transition-transform duration-200 ${isFeedbackExpanded ? 'rotate-180' : ''}`}
                    >
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="font-inter font-normal text-[12px] text-[#666] mt-1 text-left">
                    Please select one:
                  </p>
                </button>
                {isFeedbackExpanded && (
                  <div className="space-y-3 mt-3">
                    {["Amazing!", "Met expectations", "Needs improvement"].map((option) => (
                      <label
                        key={option}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-inter font-normal text-[14px] text-black">
                          {option}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            feedbackSelected === option
                              ? 'border-[#C2B280] bg-[#C2B280]'
                              : 'border-[#C2B280]'
                          }`}
                          onClick={() => setFeedbackSelected(option)}
                        >
                          {feedbackSelected === option && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
