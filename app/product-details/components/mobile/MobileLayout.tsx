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


export default function MobileLayout({ id, product }: { id?: string; product?: any }) {
    const [expandedVehicle, setExpandedVehicle] = useState<string | null>("genesis");

    const images = Array.isArray(product?.gallery) && product.gallery.length > 0
        ? product.gallery
        : [product?.image || "/product/product 1.png"];
    const tabContent: TabContent[] = [];
    if (product?.vehicleFitment) {
        tabContent.push({
            id: "vehicle-fitment",
            label: "Vehicle Fitment",
            content: (
                <div className="space-y-4 text-black">
                    <div className="whitespace-pre-line">{product.vehicleFitment}</div>
                </div>
            ),
        });
    }
    if (product?.specifications || product?.sku) {
        tabContent.push({
            id: "specifications",
            label: "Specifications",
            content: (
                <div className="space-y-4">
                    {product.sku && (
                        <div className="text-sm"><span className="text-gray-600 font-medium">SKU #</span> <span className="text-black">{product.sku}</span></div>
                    )}
                    {product.specifications && (
                        <div className="text-sm text-black whitespace-pre-line">{product.specifications}</div>
                    )}
                </div>
            ),
        });
    }
    if (Array.isArray(product?.features) && product.features.length) {
        tabContent.push({
            id: "features",
            label: "Features",
            content: (
                <div className="space-y-3">
                    {product.features.map((f: string, idx: number) => (
                        <div key={idx} className="flex gap-2 text-black">
                            <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-1">
                                <path d="M0 0V10L7 5.28302L0 0Z" fill="black" />
                            </svg>
                            <span>{f}</span>
                        </div>
                    ))}
                </div>
            ),
        });
    }
    if (product?.description) {
        tabContent.push({
            id: "product-details",
            label: "Product Details",
            content: (
                <div className="space-y-4 text-black whitespace-pre-line">{product.description}</div>
            ),
        });
    }
    if (product?.warranty) {
        tabContent.push({
            id: "warranty",
            label: "Warranty",
            content: (
                <div className="space-y-4 text-black whitespace-pre-line">{product.warranty}</div>
            ),
        });
    }
    const similarProducts = [
        {
            id: 1,
            name: "Extended Life Engine Oil Filter",
            rating: 4.7,
            reviews: 2083,
            price: 99.99,
            image: "/product/similar/image.png",
        },
        {
            id: 2,
            name: "Extended Life Engine Oil Filter",
            rating: 4.7,
            reviews: 2083,
            price: 99.99,
            image: "/product/similar/image 2.png",
        },
        {
            id: 3,
            name: "Extended Life Engine Oil Filter",
            rating: 4.7,
            reviews: 2083,
            price: 99.99,
            image: "/product/similar/image 3.png",
        },
    ];


    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showGallery, setShowGallery] = useState(false);


    // `id` is available when rendering via `/product-details/[id]`.
    // Currently not used inside this component, but provided so it can be
    // used to fetch product-specific data later.
    return (
        <section className="bg-[#F0EBE3]">
            <div className="p-4 space-y-6">

                {/* 1️⃣ HEADER */}
                <ProductHeader
                    name={product?.name}
                    rating={product?.rating}
                    reviewCount={product?.reviewCount}
                    sku={product?.sku}
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
                    price={product?.price}
                    originalPrice={product?.originalPrice}
                    currency={product?.currency}
                    condition={product?.condition}
                    stock={product?.stock}
                />

                {/* 4️⃣ SIMILAR ITEMS */}
                <SimilarItemsSection products={similarProducts} />

            </div>
            <TopSellingProducts title="Recommended For Your Vehicle" />
            <Container className="my-10">
                {tabContent.length > 0 && (
                    <TabbedSection tabs={tabContent} defaultTab={tabContent[0]?.id} />
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
        </section>
    );
}
