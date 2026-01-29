
"use client";


import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
import ProductDetailsTab from "@/components/product/tabs/ProductDetailsTab";
import AttributesTab from "@/components/product/tabs/AttributesTab";
import WarrantyTab from "@/components/product/tabs/WarrantyTab";
import ReviewsTab from "@/components/product/tabs/ReviewsTab";
import PopularProducts from "../shared/PopularItems";
import ProductSpecificationsTable from "../shared/ProductSpecificationsTable";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";



const DesktopLayout = ({ id, product }: { id?: string; product?: any }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(10);
    const [showGallery, setShowGallery] = useState(false);
    const [expandedVehicle, setExpandedVehicle] = useState<string | null>("genesis");
    const addItem = useCartStore((s) => s.addItem);
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
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
        const fallback = product?.image || "/placeholder.jpg";
        return [fallback];
    })();




    // Use dynamic similar products if available, otherwise empty or fallback
    const similarProducts = Array.isArray(product?.similarProducts) ? product.similarProducts : [];

    const tabContent: TabContent[] = [];

    // Specs are rendered conditionally inside components; no pre-fetch for tab visibility needed.

    // -------------------------------------------------------------
    // DYNAMIC SECTIONS - If data exists, tabs will be displayed.
    // If data is missing/null, the section is automatically hidden (not pushed to tabContent).
    // -------------------------------------------------------------
    // -------------------------------------------------------------
    // STATIC SECTIONS - Tabs are always displayed.
    // -------------------------------------------------------------

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

    // tabContent.push({
    //     id: "warranty",
    //     label: "Warranty",
    //     content: <WarrantyTab warranty={product?.warranty || undefined} />
    // });

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
                        <nav aria-label="breadcrumb">
                            <span className="text-black">
                                <Link href="/" className="text-black">Home</Link>
                                {' '} / {' '}
                                <Link href="/products" className="text-black">Products</Link>
                                {' '} / {' '}
                                {product?.mainCategory?.name ? (
                                    <>
                                        <Link
                                            href={product?.mainCategory?.id ? `/products?category=${product.mainCategory.id}` : "/products"}
                                            className="text-black"
                                        >
                                            {product.mainCategory.name}
                                        </Link>
                                        {' '}/ {' '}
                                    </>
                                ) : null}

                                {product?.category?.name ? (
                                    <>
                                        <Link
                                            href={product?.category?.id ? `/products?category=${product.category.id}` : "/products"}
                                            className="text-black"
                                        >
                                            {product.category.name}
                                        </Link>
                                        {' '}/ {' '}
                                    </>
                                ) : null}

                                <span>{product?.name || "DETAILS"}</span>
                            </span>
                        </nav>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <ImageGallery
                                images={images}
                                selectedImage={selectedImage}
                                setSelectedImage={setSelectedImage}
                                onOpenGallery={() => setShowGallery(true)}
                                placeholderImage={"/placeholder.jpg"}
                            />



                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <ProductHeader
                                name={product?.name}
                                rating={product?.rating}
                                reviewCount={product?.reviewCount ?? 0}
                                sku={product?.sku}
                                isControlled={product?.isControlled}
                                brand={product?.brand}
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
                                        await syncAddToServer(Number(product.id), quantity);
                                    }
                                    router.push("/cart");
                                }}
                                minOrderQuantity={product?.minOrderQuantity}
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


            {/* product tabs */}
            {/* <Container className="my-6"> */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Tabbed Content - Takes 2/3 width */}
                    <div className="lg:col-span-2">
                        <TabbedSection tabs={tabContent} defaultTab="technical-details" />
                    </div>

                    {/* Right: Product Details Box - Takes 1/3 width */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#F0EBE3] rounded-lg p-6 shadow-md sticky font-orbitron top-32">
                            <h3 className="text-xl font-bold text-black mb-4">
                                {product?.name}
                            </h3>
                            
                            {/* SKU - Always visible */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600">SKU:</span>
                                    <span className="font-semibold text-[#2E3A59]">
                                        {product?.sku || "N/A"}
                                    </span>
                                </div>
                            </div>
                            
                            {isLoading ? (
                                <div className="space-y-3 mb-6">
                                    <div className="text-center text-gray-400 py-8">
                                        Loading...
                                    </div>
                                </div>
                            ) : isAuthenticated ? (
                                <>
                                    <div className="space-y-3 mb-6">
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Price:</span>
                                            <div className="flex items-center gap-1">
                                                <Image
                                                    src="/icons/currency/dirham.svg"
                                                    alt="Currency"
                                                    width={20}
                                                    height={20}
                                                />
                                                <span className="text-2xl font-bold text-[#2E3A59]">
                                                    {product?.price || "0.00"}
                                                </span>
                                            </div>
                                        </div>

                                        {product?.originalPrice && product?.originalPrice > product?.price && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Original:</span>
                                                <div className="flex items-center gap-1">
                                                    <Image
                                                        src="/icons/currency/dirham.svg"
                                                        alt="Currency"
                                                        width={14}
                                                        height={14}
                                                    />
                                                    <span className="text-sm line-through text-gray-400">
                                                        {product?.originalPrice}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Stock:</span>
                                            <span className={`font-semibold ${product?.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {product?.stock > 0 ? `${product?.stock} units` : "Out of stock"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                {/* ADD TO CART */}
                                <button
                                    className="w-full h-11 bg-[#2F3A1D] clip-path-supplier
                                               flex items-center justify-center
                                               hover:bg-[#3D4A26] transition-colors
                                               disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={async () => {
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
                                    disabled={!product?.stock || product?.stock <= 0}
                                >
                                    <span className="font-orbitron font-black text-[16px] uppercase text-white">
                                        Add To Cart
                                    </span>
                                </button>
                                
                                {/* ADD TO WISHLIST */}
                                <button
                                    className="relative w-full h-10 bg-transparent"
                                    onClick={() => {
                                        // Add to wishlist logic
                                    }}
                                >
                                    {/* BORDER */}
                                    <span
                                        className="absolute inset-0 clip-path-supplier bg-[#3D4A26]"
                                        aria-hidden
                                    />
                                    
                                    {/* INNER WHITE */}
                                    <span
                                        className="absolute inset-[1px] clip-path-supplier bg-white"
                                        aria-hidden
                                    />
                                    
                                    {/* CONTENT */}
                                    <span
                                        className="relative z-10 flex items-center justify-center gap-1
                                                   h-full w-full font-orbitron font-black
                                                   text-sm uppercase text-[#3D4A26]"
                                    >
                                        <Heart size={14} strokeWidth={2} />
                                        Add To Wishlist
                                    </span>
                                </button>
                            </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <span
                                        onClick={() => {
                                            const currentPath = window.location.pathname;
                                            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
                                        }}
                                        className="text-[20px] font-medium text-black cursor-pointer hover:underline"
                                    >
                                        Login to Purchase
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            {/* </Container> */}

            {
                showGallery && (
                    <FullscreenGallery
                        images={images}
                        index={selectedImage}
                        onClose={() => setShowGallery(false)}
                    />
                )
            }
            <Container className="my-8">

                <PopularProducts />
            </Container>
        </section >

    );
};

export default DesktopLayout;
