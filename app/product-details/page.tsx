"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Container } from "@/components/ui/Container";
import { Heart, ChevronDown } from "lucide-react";
import FullscreenGallery from "@/components/ui/FullscreenGallery";
import SimilarProductCard from "@/components/product/SimilarProductCard";
import { TopSellingProducts } from "@/components/home";
import TabbedSection, { TabContent } from "@/components/ui/TabbedSection";

const ProductDetails = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showGallery, setShowGallery] = useState(false);
  const [expandedVehicle, setExpandedVehicle] = useState<string | null>("genesis");
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleMove = (e: any) => {
    if (!imgRef.current) return;

    const { left, top, width, height } =
      imgRef.current.getBoundingClientRect();

    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    imgRef.current.style.transformOrigin = `${x}% ${y}%`;
  };

  const images = [
    "/product/product 1.png",
    "/product/brake-pad-2.jpg",
    "/product/brake-pad-3.jpg",
    "/product/brake-pad-4.jpg",
    "/product/brake-pad-5.jpg",
  ];

  const similarProducts = [
    {
      id: 1,
      name: "Extended Life Engine Oil Filter",
      rating: 4.7,
      reviews: 2083,
      price: 99.99,
      image: "/product/similar/image.png",
    },
    {
      id: 2,
      name: "Extended Life Engine Oil Filter",
      rating: 4.7,
      reviews: 2083,
      price: 99.99,
      image: "/product/similar/image 2.png",
    },
    {
      id: 3,
      name: "Extended Life Engine Oil Filter",
      rating: 4.7,
      reviews: 2083,
      price: 99.99,
      image: "/product/similar/image 3.png",
    },
  ];

  const tabContent: TabContent[] = [
    {
      id: "vehicle-fitment",
      label: "Vehicle Fitment",
      content: (
        <div className="space-y-4">
          <div className="border border-[#3D4A26]">
            <button
              onClick={() => setExpandedVehicle(expandedVehicle === "genesis" ? null : "genesis")}
              className="w-full flex items-center justify-between bg-[#F0EBE3] p-4  transition-colors"
            >
              <div className="font-bold text-black">Genesis</div>
              <ChevronDown
                size={20}
                className={`transition-transform ${expandedVehicle === "genesis" ? "rotate-180" : ""} text-black`}
              />
            </button>
            {expandedVehicle === "genesis" && (
              <ul className="space-y-2 text-sm text-black p-4 bg-[#F0EBE3]">
                <li>• 2023-2025 Genesis Electrified GV70</li>
                <li>• 2021-2025 Genesis G80</li>
                <li>• 2023-2025 Genesis G90</li>
                <li>• 2023-2025 Genesis GV60</li>
                <li>• 2022-2025 Genesis GV70</li>
              </ul>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "specifications",
      label: "Specifications",
      content: (
        <div className="space-y-4">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b">
                <td className="py-2 text-gray-600 font-medium">Series</td>
                <td className="py-2 text-black">4000 HybriDynamic</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-gray-600 font-medium">Friction Material Bonding Type</td>
                <td className="py-2 text-black">Integrally Molded</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-gray-600 font-medium">SKU #</td>
                <td className="py-2 text-black">374155</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-gray-600 font-medium">Weight</td>
                <td className="py-2 text-black">18.84lbs</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-gray-600 font-medium">Solid Or Vented Type Rotor</td>
                <td className="py-2 text-black">Vented</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-gray-600 font-medium">Material</td>
                <td className="py-2 text-black">Iron Alloy</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: "features",
      label: "Features",
      content: (
        <div className="space-y-3">
          <div className="flex gap-2">
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-1">
              <path d="M0 0V10L7 5.28302L0 0Z" fill="black"/>
            </svg>
            <span className="text-black">Frequent braking environments, high speed, heavy traffic, steep gradients, towing, or off-roading</span>
          </div>
          <div className="flex gap-2">
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-1">
              <path d="M0 0V10L7 5.28302L0 0Z" fill="black"/>
            </svg>
            <span className="text-black">Delivers strong, predictable friction lever regardless of temperature, speed, or axle load</span>
          </div>
          <div className="flex gap-2">
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-1">
              <path d="M0 0V10L7 5.28302L0 0Z" fill="black"/>
            </svg>
            <span className="text-black">Engineered to withstand extremely high operating temperature range</span>
          </div>
          <div className="flex gap-2">
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-1">
              <path d="M0 0V10L7 5.28302L0 0Z" fill="black"/>
            </svg>
            <span className="text-black">Long pad wear, low noise, and low dust</span>
          </div>
          <div className="flex gap-2">
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-1">
              <path d="M0 0V10L7 5.28302L0 0Z" fill="black"/>
            </svg>
            <span className="text-black">100% Asbestos free</span>
          </div>
          <div className="flex gap-2">
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 mt-1">
              <path d="M0 0V10L7 5.28302L0 0Z" fill="black"/>
            </svg>
            <span className="text-black">100% Copper Free Eco Friendly Formulation</span>
          </div>
        </div>
      ),
    },
    {
      id: "product-details",
      label: "Product Details",
      content: (
        <div className="space-y-4 text-black">
          <div>
            <h4 className="font-bold mb-2">Directional or Non-Directional Brake Surface</h4>
            <p>Non-Directional</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">ABS Tone Ring Included</h4>
            <p>No</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Grade Type</h4>
            <p>Standard Replacement</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Mounting Bolt Hole Circle Diameter</h4>
            <p>114.3mm</p>
          </div>
        </div>
      ),
    },
    {
      id: "warranty",
      label: "Warranty",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold mb-2">Warranty Coverage</h4>
            <p className="text-gray-700">This product comes with a limited lifetime warranty against defects in materials and workmanship under normal use conditions.</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Warranty Period</h4>
            <p className="text-gray-700">Lifetime from date of purchase</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">What is Covered</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Manufacturing defects</li>
              <li>Material defects</li>
              <li>Workmanship defects</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "reviews",
      label: "Reviews (1)",
      content: (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold">John Doe</h4>
                <div className="flex gap-1 text-[#D35400] text-sm">
                  {"★★★★★".split("").map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
              </div>
              <span className="text-sm text-gray-500">2 days ago</span>
            </div>
            <h5 className="font-bold mb-2">Great Product!</h5>
            <p className="text-gray-700 text-sm">
              Excellent brake pads with great stopping power and minimal noise. Very satisfied with the purchase.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="bg-[#F0EBE3]">
      <Container className="mb-10">
        <div className="py-8">
          {/* Breadcrumb */}
          <div className="text-sm mb-6">
            <span className="text-black">
              AUTO PARTS / BRAKES AND TRACTION CONTROL / DISC BRAKE SYSTEM / BRAKE PADS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-[#EBE3D6]" onClick={() => setShowGallery(true)}
              >
                <Image
                  src={images[selectedImage]}
                  alt="Product"
                  fill
                  className="object-contain cursor-pointer"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 aspect-square rounded-md overflow-hidden border ${selectedImage === index
                      ? "border-red-500"
                      : "border-gray-200"
                      }`}
                  >
                    <Image src={image} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>

              {/* Similar Items */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <Typography variant="h2" className="text-lg font-extrabold text-black">
                      SIMILAR ITEMS
                    </Typography>
                    <span className="text-sm text-gray-600">Sponsored</span>
                  </div>
                  <button className="text-[#D35400] text-sm">View All</button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {similarProducts.map((product) => (
                    <SimilarProductCard
                      key={product.id}
                      image={product.image}
                      name={product.name}
                      rating={product.rating}
                      reviews={product.reviews}
                      price={product.price}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Typography variant="h1" className=" text-black text-[24px] font-bold mb-2">
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

              <div className="space-y-4">
                <div >
                  <span className="text-[32px] font-bold font-[inter, sans-serif] text-black">฿ 679</span>
                  <div className="flex items-center gap-2 font-[inter, sans-serif]">
                    <span className="text-[#3D4A26]">฿ 559.25 with coupon code</span>
                    <button className="text-[#D35400] text-sm underline">Price Details</button>
                  </div>
                </div>

                <div className="space-y-2 text-black">
                  <div className="flex justify-start">
                    <span>Condition:</span>
                    <span className="font-medium text-black">New</span>
                  </div>
                  <div className="flex justify-start">
                    <span>Availability:</span>
                    <span className=""><span className="text-[#3BAF7F]">In Stock</span> (65)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* <label htmlFor="quantity" className="block text-black">
                  Quantity:
                </label> */}
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2 border text-[#737373]"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1} className="text-black">
                        {`Quantity: ${i + 1}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 text-black">
                  <div className="relative p-5 border-2 border-orange-500 rounded-md text-center bg-white">
                    {/* Ribbon */}
                    <div className="absolute top-0 left-0">
                      <div className="w-8 h-8 bg-orange-500 clip-triangle flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                        </svg>
                      </div>
                    </div>

                    <div className="font-semibold text-lg">Standard Delivery</div>
                    <div className="text-sm mt-1">
                      Get it by <span className="text-green-700 font-medium">Oct. 22</span>
                    </div>
                  </div>
                  <div className="relative p-5 rounded-md text-center bg-[#F2F2F2]">

                    <div className="font-semibold text-[#949494] text-lg">Same Day Delivery</div>
                    <div className="text-sm mt-1 text-[#949494]">
                      Not Available
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#D35400] text-white clip-path-supplier hover:bg-[#A84300] transition-colors flex items-center justify-center h-[47px]">
                    <span className="font-black text-[20px] leading-none font-orbitron uppercase">Buy It Now</span>
                  </div>
                  <div className="bg-green-700 hover:bg-green-800 clip-path-supplier text-white flex items-center justify-center w-full h-[47px]">
                    <span className="font-black text-[20px] leading-none font-orbitron uppercase">Add To Cart</span>
                  </div>
                  <div className="bg-white clip-path-supplier text-black flex items-center justify-center w-full h-[47px]">
                    <span className="font-black text-[16px] leading-none font-orbitron uppercase">Add To WishList</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm flex justify-between text-black">
                  <div className="flex bg-[#F2F2F2] p-2 items-center gap-2">
                    <Image src="/icons/lightning.svg" alt="Lightning" width={20} height={20} />
                    <span>People want this -</span>
                    <span className="font-medium">100 people are watching this.</span>
                  </div>
                  <div className="flex bg-[#F2F2F2] p-2 items-center gap-2">
                    <Image src="/icons/lightning.svg" alt="Lightning" width={20} height={20} />
                    <span>This one&apos;s trending -</span>
                    <span className="font-medium">20 have already sold.</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-4 ml-3">
                      <div className="font-medium text-black mr-2">Shipping:</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-red-600">Free 4 day delivery</div>
                        <div className="text-black">Get it by Wed, Oct 22 to 94043. <span className="text-blue-600">See details</span></div>
                      </div>
                    </div>
                    {/* <div className="text-sm text-gray-500">Located in Jebel Ali, Dubai, United Arab Emirates</div> */}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-4 ml-3">
                      <div className="font-medium text-black mr-2">Returns:</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-black">30 days returns. Seller pays for return shipping. <span className="text-blue-600">See details</span></div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="space-y-2">
                    <div className="font-medium">Payments:</div>
                    <div className="flex gap-2">
                      <Image src="/icons/payment/mastercard.png" alt="Mastercard" width={40} height={24} />
                      <Image src="/icons/payment/visa.png" alt="Visa" width={40} height={24} />
                      <Image src="/icons/payment/cash.png" alt="Cash" width={40} height={24} />
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <TopSellingProducts title="Recommended For Your Vehicle" />
      <Container className="my-10">
        <TabbedSection tabs={tabContent} defaultTab="vehicle-fitment" />
      </Container>
      {showGallery && (
        <FullscreenGallery
          images={images}
          index={selectedImage}
          onClose={() => setShowGallery(false)}
        />
      )}
    </section>

  );
};

export default ProductDetails;
