"use client";

import Image from "next/image";
import { Check, Info } from "lucide-react";
import { Heart } from "lucide-react";
import { Star, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import ShippingSection from "./shipping/ShippingSection";






type Props = {
    quantity: number;
    setQuantity: (qty: number) => void;
    price?: string | number | null;
    originalPrice?: string | null;
    currency?: string | null;
    condition?: string | null;
    stock?: number | null;
    onAddToCart?: () => void;
};

export default function ProductPurchaseSection({
    quantity,
    setQuantity,
    price,
    originalPrice,
    currency,
    condition,
    stock,
    onAddToCart,
}: Props) {
    const displayPrice = price != null && price !== '' ? String(price) : undefined;
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();


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
                                    width={16}
                                    height={16}
                                    className="opacity-60 md:w-5 md:h-5"
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
                                            className="opacity-60"
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
                        onClick={() => router.push("/login")}
                        className="text-[20px] font-medium text-[#D35400] cursor-pointer hover:underline"
                    >
                        Please <span className="font-bold">Login to access</span> the price
                    </span>
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
            <div className="relative w-full">
                <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="
      w-full
      h-12
      appearance-none
      border border-[#B7B1A8]
      bg-[#EBE4D7]
      px-4
      pr-10
      text-black
      text-sm
      focus:outline-none
    "
                >
                    {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                            Quantity: {i + 1}
                        </option>
                    ))}
                </select>

                {/* Chevron */}
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* DELIVERY OPTIONS */}
            <div className="grid grid-cols-2 gap-4">

                {/* STANDARD DELIVERY */}
                <div className="relative border-2 border-[#FF7A00] bg-white text-center py-6 px-4">

                    {/* RIBBON (INSIDE CARD) */}
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

                {/* DISABLED */}
                <div className="border border-[#E0E0E0] bg-[#F1F1F1] text-center py-6 px-4">
                    <div className="font-semibold text-[14px] text-[#9A9A9A]">
                        Same Day Delivery
                    </div>
                    <div className="text-[13px] mt-1 text-[#9A9A9A]">
                        Not available
                    </div>
                </div>

            </div>


            {/* ACTION BUTTONS – RESPONSIVE */}
            <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-4">

                {/* BUY IT NOW */}
                <button
                    onClick={() => {
                        if (!isAuthenticated) {
                            router.push(`/login?redirect=/checkout`);
                            return;
                        }

                        // TODO: continue Buy It Now flow (checkout / direct purchase)
                    }}
                    className="w-full h-11 bg-[#D35400] clip-path-supplier
    flex items-center justify-center
    hover:bg-[#A84300] transition-colors"
                >
                    <span className="font-orbitron font-black text-[16px] uppercase text-white">
                        Buy It Now
                    </span>
                </button>

                {/* ADD TO CART */}
                <button
                    className="w-full h-11 bg-[#3D4A26] clip-path-supplier
               flex items-center justify-center
               hover:bg-[#2F3A1D] transition-colors"
                    onClick={onAddToCart}
                >
                    <span className="font-orbitron font-black text-[16px] uppercase text-white">
                        Add To Cart
                    </span>
                </button>

                {/* ADD TO WISHLIST */}
                <button className="relative w-full h-11 bg-transparent">

                    {/* BORDER */}
                    <span
                        className="absolute inset-0 clip-path-supplier bg-[#3D4A26]"
                        aria-hidden
                    />

                    {/* INNER WHITE */}
                    <span
                        className="absolute inset-[1.5px] clip-path-supplier bg-white"
                        aria-hidden
                    />

                    {/* CONTENT */}
                    <span
                        className="relative z-10 flex items-center justify-center gap-2
                 h-full w-full font-orbitron font-black
                 text-[14px] uppercase text-[#3D4A26]"
                    >
                        <Heart size={16} strokeWidth={2} />
                        Add To Wishlist
                    </span>

                </button>

            </div>


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
                        30 days returns. Seller pays for return shipping.{" "}
                        <span className="text-[#D35400] underline cursor-pointer">
                            See details
                        </span>
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
