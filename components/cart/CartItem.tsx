import QuantitySelector from "./QuantitySelector";
import Link from 'next/link';
import { Bookmark } from "lucide-react";
import Image from "next/image";
import { syncRemoveFromServer } from "@/lib/cart-sync";

export default function CartItem({ data, updateQty, removeItem, saveForLater }: any) {
  return (
    <div className="bg-[#F4F0E7] p-5">

      <div className="flex flex-col sm:flex-row gap-5">
        {/* Product Image */}
        {(data.image || true) && (
          <Link href={`/product/${data.id}`} className="shrink-0">
            <div className="relative w-[112px] h-[112px]">
              <Image
                src={data.image || "/placeholder.jpg"}
                alt={data.title}
                fill
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.jpg";
                  target.srcset = "/placeholder.jpg";
                }}
              />
            </div>
          </Link>
        )}


        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <Link href={`/product/${data.id}`}>
            <h3 className="font-semibold text-[14px] lg:text-[16px] text-[#1A1A1A] mb-1 hover:text-[#D35400] transition-colors">
              {data.title}
            </h3>
          </Link>



          {data.stock && (
            <p
              className={`text-xs font-medium mb-1 ${data.stock === "In Stock" ? "text-[#3BAF7F]" : "text-red-600"}`}
            >
              {data.stock}
            </p>
          )}

          {data.part && (
            <p className="text-xs lg:text-sm text-[#737373] mb-1">
              Part <span className="font-medium">{data.part}</span>
            </p>
          )}



          {/*           <p className="text-xs lg:text-sm text-[#6A6A6A] mb-1">
            Standard Delivery | Estimated delivery{" "}
            <span className="font-semibold">tomorrow</span>
          </p>

          <p className="text-xs lg:text-sm text-black mb-2">
            12 months/12,000 Miles Limited{" "}
            <span className="underline font-semibold">Warranty</span>
          </p> */}

          {/* Mobile Price + Qty */}
          <div className="lg:hidden">
            <div className="flex justify-between items-center mb-3">
              <div className="font-extrabold text-lg text-[#1A1A1A] flex items-center gap-2">
                <Image src="/icons/currency/dirham.svg" alt="AED" width={17} height={15} className="inline-block" />
                {data.price.toFixed(2)}
              </div>

              <div className="flex items-center gap-2">
                {data.oldPrice && (
                  <span className="text-xs line-through text-gray-500 flex items-center gap-1">
                    <Image src="/icons/currency/dirham.svg" alt="AED" width={12} height={10} className="inline-block" />
                    {data.oldPrice.toFixed(2)}
                  </span>
                )}
                {data.discount && (
                  <span className="text-xs text-green-600 font-medium">
                    {data.discount}
                  </span>
                )}
              </div>
            </div>

            {/* Mobile Packing & Shipping charges */}
            {(data.shipping_charge > 0 || data.packing_charge > 0) && (
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-3">
                {data.shipping_charge > 0 && (
                  <div className="text-[10px] text-gray-500 flex items-center gap-1">
                    <span>Shipping:</span>
                    <div className="flex items-center gap-1 font-medium text-black">
                      <Image src="/icons/currency/dirham.svg" alt="AED" width={10} height={8} className="inline-block" />
                      {data.shipping_charge.toFixed(2)}
                    </div>
                  </div>
                )}
                {data.packing_charge > 0 && (
                  <div className="text-[10px] text-gray-500 flex items-center gap-1">
                    <span>Packing:</span>
                    <div className="flex items-center gap-1 font-medium text-black">
                      <Image src="/icons/currency/dirham.svg" alt="AED" width={10} height={8} className="inline-block" />
                      {data.packing_charge.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-center">
              <QuantitySelector
                value={data.qty}
                onChange={(q: any) => updateQty(data.id, q)}
              />
            </div>
          </div>
        </div>

        {/* Price + Qty */}
        <div className="hidden lg:flex order-3 sm:order-0 mt-3 sm:mt-0 text-center sm:text-right flex-col items-center sm:items-end">
          <div className="font-extrabold flex items-center justify-end gap-2 text-xl text-[#1A1A1A]">
            <Image src="/icons/currency/dirham.svg" alt="AED" width={17} height={15} className="inline-block" />
            {data.price.toFixed(2)}
          </div>

          <div className="flex justify-end gap-2">
            {data.oldPrice && (
              <span className="text-xs line-through text-gray-500 flex items-center gap-1">
                <Image src="/icons/currency/dirham.svg" alt="AED" width={12} height={10} className="inline-block" />
                {data.oldPrice.toFixed(2)}
              </span>
            )}
            {data.discount && (
              <span className="text-xs text-green-600 font-medium">
                {data.discount}
              </span>
            )}
          </div>

          {/* Desktop Packing & Shipping charges */}
          {(data.shipping_charge > 0 || data.packing_charge > 0) && (
            <div className="flex flex-col items-end gap-1 mt-1">
              {data.shipping_charge > 0 && (
                <div className="text-[11px] text-gray-500 flex items-center gap-1">
                  <span>Shipping:</span>
                  <div className="flex items-center gap-1 font-medium text-black">
                    <Image src="/icons/currency/dirham.svg" alt="AED" width={11} height={9} className="inline-block" />
                    {data.shipping_charge.toFixed(2)}
                  </div>
                </div>
              )}
              {data.packing_charge > 0 && (
                <div className="text-[11px] text-gray-500 flex items-center gap-1">
                  <span>Packing:</span>
                  <div className="flex items-center gap-1 font-medium text-black">
                    <Image src="/icons/currency/dirham.svg" alt="AED" width={11} height={9} className="inline-block" />
                    {data.packing_charge.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-3">
            <QuantitySelector
              value={data.qty}
              onChange={(newQty: any) => updateQty(data.id, newQty)}
            />
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="-mx-4 lg:-mx-5 border-t border-[#DBD4C3] my-4" />

      {/* Bottom Section */}
      <div className="flex flex-col lg:flex-row gap-4 text-xs text-[#6A6A6A]">
        {/* <span>This item cannot be exchanged or returned.</span> */}

        {
          data.isControlled && (
            <div className="inline-block bg-red-100 text-red-600 text-[10px] px-2 py-0.5 mb-2 font-bold uppercase tracking-wider border border-red-200">
              Controlled
            </div>
          )
        }

        <div className="flex gap-3 lg:ml-auto">
          <button
            onClick={() => removeItem(data.id)}
            className="flex items-center gap-1 hover:text-red-600"
          >
            <Image src="/icons/delete.svg" width={12} height={12} alt="Delete" />
            <span className="underline">Remove</span>
          </button>

          <button
            onClick={() => saveForLater && saveForLater(data.id)}
            className="flex items-center gap-1 hover:text-black"
          >
            <Bookmark size={14} />
            <span className="underline">Save for later</span>
          </button>

          {/* <button className="flex items-center gap-1 hover:text-black">
            <img src="/icons/share.svg" width={12} />
            <span className="underline">Share</span>
          </button> */}
        </div>
      </div >
    </div >
  );
}
