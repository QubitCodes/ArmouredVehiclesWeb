"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ContactPerson from "../../ContactPerson";
import { useOnboarding } from "../../context";

export default function Step2Page() {
  const router = useRouter();
  const { profileData } = useOnboarding();

  return (
    <ContactPerson
      onNext={() => router.push("/buyer-onboarding/step/3")}
      onPrev={() => router.push("/buyer-onboarding/step/1")}
      initialData={profileData}
    />
  );
}
