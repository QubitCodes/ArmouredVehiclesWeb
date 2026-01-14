"use client";

import React from "react";
import Stepper from "./Stepper";
import { OnboardingProvider, useOnboarding } from "./context";
import { usePathname } from "next/navigation";

function OnboardingContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Determine step from URL
  let currentStep = 1;
  if (pathname.includes("/step/1")) currentStep = 1;
  else if (pathname.includes("/step/2")) currentStep = 2;
  else if (pathname.includes("/step/3")) currentStep = 3;
  else if (pathname.includes("/step/4")) currentStep = 4;
  else if (pathname.includes("/step/5")) currentStep = 5;

  const { loading } = useOnboarding();

  if (loading) {
     return (
          <div className="min-h-screen bg-[#EBE3D6] flex items-center justify-center font-orbitron text-xl">
              Loading Profile...
          </div>
      );
  }

  return (
    <section className="min-h-screen bg-[#EBE3D6] px-6 py-12">
      <Stepper currentStep={currentStep} />
      {children}
    </section>
  );
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingProvider>
      <OnboardingContent>{children}</OnboardingContent>
    </OnboardingProvider>
  );
}
