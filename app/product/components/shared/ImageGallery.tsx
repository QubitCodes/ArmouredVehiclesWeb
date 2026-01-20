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

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
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
            className="relative min-w-full aspect-square snap-center bg-white"
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

      {/* Mobile Thumbnails */}
      {displayImages.length > 1 && (
        <div className="md:hidden mt-2 flex flex-row gap-2 overflow-x-auto scrollbar-hide">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedImage(index);
                scrollToIndex(index);
              }}
              className={`relative w-16 aspect-square shrink-0 rounded-md overflow-hidden border ${
                selectedImage === index ? 'border-[#D35400]' : 'border-gray-200'
              }`}
              aria-label={`Select image ${index + 1}`}
            >
              <Image
                src={failedImages[index] ? placeholderImage : image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                onError={() => handleImageError(index)}
              />
            </button>
          ))}
        </div>
      )}

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:flex flex-row gap-4">
        {/* THUMBNAILS (LEFT) */}
        {displayImages.length > 1 && (
          <div className="flex flex-col gap-2 max-h-[600px]">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 aspect-square shrink-0 rounded-md overflow-hidden border ${
                  selectedImage === index ? "border-[#D35400]" : "border-gray-200"}
                `}
                aria-label={`Select image ${index + 1}`}
              >
                <Image
                  src={failedImages[index] ? placeholderImage : image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(index)}
                />
              </button>
            ))}
          </div>
        )}

        {/* MAIN IMAGE (RIGHT) */}
        <div
          className="relative aspect-square w-full rounded-lg overflow-hidden border border-gray-200 bg-[#fff]"
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
      </div>
    </div>
  );
}
