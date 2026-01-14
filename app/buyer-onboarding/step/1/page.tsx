"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BuyerInfo from "../../BuyerInfo";
import { useOnboarding } from "../../context";

export default function Step1Page() {
  const router = useRouter();
  const { profileData } = useOnboarding();

  return (
    <BuyerInfo
      onNext={() => router.push("/buyer-onboarding/step/2")}
      initialData={profileData}
    />
  );
}
