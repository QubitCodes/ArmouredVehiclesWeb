'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';

const Navbar = () => {
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
                  src="/logo.png" 
                  alt="ArmoredMart" 
                  width={180} 
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
                className="search-input w-full h-full px-4 border border-[#000000] focus:outline-none placeholder-[#6E6E6E] placeholder-opacity-100"
              />
              <button className="absolute right-0 top-0 h-full w-[50px] flex items-center justify-center bg-orange-600 text-white hover:bg-orange-700">
                <Search className="w-6 h-6" />
              </button>
            </div>

            <div className="shrink-0">
              <button className="w-[115px] h-[50px] flex items-center justify-center border border-[#000000] hover:bg-gray-50 opacity-100">
                د.إ
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Supplier Zone */}
            <Link href="/supplier" className="relative">
              <div className="bg-[#39482C] text-white clip-path-supplier hover:bg-[#2C3922] transition-colors flex items-center justify-center w-[260px] h-[47px]">
                <span className="font-black text-[20px] leading-none font-orbitron uppercase">SUPPLIER ZONE</span>
              </div>
            </Link>

            {/* Login */}
            <Link href="/login" className="relative">
              <div className="bg-[#D35400] text-white clip-path-supplier hover:bg-[#A84300] transition-colors flex items-center justify-center w-[140px] h-[47px]">
                <span className="font-black text-[20px] leading-none font-orbitron uppercase">LOGIN</span>
              </div>
            </Link>

            {/* Cart */}
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
      <div className="bg-[#39482C] text-white">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center h-[50px]">
            {/* Menu Toggle */}
            <button className="p-2 hover:bg-[#2C3922]">
              <span className="sr-only">Menu</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Navigation Items */}
            <div className="flex items-center space-x-8 ml-6">
              <Link href="/core-systems" className="text-sm font-medium hover:text-gray-200">Core Systems</Link>
              <Link href="/armor-systems" className="text-sm font-medium hover:text-gray-200">Armor Systems</Link>
              <Link href="/comms-control" className="text-sm font-medium hover:text-gray-200">Comms & Control</Link>
              <Link href="/climate-interior" className="text-sm font-medium hover:text-gray-200">Climate & Interior</Link>
              <Link href="/exterior-utility" className="text-sm font-medium hover:text-gray-200">Exterior & Utility</Link>
              <Link href="/oem-custom" className="text-sm font-medium hover:text-gray-200">OEM / Custom Support</Link>
              <Link href="/chassis-platforms" className="text-sm font-medium hover:text-gray-200">Chassis & Platforms</Link>
              <Link href="/oem-sourcing" className="text-sm font-medium hover:text-gray-200">OEM Sourcing</Link>
              <Link href="/tactical-hardware" className="text-sm font-medium hover:text-gray-200">Tactical Hardware</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;