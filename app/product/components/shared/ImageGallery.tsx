"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Props = {
  images: string[];
  selectedImage: number;
  setSelectedImage: (index: number) => void;
  onOpenGallery: () => void;
  placeholderImage?: string;
};

export default function ImageGallery({
  images,
  selectedImage,
  setSelectedImage,
  onOpenGallery,
  placeholderImage = "/placeholder.jpg",
}: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // If no images are provided, use placeholder
  const displayImages = images && images.length > 0 ? images : [placeholderImage];

  // Internal state to track failed images by index
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

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
        {displayImages.map((img, index) => (
          <div
            key={index}
            className="relative min-w-full aspect-square snap-center bg-[#fff]"
            onClick={onOpenGallery}
          >
            <Image
              src={failedImages[index] ? placeholderImage : img}
              alt={`Product ${index + 1}`}
              fill
              className="object-contain p-0"
              priority={index === 0}
              onError={() => handleImageError(index)}
            />
          </div>
        ))}
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:flex flex-col gap-4">
        {/* MAIN IMAGE */}
        <div
          className="relative aspect-square w-full rounded-lg overflow-hidden border border-gray-200 bg-[#EBE3D6]"
          onClick={onOpenGallery}
        >
          <Image
            src={failedImages[selectedImage] ? placeholderImage : displayImages[selectedImage]}
            alt="Product"
            fill
            className="object-contain p-0"
            onError={() => handleImageError(selectedImage)}
          />
        </div>

        {/* THUMBNAILS */}
        <div className="flex flex-row gap-2 overflow-x-auto">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative w-20 aspect-square shrink-0 rounded-md overflow-hidden border ${
                selectedImage === index
                  ? "border-[#D35400]"
                  : "border-gray-200"
              }`}
            >
              <Image
                src={failedImages[index] ? placeholderImage : image}
                alt="Thumbnail"
                fill
                className="object-cover"
                onError={() => handleImageError(index)}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
