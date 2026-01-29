"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface Review {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    user?: {
        name: string;
        avatar?: string;
    };
}

interface ReviewsTabProps {
    reviews: Review[];
    rating: number;
    reviewCount: number;
}

export default function ReviewsTab({ reviews = [], rating = 0, reviewCount = 0 }: ReviewsTabProps) {
    const [sortBy, setSortBy] = useState("top");

    // Calculate rating distribution
    const distribution = [5, 4, 3, 2, 1].map(stars => {
        const count = reviews.filter(r => Math.floor(r.rating) === stars).length;
        const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
        return { stars, count, percentage };
    });

    return (
        <div className=" p-4 font-sans text-black">
            <h3 className="font-orbitron font-bold text-xl mb-6 uppercase">Product Ratings & Reviews</h3>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Overall Rating */}
                <div className="w-full lg:w-1/3">
                    <div className="text-sm font-semibold mb-2">Overall Rating</div>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-5xl font-bold font-orbitron">{rating.toFixed(1)}</span>
                        <div className="mb-2">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-xl ${i < Math.round(rating) ? "text-[#FF5C00]" : "text-gray-300"}`}>★</span>
                            ))}
                        </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-6">Based on {reviewCount} ratings</div>

                    <div className="space-y-2 hidden sm:block">
                        {distribution.map((item) => (
                            <div key={item.stars} className="flex items-center gap-2 text-xs">
                                <span className="w-4 font-bold">{item.stars} ★</span>
                                <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-[#52C41A]" 
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                                <span className="w-8 text-right text-gray-500">{Math.round(item.percentage)}%</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 space-y-4">
                       <div className="space-y-1">
                            <h4 className="font-bold flex items-center gap-2">
                                <span className="text-xl">⚙️</span> How do I review this product?
                            </h4>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                If you recently purchased this product from Armored Mart, you can go to your Orders page and click on the Submit Review button.
                            </p>
                       </div>

                       <div className="space-y-1">
                            <h4 className="font-bold flex items-center gap-2">
                                <span className="text-xl">🛡️</span> Where do the reviews come from?
                            </h4>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Our reviews are from Armored Mart customers who purchased the product and submitted a review.
                            </p>
                       </div>
                    </div>
                </div>

                {/* Right: Reviews List */}
                <div className="w-full lg:w-2/3">
                    <div className="flex justify-between items-center mb-6 border-b border-[#D8D0C0] pb-2">
                        <h4 className="font-bold">{reviewCount} Reviews</h4>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">⇅ SORT BY</span>
                            <select 
                                className="bg-transparent font-semibold focus:outline-none"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="top">Top Reviews</option>
                                <option value="newest">Newest</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {reviews.length > 0 ? reviews.map((review) => (
                             <div key={review.id} className="border-b border-[#D8D0C0] pb-6 last:border-0 relative">
                                <div className="flex items-start gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                                        <Image 
                                            src={review.user?.avatar || "/placeholder-avatar.png"} 
                                            alt={review.user?.name || "User"}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm">{review.user?.name || "Anonymous"}</span>
                                            <span className="flex items-center text-[10px] text-[#52C41A] bg-[#52C41A]/10 px-1.5 py-0.5 rounded">
                                                <CheckCircle2 size={10} className="mr-1"/> Verified Purchase
                                            </span>
                                            <span className="flex items-center text-[10px] text-[#FF5C00] bg-[#FF5C00]/10 px-1.5 py-0.5 rounded">
                                                Recommended
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-gray-500 mt-0.5">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex text-[#FF5C00] text-xs mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                                    ))}
                                </div>

                                {/* Image placeholder checking - not in API Review type yet but mimicking UI */}
                                {/* <div className="w-16 h-16 bg-black rounded mb-2 overflow-hidden relative">
                                     <Image src={product_image} alt="Review Image" fill className="object-cover" />
                                </div> */}

                                <p className="text-sm text-gray-800 leading-relaxed font-semibold">
                                     {review.comment}
                                </p>
                             </div>
                        )) : (
                            <div className="text-center py-12 text-gray-500 italic">No reviews yet. Be the first to review!</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
