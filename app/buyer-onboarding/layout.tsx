"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Stepper from "./Stepper";
import { OnboardingProvider, useOnboarding } from "./context";

function OnboardingContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, profileData } = useOnboarding();

  // Determine step from URL
  let currentStep = 1;
  if (pathname.includes("/step/1")) currentStep = 1;
  else if (pathname.includes("/step/2")) currentStep = 2;
  else if (pathname.includes("/step/3")) currentStep = 3;
  else if (pathname.includes("/step/4")) currentStep = 4;
  else if (pathname.includes("/step/5")) currentStep = 5;

  // Redirect away from onboarding if onboarding_step is null (completed)
  useEffect(() => {
    if (!loading) {
      const onboardingStep = profileData?.onboarding_step ?? profileData?.onboardingStep ?? profileData?.current_step;

      // If onboarding is complete (null), redirect to home
      // Exception: Allow step 5 to show the success message
      if (onboardingStep === null && !pathname.includes("/step/5")) {
        router.replace("/");
      }
    }
  }, [loading, profileData, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBE3D6] flex items-center justify-center font-orbitron text-xl">
        Loading Profile...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#EBE3D6] px-6 py-12">
      <div className="max-w-4xl mx-auto mb-6">
        {profileData?.onboarding_status === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
            <div className="flex gap-3">
              <div className="font-bold">Application Rejected:</div>
              <div>{profileData.rejection_reason || "Your application was rejected."}</div>
            </div>
          </div>
        )}
        {profileData?.onboarding_status === 'update_needed' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 mb-6">
            <div className="flex gap-3">
              <div className="font-bold">Update Required:</div>
              <div>{profileData.rejection_reason || "Please update your application details."}</div>
            </div>
          </div>
        )}
      </div>
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
