"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, ChevronLeft, ChevronRight, Truck, Star } from "lucide-react";

// Mock wishlist data
const mockWishlistItems = [
  {
    id: "1",
    name: "DFC® - 4000 HybriDynamic Hybrid Rear Brake Pads",
    price: 679,
    images: ["/order/wishlist2.svg", "/order/wishlist3.svg", "/order/wishlist4.svg"],
    rating: 4.6,
    reviews: "4.5k",
    deliveryText: "Delivery by tomorrow",
    isHighValue: false,
  },
  {
    id: "2",
    name: "DFC® - 4000 HybriDynamic Hybrid Rear Brake Pads",
    price: 16769,
    images: ["/order/wishlist3.svg", "/order/wishlist2.svg", "/order/wishlist4.svg"],
    rating: 4.6,
    reviews: "4.5k",
    deliveryText: "Delivery by tomorrow",
    isHighValue: true,
  },
  {
    id: "3",
    name: "DFC® - 4000 HybriDynamic Hybrid Rear Brake Pads",
    price: 679,
    images: ["/order/wishlist4.svg", "/order/wishlist2.svg", "/order/wishlist3.svg"],
    rating: 4.6,
    reviews: "4.5k",
    deliveryText: "Delivery by tomorrow",
    isHighValue: false,
  },
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems);
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});

  const handleRemoveItem = (id: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  const handleEmptyWishlist = () => {
    setWishlistItems([]);
  };

  const handlePrevImage = (itemId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const handleNextImage = (itemId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) + 1) % totalImages
    }));
  };

  const getCurrentImageIndex = (itemId: string) => {
    return currentImageIndex[itemId] || 0;
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
        {wishlistItems.length > 0 && (
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 border border-[#C2B280] text-[#666] text-xs hover:bg-[#F0EBE3] transition-colors">
              <Image src="/order/wishlist7.svg" alt="Share" width={14} height={14} />
              Share
            </button>
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
          {wishlistItems.length > 0 && (
            <>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-[#C2B280] text-[#666] text-sm hover:bg-[#F0EBE3] transition-colors">
                <Image src="/order/wishlist8.svg" alt="Share" width={16} height={16} />
                Share
              </button>
              <button
                onClick={handleEmptyWishlist}
                className="flex items-center gap-2 px-4 py-2.5 border border-[#C2B280] text-[#666] text-sm hover:bg-[#F0EBE3] transition-colors"
              >
                <Image src="/order/wishlist7.svg" alt="Empty" width={16} height={16} />
                Empty Wishlist
              </button>
            </>
          )}
          <a href="/supplier">
            <div className="bg-[#39482C] hover:bg-[#2D3A1A] text-white clip-path-supplier flex items-center justify-center px-6 h-[42px]">
              <span className="font-bold text-[12px] font-orbitron uppercase tracking-wide">Create New Wishlist</span>
            </div>
          </a>
        </div>
      </div>

      {/* Content */}
      {wishlistItems.length === 0 ? (
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
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-[#F0EBE3] border border-[#CCCCCC] overflow-hidden">
              {/* Product Image with Navigation */}
              <div className="relative p-4 aspect-square flex items-center justify-center group bg-[#EBE3D6]">
                <button
                  onClick={() => handlePrevImage(item.id, item.images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white z-10"
                >
                  <ChevronLeft size={18} className="text-[#666]" />
                </button>

                {/* Image Slider */}
                <div className="relative w-full h-full overflow-hidden">
                  <div
                    className="flex transition-transform duration-300 ease-in-out h-full"
                    style={{ transform: `translateX(-${getCurrentImageIndex(item.id) * 100}%)` }}
                  >
                    {item.images.map((img, idx) => (
                      <div key={idx} className="min-w-full h-full flex items-center justify-center">
                        <Image
                          src={img}
                          alt={`${item.name} - Image ${idx + 1}`}
                          width={280}
                          height={280}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleNextImage(item.id, item.images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white z-10"
                >
                  <ChevronRight size={18} className="text-[#666]" />
                </button>


              </div>
              <div className="px-4">
                <div className="relative w-full h-0.5 bg-[#E8E3D9] ">
                  <div
                    className="absolute top-0 left-0 h-full bg-[#C2B280] transition-all duration-300"
                    style={{
                      width: `${100 / item.images.length}%`,
                      left: `${(getCurrentImageIndex(item.id) * 100) / item.images.length}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Slider Progress Line */}


                {/* Product Name */}
                <h3 className="font-inter text-sm font-medium text-black mb-2 line-clamp-2 min-h-[40px]">
                  {item.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-sm text-black">{item.rating}</span>
                  <Star size={14} className="fill-[#F5A623] text-[#F5A623]" />
                  <span className="text-xs text-[#999]">({item.reviews})</span>
                </div>

                {/* Product Price */}
                <div className="flex items-center gap-2 mb-3">
                  <Image
                    src="/icons/currency/dirham.svg"
                    alt="AED"
                    width={18}
                    height={16}
                    className="flex-shrink-0 w-[18px] h-[16px] lg:w-[20px] lg:h-[18px]"
                  />
                  <span className="font-inter font-bold text-lg text-black">
                    {item.price.toLocaleString()}
                  </span>
                </div>


                {/* Delivery Info */}
                <div className="flex items-center gap-1.5 mb-4">
                  <Truck size={14} className="text-[#D35400]" />
                  <span className="text-xs">
                    <span className="text-[#D35400] font-medium">Standard</span>
                    <span className="text-[#666]"> {item.deliveryText}</span>
                  </span>
                </div>

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
                    onClick={() => handleRemoveItem(item.id)}
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
