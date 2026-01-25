import { ImageSlider, Categories, FeaturedProducts, FeaturedCarousel, TopSellingProducts, SponsoredAd } from "@/components/home";

export default function Home() {
  return (
    <main className="min-h-screen">
      <ImageSlider />
      <Categories />
      <FeaturedCarousel />
      <TopSellingProducts title="Top Selling Products" />
      <SponsoredAd />
    </main>
  );
}
