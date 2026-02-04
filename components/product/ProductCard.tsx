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
import { api } from "@/lib/api";

import { useWishlist } from "@/hooks/use-wishlist";

interface ProductCardProps {
  id?: string;
  sku?: string;
  images: string[];
  name: string;
  rating: number;
  reviews: string;
  price: number;
  delivery: string;
  action: "ADD TO CART" | "SUBMIT AN INQUIRY";
  isControlled?: boolean;
}

export default function ProductCard({
  id,
  sku,
  images,
  name,
  rating,
  reviews,
  price,
  delivery,
  action,
  placeholderImage = "/placeholder.jpg",
  isControlled = false,
}: ProductCardProps & { placeholderImage?: string }) {
  const [slide, setSlide] = useState(0);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const intervalRef = useRef<number | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Wishlist Hook
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isLiked = isInWishlist(id);

  // Reset image source when images change
  useEffect(() => {
    setImgSrc(null);
  }, [images]);

  // displayImage logic:
  // 1. If we have a state override (imgSrc), use it (unless it's null). 
  //    Actually simpler: derive display URL.
  //    If images[slide] exists, try that. If it fails, fallback.

  // Better approach for NextJS Image:
  // Use state to track if current slide failed.
  // But we have cycling slides. 
  // Let's keep it simple: If any image fails, we can show placeholder for that slot? Or just stop cycling?
  // Let's just track if the *current* displayed URL failed.
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [slide, images]);

  const currentImage = (images && images.length > 0) ? images[slide] : placeholderImage;


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
    <div className="bg-white border border-[#cecbc5] overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col w-full h-full">
      {/* ---------- IMAGE SECTION ---------- */}
      <div
        className="relative bg-[#EBE3D6] w-full h-[180px] md:h-[200px] group overflow-hidden border-b border-[#cecbc5]"
        onMouseEnter={startHoverCycle}
        onMouseLeave={stopHoverCycle}
      >
        {/* Image display with hover cycling */}
        <Image
          src={imageError ? placeholderImage : currentImage}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-all duration-300"
          onError={() => setImageError(true)}
        />

        {/* Wishlist Icon */}
        {isAuthenticated && (
          <button
            onClick={async (e) => {
              e.preventDefault(); // Prevent link navigation
              // Require auth to add to wishlist
              if (!isAuthenticated) {
                router.push("/login");
                return;
              }
              try {
                await toggleWishlist(id);
              } catch (e) {
                // noop
              }
            }}
            className="absolute top-2 md:top-3 right-2 md:right-3 bg-[#F0EBE3] rounded-full p-1 shadow-md hover:scale-105 transition z-10"
          >
            <Heart
              size={16}
              className={
                isLiked ? "fill-[#D35400] text-[#D35400] md:w-5 md:h-5" : "text-[#3D4A26] md:w-5 md:h-5"
              }
            />
          </button>
        )}

        {/* Controlled badge overlapping the image - show on all sizes (match mobile) */}
        {isControlled && (
          <div className="absolute bottom-0 right-0 md:bottom-0 md:right-0 bg-red-100 text-red-600 text-[10px] md:text-xs px-2 py-0.5 font-bold uppercase tracking-wider border border-red-200 z-20">
            Controlled
          </div>
        )}

        {/* No slider controls or indicators; hover cycles images */}
      </div>

      {/* ---------- PRODUCT DETAILS ---------- */}
      <div className="p-2 md:p-4 flex flex-col bg-[#EBE3D6] flex-1">
        {/* TOP CONTENT – fixed height for consistency */}
        <div>
          {/* TITLE - min height ensures equal card heights */}
          <h3 className="text-[13px] md:text-[16px] font-semibold text-gray-900 leading-[1.25] line-clamp-2 min-h-[32px] md:min-h-[40px]">
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
            <div className="flex items-center justify-between w-full">
              <p className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-1">
                <Image src="/icons/currency/dirham.svg" alt="Currency" width={16} height={16} />
                {price.toLocaleString()}
              </p>
              {/* Desktop price-level badge removed to use overlay badge instead */}
            </div>
          ) : (
            <span
              onClick={(e) => {
                e.preventDefault();
                const currentPath = window.location.pathname;
                router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
              }}
              className="text-sm font-medium text-black cursor-pointer hover:underline"
            >
              Login to access product pricing
            </span>
          )}

          {/* Delivery */}
          {/* Delivery info removed as per request */}
          {/* <div className="flex items-center gap-1 mt-2 whitespace-nowrap">
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
    </div> */}
        </div>

        {/* ✅ THIS PUSHES EMPTY SPACE BELOW DELIVERY */}
        <div className="flex-grow" />
      </div>


      {/* ---------- FULL-WIDTH BUTTON ---------- */}
      {/* Hide button if user is not authenticated OR if action is inquire */}
      {isAuthenticated && action === "ADD TO CART" && (
        <button
          className="w-full py-2 md:py-3 font-black font-[Orbitron] uppercase text-sm md:text-[18px] tracking-wide transition bg-[#000000] text-white hover:bg-[#D35400]"
          onClick={async (e) => {
            e.preventDefault();
            if (action === "ADD TO CART" && id) {
              addItem(
                {
                  id: String(id ?? name + "-" + price),
                  name,
                  price: Number(price) ?? 0,
                  image: (images && images.length > 0 ? images[0] : "/product/rim.png"),
                },
                1
              );

              if (id) {
                await syncAddToServer(id, 1);
              }
            }
          }}
        >
          {action}
        </button>
      )}

    </div>
  );
}
