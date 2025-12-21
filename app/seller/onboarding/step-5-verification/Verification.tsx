"use client";

import { useEffect, useState } from "react";

import AddPaymentMethod from "./AddPaymentMethod";
import BankVerificationPending from "./BankVerificationPending";
import PaymentInformation from "./PaymentInformation";
import IdentityVerification from "./IdentityVerification";
import ApprovalPending from "./ApprovalPending";

type VerificationStep =
  | "payment-method"
  | "bank-pending"
  | "payment-info"
  | "identity"
  | "approval-pending";

const VALID_STEPS: VerificationStep[] = [
  "payment-method",
  "bank-pending",
  "payment-info",
  "identity",
  "approval-pending",
];

export default function Verification({
  onPrev,
}: {
  onPrev: () => void;
}) {
  const [step, setStep] = useState<VerificationStep>("payment-method");

  /* 🔒 Load + validate saved step */
  useEffect(() => {
    const savedStep = localStorage.getItem(
      "seller-verification-step"
    ) as VerificationStep | null;

    if (savedStep && VALID_STEPS.includes(savedStep)) {
      setStep(savedStep);
    } else {
      // cleanup invalid old values like "bank-account"
      localStorage.removeItem("seller-verification-step");
      setStep("payment-method");
    }
  }, []);

  const updateStep = (next: VerificationStep) => {
    setStep(next);
    localStorage.setItem("seller-verification-step", next);
  };

  return (
    <div className="max-w-6xl mx-auto">

      {step === "payment-method" && (
        <AddPaymentMethod
          onBack={onPrev}
          onContinue={() => updateStep("bank-pending")}
        />
      )}

      {step === "bank-pending" && (
        <BankVerificationPending
          onBack={() => updateStep("payment-method")}
          onContinue={() => updateStep("payment-info")}
        />
      )}

      {step === "payment-info" && (
        <PaymentInformation
          onBack={() => updateStep("bank-pending")}
          onContinue={() => updateStep("identity")}
        />
      )}

      {step === "identity" && (
        <IdentityVerification
          onBack={() => updateStep("payment-info")}
          onSubmit={() => updateStep("approval-pending")}
        />
      )}

      {step === "approval-pending" && <ApprovalPending />}
    </div>
  );
}
