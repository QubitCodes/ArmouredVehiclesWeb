"use client";

import ProfileSidebar from "@/components/layout/ProfileSidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F0EBE3]">
      <div className="container-figma py-10">
        {/* Mobile Layout: Stack vertically */}
        <div className="lg:hidden flex flex-col gap-4">
          <ProfileSidebar />
          {children}
        </div>

        {/* Desktop Layout: Side by side */}
        <div className="hidden lg:flex gap-6">
          {/* Sidebar - Always visible on desktop */}
          <div className="w-[280px] flex-shrink-0">
            <ProfileSidebar />
          </div>

          {/* Main Content - Changes based on route */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
