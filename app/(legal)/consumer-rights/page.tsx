export const metadata = {
  title: "Consumer Rights & Regulatory Protection – ArmoredMart",
  description:
    "ArmoredMart Consumer Rights and Regulatory Protection outlining buyer rights, dispute resolution, governing law, and liability limitations.",
};

export default function ConsumerRightsPage() {
  return (
    <main>
      <h1 className="font-orbitron text-3xl lg:text-4xl font-black uppercase tracking-wide mb-6">
        Consumer Rights & Regulatory Protection
      </h1>

      <p className="text-sm lg:text-base leading-7 text-[#444] mb-8">
        ArmoredMart.com is committed to maintaining a transparent, compliant, and
        secure digital commerce environment for all verified users.
      </p>

      {/* Rights */}
      <section className="mb-8">
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          Your Rights
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-sm lg:text-base text-[#444]">
          <li>Review product documentation prior to placing an order</li>
          <li>Verified visibility into supplier identity and licensing</li>
          <li>
            Cancel quotation requests before approval or payment processing
          </li>
          <li>
            Access order history, documentation logs, and transaction records
          </li>
          <li>
            Escalate disputes involving fraud, misdelivery, or false
            representation
          </li>
        </ul>
      </section>

      {/* Disputes */}
      <section className="mb-8">
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          Dispute Resolution
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-sm lg:text-base text-[#444]">
          <li>
            All disputes will first be addressed through amicable settlement
            efforts
          </li>
          <li>
            If unresolved, disputes shall be referred to arbitration seated in
            Dubai, United Arab Emirates
          </li>
          <li>
            Governing law shall be the federal and commercial laws of the United
            Arab Emirates
          </li>
        </ul>
      </section>

      {/* Liability */}
      <section>
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          Limitation of Liability
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-sm lg:text-base text-[#444]">
          <li>
            ArmoredMart is not liable for indirect, punitive, or consequential
            damages arising from platform use
          </li>
          <li>
            ArmoredMart is not responsible for supplier misrepresentation,
            unfulfilled warranties, or third-party customs or export decisions
          </li>
        </ul>
      </section>
    </main>
  );
}
