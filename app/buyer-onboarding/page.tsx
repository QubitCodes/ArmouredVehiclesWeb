"use client";

import { useState } from "react";
import Stepper from "./Stepper";
import BuyerInfo from "./BuyerInfo";
import ContactPerson from "./ContactPerson";
import Declaration from "./Declaration";
import AccountSetup from "./AccountSetup";

export default function BuyerOnboardingPage() {
  const [step, setStep] = useState(1);

  return (
    <section className="min-h-screen bg-[#EBE3D6] px-6 py-12">
      
      {/* STEPPER */}
      <Stepper currentStep={step} />

      {/* STEP CONTENT */}
      {step === 1 && (
        <BuyerInfo onNext={() => setStep(2)} />
      )}

      {step === 2 && (
        <ContactPerson
          onNext={() => setStep(3)}
          onPrev={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <Declaration
          onNext={() => setStep(4)}
          onPrev={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <AccountSetup
          onPrev={() => setStep(3)}
        />
      )}
    </section>
  );
}
