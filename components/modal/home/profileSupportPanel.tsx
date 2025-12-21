
import React, { useEffect, useState } from "react";
import { X, ArrowLeft, Package, RotateCcw, ShieldCheck, Banknote, CreditCard, UserCircle } from "lucide-react";

interface OrdersSupportPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const supportOptions = [
  {
    id: 1,
    title: "Orders",
    subtitle: "Manage, track, and modify your orders",
    icon: "/order/Vector.png",
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
    title: "Returns",
    subtitle: "Manage and track your product return requests.",
    icon: "/order/Frame1.png",
    detailTitle: "RETURNS",
    detailHeading: "How do I return a product?",
    detailDescription: "You can initiate a return within 30 days of purchase through your account portal.",
    detailAction: "Follow the steps in the Returns section to generate a shipping label.",
    relatedQuestions: [
      {
        title: "Return Policy",
        subtitle: "Check our return eligibility criteria.",
      },
    ],
  },
  {
    id: 3,
    title: "Warranty",
    subtitle: "Submit and monitor warranty claims for eligible items.",
    icon: "/order/Frame2.png",
    detailTitle: "WARRANTY",
    detailHeading: "How to claim warranty?",
    detailDescription: "Warranty claims are processed after verification of purchase and serial number.",
    detailAction: "Contact our technical team with your serial number.",
    relatedQuestions: [
      {
        title: "Warranty Duration",
        subtitle: "Check your item's coverage period.",
      },
    ],
  },
  {
    id: 4,
    title: "Refunds",
    subtitle: "View refund status and payment details.",
    icon: "/order/refund.svg",
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
  {
    id: 5,
    title: "Payments",
    subtitle: "Manage saved cards, cashback, and payment methods",
    icon: "/order/payment11.svg",
    detailTitle: "PAYMENTS",
    detailHeading: "Updating payment methods",
    detailDescription: "Securely add or remove payment methods from your profile settings.",
    detailAction: "Navigate to 'Payments' in your profile to manage your cards.",
    relatedQuestions: [
      {
        title: "Security Settings",
        subtitle: "How we protect your data.",
      },
    ],
  },
  {
    id: 6,
    title: "My Profile",
    subtitle: "Edit your personal details and customize your experience",
    icon: "/order/myprofile.svg",
    detailTitle: "PROFILE",
    detailHeading: "Managing your account",
    detailDescription: "Keep your contact information and preferences up to date.",
    detailAction: "Visit your account settings to change password or update details.",
    relatedQuestions: [
      {
        title: "Account Security",
        subtitle: "Enable 2FA for extra protection.",
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
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      ></div>

      {/* Side Panel */}
      <div 
        className={`relative bg-[#EBE3D6] w-full max-w-[450px] h-full shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {!selectedOption ? (
          <>
            {/* Main View Header */}
            <div className="px-8 pt-12 pb-6 relative">
              <button
                className="absolute right-6 top-6 text-black/40 hover:text-black transition-colors"
                onClick={onClose}
              >
                <X size={22} strokeWidth={1.5} />
              </button>
              
              <div className="space-y-1">
                <p className="font-inter font-medium text-[14px] text-black opacity-60">
                  Hello John,
                </p>
                <h2 className="font-orbitron font-bold text-[24px] uppercase tracking-wide text-black">
                  HOW CAN WE HELP?
                </h2>
              </div>
            </div>

            {/* Main View Content */}
            <div className="flex-1 overflow-y-auto px-6 support-scrollbar">
              <ul className="list-none m-0 p-0 border-t border-[#C2B280]/30">
                {supportOptions.map((option) => (
                  <li key={option.id} className="border-b border-[#C2B280]/30">
                    <button
                      onClick={() => setSelectedOption(option)}
                      className="w-full py-5 flex items-start gap-4 hover:bg-black/5 transition-all text-left group rounded-lg px-2 -mx-2"
                    >
                      <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 transition-colors">
                      <img 
                          src={option.icon} 
                          alt="" 
                          className="w-5 h-5 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://www.svgrepo.com/show/522206/question-mark.svg";
                          }}
                        />
                        {/* {option.icon} */}
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <h3 className="font-inter font-bold text-[15px] text-black">
                          {option.title}
                        </h3>
                        <p className="font-inter font-normal text-[13px] text-black/60 leading-tight">
                          {option.subtitle}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Detail View Header */}
            <div className="flex items-center justify-between px-6 pt-10 pb-6 border-b border-[#C2B280]/30">
              <button
                className="text-black/40 hover:text-black transition-colors p-1"
                onClick={handleBack}
              >
                <ArrowLeft size={24} />
              </button>
              <h2 className="font-orbitron font-bold text-[18px] uppercase tracking-[0.1em] text-black">
                {selectedOption.detailTitle}
              </h2>
              <button
                className="text-black/40 hover:text-black transition-colors p-1"
                onClick={onClose}
              >
                <X size={24} />
              </button>
            </div>

            {/* Detail View Content */}
            <div className="flex-1 overflow-y-auto px-8 support-scrollbar pb-10">
              {/* Main Question */}
              <div className="py-8">
                <h3 className="font-inter font-bold text-[18px] text-black mb-4">
                  {selectedOption.detailHeading}
                </h3>
                <div className="space-y-4">
                  <p className="font-inter font-normal text-[15px] text-black/70 leading-relaxed">
                    {selectedOption.detailDescription}
                  </p>
                  <div className="p-4 bg-[#D35400]/5 border-l-4 border-[#D35400] rounded-r-md">
                    <p className="font-inter font-semibold text-[15px] text-[#D35400]">
                      {selectedOption.detailAction}
                    </p>
                  </div>
                </div>
              </div>

              {/* Related Questions */}
              <div className="py-8 border-t border-[#C2B280]/20">
                <h4 className="font-orbitron font-bold text-[14px] uppercase tracking-widest text-black/40 mb-6">
                  Related Questions
                </h4>
                <div className="space-y-1">
                  {selectedOption.relatedQuestions.map((question, index) => (
                    <div key={index} className="border-b border-[#C2B280]/20 last:border-0">
                      <div className="flex items-start gap-4 py-4 cursor-pointer hover:bg-black/5 px-3 -mx-3 rounded-lg transition-all group">
                        <Package size={20} className="text-black/40 group-hover:text-black transition-colors mt-0.5" />
                        <div>
                          <p className="font-inter font-bold text-[15px] text-black">
                            {question.title}
                          </p>
                          <p className="font-inter font-normal text-[13px] text-black/50">
                            {question.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Section */}
              <div className="mt-4 bg-[#F0EBE3] border border-[#C2B280]/40 rounded-xl overflow-hidden shadow-sm">
                <button 
                  className="w-full p-5 flex flex-col items-start transition-colors hover:bg-black/[0.02]"
                  onClick={() => setIsFeedbackExpanded(!isFeedbackExpanded)}
                >
                  <div className="flex items-center justify-between w-full">
                    <p className="font-inter font-bold text-[15px] text-black">
                      How helpful is our Help Center?
                    </p>
                    <svg 
                      width="12" 
                      height="8" 
                      viewBox="0 0 12 8" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className={`transition-transform duration-300 ${isFeedbackExpanded ? 'rotate-180' : ''}`}
                    >
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="font-inter font-normal text-[13px] text-black/40 mt-1">
                    Please select one:
                  </p>
                </button>
                {isFeedbackExpanded && (
                  <div className="px-5 pb-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    {["Amazing!", "Met expectations", "Needs improvement"].map((option) => (
                      <div
                        key={option}
                        className="flex items-center justify-between cursor-pointer group py-1"
                        onClick={() => setFeedbackSelected(option)}
                      >
                        <span className={`font-inter text-[14px] transition-colors ${feedbackSelected === option ? 'text-black font-semibold' : 'text-black/60 group-hover:text-black'}`}>
                          {option}
                        </span>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            feedbackSelected === option
                              ? 'border-[#D35400] bg-[#D35400]'
                              : 'border-[#C2B280] group-hover:border-[#666]'
                          }`}
                        >
                          {feedbackSelected === option && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
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
