"use client";
import Image from "next/image";
import { useState } from "react";

// ---- PRODUCTS DATA ----
interface Product {
  id: number;
  name: string;
  price: number;
  image: string; // thumbnail
  images: string[]; // NEW: multiple preview images
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
    images: [
      "/top-selling/big product/img1.jpg",
      "/top-selling/big product/img2.png",
      "/top-selling/big product/img1-3.jpg",
    ],
    description: "High-performance engines designed for optimal power and efficiency.",
    rating: 4.8,
    reviews: 1523,
  },
  {
    id: 2,
    name: "Turbochargers & Superchargers",
    price: 600,
    image: "/top-selling/image 2.png",
    images: [
      "/top-selling/big product/img2.png",
      "/top-selling/big product/img2-2.png",
    ],
    description: "Premium forced induction systems to boost your engine's performance.",
    rating: 4.7,
    reviews: 2083,
  },
  {
    id: 3,
    name: "Radiators & Intercoolers SYSTEMS",
    price: 450,
    image: "/top-selling/image 3.png",
    images: [
      "/top-selling/big product/img3.jpg",
      "/top-selling/big product/img3-2.jpg",
    ],
    description: "Advanced cooling solutions for engine performance.",
    rating: 4.6,
    reviews: 987,
  },
  {
    id: 4,
    name: "Fuel Pumps, Injectors & Fuel Rails",
    price: 300,
    image: "/top-selling/image 4.png",
    images: [
      "/top-selling/big product/img4.jpg",
      "/top-selling/big product/img4-2.jpg",
    ],
    description: "Precision-engineered fuel components for reliability.",
    rating: 4.9,
    reviews: 1245,
  },
  {
    id: 5,
    name: "Car Transmissions (manual/automatic)",
    price: 2500,
    image: "/top-selling/image 5.png",
    images: [
      "/top-selling/big product/img5.jpg",
      "/top-selling/big product/img5-2.jpg",
    ],
    description: "Manual and automatic transmission systems.",
    rating: 4.5,
    reviews: 856,
  },
  {
    id: 6,
    name: "ShopPro Non-VOC Brake Cleaner 14oz",
    price: 25,
    image: "/top-selling/image 6.png",
    images: [
      "/top-selling/big product/img6.jpg",
      "/top-selling/big product/img6-2.jpg",
    ],
    description: "Professional-grade brake parts cleaner.",
    rating: 4.8,
    reviews: 3421,
  },
];

export function TopSellingProducts({ title }: { title: string }) {
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);

  // NEW: tracks which image index is active in the RIGHT SECTION
  const [imageIndex, setImageIndex] = useState(0);

  // 👇 Whenever user selects a new product, reset image index to 0
  const selectProduct = (product: Product) => {
    setSelectedProduct(product);
    setImageIndex(0);
  };

  // ---- MOBILE left/right changes PRODUCT (existing behavior) ----
  const handlePreviousProduct = () => {
    const idx = products.findIndex(p => p.id === selectedProduct.id);
    const prev = idx === 0 ? products.length - 1 : idx - 1;
    selectProduct(products[prev]);
  };

  const handleNextProduct = () => {
    const idx = products.findIndex(p => p.id === selectedProduct.id);
    const next = idx === products.length - 1 ? 0 : idx + 1;
    selectProduct(products[next]);
  };

  // ---- DESKTOP right section arrows change IMAGE, NOT PRODUCT ----
  const handlePreviousImage = () => {
    setImageIndex(prev =>
      prev === 0 ? selectedProduct.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setImageIndex(prev =>
      prev === selectedProduct.images.length - 1 ? 0 : prev + 1
    );
  };

  const previewImage = selectedProduct.images[imageIndex];

  return (
    <section className="bg-[#F0EBE3] font-sans">

      {/* ---------------- MOBILE VIEW ---------------- */}
      <div className="lg:hidden text-black w-full pb-12">

        <div className="px-4 pt-8 pb-4">
          <h2 className="text-xl font-orbitron font-bold">{title}</h2>
        </div>

        {/* Product horizontal scroll */}
        <div className="flex overflow-x-auto gap-3 px-3 pb-3 snap-x snap-mandatory scrollbar-hide">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => selectProduct(product)}
              className="min-w-[110px] bg-[#faf8f4] border border-[#ccc] flex flex-col items-center p-3 snap-start rounded-md active:scale-95 transition"
            >
              <div className="relative w-[70px] h-[70px] mx-auto">
                <Image src={product.image} alt={product.name} fill className="object-contain" />
              </div>
              <p className="text-[11px] mt-1 leading-tight text-center">
                {product.name.length > 20 ? product.name.slice(0, 20) + "..." : product.name}
              </p>
            </div>
          ))}
        </div>

        {/* MOBILE preview – product NEXT/PREV (unchanged behavior) */}
        <div className="bg-[#EBE3D6] w-full mt-4 pb-10 pt-4 text-center relative">

          <div className="relative w-[90%] mx-auto h-[260px]">

            <button onClick={handlePreviousProduct} className="absolute -left-4 top-1/2 -translate-y-1/2 z-30">
              <Image src="/icons/circled arrow left.svg" width={28} height={28} alt="Prev" />
            </button>

            <Image src={previewImage} alt={selectedProduct.name} fill className="object-cover rounded" />

            <button onClick={handleNextProduct} className="absolute -right-4 top-1/2 -translate-y-1/2 z-30">
              <Image src="/icons/circled arrow right.svg" width={28} height={28} alt="Next" />
            </button>
          </div>

          <p className="mt-4 text-lg font-semibold">฿ {selectedProduct.price}</p>
          <h3 className="text-sm font-bold mt-1 px-4">{selectedProduct.name}</h3>

          <div className="flex justify-center items-center text-[#FF5C00] mt-1 gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < Math.floor(selectedProduct.rating) ? "★" : "☆"}</span>
            ))}
            <span className="text-black text-xs">
              {selectedProduct.rating} ({selectedProduct.reviews})
            </span>
          </div>

          <button className="text-[#D35400] font-orbitron font-black uppercase text-[18px] mt-3">
            Buy Now
          </button>
        </div>
      </div>

      {/* ---------------- DESKTOP VIEW ---------------- */}
      <div className="hidden lg:flex w-full flex-row">

        {/* LEFT PRODUCT GRID */}
        <div className="container-figma pt-10 pb-12 lg:w-auto">
          <h2 className="text-4xl font-bold text-black font-orbitron mb-8">
            {title}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-0 border-collapse">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => selectProduct(product)}
                className={`border bg-[#FAF8F4] cursor-pointer flex flex-col items-center justify-center text-center hover:shadow-md transition ${
                  selectedProduct.id === product.id ? "bg-[#FDF9F0]" : "border-[#CCCCCC]"
                }`}
                style={{ width: "245px", height: "281px" }}
              >
                <div className="relative w-[150px] h-[150px]">
                  <Image src={product.image} alt={product.name} fill className="object-contain" />
                </div>
                <p className="text-black mt-2 text-[16px] leading-none">{product.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PREVIEW SECTION (NEW LOGIC!) */}
        <div className="flex-1 bg-[#EBE3D6] flex flex-col items-center pt-0 lg:h-[900px]">

          <div className="relative w-full flex justify-center items-start pt-[123px]">

            <div className="relative w-[467px] h-[514px]">

              {/* Left arrow — now cycles image instead of product */}
              <button onClick={handlePreviousImage} className="absolute -left-20 top-1/2 -translate-y-1/2 z-30">
                <Image src="/icons/circled arrow left.svg" alt="Prev" width={40} height={40} />
              </button>

              <Image src={previewImage} alt={selectedProduct.name} fill className="object-cover rounded" />

              {/* Right arrow — now cycles image instead of product */}
              <button onClick={handleNextImage} className="absolute -right-20 top-1/2 -translate-y-1/2 z-30">
                <Image src="/icons/circled arrow right.svg" alt="Next" width={40} height={40} />
              </button>

            </div>
          </div>

          <p className="text-lg text-black font-semibold mt-6 flex justify-between items-center gap-2">
            <Image src="/icons/currency/dirham.svg" alt="Currency" width={20} height={20} /> 
            {selectedProduct.price}
          </p>

          <h3 className="text-xl font-bold text-black mb-1 text-center">
            {selectedProduct.name}
          </h3>

          <div className="flex items-center justify-center gap-1 text-[#FF5C00] mb-2">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < Math.floor(selectedProduct.rating) ? "★" : "☆"}</span>
            ))}
            <span className="text-black text-sm">
              {selectedProduct.rating} ({selectedProduct.reviews})
            </span>
          </div>

          <button className="text-[#D35400] font-orbitron font-black uppercase text-[20px] mt-2">
            Buy Now
          </button>
        </div>
      </div>
    </section>
  );
}
