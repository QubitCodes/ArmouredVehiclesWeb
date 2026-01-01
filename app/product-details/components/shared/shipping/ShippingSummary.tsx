"use client";

type Props = {
  onChange: () => void;
};

/* 🔹 Helper: expected delivery date */
function getExpectedDeliveryDate(daysToAdd: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function ShippingSummary({ onChange }: Props) {
  return (
    <div className="bg-[#F5F5F5] p-4 rounded-md text-black">
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="font-semibold">
            Standard{" "}
            <span className="text-[#FF6A00]">
              armoured-vehicles-web.vercel.app
            </span>{" "}
            Logistics
          </div>

          <div className="text-sm">
            Shipping fee: ₹49,377.58 for 50 pieces
          </div>

          <div className="text-sm">
            Guaranteed delivery by{" "}
            <b>{getExpectedDeliveryDate(8)}</b>
          </div>
        </div>

        <button
          onClick={onChange}
          className="text-[#D35400] text-sm font-medium whitespace-nowrap"
        >
          Change →
        </button>
      </div>
    </div>
  );
}
