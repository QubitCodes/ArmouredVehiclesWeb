"use client";

import { useState } from "react";
import ProductHeader from "../shared/ProductHeader";
// import ProductGallery from "../shared/ProductGallery";
import ProductPurchaseSection from "../shared/ProductPurchaseSection";
import FullscreenGallery from "@/components/ui/FullscreenGallery";
import ImageGallery from "../shared/ImageGallery";
import SimilarItemsSection from "../shared/SimilarItemsSection";
import { TopSellingProducts } from "@/components/home";
import { Container } from "@/components/ui/Container";
import TabbedSection, { TabContent } from "@/components/ui/TabbedSection";
import { ChevronDown } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { syncAddToServer } from "@/lib/cart-sync";
import { useRouter } from "next/navigation";
import VehicleFitmentTab from "@/components/product/tabs/VehicleFitmentTab";
import SpecificationsTab from "@/components/product/tabs/SpecificationsTab";
import FeaturesTab from "@/components/product/tabs/FeaturesTab";
import ProductDetailsTab from "@/components/product/tabs/ProductDetailsTab";
import WarrantyTab from "@/components/product/tabs/WarrantyTab";
import ReviewsTab from "@/components/product/tabs/ReviewsTab";


export default function MobileLayout({ id, product }: { id?: string; product?: any }) {
    const [expandedVehicle, setExpandedVehicle] = useState<string | null>("genesis");
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
    // -------------------------------------------------------------
    // DYNAMIC SECTIONS - If data exists, tabs will be displayed.
    // If data is missing/null, the section is automatically hidden (not pushed to tabContent).
    // -------------------------------------------------------------
    // -------------------------------------------------------------
    // STATIC SECTIONS - Tabs are always displayed.
    // -------------------------------------------------------------

    tabContent.push({
        id: "vehicle-fitment",
        label: "Vehicle Fitment",
        content: <VehicleFitmentTab fitment={product?.vehicleFitment || undefined} />
    });

    tabContent.push({
        id: "specifications",
        label: "Specifications",
        content: <SpecificationsTab product={product} />
    });

    tabContent.push({
        id: "features",
        label: "Features",
        content: <FeaturesTab features={product?.features || []} />
    });

    tabContent.push({
        id: "product-details",
        label: "Product Details",
        content: <ProductDetailsTab product={product} />
    });

    tabContent.push({
        id: "warranty",
        label: "Warranty",
        content: <WarrantyTab warranty={product?.warranty || undefined} />
    });

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

    // `id` is available when rendering via `/product/[id]`.
    // Currently not used inside this component, but provided so it can be
    // used to fetch product-specific data later.
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
            {/* product specifications starts here */}
            <Container className="my-10">
                {tabContent.length > 0 && (
                    <TabbedSection tabs={tabContent} defaultTab={tabContent[0]?.id} />
                )}
            </Container>
            {/* product specifications ends here */}

            {/* FULLSCREEN GALLERY */}
            {showGallery && (
                <FullscreenGallery
                    images={images}
                    index={selectedImage}
                    onClose={() => setShowGallery(false)}
                />
            )}
            <TopSellingProducts title="Recommended For Your Vehicle" />

        </section>
    );
}
