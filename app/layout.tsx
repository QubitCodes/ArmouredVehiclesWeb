import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import { orbitron } from "@/lib/fonts";
import { Footer } from "@/components/footer";

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
    <html lang="en" className={orbitron.variable}>
      <body
        className="antialiased"
      >
        <Navbar />
                

        <main className=" pt-[120px] pb-[0px] bg-[#F0EBE3]">

          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
