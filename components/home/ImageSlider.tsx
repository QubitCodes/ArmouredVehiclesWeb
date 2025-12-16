'use client';

import { useState, useEffect, useCallback, JSX } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const goToPrevious = useCallback(() => {
    const totalSlides = isMobile ? mobileSlides.length : slides.length;
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? totalSlides - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, isMobile]);

  const goToNext = useCallback(() => {
    const totalSlides = isMobile ? mobileSlides.length : slides.length;
    const isLastSlide = currentIndex === totalSlides - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, isMobile]);

  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth < 640);
      setCurrentIndex(0); // Reset slide when switching between mobile/desktop
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, goToNext]);

  const activeSlides = isMobile ? mobileSlides : slides;

  return (
    <div className="relative h-[550px] sm:h-[650px] lg:h-[700px] w-full overflow-hidden -mt-16">

      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {activeSlides.map((slide, index) => (
            <div key={index} className="relative w-full h-full flex-shrink-0">
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

      {/* Content container */}
      <div className="container-figma h-full flex items-center relative z-10">

        {/* Text Block */}
        <div
          className={
            isMobile
              ? 'w-full text-white text-left px-6'
              : 'w-full lg:w-1/2 text-white flex justify-start pl-4 sm:pl-8 lg:pl-16'
          }
        >
          <div className="max-w-lg mx-auto lg:mx-0">
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
                const title = activeSlides[currentIndex].title.split(',')[0];
                const words = title.split(' ');
                const spans: JSX.Element[] = [];
                let buffer = '';
                let key = 0;

                for (let i = 0; i < words.length; i++) {
                  const w = words[i];
                  const isSpecial = /^[^A-Za-z0-9]+$/.test(w); // tokens like "&", "/", "-", etc.

                  if (isSpecial && buffer) {
                    // append special token to previous buffer (keep on same line)
                    buffer += ' ' + w;
                  } else {
                    if (buffer) {
                      spans.push(
                        <span key={key++}>
                          {buffer}
                          <br />
                        </span>
                      );
                    }
                    buffer = w;
                  }
                }

                if (buffer) {
                  spans.push(
                    <span key={key++}>
                      {buffer}
                      <br />
                    </span>
                  );
                }

                return spans;
              })()}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-gray-200 mt-4">
              {activeSlides[currentIndex].subtitle}
            </p>
          </div>
        </div>

        {!isMobile && (
          <div className="hidden lg:block lg:w-1/2 h-full relative"></div>
        )}
      </div>

      {/* Nav Buttons - Hidden on mobile */}
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

      {/* Slide indicators */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">

        {/* MOBILE INDICATORS (bars) */}
        <div className="flex sm:hidden gap-2">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`
          h-[3px] w-[37px] rounded-full transition-all
          ${index === currentIndex ? 'bg-orange-500' : 'bg-white/50'}
        `}
            />
          ))}
        </div>

        {/* DESKTOP INDICATORS (dots) */}
        {/* <div className="hidden sm:flex gap-2">
    {activeSlides.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentIndex(index)}
        className={`
          w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all
          ${index === currentIndex ? 'bg-orange-500 w-4 sm:w-6 lg:w-8' : 'bg-white/50 hover:bg-white/80'}
        `}
      />
    ))}
  </div> */}

      </div>

    </div>
  );
}
