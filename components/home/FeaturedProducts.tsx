"use client";
import Image from "next/image";
import api from "@/lib/api";
import { useState, useEffect, useRef } from "react";
import { FaInfoCircle } from "react-icons/fa";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  action: "BUY NOW" | "SUBMIT AN INQUIRY";
}

// Fallback dummy products used when the API call fails or returns no items
const defaultProducts: Product[] = [
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

export const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [index, setIndex] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const sliderRef = useRef<HTMLDivElement | null>(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await api.products.getFeatured();
        const mappedProducts: Product[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          image: item.image || "/placeholder.png",
          action:
            item.actionType === "buy_now"
              ? "BUY NOW"
              : item.actionType === "inquiry"
                ? "SUBMIT AN INQUIRY"
                : "BUY NOW",
        }));
        // If API returned no items, fall back to default products
        if (!mappedProducts || mappedProducts.length === 0) {
          setProducts(defaultProducts);
        } else {
          setProducts(mappedProducts);
        }
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
        // Use fallback products when fetch fails
        setProducts(defaultProducts);
      }
    };
    fetchFeatured();
  }, []);

  // Group products into slides (3 per slide)
  const GROUP_SIZE = 3;
  const baseSlides: Product[][] = [];
  for (let i = 0; i < products.length; i += GROUP_SIZE) {
    baseSlides.push(products.slice(i, i + GROUP_SIZE));
  }

  // Extend slides for looping: [ lastGroupClone, ...baseSlides, firstGroupClone ]
  const extendedSlides = baseSlides.length > 0 ? [
    baseSlides[baseSlides.length - 1],
    ...baseSlides,
    baseSlides[0],
  ] : [];

  const total = extendedSlides.length;

  // AUTO slide: always increment index → moves left (translateX negative) - DESKTOP ONLY
  useEffect(() => {
    if (baseSlides.length <= 1 || isMobile) return;
    const timer = setInterval(() => {
      setTransitionEnabled(true);
      setIndex((p) => p + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, [baseSlides.length, isMobile]);

  // transitionend handler: when we land on a cloned slide, snap (no transition) to the real one
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const onTransitionEnd = () => {
      if (index === total - 1) {
        setTransitionEnabled(false);
        setIndex(1);
      }
      if (index === 0) {
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
      const t = setTimeout(() => setTransitionEnabled(true), 20);
      return () => clearTimeout(t);
    }
    return;
  }, [transitionEnabled]);

  if (baseSlides.length === 0) {
    return null;
  }

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
        <h2 className="text-2xl sm:text-[32px] lg:text-4xl font-bold text-white mb-8 sm:mb-10 lg:mb-12 font-orbitron" data-aos="fade-up">
          FEATURED PRODUCTS
        </h2>

        {/* SLIDER WRAPPER - Desktop: auto-slide, Mobile: horizontal scroll */}
        <div className="overflow-x-auto md:overflow-hidden relative w-full scrollbar-hide" >
          {/* TRACK */}
          <div
            ref={sliderRef}
            className={`flex ${transitionEnabled && !isMobile ? "md:transition-transform md:duration-700 md:ease-in-out" : ""}`}
            style={{
              width: isMobile ? 'auto' : `${total * 100}%`,
              transform: isMobile ? 'none' : `translateX(-${index * (100 / total)}%)`,
            }}
          >
            {extendedSlides.map((group, slideIndex) => (
              <div
                key={slideIndex}
                className="flex flex-row gap-4 md:flex-col md:flex-row md:justify-between md:items-center 2xl:gap-[140px] md:gap-8 w-full flex-shrink-0 px-4 md:px-0"
                style={{ width: isMobile ? 'auto' : `${100 / total}%` }}
              >
                {group.map((product, idx) => {
                  const uniqueKey = `${slideIndex}-${idx}`;
                  const isHovered = hoveredKey === uniqueKey;
                  const isMiddle = idx === 1; // middle card offset

                  return (
                    <div
                      key={product.id}
                      data-aos="fade-up"
                      onMouseEnter={() => setHoveredKey(uniqueKey)}
                      onMouseLeave={() => setHoveredKey(null)}
                      className={`
    bg-transparent border border-b-0 border-white 
    w-[221px] md:w-[368px] h-[363px] md:h-[519px] flex flex-col flex-shrink-0
    shadow-[0_0_15px_rgba(255,255,255,0.1)]
    transition-all duration-700 ease-in-out
    animate-[slideIn_0.5s_ease-out]
    overflow-visible
    ${isHovered ? "" : ""}
    ${isMiddle ? "md:mt-16" : ""}
  `}
                      style={{ animation: `slideIn 0.5s ease-out ${idx * 0.1}s both` }}
                    >


                      {/* IMAGE */}
                      <div className="w-full h-[244px] md:h-[349px] flex items-center justify-center border-b border-white relative overflow-hidden" >
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={300}
                          height={300}
                          className={`transition-all duration-300 ${isHovered ? "object-cover w-full h-full" : "object-contain w-[200px] h-[200px] md:w-[300px] md:h-[300px]"}`}
                        />
                      </div>

                      {/* NAME */}
                      <div className="w-full h-[42px] md:h-[60px] flex items-center px-3 md:px-6 border-b border-white">
                        <h3 className="text-white font-orbitron text-[12px] md:text-[16px] font-semibold leading-tight">
                          {product.name}
                        </h3>
                      </div>

                      {/* PRICE */}
                      <div className="w-full h-[42px] md:h-[60px] flex items-center px-3 md:px-6 relative group">
                        <p className="text-white font-orbitron text-sm md:text-lg flex items-center gap-1 md:gap-2 select-none">
                          <Image src="/icons/currency/dirham-white.svg" alt="Currency" width={16} height={16} className="opacity-60 md:w-5 md:h-5" />
                          <span className="blur-sm opacity-70">{product.price.toLocaleString()}</span>
                          <FaInfoCircle className="text-white opacity-90 text-xs md:text-sm ml-1 md:ml-2 cursor-pointer" />
                        </p>

                        <div className="absolute left-6 top-[55px] bg-black text-white text-xs px-3 py-2 rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                          Login to view the price
                        </div>
                      </div>

                      {/* BUTTON */}
                      <div className="w-full grow">
                        <button
                          className={`w-full h-full text-[14px] md:text-[18px] font-orbitron font-extrabold uppercase transition-all ${isHovered ? "bg-[#FF5C00] text-white" : "bg-white text-[#FF5C00]"}`}
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
                if (isMobile && sliderRef.current) {
                  // On mobile, scroll to the group
                  const scrollContainer = sliderRef.current.parentElement;
                  if (scrollContainer) {
                    const cardWidth = 221 + 16; // card width + gap
                    const scrollPosition = dotIdx * cardWidth * GROUP_SIZE;
                    scrollContainer.scrollTo({ left: scrollPosition, behavior: 'smooth' });
                  }
                } else {
                  // On desktop, use the index-based slide
                  setTransitionEnabled(true);
                  setIndex(dotIdx + 1);
                }
              }}
              className={`h-1 w-[50px] transition-all ${index === dotIdx + 1 ? "bg-[#FF5C00]" : "bg-white/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
