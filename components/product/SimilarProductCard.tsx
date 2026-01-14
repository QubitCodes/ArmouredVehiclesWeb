"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface SimilarProductProps {
  image?: string;
  name?: string;
  rating?: number | string;
  reviews?: number | string;
  price?: number | string;
  id?: number | string;
  isControlled?: boolean;
}

const SimilarProductCard = ({
  image,
  name,
  rating,
  reviews,
  price,
  id,
  isControlled = false,
}: SimilarProductProps) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [imgError, setImgError] = useState(false);
  const placeholder = "/placeholder.svg";
  
  const displayImage = imgError ? placeholder : (image ?? placeholder); 
  const displayName = name ?? "Product name";
  const displayRating = rating ?? "4.7";
  const displayReviews = reviews ?? "2083";
  const displayPrice = price ?? "99.9";

  const handleNavigate = () => {
    if (id) {
        router.push(`/product/${id}`);
    }
  };

  return (
    <div className="w-full max-w-[230px] rounded-xl shadow-sm border p-3 bg-[#EBE4D7] hover:shadow-md transition">
      {/* Product Image + Wishlist */}
      <div 
        className="relative w-full h-[160px] rounded-lg overflow-hidden bg-[#EBE4D7] cursor-pointer"
        onClick={handleNavigate}
      >
        <Image 
            src={displayImage} 
            alt={displayName} 
            fill 
            className="object-contain" 
            onError={() => setImgError(true)}
        />

        {/* Heart Icon */}
        <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow">
          <Heart size={18} className="text-gray-700" />
        </button>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mt-2">
        <div className="flex text-orange-500">{"★★★★★"}</div>
        <span className="text-sm text-gray-700">{displayRating} ({displayReviews})</span>
      </div>

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
                className="text-sm font-medium text-[#D35400] cursor-pointer hover:underline"
             >
                Login to view price
             </span>
          )}
      </div>



      {/* Title */}
      <p 
        className="text-sm text-black mt-1 leading-tight cursor-pointer hover:text-[#D35400] transition-colors"
        onClick={handleNavigate}
      >
        {displayName}
      </p>

      {/* BUY NOW */}
      <button 
        className="font-ruda mt-3 text-left text-[18px] font-semibold text-[#D35400]"
        onClick={handleNavigate}
      >
        BUY NOW
      </button>
    </div>
  );
};

export default SimilarProductCard;
