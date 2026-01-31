'use client';

import { useState, useEffect, useCallback, useRef, JSX } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api';

// const slides = [
//   {
//     url: '/slider/Rectangle.jpg',
//     title: 'Defence Commerce Reinvented.',
//     subtitle: 'Built for Security, Powered by Compliance.',
//   },
//   {
//     url: '/slider/slider 2.jpg',
//     title: 'Tactical & Emergency Lighting Systems.',
//     subtitle: 'Built for Security, Powered by Compliance.',
//   },
// ];

// const mobileSlides = [
//   {
//     url: '/slider/mobile/mobile1.png',
//     title: 'Defence Commerce, Reinvented.',
//     subtitle: 'Built for Security, Powered by Compliance.',
//   },
//   {
//     url: '/slider/mobile/mobile2.png',
//     title: 'Tactical & Emergency Lighting Systems.',
//     subtitle: 'Built for Security, Powered by Compliance.',
//   },
// ];

interface SliderData {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
  link?: string;
  button_text?: string;
  sort_order: number;
}

export function ImageSlider() {
  const [isMobile, setIsMobile] = useState(false);
  const [slides, setSlides] = useState<SliderData[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(1); // start at real first slide
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    api.webFrontend.getSliders()
      .then((data) => {
        setSlides(data);
      })
      .catch((err) => console.error("Failed to load sliders", err))
      .finally(() => setLoading(false));
  }, []);

  // Use slides for both mobile and desktop (API only returns one image per slider)
  const activeSlides = slides;

  // Extended slides for infinite loop: Clone last at start, clone first at end
  const extendedSlides = activeSlides.length > 0 ? [
    activeSlides[activeSlides.length - 1], // clone last
    ...activeSlides,
    activeSlides[0], // clone first
  ] : [];

  // Handle responsive mode
  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Auto play
  useEffect(() => {
    if (activeSlides.length <= 1) return;

    const timer = setInterval(() => {
      // Safety check before moving next
      setCurrentIndex((prev) => {
        // If we somehow drifted passed the end, snap back immediately to 1 (real first)
        if (prev >= extendedSlides.length - 1) {
          setTransitionEnabled(false);
          return 1;
        }
        setTransitionEnabled(true);
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [activeSlides.length, extendedSlides.length]);

  // NEXT button handler
  const goToNext = useCallback(() => {
    if (activeSlides.length <= 1) return;

    setCurrentIndex(prev => {
      if (prev >= extendedSlides.length - 1) {
        setTransitionEnabled(false);
        return 1;
      }
      setTransitionEnabled(true);
      return prev + 1;
    });
  }, [activeSlides.length, extendedSlides.length]);

  // PREV button handler
  const goToPrevious = useCallback(() => {
    if (activeSlides.length <= 1) return;
    setCurrentIndex(prev => {
      if (prev <= 0) {
        setTransitionEnabled(false);
        return extendedSlides.length - 2;
      }
      setTransitionEnabled(true);
      return prev - 1;
    });
  }, [activeSlides.length, extendedSlides.length]);

  // Fix looping when you reach cloned slides
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const handleTransitionEnd = (e: TransitionEvent) => {
      // Ensure we only listen to the transform transition of the container
      if (e.target !== el) return;

      const lastIndex = extendedSlides.length - 1;

      if (currentIndex >= lastIndex) {
        setTransitionEnabled(false);
        setCurrentIndex(1); // real first
      }

      if (currentIndex <= 0) {
        setTransitionEnabled(false);
        setCurrentIndex(lastIndex - 1); // real last
      }
    };

    // Use native event listener
    el.addEventListener('transitionend', handleTransitionEnd);
    return () => el.removeEventListener('transitionend', handleTransitionEnd);
  }, [currentIndex, extendedSlides.length]);


  if (loading) {
    return (
      <section className="h-[350px] sm:h-[650px] lg:h-[700px] w-full bg-[#f0f0f0] animate-pulse flex items-center justify-center font-sans">
        <p className="text-xl text-gray-400">Loading Slider...</p>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="h-[350px] sm:h-[650px] lg:h-[700px] w-full bg-[#3d3d3d] flex items-center justify-center font-sans">
        <div className="px-6 py-3 rounded-full border border-white/20 bg-black/20 text-white/80 font-orbitron text-base md:text-lg">
          No active sliders found.
        </div>
      </section>
    );
  }

  const realIndex = currentIndex - 1;
  const realSlide = extendedSlides[currentIndex];

  return (
    <div className="relative h-[350px] sm:h-[650px] lg:h-[700px] w-full overflow-hidden lg:-mt-16 group bg-black">

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
          {extendedSlides.map((slide, index) => {
            // Logic for Slide Container (Link or Div)
            const link = slide.link;
            const buttonText = slide.button_text;

            const isSliderLink = link && !buttonText;
            const Container = isSliderLink ? 'a' : 'div';
            const containerProps = isSliderLink ? { href: link, target: '_blank', rel: 'noopener noreferrer' } : {};

            return (
              <Container
                key={`${slide.id}-${index}`}
                className="relative h-full flex-shrink-0 block w-full"
                style={{ width: `${100 / extendedSlides.length}%` }}
                {...containerProps}
              >
                <Image
                  src={slide.image_url}
                  alt={slide.title || 'Slide'}
                  fill
                  className="object-contain"
                />
              </Container>
            );
          })}
        </div>
      </div>

      {realSlide && (
        <div className={`container-figma h-full flex relative z-10 pointer-events-none ${isMobile ? 'items-center pb-15' : 'items-center'
          }`}>
          <div
            className={
              isMobile
                ? 'w-full text-white text-left px-0 pointer-events-auto'
                : 'w-full lg:w-1/2 text-white flex justify-start pl-4 sm:pl-8 lg:pl-16 pointer-events-auto'
            }
          >
            <div className="max-w-lg mx-auto lg:mx-0">

              {/* TITLE */}
              {realSlide.title && (
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
                    const title = realSlide.title || '';
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
              )}

              {/* SUBTITLE */}
              {realSlide.subtitle && (
                <p className="text-sm sm:text-base lg:text-lg text-gray-200 mt-4 font-medium drop-shadow-md">
                  {realSlide.subtitle}
                </p>
              )}

              {/* BUTTON */}
              {realSlide.button_text && realSlide.link && (
                <div className="mt-8">
                  <a
                    href={realSlide.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg uppercase tracking-wide text-sm sm:text-base"
                  >
                    {realSlide.button_text}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ARROWS (Only if > 1 slide) */}
      {activeSlides.length > 1 && (
        <div className="container-figma absolute inset-0 hidden sm:flex items-center justify-between pointer-events-none z-20">
          <button
            onClick={goToPrevious}
            className="pointer-events-auto text-[#cccccc] hover:text-orange-500 transition-colors p-2 sm:p-4 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm"
          >
            <span className="text-[32px] sm:text-4xl lg:text-5xl">‹</span>
          </button>

          <button
            onClick={goToNext}
            className="pointer-events-auto text-[#cccccc] hover:text-orange-500 transition-colors p-2 sm:p-4 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm"
          >
            <span className="text-[32px] sm:text-4xl lg:text-5xl">›</span>
          </button>
        </div>
      )}

      {/* MOBILE INDICATORS */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20 sm:hidden">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTransitionEnabled(true);
                setCurrentIndex(idx + 1); // map real index -> extended index
              }}
              className={`h-[3px] w-[37px] rounded-full transition-all ${idx === realIndex ? 'bg-orange-500' : 'bg-white/50'
                }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
