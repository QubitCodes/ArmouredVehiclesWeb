import Image from "next/image";
import { Heart } from "lucide-react";

interface SimilarProductProps {
  image?: string;
  name?: string;
  rating?: number | string;
  reviews?: number | string;
  price?: number | string;
}

const SimilarProductCard = ({
  image,
  name,
  rating,
  reviews,
  price,
}: SimilarProductProps) => {
  const displayImage = image ?? "/sample-product.jpg";
  const displayName = name ?? "Product name";
  const displayRating = rating ?? "4.7";
  const displayReviews = reviews ?? "2083";
  const displayPrice = price ?? "99.9";

  return (
    <div className="w-full max-w-[230px] rounded-xl shadow-sm border p-3 bg-[#EBE4D7] hover:shadow-md transition">
      {/* Product Image + Wishlist */}
      <div className="relative w-full h-[160px] rounded-lg overflow-hidden bg-[#EBE4D7]">
        <Image src={displayImage} alt={displayName} fill className="object-contain" />

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

      {/* Price */}
      <div className="text-[20px] font-semibold text-black mt-1">฿{displayPrice}</div>

      {/* Title */}
      <p className="text-sm text-black mt-1 leading-tight">{displayName}</p>

      {/* BUY NOW */}
      <button className="mt-3 text-left text-[18px] font-semibold text-[#D35400]">BUY NOW</button>
    </div>
  );
};

export default SimilarProductCard;
