"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    gallery?: string[];
    action: "BUY NOW" | "SUBMIT AN INQUIRY";
}

export const FeaturedCarousel = () => {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Embla setup
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        skipSnaps: false,
        dragFree: false, // Set to false to enforce snap points/pages
        slidesToScroll: 1,
        breakpoints: {
            '(min-width: 768px)': { slidesToScroll: 2 },
            '(min-width: 1024px)': { slidesToScroll: 3 }
        }
    }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    const onInit = useCallback((emblaApi: any) => {
        setScrollSnaps(emblaApi.scrollSnapList());
    }, []);

    const onSelect = useCallback((emblaApi: any) => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        onInit(emblaApi);
        onSelect(emblaApi);
        emblaApi.on('reInit', onInit);
        emblaApi.on('reInit', onSelect);
        emblaApi.on('select', onSelect);
    }, [emblaApi, onInit, onSelect]);

    // Image Hover Logic
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [imageIndices, setImageIndices] = useState<Record<number, number>>({});

    useEffect(() => {
        if (hoveredId === null) return;
        const interval = setInterval(() => {
            setImageIndices(prev => {
                const product = products.find(p => p.id === hoveredId);
                if (!product || !product.gallery || product.gallery.length <= 1) return prev;
                const current = prev[hoveredId] || 0;
                const next = (current + 1) % product.gallery.length;
                return { ...prev, [hoveredId]: next };
            });
        }, 800);
        return () => clearInterval(interval);
    }, [hoveredId, products]);

    // Fetch Logic
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await api.products.getFeatured();
                const mapped: Product[] = data?.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    price: Number(item.price),
                    image: item.image || "/placeholder.jpg",
                    gallery: (item.gallery && item.gallery.length) ? item.gallery : [item.image || "/placeholder.jpg"],
                    action: item.actionType === "inquiry" ? "SUBMIT AN INQUIRY" : "BUY NOW"
                })) || [];
                setProducts(mapped);
            } catch (e) {
                console.error("Failed to load featured carousel:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (!loading && products.length === 0) return null;

    return (
        <section
            className="py-16 w-full bg-cover bg-center overflow-hidden"
            style={{ backgroundImage: "url('/featured products/background.webp')" }}
        >
            <div className="container-figma mx-auto px-4 md:px-8">

                {/* Header */}
                <div className="flex justify-between items-end mb-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white font-orbitron uppercase tracking-wide">
                        Featured Products
                    </h2>

                    {/* Controls */}
                    <div className="hidden md:flex gap-2">
                        <button onClick={scrollPrev} className="p-2 border border-white/30 hover:bg-white/10 text-white transition">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button onClick={scrollNext} className="p-2 border border-white/30 hover:bg-white/10 text-white transition">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Carousel Viewport */}
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex -ml-4 md:-ml-6 py-4 items-start">
                        {products.map((product, index) => (
                            <div
                                key={product.id}
                                className={`flex-[0_0_80%] md:flex-[0_0_40%] lg:flex-[0_0_28%] pl-4 md:pl-6 min-w-0 transition-all duration-500 ease-in-out ${index % 2 !== 0 ? (isAuthenticated ? 'mt-16 md:mt-22' : 'mt-[60px]') : ''}`}
                            >
                                <div
                                    className="bg-[#1a1a1a] flex flex-col h-full shadow-lg group cursor-pointer transition-transform hover:-translate-y-1 duration-300"
                                    onMouseEnter={() => setHoveredId(product.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    onClick={() => router.push(`/product/${product.id}`)}
                                >
                                    {/* Image Area (White Background) */}
                                    <div className="aspect-square relative flex items-center justify-center p-4 bg-white overflow-hidden">
                                        <Image
                                            src={
                                                hoveredId === product.id && product.gallery && product.gallery.length > 0
                                                    ? product.gallery[imageIndices[product.id] || 0]
                                                    : product.image
                                            }
                                            alt={product.name}
                                            fill
                                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Title Bar (Black) */}
                                    <div className="bg-black p-3 md:p-4 min-h-[60px] flex items-center">
                                        <h3 className="text-white font-orbitron font-semibold text-sm md:text-base leading-tight line-clamp-2">
                                            {product.name}
                                        </h3>
                                    </div>

                                    {/* Price / Login Bar (Dark Gray/Black Border Top) */}
                                    <div className="bg-[#1a1a1a] p-3 md:p-4 border-t border-white/10 flex items-center min-h-[50px]">
                                        {isLoading ? (
                                            <span className="text-white/50 text-xs">Loading...</span>
                                        ) : isAuthenticated ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-[#FF5C00] font-orbitron font-bold text-lg">
                                                    AED {product.price.toLocaleString()}
                                                </span>
                                            </div>
                                        ) : (
                                            <p className="text-white/70 text-[10px] md:text-xs leading-tight">
                                                <span className="text-white font-bold">Login</span> to access product pricing.
                                            </p>
                                        )}
                                    </div>

                                    {/* Button Area (White) - Only show if logged in */}
                                    {isAuthenticated && (
                                        <div className="mt-auto">
                                            <button className="w-full bg-white text-[#FF5C00] font-orbitron font-extrabold text-sm md:text-lg py-4 border-t border-gray-100 uppercase hover:bg-[#FF5C00] hover:text-white transition-colors duration-300">
                                                {product.action}
                                            </button>
                                        </div>
                                    )}

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Indicators / Dots */}
                {scrollSnaps.length > 1 && (
                    <div className="flex justify-center gap-3 mt-12">
                        {scrollSnaps.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => scrollTo(idx)}
                                className={`h-1 transition-all duration-300 ${idx === selectedIndex
                                    ? 'w-12 bg-[#FF5C00]'
                                    : 'w-8 bg-white/30 hover:bg-white/50'
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
};
