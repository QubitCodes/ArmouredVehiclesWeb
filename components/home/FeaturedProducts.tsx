"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { FaInfoCircle } from "react-icons/fa";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  action: "BUY NOW" | "SUBMIT AN INQUIRY";
}

const products: Product[] = [
  {
    id: 1,
    name: "Tubeless Runflat Solutions",
    price: 3499,
    image: "/featured products/9bf0d8ceacd81abb0ef5d6b2928417f9604f3e30.png",
    action: "BUY NOW",
  },
  {
    id: 2,
    name: "Headlights (LED, HID, Halogen)",
    price: 499,
    image: "/featured products/702ce9381c45cff389ec92314fa6d77761919ed6.jpg",
    action: "BUY NOW",
  },
  {
    id: 3,
    name: "Reinforced Suspension Kits",
    price: 14990,
    image: "/featured products/be2442a365db6898a8061f3a839a2a08a5aa7ee1.png",
    action: "SUBMIT AN INQUIRY",
  },
  {
    id: 4,
    name: "Tubeless Runflat Solutions",
    price: 3499,
    image: "/featured products/9bf0d8ceacd81abb0ef5d6b2928417f9604f3e30.png",
    action: "BUY NOW",
  },
  {
    id: 5,
    name: "Headlights (LED, HID, Halogen)",
    price: 499,
    image: "/featured products/702ce9381c45cff389ec92314fa6d77761919ed6.jpg",
    action: "BUY NOW",
  },
  {
    id: 6,
    name: "Reinforced Suspension Kits",
    price: 14990,
    image: "/featured products/be2442a365db6898a8061f3a839a2a08a5aa7ee1.png",
    action: "SUBMIT AN INQUIRY",
  },
];

// group products into slides (3 per slide)
const GROUP_SIZE = 3;
const baseSlides: Product[][] = [];
for (let i = 0; i < products.length; i += GROUP_SIZE) {
  baseSlides.push(products.slice(i, i + GROUP_SIZE));
}

// extend slides for looping: [ lastGroupClone, ...baseSlides, firstGroupClone ]
const extendedSlides = [
  baseSlides[baseSlides.length - 1],
  ...baseSlides,
  baseSlides[0],
];

export const FeaturedProducts = () => {
  // index into extendedSlides; start at 1 (the first real slide)
  const [index, setIndex] = useState(1);
  // toggle CSS transition on/off (disable when snapping)
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  // hovered key (string) to preserve hover across changed slides
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const total = extendedSlides.length; // e.g. baseSlides.length + 2

  // AUTO slide: always increment index → moves left (translateX negative)
  useEffect(() => {
    if (baseSlides.length <= 1) return; // nothing to slide if only one group
    const timer = setInterval(() => {
      setTransitionEnabled(true);
      setIndex((p) => p + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // transitionend handler: when we land on a cloned slide, snap (no transition) to the real one
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const onTransitionEnd = () => {
      // reached the final cloned group (cloned-first at end)
      if (index === total - 1) {
        // snap to real first (index 1) without transition
        setTransitionEnabled(false);
        setIndex(1);
      }

      // reached the initial cloned group at start
      if (index === 0) {
        // snap to real last (total - 2)
        setTransitionEnabled(false);
        setIndex(total - 2);
      }
    };

    el.addEventListener("transitionend", onTransitionEnd);
    return () => el.removeEventListener("transitionend", onTransitionEnd);
  }, [index, total]);

  // When we turned off transition to snap, re-enable immediately (so next movement is animated)
  useEffect(() => {
    if (!transitionEnabled) {
      // small timeout to let DOM paint without transition
      // then re-enable so next index change animates
      const t = setTimeout(() => setTransitionEnabled(true), 20);
      return () => clearTimeout(t);
    }
    return;
  }, [transitionEnabled]);

  return (
    <section
      className="py-16 bg-center bg-cover"
      style={{ backgroundImage: "url('/featured products/background.png')" }}
    >
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <div className="container-figma">
        <h2 className="text-2xl sm:text-[32px] lg:text-4xl font-bold text-white mb-8 sm:mb-10 lg:mb-12 font-orbitron">
          FEATURED PRODUCTS
        </h2>

        {/* SLIDER WRAPPER */}
        <div className="overflow-hidden relative w-full">
          {/* TRACK */}
          <div
            ref={sliderRef}
            className={`flex ${transitionEnabled ? "transition-transform duration-700 ease-in-out" : ""}`}
            style={{
              width: `${total * 100}%`,
              transform: `translateX(-${index * (100 / total)}%)`,
            }}
          >
            {extendedSlides.map((group, slideIndex) => (
              <div
                key={slideIndex}
                className="flex flex-col md:flex-row justify-between items-center 2xl:gap-[140px] gap-8 w-full flex-shrink-0"
                style={{ width: `${100 / total}%` }}
              >
                {group.map((product, idx) => {
                  const uniqueKey = `${slideIndex}-${idx}`;
                  const isHovered = hoveredKey === uniqueKey;
                  const isMiddle = idx === 1; // middle card offset

                  return (
                    <div
                      key={product.id}
                      onMouseEnter={() => setHoveredKey(uniqueKey)}
                      onMouseLeave={() => setHoveredKey(null)}
                      className={`
    bg-transparent border border-b-0 border-white 
    w-[368px] h-[519px] flex flex-col 
    shadow-[0_0_15px_rgba(255,255,255,0.1)]
    transition-all duration-700 ease-in-out
    animate-[slideIn_0.5s_ease-out]
    overflow-visible                   // 👈 ADD THIS
    ${isHovered ? "" : ""}
    ${isMiddle ? "md:mt-16" : ""}
  `}
                      style={{ animation: `slideIn 0.5s ease-out ${idx * 0.1}s both` }}
                    >


                      {/* IMAGE */}
                      <div className="w-full h-[349px] flex items-center justify-center border-b border-white relative overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={300}
                          height={300}
                          className={`transition-all duration-300 ${isHovered ? "object-cover w-full h-full" : "object-contain w-[300px] h-[300px]"}`}
                        />
                      </div>

                      {/* NAME */}
                      <div className="w-full h-[60px] flex items-center px-6 border-b border-white">
                        <h3 className="text-white font-orbitron text-[16px] font-semibold leading-tight">
                          {product.name}
                        </h3>
                      </div>

                      {/* PRICE */}
                      <div className="w-full h-[60px] flex items-center px-6 relative group">
                        <p className="text-white font-orbitron text-lg flex items-center gap-2 select-none">
                          <Image src="/icons/currency/dirham-white.svg" alt="Currency" width={20} height={20} className="opacity-60" />
                          <span className="blur-sm opacity-70">{product.price.toLocaleString()}</span>
                          <FaInfoCircle className="text-white opacity-90 text-sm ml-2 cursor-pointer" />
                        </p>

                        <div className="absolute left-6 top-[55px] bg-black text-white text-xs px-3 py-2 rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                          Login to view the price
                        </div>
                      </div>

                      {/* BUTTON */}
                      <div className="w-full grow">
                        <button
                          className={`w-full h-full text-[18px] font-orbitron font-extrabold uppercase transition-all ${isHovered ? "bg-[#FF5C00] text-white" : "bg-white text-[#FF5C00]"}`}
                        >
                          {product.action}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Dots (keeps original behavior but maps to real slides) */}
        <div className="flex justify-center gap-4 mt-8">
          {baseSlides.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => {
                // map real dot index to extended index (real slides start at 1)
                setTransitionEnabled(true);
                setIndex(dotIdx + 1);
              }}
              className={`h-1 w-[50px] transition-all ${index === dotIdx + 1 ? "bg-[#FF5C00]" : "bg-white/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
