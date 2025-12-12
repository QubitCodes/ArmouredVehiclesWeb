import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer";
import MobileBottomNav from "@/components/mobile/MobileBottomNav";
import { orbitron } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "ArmoredMart",
  description: "The world's first compliance integrated defense e-store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={orbitron.variable}>
      <body className="antialiased">
        <Navbar />

        {/* Main Content */}
        <main className="pt-[96px] bg-[#F0EBE3]">
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </body>
    </html>
  );
}
