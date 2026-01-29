"use client";

import React, { useRef, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function FullscreenGallery({
  images,
  index,
  onClose,
}: {
  images: string[];
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = React.useState(index);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const prev = () =>
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));

  const next = () =>
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const delta = touchStartX.current - touchEndX.current;

    if (Math.abs(delta) < 50) return;

    if (delta > 0) {
      // Swipe Left
      next();
    } else {
      // Swipe Right
      prev();
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, onClose]);

  return (
    <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white p-2 rounded-full bg-black/50"
      >
        <X size={28} />
      </button>

      {/* Left Arrow */}
      <button
        onClick={prev}
        className="absolute left-5 text-white p-2 rounded-full bg-black/50 hidden md:block"
      >
        <ChevronLeft size={32} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={next}
        className="absolute right-5 text-white p-2 rounded-full bg-black/50 hidden md:block"
      >
        <ChevronRight size={32} />
      </button>

      {/* Main Image */}
      <div
        className="relative w-[90%] md:w-[60%] h-[70vh]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[current]}
          alt="Gallery Image"
          fill
          className="object-contain"
        />
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-5 flex gap-3 overflow-x-auto px-4">
        {images.map((image, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            className={`relative w-16 h-16 rounded-md overflow-hidden cursor-pointer border 
              ${current === i ? "border-white" : "border-gray-600"}
            `}
          >
            <Image src={image} alt="thumb" fill className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
