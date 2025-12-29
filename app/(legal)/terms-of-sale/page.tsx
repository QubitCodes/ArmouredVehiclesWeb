export const metadata = {
  title: "Terms of Sale – ArmoredMart",
  description:
    "ArmoredMart Terms of Sale governing quotations, compliance screening, payments, shipping, refunds, and regulatory conditions.",
};

export default function TermsOfSalePage() {
  return (
    <main>
      <h1 className="font-orbitron text-3xl lg:text-4xl font-black uppercase tracking-wide mb-6">
        Terms of Sale
      </h1>

      {/* General Sale Terms */}
      <section className="mb-8">
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          General Sale Terms
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-sm lg:text-base text-[#444]">
          <li>
            All sales are initiated as quotation requests and are subject to
            supplier acceptance and compliance screening
          </li>
          <li>
            Final pricing may include duties, shipping costs, transaction fees,
            and applicable taxes
          </li>
        </ul>
      </section>

      {/* Regulatory Conditions */}
      <section className="mb-8">
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          Regulatory Conditions
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-sm lg:text-base text-[#444]">
          <li>
            Certain controlled items, including turret rings, ballistic systems,
            and armor panels, may require MOD or EOCN clearance prior to approval
          </li>
          <li>
            Non-compliant transactions may be held, cancelled, or reported to
            regulatory authorities
          </li>
          <li>
            Payments will not be captured or released until all internal and
            external compliance checks are cleared
          </li>
        </ul>
      </section>

      {/* Shipping */}
      <section className="mb-8">
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          Shipping & Liability
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-sm lg:text-base text-[#444]">
          <li>
            Suppliers are responsible for proper packaging, customs
            declarations, and timely dispatch of goods
          </li>
          <li>
            ArmoredMart does not act as exporter or importer of record unless
            explicitly contracted
          </li>
          <li>
            Delays caused by Customs, MOD, EOCN, or international enforcement
            bodies are not the liability of ArmoredMart
          </li>
        </ul>
      </section>

      {/* Force Majeure */}
      <section className="mb-8">
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          Force Majeure
        </h2>
        <p className="text-sm lg:text-base leading-7 text-[#444]">
          ArmoredMart and its suppliers shall not be held liable for delays or
          failures resulting from events beyond reasonable control, including
          acts of God, wars, embargoes, cyberattacks, or other force majeure
          events.
        </p>
      </section>

      {/* Refunds */}
      <section className="mb-8">
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          Refund Timeline
        </h2>
        <p className="text-sm lg:text-base leading-7 text-[#444]">
          If a transaction is blocked or denied due to compliance or regulatory
          issues, refunds will be processed within fourteen (14) business days
          using the original method of payment.
        </p>
      </section>

      {/* Platform Benefits */}
      <section>
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          Platform-Locked Benefits
        </h2>
        <p className="text-sm lg:text-base leading-7 text-[#444]">
          Warranty claims, dispute resolution, secure payment handling, and
          performance tracking are valid only for transactions conducted fully
          within the ArmoredMart platform ecosystem.
        </p>
      </section>
    </main>
  );
}
