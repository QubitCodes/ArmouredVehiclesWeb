"use client";

import { useState, useRef } from "react";

export default function ImageZoom({ src }: { src: string }) {
  const [zoom, setZoom] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleMove = (e: any) => {
    if (!imgRef.current) return;

    const { left, top, width, height } =
      imgRef.current.getBoundingClientRect();

    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    imgRef.current.style.transformOrigin = `${x}% ${y}%`;
  };

  return (
    <div
      onMouseEnter={() => setZoom(true)}
      onMouseLeave={() => setZoom(false)}
      onMouseMove={handleMove}
      className="relative overflow-hidden rounded-lg border bg-[#EBE3D6] w-full aspect-square"
    >
      <img
        ref={imgRef}
        src={src}
        className={`transition-transform duration-200 object-contain w-full h-full ${
          zoom ? "scale-[2]" : "scale-100"
        }`}
      />
    </div>
  );
}
