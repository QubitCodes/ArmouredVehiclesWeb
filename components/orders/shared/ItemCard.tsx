import Image from "next/image";
import CurrencyIcon from "./CurrencyIcon";

interface ItemCardProps {
  item: {
    id: number;
    name: string;
    price: number;
    image: string;
    orderId?: string;
  };
  showOrderId?: boolean;
}

export default function ItemCard({ item, showOrderId = true }: ItemCardProps) {
  return (
    <div className="p-4 lg:p-5 flex items-start gap-4">
      <Image
        src={item.image}
        alt={item.name}
        width={80}
        height={80}
        className="w-16 h-16 lg:w-20 lg:h-20 object-contain flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-black mb-1 line-clamp-2">
          {item.name}
        </h3>
        <div className="flex items-center gap-1 mb-1">
          <CurrencyIcon />
          <span className="font-semibold text-sm text-black">
            {item.price.toFixed(2)}
          </span>
        </div>
      </div>
      {showOrderId && item.orderId && (
        <p className="text-xs text-[#666] self-end flex-shrink-0">
          Order ID: #{item.orderId}
        </p>
      )}
    </div>
  );
}

