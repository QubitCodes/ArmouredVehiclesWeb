"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { submitOnboardingStep2 } from "@/app/services/vendor";

function Step2Content() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlToken = searchParams.get("token");

  const [form, setForm] = useState({
    contactFullName: "",
    contactJobTitle: "",
    contactWorkEmail: "",
    contactIdDocumentUrl: "",
    contactMobileCountryCode: "+971",
    contactMobile: "",
    termsAccepted: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const update = (key: keyof typeof form, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      if (typeof window !== "undefined" && urlToken) {
        localStorage.setItem("access_token", urlToken);
      }

      if (!form.contactFullName || !form.contactWorkEmail || !form.contactMobile || !form.termsAccepted) {
        throw new Error("Please fill required fields and accept the acknowledgment.");
      }

      const payload = {
        contactFullName: form.contactFullName,
        contactJobTitle: form.contactJobTitle || undefined,
        contactWorkEmail: form.contactWorkEmail,
        contactIdDocumentUrl: form.contactIdDocumentUrl || undefined,
        contactMobile: form.contactMobile,
        contactMobileCountryCode: form.contactMobileCountryCode,
        termsAccepted: form.termsAccepted,
      };

      const { data } = await submitOnboardingStep2(payload);
      if (data?.success) {
        setSuccess(data.message || "Step 2 submitted successfully.");
        router.push("/vendor/onboarding/step3");
      } else {
        throw new Error(data?.message || "Submission failed");
      }
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#EBE3D6] px-6 py-12 text-black">
      <div className="max-w-[1000px] mx-auto">
        <h1 className="font-orbitron font-bold text-[22px] uppercase mb-6">Authorized Contact Person</h1>

        <div className="border border-[#E2D6C3] bg-[#F0EBE3] p-6">
          <div className="mb-4">
            <label className="text-xs font-semibold mb-1 block">Full Name*</label>
            <input
              type="text"
              value={form.contactFullName}
              onChange={(e) => update("contactFullName", e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-[#C7B88A] bg-[#EBE3D6] text-sm focus:outline-none"
            />
            <p className="text-xs text-gray-600 mt-1">Enter your complete name as on passport/ID.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="text-xs font-semibold mb-1 block">Job Title</label>
              <input
                type="text"
                value={form.contactJobTitle}
                onChange={(e) => update("contactJobTitle", e.target.value)}
                placeholder="Type Your Job Title"
                className="w-full px-4 py-3 border border-[#C7B88A] bg-[#EBE3D6] text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block">Work Email Address*</label>
              <input
                type="email"
                value={form.contactWorkEmail}
                onChange={(e) => update("contactWorkEmail", e.target.value)}
                placeholder="Type Your Work Email Address"
                className="w-full px-4 py-3 border border-[#C7B88A] bg-[#EBE3D6] text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold mb-1 block">ID Document URL</label>
              <input
                type="url"
                value={form.contactIdDocumentUrl}
                onChange={(e) => update("contactIdDocumentUrl", e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 border border-[#C7B88A] bg-[#EBE3D6] text-sm focus:outline-none"
              />
              <p className="text-xs text-gray-600 mt-1">Provide a link to the uploaded ID document.</p>
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block">Mobile / WhatsApp Number*</label>
              <div className="flex items-center border border-[#C7B88A] h-12 bg-[#EBE3D6]">
                <select
                  value={form.contactMobileCountryCode}
                  onChange={(e) => update("contactMobileCountryCode", e.target.value)}
                  className="px-3 h-full bg-[#EBE3D6] border-r border-[#C7B88A] text-sm focus:outline-none"
                >
                  <option value="+971">+971</option>
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
                <input
                  type="tel"
                  value={form.contactMobile}
                  onChange={(e) => update("contactMobile", e.target.value)}
                  placeholder="Phone number"
                  className="flex-1 px-3 bg-[#EBE3D6] text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-[#F0EBE3] px-6 py-5 border border-[#E2D6C3]">
          <label className="flex items-start gap-3 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.termsAccepted}
              onChange={(e) => update("termsAccepted", e.target.checked)}
              className="mt-0.5 w-4 h-4 border border-[#C7B88A] bg-[#EBE3D6] accent-[#C7B88A]"
            />
            <span>
              I confirm the accuracy of the above details and that I am authorized to submit this request.
            </span>
          </label>
        </div>

        {error && (
          <div className="mt-4 text-red-700 bg-red-100 border border-red-300 px-4 py-2">{error}</div>
        )}
        {success && (
          <div className="mt-4 text-green-700 bg-green-100 border border-green-300 px-4 py-2">{success}</div>
        )}

        <div className="flex justify-center gap-6 mt-10">
          <button
            onClick={() => router.back()}
            className="relative w-[220px] h-12 bg-transparent"
            disabled={submitting}
          >
            <span className="absolute inset-0 clip-path-supplier bg-[#C7B88A]" aria-hidden />
            <span className="absolute inset-[1.5px] clip-path-supplier bg-[#F0EBE3]" aria-hidden />
            <span className="relative z-10 flex items-center justify-center h-full w-full font-orbitron font-bold text-[13px] uppercase">Previous</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-[280px] h-12 bg-[#D35400] text-white font-black clip-path-supplier uppercase hover:bg-[#39482C] transition-colors disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Next"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default function VendorOnboardingStep2Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#EBE3D6] px-6 py-12 text-black">Loading…</div>}>
      <Step2Content />
    </Suspense>
  );
}
