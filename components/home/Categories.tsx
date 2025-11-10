"use client";
import Image from 'next/image';

const categories = [
  {
    title: "CORE VEHICLE SYSTEMS",
    image: "/category/00ad928fc7f1fd0dc10beaad4db27af80ac6c15a.jpg"
  },
  {
    title: "ARMOR-SPECIFIC SYSTEMS",
    image: "/category/06b5af499d983de366426bbf1f8f0907a2ebc416.jpg"
  },
  {
    title: "COMMUNICATION & CONTROL SYSTEMS",
    image: "/category/18e33c0223c17aca24945ed720a29bceaba5efbb.jpg"
  },
  {
    title: "CLIMATE & INTERIOR",
    image: "/category/1a962f6fb0a919096bfd1f17952c34f51ddab776.jpg"
  },
  {
    title: "EXTERIOR & UTILITY",
    image: "/category/33b6c185868adc8d2a670e0b378e4924cb737ae0.jpg"
  },
  {
    title: "OEM / CUSTOM MFG",
    image: "/category/9298550bbe803a362d34231b7ce8545e6c52e822.jpg"
  }
];

import { useCallback, useEffect, useRef, useState } from 'react';

export const Categories = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxSlide, setMaxSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  const updateMaxSlide = useCallback(() => {
    if (containerRef.current && slideRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const slideWidth = slideRef.current.scrollWidth;
      const maxScroll = slideWidth - containerWidth;
      const itemWidth = 258 + 24; // image width + gap
      setMaxSlide(Math.ceil(maxScroll / itemWidth));
    }
  }, []);

  useEffect(() => {
    updateMaxSlide();
    window.addEventListener('resize', updateMaxSlide);
    return () => window.removeEventListener('resize', updateMaxSlide);
  }, [updateMaxSlide]);

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxSlide));
  };

  const slideStyle = {
    transform: `translateX(-${currentIndex * (258 + 24)}px)` // image width + gap
  };

  const progressStyle = {
    width: `${((currentIndex + 1) / (maxSlide + 1)) * 100}%`
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
      <div className="container mx-auto relative z-10">
        <h2 className="font-orbitron text-[36px] font-extrabold text-white mb-10 leading-none uppercase">CATEGORIES</h2>
        
        <div className="relative overflow-hidden" ref={containerRef}>
          <div 
            ref={slideRef}
            className="flex gap-6 transition-transform duration-500 ease-out -mx-4"
            style={slideStyle}
          >
            {categories.map((category, index) => (
              <div key={index} className="flex-none px-4">
                <div className="flex flex-col cursor-pointer group w-[258px]">
                  <div className="relative w-[258px] h-[328px] bg-black/80">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover opacity-100 group-hover:brightness-110 transition-all duration-300"
                    />
                  </div>
                  <h3 className="font-orbitron text-white text-[14px] font-black mt-4 text-left leading-none uppercase min-h-10">
                    {category.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
          
          {/* Slider Progress Bar with Navigation */}
          <div className="mt-8 flex items-center">
            <button 
              className={`text-white/60 hover:text-white transition-colors mr-4 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div className="flex-1 h-0.5 bg-white/10 relative">
              <div 
                className="absolute left-0 top-0 h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
                style={progressStyle}
              ></div>
            </div>
            <button 
              className={`text-white/60 hover:text-white transition-colors ml-4 ${currentIndex >= maxSlide ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleNext}
              disabled={currentIndex >= maxSlide}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};