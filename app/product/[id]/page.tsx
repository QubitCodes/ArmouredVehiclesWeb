"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import DesktopLayout from "../components/desktop/DesktopLayout";
import MobileLayout from "../components/mobile/MobileLayout";
import { fetchProductReviews } from "@/app/services/reviews";

type ProductDisplay = {
  id: number;
  name?: string | null;
  sku?: string | null;
  price?: string | number | null;
  originalPrice?: string | null;
  currency?: string | null;
  image: string;
  gallery?: string[] | null;
  description?: string | null;
  condition?: string | null;
  stock?: number | null;
  rating?: number | string | null;
  reviewCount?: number | null;
  features?: string[] | null;
  specifications?: string | null;
  vehicleFitment?: string | null;
  warranty?: string | null;
  actionType?: string | null;
  category?: { id: number; name: string } | null;
  similarProducts?: any[];
  misc?: any;
};

export default function ProductDetailsPage() {
  const [product, setProduct] = useState<ProductDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);

  const [rating, setRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);

  const searchParams = useSearchParams();
  const routeParams = useParams();

  const idParam =
    (routeParams?.id as string | undefined) ?? searchParams.get("id");

  const productId =
    idParam && /^\d+$/.test(String(idParam)) ? Number(idParam) : null;

  /* ---------------------------
     1️⃣ FETCH PRODUCT DETAILS
  ---------------------------- */
  useEffect(() => {
    let active = true;

    const fetchProduct = async () => {
      if (productId === null) {
        if (active) setLoading(false);
        return;
      }

      try {
        const data: any = await api.products.getById(productId);

        if (!active) return;
        
        // Unwrap if necessary (safety check)
        const productData = data.data || data; 


        const gallery = Array.isArray(productData.gallery)
          ? productData.gallery
          : productData.image
          ? [productData.image]
          : [data.misc?.placeholder_image || "/product/product 1.png"];

        setProduct({
          id: productData.id,
          name: productData.name ?? null,
          sku: productData.sku ?? null,
          price: productData.price ?? null,
          originalPrice: productData.originalPrice ?? null,
          currency: productData.currency ?? null,
          image: productData.image || data.misc?.placeholder_image || "/product/product 1.png",
          gallery,
          description: productData.description ?? productData.technicalDescription ?? null,
          condition: productData.condition ?? null,
          stock: typeof productData.stock === "number" ? productData.stock : null,
          features: Array.isArray(productData.features)
            ? productData.features
            : typeof productData.features === "string" && productData.features
            ? productData.features.split("| ").map((s: string) => s.trim()).filter(Boolean)
            : null,
          specifications: productData.specifications ?? null,
          vehicleFitment: productData.vehicleFitment ?? null,
          warranty:
            productData.warranty ??
            (productData.hasWarranty &&
            (productData.warrantyTerms || productData.warrantyDuration)
              ? [productData.warrantyTerms, productData.warrantyDuration, productData.warrantyDurationUnit]
                  .filter(Boolean)
                  .join(" ")
              : null),
          actionType: productData.actionType ?? null,
          category: productData.category ?? null,
          misc: data.misc,
        });

        // 1.1 Fetch Similar Products if category exists

        if (productData.category?.id) {

          try {
            const similar = await api.products.getRelated(productData.category.id);

            // Filter out current product
            const filtered = similar.filter((p: any) => p.id !== productData.id).map((item: any) => ({
                 id: item.id,
                 name: item.name,
                 rating: item.rating ?? 0,
                 reviews: item.reviewCount ?? 0,
                 price: Number(item.price) || 0,
                 image: item.image || (item.media && item.media.length > 0 ? item.media[0].url : "/placeholder.png"),
            }));
            setSimilarProducts(filtered);
          } catch (e) {
            console.error("Failed to fetch similar products", e);
          }
        }
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      active = false;
    };
  }, [productId]);

  /* ---------------------------
     2️⃣ FETCH REVIEWS (SEPARATE)
  ---------------------------- */
  useEffect(() => {
    let active = true;

    if (!productId) return;

    fetchProductReviews(productId)
      .then((reviews) => {
        if (!active) return;

        const count = reviews.length;
        setReviewCount(count);

        if (count > 0) {
          const avg =
            reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / count;
          setRating(avg);
          setProduct((prev) => prev ? ({ ...prev, reviews }) : null);
        } else {
          setRating(0);
          setProduct((prev) => prev ? ({ ...prev, reviews: [] }) : null);
        }
      })
      .catch(() => {
        if (!active) return;
        setReviewCount(0);
        setRating(0);
      });

    return () => {
      active = false;
    };
  }, [productId]);

  /* ---------------------------
     3️⃣ LOADING STATE
  ---------------------------- */
  if (loading) {
    return (
      <section className="bg-[#F0EBE3] pt-12 md:pt-0">
        <div className="max-w-[1720px] mx-auto p-6">
          <div className="h-8 w-64 bg-gray-300 animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 animate-pulse" />
            <div className="space-y-4">
              <div className="h-6 w-48 bg-gray-200 animate-pulse" />
              <div className="h-6 w-32 bg-gray-200 animate-pulse" />
              <div className="h-10 w-full bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------------------
     4️⃣ NOT FOUND
  ---------------------------- */
  if (!product) {
    return (
      <section className="bg-[#F0EBE3] pt-12 md:pt-0">
        <div className="p-6">Product not found or invalid ID.</div>
      </section>
    );
  }

  /* ---------------------------
     5️⃣ RENDER PAGE
  ---------------------------- */
  return (
    <section className="bg-[#F0EBE3] pt-12 md:pt-0">
      <div className="md:hidden">
        <MobileLayout
          product={{
            ...product,
            rating,
            reviewCount,
            similarProducts,
          }}
        />
      </div>

      <div className="hidden md:block">
        <DesktopLayout
          product={{
            ...product,
            rating,
            reviewCount,
            similarProducts,
          }}
        />
      </div>
    </section>
  );
}
