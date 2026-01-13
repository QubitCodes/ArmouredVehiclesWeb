"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AccountSetup from "../../AccountSetup";
import { useOnboarding } from "../../context";

export default function Step4Page() {
  const router = useRouter();
  const { profileData } = useOnboarding();

  return (
    <AccountSetup
      onSubmit={() => router.push("/")} 
      onPrev={() => router.push("/buyer-onboarding/step/3")}
      initialData={profileData}
    />
  );
}
