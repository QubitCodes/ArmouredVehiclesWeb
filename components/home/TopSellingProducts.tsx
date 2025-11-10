"use client";
import Image from "next/image";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  reviews: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Engines (diesel, petrol, hybrid)",
    price: 15000,
    image: "/top-selling/image 1.png",
    description:
      "High-performance engines designed for optimal power and efficiency.",
    rating: 4.8,
    reviews: 1523,
  },
  {
    id: 2,
    name: "Turbochargers & Superchargers",
    price: 600,
    image: "/top-selling/image 2.png",
    description:
      "Premium forced induction systems to boost your engine's performance.",
    rating: 4.7,
    reviews: 2083,
  },
  {
    id: 3,
    name: "Radiators & Intercoolers SYSTEMS",
    price: 450,
    image: "/top-selling/image 3.png",
    description: "Advanced cooling solutions for engine performance.",
    rating: 4.6,
    reviews: 987,
  },
  {
    id: 4,
    name: "Fuel Pumps, Injectors & Fuel Rails",
    price: 300,
    image: "/top-selling/image 4.png",
    description: "Precision-engineered fuel components for reliability.",
    rating: 4.9,
    reviews: 1245,
  },
  {
    id: 5,
    name: "Car Transmissions (manual/automatic)",
    price: 2500,
    image: "/top-selling/image 5.png",
    description: "Manual and automatic transmission systems.",
    rating: 4.5,
    reviews: 856,
  },
  {
    id: 6,
    name: "ShopPro Non-VOC Brake Parts Cleaner Aerosol 14oz",
    price: 25,
    image: "/top-selling/image 6.png",
    description: "Professional-grade brake parts cleaner.",
    rating: 4.8,
    reviews: 3421,
  },
];

export function TopSellingProducts() {
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[1]);

  return (
    <section className="bg-[#F0EBE3] border border-black p-8 lg:p-12 font-sans">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black ml-[8.1%] font-orbitron">
        TOP SELLING PRODUCTS
      </h2>

      <div className="flex flex-col lg:flex-row items-stretch gap-8">
        {/* Left - Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-0 content-center border-collapse">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={`border transition-all cursor-pointer bg-[#faf8f4] flex flex-col items-center justify-center text-center hover:shadow-md duration-200 ${
                selectedProduct.id === product.id
                  ? "bg-[#fdfaf5]"
                  : "border-[#CCCCCC]"
              }`}
              style={{
                width: "245px",
                height: "281px",
                transform: "rotate(0deg)",
                opacity: 1,
                borderWidth: "1px",
                margin: "0", // ensures cards touch vertically and horizontally
              }}
            >
              <div
                className="relative"
                style={{ width: "150px", height: "150px" }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              </div>
              <p
                className="text-black mt-2"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontSize: "16px",
                  lineHeight: "100%",
                  textAlign: "center",
                }}
              >
                {product.name}
              </p>
            </div>
          ))}
        </div>

        {/* Right - Product Preview */}
        <div className="flex flex-col justify-center items-center lg:w-[40%] bg-[#f5f2ea] border-l border-gray-300 p-6 text-center">
          <div className="relative w-full aspect-square mb-6">
            <Image
              src={selectedProduct.image}
              alt={selectedProduct.name}
              fill
              className="object-cover rounded"
            />
          </div>

          <p className="text-lg text-black font-semibold">₮ {selectedProduct.price}</p>
          <h3 className="text-xl text-black font-bold mb-2">{selectedProduct.name}</h3>

          <div className="flex justify-center items-center gap-1 text-[#ff5c00] mb-2">
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                {i < Math.floor(selectedProduct.rating) ? "★" : "☆"}
              </span>
            ))}
            <span className="text-black text-sm">
              {selectedProduct.rating} ({selectedProduct.reviews})
            </span>
          </div>

          <button className="bg-transparent text-[#D35400] px-6 py-3 mt-2 font-orbitron font-black uppercase tracking-normal rounded transition-all text-[20px] leading-[100%]">
            Buy Now
          </button>
        </div>
      </div>
    </section>
  );
}
