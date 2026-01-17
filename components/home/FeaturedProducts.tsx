"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect, useRef, useMemo } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  gallery?: string[];
  action: "BUY NOW" | "SUBMIT AN INQUIRY";
}

// Fallback products when API returns empty or fails
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Armoured Vehicle Component",
    price: 15000,
    image: "/featured products/product1.png",
    gallery: ["/featured products/product1.png"],
    action: "BUY NOW",
  },
  {
    id: 2,
    name: "Tactical Communication System",
    price: 25000,
    image: "/featured products/product2.png",
    gallery: ["/featured products/product2.png"],
    action: "BUY NOW",
  },
  {
    id: 3,
    name: "Ballistic Protection Kit",
    price: 35000,
    image: "/featured products/product3.png",
    gallery: ["/featured products/product3.png"],
    action: "SUBMIT AN INQUIRY",
  },
];

export const FeaturedProducts = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [index, setIndex] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [imageIndices, setImageIndices] = useState<Record<string, number>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [isLargeDesktop, setIsLargeDesktop] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const { isAuthenticated, isLoading } = useAuth();

  // Detect mobile and large desktop screen sizes
  useEffect(() => {
    const checkSizes = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsLargeDesktop(width >= 1024);
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
          id: item.id,
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
        if (!mappedProducts || mappedProducts.length === 0) {
          setProducts(FALLBACK_PRODUCTS);
        } else {
          setProducts(mappedProducts);
        }
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
        // On fetch failure, use fallback products
        setProducts(FALLBACK_PRODUCTS);
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

  // AUTO slide: always increment index → moves left (translateX negative) - BOTH MOBILE AND DESKTOP
useEffect(() => {
  if (visibleSlides.length <= 1) return;

  const timer = setInterval(() => {
    setTransitionEnabled(true);
    setIndex((p) => {
      // If next would be the last clone, jump to real first instead
      if (p + 1 === total - 1) {
        return 1;
      }
      return p + 1;
    });
  }, isMobile ? 4000 : 700000);

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
          <div className="overflow-hidden relative w-full flex justify-center">
            <div className="flex flex-row justify-center items-center gap-2 md:gap-1 lg:gap-2 xl:gap-4 2xl:gap-[60px] w-full max-w-[360px] sm:max-w-[400px] md:max-w-[820px] lg:max-w-[940px] xl:max-w-[1080px] 2xl:max-w-[1264px]">
              {(isMobile ? [0] : [0, 1, 2, 3]).map((idx) => (
                <div
                  key={idx}
                  className={`
                    bg-transparent border border-b-0 border-white/30 
                    w-40 sm:w-[180px] md:basis-1/3 lg:basis-1/4 h-[300px] sm:h-[340px] md:h-[460px] lg:h-[480px] xl:h-[500px] 2xl:h-[519px] flex flex-col shrink-0
                    shadow-[0_0_15px_rgba(255,255,255,0.1)]
                    overflow-hidden
                    ${(!isLargeDesktop && idx === 1) ? "md:mt-16" : ""}
                  `}
                >
                  {/* IMAGE SKELETON */}
                  <div className="w-full h-[180px] sm:h-[210px] md:h-[290px] lg:h-[310px] xl:h-[330px] 2xl:h-[349px] flex items-center justify-center border-b border-white/30 shimmer bg-white/5">
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
        ) : visibleSlides.length === 0 ? (
          // EMPTY-STATE BADGE WHEN THERE ARE NO PRODUCTS
          <div className="flex justify-center items-center py-8">
            <div className="px-4 py-2 rounded-full border border-white/30 bg-white/10 text-white/80 font-orbitron text-sm md:text-base">
              No featured products available right now
            </div>
          </div>
        ) : (
          <>
            {/* SLIDER WRAPPER - Auto-slide on both mobile and desktop */}
            <div className="overflow-hidden relative w-full">
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
                      className="flex flex-row justify-start items-start gap-2 md:gap-1 lg:gap-2 xl:gap-4 2xl:gap-[60px] shrink-0 w-full"
                    style={{ 
                      width: `${100 / total}%`,
                      // maxWidth: isMobile ? '360px' : isLargeDesktop ? '1264px' : '940px',
                      // margin: '0 auto'
                    }}
                  >
                {group.map((product, idx) => {
                  const uniqueKey = `${slideIndex}-${idx}`;
                  const isHovered = hoveredKey === uniqueKey;
                  // Offset pattern: 2nd and 4th cards (odd indices) should be pushed down
                  const isOffset = idx % 2 === 1;

                  return (
                    <div
                      key={uniqueKey}
                      data-aos="fade-up"
                      onMouseEnter={() => setHoveredKey(uniqueKey)}
                      onMouseLeave={() => setHoveredKey(null)}
                      onClick={() => router.push(`/product/${product.id}`)}
                      className={`
    bg-transparent border border-b-0 border-white 
    ${isMobile ? 'w-[170px]' : 'w-[200px] md:w-[260px] lg:w-[280px] xl:w-[300px] 2xl:w-[358px]'} h-[300px] sm:h-[340px] md:h-[460px] lg:h-[480px] xl:h-[500px] 2xl:h-[490px] flex flex-col shrink-0
    shadow-[0_0_15px_rgba(255,255,255,0.1)]
    transition-all duration-700 ease-in-out
    animate-[slideIn_0.5s_ease-out]
    overflow-visible
    ${isHovered ? "" : ""}
    ${isOffset ? "mt-12 md:mt-16" : ""}
  `}
                      role="button"
                      style={{ cursor: "pointer", animation: `slideIn 0.5s ease-out ${idx * 0.1}s both` }}
                    >


                      {/* IMAGE */}
                      <div className="w-full h-[180px] sm:h-[210px] md:h-[290px] lg:h-[310px] xl:h-[330px] 2xl:h-[320px] flex items-center justify-center border-b border-white relative overflow-hidden" >
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

        {/* Dots (pagination for slides) */}
        <div className="flex justify-center gap-2 md:gap-4 mt-8">
          {visibleSlides.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => {
                setTransitionEnabled(true);
                setIndex(dotIdx + 1);
              }}
              className={`h-1 w-[30px] md:w-[50px] transition-all ${index === dotIdx + 1 ? "bg-[#FF5C00]" : "bg-white/30"}`}
            />
          ))}
        </div>
        </>
        )}
      </div>
    </section>
  );
};
