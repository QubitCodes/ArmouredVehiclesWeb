"use client";
import Image from "next/image";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  action: "BUY NOW" | "SUBMIT AN INQUIRY";
}

const products: Product[] = [
  {
    id: 1,
    name: "Tubeless Runflat Solutions",
    price: 3499,
    image: "/featured products/9bf0d8ceacd81abb0ef5d6b2928417f9604f3e30.png",
    action: "BUY NOW",
  },
  {
    id: 2,
    name: "Headlights (LED, HID, Halogen)",
    price: 499,
    image: "/featured products/702ce9381c45cff389ec92314fa6d77761919ed6.jpg",
    action: "BUY NOW",
  },
  {
    id: 3,
    name: "Reinforced Suspension Kits",
    price: 14990,
    image: "/featured products/be2442a365db6898a8061f3a839a2a08a5aa7ee1.png",
    action: "SUBMIT AN INQUIRY",
  },
  {
    id: 4,
    name: "Tubeless Runflat Solutions",
    price: 3499,
    image: "/featured products/9bf0d8ceacd81abb0ef5d6b2928417f9604f3e30.png",
    action: "BUY NOW",
  },
  {
    id: 5,
    name: "Headlights (LED, HID, Halogen)",
    price: 499,
    image: "/featured products/702ce9381c45cff389ec92314fa6d77761919ed6.jpg",
    action: "BUY NOW",
  },
  {
    id: 6,
    name: "Reinforced Suspension Kits",
    price: 14990,
    image: "/featured products/be2442a365db6898a8061f3a839a2a08a5aa7ee1.png",
    action: "SUBMIT AN INQUIRY",
  },
];

export const FeaturedProducts = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Calculate how many slides we need (groups of 3)
  const totalSlides = Math.ceil(products.length / 3);
  
  // Get the current 3 products to display
  const startIndex = currentSlide * 3;
  const displayedProducts = products.slice(startIndex, startIndex + 3);

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
      `}</style>
      <div className="container-figma">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8 sm:mb-10 lg:mb-12 font-orbitron">
          FEATURED PRODUCTS
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-start 2xl:gap-[140px] gap-8 relative overflow-hidden">
        {displayedProducts.map((product, index) => {
          // The middle product (index 1) is always focused
          const isFocused = index === 1;
          
          return (
            <div
              key={product.id}
              className={`bg-transparent border border-b-0 border-white w-[368px] h-[519px] flex flex-col shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-700 ease-in-out animate-[slideIn_0.5s_ease-out] ${
                isFocused ? "md:mt-16" : ""
              }`}
              style={{
                animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Image area */}
              <div className="w-full h-[339px] flex items-center justify-center border-b border-white relative overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className={`transition-all duration-300 ${
                    isFocused
                      ? "object-cover w-full h-full"
                      : "object-contain w-[300px] h-[300px]"
                  }`}
                />
              </div>

              {/* Product name */}
              <div className="w-full h-[60px] flex items-center px-6 border-b border-white">
                <h3 className="text-white font-orbitron text-[16px] font-semibold leading-tight">
                  {product.name}
                </h3>
              </div>

              {/* Price */}
              <div className="w-full h-[60px] flex items-center px-6 border-b-0 border-white">
                <p className="text-white font-orbitron text-lg flex justify-between items-center gap-2">
                  <Image src="/icons/currency/dirham-white.svg" alt="Currency" width={20} height={20} /> {product.price.toLocaleString()}
                </p>
              </div>

              {/* Button */}
              <div className="w-full grow">
                <button
                  className={`w-full h-full text-[18px] font-orbitron font-extrabold uppercase transition-all ${
                    isFocused
                      ? "bg-[#FF5C00] text-white"
                      : "bg-white text-[#FF5C00]"
                  }`}
                >
                  {product.action}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Horizontal Bar Navigation */}
      <div className="flex justify-center gap-4 mt-8">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 transition-all ${
              currentSlide === index
                ? "w-[50px] bg-[#FF5C00]"
                : "w-[50px] bg-white/30"
            }`}
            aria-label={`View products ${index * 3 + 1} to ${Math.min((index + 1) * 3, products.length)}`}
          />
        ))}
      </div>
      
      </div>
    </section>
  );
};