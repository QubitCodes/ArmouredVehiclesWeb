"use client";

import { useEffect, useState } from "react";
import ProductHeader from "../shared/ProductHeader";
import ProductPurchaseSection from "../shared/ProductPurchaseSection";
import FullscreenGallery from "@/components/ui/FullscreenGallery";
import ImageGallery from "../shared/ImageGallery";
import SimilarItemsSection from "../shared/SimilarItemsSection";
import { Container } from "@/components/ui/Container";
import TabbedSection, { TabContent } from "@/components/ui/TabbedSection";
import { useCartStore } from "@/lib/cart-store";
import { syncAddToServer } from "@/lib/cart-sync";
import { useRouter } from "next/navigation";
import ProductDetailsTab from "@/components/product/tabs/ProductDetailsTab";
import AttributesTab from "@/components/product/tabs/AttributesTab";
import ReviewsTab from "@/components/product/tabs/ReviewsTab";
import PopularProducts from "../shared/PopularItems";
import DescriptionTab from "@/components/product/tabs/DescriptionTab";

export default function MobileLayout({ id, product }: { id?: string; product?: any }) {
    const addItem = useCartStore((s) => s.addItem);
    const router = useRouter();

    // Normalize images to a string[] of URLs
    const images = (() => {
        const gallery = Array.isArray(product?.gallery)
            ? product!.gallery
                .map((g: any) => (typeof g === "string" ? g : g?.url))
                .filter((u: any) => typeof u === "string" && u.length > 0)
            : [];
        if (gallery.length > 0) return gallery;
        const fallback = product?.image || "/placeholder.jpg";
        return [fallback];
    })();

    const tabContent: TabContent[] = [];

    // Attributes tab aggregates Technical Details, Specifications, Features, and Vehicle Fitment
    tabContent.push({
        id: "attributes",
        label: "Attributes",
        content: <AttributesTab product={product} />
    });

    // Product Details tab
    tabContent.push({
        id: "product-details",
        label: "Product Details",
        content: <ProductDetailsTab product={product} />
    });

    // Description tab
    tabContent.push({
        id: "description",
        label: "Description",
        content: <DescriptionTab product={product} />
    });

    // Reviews tab
    tabContent.push({
        id: "reviews",
        label: `Reviews (${product?.reviewCount || 0})`,
        content: <ReviewsTab reviews={product?.reviews || []} rating={product?.rating || 0} reviewCount={product?.reviewCount || 0} />
    });

    // Use dynamic similar products if available, otherwise empty or fallback
    const similarProducts = Array.isArray(product?.similarProducts) ? product.similarProducts : [];

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(10);
    const [showGallery, setShowGallery] = useState(false);

    return (
        <section className="bg-[#F0EBE3]">
            <div className="pt-2 p-4 space-y-3">
                {/* Breadcrumb - Mobile */}
                <div className="flex items-center gap-2 text-xs pt-2 text-[#737373] overflow-x-auto whitespace-nowrap">
                    <span className="font-semibold cursor-pointer">Home</span>
                    <span className="font-semibold">{">"}</span>
                    <span className="font-semibold cursor-pointer">{product?.category?.name ? product.category.name : "Products"}</span>
                    <span className="font-semibold">{">"}</span>
                    <span className="font-medium">{product?.name || "DETAILS"}</span>
                </div>

                {/* 1️⃣ HEADER */}
                <ProductHeader
                    name={product?.name}
                    rating={product?.rating}
                    reviewCount={product?.reviewCount ?? 0}
                    sku={product?.sku}
                    isControlled={product?.isControlled}
                />

                {/* 2️⃣ GALLERY */}
                <ImageGallery
                    images={images}
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    onOpenGallery={() => setShowGallery(true)}
                />

                {/* 3️⃣ PURCHASE SECTION */}
                <ProductPurchaseSection
                    quantity={quantity}
                    setQuantity={setQuantity}
                    sku={product?.sku}
                    price={product?.price}
                    originalPrice={product?.originalPrice}
                    currency={product?.currency}
                    condition={product?.condition}
                    stock={product?.stock}
                    productId={product?.id}
                    status={product?.status}
                    approvalStatus={product?.approvalStatus}
                    individualProductPricing={product?.individualProductPricing}
                    onAddToCart={async () => {
                        if (!product) return;
                        addItem({
                            id: String(product.id ?? product?.sku ?? Math.random()),
                            name: product?.name ?? "Unnamed Product",
                            price: Number(product?.price ?? 0),
                            image: product?.image,
                            sku: product?.sku,
                            stock: product?.stock,
                        }, quantity);
                        if (product?.id != null) {
                            await syncAddToServer(Number(product.id), quantity);
                        }
                        router.push("/cart");
                    }}
                />

                {/* 4️⃣ SIMILAR ITEMS - Only show if data exists */}
                {similarProducts.length > 0 && (
                    <SimilarItemsSection products={similarProducts} />
                )}

            </div>
            {/* product tabs */}
            <Container className="my-10">
                {tabContent.length > 0 && (
                    <TabbedSection tabs={tabContent} defaultTab="product-details" />
                )}
            </Container>

            {/* FULLSCREEN GALLERY */}
            {showGallery && (
                <FullscreenGallery
                    images={images}
                    index={selectedImage}
                    onClose={() => setShowGallery(false)}
                />
            )}
            <div className="pt-2 p-4 space-y-3">
                <PopularProducts />
            </div>

        </section>
    );
}
