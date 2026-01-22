"use client";

import { useEffect, useState } from "react";
import { Typography } from "@/components/ui/Typography";
import SimilarProductCard from "@/components/product/SimilarProductCard";
import api from "@/lib/api";

type Product = {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  is_controlled?: boolean;
};

export default function PopularProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await api.products.getTopSelling();
        if (!mounted) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Typography variant="h2" className="text-lg font-extrabold text-black">
            Supplier&apos;s popular products
          </Typography>
          <span className="text-sm text-gray-600">Sponsored</span>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading popular products…</div>
      ) : error ? (
        <div className="text-sm text-red-500">Failed to load products.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {products.map((product) => (
            <SimilarProductCard
              key={product.id}
              id={product.id}
              image={product.image}
              name={product.name}
              rating={product.rating}
              reviews={product.reviews}
              price={product.price}
              isControlled={product.is_controlled}
            />
          ))}
        </div>
      )}
    </div>
  );
}
