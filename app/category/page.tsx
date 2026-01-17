"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Category {
  id?: number;
  title: string;
  image?: string;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await api.products.getCategories();
        const data = Array.isArray(res) ? res : res?.data ?? [];
        if (data && data.length > 0) {
          // Filter for top-level categories only
          const topLevel = data.filter((item: any) => !item.parent_id);
          
          const mapped = topLevel.map((item: any) => ({
            id: item.id,
            title: item.name || "Unknown Category",
            image: item.image ? String(item.image) : undefined,
          }));
          setCategories(mapped);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20 lg:hidden">
      {/* Categories Grid */}
      <div className="px-4 pt-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D35400]"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No categories available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.id || index}
                href={`/products?category_id=${category.id}`}
                className="block"
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg shadow-md bg-black/80">
                  {/* Category Image */}
                  {category.image ? (
                    <Image
                      src={category.image.replace(/^["']|["']$/g, "")}
                      alt={category.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-800" />
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                  {/* Category Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-orbitron text-white text-sm font-bold uppercase leading-tight tracking-wide">
                      {category.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
