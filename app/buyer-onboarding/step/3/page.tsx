"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Declaration from "../../Declaration";
import { useOnboarding } from "../../context";

export default function Step3Page() {
  const router = useRouter();
  const { profileData } = useOnboarding();

  return (
    <Declaration
      onNext={() => router.push("/buyer-onboarding/step/4")}
      onPrev={() => router.push("/buyer-onboarding/step/2")}
      initialData={profileData}
    />
  );
}
