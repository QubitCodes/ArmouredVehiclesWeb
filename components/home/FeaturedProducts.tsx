"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect, useRef, useMemo } from "react";

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  image: string;
  gallery?: string[];
  action: "BUY NOW" | "SUBMIT AN INQUIRY";
}

// Fallback products when API returns empty or fails
// Fallback products removed to reflect actual API state

export const FeaturedProducts = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [index, setIndex] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [imageIndices, setImageIndices] = useState<Record<string, number>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [isLargeDesktop, setIsLargeDesktop] = useState(false);
  const [isExtraLarge, setIsExtraLarge] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const nameRefs = useRef<Record<string, HTMLHeadingElement | null>>({});
  const [nameOverflow, setNameOverflow] = useState<Record<string, boolean>>({});
  const { isAuthenticated, isLoading } = useAuth();

  // Detect mobile, large desktop, and extra large screen sizes
  useEffect(() => {
    const checkSizes = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsLargeDesktop(width >= 1024);
      setIsExtraLarge(width >= 1920);
    };
    checkSizes();
    window.addEventListener('resize', checkSizes);
    return () => window.removeEventListener('resize', checkSizes);
  }, []);



  // Fetch products from API
  useEffect(() => {
    const fetchFeatured = async () => {
      setIsLoadingProducts(true);
      try {
        const data = await api.products.getFeatured();

        const mappedProducts: Product[] = data?.map((item: any) => ({
          id: String(item.id),
          sku: item.sku || String(item.id),
          name: item.name,
          price: Number(item.price),
          image: item.image || "/placeholder.jpg",
          gallery: (item.gallery && item.gallery.length > 0) ? item.gallery : [(item.image || "/placeholder.jpg")],
          action:
            item.actionType === "buy_now"
              ? "BUY NOW"
              : item.actionType === "inquiry"
                ? "SUBMIT AN INQUIRY"
                : "BUY NOW",
        }));
        // If API returned no items, use fallback products
        setProducts(mappedProducts || []);
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
        // On fetch failure, use fallback products
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchFeatured();
  }, []);

  // Group products into slides (4 per slide on large desktop, 3 on medium, 2 on mobile)
  const GROUP_SIZE = useMemo(() => {
    if (isMobile) return 2;
    if (isLargeDesktop) return 4;
    return 3;
  }, [isMobile, isLargeDesktop]);

  const baseSlides: Product[][] = useMemo(() => {
    const slides: Product[][] = [];
    for (let i = 0; i < products.length; i += GROUP_SIZE) {
      slides.push(products.slice(i, i + GROUP_SIZE));
    }
    return slides;
  }, [products, GROUP_SIZE]);
  // Limit to only 3 slides on desktop; keep all on mobile
  const visibleSlides = useMemo(
    () => baseSlides,
    [baseSlides]
  );

  // Extend slides for looping: [ lastGroupClone, ...baseSlides, firstGroupClone ]
  // Only extend if we have more than 1 slide to avoid showing duplicates
  const extendedSlides = useMemo(() => {
    if (visibleSlides.length === 0) return [];
    if (visibleSlides.length === 1) return visibleSlides; // No clones for single slide
    return [
      visibleSlides[visibleSlides.length - 1],
      ...visibleSlides,
      visibleSlides[0],
    ];
  }, [visibleSlides]);

  const total = extendedSlides.length;

  // Measure product name overflow on mobile to show dotted indicator when beyond 2 lines
  useEffect(() => {
    const measure = () => {
      if (!isMobile) {
        setNameOverflow({});
        return;
      }
      const entries: Record<string, boolean> = {};
      const refs = nameRefs.current;
      Object.keys(refs).forEach((key) => {
        const el = refs[key];
        if (!el) return;
        const style = window.getComputedStyle(el);
        const lineHeight = parseFloat(style.lineHeight) || 16;
        const maxHeight = lineHeight * 2;
        entries[key] = el.scrollHeight > maxHeight + 1;
      });
      setNameOverflow(entries);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [isMobile, products, visibleSlides]);

  // AUTO slide: always increment index → moves left (translateX negative) - BOTH MOBILE AND DESKTOP
  useEffect(() => {
    if (isMobile || visibleSlides.length <= 1) return;

    const timer = setInterval(() => {
      setTransitionEnabled(true);
      setIndex((p) => {
        // If next would be the last clone, jump to real first instead
        if (p + 1 === total - 1) {
          return 1;
        }
        return p + 1;
      });
    }, 7000);

    return () => clearInterval(timer);
  }, [visibleSlides.length, isMobile, total]);

  // transitionend handler: when we land on a cloned slide, snap (no transition) to the real one
  // Only needed when we have multiple slides with clones
  useEffect(() => {
    if (visibleSlides.length <= 1) return;

    const el = sliderRef.current;
    if (!el) return;

    const onTransitionEnd = () => {
      if (index === 0) {
        setTransitionEnabled(false);
        setIndex(total - 2);
      }
    };

    el.addEventListener("transitionend", onTransitionEnd);
    return () => el.removeEventListener("transitionend", onTransitionEnd);
  }, [index, total, visibleSlides.length]);


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
  // console.log('Rendering FeaturedProducts with products:', products);

  // Do not early-return null; we'll render an empty-state badge below when no products

  return (
    <section
      className="py-16 bg-center bg-cover"
      style={{ backgroundImage: "url('/featured products/background.webp')" }}
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
        /* Clamp to 2 lines on mobile */
        .two-line-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        /* Dotted indicator when text exceeds two lines on mobile */
        .mobile-dots {
          position: relative;
        }
        .mobile-dots::after {
          content: "";
          position: absolute;
          right: 8px;
          bottom: 6px;
          width: 32px;
          border-bottom: 1px dotted rgba(255, 255, 255, 0.6);
        }
        /* Hide scrollbar for mobile scroller */
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari */
        }
      `}</style>

      <div className="container-figma">
        <h2 className="text-2xl sm:text-[32px] lg:text-4xl 3xl:text-5xl font-bold text-white mb-8 sm:mb-10 lg:mb-12 3xl:mb-16 font-orbitron" >
          FEATURED PRODUCTS
        </h2>

        {isLoadingProducts ? (
          // SHIMMER SKELETON LOADER
          <div className="overflow-hidden relative w-full flex justify-center">
            <div className="flex flex-row justify-center items-center gap-2 md:gap-1 lg:gap-2 xl:gap-4 2xl:gap-[60px] 3xl:gap-20 w-full max-w-[360px] sm:max-w-[400px] md:max-w-[820px] lg:max-w-[940px] xl:max-w-[1080px] 2xl:max-w-[1264px] 3xl:max-w-[1600px]">
              {(isMobile ? [0] : [0, 1, 2, 3]).map((idx) => (
                <div
                  key={idx}
                  className={`
                    bg-transparent border border-b-0 border-white/30 
                    w-40 sm:w-[180px] md:basis-1/3 lg:basis-1/4 h-[300px] sm:h-[340px] md:h-[460px] lg:h-[480px] xl:h-[500px] 2xl:h-[519px] 3xl:h-[600px] flex flex-col shrink-0
                    shadow-[0_0_15px_rgba(255,255,255,0.1)]
                    overflow-hidden
                    ${(!isLargeDesktop && idx === 1) ? "md:mt-16" : ""}
                  `}
                >
                  {/* IMAGE SKELETON */}
                  <div className="w-full h-[180px] sm:h-[210px] md:h-[290px] lg:h-[310px] xl:h-[330px] 2xl:h-[349px] 3xl:h-[400px] flex items-center justify-center border-b border-white/30 shimmer bg-white/5">
                  </div>

                  {/* NAME SKELETON */}
                  <div className="w-full h-[42px] md:h-[60px] 3xl:h-[70px] flex items-center px-3 md:px-6 3xl:px-8 border-b border-white/30">
                    <div className="shimmer w-3/4 h-4 md:h-5 bg-white/10 rounded"></div>
                  </div>

                  {/* PRICE SKELETON */}
                  <div className="w-full h-[42px] md:h-[60px] 3xl:h-[70px] flex items-center px-3 md:px-6 3xl:px-8">
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
        ) : visibleSlides.length === 0 ? (
          // EMPTY-STATE BADGE WHEN THERE ARE NO PRODUCTS
          <div className="flex justify-center items-center py-8">
            <div className="px-4 py-2 rounded-full border border-white/30 bg-white/10 text-white/80 font-orbitron text-sm md:text-base">
              No featured products available right now
            </div>
          </div>
        ) : (
          <>
            {isMobile ? (
              // Mobile: horizontal scroller with snap
              <div className="overflow-x-auto snap-x snap-mandatory scrollbar-hide relative w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="flex flex-row justify-start items-start gap-2 px-1">
                  {products.map((product, idx) => {
                    const uniqueKey = `m-${idx}`;
                    const isHovered = hoveredKey === uniqueKey;
                    const isOffset = idx % 2 === 1;
                    return (
                      <div
                        key={uniqueKey}
                        data-aos="fade-up"
                        onMouseEnter={() => setHoveredKey(uniqueKey)}
                        onMouseLeave={() => setHoveredKey(null)}
                        onClick={() => router.push(`/product/${product.sku.replace('SKU-', '')}`)}
                        className={`
    bg-transparent border border-b-0 border-white 
    min-w-[174px] w-[174px] h-[300px] sm:h-[340px] flex flex-col shrink-0 snap-start
    shadow-[0_0_15px_rgba(255,255,255,0.1)]
    transition-all duration-700 ease-in-out
    animate-[slideIn_0.5s_ease-out]
    overflow-visible
    ${isHovered ? "" : ""}
    ${isOffset ? "mt-12" : ""}
  `}
                        role="button"
                        style={{ cursor: "pointer", animation: `slideIn 0.5s ease-out ${idx * 0.1}s both` }}
                      >
                        {/* IMAGE */}
                        <div className="w-full h-[165px] sm:h-[210px] flex items-center justify-center border-b border-white relative overflow-hidden" >
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
                        <div className="w-full min-h-[50px] flex items-center px-3 border-b border-white">
                          <h3
                            ref={(el) => {
                              if (el) nameRefs.current[uniqueKey] = el; else delete nameRefs.current[uniqueKey];
                            }}
                            className={`text-white font-orbitron text-[12px] font-semibold leading-tight line-clamp-2 ${nameOverflow[uniqueKey] ? 'mobile-dots' : ''}`}
                          >
                            {product.name}
                          </h3>
                        </div>

                        {/* PRICE */}
                        <div className="w-full min-h-[50px] flex items-center px-3">
                          <p className="text-white font-orbitron flex items-center gap-1 select-none w-full">
                            {isLoading ? (
                              <span className="opacity-70">...</span>
                            ) : isAuthenticated ? (
                              <>
                                <Image src="/icons/currency/dirham-white.svg" alt="Currency" width={16} height={16} className="opacity-60" />
                                <span className="text-sm">{product.price.toLocaleString()}</span>
                              </>
                            ) : (
                              <span className="text-white/80 text-[10px] leading-tight tracking-wider w-full block">
                                <span className="font-bold">Login</span> to <span className="font-bold">access</span> product pricing.
                              </span>
                            )}
                          </p>
                        </div>

                        {/* BUTTON */}
                        <div className="w-full grow min-h-[40px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/product/${product.sku.replace('SKU-', '')}`);
                            }}
                            className={`w-full h-full text-[14px] font-orbitron font-extrabold uppercase transition-all ${isHovered ? "bg-[#FF5C00] text-white" : "bg-white text-[#FF5C00]"}`}
                          >
                            {product.action}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                {/* SLIDER WRAPPER - Desktop/tablet */}
                <div className="overflow-hidden relative w-full" style={{ clipPath: 'inset(0)' }}>
                  <div
                    ref={sliderRef}
                    className={`flex ${transitionEnabled && visibleSlides.length > 1 ? "transition-transform duration-700 ease-in-out" : ""}`}
                    style={{
                      width: visibleSlides.length === 1 ? '100%' : `${total * 100}%`,
                      transform: visibleSlides.length === 1 ? 'translateX(0)' : `translateX(-${index * (100 / total)}%)`,
                    }}
                  >
                    {extendedSlides.map((group, slideIndex) => (
                      <div
                        key={slideIndex}
                        className="flex flex-row justify-start items-start gap-2 md:gap-1 lg:gap-2 xl:gap-4 2xl:gap-[60px] 3xl:gap-20 shrink-0 w-full"
                        style={{
                          width: `${100 / total}%`,
                        }}
                      >
                        {group.map((product, idx) => {
                          const uniqueKey = `${slideIndex}-${idx}`;
                          const isHovered = hoveredKey === uniqueKey;
                          const isOffset = idx % 2 === 1;

                          return (
                            <div
                              key={uniqueKey}
                              data-aos="fade-up"
                              onMouseEnter={() => setHoveredKey(uniqueKey)}
                              onMouseLeave={() => setHoveredKey(null)}
                              onClick={() => router.push(`/product/${product.sku.replace('SKU-', '')}`)}
                              className={`
    bg-transparent border border-b-0 border-white 
    ${isMobile ? 'w-[174px]' : 'w-[200px] md:w-[260px] lg:w-[280px] xl:w-[274px] 2xl:w-[317px] 3xl:w-[350px]'} h-[300px] sm:h-[340px] md:h-[460px] lg:h-[480px] xl:h-[425px] 2xl:h-[475px] 3xl:h-[550px] flex flex-col shrink-0
    shadow-[0_0_15px_rgba(255,255,255,0.1)]
    transition-all duration-700 ease-in-out
    animate-[slideIn_0.5s_ease-out]
    overflow-visible
    ${isHovered ? "" : ""}
    ${isOffset ? "mt-12 md:mt-16 3xl:mt-20" : ""}
  `}
                              role="button"
                              style={{ cursor: "pointer", animation: `slideIn 0.5s ease-out ${idx * 0.1}s both` }}
                            >
                              {/* IMAGE */}
                              <div className="w-full h-[165px] sm:h-[210px] md:h-[290px] lg:h-[310px] xl:h-[250px] 2xl:h-[290px] 3xl:h-[350px] flex items-center justify-center border-b border-white relative overflow-hidden" >
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
                              <div className="w-full min-h-[50px] md:min-h-[60px] 3xl:min-h-[70px] flex items-center px-3 md:px-6 3xl:px-8 border-b border-white">
                                <h3
                                  ref={(el) => {
                                    if (el) nameRefs.current[uniqueKey] = el; else delete nameRefs.current[uniqueKey];
                                  }}
                                  className={`text-white font-orbitron text-[12px] md:text-[16px] 3xl:text-[18px] font-semibold leading-tight line-clamp-2 ${isMobile && nameOverflow[uniqueKey] ? 'mobile-dots' : ''}`}
                                >
                                  {product.name}
                                </h3>
                              </div>

                              {/* PRICE */}
                              <div className="w-full min-h-[50px] md:min-h-[60px] 3xl:min-h-[70px] flex items-center px-3 md:px-6 3xl:px-8">
                                <p className="text-white font-orbitron flex items-center gap-1 md:gap-2 select-none w-full">
                                  {isLoading ? (
                                    <span className="opacity-70">...</span>
                                  ) : isAuthenticated ? (
                                    <>
                                      <Image src="/icons/currency/dirham-white.svg" alt="Currency" width={16} height={16} className="opacity-60 md:w-5 md:h-5 3xl:w-6 3xl:h-6" />
                                      <span className="text-sm md:text-lg 3xl:text-xl">{product.price.toLocaleString()}</span>
                                    </>
                                  ) : (
                                    // Adjusted font size for desktop to prevent overflow
                                    <span className="text-white/80 text-[10px] md:text-[11px] 3xl:text-sm tracking-wider w-full block leading-tight">
                                      <span className="font-bold">Login</span> to <span className="font-bold">access</span> product pricing.
                                    </span>
                                  )}
                                </p>
                              </div>

                              {/* BUTTON */}
                              <div className="w-full grow min-h-[40px] md:min-h-[50px]">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/product/${product.sku.replace('SKU-', '')}`);
                                  }}
                                  className={`w-full h-full text-[14px] md:text-[18px] 3xl:text-[20px] font-orbitron font-extrabold uppercase transition-all ${isHovered ? "bg-[#FF5C00] text-white" : "bg-white text-[#FF5C00]"}`}
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

                {/* Dots (pagination for slides) */}
                <div className="flex justify-center gap-2 md:gap-4 3xl:gap-6 mt-8 3xl:mt-12">
                  {visibleSlides.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => {
                        setTransitionEnabled(true);
                        setIndex(dotIdx + 1);
                      }}
                      className={`h-1 3xl:h-1.5 w-[30px] md:w-[50px] 3xl:w-[70px] transition-all ${index === dotIdx + 1 ? "bg-[#FF5C00]" : "bg-white/30"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};
