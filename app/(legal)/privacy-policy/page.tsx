export const metadata = {
  title: "Privacy Policy – ArmoredMart",
  description:
    "ArmoredMart Privacy Policy explaining how personal, commercial, and regulatory data is collected, used, stored, and protected.",
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <h1 className="font-orbitron text-3xl lg:text-4xl font-black uppercase tracking-wide mb-6">
        Privacy Policy
      </h1>

      <p className="text-sm lg:text-base leading-7 text-[#444] mb-8">
        ArmoredMart.com values your privacy and is committed to protecting all
        personal, commercial, and regulatory data submitted through the
        platform.
      </p>

      {/* Information Collected */}
      <section className="mb-8">
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          Information Collected
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-sm lg:text-base text-[#444]">
          <li>User registration and company profile data</li>
          <li>Government-issued IDs, licenses, and compliance documents</li>
          <li>Order history, quotation requests, supplier offers</li>
          <li>IP addresses, geolocation, and device metadata</li>
          <li>
            Communication history, document uploads, and interaction logs
          </li>
        </ul>
      </section>

      {/* How We Use Data */}
      <section className="mb-8">
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          How We Use Your Data
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-sm lg:text-base text-[#444]">
          <li>
            To verify organizational eligibility to buy or sell controlled goods
          </li>
          <li>
            To screen transactions for risk flags or regulatory concerns
          </li>
          <li>
            To provide documentation to MOD, EOCN, or UAE Customs as required
          </li>
          <li>
            To improve fraud detection, compliance automation, and platform
            support
          </li>
        </ul>
      </section>

      {/* Data Sharing */}
      <section className="mb-8">
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          Data Sharing Policy
        </h2>

        <p className="text-sm lg:text-base text-[#444] mb-3">
          Your information is not sold or disclosed to third parties except in
          the following circumstances:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-sm lg:text-base text-[#444]">
          <li>
            Regulatory or government authorities (MOD, EOCN, Customs)
          </li>
          <li>
            Legal requests under UAE or applicable international law
          </li>
          <li>
            Contracted service providers such as payment processors and
            verification agencies, strictly for service delivery
          </li>
        </ul>
      </section>

      {/* Cookies */}
      <section className="mb-8">
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          Cookies & Tracking
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-sm lg:text-base text-[#444]">
          <li>
            Cookies and similar tracking technologies are used to enhance
            security, improve functionality, and analyze platform usage.
          </li>
          <li>
            Buyer–seller interaction behavior may be tracked to ensure
            compliance and prevent circumvention of platform policies.
          </li>
        </ul>
      </section>

      {/* Data Storage */}
      <section>
        <p className="text-sm lg:text-base leading-7 text-[#444]">
          All data is stored on secure, encrypted servers hosted in compliance
          with UAE data residency requirements. ArmoredMart adheres to GDPR,
          UAE Personal Data Protection Law, and other applicable jurisdictional
          privacy frameworks.
        </p>
      </section>
    </main>
  );
}
