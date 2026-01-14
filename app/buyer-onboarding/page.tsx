"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "./context";

// This page now acts as a director
function Director() {
    const router = useRouter();
    const { profileData, loading } = useOnboarding();

    useEffect(() => {
        if (!loading) {
            let nextStep = 1;
            
            // If profile is empty (no id), force step 1 regardless of user.onboardingStep
            if (!profileData?.id && !profileData?.profile?.id) { // checking nested profile just in case structure differs
                 nextStep = 1;
            } else if (profileData?.current_step) {
                nextStep = profileData.current_step;
            } else if (profileData?.onboardingStep) {
                nextStep = profileData.onboardingStep;
            } else if (profileData?.onboarding_step) {
                 nextStep = profileData.onboarding_step;
            }

            // If done (0), go to dashboard
            if (nextStep === 0) {
                 router.replace('/dashboard');
            } else {
                 router.replace(`/buyer-onboarding/step/${nextStep}`);
            }
        }
    }, [loading, profileData, router]);

    return (
        <div className="min-h-screen bg-[#EBE3D6] flex items-center justify-center font-orbitron text-xl">
            Redirecting...
        </div>
    );
}

// We need to export a component that is NOT wrapped in provider here, 
// because LAYOUT wraps this page. So we can just use useOnboarding directly?
// YES, page.tsx is a child of layout.tsx.
export default function BuyerOnboardingPage() {
    return <Director />;
}
