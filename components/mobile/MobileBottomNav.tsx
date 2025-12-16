"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: "/icons/mobile-nav/home.svg",
      iconActive: "/icons/mobile-nav/home-active.svg",
    },
    {
      label: "Categories",
      href: "/categories",
      icon: "/icons/mobile-nav/categories.svg",
      iconActive: "/icons/mobile-nav/categories-active.svg", // same icon, no active state
    },
    {
      label: "Cart",
      href: "/cart",
      icon: "/icons/mobile-nav/cart.svg",
      iconActive: "/icons/mobile-nav/cart-active.svg",
    },
    {
      label: "My Account",
      href: "/account",
      icon: "/icons/mobile-nav/account.svg",
      iconActive: "/icons/mobile-nav/account-active.svg",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 z-50 md:hidden py-2">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center text-xs"
            >
              <Image
                src={isActive ? item.iconActive : item.icon}
                alt={item.label}
                width={28}
                height={28}
              />
              <span
                className={`mt-1 ${
                  isActive ? "text-[#D35400] font-semibold" : "text-gray-600"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
