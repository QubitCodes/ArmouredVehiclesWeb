
export const metadata = {
  title: "About ArmoredMart | Compliance-Integrated Defense Marketplace",
  description:
    "Learn about ArmoredMart, a compliance-driven digital marketplace for armored vehicle components operated by TactyParts FZE under TACTYX Group.",
};

export default function AboutPage() {
  return (
    <>
      <h1 className="font-orbitron text-3xl lg:text-4xl font-black uppercase tracking-wide mb-6">
        About Armored Mart
      </h1>

      <p className="text-sm lg:text-base leading-7 text-[#444]">
        ArmoredMart.com is a secure, compliance-integrated digital marketplace for
        armored vehicle components, operated by TactyParts FZE, a UAE-based entity
        under TACTYX Group. The platform is designed to serve government agencies,
        certified buyers, and approved suppliers globally, while upholding the
        highest standards of procurement governance, traceability, and regulatory
        control.
      </p>

      <p className="text-sm lg:text-base leading-7 text-[#444] mt-4">
        We provide a transparent environment for transactions involving sensitive
        components such as ballistic steel, run-flat systems, suspension upgrades,
        glass, turrets, and other dual-use parts. ArmoredMart.com operates in
        alignment with the UAE Ministry of Defence (MOD), Executive Office for
        Control and Non-Proliferation (EOCN), UAE Customs, and relevant international
        compliance bodies including ITAR, UN dual-use controls, and the Wassenaar
        Arrangement where applicable.
      </p>
    </>
  );
}
