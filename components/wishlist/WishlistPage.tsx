"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Trash2, Star } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { type WishlistItem } from "@/app/services/wishlist";
import { useWishlist } from "@/hooks/use-wishlist";

type UiWishlistItem = {
  id: string; // wishlist item id
  name: string;
  price?: number;
  images: string[];
  rating?: number;
  reviews?: string;
  deliveryText: string;
  isHighValue: boolean;
  isControlled?: boolean;
};

export default function WishlistPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const handleRemove = async (itemId: string) => {
    await removeItem(itemId);
  };

  // Use centralized hook
  const { wishlistItems: rawItems, removeItem, isLoading: isListLoading, isError } = useWishlist();

  const items: UiWishlistItem[] = useMemo(() => {
    return (rawItems as WishlistItem[]).map((wi) => {
      const p: any = wi.product;
      const rawPrice = p?.price ?? p?.base_price;
      const priceNum = typeof rawPrice === "string" ? Number(rawPrice) : rawPrice;

      // Prefer media -> gallery -> image
      let normalizedImages: string[] = [];
      const media: any[] = Array.isArray(p?.media) ? p.media : [];
      if (media.length) {
        normalizedImages = media
          .filter((m: any) => !!m?.url)
          .sort((a: any, b: any) => (b?.is_cover === true ? 1 : 0) - (a?.is_cover === true ? 1 : 0))
          .map((m: any) => String(m.url));
      }
      if (normalizedImages.length === 0) {
        const gallery: any[] = Array.isArray(p?.gallery) ? p.gallery : [];
        if (gallery.length) {
          normalizedImages = gallery
            .map((g: any) => (typeof g === "string" ? g : g?.url))
            .filter((u: any) => typeof u === "string" && u.length > 0);
        }
      }
      if (normalizedImages.length === 0 && typeof p?.image === "string" && p.image.length > 0) {
        normalizedImages = [p.image];
      }
      if (normalizedImages.length === 0) {
        normalizedImages = ["/placeholder.jpg"];
      }

      const ratingNum = typeof p?.rating === "number" ? p.rating : Number(p?.rating) || 0;
      const reviewsStr = typeof p?.review_count !== "undefined" && p.review_count !== null
        ? String(p.review_count)
        : (typeof p?.reviewCount !== "undefined" && p.reviewCount !== null ? String(p.reviewCount) : undefined);

      return {
        id: String(wi.id),
        name: p?.name ?? `Product #${wi.productId}`,
        price: priceNum,
        images: normalizedImages,
        rating: ratingNum,
        reviews: reviewsStr,
        deliveryText: "Delivery by tomorrow",
        isHighValue: false,
        isControlled: p?.is_controlled,
      } as UiWishlistItem;
    });
  }, [rawItems]);

  const handleEmptyWishlist = async () => {
    await Promise.allSettled((rawItems as WishlistItem[]).map((wi) => removeItem(wi.id)));
  };


  return (
    <main className="flex-1">
      {/* Header - Mobile */}
      <div className="lg:hidden mb-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-orbitron font-black text-xl uppercase tracking-wide text-black">
            Wishlist
          </h1>
        </div>
        {items.length > 0 && (
          <div className="flex items-center gap-2">

            <button
              onClick={handleEmptyWishlist}
              className="flex items-center gap-1.5 px-3 py-2 border border-[#C2B280] text-[#666] text-xs hover:bg-[#F0EBE3] transition-colors"
            >
              <Image src="/order/wishlist8.svg" alt="Empty" width={14} height={14} />
              Empty Wishlist
            </button>
          </div>
        )}
      </div>

      {/* Header - Desktop */}
      <div className="hidden lg:flex items-center justify-between mb-6">
        <h1 className="font-orbitron font-black text-[32px] uppercase tracking-wide text-black">
          Wishlist
        </h1>
        <div className="flex items-center gap-3">
          {items.length > 0 && (
            <>

              <button
                onClick={handleEmptyWishlist}
                className="flex items-center gap-2 px-4 py-2.5 border border-[#C2B280] text-[#666] text-sm hover:bg-[#F0EBE3] transition-colors"
              >
                <Image src="/order/wishlist7.svg" alt="Empty" width={16} height={16} />
                Empty Wishlist
              </button>
            </>
          )}
          <a href="/products">
            <div className="bg-[#39482C] hover:bg-[#2D3A1A] text-white clip-path-supplier flex items-center justify-center px-6 h-[42px]">
              <span className="font-bold text-[12px] font-orbitron uppercase tracking-wide">Browse Products</span>
            </div>
          </a>
        </div>
      </div>

      {/* Content */}
      {!isAuthenticated && !isLoading ? (
        <div className="flex flex-col items-center justify-center text-center py-16 lg:py-24">
          <Image src="/order/whishlist1.svg" alt="Login Required" width={200} height={180} className="mb-8" />
          <h2 className="font-orbitron font-bold text-lg lg:text-xl uppercase tracking-wide text-black mb-3">
            Login to view wishlist
          </h2>
          <button
            onClick={() => router.push("/login")}
            className="bg-[#39482C] hover:bg-[#2D3A1A] text-white font-orbitron font-bold text-[11px] uppercase tracking-wide px-6 py-3 transition-colors"
          >
            Go to Login
          </button>
        </div>
      ) : isListLoading ? (
        <div className="flex items-center justify-center py-16 lg:py-24">
          <span className="text-[#666]">Loading wishlist…</span>
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center py-16 lg:py-24">
          <span className="text-[#D35400]">Failed to load wishlist.</span>
        </div>
      ) : items.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center py-16 lg:py-24">
          <Image
            src="/order/whishlist1.svg"
            alt="Empty Wishlist"
            width={200}
            height={180}
            className="mb-8"
          />
          <h2 className="font-orbitron font-bold text-lg lg:text-xl uppercase tracking-wide text-black mb-3">
            Ready to Make a Wish?
          </h2>
          <p className="font-inter text-sm lg:text-base text-[#666] max-w-md">
            Start adding items you love to your wishlist by tapping on the heart icon
          </p>
        </div>
      ) : (
        /* Wishlist Items Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {items.map((item) => (
            <div key={item.id} className="bg-[#F0EBE3] border border-[#CCCCCC] overflow-hidden">
              {/* Product Image (single, no slider) */}
              <div className="relative p-4 aspect-square flex items-center justify-center bg-[#EBE3D6]">
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  width={280}
                  height={280}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Slider Progress Line */}


                {/* Product Name */}
                <h3 className="font-inter text-sm font-medium text-black mb-0 leading-[1.25] line-clamp-2">
                  {item.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-sm text-black">{item.rating}</span>
                  <Star size={14} className="fill-[#F5A623] text-[#F5A623]" />
                  {item.reviews && <span className="text-xs text-[#999]">({item.reviews})</span>}
                </div>



                {/* Product Price */}
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/currency/dirham.svg"
                      alt="AED"
                      width={18}
                      height={16}
                      className="flex-shrink-0 w-[18px] h-[16px] lg:w-[20px] lg:h-[18px]"
                    />
                    <span className="font-inter font-bold text-lg text-black">
                      {typeof item.price === "number" ? item.price.toLocaleString() : "—"}
                    </span>
                  </div>
                  {item.isControlled && (
                    <div className="inline-block bg-red-100 text-red-600 text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider border border-red-200">
                      Controlled
                    </div>
                  )}
                </div>


                {/* Delivery Info - Removed as per request */}
                {/* <div className="flex items-center gap-1.5 mb-4">
                  <Truck size={14} className="text-[#D35400]" />
                  <span className="text-xs">
                    <span className="text-[#D35400] font-medium">Standard</span>
                    <span className="text-[#666]"> {item.deliveryText}</span>
                  </span>
                </div> */}

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {item.isHighValue ? (
                    <button className="flex-1 bg-[#D35400] hover:bg-[#B84700] text-white font-orbitron font-bold text-[11px] uppercase tracking-wide py-3 transition-colors">
                      Submit an Inquiry
                    </button>
                  ) : (
                    <button className="flex-1 bg-[#39482C] hover:bg-[#2D3A1A] text-white font-orbitron font-bold text-[11px] uppercase tracking-wide py-3 transition-colors">
                      Add to Cart
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="flex items-center gap-1 text-[#666] hover:text-[#E74C3C] text-xs transition-colors underline"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
