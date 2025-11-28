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
  const currencyRef = useRef<HTMLDivElement | null>(null);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('د.إ');

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
      { name: 'Powertrain', href: '/powertrain-driveline' },
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

  // Close currency dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
            <div className="relative h-12">
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

              <div className="shrink-0 relative" ref={currencyRef}>
                <button
                  className="w-[115px] h-[50px] flex items-center justify-center border border-[#000000] hover:bg-gray-50 gap-3 px-3"
                  onClick={() => setCurrencyOpen((s) => !s)}
                  aria-haspopup="true"
                  aria-expanded={currencyOpen}
                >
                  <Image src="/icons/flags/uae.svg" alt="UAE Flag" width={24} height={16} />
                  {/* Currency SVG (provided) */}
                  <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.58934 0.0172493C1.59654 0.0275989 1.63614 0.074172 1.67394 0.11902C1.94933 0.432958 2.15632 0.943537 2.26792 1.58694C2.34171 2.00954 2.34531 2.14236 2.34531 3.75345V5.25414H1.59294C0.905366 5.25414 0.826169 5.25069 0.691174 5.22482C0.478782 5.18169 0.25919 5.06612 0.111596 4.91778C-0.0053998 4.79876 -0.00179993 4.79186 0.0053998 5.15237C0.0143995 5.45078 0.0179993 5.48356 0.0629976 5.6457C0.134995 5.90271 0.233991 6.09418 0.383386 6.26495C0.586778 6.49954 0.79377 6.63063 1.08896 6.71861C1.15196 6.73586 1.28515 6.74276 1.75673 6.74621L2.34531 6.75483V7.50173V8.25035L1.51554 8.24517L0.682175 8.24L0.53818 8.1848C0.367186 8.11925 0.289789 8.07095 0.122395 7.92778L0 7.82256L0.00719973 8.15202C0.0161994 8.45734 0.0179993 8.49184 0.0629976 8.64708C0.219592 9.19561 0.597578 9.58717 1.09616 9.71481C1.22035 9.74759 1.26895 9.74931 1.78913 9.75621L2.34531 9.76311V11.3086C2.34531 12.2418 2.33991 12.9301 2.33091 13.0474C2.32191 13.1543 2.29311 13.3544 2.26792 13.4941C2.15092 14.1375 1.94033 14.6222 1.63794 14.9362L1.57674 15H4.62043C6.44016 15 7.80091 14.9931 8.0007 14.9845C8.35169 14.9672 9.13466 14.8931 9.31105 14.8568C9.36685 14.8465 9.47125 14.831 9.53964 14.8206C9.68544 14.7999 9.92663 14.7516 10.274 14.6671C10.7636 14.5498 11.21 14.4032 11.6474 14.2169C11.7842 14.1582 12.1765 13.9668 12.2809 13.9064C12.3367 13.8753 12.4033 13.8374 12.4285 13.8253C12.4987 13.7891 12.6157 13.7167 12.7867 13.5994C12.8713 13.5407 12.9559 13.4838 12.9739 13.4717C13.0495 13.4234 13.3105 13.2147 13.4293 13.1095C13.8811 12.711 14.2591 12.2677 14.5525 11.7934C14.5939 11.7244 14.6479 11.6381 14.6713 11.6019C14.7306 11.5053 14.9754 11.0223 14.9988 10.9499C15.0096 10.9171 15.024 10.8826 15.0312 10.8757C15.078 10.817 15.348 10.0029 15.3804 9.82521C15.3912 9.76828 15.3966 9.75966 15.4416 9.75103C15.4704 9.74586 15.8898 9.74586 16.374 9.74931C17.3424 9.75621 17.3424 9.75621 17.5565 9.85108C17.6771 9.90455 17.7131 9.9287 17.8463 10.0443C18.0209 10.1943 18.0047 10.2185 17.9939 9.84246C17.9867 9.62167 17.9777 9.4854 17.9615 9.4302C17.9003 9.21803 17.8859 9.17318 17.8319 9.06624C17.6555 8.6971 17.3604 8.43319 16.9824 8.30727L16.8348 8.25552L16.2336 8.24862L15.6342 8.24L15.6414 8.03818C15.6486 7.77254 15.6486 7.24644 15.6396 6.97562L15.6324 6.75828L16.4352 6.75483C17.1228 6.75138 17.2506 6.75483 17.3262 6.7738C17.5529 6.83418 17.7059 6.91697 17.8931 7.08084L17.9975 7.17399V6.9187C17.9975 6.61511 17.9813 6.48057 17.9165 6.28047C17.7887 5.87512 17.5367 5.57325 17.1768 5.38696C16.9428 5.26621 16.9284 5.26276 16.1238 5.25759C15.6522 5.25414 15.4056 5.24724 15.393 5.23689C15.3822 5.22654 15.3732 5.20929 15.3732 5.19549C15.3732 5.18169 15.3462 5.07302 15.3102 4.95573C14.889 3.52921 14.1025 2.39593 12.9523 1.55589C12.7957 1.44032 12.4123 1.1971 12.2575 1.11431C12.1981 1.08153 12.1333 1.04703 12.1171 1.03668C12.0416 0.99701 11.6078 0.793468 11.4998 0.750345C11.435 0.722746 11.3504 0.688247 11.3126 0.674448C10.6772 0.410534 9.61164 0.160419 8.79807 0.0827967C8.66488 0.0707222 8.48848 0.0517479 8.40749 0.0448482C8.0403 0.00517479 7.53092 0 4.63843 0C2.19412 0 1.58034 0.00517479 1.58934 0.0172493ZM7.54172 0.764144C8.1501 0.798643 8.52448 0.843491 8.96187 0.945262C10.2974 1.24885 11.237 1.89052 11.9192 2.96343C11.9822 3.06348 12.2485 3.58441 12.2881 3.68963C12.4771 4.17778 12.5689 4.46757 12.6499 4.85051C12.6697 4.94365 12.6967 5.06785 12.7093 5.1265C12.7219 5.18342 12.7273 5.23689 12.7219 5.24207C12.7129 5.24897 10.9058 5.25241 8.70267 5.25069L4.69782 5.24724L4.69243 3.0307C4.69063 1.8129 4.69242 0.800368 4.69782 0.781394L4.70502 0.74862H5.98478C6.68675 0.74862 7.38872 0.75552 7.54172 0.764144ZM12.8965 6.80658C12.9091 6.88075 12.9091 8.13995 12.8965 8.20205L12.8857 8.24862L8.79087 8.24517L4.69782 8.24L4.69422 7.50862C4.69062 7.10672 4.69422 6.77208 4.69782 6.76518C4.70322 6.75656 6.44736 6.75138 8.79627 6.75138H12.8857L12.8965 6.80658ZM12.7129 9.76828C12.7219 9.79416 12.6787 10.0063 12.5905 10.3513C12.4897 10.7394 12.3529 11.131 12.2143 11.4208C12.1459 11.5691 11.975 11.8899 11.9336 11.9503C11.9138 11.9779 11.8562 12.0659 11.8058 12.1435C11.4818 12.6299 11.0192 13.0733 10.4918 13.401C10.2992 13.5183 9.90323 13.7184 9.79703 13.7494C9.77544 13.7546 9.75204 13.765 9.74304 13.7719C9.73044 13.7822 9.56664 13.8408 9.37585 13.9064C9.02486 14.0254 8.35709 14.1548 7.82071 14.2083C7.47332 14.241 7.41752 14.2428 6.08017 14.2428H4.69602V12.0055V9.76656L8.67208 9.75966C10.859 9.75621 12.6607 9.75103 12.6751 9.74758C12.6913 9.74586 12.7075 9.75621 12.7129 9.76828Z" fill="black" />
                  </svg>

                  {/* <span className="text-sm text-black">{selectedCurrency}</span> */}

                  {/* Dropdown arrow (replaced per request) */}
                  <svg width="7" height="4" viewBox="0 0 7 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.50121 0C4.52904 0 5.55478 0 6.58261 0C6.72854 0 6.84946 0.041626 6.93286 0.164423C7.02668 0.301789 7.02251 0.476618 6.91826 0.60774C6.87031 0.666016 6.81819 0.72013 6.76607 0.774244C5.81747 1.77951 4.86887 2.78686 3.92235 3.79213C3.66175 4.06894 3.3386 4.06894 3.08216 3.79421C2.10229 2.75356 1.12241 1.71499 0.140452 0.674341C0.0528886 0.582764 -0.00757169 0.482862 0.000767671 0.349658C0.0132767 0.164423 0.163385 0.0124878 0.348936 0.0020813C0.384378 0 0.417736 0 0.451093 0C1.46849 0 2.48381 0 3.50121 0Z" fill="black" />
                  </svg>
                </button>

                {currencyOpen && (
                  <div className="absolute right-0 mt-2 bg-white border shadow z-50 rounded">
                    <button
                  className="w-[115px] h-[50px] flex items-center justify-center hover:bg-gray-50 gap-3 px-3"
                  onClick={() => setCurrencyOpen((s) => !s)}
                  aria-haspopup="true"
                  aria-expanded={currencyOpen}
                >
                  <Image src="/icons/flags/uae.svg" alt="UAE Flag" width={24} height={16} />
                  {/* Currency SVG (provided) */}
                 <Image src="/icons/currency/dirham.svg" alt="AED" width={18} height={15} />
                </button>
                  </div>
                )}
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
          className={`absolute left-0 top-full w-full bg-[#39482C] border-b shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
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
