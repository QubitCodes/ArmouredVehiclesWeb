"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Props = {
  images: string[];
  selectedImage: number;
  setSelectedImage: (index: number) => void;
  onOpenGallery: () => void;
};

export default function ImageGallery({
  images,
  selectedImage,
  setSelectedImage,
  onOpenGallery,
}: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="w-full">

      {/* ================= MOBILE VIEW ================= */}
      <div
        ref={scrollRef}
        className="md:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        onScroll={(e) => {
          const el = e.currentTarget;
          const index = Math.round(el.scrollLeft / el.clientWidth);
          setSelectedImage(index);
        }}
      >
        {images.map((img, index) => (
          <div
            key={index}
            className="relative min-w-full aspect-square snap-center bg-[#EBE3D6]"
            onClick={onOpenGallery}
          >
            <Image
              src={img}
              alt={`Product ${index + 1}`}
              fill
              className="object-contain p-0"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:flex gap-4">
        {/* THUMBNAILS */}
        <div className="flex flex-col gap-2 w-20">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative w-20 aspect-square rounded-md overflow-hidden border ${
                selectedImage === index
                  ? "border-[#D35400]"
                  : "border-gray-200"
              }`}
            >
              <Image
                src={image}
                alt="Thumbnail"
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* MAIN IMAGE */}
        <div
          className="relative aspect-square flex-1 rounded-lg overflow-hidden border border-gray-200 bg-[#EBE3D6]"
          onClick={onOpenGallery}
        >
          <Image
            src={images[selectedImage]}
            alt="Product"
            fill
            className="object-contain p-0"
          />
        </div>
      </div>
    </div>
  );
}
