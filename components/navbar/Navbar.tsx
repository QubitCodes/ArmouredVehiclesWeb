'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: 'Core Systems', href: '/core-systems' },
    { name: 'Armor Systems', href: '/armor-systems' },
    { name: 'Comms & Control', href: '/comms-control' },
    { name: 'Climate & Interior', href: '/climate-interior' },
    { name: 'Exterior & Utility', href: '/exterior-utility' },
    { name: 'OEM / Custom Support', href: '/oem-custom' },
    { name: 'Chassis & Platforms', href: '/chassis-platforms' },
    { name: 'OEM Sourcing', href: '/oem-sourcing' },
    { name: 'Tactical Hardware', href: '/tactical-hardware' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      {/* Top Navigation */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between py-[10px]">
            {/* Logo */}
            <div className="shrink-0">
              <Link href="/">
                <Image
                  src="/logo.svg"
                  alt="ArmoredMart"
                  width={280}
                  height={40}
                  priority
                />
              </Link>
            </div>

            {/* Search + Currency */}
            <div className="flex items-center space-x-10 flex-1 max-w-[470px] mx-8">
              <div className="relative h-[50px] max-w-[350px] flex-1">
                <input
                  type="text"
                  placeholder="Search Products"
                  className="w-full h-full px-4 border border-[#000000] focus:outline-none placeholder-[#6E6E6E]"
                />
                <button className="absolute right-0 top-0 h-full w-[50px] flex items-center justify-center bg-[#D35400] text-white hover:bg-black">
                  <Search className="w-6 h-6" />
                </button>
              </div>

              <div className="shrink-0">
                <button className="w-[115px] h-[50px] flex items-center justify-center border border-[#000000] hover:bg-gray-50">
                  د.إ
                </button>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <Link href="/supplier" className="relative">
                <div className="bg-[#39482C] text-white clip-path-supplier hover:bg-[#2C3922] transition-colors flex items-center justify-center w-[260px] h-[47px]">
                  <span className="font-black text-[20px] leading-none font-orbitron uppercase">SUPPLIER ZONE</span>
                </div>
              </Link>

              <Link href="/login" className="relative">
                <div className="bg-[#D35400] text-white clip-path-supplier hover:bg-black transition-colors flex items-center justify-center w-[140px] h-[47px]">
                  <span className="font-black text-[20px] leading-none font-orbitron uppercase">LOGIN</span>
                </div>
              </Link>

              <Link href="/cart" className="relative">
                <Image
                  src="/cart.svg"
                  alt="Shopping Cart"
                  width={47}
                  height={47}
                  className="hover:opacity-80 transition-opacity"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="bg-[#39482C] text-white relative">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center h-[50px]">
            {/* Menu Toggle */}
            <button
              className="p-2 hover:bg-[#2C3922]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="sr-only">Menu</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center ml-6 h-[50px]">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center h-full px-4 text-[13px] font-medium whitespace-nowrap 
                 transition-all duration-200 hover:bg-[#D35400] hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Full-Width Dropdown Menu */}
        <div
          className={`absolute left-0 top-full w-full bg-[#39482C] border-b shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="max-w-[1400px] mx-auto px-6 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-3 px-4 text-sm font-medium text-white hover:text-[#D35400] rounded transition-all"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;