"use client";

import Image from "next/image";
import { useState } from "react";



type Props = {
    images: string[];
    selectedImage: number;
    setSelectedImage: (index: number) => void;
    onOpenGallery: () => void;
};

export default function ImageGallery({
    images,
    selectedImage,
    setSelectedImage,
    onOpenGallery,
}: Props) {
    const [wishlistCount, setWishlistCount] = useState(190);
    const [isWishlisted, setIsWishlisted] = useState(false);
    return (
        <div className="space-y-4">
            {/* MAIN IMAGE */}
            <div
                className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-[#EBE3D6] group"
                onClick={onOpenGallery}
            >
                {/* INNER PADDING WRAPPER */}
                <div className="absolute inset-0 p-6 md:p-8">
                    <div className="relative w-full h-full">
                        <Image
                            src={images[selectedImage]}
                            alt="Product"
                            fill
                            className="object-contain cursor-pointer"
                        />
                    </div>
                </div>

                {/* ICON OVERLAY */}

                <div className="absolute inset-0 pointer-events-none">

                    {/* TOP LEFT – OPEN EXTERNAL */}
                    <div className="absolute top-3 left-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-auto">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow">
                            <Image
                                src="/icons/productdetails/open-external.svg"
                                alt="Open"
                                width={18}
                                height={18}
                            />
                        </div>
                    </div>

                    {/* TOP RIGHT – EXPAND + WISHLIST */}
                    <div className="absolute top-3 right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-auto">
                        <div className="flex items-center gap-2">

                            {/* EXPAND */}
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow">
                                <Image
                                    src="/icons/productdetails/expand-view.svg"
                                    alt="Expand"
                                    width={18}
                                    height={18}
                                />
                            </div>

                            {/* WISHLIST */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsWishlisted((prev) => !prev);
                                    setWishlistCount((count) =>
                                        isWishlisted ? count - 1 : count + 1
                                    );
                                }}
                                className="flex items-center gap-2 bg-white px-3 h-10 rounded-full shadow hover:bg-gray-50 transition"
                            >
                                <span className="text-sm font-medium text-black">
                                    {wishlistCount}
                                </span>

                                <Image
                                    src="/icons/productdetails/wishlist-heart.svg"
                                    alt="Wishlist"
                                    width={18}
                                    height={18}
                                    className={`transition ${isWishlisted ? "filter-orange" : ""}`}
                                />
                            </button>

                        </div>
                    </div>

                </div>



            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative w-20 aspect-square rounded-md overflow-hidden border ${selectedImage === index
                            ? "border-red-500"
                            : "border-gray-200"
                            }`}
                    >
                        <Image
                            src={image}
                            alt="Thumbnail"
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
