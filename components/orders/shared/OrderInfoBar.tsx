interface OrderInfoBarProps {
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
}

export default function OrderInfoBar({ leftLabel, leftValue, rightLabel, rightValue }: OrderInfoBarProps) {
  return (
    <div className="bg-[#EBE3D6] p-4 lg:p-5 mb-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
        <p className="text-sm text-[#666]">
          {leftLabel}: <span className="text-black font-medium">{leftValue}</span>
        </p>
        <p className="text-sm text-[#666]">
          {rightLabel}: <span className="text-sm text-[#666]">{rightValue}</span>
        </p>
      </div>
    </div>
  );
}

