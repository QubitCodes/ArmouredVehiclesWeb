'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductCardProps {
  image: string;
  name: string;
  rating: number;
  reviews: string;
  price: number;
  delivery: string;
  action: 'ADD TO CART' | 'SUBMIT AN INQUIRY';
}

export default function ProductCard({
  image,
  name,
  rating,
  reviews,
  price,
  delivery,
  action,
}: ProductCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white border border-[#E8E3D6] overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col">
      {/* ---------- IMAGE SECTION ---------- */}
      <div className="relative bg-[#F8F5EF] w-full aspect-square flex items-center justify-center">
        <Image
          src={image}
          alt={name}
          width={300}
          height={300}
          className="object-contain"
        />

        {/* Left Arrow */}
        <button className="absolute left-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow hover:bg-gray-100">
          <ChevronLeft size={18} className="text-gray-700" />
        </button>

        {/* Right Arrow */}
        <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow hover:bg-gray-100">
          <ChevronRight size={18} className="text-gray-700" />
        </button>

        {/* Wishlist Icon */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md hover:scale-105 transition"
        >
          <Heart
            size={18}
            className={liked ? 'fill-[#D35400] text-[#D35400]' : 'text-gray-600'}
          />
        </button>
      </div>

      {/* ---------- PRODUCT DETAILS ---------- */}
      <div className="p-4 flex flex-col grow justify-between">
        <div>
          <h3 className="text-[16px] font-semibold text-gray-900 leading-[100%] tracking-[0%] font-[Inter, Sans-serif] [leading-trim:cap-height]">
            {name}
          </h3>

          <div className="flex items-center gap-1 mt-1 text-sm">
            <span className="text-[#D35400]">★</span>
            <span className="text-gray-900 font-medium">{rating}</span>
            <span className="text-gray-500">({reviews})</span>
          </div>

          <p className="mt-2 text-lg font-semibold font-[Inter, Sans-serif] text-gray-900">฿ {price}</p>

          <div className="flex items-center gap-1 mt-2 text-sm">
            <Image
              src="/icons/delivery.svg"
              alt="delivery"
              width={18}
              height={18}
            />
            <p className="text-gray-600 font-[Inter, Sans-serif]">
              <span className="text-[#D35400] font-medium">Standard</span> Delivery by{' '}
              <span className="font-medium">tomorrow</span>
            </p>
          </div>
        </div>
      </div>

      {/* ---------- FULL-WIDTH BUTTON ---------- */}
      <button
        className={`w-full py-3 font-semibold font-[Orbitron] uppercase text-sm tracking-wide transition ${
          
            'bg-[#D35400] text-white hover:bg-[#b44400]'
        }`}
      >
        {action}
      </button>
    </div>
  );
}
