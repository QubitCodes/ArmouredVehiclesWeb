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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.products.getCategories();
        const data = Array.isArray(res) ? res : res?.data ?? [];
        if (data && data.length > 0) {
          const mapped = data.map((item: any) => ({
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

  const handlePrevious = () => {
    if (containerRef.current) {
      const scrollAmount = isMobile ? 163 + 8 : 282; // card width + gap
      containerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (containerRef.current) {
      const scrollAmount = isMobile ? 163 + 8 : 282;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Track scroll position for progress bar
  useEffect(() => {
    if (!isMobile || !containerRef.current) return;

    const container = containerRef.current;
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = 163 + 8; // card + gap
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // Mobile carousel view
  if (isMobile) {
    const cardWidth = 163; // Fixed card width in pixels
    const gap = 8; // Gap between cards

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

          <div className="relative">
            {/* Carousel Container */}
            <div
              ref={containerRef}
              className="relative overflow-x-auto overflow-y-hidden rounded-none scrollbar-hide snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              <div className="flex gap-3">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="shrink-0 snap-start"
                    style={{ width: `${cardWidth}px` }}>
                    <Link
                      href={
                        category.id !== undefined
                          ? `/products?category_id=${category.id}`
                          : `/products`
                      }
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
            </div>

            {/* Navigation Arrows */}
            {/* <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`absolute left-4 top-[45%] -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center transition-all ${
                currentIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'opacity-60'
              }`}
              aria-label="Previous category"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === categories.length - 1}
              className={`absolute right-4 top-[45%] -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center transition-all ${
                currentIndex === categories.length - 1 ? 'opacity-20 cursor-not-allowed' : 'opacity-60'
              }`}
              aria-label="Next category"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button> */}

            {/* Progress Bar */}
            <div className="flex items-center gap-3 mt-6 px-2">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`transition-opacity ${
                  currentIndex === 0
                    ? "opacity-20 cursor-not-allowed"
                    : "opacity-60"
                }`}
                aria-label="Previous">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="white"
                  className="w-5 h-5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </button>

              <div className="flex-1 h-[2px] bg-white/20 relative overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-orange-500 transition-all duration-500 ease-out"
                  style={{
                    width: `${categories.length ? (((currentIndex + 1) / categories.length) * 100) : 0}%`,
                  }}></div>
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex === categories.length - 1}
                className={`transition-opacity ${
                  currentIndex === categories.length - 1
                    ? "opacity-20 cursor-not-allowed"
                    : "opacity-60"
                }`}
                aria-label="Next">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="white"
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

  // Desktop view (original design)
  const maxSlide = Math.max(
    0,
    categories.length - Math.floor((measuredWidth || 0) / 282)
  );

  const slideStyle = {
    transform: `translateX(-${currentIndex * 282}px)`,
  };

  const progressStyle = {
    width: `${((currentIndex + 1) / (maxSlide + 1)) * 100}%`,
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
                <Link
                  href={
                    category.id !== undefined
                      ? `/products?category_id=${category.id}`
                      : `/products`
                  }
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

          {/* Slider Progress Bar with Navigation */}
          <div className="mt-8 flex items-center">
            <button
              className={`text-white/60 hover:text-white transition-colors mr-4 ${
                currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handlePrevious}
              disabled={currentIndex === 0}>
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
            <div className="flex-1 h-0.5 bg-white/10 relative">
              <div
                className="absolute left-0 top-0 h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
                style={progressStyle}></div>
            </div>
            <button
              className={`text-white/60 hover:text-white transition-colors ml-4 ${
                currentIndex >= maxSlide ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleNext}
              disabled={currentIndex >= maxSlide}>
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
      </div>
    </section>
  );
};
