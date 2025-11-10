'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const slides = [
  {
    url: '/slider/slider sample.jpg',
    title: 'Defence Commerce, Reinvented.',
    subtitle: 'Built for Security, Powered by Compliance.'
  },
  // Add more slides here as needed
];

export function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  useEffect(() => {
    const timer = setInterval(goToNext, 5000); // Auto-slide every 5 seconds
    return () => clearInterval(timer);
  }, [currentIndex, goToNext]);

  return (
    <div className="relative h-[700px] w-full overflow-hidden -mt-16 bg-[url('/slider/Rectangle.jpg')] bg-cover bg-center" >
      <div className="container mx-auto h-full flex items-center justify-center max-w-7xl">
        {/* Left side - Text content */}
        <div className="w-1/2 text-white z-10 flex justify-left">
          <div className="max-w-lg">
            <h1 className="uppercase text-orange-500" style={{ 
              fontFamily: 'Orbitron',
              fontWeight: 900,
              fontSize: '65px',
              lineHeight: '61px',
              letterSpacing: '0%',
              textTransform: 'uppercase',
              fontStyle: 'normal'
            }}>
              <span>DEFENCE</span>
              <br />
              <span>COMMERCE,</span>
              <br />
              <span>REINVENTED.</span>
            </h1>
            
            <p className="text-lg text-gray-200">
              {slides[currentIndex].subtitle}
            </p>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="w-1/2 h-full relative flex items-center justify-center">
          {/* <Image
            src={slides[currentIndex].url}
            alt={slides[currentIndex].title}
            fill
            className="object-contain scale-150 transform"
            sizes="(max-width: 1600px) 100vw, 1600px"
            quality={100}
            priority
          /> */}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-[15%] top-1/2 -translate-y-1/2 text-[#cccccc] text-5xl z-20 hover:text-orange-500 transition-colors"
      >
        ‹
      </button>
      <button
        onClick={goToNext}
        className="absolute right-[15%] top-1/2 -translate-y-1/2 text-[#cccccc] text-5xl z-20 hover:text-orange-500 transition-colors"
      >
        ›
      </button>
    </div>
  );
}