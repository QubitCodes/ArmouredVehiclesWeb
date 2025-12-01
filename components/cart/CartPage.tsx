"use client";
import Link from "next/link";
import CartItem from "./CartItem";
import OrderSummary from "./OrderSummary";
import { useState } from "react";
import { Typography } from "../ui";
import SimilarProductCard from "../product/SimilarProductCard";
import { Container } from "../ui";
import RecommendedForYouCard from "../product/RecommendedForYouCard";
import SelectAddressModal from "../modal/SelectAddressModal";

const initialItems = [
    {
        id: 1,
        title: "DFC® - 4000 Hybrid Dynamic Rear Brake Pads",
        part: "#5049DL",
        price: 679,
        oldPrice: 799,
        discount: "15% Off",
        qty: 2,
        stock: "In Stock",
    },
    {
        id: 2,
        title: "Duralast 45084DL High-Performance Disc Brake Rotor",
        part: "#45084DL",
        price: 475,
        oldPrice: 599,
        discount: "21% Off",
        qty: 1,
        stock: "In Stock",
    },
    {
        id: 3,
        title: "Duralast Heavy-Duty Disc Brake Rotor 54094DL",
        part: "#54094DL",
        price: 1625,
        qty: 1,
        stock: "Temporarily out of Stock",
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
    {
        id: 3,
        name: "Extended Life Engine Oil Filter",
        rating: 4.7,
        reviews: 2083,
        price: 99.99,
        image: "/product/similar/image 3.png",
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
export default function CartPage() {
    const [items, setItems] = useState(initialItems);
    const [showAddressModal, setShowAddressModal] = useState(false);

    const handleCheckout = () => {
        setShowAddressModal(true);
    };

    const updateQty = (id: number, newQty: number) => {
        setItems(items.map(item => item.id === id ? { ...item, qty: newQty } : item));
    };

    const removeItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);

    return (
        <section className="bg-[#F0EBE3]">
            <div className=" max-w-[1660px] mx-auto px-6 py-10 grid lg:grid-cols-[1fr_350px] gap-10 items-start">
                <div>
                    <div className="mb-4">
                        <Link href="/" className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900">
                            <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.27217 8.41543C3.3544 8.41543 3.44251 8.41543 3.52475 8.41543C8.8583 8.41543 14.1919 8.41543 19.5313 8.41543C19.6781 8.41543 19.825 8.41543 19.966 8.38019C20.4006 8.26271 20.6885 7.82803 20.6415 7.39336C20.5827 6.91169 20.2244 6.57688 19.7486 6.55338C19.6605 6.54751 19.5724 6.55338 19.4843 6.55338C14.1625 6.55338 8.84656 6.55338 3.52475 6.55338C3.44251 6.55338 3.3544 6.55338 3.27217 6.55338C3.24867 6.52401 3.22518 6.48877 3.20755 6.4594C3.27804 6.41828 3.36615 6.39479 3.41902 6.34192C4.98149 4.78532 6.53809 3.22285 8.10056 1.66625C8.38251 1.3843 8.51174 1.0671 8.40014 0.673548C8.21804 0.0391598 7.45443 -0.207547 6.92577 0.197757C6.85528 0.250622 6.79654 0.315236 6.73193 0.379849C4.6173 2.49448 2.50268 4.6091 0.388052 6.72373C-0.128857 7.24064 -0.128857 7.7458 0.388052 8.26858C2.52617 10.3891 4.65255 12.5155 6.7848 14.6477C7.06675 14.9297 7.37807 15.0706 7.7775 14.9649C8.43538 14.7828 8.68796 13.9898 8.25329 13.467C8.20042 13.4024 8.14168 13.3496 8.08882 13.2908C6.53222 11.7342 4.98149 10.1835 3.42489 8.62689C3.37202 8.57403 3.29566 8.53878 3.22518 8.49766C3.23692 8.47417 3.25455 8.4448 3.27217 8.41543Z" fill="#D35400" />
                            </svg>

                            <span className="font-orbitron font-semibold ml-2 text-[14px] leading-[100%] [leading-trim:cap-height] tracking-[0%] uppercase">
                                CONTINUE SHOPPING
                            </span>
                        </Link>
                    </div>

                    <h1 className="font-orbitron font-bold text-[36px] text-black [leading-trim:cap-height] leading-[100%] tracking-[0%] uppercase mb-6">
                        MY CART{" "}
                        <span
                            className="[leading-trim:CAP_HEIGHT] text-[#737373] normal-case"
                            style={{
                                fontFamily: "Inter sans-serif",
                                fontWeight: 400,
                                fontStyle: "normal",
                                fontSize: "16px",
                                lineHeight: "100%",
                                letterSpacing: "0%",
                                // include the custom property via an index signature for TSX
                                ["leading-trim" as any]: "CAP_HEIGHT",
                            }}
                        >
                            ({items.length} items)
                        </span>
                    </h1>

                    <div className="space-y-5 p-5 bg-[#EBE3D6]">
                        {items.map(item => (
                            <CartItem
                                key={item.id}
                                data={item}
                                updateQty={updateQty}
                                removeItem={removeItem}
                            />
                        ))}
                    </div>
                </div>
                <div className="mt-24 sticky top-36 self-start bg-[#EBE3D6]">
                    <OrderSummary subtotal={subtotal} onCheckout={handleCheckout} />
                </div>
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-[20px] font-orbitron font-bold text-black uppercase">
                                RECOMMENDED FOR YOU
                            </h2>
                            <span className="text-[11px] text-gray-600">Sponsored</span>
                        </div>
                        <button className="text-[#D35400] text-[12px] uppercase font-bold tracking-wide">
                            View All
                        </button>
                    </div>


                    <div className="grid grid-cols-5 gap-4 mt-6">
                        {similarProducts.map((product) => (
                            <RecommendedForYouCard key={product.id} {...product} />
                        ))}
                    </div>

                    {showAddressModal && (
                        <SelectAddressModal onClose={() => setShowAddressModal(false)} />
                    )}
                </div>
            </div>
        </section>
    );
}
