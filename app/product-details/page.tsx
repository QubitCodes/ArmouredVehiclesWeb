"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Container } from "@/components/ui/Container";
import { Heart } from "lucide-react";

const ProductDetails = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const images = [
    "/product/brake-pad-1.jpg",
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
      image: "/product/similar-1.jpg",
    },
    {
      id: 2,
      name: "Extended Life Engine Oil Filter",
      rating: 4.7,
      reviews: 2083,
      price: 99.99,
      image: "/product/similar-2.jpg",
    },
    {
      id: 3,
      name: "Extended Life Engine Oil Filter",
      rating: 4.7,
      reviews: 2083,
      price: 99.99,
      image: "/product/similar-3.jpg",
    },
  ];

  return (
    <section className="bg-[#F0EBE3]">
    <Container>
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
            <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={images[selectedImage]}
                alt="Product"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 aspect-square rounded-md overflow-hidden border ${
                    selectedImage === index
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                >
                  <Image src={image} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Typography variant="h1" className=" text-black text-2xl font-bold mb-2">
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
                <span className="text-3xl font-bold font-[inter, sans-serif] text-black">฿ 679</span>
                <div className="flex items-center gap-2 font-[inter, sans-serif]">
                  <span className="text-black">฿ 559.25 with coupon code</span>
                  <button className="text-[#D35400] text-sm underline">Price Details</button>
                </div>
              </div>

              <div className="space-y-2 text-black">
                <div className="flex justify-between">
                  <span>Condition:</span>
                  <span className="font-medium text-black">New</span>
                </div>
                <div className="flex justify-between">
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
                  className="w-full p-2 border rounded-md text-[#737373]"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {`Quantity: ${i + 1}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 text-black">
                <div className="p-4 border rounded-md text-center">
                  <div className="font-medium">Standard Delivery</div>
                  <div className="text-sm text-gray-500">Oct 20, 2023</div>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <div className="font-medium">Same Day Delivery</div>
                  <div className="text-sm text-gray-500">Not Available</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
               <div className="bg-[#D35400] text-white clip-path-supplier hover:bg-[#A84300] transition-colors flex items-center justify-center h-[47px]">
                  <span className="font-black text-[20px] leading-none font-orbitron uppercase">Buy It Now</span>
                </div>
                <div className="bg-green-700 hover:bg-green-800 clip-path-supplier text-white flex items-center justify-center w-full h-[47px]">
                  <span className="font-black text-[20px] leading-none font-orbitron uppercase">Add To Cart</span>
                </div>
                <div className="bg-green-700 hover:bg-green-800 clip-path-supplier text-white flex items-center justify-center w-full h-[47px]">
                  <span className="font-black text-[20px] leading-none font-orbitron uppercase">Add To WishList</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-black">
                <div className="flex items-center gap-2">
                  <span>👥 People want this -</span>
                  <span className="font-medium">100 people are watching this.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📈 This one&apos;s trending -</span>
                  <span className="font-medium">20 have already sold.</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="font-medium">Shipping:</div>
                  <div className="text-red-600">Free 4 day delivery</div>
                  <div>Get it by Wed, Oct 22 to 94043. <span className="text-blue-600">See details</span></div>
                  <div className="text-sm text-gray-500">Located in Jebel Ali, Dubai, United Arab Emirates</div>
                </div>

                <div className="space-y-2">
                  <div className="font-medium">Returns:</div>
                  <div>30 days returns. Seller pays for return shipping. <span className="text-blue-600">See details</span></div>
                </div>

                <div className="space-y-2">
                  <div className="font-medium">Payments:</div>
                  <div className="flex gap-2">
                    <Image src="/icons/payment/mastercard.png" alt="Mastercard" width={40} height={24} />
                    <Image src="/icons/payment/visa.png" alt="Visa" width={40} height={24} />
                    <Image src="/icons/payment/cash.png" alt="Cash" width={40} height={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Items */}
        {/* <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <Typography variant="h2" className="text-xl font-bold">
              SIMILAR ITEMS
            </Typography>
            <button className="text-blue-600">View All</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProducts.map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <div className="relative aspect-square mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {"★★★★★".split("").map((star, i) => (
                        <span key={i}>{star}</span>
                      ))}
                    </div>
                    <span className="text-sm">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                  <Typography variant="h3" className="font-medium">
                    {product.name}
                  </Typography>
                  <div className="font-bold">₫{product.price}</div>
                  <Button variant="default" className="w-full">
                    BUY NOW
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </Container>
    </section>
  );
};

export default ProductDetails;
