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


export default function MobileLayout() {
    const [expandedVehicle, setExpandedVehicle] = useState<string | null>("genesis");

    const images = [
        "/product/product 1.png",
        "/product/product 1.png",
        "/product/product2.svg",
        "/product/product2.svg",
        "/product/product2.svg",
    ];
    const tabContent: TabContent[] = [
        {
            id: "vehicle-fitment",
            label: "Vehicle Fitment",
            content: (
                <div className="space-y-4">
                    <div className="border border-[#3D4A26]">
                        <button
                            onClick={() => setExpandedVehicle(expandedVehicle === "genesis" ? null : "genesis")}
                            className="w-full flex items-center justify-between bg-[#F0EBE3] p-4  transition-colors"
                        >
                            <div className="font-bold text-black">Genesis</div>
                            <ChevronDown
                                size={20}
                                className={`transition-transform ${expandedVehicle === "genesis" ? "rotate-180" : ""} text-black`}
                            />
                        </button>
                        {expandedVehicle === "genesis" && (
                            <ul className="space-y-2 text-sm text-black p-4 bg-[#F0EBE3]">
                                <li>• 2023-2025 Genesis Electrified GV70</li>
                                <li>• 2021-2025 Genesis G80</li>
                                <li>• 2023-2025 Genesis G90</li>
                                <li>• 2023-2025 Genesis GV60</li>
                                <li>• 2022-2025 Genesis GV70</li>
                            </ul>
                        )}
                    </div>
                </div>
            ),
        },
        {
            id: "specifications",
            label: "Specifications",
            content: (
                <div className="space-y-4">
                    <table className="w-full text-sm">
                        <tbody>
                            <tr className="border-b">
                                <td className="py-2 text-gray-600 font-medium">Series</td>
                                <td className="py-2 text-black">4000 HybriDynamic</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2 text-gray-600 font-medium">Friction Material Bonding Type</td>
                                <td className="py-2 text-black">Integrally Molded</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2 text-gray-600 font-medium">SKU #</td>
                                <td className="py-2 text-black">374155</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2 text-gray-600 font-medium">Weight</td>
                                <td className="py-2 text-black">18.84lbs</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2 text-gray-600 font-medium">Solid Or Vented Type Rotor</td>
                                <td className="py-2 text-black">Vented</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2 text-gray-600 font-medium">Material</td>
                                <td className="py-2 text-black">Iron Alloy</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ),
        },
        {
            id: "features",
            label: "Features",
            content: (
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-1">
                            <path d="M0 0V10L7 5.28302L0 0Z" fill="black" />
                        </svg>
                        <span className="text-black">Frequent braking environments, high speed, heavy traffic, steep gradients, towing, or off-roading</span>
                    </div>
                    <div className="flex gap-2">
                        <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-1">
                            <path d="M0 0V10L7 5.28302L0 0Z" fill="black" />
                        </svg>
                        <span className="text-black">Delivers strong, predictable friction lever regardless of temperature, speed, or axle load</span>
                    </div>
                    <div className="flex gap-2">
                        <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-1">
                            <path d="M0 0V10L7 5.28302L0 0Z" fill="black" />
                        </svg>
                        <span className="text-black">Engineered to withstand extremely high operating temperature range</span>
                    </div>
                    <div className="flex gap-2">
                        <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-1">
                            <path d="M0 0V10L7 5.28302L0 0Z" fill="black" />
                        </svg>
                        <span className="text-black">Long pad wear, low noise, and low dust</span>
                    </div>
                    <div className="flex gap-2">
                        <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-1">
                            <path d="M0 0V10L7 5.28302L0 0Z" fill="black" />
                        </svg>
                        <span className="text-black">100% Asbestos free</span>
                    </div>
                    <div className="flex gap-2">
                        <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-1">
                            <path d="M0 0V10L7 5.28302L0 0Z" fill="black" />
                        </svg>
                        <span className="text-black">100% Copper Free Eco Friendly Formulation</span>
                    </div>
                </div>
            ),
        },
        {
            id: "product-details",
            label: "Product Details",
            content: (
                <div className="space-y-4 text-black">
                    <div>
                        <h4 className="font-bold mb-2">Directional or Non-Directional Brake Surface</h4>
                        <p>Non-Directional</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">ABS Tone Ring Included</h4>
                        <p>No</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">Grade Type</h4>
                        <p>Standard Replacement</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">Mounting Bolt Hole Circle Diameter</h4>
                        <p>114.3mm</p>
                    </div>
                </div>
            ),
        },
        {
            id: "warranty",
            label: "Warranty",
            content: (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold mb-2">Warranty Coverage</h4>
                        <p className="text-gray-700">This product comes with a limited lifetime warranty against defects in materials and workmanship under normal use conditions.</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">Warranty Period</h4>
                        <p className="text-gray-700">Lifetime from date of purchase</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">What is Covered</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                            <li>Manufacturing defects</li>
                            <li>Material defects</li>
                            <li>Workmanship defects</li>
                        </ul>
                    </div>
                </div>
            ),
        },
        {
            id: "reviews",
            label: "Reviews (1)",
            content: (
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold">John Doe</h4>
                                <div className="flex gap-1 text-[#D35400] text-sm">
                                    {"★★★★★".split("").map((star, i) => (
                                        <span key={i}>{star}</span>
                                    ))}
                                </div>
                            </div>
                            <span className="text-sm text-gray-500">2 days ago</span>
                        </div>
                        <h5 className="font-bold mb-2">Great Product!</h5>
                        <p className="text-gray-700 text-sm">
                            Excellent brake pads with great stopping power and minimal noise. Very satisfied with the purchase.
                        </p>
                    </div>
                </div>
            ),
        },
    ];
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


    return (
        <section className="bg-[#F0EBE3]">
            <div className="p-4 space-y-6">

                {/* 1️⃣ HEADER */}
                <ProductHeader />

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
                />

                {/* 4️⃣ SIMILAR ITEMS */}
                <SimilarItemsSection products={similarProducts} />

            </div>
            <TopSellingProducts title="Recommended For Your Vehicle" />
            <Container className="my-10">
                <TabbedSection tabs={tabContent} defaultTab="vehicle-fitment" />
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
