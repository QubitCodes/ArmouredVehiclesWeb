"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Info, Plus, Minus } from "lucide-react";
import { Heart } from "lucide-react";
import { Star, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import ShippingSection from "./shipping/ShippingSection";






import { useWishlist } from "@/hooks/use-wishlist";

type Props = {
    quantity: number;
    setQuantity: (qty: number) => void;
    sku?: string | null;
    price?: string | number | null;
    originalPrice?: string | null;
    currency?: string | null;
    condition?: string | null;
    stock?: number | null;
    productId?: string | number;
    onAddToCart?: () => void;
};

export default function ProductPurchaseSection({
    quantity,
    setQuantity,
    sku,
    price,
    originalPrice,
    currency,
    condition,
    stock,
    productId,
    onAddToCart,
}: Props) {
    const displayPrice = price != null && price !== '' ? String(price) : undefined;
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    const { isInWishlist, toggleWishlist } = useWishlist();
    const isLiked = isInWishlist(productId);

    function getDeliveryRange(minDays: number, maxDays: number) {
        const start = new Date();
        const end = new Date();

        start.setDate(start.getDate() + minDays);
        end.setDate(end.getDate() + maxDays);

        const format = (d: Date) =>
            d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

        return `${format(start)} – ${format(end)}`;
    }


    return (
        <div className="space-y-4">
            {/* PRICE */}
            <div>
                {isLoading ? (
                    <span className="text-3xl font-bold font-[inter, sans-serif] text-gray-400">
                        —
                    </span>
                ) : isAuthenticated ? (
                    displayPrice ? (
                        <>
                            <div className="flex items-center gap-1">
                                <Image
                                    src="/icons/currency/dirham.svg"
                                    alt="Currency"
                                    width={24}
                                    height={24}
                                    className=" md:w-5 md:h-5"
                                />
                                <span className="text-3xl font-bold font-[inter, sans-serif] text-black">
                                    {displayPrice}
                                </span>
                            </div>

                            {originalPrice && (
                                <div className="flex items-center gap-2 font-[inter, sans-serif]">
                                    <div className="flex items-center gap-1">
                                        <Image
                                            src="/icons/currency/dirham.svg"
                                            alt="Currency"
                                            width={14}
                                            height={14}
                                            className=""
                                        />
                                        <span className="text-[#3D4A26] line-through opacity-70">
                                            {originalPrice}
                                        </span>
                                    </div>
                                </div>
                            )}
                           
                        </>
                    ) : (
                        <span className="text-3xl font-bold font-[inter, sans-serif] text-black">
                            —
                        </span>
                    )
                ) : (
                    <span
                        onClick={() => {
                            const currentPath = window.location.pathname;
                            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
                        }}
                        className="text-[20px] font-medium text-black cursor-pointer hover:underline"
                    >
                        Login to Purchase
                    </span>
                )}
                 {/* SKU - visible only on mobile */}
                            {sku && (
                                <div className="text-sm text-[#6F6F6F] mt-1 md:hidden">
                                    SKU: {String(sku)}
                                </div>
                            )}
            </div>


            {/* CONDITION & AVAILABILITY */}
            <div className="space-y-2 text-black">
                <div className="flex justify-start">
                    <span>Condition: </span>
                    <div className="flex items-center gap-1">
                        <span className="font-medium text-black">{condition ? String(condition).toUpperCase().charAt(0) + String(condition).slice(1) : '—'}</span>
                        <Info
                            size={14}
                            className="text-gray-600 cursor-pointer"
                            aria-label="Condition info"
                        />
                    </div>

                </div>
                {/* <div className="flex justify-start">
                    <span>Availability:</span>
                    {typeof stock === 'number' ? (
                        stock > 0 ? (
                            <span>
                                <span className="text-[#3BAF7F]"> In Stock</span>
                                ({stock})
                            </span>
                        ) : (
                            <span className="text-[#D35400]">Out of Stock</span>
                        )
                    ) : (
                        <span>—</span>
                    )}
                </div> */}
            </div>

            {/* QUANTITY */}
            {isAuthenticated && (
                <div className="flex items-center gap-3">
                    <span className="text-black font-medium">Quantity:</span>
                    <div className="flex items-center border border-[#B7B1A8] bg-[#EBE4D7] h-10 w-32">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-full flex items-center justify-center text-black hover:bg-[#D8D1C5] transition"
                        >
                            <Minus size={16} />
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val) && val >= 1) setQuantity(val);
                            }}
                            className="flex-1 w-full h-full bg-transparent text-center text-black outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            min={1}
                        />
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-full flex items-center justify-center text-black hover:bg-[#D8D1C5] transition"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* DELIVERY OPTIONS */}
            {isAuthenticated && (
                <div className="grid grid-cols-2 gap-4">

                    {/* <div className="relative border-2 border-[#FF7A00] bg-white text-center py-6 px-4">

                    <div className="absolute top-0 left-0">
                        <div className="w-10 h-10 bg-[#FF7A00] clip-triangle flex items-center justify-center">
                            <Check size={18} strokeWidth={3} className="text-white" />
                        </div>
                    </div>

                    <div className="font-semibold text-[14px] text-black">
                        Standard Delivery
                    </div>
                    <div className="text-[13px] mt-1 text-black">
                        Guaranteed delivery by{" "}
                        <span className="font-semibold">
                            {getDeliveryRange(7, 10)}
                        </span>
                    </div>
                </div>

                <div className="border border-[#E0E0E0] bg-[#F1F1F1] text-center py-6 px-4">
                    <div className="font-semibold text-[14px] text-[#9A9A9A]">
                        Same Day Delivery
                    </div>
                    <div className="text-[13px] mt-1 text-[#9A9A9A]">
                        Not available
                    </div>
                </div> */}

                </div>
            )}


            {/* ACTION BUTTONS – RESPONSIVE */}
            {isAuthenticated && (
                <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-4">

                    {/* BUY IT NOW */}
                    {/* <button
                    onClick={() => {
                        if (!isAuthenticated) {
                            router.push(`/login?redirect=/checkout`);
                            return;
                        }

                        // TODO: continue Buy It Now flow (checkout / direct purchase)
                    }}
                    className="w-full h-11 bg-[#D35400] clip-path-supplier flex items-center justify-center hover:bg-[#A84300] transition-colors"
                >
                    <span className="font-orbitron font-black text-[16px] uppercase text-white">
                        Buy It Now
                    </span>
                </button> */}

                    {/* ADD TO CART */}
                    <button
                        className="w-full h-11 bg-[#2F3A1D] clip-path-supplier
               flex items-center justify-center
               hover:bg-[#3D4A26] transition-colors"
                        onClick={onAddToCart}
                    >
                        <span className="font-orbitron font-black text-[16px] uppercase text-white">
                            Add To Cart
                        </span>
                    </button>

                    {/* ADD TO WISHLIST */}
                    <button
                        className="relative w-full h-10 bg-transparent md:col-span-1"
                        onClick={async () => {
                            await toggleWishlist(productId);
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
                            <Heart size={14} strokeWidth={2} className={isLiked ? "fill-[#3D4A26] text-[#3D4A26]" : ""} />
                            {isLiked ? "Saved" : "Add To Wishlist"}
                        </span>
                    </button>

                </div>
            )}


            {/* SOCIAL PROOF */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-black">
                <div className="flex items-center gap-2 bg-[#F2F2F2] p-3">
                    <Image
                        src="/icons/lightning.svg"
                        alt="Lightning"
                        width={18}
                        height={18}
                    />
                    <p>
                        <span className="font-semibold">People want this.</span>{" "}
                        100 people are watching this.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-[#F2F2F2] p-3">
                    <Image
                        src="/icons/lightning.svg"
                        alt="Lightning"
                        width={18}
                        height={18}
                    />
                    <p>
                        <span className="font-semibold">This one&apos;s trending.</span>{" "}
                        20 have already sold.
                    </p>
                </div>
            </div> */}

            {/* SHIPPING & RETURNS */}
            <div className="space-y-4 text-sm text-black">

                {/* SHIPPING */}
                {/* <div className="grid grid-cols-[90px_1fr] gap-2">
                    <span className="font-medium">Shipping:</span>
                    <div>
                        <div className="text-[#D35400] font-semibold">
                            Free 4 day delivery
                        </div>
                        <div>
                            Get it by Wed, Oct 22 to 94043.{" "}
                            <span className="text-[#D35400] underline cursor-pointer">
                                See details
                            </span>
                        </div>
                        <div className="text-[#7A7A7A] mt-1">
                            Located in: Jebel Ali, Dubai, United Arab Emirates
                        </div>
                    </div>
                </div> */}
                {/* SHIPPING */}
                <ShippingSection />


                {/* RETURNS */}
                <div className="grid grid-cols-[90px_1fr] gap-2">
                    <span className="font-medium">Returns:</span>
                    <div>
                        7 days returns. Seller pays for return shipping.{" "}
                        <Link href="/terms-conditions" className="text-[#D35400] underline cursor-pointer">
                            See details
                        </Link>
                    </div>
                </div>
                {/* PAYMENTS */}
                <div className="grid grid-cols-[90px_1fr] gap-2 items-start">
                    <span className="font-medium">Payments:</span>

                    <div className="flex items-center">
                        <Image
                            src="/fullpaymenticons.svg"
                            alt="Payment methods"
                            width={360}
                            height={40}
                            className="object-contain"
                            priority
                        />

                    </div>

                </div>
                <div>Every payment made on ArmoredMart is protected by advanced SSL encryption and safeguarded with globally recognized data security standards.</div>



            </div>
            {/* DIVIDER */}
            <div className="border-t border-[#D9D9D9] my-6" />


            {/* SHOP WITH CONFIDENCE */}
            <div className="space-y-4 text-black">

                {/* TITLE */}
                <h3 className="font-orbitron font-bold text-[18px] uppercase">
                    Shop With Confidence
                </h3>

                {/* TOP RATED PLUS */}
                <div className="flex items-start gap-3">
                    <Star
                        size={24}
                        strokeWidth={1.8}
                        className="mt-1 text-black"
                    />

                    <div>
                        <div className="font-semibold">Top Rated Plus</div>
                        <div className="text-[#6F6F6F] text-sm">
                            Top rated seller, fast shipping, and free returns.{" "}
                            {/* <span className="text-[#D35400] underline cursor-pointer">
                                See details
                            </span> */}
                        </div>
                    </div>
                </div>

                {/* MONEY BACK GUARANTEE */}
                <div className="flex items-start gap-3">
                    <ShieldCheck
                        size={24}
                        strokeWidth={1.8}
                        className="mt-1 text-black"
                    />

                    <div>
                        <div className="font-semibold">
                            Armored Mart Money Back Guarantee
                        </div>
                        <div className="text-[#6F6F6F] text-sm">
                            Get a refund if your order doesn’t ship, arrives incomplete, or has product issues.

                        </div>
                    </div>
                </div>

            </div>

            {/* DIVIDER AFTER SHOP WITH CONFIDENCE */}
            <div className="border-t border-[#D9D9D9] mt-6" />



        </div>
    );
}
