"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import api from '@/lib/api';
import { useAuth } from "@/lib/auth-context";
// import type { Product } from '@/lib/types';

// ---- INTERFACES ----
interface Product {
  id: number;
  name: string;
  price: number;
  image: string; // thumbnail
  images: string[]; // multiple preview images
  description: string;
  rating: number | null;
  reviewCount: number;
}



export function TopSellingProducts({ title }: { title: string }) {
  // 1. State for data and loading status
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // 2. State for UI interaction
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  // 3. Fetch Data on Mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // ✅ Call your API service method
        const data = await api.products.getTopSelling();

        // ✅ Map API response to UI model
        const mappedProducts: Product[] = Array.isArray(data)
          ? data.map((item: any) => ({
              id: item.id,
              name: item.name || "Unknown Product",
              price: Number(item.price) || 0,
              image:
                Array.isArray(item.gallery) && item.gallery.length > 0
                  ? item.gallery[0]
                  : item.image || item.thumbnail || "/placeholder.png",
              images:
                (Array.isArray(item.gallery) && item.gallery.length > 0)
                  ? item.gallery
                  : (Array.isArray(item.images) && item.images.length > 0)
                  ? item.images
                  : [item.image || item.thumbnail || "/placeholder.png"],
              description: item.description || "No description available.",
              rating: item.rating ?? null,
              reviewCount: item.reviewCount ?? 0,
            }))
          : [];

        // Use mapped products when available
        if (mappedProducts.length > 0) {
          setProducts(mappedProducts);
          setSelectedProduct(mappedProducts[0]);
        } else {
          // No products found
          setProducts([]);
          setSelectedProduct(null);
          setError("No top selling products found.");
        }
      } catch (err) {
        console.error(err);
        setProducts([]);
        setSelectedProduct(null);
        setError("Failed to load top selling products.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProducts();
  }, []);
  
  // UI Handlers
  const selectProduct = (product: Product) => {
    setSelectedProduct(product);
    setImageIndex(0);
  };

  const handlePreviousProduct = () => {
    if (!selectedProduct) return;
    const idx = products.findIndex(p => p.id === selectedProduct.id);
    const prev = idx === 0 ? products.length - 1 : idx - 1;
    selectProduct(products[prev]);
  };

  const handleNextProduct = () => {
    if (!selectedProduct) return;
    const idx = products.findIndex(p => p.id === selectedProduct.id);
    const next = idx === products.length - 1 ? 0 : idx + 1;
    selectProduct(products[next]);
  };

  const handlePreviousImage = () => {
    if (!selectedProduct) return;
    setImageIndex(prev =>
      prev === 0 ? selectedProduct.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!selectedProduct) return;
    setImageIndex(prev =>
      prev === selectedProduct.images.length - 1 ? 0 : prev + 1
    );
  };

  // ---- RENDER LOADING / ERROR STATES ----
  if (isLoading) {
    return (
      <section className="bg-[#F0EBE3] min-h-[400px] flex items-center justify-center font-sans">
        <p className="text-xl animate-pulse">Loading Products...</p>
      </section>
    );
  }

  if (error || !selectedProduct) {
    return (
      <section className="bg-[#F0EBE3] min-h-[400px] flex items-center justify-center font-sans">
        <p className="text-red-500">{error || "No products found."}</p>
      </section>
    );
  }

  // Safe to access properties now
  const previewImage = selectedProduct.images[imageIndex] || selectedProduct.image;

  return (
    <section className="bg-[#F0EBE3] font-sans">

      {/* ---------------- MOBILE VIEW ---------------- */}
      <div className="lg:hidden text-black w-full pb-12">

        <div className="px-4 pt-8 pb-4">
          <h2 className="text-xl font-orbitron font-bold" data-aos="fade-up" >{title}</h2>
        </div>

        {/* Product horizontal scroll */}
        <div className="flex overflow-x-auto px-3 pb-3 snap-x snap-mandatory scrollbar-hide">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => selectProduct(product)}
              className={`min-w-[110px] border border-[#ccc] flex flex-col items-center p-1 snap-start active:scale-95 transition-all duration-200 hover:bg-[#EBE3D6] ${
                selectedProduct?.id === product.id
                  ? "bg-[#EBE3D6]"
                  : "bg-[#F0EBE3]"
              }`}
            >
              <div className="relative w-[90px] h-[90px] mx-auto">
                <Image src={product.image} alt={product.name} fill className="object-contain" />
              </div>
              <p className="text-[11px] mt-1 leading-tight text-center px-1">
                {product.name.length > 20 ? product.name.slice(0, 20) + "..." : product.name}
              </p>
            </div>
          ))}
        </div>

        {/* MOBILE preview */}
        <div className="bg-[#EBE3D6] w-full mt-4 pb-10 pt-4 text-center relative">

          <div className="relative w-[281px] mx-auto h-[310px]">
            <button onClick={handlePreviousImage} className="absolute -left-10 top-1/2 -translate-y-1/2 z-30">
              <Image src="/icons/circled arrow left.svg" width={28} height={28} alt="Prev" />
            </button>

            <Image src={previewImage} alt={selectedProduct.name} fill className="object-cover rounded" />

            <button onClick={handleNextImage} className="absolute -right-10 top-1/2 -translate-y-1/2 z-30">
              <Image src="/icons/circled arrow right.svg" width={28} height={28} alt="Next" />
            </button>
          </div>

          <div className="mt-4 text-lg font-semibold flex justify-center items-center gap-2">
            {authLoading ? (
              <span className="opacity-70">...</span>
            ) : isAuthenticated ? (
              <>
                <Image src="/icons/currency/dirham.svg" alt="Currency" width={20} height={20} /> 
                <span>{selectedProduct.price.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-black/70"> <strong>Login</strong> to <strong>access</strong> product pricing.</span>
            )}
          </div>
          <h3 className="text-sm font-bold mt-1 px-4">{selectedProduct.name}</h3>

          <div className="flex justify-center items-center text-[#FF5C00] mt-1 gap-1">
            {selectedProduct.rating != null && selectedProduct.reviewCount > 0 ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < Math.floor(selectedProduct.rating as number) ? "★" : "☆"}</span>
                ))}
                <span className="text-black text-xs">
                  {selectedProduct.rating} ({selectedProduct.reviewCount})
                </span>
              </>
            ) : (
              <span className="text-black text-xs">No reviews yet</span>
            )}
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
                className={`border border-[#CCCCCC] cursor-pointer flex flex-col items-center justify-start text-center transition-all duration-200 hover:bg-[#EBE3D6] overflow-hidden h-[281px] ${
                  selectedProduct.id === product.id
                    ? "bg-[#EBE3D6]"
                    : "bg-[#F0EBE3]"
                }`}
              >
                <div className="relative w-[80%] h-[190px] mt-6 overflow-hidden flex-shrink-0">
                  <Image src={product.image} alt={product.name} fill className="object-contain" />
                </div>
                <p className="text-black mt-4 text-[14px] leading-tight px-3 pb-2 line-clamp-2 w-full">{product.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PREVIEW SECTION */}
        <div className="flex-1 bg-[#EBE3D6] flex flex-col items-center pt-0 lg:h-[900px] xl:pr-[140px]">

          <div className="relative w-full flex justify-center items-start pt-[123px]">
            <div className="relative w-[467px] h-[514px]">

              <button onClick={handlePreviousImage} className="absolute -left-20 top-1/2 -translate-y-1/2 z-30">
                <Image src="/icons/circled arrow left.svg" alt="Prev" width={40} height={40} />
              </button>

              <Image src={previewImage} alt={selectedProduct.name} fill className="object-cover rounded" />

              <button onClick={handleNextImage} className="absolute -right-20 top-1/2 -translate-y-1/2 z-30">
                <Image src="/icons/circled arrow right.svg" alt="Next" width={40} height={40} />
              </button>

            </div>
          </div>

          <div className="text-lg text-black font-semibold mt-6 flex justify-between items-center gap-2">
            {authLoading ? (
              <span className="opacity-70">...</span>
            ) : isAuthenticated ? (
              <>
                <Image src="/icons/currency/dirham.svg" alt="Currency" width={20} height={20} /> 
                <span>{selectedProduct.price.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-black/70">
                <strong>Login</strong> to <strong>access</strong> product pricing.
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-black mb-1 text-center">
            {selectedProduct.name}
          </h3>

          <div className="flex items-center justify-center gap-1 text-[#FF5C00] mb-2">
            {selectedProduct.rating != null && selectedProduct.reviewCount > 0 ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < Math.floor(selectedProduct.rating as number) ? "★" : "☆"}</span>
                ))}
                <span className="text-black text-sm">
                  {selectedProduct.rating} ({selectedProduct.reviewCount})
                </span>
              </>
            ) : (
              <span className="text-black text-sm">No reviews yet</span>
            )}
          </div>

          <button className="text-[#D35400] font-orbitron font-black uppercase text-[20px] mt-2">
            Buy Now
          </button>
        </div>
      </div>
    </section>
  );
}