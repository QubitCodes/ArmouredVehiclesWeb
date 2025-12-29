export const metadata = {
  title: "Terms of Use – ArmoredMart",
  description:
    "ArmoredMart Terms of Use outlining platform eligibility, prohibited activities, supplier responsibilities, and compliance enforcement.",
};

export default function TermsOfUsePage() {
  return (
    <main>
      <h1 className="font-orbitron text-3xl lg:text-4xl font-black uppercase tracking-wide mb-6">
        Terms of Use
      </h1>

      {/* Eligibility */}
      <section className="mb-8">
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          Eligibility & Access
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-sm lg:text-base text-[#444]">
          <li>
            Platform access is limited to verified business entities, including
            corporates, OEMs, military agencies, and licensed resellers
          </li>
          <li>
            Personal, anonymous, or non-business use of the platform is strictly
            prohibited
          </li>
        </ul>
      </section>

      {/* Prohibited */}
      <section className="mb-8">
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          Prohibited Activities
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-sm lg:text-base text-[#444]">
          <li>
            Offering, selling, or promoting counterfeit, unverified, or
            unauthorized goods
          </li>
          <li>
            Misdeclaring product purpose, classification, origin, or end-use
          </li>
          <li>
            Attempting to bypass ArmoredMart’s compliance workflows or data
            verification processes
          </li>
          <li>
            Uploading malicious code, false documents, or unauthorized materials
          </li>
          <li>
            Sharing direct contact information (emails, phone numbers, WhatsApp,
            or external links) through platform messaging or profiles
          </li>
        </ul>
      </section>

      {/* Platform Rights */}
      <section className="mb-8">
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          Platform Rights
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-sm lg:text-base text-[#444]">
          <li>
            ArmoredMart reserves the right to suspend accounts, block listings, or
            hold transactions based on internal reviews or regulatory
            notifications
          </li>
          <li>
            All platform activity is monitored and may be audited for compliance
            and security purposes
          </li>
        </ul>
      </section>

      {/* Supplier Responsibilities */}
      <section className="mb-8">
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          Supplier Responsibilities
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-sm lg:text-base text-[#444]">
          <li>
            Provide accurate, complete, and up-to-date technical data for each
            listed product
          </li>
          <li>
            Ensure lawful sourcing and proper authorization to sell controlled
            components
          </li>
          <li>
            Respond promptly to post-sale compliance inquiries, audits, or
            regulatory requests when required
          </li>
        </ul>
      </section>

      {/* Trust System */}
      <section>
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          Trust & Loyalty System
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-sm lg:text-base text-[#444]">
          <li>
            Buyers and sellers are assigned a trust score based on fulfillment
            history, platform activity, and compliance adherence, which may
            affect visibility, badge status, and commission tiers
          </li>
          <li>
            Repeated attempts to request or conduct off-platform transactions
            may result in blacklisting, restricted access, or account
            termination
          </li>
        </ul>
      </section>
    </main>
  );
}
