'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [showMenuButton, setShowMenuButton] = useState<boolean>(true);

  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const desktopMenuRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);

  const navItems = useMemo(
    () => [
      { name: 'Core Systems', href: '/core-systems' },
      { name: 'Armor Systems', href: '/armor-systems' },
      { name: 'Comms & Control', href: '/comms-control' },
      { name: 'Climate & Interior', href: '/climate-interior' },
      { name: 'Exterior & Utility', href: '/exterior-utility' },
      { name: 'OEM / Custom Support', href: '/oem-custom' },
      { name: 'Chassis & Platforms', href: '/chassis-platforms' },
      { name: 'OEM Sourcing', href: '/oem-sourcing' },
      { name: 'Tactical Hardware', href: '/tactical-hardware' },
      { name: 'Powertrain & Driveline', href: '/powertrain-driveline' },
      { name: 'Electronics & Avionics', href: '/electronics-avionics' },
      { name: 'Weapon Integration', href: '/weapon-integration' },
      { name: 'Sensor Suites', href: '/sensor-suites' },
      { name: 'Countermeasures', href: '/countermeasures' },
      { name: 'Autonomy & AI', href: '/autonomy-ai' },
      { name: 'Logistics & Sustainment', href: '/logistics-sustainment' },
      { name: 'Training Systems', href: '/training-systems' },
      { name: 'Rugged Computing', href: '/rugged-computing' },
      { name: 'Maritime Solutions', href: '/maritime-solutions' },
      { name: 'Aerospace Components', href: '/aerospace-components' },
      { name: 'Export Compliance', href: '/export-compliance' },
    ],
    []
  );

  // Auto-resize menu calculation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const calc = () => {
      const container = containerRef.current;
      const measurer = measureRef.current;
      const menuBtn = menuButtonRef.current;
      if (!container || !measurer) return;

      const containerWidth = container.offsetWidth;
      const menuBtnWidth = menuBtn ? menuBtn.offsetWidth : 0;

      const ml6 = 24;
      const buffer = 8;

      const available = containerWidth - menuBtnWidth - ml6 - buffer;

      const children = Array.from(measurer.children) as HTMLElement[];
      let sum = 0;
      let count = 0;

      for (let i = 0; i < children.length; i++) {
        const w = children[i].offsetWidth;
        if (sum + w <= available) {
          sum += w;
          count += 1;
        } else break;
      }

      const visible = Math.max(0, Math.min(count, navItems.length));
      setVisibleCount(visible);

      setShowMenuButton(visible < navItems.length || window.innerWidth < 1024);
    };

    calc();

    const ro = new ResizeObserver(() => calc());
    if (containerRef.current) ro.observe(containerRef.current);
    if (measureRef.current) ro.observe(measureRef.current);

    window.addEventListener('resize', calc);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', calc);
    };
  }, [navItems]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50">

      {/* TOP NAVBAR */}
      <div className="bg-white border-b shadow-sm">
        <div className="container-figma">

          {/* MOBILE HEADER */}
          <div className="flex items-center justify-between py-3 lg:hidden">

            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="/logo.svg"
                alt="ArmoredMart"
                width={180}
                height={40}
                priority
              />
            </Link>

            {/* Supplier + Login + Hamburger */}
            <div className="flex items-center gap-3">

              <Link href="/supplier">
                <div className="bg-[#39482C] text-white clip-path-supplier flex items-center justify-center px-4 h-[38px]">
                  <span className="font-black text-[13px] font-orbitron uppercase">
                    SUPPLIER
                  </span>
                </div>
              </Link>

              <Link href="/login">
                <div className="bg-[#D35400] text-white clip-path-supplier flex items-center justify-center px-4 h-[38px]">
                  <span className="font-black text-[13px] font-orbitron uppercase">
                    LOGIN
                  </span>
                </div>
              </Link>

              <button
                className="p-2"
                onClick={() => setMenuOpen(!menuOpen)}
                ref={menuButtonRef}
              >
                <svg className="w-6 h-6" fill="none" stroke="black" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* MOBILE SEARCH BAR */}
          <div className="lg:hidden mt-2 pb-3">
            <div className="relative h-[48px]">
              <input
                type="text"
                placeholder="Search Products"
                className="w-full h-full px-4 border border-[#000000] focus:outline-none placeholder-[#6E6E6E]"
              />
              <button className="absolute right-0 top-0 h-full w-[50px] flex items-center justify-center bg-[#D35400] text-white">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* DESKTOP HEADER */}
          <div className="hidden lg:flex items-center justify-between py-2.5">

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

            {/* Search */}
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

            {/* Right Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/supplier">
                <div className="bg-[#39482C] text-white clip-path-supplier flex items-center justify-center w-[260px] h-[47px]">
                  <span className="font-black text-[20px] font-orbitron uppercase">
                    SUPPLIER ZONE
                  </span>
                </div>
              </Link>

              <Link href="/login">
                <div className="bg-[#D35400] text-white clip-path-supplier flex items-center justify-center w-[140px] h-[47px]">
                  <span className="font-black text-[20px] font-orbitron uppercase">
                    LOGIN
                  </span>
                </div>
              </Link>

              <Link href="/cart">
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
      {/* SECONDARY NAVBAR (Desktop Only) */}
<div className="bg-[#39482C] text-white relative hidden lg:block">
  <div className="container-figma">
    <div className="flex items-center h-[50px]" ref={containerRef}>

      {showMenuButton && (
        <button
          className="p-2 hover:bg-[#2C3922]"
          onClick={() => setMenuOpen(!menuOpen)}
          ref={menuButtonRef}
        >
          <span className="sr-only">Menu</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {visibleCount > 0 && (
        <div
          ref={desktopMenuRef}
          className="items-center ml-6 h-[50px] flex justify-start"
        >
          {navItems.slice(0, visibleCount).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center h-full px-4 text-[15.5px] font-medium whitespace-nowrap 
              transition-all duration-200 hover:bg-[#D35400] hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}

      {/* Hidden measurer */}
      <div
        ref={measureRef}
        aria-hidden
        className="invisible absolute left-[-9999px] top-[-9999px] whitespace-nowrap flex items-center"
      >
        {navItems.map((item) => (
          <div
            key={item.name}
            className="h-[50px] px-4 text-[15.5px] font-medium whitespace-nowrap"
          >
            {item.name}
          </div>
        ))}
      </div>

    </div>
  </div>

  {/* Dropdown */}
  <div
    className={`absolute left-0 top-full w-full bg-[#39482C] border-b shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
      menuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
    }`}
  >
    <div className="container-figma py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-4">
        {navItems.slice(visibleCount).map((item) => (
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
