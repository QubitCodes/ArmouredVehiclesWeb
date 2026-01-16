"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "../ui";

type FooterProps = {
  disableMobileBottomSpace?: boolean;
};

const Footer = ({ disableMobileBottomSpace = false }: FooterProps) => {

  const [openSection, setOpenSection] = useState<string | null>(null);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const currencyRef = useRef<HTMLDivElement | null>(null);

  const usefulLinks = [
   
    { title: "FAQ", href: "/faq" },
    { title: "Terms & Conditions", href: "/terms-conditions" },
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
    { title: "Warranty Policy", href: "/warranty-policy" },
    { title: "Returns", href: "/returns" },
    { title: "Shipping", href: "/shipping" },
    { title: "Contact & Legal", href: "/contact-legal" },
  ];


  const aboutUs = [
    { title: "About Armored Mart", href: "/about" },
    { title: "Sell with Us", href: "/sell-with-us" },
    { title: "Consumer Rights", href: "/consumer-rights" },
     { title: "Careers", href: "/https://linkedin.com/company/armoredmart" },
  ];




  const socialLinks = [
    { icon: "/icons/social/meta.svg", href: "https://facebook.com/" },
    { icon: "/icons/social/x.svg", href: "https://twitter.com/" },
    { icon: "/icons/social/youtube.svg", href: "https://youtube.com/" },
    { icon: "/icons/social/instagram.svg", href: "https://instagram.com/" },
    { icon: "/icons/social/linkedin.svg", href: "https://linkedin.com/company/" },
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

          {/* Social Icons */}
          <div className="flex gap-8 mb-6">
            {socialLinks.map((s) => (
              <Link key={s.href} href={s.href} target="_blank">
                <Image src={s.icon} alt="social" width={22} height={22} />
              </Link>
            ))}
          </div>

          {/* Currency Selector - Mobile */}
          <div className="shrink-0 relative mb-6">
            <button
              className="w-[115px] h-[45px] flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 gap-3 px-3 rounded"
              onClick={() => setCurrencyOpen((s) => !s)}
              aria-haspopup="true"
              aria-expanded={currencyOpen}
            >
              <Image src="/icons/flags/uae.svg" alt="UAE Flag" width={24} height={16} />
              <Image src="/icons/currency/dirham.svg" alt="AED" width={18} height={15} />
              <svg width="7" height="4" viewBox="0 0 7 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.50121 0C4.52904 0 5.55478 0 6.58261 0C6.72854 0 6.84946 0.041626 6.93286 0.164423C7.02668 0.301789 7.02251 0.476618 6.91826 0.60774C6.87031 0.666016 6.81819 0.72013 6.76607 0.774244C5.81747 1.77951 4.86887 2.78686 3.92235 3.79213C3.66175 4.06894 3.3386 4.06894 3.08216 3.79421C2.10229 2.75356 1.12241 1.71499 0.140452 0.674341C0.0528886 0.582764 -0.00757169 0.482862 0.000767671 0.349658C0.0132767 0.164423 0.163385 0.0124878 0.348936 0.0020813C0.384378 0 0.417736 0 0.451093 0C1.46849 0 2.48381 0 3.50121 0Z" fill="black" />
              </svg>
            </button>

            {currencyOpen && (
              <div className="absolute left-0 mt-2 bg-white border shadow z-50 rounded">
                <button
                  className="w-[115px] h-[45px] flex items-center justify-center hover:bg-gray-50 gap-3 px-3"
                  onClick={() => setCurrencyOpen(false)}
                >
                  <Image src="/icons/flags/uae.svg" alt="UAE Flag" width={24} height={16} />
                  <Image src="/icons/currency/dirham.svg" alt="AED" width={18} height={15} />
                </button>
              </div>
            )}
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
            <Image src="/icons/final-logo-white.svg" alt="logo" width={220} height={120} />
            
            {/* Currency Selector - Between Logo and Social Icons */}
            <div className="shrink-0 relative mt-4" ref={currencyRef}>
              <button
                className="w-[115px] h-[45px] flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 gap-3 px-3 rounded"
                onClick={() => setCurrencyOpen((s) => !s)}
                aria-haspopup="true"
                aria-expanded={currencyOpen}
              >
                <Image src="/icons/flags/uae.svg" alt="UAE Flag" width={24} height={16} />
                <Image src="/icons/currency/dirham.svg" alt="AED" width={18} height={15} />
                <svg width="7" height="4" viewBox="0 0 7 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.50121 0C4.52904 0 5.55478 0 6.58261 0C6.72854 0 6.84946 0.041626 6.93286 0.164423C7.02668 0.301789 7.02251 0.476618 6.91826 0.60774C6.87031 0.666016 6.81819 0.72013 6.76607 0.774244C5.81747 1.77951 4.86887 2.78686 3.92235 3.79213C3.66175 4.06894 3.3386 4.06894 3.08216 3.79421C2.10229 2.75356 1.12241 1.71499 0.140452 0.674341C0.0528886 0.582764 -0.00757169 0.482862 0.000767671 0.349658C0.0132767 0.164423 0.163385 0.0124878 0.348936 0.0020813C0.384378 0 0.417736 0 0.451093 0C1.46849 0 2.48381 0 3.50121 0Z" fill="black" />
                </svg>
              </button>

              {currencyOpen && (
                <div className="absolute left-0 mt-2 bg-white border shadow z-50 rounded">
                  <button
                    className="w-[115px] h-[45px] flex items-center justify-center hover:bg-gray-50 gap-3 px-3"
                    onClick={() => setCurrencyOpen(false)}
                  >
                    <Image src="/icons/flags/uae.svg" alt="UAE Flag" width={24} height={16} />
                    <Image src="/icons/currency/dirham.svg" alt="AED" width={18} height={15} />
                  </button>
                </div>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex gap-6 mt-4">
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
          <div
            className={`flex flex-col md:flex-row justify-between items-center py-5 gap-4 ${disableMobileBottomSpace ? "mb-0" : "mb-14 md:mb-0"
              }`}
          >
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
