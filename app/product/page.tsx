"use client";

import DesktopLayout from "./components/desktop/DesktopLayout";
import MobileLayout from "./components/mobile/MobileLayout";



export default function ProductDetailsPage() {
  return (
    <>
    <section className="bg-[#F0EBE3] pt-[48px] md:pt-0">
  <div className="md:hidden">
    <MobileLayout />
  </div>

  <div className="hidden md:block">
    <DesktopLayout />
  </div>
</section>


    </>
  );
}
