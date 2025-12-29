export const metadata = {
  title: "Terms & Conditions – ArmoredMart",
  description:
    "ArmoredMart Terms & Conditions governing platform access, transactions, compliance obligations, and non-circumvention policies.",
};

export default function TermsConditionsPage() {
  return (
    <main>
      <h1 className="font-orbitron text-3xl lg:text-4xl font-black uppercase tracking-wide mb-6">
        Terms & Conditions
      </h1>

      <p className="text-sm lg:text-base leading-7 text-[#444] mb-6">
        By registering, accessing, or transacting on ArmoredMart.com, you agree
        to the following terms and conditions:
      </p>

      <ul className="list-disc pl-6 space-y-2 text-sm lg:text-base text-[#444] mb-6">
        <li>
          Provide truthful, accurate, and complete business and regulatory
          information
        </li>
        <li>
          Abide by all applicable UAE, local, and international export and import
          laws
        </li>
        <li>
          Accept that controlled items may require pre-approval or additional
          documentation
        </li>
        <li>
          Acknowledge that regulatory authorities may review, flag, delay, or
          block orders as required
        </li>
      </ul>

      <p className="text-sm lg:text-base leading-7 text-[#444] mb-8">
        Violations of these terms, including misrepresentation or
        non-compliance, may result in account suspension, transaction reversal,
        legal escalation, and permanent platform bans.
      </p>

      <section>
        <h2 className="font-orbitron text-lg font-bold uppercase mb-3">
          Marketplace Continuity & Non-Circumvention Clause
        </h2>

        <p className="text-sm lg:text-base leading-7 text-[#444]">
          All introductions made through ArmoredMart.com between buyers and
          suppliers are deemed platform-originated relationships. Both parties
          agree to conduct transactions exclusively through the platform for a
          minimum period of twenty-four (24) months from the date of initial
          engagement. Any attempt to bypass the platform, directly or
          indirectly, shall result in a penalty equivalent to twenty percent
          (20%) of the total value of such transactions, payable by the breaching
          party.
        </p>
      </section>
    </main>
  );
}
