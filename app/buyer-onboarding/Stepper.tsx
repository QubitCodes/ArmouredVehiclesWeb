"use client";

import Link from "next/link";
import { Check } from "lucide-react";

const steps = [
  "Buyer Information",
  "Contact Person",
  "Declaration",
  "Account Setup",
  "Verification",
];

export default function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full max-w-[900px] mx-auto mt-6 mb-10">

      {/* Line */}
      <div className="relative flex items-center justify-between">
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#E0C9A6]" />
        <div
          className="absolute top-1/2 left-0 h-[2px] bg-[#D35400]"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        {steps.map((_, index) => {
          const stepNumber = index + 1;
          const completed = stepNumber < currentStep;
          const active = stepNumber === currentStep;

          return (
            <Link
              href={`/buyer-onboarding/step/${stepNumber}`}
              key={index}
              className="relative z-10 flex flex-col items-center cursor-pointer"
            >
              {/* Circle */}
              <div
                className={`w-[26px] h-[26px] rounded-full flex items-center justify-center
                ${
                  completed || active
                    ? "bg-[#D35400]"
                    : "bg-[#EFE8DC] border border-[#C7B88A]"
                }`}
              >
                {completed ? (
                  <Check size={14} className="text-white" />
                ) : active ? (
                  <span className="text-white text-xs font-bold">
                    {stepNumber}
                  </span>
                ) : (
                  <span className="text-[#C7B88A] text-xs font-bold">
                    {stepNumber}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2 text-[11px] text-black">
        {steps.map((label, index) => (
          <div key={index} className="w-[26px] text-center">
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
