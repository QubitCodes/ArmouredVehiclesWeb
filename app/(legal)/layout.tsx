import React from "react";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-[#F0EBE3] text-black">
      <div className="container-figma py-16">
        {children}
      </div>
    </section>
  );
}
