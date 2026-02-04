"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { syncAddToServer } from "@/lib/cart-sync";
import { useCartStore } from "@/lib/cart-store";


interface SimilarProductProps {
  image?: string;
  name?: string;
  rating?: number | string;
  reviews?: number | string;
  price?: number | string;
  id?: number | string;
  sku?: string;
  isControlled?: boolean;
  action?: "ADD TO CART" | "SUBMIT AN INQUIRY";
}

const SimilarProductCard = ({
  image,
  name,
  rating,
  reviews,
  price,
  id,
  sku,
  isControlled = false,
  action = "ADD TO CART",
}: SimilarProductProps) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [imgError, setImgError] = useState(false);
  const placeholder = "/placeholder.jpg";

  const displayImage = imgError ? placeholder : (image ?? placeholder);
  const displayName = name ?? "Product name";
  const displayRating = rating ?? "4.7";
  const reviewsCount = Number(reviews ?? 0);
  const hasReviews = Number.isFinite(reviewsCount) && reviewsCount > 0;
  const displayPrice = price ?? "99.9";
  const addItem = useCartStore((s) => s.addItem);
  console.log('SimilarProductCard action:', action);


  const ratingValue = (() => {
    if (!hasReviews) return 0;
    const n = Number(displayRating);
    if (Number.isNaN(n)) return 0;
    return Math.min(5, Math.max(0, n));
  })();
  const ratingPercent = (ratingValue / 5) * 100;

  const handleNavigate = () => {
    const identifier = sku ? sku.replace('SKU-', '') : id;
    if (identifier) {
      router.push(`/product/${identifier}`);
    }
  };

  return (
    <div className="w-full max-w-[230px] rounded-xl shadow-sm border p-3 bg-[#EBE4D7] hover:shadow-md transition">
      {/* Product Image + Wishlist */}
      <div
        className="relative w-full h-[160px] rounded-lg overflow-hidden bg-[#fff] cursor-pointer border-b border-[#E2DACB]"
        onClick={handleNavigate}
      >
        <Image
          src={displayImage}
          alt={displayName}
          fill
          className="object-cover"
          onError={() => setImgError(true)}
        />

        {/* Heart Icon */}
        <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow">
          <Heart size={18} className="text-gray-700" />
        </button>
      </div>

      {/* Rating */}
      <div className={`flex items-center ${hasReviews ? 'gap-2' : ''} mt-2`}>
        <div className="relative leading-none">
          {/* <div className="text-gray-300">★★★★★</div> */}
          <div
            className="absolute top-0 left-0 overflow-hidden text-[#D35400]"
            style={{ width: `${ratingPercent}%` }}
            aria-hidden="true"
          >
            ★★★★★
          </div>
        </div>
        {hasReviews ? (
          <span className="text-sm text-[#D35400]">{displayRating} ({reviewsCount})</span>
        ) : (
          <span className="text-sm text-[#D35400]">No reviews yet</span>
        )}
      </div>

      {/* Title */}
      <p
        className="text-sm text-black mt-1 leading-tight cursor-pointer hover:text-[#D35400] transition-colors"
        onClick={handleNavigate}
      >
        {displayName}
      </p>

      {/* Price - Conditional Display */}
      <div className="mt-1">
        {isLoading ? (
          <span className="text-sm text-gray-400 font-semibold">—</span>
        ) : isAuthenticated ? (
          <div className="flex items-center justify-between w-full">
            <div className="text-[20px] font-semibold text-black">AED {Number(displayPrice).toLocaleString()}</div>
            {isControlled && (
              <div className="inline-block bg-red-100 text-red-600 text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider border border-red-200">
                Controlled
              </div>
            )}
          </div>
        ) : (
          <span
            onClick={() => router.push("/login")}
            className="text-sm font-medium text-black cursor-pointer hover:underline"
          >
            Login to access product pricing
          </span>
        )}
      </div>





      {isAuthenticated && action === "ADD TO CART" && (
        <button
          className="w-full py-2 md:py-3 font-black font-[Orbitron] uppercase text-sm md:text-[18px] tracking-wide transition bg-[#000000] text-white hover:bg-[#D35400]"
          onClick={async (e) => {
            e.preventDefault();
            if (action === "ADD TO CART" && id) {
              addItem(
                {
                  id: String(id ?? displayName + "-" + price),
                  name: displayName,
                  price: Number(displayPrice),
                  image: displayImage,
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
      )}
    </div>
  );
};

export default SimilarProductCard;
