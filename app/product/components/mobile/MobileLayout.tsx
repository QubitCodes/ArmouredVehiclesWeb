"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

    // Technical Details tab (formerly Attributes)
    tabContent.push({
        id: "technical-details",
        label: "Technical",
        content: <AttributesTab product={product} />
    });

    // Description tab (mapped from Product Details)
    tabContent.push({
        id: "description",
        label: "Description",
        content: <ProductDetailsTab product={product} />
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
    const [quantity, setQuantity] = useState(1);
    const [showGallery, setShowGallery] = useState(false);

    return (
        <section className="bg-[#F0EBE3]">
            <div className="pt-2 p-4 space-y-3">
                {/* Breadcrumb - Mobile */}
                <div className="flex items-center gap-2 text-xs pt-2 text-[#737373] overflow-x-auto whitespace-nowrap">
                    <nav aria-label="breadcrumb" className="flex items-center gap-2">
                        <Link href="/" className="font-semibold text-[#737373] underline">Home</Link>
                        <span className="font-semibold">{">"}</span>
                        <Link href="/products" className="font-semibold text-[#737373] underline">Products</Link>
                        <span className="font-semibold">{">"}</span>
                        {product?.mainCategory?.name ? (
                            <>
                                <Link
                                    href={product?.mainCategory?.id ? `/products?category=${product.mainCategory.id}` : "/products"}
                                    className="font-semibold text-[#737373] underline"
                                >
                                    {product.mainCategory.name}
                                </Link>
                                <span className="font-semibold">{">"}</span>
                            </>
                        ) : null}

                        {product?.category?.name ? (
                            <>
                                <Link
                                    href={product?.category?.id ? `/products?category=${product.category.id}` : "/products"}
                                    className="font-semibold text-[#737373] underline"
                                >
                                    {product.category.name}
                                </Link>
                                <span className="font-semibold">{">"}</span>
                            </>
                        ) : null}

                        <span className="font-medium">{product?.name || "DETAILS"}</span>
                    </nav>
                </div>

                {/* 1️⃣ HEADER */}
                <ProductHeader
                    name={product?.name}
                    rating={product?.rating}
                    reviewCount={product?.reviewCount ?? 0}
                    sku={product?.sku}
                    isControlled={product?.isControlled}
                    brand={product?.brand}
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
                    vendorId={product?.vendorId}
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
                            await syncAddToServer(String(product.id), quantity);
                        }
                        router.push("/cart");
                    }}
                    minOrderQuantity={product?.minOrderQuantity}
                />

                {/* 4️⃣ SIMILAR ITEMS - Only show if data exists */}
                {similarProducts.length > 0 && (
                    <SimilarItemsSection products={similarProducts} />
                )}

            </div>
            {/* product tabs */}
            <Container className="my-10">
                {tabContent.length > 0 && (
                    <TabbedSection tabs={tabContent} defaultTab="technical-details" />
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
