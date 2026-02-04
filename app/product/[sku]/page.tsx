"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, notFound } from "next/navigation";
import api from "@/lib/api";
import DesktopLayout from "../components/desktop/DesktopLayout";
import MobileLayout from "../components/mobile/MobileLayout";
import { fetchProductReviews } from "@/app/services/reviews";

type ProductDisplay = {
  id: string | number;
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
  brand?: { id: number | string; name: string } | null;
  similarProducts?: any[];
  misc?: any;
  isControlled?: boolean;
  status?: string | null;
  approvalStatus?: string | null;
  individualProductPricing?: { name: string; amount: number }[] | null;
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
    (routeParams?.sku as string | undefined) ?? searchParams.get("sku") ?? searchParams.get("id");

  const productId = idParam || null;

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


        // Normalize gallery: prefer media URLs, fallback to gallery strings, then image/placeholder
        const galleryFromMedia = Array.isArray(productData.media)
          ? productData.media
            .map((m: any) => m?.url)
            .filter((u: any) => typeof u === "string" && u.length > 0)
          : [];

        const galleryFromField = Array.isArray(productData.gallery)
          ? productData.gallery
            .map((g: any) => (typeof g === "string" ? g : g?.url))
            .filter((u: any) => typeof u === "string" && u.length > 0)
          : [];

        const normalizedGallery = galleryFromMedia.length > 0
          ? galleryFromMedia
          : galleryFromField.length > 0
            ? galleryFromField
            : productData.image
              ? [productData.image]
              : ["/placeholder.jpg"];

        setProduct({
          id: productData.id,
          // basic fields
          name: productData.name ?? null,
          sku: productData.sku ?? null,
          price: productData.price ?? null,
          originalPrice: productData.original_price ?? productData.originalPrice ?? null,
          currency: productData.currency ?? null,
          image:
            (Array.isArray(productData.media) && productData.media.find((m: any) => m?.is_cover)?.url) ||
            productData.image ||
            (normalizedGallery.length > 0 ? normalizedGallery[0] : "/placeholder.jpg"),
          gallery: normalizedGallery,
          description: productData.description ?? productData.technical_description ?? productData.technicalDescription ?? null,
          condition: productData.condition ?? null,
          stock: typeof productData.stock === "number" ? productData.stock : null,
          features: Array.isArray(productData.features)
            ? productData.features
            : typeof productData.features === "string" && productData.features
              ? productData.features.split("| ").map((s: string) => s.trim()).filter(Boolean)
              : null,
          specifications: productData.specifications ?? null,
          vehicleFitment: productData.vehicle_compatibility ?? productData.vehicle_fitment ?? productData.vehicleFitment ?? null,
          warranty:
            productData.warranty ??
            (productData.has_warranty &&
              (productData.warranty_terms || productData.warranty_duration)
              ? [productData.warranty_terms, productData.warranty_duration, productData.warranty_duration_unit]
                .filter(Boolean)
                .join(" ")
              : null),
          actionType: productData.action_type ?? productData.actionType ?? null,
          category: productData.category ?? null,
          brand: productData.brand ?? null,
          misc: data.misc,
          reviewCount: typeof productData.review_count === "number"
            ? productData.review_count
            : typeof productData.reviewCount === "number"
              ? productData.reviewCount
              : Number(productData.review_count ?? productData.reviewCount) || 0,
          rating: productData.rating ?? null,
          isControlled: productData.is_controlled ?? false,
          status: productData.status ?? null,
          approvalStatus: productData.approval_status ?? null,
          individualProductPricing: Array.isArray(productData?.individual_product_pricing)
            ? productData.individual_product_pricing
            : null,

          // extended / raw fields useful for full product view
          vendorId: productData.vendor_id ?? null,
          rejectionReason: productData.rejection_reason ?? null,
          mainCategoryId: productData.main_category_id ?? null,
          categoryId: productData.category_id ?? null,
          subCategoryId: productData.sub_category_id ?? null,
          certifications:
            typeof productData.certifications === "string"
              ? (() => {
                try {
                  return JSON.parse(productData.certifications);
                } catch (e) {
                  return [productData.certifications];
                }
              })()
              : productData.certifications ?? null,
          countryOfOrigin: productData.country_of_origin ?? null,
          dimension: {
            length: productData.dimension_length ?? null,
            width: productData.dimension_width ?? null,
            height: productData.dimension_height ?? null,
            unit: productData.dimension_unit ?? null,
          },
          materials: productData.materials ?? null,
          performance: productData.performance ?? null,
          technicalDescription: productData.technical_description ?? null,
          driveTypes: productData.drive_types ?? null,
          sizes: productData.sizes ?? null,
          thickness: productData.thickness ?? null,
          colors: productData.colors ?? null,
          weight: {
            value: productData.weight_value ?? null,
            unit: productData.weight_unit ?? null,
          },
          packing: {
            length: productData.packing_length ?? null,
            width: productData.packing_width ?? null,
            height: productData.packing_height ?? null,
            unit: productData.packing_dimension_unit ?? null,
            weight: productData.packing_weight ?? null,
            weightUnit: productData.packing_weight_unit ?? null,
          },
          minOrderQuantity: productData.min_order_quantity ?? null,
          basePrice: productData.base_price ?? null,
          shippingCharge: productData.shipping_charge ?? null,
          packingCharge: productData.packing_charge ?? null,
          pricingTerms: productData.pricing_terms ?? null,
          productionLeadTime: productData.production_lead_time ?? null,
          readyStockAvailable: productData.ready_stock_available ?? null,
          manufacturingSource: productData.manufacturing_source ?? null,
          manufacturingSourceName: productData.manufacturing_source_name ?? null,
          requiresExportLicense: productData.requires_export_license ?? null,
          hasWarranty: productData.has_warranty ?? null,
          warrantyDuration: productData.warranty_duration ?? null,
          warrantyDurationUnit: productData.warranty_duration_unit ?? null,
          warrantyTerms: productData.warranty_terms ?? null,
          complianceConfirmed: productData.compliance_confirmed ?? null,
          supplierSignature: productData.supplier_signature ?? null,
          submissionDate: productData.submission_date ?? null,
          createdAt: productData.created_at ?? null,
          updatedAt: productData.updated_at ?? null,
          deletedAt: productData.deleted_at ?? null,
          media: Array.isArray(productData.media) ? productData.media : null,
          pricingTiers: Array.isArray(productData.pricing_tiers) ? productData.pricing_tiers : null,
          productSpecifications: Array.isArray(productData.product_specifications) ? productData.product_specifications : null,
          mainCategory: productData.main_category ?? null,
          subCategory: productData.sub_category ?? null,
          galleryField: Array.isArray(productData.gallery) ? productData.gallery : null,
          // keep raw payload for any additional needs
          raw: productData,
        } as any);

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
              image: item.image || (item.media && item.media.length > 0 ? item.media[0].url : "/placeholder.jpg"),
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
      <section className="bg-[#F0EBE3] pt-2 md:pt-0">
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
  /* ---------------------------
     4️⃣ NOT FOUND
  ---------------------------- */
  if (!product) {
    notFound();
  }

  /* ---------------------------
     5️⃣ RENDER PAGE
  ---------------------------- */
  return (
    <section className="bg-[#F0EBE3] pt-2 md:pt-0">
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
