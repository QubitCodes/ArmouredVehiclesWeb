"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";

interface ProductCardProps {
  images: string[]; // <<--------- updated
  name: string;
  rating: number;
  reviews: string;
  price: number;
  delivery: string;
  action: "ADD TO CART" | "SUBMIT AN INQUIRY";
}

export default function ProductCard({
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
  const nextImage = () => {
    setSlide((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="bg-white border border-[#E8E3D6] overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col">
      {/* ---------- IMAGE SECTION ---------- */}
      <div className="relative bg-[#F8F5EF] w-[370px] h-[350px] flex items-center justify-center group">
        {/* Image slider */}
        <Image
          src={images[slide]}
          alt={name}
          // width={375}
          // height={370}
          fill
          className="object-cover transition-all duration-300"
        />

        {/* Left Arrow */}
        <button
          onClick={prevImage}
          className="absolute left-3 w-[35px] h-[35px] top-1/2 -translate-y-1/2 rounded-full p-1 shadow bg-white opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200"
        >
          <Image src="/icons/productCardLeft.svg" alt="previous" fill />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextImage}
          className="absolute right-3 w-[35px] h-[35px] top-1/2 -translate-y-1/2 rounded-full p-1 bg-white shadow opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200"
        >
          <Image src="/icons/productCardRight.svg" alt="next" fill />
        </button>

        {/* Wishlist Icon */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 bg-[#F0EBE3] rounded-full p-1 shadow-md hover:scale-105 transition"
        >
          <Heart
            size={20}
            className={
              liked ? "fill-[#D35400] text-[#D35400]" : "text-[#3D4A26]"
            }
          />
        </button>

        {/* Slide indicators (dots) */}
        <div className="absolute bottom-3 flex gap-2">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`h-[3px] rounded-full transition-all duration-300 ${
                idx === slide ? "bg-[#D35400] w-[30px]" : "bg-gray-400 w-[12px]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ---------- PRODUCT DETAILS ---------- */}
      <div className="p-4 flex flex-col grow bg-[#F0EBE3] justify-between">
        <div>
          <h3 className="text-[16px] font-semibold text-gray-900">{name}</h3>

          <div className="flex items-center gap-1 mt-1 text-sm">
            <span className="text-[#D35400]">★</span>
            <span className="text-gray-900 font-medium">{rating}</span>
            <span className="text-gray-500">({reviews})</span>
          </div>

          <hr
            className="border-t border-[#CCCCCC] my-3"
            style={{ width: "calc(100% + 2rem)", marginLeft: "-1rem" }}
          />

          <p className="mt-2 text-lg font-semibold text-gray-900">฿ {price}</p>

          <div className="flex items-center gap-1 mt-2 text-sm">
            <Image src="/icons/delivery.svg" alt="delivery" width={18} height={18} />
            <p className="text-gray-600">
              <span className="text-[#D35400] font-medium">Standard</span> Delivery by{" "}
              <span className="font-medium">tomorrow</span>
            </p>
          </div>
        </div>
      </div>

      {/* ---------- FULL-WIDTH BUTTON ---------- */}
      <button
        className={`w-full py-3 font-black font-[Orbitron] uppercase text-[18px] tracking-wide transition bg-[#D35400] text-white hover:bg-[#b44400]`}
      >
        {action}
      </button>
    </div>
  );
}
