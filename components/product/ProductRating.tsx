"use client";

type Props = {
  rating?: number | string | null;
  reviewCount?: number | null;
};

export default function ProductRating({ rating, reviewCount }: Props) {
  const numericRating =
    typeof rating === "string" ? parseFloat(rating) : rating ?? 0;

  const count = reviewCount ?? 0;

  // ⭐ No reviews case
  if (numericRating === 0 && count === 0) {
    return (
      <div className="mt-1 text-sm text-[#D35400]">
        No reviews yet
      </div>
    );
  }

  const stars = Math.round(Math.max(0, Math.min(5, numericRating)));

  return (
    <div className="flex items-center gap-2 mt-1 text-sm">
      <div className="flex text-[#D35400] leading-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>{i < stars ? "★" : "☆"}</span>
        ))}
      </div>

      <span className="text-[#D35400]">
        {count} Review{count === 1 ? "" : "s"}
      </span>
    </div>
  );
}
