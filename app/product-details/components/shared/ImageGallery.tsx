"use client";

import Image from "next/image";

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
                    {/* TOP LEFT – OPEN */}
                    <div className="absolute top-3 left-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 text-black"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M15 3h6v6m0-6L10 14m-7 7h6v-6m0 6L21 10" />
                            </svg>
                        </div>
                    </div>

                    {/* TOP RIGHT – ZOOM */}
                    <div className="absolute top-3 right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 text-black"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                    </div>

                    {/* RIGHT CENTER – WISHLIST */}
                    <div className="absolute top-1/2 right-3 -translate-y-1/2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow">
                            <span className="text-sm font-medium">190</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 text-black"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
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
