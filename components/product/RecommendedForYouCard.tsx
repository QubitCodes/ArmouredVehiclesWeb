import Image from "next/image";
import { Heart } from "lucide-react";

interface SimilarProductProps {
  image?: string;
  name?: string;
  rating?: number | string;
  reviews?: number | string;
  price?: number | string;
}

const RecommendedForYouCard = ({
  image,
  name = "STP Extended Life Engine Oil Filter",
  rating = 4.7,
  reviews = 2083,
  price = 99.9,
}: SimilarProductProps) => {
  return (
    <div className="w-[190px] h-[265px] flex-shrink-0 bg-[#F5F1E6] border border-[#E2DACB] rounded-lg p-3">
      
      {/* Image */}
      <div className="relative w-full h-[125px] bg-[#F5F1E6] rounded-md overflow-hidden">
        <Image
          src={image ?? "/sample-product.jpg"}
          alt={name}
          fill
          className="object-contain"
        />

        {/* Wishlist */}
        <button className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full border flex items-center justify-center">
          <Heart size={14} className="text-gray-700" strokeWidth={1.5} />
        </button>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mt-2">
        <span className="text-[12px] text-[#CB4B16] leading-none">
          ★★★★★
        </span>
        <span className="text-[11px] text-gray-600">
          {rating} ({reviews})
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-1 mt-1 text-[17px] font-bold text-black">
        <svg
          width="16"
          height="16"
          viewBox="0 0 17 15"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M1.5 0h3.9v15H1.5z" />
        </svg>
        {price}
      </div>

      {/* Title */}
      <p className="text-[12px] text-black mt-1 line-clamp-2 leading-[14px] min-h-[32px]">
        {name}
      </p>

      {/* CTA */}
      <button className="mt-2 text-[11px] font-bold text-[#4F7A2F] uppercase tracking-wide">
        Buy Now
      </button>
    </div>
  );
};

export default RecommendedForYouCard;
