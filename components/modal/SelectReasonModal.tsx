"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface SelectReasonModalProps {
  onClose: () => void;
  onSelect: (reason: string) => void;
  selectedReason?: string;
}

const reasons = [
  "Brake system malfunction",
  "Hydraulic pressure failure",
  "Electronic sensor fault",
  "ABS integration issue",
  "Mounting or fitment problem",
  "Fluid leakage",
  "Unusual noise or vibration",
  "Overheating or reduced performance",
  "Wiring or connector issue",
  "Damaged or corroded component",
  "Others",
];

export default function SelectReasonModal({ onClose, onSelect, selectedReason }: SelectReasonModalProps) {
  const [tempSelected, setTempSelected] = useState<string>(selectedReason || "");

  const handleSelect = (reason: string) => {
    setTempSelected(reason);
    onSelect(reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
      ></div>

      {/* Modal */}
      <div className="relative bg-[#EBE3D6] w-full max-w-[450px] mx-4 shadow-lg animate-fadeIn overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between">
          <h2 className="font-orbitron font-bold text-[20px] uppercase text-black">
            Select a Reason
          </h2>
          <button
            className="text-[#666] hover:text-black transition-colors"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        {/* Reasons List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {reasons.map((reason) => (
            <div
              key={reason}
              onClick={() => handleSelect(reason)}
              className="px-4 py-4 flex items-center justify-between cursor-pointer bg-[#F0EBE3] hover:bg-[#E8E3D9] transition-colors"
            >
              <span className="font-inter text-sm text-black">{reason}</span>
              {/* Radio Button */}
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                tempSelected === reason 
                  ? "border-[#D35400]" 
                  : "border-[#C2B280]"
              }`}>
                {tempSelected === reason && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D35400]"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

