"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui";
import ProductCard from "@/components/product/ProductCard";
import { searchProducts } from "@/app/services/auth";

interface UiProduct {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string[];
  action: "ADD TO CART" | "SUBMIT AN INQUIRY";
}

export default function SearchPage() {
  const params = useSearchParams();
  const q = params.get("q") || params.get("search") || "";

  const [products, setProducts] = useState<UiProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!q.trim()) {
        setProducts([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await searchProducts({ search: q, page: 1, limit: 24 });
        const payload = response?.data;
        const list: any[] = Array.isArray(payload) ? payload : payload?.data ?? [];

        const mapped: UiProduct[] = list.map((item: any) => {
          const priceNum = Number(item?.price);
          const normalizedPrice = Number.isFinite(priceNum) && priceNum > 0 ? priceNum : 0;
          const images: string[] = Array.isArray(item?.media) && item.media.length
            ? item.media
                .filter((m: any) => !!m?.url)
                .sort((a: any, b: any) => (b?.is_cover === true ? 1 : 0) - (a?.is_cover === true ? 1 : 0))
                .map((m: any) => String(m.url))
            : ["/placeholder.png"];
          const ratingNum = typeof item?.rating === "number" ? item.rating : Number(item?.rating) || 0;
          const reviewCount = typeof item?.review_count === "number" ? item.review_count : Number(item?.review_count) || 0;

          return {
            id: String(item?.id ?? ""),
            name: item?.name || "Unknown Product",
            price: normalizedPrice,
            rating: ratingNum,
            reviews: reviewCount,
            image: images,
            action: normalizedPrice > 0 ? "ADD TO CART" : "SUBMIT AN INQUIRY",
          } as UiProduct;
        });

        if (active) setProducts(mapped);
      } catch (e) {
        console.error("Search failed", e);
        if (active) setError("Failed to fetch results. Please try again later.");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    run();
    return () => {
      active = false;
    };
  }, [q]);

  return (
    <div className="pt-[100px]">
      <Container>
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-black">Search Results</h1>
          {q && (
            <p className="text-sm text-gray-600 mt-1">Query: <span className="font-medium">{q}</span></p>
          )}
        </div>

        {isLoading && (
          <div className="py-10 text-center text-black">Searching products...</div>
        )}

        {!isLoading && error && (
          <div className="py-10 text-center text-red-600">{error}</div>
        )}

        {!isLoading && !error && q.trim() && products.length === 0 && (
          <div className="py-10 text-center text-black">No products found.</div>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="mb-3 text-black">{products.length} result(s)</div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              images={p.image}
              name={p.name}
              rating={p.rating}
              reviews={String(p.reviews)}
              price={p.price}
              delivery={"Standard"}
              action={p.action}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
