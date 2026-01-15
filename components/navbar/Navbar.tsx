'use client';

import { useCartStore } from '@/lib/cart-store';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { profileMenuItems } from '@/lib/constants/profileMenu';
import { searchProducts } from '@/app/services/auth';
import { useRouter } from 'next/navigation';



// Profile Menu Icon Component
const ProfileMenuIcon = ({ icon }: { icon: string }) => {
  const icons: { [key: string]: React.ReactNode } = {
    orders: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.17 7.44L12 12.55L20.77 7.47" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 21.61V12.54" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.93 2.48L4.59 5.44C3.38 6.11 2.39 7.79 2.39 9.17V14.82C2.39 16.2 3.38 17.88 4.59 18.55L9.93 21.52C11.07 22.15 12.94 22.15 14.08 21.52L19.42 18.55C20.63 17.88 21.62 16.2 21.62 14.82V9.17C21.62 7.79 20.63 6.11 19.42 5.44L14.08 2.47C12.93 1.84 11.07 1.84 9.93 2.48Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    wishlist: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.69C2 5.6 4.49 3.1 7.56 3.1C9.38 3.1 10.99 3.98 12 5.34C13.01 3.98 14.63 3.1 16.44 3.1C19.51 3.1 22 5.6 22 8.69C22 15.69 15.52 19.82 12.62 20.81Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    returns: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.11 5.08C9.98 4.82 10.94 4.65 12 4.65C16.79 4.65 20.67 8.53 20.67 13.32C20.67 18.11 16.79 21.99 12 21.99C7.21 21.99 3.33 18.11 3.33 13.32C3.33 11.54 3.87 9.88 4.79 8.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.87 5.32L10.76 2" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.87 5.32L11.24 7.78" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    warranty: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.49 2.23L5.5 4.11C4.35 4.54 3.41 5.9 3.41 7.12V14.55C3.41 15.73 4.19 17.28 5.14 17.99L9.44 21.2C10.85 22.26 13.17 22.26 14.58 21.2L18.88 17.99C19.83 17.28 20.61 15.73 20.61 14.55V7.12C20.61 5.89 19.67 4.53 18.52 4.1L13.53 2.23C12.68 1.92 11.32 1.92 10.49 2.23Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.05 11.87L10.66 13.48L14.96 9.18" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    profile: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    address: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="#666" strokeWidth="1.5" />
        <path d="M3.62 8.49C5.59 -0.17 18.42 -0.16 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39 20.54C5.63 17.88 2.47 13.57 3.62 8.49Z" stroke="#666" strokeWidth="1.5" />
      </svg>
    ),
    payments: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 8.5H14.5" stroke="#666" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 16.5H8" stroke="#666" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.5 16.5H14.5" stroke="#666" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 12.03V16.11C22 19.62 21.11 20.5 17.56 20.5H6.44C2.89 20.5 2 19.62 2 16.11V7.89C2 4.38 2.89 3.5 6.44 3.5H14.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 3.5V9.5L22 7.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 9.5L18 7.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    notifications: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 6.44V9.77" stroke="#666" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" />
        <path d="M12.02 2C8.34 2 5.36 4.98 5.36 8.66V10.76C5.36 11.44 5.08 12.46 4.73 13.04L3.46 15.16C2.68 16.47 3.22 17.93 4.66 18.41C9.44 20 14.61 20 19.39 18.41C20.74 17.96 21.32 16.38 20.59 15.16L19.32 13.04C18.97 12.46 18.69 11.43 18.69 10.76V8.66C18.68 5 15.68 2 12.02 2Z" stroke="#666" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" />
        <path d="M15.33 18.82C15.33 20.65 13.83 22.15 12 22.15C11.09 22.15 10.25 21.77 9.65 21.17C9.05 20.57 8.67 19.73 8.67 18.82" stroke="#666" strokeWidth="1.5" strokeMiterlimit="10" />
      </svg>
    ),
    security: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.49 2.23L5.5 4.11C4.35 4.54 3.41 5.9 3.41 7.12V14.55C3.41 15.73 4.19 17.28 5.14 17.99L9.44 21.2C10.85 22.26 13.17 22.26 14.58 21.2L18.88 17.99C19.83 17.28 20.61 15.73 20.61 14.55V7.12C20.61 5.89 19.67 4.53 18.52 4.1L13.53 2.23C12.68 1.92 11.32 1.92 10.49 2.23Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 12.5C13.1046 12.5 14 11.6046 14 10.5C14 9.39543 13.1046 8.5 12 8.5C10.8954 8.5 10 9.39543 10 10.5C10 11.6046 10.8954 12.5 12 12.5Z" stroke="#666" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 12.5V15.5" stroke="#666" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    help: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 18.43H13L8.55 21.39C7.89 21.83 7 21.36 7 20.56V18.43C4 18.43 2 16.43 2 13.43V7.43C2 4.43 4 2.43 7 2.43H17C20 2.43 22 4.43 22 7.43V13.43C22 16.43 20 18.43 17 18.43Z" stroke="#666" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 11.36V11.15C12 10.47 12.42 10.11 12.84 9.82C13.25 9.54 13.66 9.18 13.66 8.52C13.66 7.6 12.92 6.86 12 6.86C11.08 6.86 10.34 7.6 10.34 8.52" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.9955 13.75H12.0045" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };

  return icons[icon] || null;
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [showMenuButton, setShowMenuButton] = useState<boolean>(true);

  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const desktopMenuRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const cartCount = useCartStore((s) => s.count());

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  // Handle search on Enter key press
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // secondary navbar scroll state hide
  const [showSecondaryNav, setShowSecondaryNav] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        // scrolling down
        setShowSecondaryNav(false);
      } else {
        // scrolling up
        setShowSecondaryNav(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // Auth state from provider
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Profile dropdown menu items - using icons from icons/profile folder (pf0-pf9)



  const [navItems, setNavItems] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categories = await import("@/lib/api").then((m) => m.default.categories.getAll());
        // Map to expected structure if needed, or just use data
        // We only need id and name for the navbar
        if (Array.isArray(categories)) {
           setNavItems(categories.map((c: any) => ({ id: c.id, name: c.name })));
        }
      } catch (error) {
        console.error("Failed to load navbar categories", error);
      }
    }
    fetchCategories();
  }, []);

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
    
    // Initial calculation with a small delay to ensure DOM is ready/fonts loaded
    requestAnimationFrame(calc);

    const ro = new ResizeObserver(() => calc());
    if (containerRef.current) ro.observe(containerRef.current);
    if (measureRef.current) ro.observe(measureRef.current);

    window.addEventListener('resize', calc);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', calc);
    };
  }, [navItems]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
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
                src="/final-logo (1).svg"
                alt="ArmoredMart"
                width={180}
                height={40}
                priority
              />
            </Link>

            {/* Supplier + Login/Profile + Hamburger */}
            <div className="flex items-center gap-3">

              <Link href="/supplier" className="hidden">
                <div className="bg-[#39482C] text-white hover:bg-[#D35400] clip-path-supplier flex items-center justify-center px-4 h-[38px]">
                  <span className="font-black text-[13px] font-orbitron uppercase">
                    SUPPLIER
                  </span>
                </div>
              </Link>

              {isAuthenticated ? (
                <>
                  {/* Profile Icon */}
                  {/* <Link href="/profile" className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-[#39482C] flex items-center justify-center text-white text-sm font-bold">
        {user.name.charAt(0)}
      </div>
    </Link> */}

                  {/* Cart */}
                  {/* <Link href="/cart" className="relative">
      <Image
        src="/cart.svg"
        alt="Shopping Cart"
        width={28}
        height={28}
        className="hover:opacity-80 transition-opacity"
      />
      {0 > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D35400] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {0}
        </span>
      )}
    </Link> */}
                </>
              ) : (
                <Link href="/login" className="hidden">
                  <div className="bg-[#D35400] text-white hover:bg-[#39482C] clip-path-supplier flex items-center justify-center px-4 h-[38px]">
                    <span className="font-black text-[13px] font-orbitron uppercase">
                      LOGIN
                    </span>
                  </div>
                </Link>
              )}


              <button
                className="p-2"
                onClick={() => setMenuOpen(!menuOpen)}
                ref={menuButtonRef}
              >
                {menuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="black" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="black" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* MOBILE SEARCH BAR */}
          <div className="lg:hidden mt-2 pb-3">
            <div className="relative h-12">
              <input
                type="text"
                placeholder="Search Products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full h-full px-4 border border-[#000000] focus:outline-none placeholder-[#6E6E6E] text-black"
              />
              <button 
                onClick={handleSearch}
                disabled={isSearching}
                className="absolute right-0 top-0 h-full w-[50px] flex items-center justify-center bg-[#D35400] text-white disabled:opacity-50"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* MOBILE MENU with Background Overlay */}
          {menuOpen && (
            <>
              {/* Dark Overlay - covers the page behind the menu */}
              <div 
                className="lg:hidden fixed inset-0 top-0 bg-black/60 z-40"
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
              />
              
              {/* Menu Content */}
              <div className="lg:hidden absolute left-0 right-0 top-full bg-white shadow-lg z-50">
                <div className="flex flex-col">
                  {/* Supplier Zone */}
                  <Link
                    href="https://amadmin.vercel.app/vendor/login/"
                    target="_blank"
                    className="flex items-center justify-center gap-3 px-4 py-4 bg-[#39482C] text-white font-orbitron font-bold hover:bg-[#4a5c3a] transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.17 7.44L12 12.55L20.77 7.47" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 21.61V12.54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9.93 2.48L4.59 5.44C3.38 6.11 2.39 7.79 2.39 9.17V14.82C2.39 16.2 3.38 17.88 4.59 18.55L9.93 21.52C11.07 22.15 12.94 22.15 14.08 21.52L19.42 18.55C20.63 17.88 21.62 16.2 21.62 14.82V9.17C21.62 7.79 20.63 6.11 19.42 5.44L14.08 2.47C12.93 1.84 11.07 1.84 9.93 2.48Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>SUPPLIER ZONE</span>
                  </Link>

                  {/* Login / Profile */}
                  {isAuthenticated ? (
                    <Link
                      href="/profile"
                      className="flex items-center justify-center gap-3 px-4 py-4 bg-[#D35400] text-white font-orbitron font-bold hover:bg-[#b84d00] transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{user?.name || 'PROFILE'}</span>
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-3 px-4 py-4 bg-[#D35400] text-white font-orbitron font-bold hover:bg-[#b84d00] transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>LOGIN</span>
                    </Link>
                  )}
                </div>
              </div>
            </>
          )}

          {/* DESKTOP HEADER */}
          <div className="hidden lg:flex items-center justify-between py-0">

            {/* Logo */}
            <div className="shrink-0">
              <Link href="/">
                <Image
                  src="/final-logo (1).svg"
                  alt="ArmoredMart"
                  width={250}
                  height={40}
                  priority
                />
              </Link>
            </div>

            {/* Search */}
            <div className="flex items-center flex-1 max-w-[450px] mx-8">
              <div className="relative h-[50px] w-full">
                <input
                  type="text"
                  placeholder="Search Products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full h-full px-4 border border-[#000000] focus:outline-none placeholder-[#6E6E6E] text-black"
                />
                <button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="absolute right-0 top-0 h-full w-[50px] flex items-center justify-center bg-[#D35400] text-white hover:bg-black disabled:opacity-50"
                >
                  <Search className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Right Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="https://amadmin.vercel.app/vendor/login/" target='_blank'>
                <div className="bg-[#39482C] hover:bg-[#D35400] text-white clip-path-supplier flex items-center justify-center w-[260px] h-[45px]">
                  <span className="font-black text-[20px] font-orbitron uppercase">
                    SUPPLIER ZONE
                  </span>
                </div>
              </Link>

              {isAuthenticated ? (
                <>
                  {/* Profile with Name and Dropdown */}
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                      <span className="text-black font-inter text-[16px]">{user?.name || 'User'}</span>
                      <Image
                        src="/icons/profileicon.svg"
                        alt="Profile"
                        width={26}
                        height={26}
                        className="rounded-full"
                      />
                      {/* Arrow */}
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`}
                      >
                        <path d="M1 1L5 5L9 1" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {/* Profile Dropdown Menu */}
                    {profileDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-[250px] bg-white border border-[#E5E5E5] shadow-lg z-50">
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-[#E5E5E5] bg-white">
                          <p className="font-inter font-medium text-[14px] text-black">Hello, {user?.name || 'User'}</p>
                          <p className="font-inter text-[12px] text-[#666]">{user?.email || ''}</p>
                        </div>

                        {/* Menu Items */}
                        <div>
                          {profileMenuItems
                            .filter((item) =>
                              [
                                "User Profile",
                                "Orders",
                                "Notifications",
                                "Security Settings",
                              ].includes(item.name)
                            )
                            .map((item, index, arr) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className={`flex items-center justify-between px-4 py-2.5 hover:bg-[#F5F5F5] transition-colors ${index < arr.length - 1 ? 'border-b border-[#E5E5E5]' : ''
                                }`}
                              onClick={() => setProfileDropdownOpen(false)}
                            >
                              <div className="flex items-center gap-3">
                                <Image
                                  src={item.iconImg}
                                  alt={item.name}
                                  width={18}
                                  height={18}
                                />
                                <span className="font-inter text-[14px] text-black">{item.name}</span>
                              </div>
                              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L1 9" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </Link>
                          ))}
                        </div>

                        {/* Logout */}
                        <div className="border-t border-[#E5E5E5]">
                          <button
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F5F5F5] transition-colors"
                            onClick={async () => {
                              setProfileDropdownOpen(false);
                              await logout();
                            }}
                          >
                            <Image
                              src="/order/Frame8.png"
                              alt="Log Out"
                              width={18}
                              height={18}
                            />
                            <span className="font-inter text-[14px] text-black">Log Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cart with count */}
                  <Link href="/cart" className="relative">
                    <Image
                      src="/cart.svg"
                      alt="Shopping Cart"
                      width={30}
                      height={30}
                      className="hover:opacity-80 transition-opacity"
                    />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D35400] text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <div className="bg-[#D35400] hover:bg-[#39482C] text-white clip-path-supplier flex items-center justify-center w-[140px] h-[45px]">
                      <span className="font-black text-[20px] font-orbitron uppercase">
                        LOGIN
                      </span>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
      {/* SECONDARY NAVBAR (Desktop Only) */}
      <div
        className={`bg-[#39482C] text-white relative hidden lg:block
  transition-all duration-300 ease-in-out
  ${showSecondaryNav ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
  `}
      >
        <div className="container-figma">
          <div className="flex items-center h-[50px]" ref={containerRef}>

            {visibleCount > 0 && (
              <div
                ref={desktopMenuRef}
                className="items-center ml-6 h-[50px] flex justify-start"
              >
                {navItems.slice(0, visibleCount).map((item) => (
                  <Link
                    key={item.id}
                    href={`/products?category_id=${item.id}`}
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
                  key={item.id}
                  className="h-[50px] px-4 text-[15.5px] font-medium whitespace-nowrap"
                >
                  {item.name}
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </nav>
  );
};

export default Navbar;
