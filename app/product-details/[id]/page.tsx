"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import DesktopLayout from "../components/desktop/DesktopLayout";
import MobileLayout from "../components/mobile/MobileLayout";

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
  const searchParams = useSearchParams();
  const routeParams = useParams();
  const idParam = (routeParams?.id as string | undefined) ?? searchParams.get("id");
  const productId = idParam && /^\d+$/.test(String(idParam)) ? Number(idParam) : null;

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
          ? (data.gallery as string[])
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
          rating: data.rating ?? null,
          reviewCount: data.reviewCount ?? 0,
          features: Array.isArray(data.features)
            ? data.features
            : typeof data.features === "string" && data.features
            ? (data.features as string).split("| ").map((s: string) => s.trim()).filter(Boolean)
            : null,
          specifications: (() => {
            // Build specifications from available fields
            const specs: string[] = [];
            
            if (data.specifications) {
              specs.push(data.specifications);
            } else if (data.technicalDescription) {
              specs.push(data.technicalDescription);
            }
            
            // Add dimensions if available
            if (data.dimensionLength || data.dimensionWidth || data.dimensionHeight) {
              const dims = [
                data.dimensionLength && `Length: ${data.dimensionLength}`,
                data.dimensionWidth && `Width: ${data.dimensionWidth}`,
                data.dimensionHeight && `Height: ${data.dimensionHeight}`
              ].filter(Boolean).join(' x ');
              if (dims) specs.push(`Dimensions: ${dims}${data.dimensionUnit ? ` ${data.dimensionUnit}` : ''}`);
            }
            
            // Add weight if available
            if (data.weightValue) {
              specs.push(`Weight: ${data.weightValue}${data.weightUnit ? ` ${data.weightUnit}` : ''}`);
            }
            
            // Add materials if available
            if (Array.isArray(data.materials) && data.materials.length) {
              specs.push(`Materials: ${data.materials.join(', ')}`);
            }
            
            // Add performance if available
            if (Array.isArray(data.performance) && data.performance.length) {
              specs.push(`Performance: ${data.performance.join(', ')}`);
            }
            
            // Add available variants
            const variants: string[] = [];
            if (Array.isArray(data.driveTypes) && data.driveTypes.length) {
              variants.push(`Drive Types: ${data.driveTypes.join(', ')}`);
            }
            if (Array.isArray(data.sizes) && data.sizes.length) {
              variants.push(`Sizes: ${data.sizes.join(', ')}`);
            }
            if (Array.isArray(data.thickness) && data.thickness.length) {
              variants.push(`Thickness: ${data.thickness.join(', ')}`);
            }
            if (Array.isArray(data.colors) && data.colors.length) {
              variants.push(`Colors: ${data.colors.join(', ')}`);
            }
            if (variants.length) {
              specs.push('\nAvailable Variants:\n' + variants.join('\n'));
            }
            
            return specs.length ? specs.join('\n\n') : null;
          })(),
          vehicleFitment: data.vehicleFitment ?? null,
          warranty:
            data.warranty ??
            (data.hasWarranty && (data.warrantyTerms || data.warrantyDuration)
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

  if (!product) {
    return (
      <section className="bg-[#F0EBE3] pt-12 md:pt-0">
        <div className="p-6">Product not found or invalid ID.</div>
      </section>
    );
  }

  return (
    <section className="bg-[#F0EBE3] pt-12 md:pt-0">
      <div className="md:hidden">
        <MobileLayout product={product} />
      </div>

      <div className="hidden md:block">
        <DesktopLayout product={product} />
      </div>
    </section>
  );
}
