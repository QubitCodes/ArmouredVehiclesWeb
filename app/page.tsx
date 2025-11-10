import { ImageSlider, Categories, FeaturedProducts, TopSellingProducts, SponsoredAd } from "@/components/home";

export default function Home() {
  return (
    <main className="min-h-screen">
      <ImageSlider />
      <Categories />
      <FeaturedProducts />
      <TopSellingProducts />
      <SponsoredAd />
    </main>
  );
}
