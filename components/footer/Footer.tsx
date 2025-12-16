"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "../ui";

const Footer = () => {
  const usefulLinks = [
    { title: "Where to Buy", href: "/where-to-buy" },
    { title: "Catalogs", href: "/catalogs" },
    { title: "Affiliate Program", href: "/affiliate-program" },
    { title: "Careers", href: "/careers" },
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
    { title: "FAQ", href: "/faq" },
    { title: "Manuals", href: "/manuals" },
    { title: "Returns", href: "/returns" },
    { title: "Shipping", href: "/shipping" },
  ];

  const aboutUs = [
    { title: "About Armored Mart", href: "/about" },
    { title: "Warranty Policy", href: "/warranty-policy" },
    { title: "Sell with Us", href: "/sell-with-us" },
    { title: "Terms of Use", href: "/terms-of-use" },
    { title: "Terms of Sale", href: "/terms-of-sale" },
    { title: "Privacy Policy", href: "/privacy-policy" },
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
    { icon: "/icons/payment/apple pay.svg", alt: "Apple Pay" },
  ];

  return (
    <footer
        className="text-white pt-14  bg-[#111]"
        style={{
            backgroundImage: "url('/footer.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}
    >
      <div className="container-figma mx-auto relative pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-10">
          {/* Left Logo + Socials */}
          <div className="space-y-4">
            <div>
              <Image src="/logo.svg" alt="ArmoredMart" width={180} height={50} />
              {/* <p className="text-[12px] text-gray-400 mt-1 leading-snug">
                THE WORLD’S FIRST COMPLIANCE INTEGRATED DEFENSE E-STORE
              </p> */}
            </div>
            <div className="flex items-center gap-4 pt-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image src={social.icon} alt="social" width={18} height={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-orbitron text-base font-extrabold text-[#D35400] mb-3 uppercase leading-none">USEFUL LINKS</h3>
            <ul className="space-y-2">
              {usefulLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="font-inter text-[14px] leading-[34px] text-white hover:text-white"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-orbitron text-base font-extrabold text-[#D35400] mb-3 uppercase leading-none">CATEGORIES</h3>
            <ul className="space-y-2">
              {categories.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className="font-inter text-[14px] leading-[34px] text-white hover:text-white"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-orbitron text-base font-extrabold text-[#D35400] mb-3 uppercase leading-none">HELP</h3>
            <ul className="space-y-2">
              {help.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className="font-inter text-[14px] leading-[34px] text-white hover:text-white"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-orbitron text-base font-extrabold text-[#D35400] mb-3 uppercase leading-none">ABOUT US</h3>
            <ul className="space-y-2">
              {aboutUs.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className="font-inter text-[14px] leading-[34px] text-white hover:text-white"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Bar with Full Width */}
      <div className="border-t bg-black border-gray-800">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-5">
            <div className="flex items-center justify-center gap-4">
              {paymentMethods.map((method) => (
                <Image key={method.alt} src={method.icon} alt={method.alt} width={50} height={28} />
              ))}
            </div>
            <p className="text-xs text-white text-center">
              Copyright ©{new Date().getFullYear()} ArmoredMart.com. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <div className="flex items-center gap-1">
                <Image src="/icons/tatyx.svg" alt="Tactyx" width={140} height={50} />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
