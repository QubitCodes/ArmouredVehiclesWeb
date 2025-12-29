export const metadata = {
  title: "Warranty Policy – ArmoredMart",
  description:
    "ArmoredMart Warranty Policy outlining supplier-based warranties, defect reporting requirements, exclusions, and return procedures.",
};

export default function WarrantyPolicyPage() {
  return (
    <main>
      <h1 className="font-orbitron text-3xl lg:text-4xl font-black uppercase tracking-wide mb-6">
        Warranty Policy
      </h1>

      {/* Supplier Warranty */}
      <section className="mb-8">
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          Supplier-Based Warranty
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-sm lg:text-base text-[#444]">
          <li>
            Warranty coverage is provided directly by the supplier unless
            otherwise stated
          </li>
          <li>
            Warranty terms, including scope, duration, and exclusions, will be
            specified in the quotation or product description
          </li>
        </ul>
      </section>

      {/* Defects */}
      <section className="mb-8">
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          Defect Notification
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-sm lg:text-base text-[#444]">
          <li>
            Defects must be reported within seven (7) calendar days of receiving
            the goods
          </li>
          <li>
            Supporting documentation such as photographs, inspection reports,
            or installation data may be required
          </li>
        </ul>
      </section>

      {/* Exclusions */}
      <section className="mb-8">
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          Warranty Exclusions
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-sm lg:text-base text-[#444]">
          <li>Physical damage resulting from mishandling</li>
          <li>
            Use of products outside their intended military or industrial
            specifications
          </li>
          <li>Unauthorized modifications, alterations, or repairs</li>
        </ul>
      </section>

      {/* Returns */}
      <section>
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          Return Policy
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-sm lg:text-base text-[#444]">
          <li>
            Buyers are responsible for coordinating product returns directly
            with the supplier
          </li>
          <li>
            Return freight, insurance, customs clearance, and related charges
            may apply
          </li>
        </ul>
      </section>
    </main>
  );
}
