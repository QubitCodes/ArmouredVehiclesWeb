'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { profileMenuItems } from '@/lib/constants/profileMenu';
import { Footer } from '../footer';

const MobileBottomNav = () => {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);

  const isActive = (path: string) =>
    pathname === path ? 'text-[#D35400]' : 'text-[#333]';

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: '/icons/mobile-nav/home.svg',
      activeIcon: '/icons/mobile-nav/home-active.svg',
      isActive: pathname === '/',
    },
    {
      name: 'Categories',
      href: '/category',
      icon: '/icons/mobile-nav/categories.svg',
      activeIcon: '/icons/mobile-nav/categories-active.svg',
      isActive: pathname.startsWith('/category'),
    },
    {
      name: 'Cart',
      href: '/cart',
      icon: '/icons/mobile-nav/cart.svg',
      activeIcon: '/icons/mobile-nav/cart-active.svg',
      isActive: pathname.startsWith('/cart'),
    },
  ];
  const isAccountActive =
    accountOpen ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/orders') ||
    pathname.startsWith('/wishlist');

  return (
    <>
      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t z-50 lg:hidden">
        <div className="flex justify-around items-center h-[64px]">

          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center gap-1"
            >
              <Image
                src={item.isActive ? item.activeIcon : item.icon}
                alt={item.name}
                width={24}
                height={24}
              />
              <span
                className={`text-xs ${item.isActive ? 'text-[#D35400]' : 'text-[#333]'
                  }`}
              >
                {item.name}
              </span>
            </Link>
          ))}

          {/* MY ACCOUNT – ALWAYS */}
          <button
            onClick={() => setAccountOpen(true)}
            className="flex flex-col items-center gap-1"
          >
            <Image
              src={
                isAccountActive
                  ? '/icons/mobile-nav/account-active.svg'
                  : '/icons/mobile-nav/account.svg'
              }
              alt="My Account"
              width={24}
              height={24}
            />
            <span
              className={`text-xs ${isAccountActive ? 'text-[#D35400]' : 'text-[#333]'
                }`}
            >
              My Account
            </span>
          </button>
        </div>
      </nav>

      {/* FULL SCREEN ACCOUNT MODAL */}
      {accountOpen && (
        <div className="fixed inset-0 z-[999] bg-white flex flex-col">

          {/* HEADER */}
          <div className="flex items-center justify-between px-4 h-[60px] border-b">
            <span className="text-lg font-semibold text-black">My Account</span>
            <button onClick={() => setAccountOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M6 6L18 18M6 18L18 6" stroke="#000" strokeWidth="2" />
              </svg>
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto">

            {/* NOT LOGGED IN */}

            {/* NOT LOGGED IN */}
            {!isAuthenticated && (
             <>
                <div className="p-6 space-y-5">
  
                  <div className="text-center space-y-1">
                    <p className="text-[18px] font-semibold text-black">
                      Welcome to ArmoredMart
                    </p>
                    <p className="text-sm text-gray-600">
                      Sign in to continue
                    </p>
                  </div>
  
                  <Link href="/login" onClick={() => setAccountOpen(false)}>
                    <div className="w-full bg-[#D35400] text-white py-3 text-center font-bold rounded">
                      Consumer Login
                    </div>
                  </Link>
  
                  <Link href="/seller/login" onClick={() => setAccountOpen(false)}>
                    <div className="w-full border border-[#39482C] text-[#39482C] py-3 text-center font-bold rounded">
                      Seller Login
                    </div>
                  </Link>
  
                  {/* FOOTER */}
                  
                </div><Footer disableMobileBottomSpace />

             </>
            )}



            {/* LOGGED IN */}
            {isAuthenticated && (
              <>
                {/* USER INFO */}
                <div className="px-4 py-4 border-b">
                  <p className="font-medium text-black">
                    Hello, {user?.name || 'User'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user?.email || ''}
                  </p>
                </div>

                {/* MENU ITEMS */}
                <div>
                  {profileMenuItems.map((item, index) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setAccountOpen(false)}
                      className={`flex items-center justify-between px-4 py-4 text-black
        ${index !== profileMenuItems.length - 1 ? 'border-b border-[#EFEFEF]' : ''}
        hover:bg-[#F9F9F9] transition-colors`}
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={item.iconImg}
                          alt={item.name}
                          width={20}
                          height={20}
                        />
                        <span className="text-[15px] font-medium">{item.name}</span>
                      </div>

                      {/* Right Arrow */}
                      <svg
                        width="6"
                        height="10"
                        viewBox="0 0 6 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1L5 5L1 9"
                          stroke="#B5B5B5"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  ))}
                </div>



                {/* LOGOUT */}
                <button
                  onClick={async () => {
                    setAccountOpen(false);
                    await logout();
                  }}
                  className="w-full flex items-center gap-4 px-4 py-4 border-t text-red-600"
                >
                  <Image
                    src="/order/Frame8.png"
                    alt="Logout"
                    width={20}
                    height={20}
                  />
                  <span className="text-base">Log Out</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileBottomNav;
