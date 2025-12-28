"use client";

import { Typography } from "@/components/ui/Typography";

export default function ProductHeader() {
  return (
    <div>
      <Typography
        variant="h1"
        className=" text-black text-[24px] font-bold mb-2"
      >
        DFC® - 4000 HybriDynamic Hybrid Rear Brake Pads
      </Typography>

      <div className="flex items-center gap-2">
        <div className="flex text-[#D35400]">
          {"★★★★★".split("").map((star, i) => (
            <span key={i}>{star}</span>
          ))}
        </div>

        <span className="text-sm text-[#D35400]">0 Review</span>
        <span className="text-sm text-gray-500">Part #54GD94DL</span>
        <span className="text-sm text-gray-500">SKU #374155</span>
      </div>
    </div>
  );
}
