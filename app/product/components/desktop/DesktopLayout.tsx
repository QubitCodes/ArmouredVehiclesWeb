
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
import VehicleFitmentTab from "@/components/product/tabs/VehicleFitmentTab";
import SpecificationsTab from "@/components/product/tabs/SpecificationsTab";
import FeaturesTab from "@/components/product/tabs/FeaturesTab";
import ProductDetailsTab from "@/components/product/tabs/ProductDetailsTab";
import WarrantyTab from "@/components/product/tabs/WarrantyTab";
import ReviewsTab from "@/components/product/tabs/ReviewsTab";



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

    // Normalize images to a string[] of URLs
    const images = (() => {
        const gallery = Array.isArray(product?.gallery)
            ? product!.gallery
                  .map((g: any) => (typeof g === "string" ? g : g?.url))
                  .filter((u: any) => typeof u === "string" && u.length > 0)
            : [];
        if (gallery.length > 0) return gallery;
        const fallback = product?.image || product?.misc?.placeholder_image || "/product/product 1.png";
        return [fallback];
    })();
    



    // Use dynamic similar products if available, otherwise empty or fallback
    const similarProducts = Array.isArray(product?.similarProducts) ? product.similarProducts : [];

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
        content: <VehicleFitmentTab fitment={product?.vehicle_fitment || product?.vehicleFitment || undefined} />
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
                                placeholderImage={product?.misc?.placeholder_image}
                            />



                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <ProductHeader
                                name={product?.name}
                                rating={product?.rating}
                                reviewCount={product?.reviewCount ?? 0}
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


                        </div>
                    </div>
                </div>
            </Container>

            <Container className="my-8">
                {similarProducts.length > 0 && (
                    <SimilarItemsSection products={similarProducts} />
                )}
            </Container>


            {/* product specifications starts here */}
            <div className="my-6">
                <TabbedSection tabs={tabContent} defaultTab={tabContent[0]?.id} />
            </div>
            {/* product specifications ends here */}

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
};

export default DesktopLayout;
