"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect, useRef } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  gallery?: string[];
  action: "BUY NOW" | "SUBMIT AN INQUIRY";
}

// No dummy fallback: show an empty-state badge when no products

export const FeaturedProducts = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [index, setIndex] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [imageIndices, setImageIndices] = useState<Record<string, number>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const { isAuthenticated, isLoading } = useAuth();

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
      setIsLoadingProducts(true);
      try {
        const data = await api.products.getFeatured();
        console.log("Fetched featured products:", data);
        const mappedProducts: Product[] = data?.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          image: item.image || "/placeholder.png",
          gallery: (item.gallery && item.gallery.length > 0) ? item.gallery : [(item.image || "/placeholder.png")],
          action:
            item.actionType === "buy_now"
              ? "BUY NOW"
              : item.actionType === "inquiry"
                ? "SUBMIT AN INQUIRY"
                : "BUY NOW",
        }));
        // If API returned no items, show empty state (no products)
        if (!mappedProducts || mappedProducts.length === 0) {
          setProducts([]);
        } else {
          setProducts(mappedProducts);
        }
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
        // On fetch failure, show empty state instead of dummy products
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
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
    }, 7000); // increased delay to slow autoplay (7s)
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

  // Cycle through product images on hover
  useEffect(() => {
    if (!hoveredKey) return;

    const interval = setInterval(() => {
      setImageIndices((prev) => {
        const currentIndex = prev[hoveredKey] || 0;
        // Find the product to get its gallery length
        let galleryLength = 1;
        extendedSlides.forEach((group) => {
          group.forEach((product, idx) => {
            const key = `${extendedSlides.findIndex(g => g === group)}-${idx}`;
            if (key === hoveredKey && product.gallery && product.gallery.length > 0) {
              galleryLength = product.gallery.length;
            }
          });
        });
        const nextIndex = (currentIndex + 1) % galleryLength;
        return { ...prev, [hoveredKey]: nextIndex };
      });
    }, 500); // Change image every 500ms

    return () => clearInterval(interval);
  }, [hoveredKey, extendedSlides]);

  // Do not early-return null; we'll render an empty-state badge below when no products

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
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        .shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0.05) 100%
          );
          background-size: 1000px 100%;
        }
      `}</style>

      <div className="container-figma">
        <h2 className="text-2xl sm:text-[32px] lg:text-4xl font-bold text-white mb-8 sm:mb-10 lg:mb-12 font-orbitron" >
          FEATURED PRODUCTS
        </h2>

        {isLoadingProducts ? (
          // SHIMMER SKELETON LOADER
          <div className="overflow-x-auto md:overflow-hidden relative w-full scrollbar-hide">
            <div className="flex flex-row gap-4 md:flex-col md:flex-row md:justify-between md:items-center 2xl:gap-[140px] md:gap-8 w-full px-4 md:px-0">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className={`
                    bg-transparent border border-b-0 border-white/30 
                    w-[221px] md:w-[368px] h-[363px] md:h-[519px] flex flex-col flex-shrink-0
                    shadow-[0_0_15px_rgba(255,255,255,0.1)]
                    overflow-hidden
                    ${idx === 1 ? "md:mt-16" : ""}
                  `}
                >
                  {/* IMAGE SKELETON */}
                  <div className="w-full h-[244px] md:h-[349px] flex items-center justify-center border-b border-white/30 shimmer bg-white/5">
                  </div>

                  {/* NAME SKELETON */}
                  <div className="w-full h-[42px] md:h-[60px] flex items-center px-3 md:px-6 border-b border-white/30">
                    <div className="shimmer w-3/4 h-4 md:h-5 bg-white/10 rounded"></div>
                  </div>

                  {/* PRICE SKELETON */}
                  <div className="w-full h-[42px] md:h-[60px] flex items-center px-3 md:px-6">
                    <div className="shimmer w-1/2 h-4 md:h-5 bg-white/10 rounded"></div>
                  </div>

                  {/* BUTTON SKELETON */}
                  <div className="w-full grow">
                    <div className="shimmer w-full h-full bg-white/10"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : baseSlides.length === 0 ? (
          // EMPTY-STATE BADGE WHEN THERE ARE NO PRODUCTS
          <div className="flex justify-center items-center py-8">
            <div className="px-4 py-2 rounded-full border border-white/30 bg-white/10 text-white/80 font-orbitron text-sm md:text-base">
              No featured products available right now
            </div>
          </div>
        ) : (
          <>
            {/* SLIDER WRAPPER - Desktop: auto-slide, Mobile: horizontal scroll */}
            <div className="overflow-x-auto md:overflow-hidden relative w-full scrollbar-hide" >
          {/* TRACK */}
          <div
            ref={sliderRef}
            className={`flex ${transitionEnabled && !isMobile ? "md:transition-transform md:duration-1000 md:ease-in-out" : ""}`}
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
                      onClick={() => router.push(`/product/${product.id}`)}
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
                      role="button"
                      style={{ cursor: "pointer", animation: `slideIn 0.5s ease-out ${idx * 0.1}s both` }}
                    >


                      {/* IMAGE */}
                      <div className="w-full h-[244px] md:h-[349px] flex items-center justify-center border-b border-white relative overflow-hidden" >
                        <Image
                          src={
                            isHovered && product.gallery && product.gallery.length > 0
                              ? product.gallery[imageIndices[uniqueKey] || 0]
                              : product.image
                          }
                          alt={product.name}
                          width={300}
                          height={300}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* NAME */}
                      <div className="w-full h-[42px] md:h-[60px] flex items-center px-3 md:px-6 border-b border-white">
                        <h3 className="text-white font-orbitron text-[12px] md:text-[16px] font-semibold leading-tight">
                          {product.name}
                        </h3>
                      </div>

                      {/* PRICE */}
                      <div className="w-full h-[42px] md:h-[60px] flex items-center px-3 md:px-6">
                        <p className="text-white font-orbitron flex items-center gap-1 md:gap-2 select-none">
                          {isLoading ? (
                            <span className="opacity-70">...</span>
                          ) : isAuthenticated ? (
                            <>
                              <Image src="/icons/currency/dirham-white.svg" alt="Currency" width={16} height={16} className="opacity-60 md:w-5 md:h-5" />
                              <span className="text-sm md:text-lg ">{product.price.toLocaleString()}</span>
                            </>
                          ) : (
                            <span className="text-white/80 text-sm md:text-sm tracking-wider"><span className="font-bold">Login</span> to <span className="font-bold">access</span> product pricing.</span>
                          )}
                        </p>
                      </div>

                      {/* BUTTON */}
                      <div className="w-full grow">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/product/${product.id}`);
                          }}
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
        </>
        )}
      </div>
    </section>
  );
};
