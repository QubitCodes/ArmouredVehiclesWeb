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
            // Priority: user.onboardingStep -> profile.current_step
            // We check undefined strictly to allow 0 or null
            let stepFromUser = profileData?.onboardingStep;
            if (stepFromUser === undefined) stepFromUser = profileData?.onboarding_step;

            let stepFromProfile = profileData?.current_step;

            // If user step is null, it means COMPLETED -> Dashboard
            if (stepFromUser === null) {
                router.replace('/dashboard');
                return;
            }

            // If 0, it means New User -> Step 1
            if (stepFromUser === 0) {
                router.replace('/buyer-onboarding/step/1');
                return;
            }

            // Otherwise use the step, falling back to profile or 1
            let nextStep = stepFromUser || stepFromProfile || 1;

            router.replace(`/buyer-onboarding/step/${nextStep}`);
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
