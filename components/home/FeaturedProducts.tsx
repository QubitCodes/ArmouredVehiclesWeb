"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import api from "@/lib/api"; // your API service

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  action: "BUY NOW" | "SUBMIT AN INQUIRY";
}

// const products: Product[] = [
//   {
//     id: 1,
//     name: "Tubeless Runflat Solutions",
//     price: 3499,
//     image: "/featured products/9bf0d8ceacd81abb0ef5d6b2928417f9604f3e30.png",
//     action: "BUY NOW",
//   },
//   {
//     id: 2,
//     name: "Headlights (LED, HID, Halogen)",
//     price: 499,
//     image: "/featured products/702ce9381c45cff389ec92314fa6d77761919ed6.jpg",
//     action: "BUY NOW",
//   },
//   {
//     id: 3,
//     name: "Reinforced Suspension Kits",
//     price: 14990,
//     image: "/featured products/be2442a365db6898a8061f3a839a2a08a5aa7ee1.png",
//     action: "SUBMIT AN INQUIRY",
//   },
//   {
//     id: 4,
//     name: "Tubeless Runflat Solutions",
//     price: 3499,
//     image: "/featured products/9bf0d8ceacd81abb0ef5d6b2928417f9604f3e30.png",
//     action: "BUY NOW",
//   },
//   {
//     id: 5,
//     name: "Headlights (LED, HID, Halogen)",
//     price: 499,
//     image: "/featured products/702ce9381c45cff389ec92314fa6d77761919ed6.jpg",
//     action: "BUY NOW",
//   },
//   {
//     id: 6,
//     name: "Reinforced Suspension Kits",
//     price: 14990,
//     image: "/featured products/be2442a365db6898a8061f3a839a2a08a5aa7ee1.png",
//     action: "SUBMIT AN INQUIRY",
//   },
// ];


export const FeaturedProducts = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
const [products, setProducts] = useState<Product[]>([]);
  const totalSlides = Math.ceil(products.length / 3);
  const startIndex = currentSlide * 3;
  const displayedProducts = products.slice(startIndex, startIndex + 3);
  
  
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await api.products.getFeatured(); // call your API

        const mappedProducts: Product[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          image: item.image || "/placeholder.png",
           action:
    item.actionType === "buy_now"
      ? "BUY NOW"
      : item.actionType === "inquiry"
      ? "SUBMIT AN INQUIRY"
      : "BUY NOW", // default fallback
        }));

        setProducts(mappedProducts);
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
      }
    };

    fetchFeatured();
  }, []);

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
        <h2 className="text-2xl sm:text-[32px] lg:text-4xl font-bold text-white mb-8 sm:mb-10 lg:mb-12 font-orbitron">
          FEATURED PRODUCTS
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-start 2xl:gap-[140px] gap-8 relative overflow-visible">
          {displayedProducts.map((product, index) => {
            const isFocused = index === 1; // middle card
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={product.id}
                className={`
                  bg-transparent border border-b-0 border-white 
                  w-[368px] h-[519px] flex flex-col 
                  shadow-[0_0_15px_rgba(255,255,255,0.1)] 
                  transition-all duration-700 ease-in-out 
                  animate-[slideIn_0.5s_ease-out]
                  ${isHovered ? "scale-[1.02]" : ""}
                  ${isFocused ? "md:mt-16" : ""}
                `}
                style={{
                  animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Image */}
                <div className="w-full h-[349px] flex items-center justify-center border-b border-white relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={300}
                    className={`transition-all duration-300 ${isHovered
                        ? "object-cover w-full h-full"
                        : "object-contain w-[300px] h-[300px]"
                      }`}
                  />
                </div>

                {/* Name */}
                <div className="w-full h-[60px] flex items-center px-6 border-b border-white">
                  <h3 className="text-white font-orbitron text-[16px] font-semibold leading-tight">
                    {product.name}
                  </h3>
                </div>

                {/* Price */}
                {/* Price (Blurred with Info Tooltip) */}
                <div className="w-full h-[60px] flex items-center px-6 relative group">
                  <p className="text-white font-orbitron text-lg flex items-center gap-2 select-none">

                    {/* Currency Icon */}
                    <Image
                      src="/icons/currency/dirham-white.svg"
                      alt="Currency"
                      width={20}
                      height={20}
                      className="opacity-60"
                    />

                    {/* Blurred Price */}
                    <span className="blur-sm opacity-70">{product.price.toLocaleString()}</span>

                    {/* Info Icon */}
                    <span className="text-white opacity-90 text-sm ml-2 cursor-pointer">ℹ️</span>
                  </p>

                  {/* Tooltip */}
                  <div
                    className={`
      absolute left-6 top-[55px] 
      bg-black text-white text-xs 
      px-3 py-2 rounded-md shadow-lg 
      opacity-0 pointer-events-none 
      group-hover:opacity-100 
      transition-all duration-300
      whitespace-nowrap
    `}
                  >
                    Login to view the price
                  </div>
                </div>


                {/* Button */}
                <div className="w-full grow">
                  <button
                    className={`w-full h-full text-[18px] font-orbitron font-extrabold uppercase transition-all
                      ${isHovered
                        ? "bg-[#FF5C00] text-white"
                        : "bg-white text-[#FF5C00]"
                      }
                    `}
                  >
                    {product.action}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 w-[50px] transition-all ${currentSlide === index ? "bg-[#FF5C00]" : "bg-white/30"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
