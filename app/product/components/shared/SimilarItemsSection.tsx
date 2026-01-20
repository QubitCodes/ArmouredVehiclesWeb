"use client";

import { Typography } from "@/components/ui/Typography";
import SimilarProductCard from "@/components/product/SimilarProductCard";

type Product = {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  is_controlled?: boolean;
};

type Props = {
  products: Product[];
};

export default function SimilarItemsSection({ products }: Props) {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Typography
            variant="h2"
            className="text-lg font-extrabold text-black"
          >
            SIMILAR ITEMS
          </Typography>
          <span className="text-sm text-gray-600">Sponsored</span>
        </div>

        <button className="text-[#D35400] text-sm">
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {products.map((product) => (
          <SimilarProductCard
            key={product.id}
            id={product.id}
            image={product.image}
            name={product.name}
            rating={product.rating}
            reviews={product.reviews}
            price={product.price}
            isControlled={product.is_controlled}
          />
        ))}
      </div>
    </div>
  );
}
