"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronDown } from "lucide-react";

const deleteReasons = [
  "I have another account",
  "I'm not satisfied with the service",
  "I found a better alternative",
  "Privacy concerns",
  "I don't use this account anymore",
  "Other",
];

export default function DeleteAccountModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState("");
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleDelete = () => {
    if (!agreedToTerms) {
      setShowError(true);
      return;
    }
    setShowError(false);
    // Handle account deletion logic here
    onClose();
    router.push("/delete-account-success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-[#EBE3D6] w-full max-w-[500px] shadow-lg animate-fadeIn overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-[#666] hover:text-black transition-colors z-10"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h2 className="font-orbitron font-bold text-[22px] uppercase text-black">
            Delete Account
          </h2>
        </div>

        {/* Content - Scrollable */}
        <div className="px-6 pb-6 space-y-5 overflow-y-auto flex-1 scrollbar-delete-modal">
          {/* Reason for Deleting */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2 uppercase">
              Reason for Deleting Account
            </label>
            <div className="relative">
              <button
                onClick={() => setShowReasonDropdown(!showReasonDropdown)}
                className="w-full bg-[#EBE3D6] border border-[#C2B280] px-4 py-3 flex items-center justify-between text-left"
              >
                <span className={`text-sm ${selectedReason ? "text-black" : "text-[#999]"}`}>
                  {selectedReason || "Select a reason"}
                </span>
                <ChevronDown 
                  size={18} 
                  className={`text-[#666] transition-transform ${showReasonDropdown ? "rotate-180" : ""}`} 
                />
              </button>

              {showReasonDropdown && (
                <div className="absolute top-full left-0 w-full bg-[#F0EBE3] border border-[#C2B280] border-t-0 z-10 max-h-[200px] overflow-y-auto scrollbar-delete-modal">
                  {deleteReasons.map((reason, index) => (
                    <button
                      key={reason}
                      onClick={() => {
                        setSelectedReason(reason);
                        setShowReasonDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-[#E3DDD0] transition-colors ${
                        index !== deleteReasons.length - 1 ? "border-b border-[#C2B280]" : ""
                      } ${
                        selectedReason === reason ? "bg-[#E3DDD0] text-black" : "text-[#666]"
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div>
            <h3 className="font-orbitron font-bold text-sm uppercase text-black mb-3">
              Please Read the Terms and Conditions Carefully
            </h3>
            <p className="text-xs text-[#666] mb-3 leading-relaxed">
              The terms and conditions set out herein apply to ArmoredMart and all related services. By checking the box &quot;I have read the terms and conditions&quot; and clicking &quot;Delete Your Account&quot;, you confirm that you have read, understood, and agreed to the following terms.
            </p>

            {/* Terms List */}
            <div className="bg-[#F0EBE3] border border-[#C2B280] p-4 max-h-[180px] overflow-y-auto scrollbar-delete-modal">
              <ol className="list-decimal list-inside space-y-3 text-xs text-[#666] leading-relaxed">
                <li>
                  Your account will be deactivated, and you will be logged out of all devices. All active sessions will expire, your password will be removed, and any linked phone numbers will also be disconnected from your account. Your marketing and notification preferences will be cleared, and any active ArmoredMart memberships or subscriptions will be cancelled, if applicable.
                </li>
                <li>
                  You can recover your account at any time during the 30-day grace period by logging in using the OTP sent to your registered email or phone number.
                </li>
                <li>
                  Once your deletion request is fully processed, you will no longer be able to log in using the same email address associated with the deleted account, and all related information—including but not limited to orders, returns, warranty claims, bank transfer records, account balance, and any ArmoredMart credits—will no longer be accessible. While the same email address can be used to create a new account, none of your previous data will be restored.
                </li>
                <li>
                  You will also stop receiving all transactional or promotional communication from ArmoredMart and its associated platforms.
                </li>
                <li>
                  We will retain only the data necessary to complete any pending orders, returns, warranty claims, or bank transfers, strictly to the extent required to finalize those transactions.
                </li>
              </ol>
            </div>
          </div>

          {/* Note */}
          <p className="text-xs text-[#666]">
            These changes may take 3-5 minutes to reflect across all devices.
          </p>

          {/* Checkbox */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <div
                className={`w-5 h-5 border flex items-center justify-center transition-colors flex-shrink-0 mt-0.5 ${
                  agreedToTerms
                    ? "bg-[#39482C] border-[#39482C]"
                    : showError
                    ? "bg-[#EBE3D6] border-[#D35400]"
                    : "bg-[#EBE3D6] border-[#C2B280]"
                }`}
                onClick={() => {
                  setAgreedToTerms(!agreedToTerms);
                  setShowError(false);
                }}
              >
                {agreedToTerms && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-black">I have read the terms and conditions</span>
            </label>
            {showError && (
              <p className="text-xs text-[#D35400] mt-2">
                Please accept the terms and conditions to continue.
              </p>
            )}
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="w-full bg-[#D35400] text-white font-orbitron font-bold text-[14px] uppercase py-4 hover:bg-[#B84700] transition-colors"
            style={{ clipPath: 'polygon(15px 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 15px 100%, 0 50%)' }}
          >
            Delete Your Account
          </button>
        </div>
      </div>
    </div>
  );
}

