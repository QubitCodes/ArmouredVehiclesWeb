"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

// Mock user data - in real app this would come from auth context
const userData = {
  name: "John Martin",
  email: "info@johnmartin.com",
  initials: "JM",
  profileCompletion: 80,
};

const sidebarNav = {
  ordersActivity: [
    { id: "orders", label: "Orders", iconImg: "/order/Vector.png", href: "/orders" },
    { id: "wishlist", label: "Wishlist", iconImg: "/order/Frame.png", href: "/wishlist" },
    { id: "returns", label: "Returns", iconImg: "/order/Frame1.png", href: "/returns" },
    { id: "warranty", label: "Warranty Claims", iconImg: "/order/Frame2.png", href: "/warranty-claims" },
  ],
  myAccount: [
    { id: "profile", label: "User Profile", iconImg: "/order/Frame3.png", href: "/profile" },
    { id: "address", label: "Address", iconImg: "/order/Frame4.png", href: "/address" },
    { id: "payments", label: "Payments", iconImg: "/order/Frame5.png", href: "/payments" },
  ],
  others: [
    { id: "notifications", label: "Notifications", iconImg: "/order/Frame6.png", href: "/notifications" },
    { id: "security", label: "Security Settings", iconImg: "/order/Frame7.png", href: "/security-settings" },
  ],
};

// Mobile navigation tabs - combined from all categories
const mobileNavTabs = [
  { id: "orders", label: "Orders", iconImg: "/order/Vector.png", href: "/orders" },
  { id: "wishlist", label: "Wishlist", iconImg: "/order/Frame.png", href: "/wishlist" },
  { id: "returns", label: "Returns", iconImg: "/order/Frame1.png", href: "/returns" },
  { id: "warranty", label: "Buy", iconImg: "/order/Frame2.png", href: "/warranty-claims" },
];

export default function ProfileSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    // Handle logout logic here
    router.push("/");
  };

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden w-full">
        {/* Mobile Horizontal Nav Tabs */}
        <div className="flex overflow-x-auto pb-3 scrollbar-hide">
          {mobileNavTabs.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(item.href)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border ${
                isActive(item.href)
                  ? "bg-[#3D4A26] text-white border-[#3D4A26]"
                  : "bg-white text-[#3D4A26] border-[#3D4A26] hover:bg-[#3D4A26]/10"
              }`}
            >
              <Image 
                src={item.iconImg} 
                alt={item.label} 
                width={16} 
                height={16}
                className={isActive(item.href) ? "brightness-0 invert" : ""}
              />
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile User Greeting Card */}
        <div className="bg-[#EBE3D6] rounded-lg p-4 mt-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-[#3D4A26] flex items-center justify-center text-base font-bold text-white flex-shrink-0">
              {userData.initials}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-base text-black truncate">
                Hello, {userData.name}
              </h3>
              <p className="text-xs text-black/70 truncate">{userData.email}</p>
            </div>
          </div>
          {/* Profile Completion */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-black">Profile Completion</span>
              <span className="bg-[#D35400] px-2 py-0.5 rounded text-xs font-semibold text-white">
                {userData.profileCompletion}%
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-2">
              <div
                className="bg-[#D35400] h-2 rounded-full transition-all"
                style={{ width: `${userData.profileCompletion}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <aside className="hidden lg:block w-[280px] flex-shrink-0 space-y-6">
        {/* User Profile Card */}
        <div className="bg-[#EBE3D6] text-black p-5 rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-[#3D4A26] border-2 border-[#3D4A26] flex items-center justify-center text-xl font-bold text-white">
              {userData.initials}
            </div>
            <div>
              <h3 className="font-semibold text-lg">Hello, {userData.name}</h3>
              <p className="text-sm text-black/70">{userData.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span>Profile Completion</span>
              <span className="bg-[#D35400] px-2 py-0.5 rounded text-xs font-semibold text-white">
                {userData.profileCompletion}%
              </span>
            </div>
            <div className="w-full bg-[#FFFFFF] rounded-full h-2">
              <div
                className="bg-[#D35400] h-2 rounded-full transition-all"
                style={{ width: `${userData.profileCompletion}%` }}
              />
            </div>
          </div>
        </div>

        {/* Orders & Activity */}
        <div>
          <h4 className="font-orbitron font-extrabold text-[16px] uppercase leading-none tracking-normal text-[#1A1A1A] px-1 py-3">
            Orders & Activity
          </h4>
          <div className=" overflow-hidden bg-[#3D4A26]">
            <nav className="px-2 py-2 space-y-1">
              {sidebarNav.ordersActivity.map((item) => (
                <button
                  key={item.id}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white transition-colors ${
                    isActive(item.href)
                      ? "bg-[#4A5D3A]"
                      : "hover:bg-[#4A5D3A]"
                  }`}
                >
                  <Image src={item.iconImg} alt={item.label} width={18} height={18} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* My Account */}
        <div>
          <h4 className="font-orbitron font-extrabold text-[16px] uppercase leading-none tracking-normal text-[#1A1A1A] px-1 py-3">
            My Account
          </h4>
          <div className=" overflow-hidden bg-[#3D4A26]">
            <nav className="px-2 py-2 space-y-1">
              {sidebarNav.myAccount.map((item) => (
                <button
                  key={item.id}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white transition-colors ${
                    isActive(item.href)
                      ? "bg-[#4A5D3A]"
                      : "hover:bg-[#4A5D3A]"
                  }`}
                >
                  <Image src={item.iconImg} alt={item.label} width={18} height={18} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Others */}
        <div>
          <h4 className="font-orbitron font-extrabold text-[16px] uppercase leading-none tracking-normal text-[#1A1A1A] px-1 py-3">
            Others
          </h4>
          <div className=" overflow-hidden bg-[#3D4A26]">
            <nav className="px-2 py-2 space-y-1">
              {sidebarNav.others.map((item) => (
                <button
                  key={item.id}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white transition-colors ${
                    isActive(item.href)
                      ? "bg-[#4A5D3A]"
                      : "hover:bg-[#4A5D3A]"
                  }`}
                >
                  <Image src={item.iconImg} alt={item.label} width={18} height={18} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Log Out */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3  text-sm font-medium bg-[#3D4A26] text-white hover:bg-[#4A5D3A] transition-colors"
        >
          <Image src="/order/Frame8.png" alt="Log Out" width={18} height={18} />
          Log Out
        </button>
      </aside>
    </>
  );
}
