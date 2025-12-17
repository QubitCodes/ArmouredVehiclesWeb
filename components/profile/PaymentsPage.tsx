"use client";

import { useState } from "react";
import Image from "next/image";

const paymentMethods = [
  { id: "card", label: "Debit/Credit Card", description: "We accept Visa and MasterCard.", icon: "visa", selected: true },
  { id: "tabby", label: "Tabby", description: "Split in up to 12 payments", icon: "tabby" },
  { id: "tamara", label: "Tamara", description: "Pay in 4 simple, interest free payments of ₽ 694.75", icon: "tamara" },
  { id: "apple", label: "Apple Pay", icon: "apple" },
  { id: "paypal", label: "Paypal", icon: "paypal" },
];

// Mock saved cards data - set to empty array to show "No Saved Cards" state
const savedCards: { id: string; type: string; last4: string; expiry: string }[] = [
  // Uncomment below to test with saved cards:
//   { id: "1", type: "visa", last4: "4242", expiry: "12/25" },
//   { id: "2", type: "mastercard", last4: "5555", expiry: "08/26" },
];

export default function PaymentsPage() {
  const [selectedPayment, setSelectedPayment] = useState("card");
  const hasSavedCards = savedCards.length > 0;

  return (
    <main className="flex-1">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-orbitron font-black text-xl lg:text-[32px] uppercase tracking-wide text-black">
          Payments
        </h1>
      </div>

      {/* Conditional Rendering: No Saved Cards OR Payment Methods */}
      {!hasSavedCards ? (
        /* Empty State - No Saved Cards */
        <div className="flex flex-col items-center justify-center py-16 lg:py-24">
          {/* Payment Illustration */}
          <div className="mb-6">
            <Image
              src="/order/payment.svg"
              alt="No Saved Cards"
              width={180}
              height={160}
              className="mx-auto"
            />
          </div>

          {/* Title */}
          <h2 className="font-orbitron font-black text-lg lg:text-xl uppercase tracking-wide text-black mb-2">
            No Saved Cards
          </h2>

          {/* Description */}
          <p className="font-inter text-sm text-[#666] text-center max-w-md">
            Your saved cards will appear here once you add a card during checkout.
          </p>
        </div>
      ) : (
        /* Payment Methods List */
        <div className="bg-[#EBE3D6] p-5">
          {paymentMethods.map((method, index) => (
            <label
              key={method.id}
              className={`flex items-center justify-between p-4 cursor-pointer transition-all ${
                index !== paymentMethods.length - 1 ? "border-b border-[#DBD4C3]" : ""
              }`}
              onClick={() => setSelectedPayment(method.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPayment === method.id ? "border-[#D35400]" : "border-[#6E6E6E]"
                }`}>
                  {selectedPayment === method.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#D35400]" />
                  )}
                </div>
                <div>
                  <span className="text-sm font-semibold">{method.label}</span>
                  {method.description && (
                    <p className="text-[14px] text-[#6E6E6E]">{method.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {method.id === "card" && (
                  <>
                    <Image src="/order/paysvg.svg" alt="Card Payment" width={80} height={24} className="h-6 w-auto object-contain" />
                    <Image src="/order/paysvg1.svg" alt="Card Payment" width={80} height={24} className="h-6 w-auto object-contain" />
                  </>
                )}
                {method.id === "tabby" && (
                  <Image src="/order/paysvg2.svg" alt="Tabby" width={60} height={24} className="h-6 w-auto object-contain" />
                )}
                {method.id === "tamara" && (
                  <Image src="/order/paysvg3.svg" alt="Tamara" width={60} height={24} className="h-6 w-auto object-contain" />
                )}
                {method.id === "apple" && (
                  <Image src="/order/paysvg4.svg" alt="Apple Pay" width={50} height={24} className="h-6 w-auto object-contain" />
                )}
                {method.id === "paypal" && (
                  <Image src="/order/paysvg5.svg" alt="PayPal" width={60} height={24} className="h-6 w-auto object-contain" />
                )}
              </div>
              <input
                type="radio"
                name="payment"
                className="sr-only"
                checked={selectedPayment === method.id}
                onChange={() => setSelectedPayment(method.id)}
              />
            </label>
          ))}
        </div>
      )}
    </main>
  );
}
