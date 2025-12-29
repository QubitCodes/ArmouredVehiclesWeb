export const metadata = {
  title: "Contact & Legal Information – ArmoredMart",
  description:
    "Official contact and legal information for ArmoredMart compliance, regulatory, and legal inquiries.",
};

export default function ContactLegalPage() {
  return (
    <main>
      <h1 className="font-orbitron text-3xl lg:text-4xl font-black uppercase tracking-wide mb-6">
        Contact & Legal Information
      </h1>

      <p className="text-sm lg:text-base leading-7 text-[#444] mb-6">
        For regulatory inquiries, legal assistance, or compliance verification,
        please contact ArmoredMart using the details below.
      </p>

      <ul className="text-sm lg:text-base text-[#444] space-y-2">
        <li>
          <strong>Email:</strong> compliance@armoredmart.com / legal@armoredmart.com
        </li>
        <li>
          <strong>Office:</strong> 312, C1 Tower, Ajman Freezone, Ajman, UAE
        </li>
      </ul>

      <p className="text-sm lg:text-base leading-7 text-[#444] mt-8">
        This content may be updated without prior notice to reflect regulatory,
        technical, or operational changes.
      </p>
    </main>
  );
}
