'use client';

import { useState, useEffect, useCallback, useRef, JSX } from 'react';
import Image from 'next/image';

const slides = [
  {
    url: '/slider/Rectangle.jpg',
    title: 'Defence Commerce Reinvented.',
    subtitle: 'Built for Security, Powered by Compliance.',
  },
  {
    url: '/slider/slider 2.jpg',
    title: 'Tactical & Emergency Lighting Systems.',
    subtitle: 'Built for Security, Powered by Compliance.',
  },
];

const mobileSlides = [
  {
    url: '/slider/mobile/mobile1.jpg',
    title: 'Defence Commerce, Reinvented.',
    subtitle: 'Built for Security, Powered by Compliance.',
  },
  {
    url: '/slider/mobile/mobile1.jpg',
    title: 'Tactical & Emergency Lighting Systems.',
    subtitle: 'Built for Security, Powered by Compliance.',
  },
];

export function ImageSlider() {
  const [isMobile, setIsMobile] = useState(false);

  const activeSlides = isMobile ? mobileSlides : slides;

  // Extended slides for infinite loop
  const extendedSlides = [
    activeSlides[activeSlides.length - 1], // clone last
    ...activeSlides,
    activeSlides[0], // clone first
  ];

  const [currentIndex, setCurrentIndex] = useState(1); // start at real first slide
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const sliderRef = useRef<HTMLDivElement | null>(null);

  // Handle responsive mode
  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth < 640);
      setCurrentIndex(1); // reset to first extended slide
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Auto play
  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(timer);
  });

  // NEXT button handler
  const goToNext = useCallback(() => {
    setTransitionEnabled(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  // PREV button handler
  const goToPrevious = useCallback(() => {
    setTransitionEnabled(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  // Fix looping when you reach cloned slides
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const handleTransitionEnd = () => {
      const lastIndex = extendedSlides.length - 1;

      // If at cloned-first → snap to real first
      if (currentIndex === lastIndex) {
        setTransitionEnabled(false);
        setCurrentIndex(1); // real first
      }

      // If at cloned-last → snap to real last
      if (currentIndex === 0) {
        setTransitionEnabled(false);
        setCurrentIndex(lastIndex - 1); // real last
      }
    };

    el.addEventListener('transitionend', handleTransitionEnd);
    return () => el.removeEventListener('transitionend', handleTransitionEnd);
  }, [currentIndex, extendedSlides.length]);

  // Get the real slide to show text
  const realIndex = currentIndex - 1;
  const realSlide =
    extendedSlides[currentIndex] || extendedSlides[1];

  return (
    <div className="relative h-[550px] sm:h-[650px] lg:h-[700px] w-full overflow-hidden -mt-16">

      {/* BACKGROUND SLIDES */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div
          ref={sliderRef}
          className={`flex h-full ${transitionEnabled ? 'transition-transform duration-700 ease-in-out' : ''}`}
          style={{
            width: `${extendedSlides.length * 100}%`,
            transform: `translateX(-${currentIndex * (100 / extendedSlides.length)}%)`,
          }}
        >
          {extendedSlides.map((slide, index) => (
            <div
              key={`${slide.url}-${index}`}
              className="relative h-full flex-shrink-0"
              style={{ width: `${100 / extendedSlides.length}%` }}
            >
              <Image
                src={slide.url}
                alt={slide.title}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT (Text) */}
      <div className="container-figma h-full flex items-center relative z-10">
        <div
          className={
            isMobile
              ? 'w-full text-white text-left px-6'
              : 'w-full lg:w-1/2 text-white flex justify-start pl-4 sm:pl-8 lg:pl-16'
          }
        >
          <div className="max-w-lg mx-auto lg:mx-0">

            {/* TITLE */}
            <h1
              className="uppercase text-orange-500 transition-opacity duration-500"
              style={{
                fontFamily: 'Orbitron',
                fontWeight: 900,
                fontSize: isMobile ? '28px' : 'clamp(32px, 5vw, 65px)',
                lineHeight: '1.1',
              }}
            >
              {(() => {
                const title = realSlide.title.split(',')[0];
                const words = title.split(' ');
                const spans: JSX.Element[] = [];
                let buffer = '';
                let key = 0;

                for (let i = 0; i < words.length; i++) {
                  const w = words[i];
                  const isSpecial = /^[^A-Za-z0-9]+$/.test(w);

                  if (isSpecial && buffer) {
                    buffer += ' ' + w;
                  } else {
                    if (buffer) {
                      spans.push(<span key={key++}>{buffer}<br /></span>);
                    }
                    buffer = w;
                  }
                }

                if (buffer) {
                  spans.push(<span key={key++}>{buffer}<br /></span>);
                }

                return spans;
              })()}
            </h1>

            {/* SUBTITLE */}
            <p className="text-sm sm:text-base lg:text-lg text-gray-200 mt-4">
              {realSlide.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* ARROWS */}
      <div className="container-figma absolute inset-0 hidden sm:flex items-center justify-between pointer-events-none z-20">
        <button
          onClick={goToPrevious}
          className="pointer-events-auto text-[#cccccc] hover:text-orange-500 transition-colors p-2 sm:p-4"
        >
          <span className="text-[32px] sm:text-4xl lg:text-5xl">‹</span>
        </button>

        <button
          onClick={goToNext}
          className="pointer-events-auto text-[#cccccc] hover:text-orange-500 transition-colors p-2 sm:p-4"
        >
          <span className="text-[32px] sm:text-4xl lg:text-5xl">›</span>
        </button>
      </div>

      {/* MOBILE INDICATORS */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20 sm:hidden">
        {activeSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setTransitionEnabled(true);
              setCurrentIndex(idx + 1); // map real index → extended index
            }}
            className={`h-[3px] w-[37px] rounded-full transition-all ${
              idx === realIndex ? 'bg-orange-500' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
