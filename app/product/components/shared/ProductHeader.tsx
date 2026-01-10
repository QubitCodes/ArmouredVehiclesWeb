"use client";

import { Typography } from "@/components/ui/Typography";

type Props = {
  name?: string | null;
  rating?: number | string | null;
  reviewCount?: number | null;
  sku?: string | null;
};

export default function ProductHeader({ name, rating, reviewCount, sku }: Props) {
  const numericRating = typeof rating === "string" ? parseFloat(rating) : rating ?? 0;
  const showRating = Number.isFinite(numericRating) && numericRating! > 0;
  const stars = Math.round(Math.max(0, Math.min(5, Number(numericRating) || 0)));

  return (
    <div>
      <Typography variant="h1" className=" text-black text-[24px] font-bold mb-2">
        {name || "Product"}
      </Typography>

      <div className="flex items-center gap-2">
        {showRating && (
          <div className="flex text-[#D35400]" aria-label={`Rating ${numericRating} out of 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>{i < stars ? "★" : "☆"}</span>
            ))}
          </div>
        )}

        {typeof reviewCount === "number" && (
          <span className="text-sm text-[#D35400]">
            {reviewCount === 0
              ? "No reviews yet"
              : `${reviewCount} Review${reviewCount === 1 ? "" : "s"}`}
          </span>
        )}


        {sku && <span className="text-sm text-gray-500">SKU #{sku}</span>}
      </div>
    </div>
  );
}
