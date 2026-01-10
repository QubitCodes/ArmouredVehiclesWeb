
"use client";


import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Container } from "@/components/ui/Container";
import { Heart, ChevronDown } from "lucide-react";
import FullscreenGallery from "@/components/ui/FullscreenGallery";
import SimilarProductCard from "@/components/product/SimilarProductCard";
import { TopSellingProducts } from "@/components/home";
import TabbedSection, { TabContent } from "@/components/ui/TabbedSection";
import ProductHeader from "../shared/ProductHeader";
import ProductPurchaseSection from "../shared/ProductPurchaseSection";
import { useCartStore } from "@/lib/cart-store";
import ImageGallery from "../shared/ImageGallery";
import SimilarItemsSection from "../shared/SimilarItemsSection";
import { syncAddToServer } from "@/lib/cart-sync";
import { useRouter } from "next/navigation";



const DesktopLayout = ({ id, product }: { id?: string; product?: any }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showGallery, setShowGallery] = useState(false);
    const [expandedVehicle, setExpandedVehicle] = useState<string | null>("genesis");
    const addItem = useCartStore((s) => s.addItem);
    const router = useRouter();
    const imgRef = useRef<HTMLImageElement | null>(null);

    const handleMove = (e: any) => {
        if (!imgRef.current) return;

        const { left, top, width, height } =
            imgRef.current.getBoundingClientRect();

        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;

        imgRef.current.style.transformOrigin = `${x}% ${y}%`;
    };

    const images = Array.isArray(product?.gallery) && product.gallery.length > 0
        ? product.gallery
        : [product?.image || "/product/product 1.png"];

    // Use dynamic similar products if available, otherwise empty or fallback
    const similarProducts = Array.isArray(product?.similarProducts) ? product.similarProducts : [];

    const tabContent: TabContent[] = [];

    // -------------------------------------------------------------
    // DYNAMIC SECTIONS - If data exists, tabs will be displayed.
    // If data is missing/null, the section is automatically hidden (not pushed to tabContent).
    // -------------------------------------------------------------
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

    // `id` is available when rendering via `/product/[id]`.
    // Currently not used inside this component, but provided so it can be
    // used to fetch product-specific data later.
    return (
        <section className="bg-[#F0EBE3]">
            <Container className="mb-10">
                <div className="py-8">
                    {/* Breadcrumb */}
                    {/* Breadcrumb - Dynamic */}
                    <div className="text-sm mb-6 mt-4">
                        <span className="text-black uppercase">
                            AUTO PARTS / {product?.category?.name ? product.category.name : "PRODUCTS"} / {product?.name || "DETAILS"}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <ImageGallery
                                images={images}
                                selectedImage={selectedImage}
                                setSelectedImage={setSelectedImage}
                                onOpenGallery={() => setShowGallery(true)}
                            />


                            {/* Similar Items */}
                            {/* Similar Items - Only show if data exists */}
                            {similarProducts.length > 0 && (
                               <SimilarItemsSection products={similarProducts} />
                            )}

                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            {/* <div>
                <Typography variant="h1" className=" text-black text-[24px] font-bold mb-2">
                  DFC® - 4000 HybriDynamic Hybrid Rear Brake Pads
                </Typography>
                <div className="flex items-center gap-2">
                  <div className="flex text-[#D35400]">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                  <span className="text-sm text-[#D35400]">0 Review</span>
                  <span className="text-sm text-gray-500">Part #54GD94DL</span>
                  <span className="text-sm text-gray-500">SKU #374155</span>
                </div>
              </div> */}
                            <ProductHeader
                                name={product?.name}
                                rating={product?.rating}
                                reviewCount={product?.reviewCount}
                                sku={product?.sku}
                            />
                            <ProductPurchaseSection
                                quantity={quantity}
                                setQuantity={setQuantity}
                                price={product?.price}
                                originalPrice={product?.originalPrice}
                                currency={product?.currency}
                                condition={product?.condition}
                                stock={product?.stock}
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


                        </div>
                    </div>
                </div>
            </Container>
            <Container className="my-6 ">
                {tabContent.length > 0 && (
                    <TabbedSection tabs={tabContent} defaultTab={tabContent[0]?.id} />
                )}
            </Container>
                        <TopSellingProducts title="Recommended For Your Vehicle" />

            {showGallery && (
                <FullscreenGallery
                    images={images}
                    index={selectedImage}
                    onClose={() => setShowGallery(false)}
                />
            )}
        </section>

    );
};

export default DesktopLayout;
