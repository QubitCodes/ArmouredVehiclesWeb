"use client";

import { Typography } from "@/components/ui/Typography";
import Link from "next/link";

type Props = {
  name?: string | null;
  rating?: number | string | null;
  reviewCount?: number | null;
  sku?: string | null;
  isControlled?: boolean;
  brand?: { id: string | number; name: string } | null;
};

export default function ProductHeader({ name, rating, reviewCount, sku, isControlled, brand }: Props) {
  const numericRating = typeof rating === "string" ? parseFloat(rating) : rating ?? 0;
  const showRating = Number.isFinite(numericRating) && numericRating! > 0;
  const stars = Math.round(Math.max(0, Math.min(5, Number(numericRating) || 0)));

  return (
    <div>
      <Typography variant="h1" className=" text-black text-[18px] md:text-[24px] font-bold mb-2 leading-tight">
        {name || "Product"}
      </Typography>

      {brand && (
        <Link
          href={`/products?brand=${brand.id}`}
          className="text-[#D35400] text-sm font-medium hover:underline mb-2 block"
        >
          {brand.name}
        </Link>
      )}

      <div className="flex flex-col items-start gap-2">
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

        {sku && (
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-gray-500">SKU #{sku}</span>
            {isControlled && (
              <div className="inline-block bg-red-100 text-red-600 text-[10px] md:text-xs px-2 py-0.5 font-bold uppercase tracking-wider border border-red-200 w-fit">
                Controlled
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
