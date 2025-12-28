import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer";
import MobileBottomNav from "@/components/mobile/MobileBottomNav";
import AOSProvider from "@/components/AOSProvider";
import { orbitron } from "@/lib/fonts";
import { Ruda } from "next/font/google";

const ruda = Ruda({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ruda",
  display: "swap",
});

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
    <html lang="en" className={`${ruda.variable} ${orbitron.variable}`}>
      <body className="antialiased">
        {/* AOS animations */}
        <AOSProvider />

        {/* Top navigation */}
        <Navbar />

        {/* Main content */}
        <main className="pt-[96px] pb-0 md:pb-0 bg-[#F0EBE3]">
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* Mobile bottom navigation */}
        <MobileBottomNav />
      </body>
    </html>
  );
}
