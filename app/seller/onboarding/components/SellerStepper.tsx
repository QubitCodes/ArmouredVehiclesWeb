"use client";

import { Check } from "lucide-react";

const steps = [
  "Company Information",
  "Contact Person",
  "Declaration",
  "Account Preferences",
  "Verification",
];

export default function SellerStepper({
  currentStep,
}: {
  currentStep: number;
}) {
  const totalSteps = steps.length;

  // completed steps count (0-based for line calc)
  const completedCount = Math.min(currentStep - 1, totalSteps - 1);

  // percentage for orange progress line
  const progressPercent =
    (completedCount / (totalSteps - 1)) * 100;

  return (
    <div className="w-full max-w-[1000px] mx-auto mt-6 mb-12">
      {/* LINE CONTAINER */}
      <div className="relative flex items-center justify-between">

        {/* BASE LINE (light gold) */}
        <div
          className="absolute top-1/2 h-[2px] bg-[#C2B280]"
          style={{
            left: "13px",
            right: "13px",
            transform: "translateY(-50%)",
          }}
        />

        {/* PROGRESS LINE (orange) */}
        <div
          className="absolute top-1/2 h-[2px] bg-[#D35400]"
          style={{
            left: "13px",
            width: `calc(${progressPercent}% - 13px)`,
            transform: "translateY(-50%)",
          }}
        />

        {/* STEPS */}
        {steps.map((_, index) => {
          const stepNumber = index + 1;
          const completed = stepNumber < currentStep;
          const active = stepNumber === currentStep;

          return (
            <div
              key={index}
              className="relative z-10 flex flex-col items-center"
            >
              {/* CIRCLE */}
              <div
                className={`w-[26px] h-[26px] rounded-full flex items-center justify-center
                ${
                  completed
                    ? "bg-[#D35400]"
                    : active
                    ? "bg-[#F0EBE3] border-2 border-[#D35400]"
                    : "bg-[#F0EBE3] border border-[#C7B88A]"
                }`}
              >
                {completed ? (
                  <Check size={14} className="text-white" />
                ) : (
                  <span
                    className={`text-xs font-bold ${
                      active ? "text-[#D35400]" : "text-black"
                    }`}
                  >
                    {stepNumber}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* LABELS */}
      <div className="flex justify-between mt-3 text-[11px] text-black">
        {steps.map((label, index) => (
          <div key={index} className="w-[26px] text-center">
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
