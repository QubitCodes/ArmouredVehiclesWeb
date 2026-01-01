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
};

export default function ProductDetailsPage() {
  const [product, setProduct] = useState<ProductDisplay | null>(null);
  const [loading, setLoading] = useState(true);

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

        const gallery = Array.isArray(data.gallery)
          ? data.gallery
          : data.image
          ? [data.image]
          : ["/product/product 1.png"];

        setProduct({
          id: data.id,
          name: data.name ?? null,
          sku: data.sku ?? null,
          price: data.price ?? null,
          originalPrice: data.originalPrice ?? null,
          currency: data.currency ?? null,
          image: data.image || "/product/product 1.png",
          gallery,
          description: data.description ?? data.technicalDescription ?? null,
          condition: data.condition ?? null,
          stock: typeof data.stock === "number" ? data.stock : null,
          features: Array.isArray(data.features)
            ? data.features
            : typeof data.features === "string" && data.features
            ? data.features.split("| ").map((s: string) => s.trim()).filter(Boolean)
            : null,
          specifications: data.specifications ?? null,
          vehicleFitment: data.vehicleFitment ?? null,
          warranty:
            data.warranty ??
            (data.hasWarranty &&
            (data.warrantyTerms || data.warrantyDuration)
              ? [data.warrantyTerms, data.warrantyDuration, data.warrantyDurationUnit]
                  .filter(Boolean)
                  .join(" ")
              : null),
          actionType: data.actionType ?? null,
        });
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
        } else {
          setRating(0);
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
          }}
        />
      </div>

      <div className="hidden md:block">
        <DesktopLayout
          product={{
            ...product,
            rating,
            reviewCount,
          }}
        />
      </div>
    </section>
  );
}
