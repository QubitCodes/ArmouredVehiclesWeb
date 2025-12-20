"use client";

import { useState } from "react";
import SellerStepper from "./components/SellerStepper";
import SellerInformation from "./step-1-seller-information/SellerInformation";
import ContactPerson from "./step-2-contact-person/ContactPerson";
import Declaration from "./step-3-declaration/Declaration";
import AccountPreferences from "./step-4-account-preferences/AccountPreferences";
import Verification from "./step-5-verification/Verification";

export default function SellerOnboardingPage() {
  const [step, setStep] = useState(1);

  return (
    <section className="min-h-screen bg-[#EBE3D6] px-6 py-12">
      {/* STEPPER */}
      <SellerStepper currentStep={step} />

      {step === 1 && (
        <SellerInformation onNext={() => setStep(2)} />
      )}

      {step === 2 && (
        <ContactPerson
          onPrev={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <Declaration
          onPrev={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <AccountPreferences
          onPrev={() => setStep(3)}
          onNext={() => setStep(5)}
        />
      )}

      {step === 5 && (
        <Verification onPrev={() => setStep(4)} />
      )}
    </section>
  );
}
