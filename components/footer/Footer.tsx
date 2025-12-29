"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "../ui";

const Footer = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

const usefulLinks = [
  { title: "Careers", href: "/careers" },
  { title: "FAQ", href: "/faq" },
  { title: "Terms of Use", href: "/terms-of-use" },
  { title: "Terms of Sale", href: "/terms-of-sale" },
  { title: "Privacy Policy", href: "/privacy-policy" },
];

const categories = [
  { title: "Core Vehicle Systems", href: "/categories/core-vehicle-systems" },
  { title: "Armor-specific Systems", href: "/categories/armor-specific-systems" },
  { title: "Communication & Control Systems", href: "/categories/communication-control-systems" },
  { title: "Climate & Interior", href: "/categories/climate-interior" },
  { title: "Exterior & Utility", href: "/categories/exterior-utility" },
  { title: "OEM / Custom Manufacturing Support", href: "/categories/oem-custom-manufacturing" },
  { title: "Platform & Rolling Chassis", href: "/categories/platform-rolling-chassis" },
  { title: "OEM Baseline Chassis Sourcing", href: "/categories/oem-baseline-chassis" },
  { title: "Custom Tactical Hardware", href: "/categories/custom-tactical-hardware" },
];

const help = [
  { title: "Order Status", href: "/order-status" },
  { title: "Warranty", href: "/warranty" },
  { title: "Returns", href: "/returns" },
  { title: "Shipping", href: "/shipping" },
];

const aboutUs = [
  { title: "About Armored Mart", href: "/about" },
  { title: "Warranty Policy", href: "/warranty-policy" },
  { title: "Sell with Us", href: "/sell-with-us" },
  { title: "Consumer Rights", href: "/consumer-rights" },
];




  const socialLinks = [
    { icon: "/icons/social/meta.svg", href: "https://facebook.com/armoredmart" },
    { icon: "/icons/social/x.svg", href: "https://twitter.com/armoredmart" },
    { icon: "/icons/social/youtube.svg", href: "https://youtube.com/armoredmart" },
    { icon: "/icons/social/pinterest.svg", href: "https://pinterest.com/armoredmart" },
    { icon: "/icons/social/instagram.svg", href: "https://instagram.com/armoredmart" },
  ];

  const paymentMethods = [
    { icon: "/icons/payment/mastercard.svg", alt: "Mastercard" },
    { icon: "/icons/payment/visa.svg", alt: "Visa" },
    { icon: "/icons/payment/tabby.svg", alt: "Tabby" },
    { icon: "/icons/payment/tamara.svg", alt: "Tamara" },
    { icon: "/icons/payment/apple-pay.svg", alt: "Apple Pay" },
  ];

  return (
    <footer
      className="text-white pt-14 bg-[#111]"
      style={{
        backgroundImage: "url('/footer.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container-figma mx-auto relative pb-6">

        {/* ========== MOBILE FOOTER ========== */}
        <div className="lg:hidden mb-6">
          <Image src="/logofullwhite.svg" alt="ArmoredMart" width={260} height={140} className="mb-4" />

          <div className="flex gap-8 mb-6">
            {socialLinks.map((s) => (
              <Link key={s.href} href={s.href} target="_blank">
                <Image src={s.icon} alt="social" width={22} height={22} />
              </Link>
            ))}
          </div>

          {[{ id: "useful", title: "USEFUL LINKS", items: usefulLinks },
          { id: "categories", title: "CATEGORIES", items: categories },
          { id: "help", title: "HELP", items: help },
          { id: "about", title: "ABOUT US", items: aboutUs },
          ].map((section) => (
            <div key={section.id} className="border-t border-gray-700">
              <button
                onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                className="w-full flex justify-between py-4"
              >
                <span className="font-orbitron text-sm text-[#D35400]">
                  {section.title}
                </span>
                <span>{openSection === section.id ? "−" : "+"}</span>
              </button>

              {openSection === section.id && (
                <ul className="pb-4 space-y-1">
                  {section.items.map((i) => (
                    <li key={i.href}>
                      <Link href={i.href} className="text-sm text-gray-300">
                        {i.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* ========== DESKTOP FOOTER ========== */}
        <div className="hidden lg:grid grid-cols-5 gap-8 mb-5">
          <div>
            <Image src="/logofullwhite.svg" alt="logo" width={220} height={120} />
            <div className="flex gap-4 mt-4">
              {socialLinks.map((s) => (
                <Link key={s.href} href={s.href} target="_blank">
                  <Image src={s.icon} alt="social" width={20} height={20} />
                </Link>
              ))}
            </div>
          </div>

          {[usefulLinks, categories, help, aboutUs].map((group, i) => (
            <div key={i}>
              <h3 className="font-orbitron text-[#D35400] mb-2 uppercase">
                {["Useful Links", "Categories", "Help", "About Us"][i]}
              </h3>
              <ul className="space-y-1">
                {group.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ========== BOTTOM BAR ========== */}
      <div className="border-t bg-black border-gray-800">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center py-5 gap-4 mb-14 md:mb-0">
            <div className="flex gap-4">
              {paymentMethods.map((m) => (
                <Image key={m.alt} src={m.icon} alt={m.alt} width={50} height={28} />
              ))}
            </div>

            <p className="text-xs text-center">
              © {new Date().getFullYear()} ArmoredMart.com. All rights reserved.
            </p>

            <Image src="/icons/tatyx.svg" alt="Tactyx" width={140} height={50} />
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
