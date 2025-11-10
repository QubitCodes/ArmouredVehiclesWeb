import { Orbitron } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArmoredMart",
  description: "The world's first compliance integrated defense e-store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} antialiased`}
      >
        <Navbar />
        <main className="min-h-screen pt-[127px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
