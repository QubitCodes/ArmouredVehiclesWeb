import { Loader } from "lucide-react";
import Image from "next/image";

// type OrderSummaryProps = {
//   subtotal: number;
//   onCheckout?: () => void;
//   buttonText?: string;
//   isLoading?: boolean;
// };
type OrderSummaryProps = {
  subtotal: number;
  itemCount?: number;
  onCheckout?: () => void;
  buttonText?: string;
  isLoading?: boolean;
  approvalRequired?: boolean;
  onboardingWarning?: string | null;
  totalShipping?: number;
  totalPacking?: number;
  totalVat?: number;
  grandTotal?: number;
  vatPercent?: number;
};


export default function OrderSummary({
  subtotal,
  itemCount,
  onCheckout,
  buttonText = "CHECKOUT",
  isLoading = false,
  approvalRequired = false,
  onboardingWarning = null,
  totalShipping = 0,
  totalPacking = 0,
  totalVat = 0,
  grandTotal,
  vatPercent = 5,
}: OrderSummaryProps) {
  const finalButtonText = approvalRequired ? "REQUEST PURCHASE" : buttonText;

  return (
    <aside className="bg-[#EBE3D6] p-4 lg:p-6 w-full max-w-[500px] space-y-4 lg:space-y-6 overflow-hidden">
      {/* Title */}
      <h3
        className="font-bold text-[18px] lg:text-[20px] uppercase tracking-[0px] leading-[100%] text-black"
        style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 700 }}>
        ORDER SUMMARY
      </h3>

      {/* Subtotal */}
      <div className="flex justify-between items-center">
        <span className="text-[14px] lg:text-[15px] text-[#1C1C1C]">
          Subtotal {typeof itemCount === "number" ? `(${itemCount} items)` : ""}
        </span>

        <span className="font-bold text-[16px] lg:text-[18px] flex items-center gap-2 text-black">
          <Image src="/icons/currency/dirham.svg" alt="AED" width={17} height={15} className="inline-block" />
          {subtotal.toFixed(2)}
        </span>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-2 border-t border-[#D6D0C3] pt-4">
        {totalShipping > 0 && (
          <div className="flex justify-between items-center text-sm text-[#666]">
            <span>Shipping</span>
            <span className="flex items-center gap-1">
              <Image src="/icons/currency/dirham.svg" alt="AED" width={14} height={12} className="inline-block" />
              {totalShipping.toFixed(2)}
            </span>
          </div>
        )}
        {totalPacking > 0 && (
          <div className="flex justify-between items-center text-sm text-[#666]">
            <span>Packing</span>
            <span className="flex items-center gap-1">
              <Image src="/icons/currency/dirham.svg" alt="AED" width={14} height={12} className="inline-block" />
              {totalPacking.toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center text-sm text-[#666]">
          <span>VAT ({String(vatPercent)}%)</span>
          <span className="flex items-center gap-1">
            <Image src="/icons/currency/dirham.svg" alt="AED" width={14} height={12} className="inline-block" />
            {totalVat.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Promo Code Input + Apply */}
      {/* <div className="flex h-[45px] lg:h-[50px] w-full">
        <input
          type="text"
          placeholder="Enter Promo Code"
          className="flex-1 border border-[#C1BCA9] bg-[#FBFAF6] px-3 lg:px-4 text-[13px] lg:text-[14px] outline-none text-black"
        />
        <button className="bg-[#3D4A26] text-white text-[13px] lg:text-[15px] font-bold uppercase px-6 lg:px-8 h-full hover:bg-[#4A6F36] transition-colors">
          APPLY
        </button>
      </div> */}

      {/* Divider - Hidden on mobile */}
      <hr className="border-[#D6D0C3] hidden lg:block" />

      {/* Total */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[14px] lg:text-[15px] font-bold text-black">
              Total
            </p>
            <p className="text-[11px] lg:text-[12px] text-[#666]">
              {/* (Inclusive of VAT) */}
            </p>
          </div>
          <span className="font-bold text-[20px] lg:text-[22px] text-black flex items-center gap-2">
            <Image src="/icons/currency/dirham.svg" alt="AED" width={17} height={15} className="inline-block" />
            {grandTotal ? grandTotal.toFixed(2) : subtotal.toFixed(2)}
          </span>
        </div>

        <p className="text-[11px] lg:text-[12px] text-[#8A8A8A]">
          Taxes and Shipping calculated at checkout
        </p>
      </div>

      {/* Checkout Button */}
      {/* Checkout Button OR Warning */}
      {onboardingWarning ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative text-sm">
          <strong className="font-bold">Attention: </strong>
          <span className="block sm:inline">{onboardingWarning}</span>
        </div>
      ) : (
        <button
          disabled={itemCount === 0 || isLoading}
          className="
            checkout-button
            bg-[#D35400] text-white font-bold text-[16px] lg:text-[18px] uppercase
            w-full h-[50px] lg:h-[55px] relative
            flex items-center justify-center gap-2
            transition-colors hover:bg-[#B51E17] disabled:opacity-50 disabled:cursor-not-allowed
          "
          onClick={() => onCheckout?.()}
        >
          {isLoading && <Loader className="w-5 h-5 animate-spin" />}
          {finalButtonText}
        </button>
      )}
    </aside>
  );
}
