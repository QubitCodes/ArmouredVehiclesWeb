"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-[#666] hover:text-black transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Order Details</span>
      </button>
      <h1 className="font-orbitron font-black text-xl lg:text-2xl uppercase tracking-wide text-black">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-[#666] mt-1">{subtitle}</p>
      )}
    </div>
  );
}

