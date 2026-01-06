"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { syncAddToServer } from "@/lib/cart-sync";
import ProductRating from "./ProductRating";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";




interface ProductCardProps {
  id?: string;
  images: string[]; // <<--------- updated
  name: string;
  rating: number;
  reviews: string;
  price: number;
  delivery: string;
  action: "ADD TO CART" | "SUBMIT AN INQUIRY";
}

export default function ProductCard({
  id,
  images,
  name,
  rating,
  reviews,
  price,
  delivery,
  action,
}: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const [slide, setSlide] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();


  // delivery date
  const getDeliveryRange = () => {
    const today = new Date();

    const from = new Date(today);
    from.setDate(today.getDate() + 8);

    const to = new Date(today);
    to.setDate(today.getDate() + 8);

    const format = (d: Date) =>
      d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });

      //  return `${format(from)} – ${format(to)}`;

    return ` ${format(to)}`;
  };




  const startHoverCycle = () => {
    if (intervalRef.current != null || images.length <= 1) return;
    intervalRef.current = window.setInterval(() => {
      setSlide((prev) => (prev + 1) % images.length);
    }, 700);
  };

  const stopHoverCycle = () => {
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSlide(0);
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);



  return (
    <div className="bg-white border border-[#E8E3D6] overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col">
      {/* ---------- IMAGE SECTION ---------- */}
      <div
        className="relative bg-[#EBE3D6] w-auto max-h-[205px] h-[200px] md:h-[300px] flex items-center justify-center group"
        onMouseEnter={startHoverCycle}
        onMouseLeave={stopHoverCycle}
      >
        {/* Image display with hover cycling */}
        <Image
          src={images[slide]}
          alt={name}
          width={375}
          height={390}
          // fill
          className="object-cover w-full h-full transition-all duration-300"
        />

        {/* Wishlist Icon */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-2 md:top-3 right-2 md:right-3 bg-[#F0EBE3] rounded-full p-1 shadow-md hover:scale-105 transition"
        >
          <Heart
            size={16}
            className={
              liked ? "fill-[#D35400] text-[#D35400] md:w-5 md:h-5" : "text-[#3D4A26] md:w-5 md:h-5"
            }
          />
        </button>

        {/* No slider controls or indicators; hover cycles images */}
      </div>

      {/* ---------- PRODUCT DETAILS ---------- */}
     <div className="p-2 md:p-4 flex flex-col bg-[#F0EBE3] flex-1">
  {/* TOP CONTENT – natural height */}
  <div>
    {/* TITLE (NO min-h ❌) */}
    <h3 className="text-[13px] md:text-[16px] font-semibold text-gray-900 leading-[1.25] line-clamp-2">
      {name}
    </h3>

    {/* Rating */}
    <div className="flex items-center gap-1 mt-1 text-xs md:text-sm">
      <ProductRating rating={rating} reviewCount={Number(reviews)} />
    </div>

    <hr className="border-t border-[#CCCCCC] my-2 md:my-3" />

    {/* Price */}
    {isLoading ? (
      <span className="text-sm text-gray-400">—</span>
    ) : isAuthenticated ? (
      <p className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-1">
        <Image src="/icons/currency/dirham.svg" alt="Currency" width={16} height={16} />
        {price.toLocaleString()}
      </p>
    ) : (
      <span
        onClick={() => router.push("/login")}
        className="text-sm font-medium text-[#D35400] cursor-pointer hover:underline"
      >
        Login to view price
      </span>
    )}

    {/* Delivery */}
    <div className="flex items-center gap-1 mt-2 whitespace-nowrap">
      <Image
        src="/icons/delivery.svg"
        alt="delivery"
        width={14}
        height={14}
        className="flex-shrink-0"
      />
      <span className="text-[9px] sm:text-[10px] md:text-sm text-gray-600 leading-tight">
        <span className="text-[#D35400]">Standard</span> Delivery by{" "}
        <span className="font-medium">{getDeliveryRange()}</span>
      </span>
    </div>
  </div>

  {/* ✅ THIS PUSHES EMPTY SPACE BELOW DELIVERY */}
  <div className="flex-grow" />
</div>


      {/* ---------- FULL-WIDTH BUTTON ---------- */}
      <button
        className="w-full py-2 md:py-3 font-black font-[Orbitron] uppercase text-sm md:text-[18px] tracking-wide transition bg-[#000000] text-white hover:bg-[#D35400]"
        onClick={async () => {
          if (action === "ADD TO CART" && id) {
            addItem(
              {
                id: String(id ?? name + "-" + price),
                name,
                price: Number(price) ?? 0,
                image: images?.[0] ?? "/product/rim.png",
              },
              1
            );

            const pid = id ? Number(id) : NaN;
            if (Number.isFinite(pid)) {
              await syncAddToServer(pid, 1);
            }
          }
        }}
      >
        {action}
      </button>

    </div>
  );
}
