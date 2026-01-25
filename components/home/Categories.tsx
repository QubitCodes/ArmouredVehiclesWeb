"use client";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import { useCallback, useEffect, useRef, useState } from "react";

interface Category {
  id?: number;
  title: string;
  image?: string;
}

const FALLBACK_CATEGORIES: Category[] = [
  {
    title: "CORE VEHICLE SYSTEMS",
    image: "/category/Core vehicle.png",
  },
  {
    title: "ARMOR-SPECIFIC SYSTEMS",
    image: "/category/ARMOR SPECIFIC SYSTEMS.png",
  },
  {
    title: "COMMUNICATION & CONTROL SYSTEMS",
    image: "/category/COMMUNICATION & CONTROL SYSTEMS.png",
  },
  {
    title: "CLIMATE & INTERIOR",
    image: "/category/CLIMATE & INTERIOR.png",
  },
  {
    title: "EXTERIOR & UTILITY",
    image: "/category/EXTERIOR & UTILITY.png",
  },
  {
    title: "OEM / CUSTOM MFG",
    image: "/category/OEM BASELINE CHASSIS SOURCING.png",
  },
];


export const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.products.getCategories();
        const data = Array.isArray(res) ? res : res?.data ?? [];
        if (data && data.length > 0) {
          // Filter for top-level categories only
          const topLevel = data.filter((item: any) => !item.parent_id);

          const mapped = topLevel.map((item: any) => ({
            id: item.id,
            title: item.name || "Unknown Category",
            image: item.image ? String(item.image) : undefined,
          }));
          setCategories(mapped);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        // On error, show nothing
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Measure container width for desktop slider calculations
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setMeasuredWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Calculate max slides for desktop (how many positions we can slide)
  const mobileCardWidth = 163;
  const mobileGap = 12; // Tailwind gap-3 = 12px
  const cardWidth = isMobile ? mobileCardWidth + mobileGap : 282; // card width + gap
  const visibleCards = isMobile ? 2 : Math.floor((measuredWidth || 1000) / cardWidth);
  const maxSlide = Math.max(0, categories.length - visibleCards);

  // Auto play - runs every 5 seconds (desktop only)
  useEffect(() => {
    if (categories.length === 0 || isMobile) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        // Infinite loop: if at last position, go back to 0
        if (prev >= maxSlide) return 0;
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [categories.length, maxSlide, isMobile]);

  // Handle Previous - Infinite Loop
  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = prev <= 0 ? maxSlide : prev - 1;
      if (isMobile && containerRef.current) {
        containerRef.current.scrollTo({
          left: nextIndex * (mobileCardWidth + mobileGap),
          behavior: "smooth",
        });
      }
      return nextIndex;
    });
  }, [maxSlide, isMobile]);

  // Handle Next - Infinite Loop
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = prev >= maxSlide ? 0 : prev + 1;
      if (isMobile && containerRef.current) {
        containerRef.current.scrollTo({
          left: nextIndex * (mobileCardWidth + mobileGap),
          behavior: "smooth",
        });
      }
      return nextIndex;
    });
  }, [maxSlide, isMobile]);

  // Calculate progress for display
  const totalSlides = maxSlide + 1;
  const progressWidth = isMobile
    ? scrollProgress * 100
    : totalSlides > 0
      ? ((currentIndex + 1) / totalSlides) * 100
      : 0;

  // Mobile carousel view
  if (isMobile) {
    return (
      <section className="relative py-8">
        <div className="absolute inset-0 z-0 flex flex-col">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="relative w-full h-1/4">
              <Image
                src="/category background/background 1.jpg"
                alt={`Categories Background ${index + 1}`}
                fill
                className="object-cover brightness-50"
                priority
              />
            </div>
          ))}
        </div>
        <div className="px-4 relative z-10">
          <h2 className="font-orbitron text-xl font-extrabold text-white mb-6 leading-none uppercase tracking-wider">
            CATEGORIES
          </h2>

          <div className="relative overflow-x-auto">
            {/* Carousel Container */}
            <div
              ref={containerRef}
              className="flex gap-3 snap-x snap-mandatory"
              onScroll={(e) => {
                const el = e.currentTarget;
                const step = mobileCardWidth + mobileGap;
                const idx = Math.round(el.scrollLeft / step);
                const clamped = Math.max(0, Math.min(idx, maxSlide));
                setCurrentIndex(clamped);
                const totalScrollable = el.scrollWidth - el.clientWidth;
                const progress = totalScrollable > 0 ? el.scrollLeft / totalScrollable : 0;
                setScrollProgress(progress);
              }}>
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="shrink-0 snap-start"
                  style={{ width: `${mobileCardWidth}px` }}>
                  <Link href={`/products?category=${category.id}`}
                    className="block relative w-full h-52 overflow-hidden group bg-black/60">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                    {/* Category Title */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 pb-4">
                      <h3 className="font-orbitron text-white text-[13px] font-bold uppercase leading-tight tracking-wide">
                        {category.title}
                      </h3>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Progress Bar with Navigation */}
            <div className="flex items-center gap-3 mt-6 px-2 hidden md:block">
              {/* Left Arrow - Always Enabled */}
              <button
                onClick={handlePrevious}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Previous">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </button>

              {/* Progress Bar */}
              <div
                className="flex-1 h-[3px] bg-white/20 relative overflow-hidden  rounded-full"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const pct = rect.width > 0 ? clickX / rect.width : 0;
                  if (containerRef.current) {
                    const totalScrollable =
                      containerRef.current.scrollWidth - containerRef.current.clientWidth;
                    containerRef.current.scrollTo({
                      left: pct * totalScrollable,
                      behavior: "smooth",
                    });
                  }
                }}>
                <div
                  className="absolute left-0 top-0 h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${progressWidth}%`,
                  }}></div>
              </div>

              {/* Right Arrow - Always Enabled */}
              <button
                onClick={handleNext}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Next">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </section>
    );
  }

  // Desktop view
  const slideStyle = {
    transform: `translateX(-${currentIndex * 282}px)`,
  };

  return (
    <section className="relative py-12 px-4">
      <div className="absolute inset-0 z-0 flex flex-col">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="relative w-full h-1/4">
            <Image
              src="/category background/background 1.jpg"
              alt={`Categories Background ${index + 1}`}
              fill
              className="object-cover brightness-50"
              priority
            />
          </div>
        ))}
      </div>
      <div className="container-figma mx-auto relative z-10">
        <h2
          className="font-orbitron text-[36px] font-extrabold text-white mb-10 leading-none uppercase"
          data-aos="fade-up">
          CATEGORIES
        </h2>

        <div className="relative overflow-hidden" ref={containerRef}>
          <div
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={slideStyle}>
            {categories.map((category, index) => (
              <div key={index} className="flex-none">
                <Link href={`/products?category=${category.id}`}
                  className="flex flex-col group w-[258px] no-underline"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}>
                  <div className="relative w-[258px] h-[328px] bg-black/80 overflow-hidden">
                    {category.image ? (
                      <Image
                        src={category.image.replace(/^["']|["']$/g, "")}
                        alt={category.title}
                        fill
                        className="object-cover transform scale-100 transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>
                  </div>
                  <h3 className="relative font-orbitron text-white text-[14px] font-black mt-4 text-left leading-none uppercase min-h-10 after:block after:h-[2px] after:bg-white after:w-0 after:transition-all after:duration-500 after:mt-2 group-hover:after:w-full">
                    {category.title}
                  </h3>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar with Navigation */}
        <div className="mt-8 flex items-center gap-4">
          {/* Left Arrow - Always Enabled */}
          <button
            className="text-white/60 hover:text-white transition-colors"
            onClick={handlePrevious}
            aria-label="Previous">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          {/* Progress Bar */}
          <div
            className="flex-1 h-[3px] bg-white/20 relative overflow-hidden rounded-full"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const pct = rect.width > 0 ? clickX / rect.width : 0;
              const targetIndex = Math.round(pct * (totalSlides - 1));
              setCurrentIndex(Math.max(0, Math.min(targetIndex, maxSlide)));
            }}>
            <div
              className="absolute left-0 top-0 h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressWidth}%` }}></div>
          </div>

          {/* Right Arrow - Always Enabled */}
          <button
            className="text-white/60 hover:text-white transition-colors"
            onClick={handleNext}
            aria-label="Next">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
};
