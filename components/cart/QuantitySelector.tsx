export default function QuantitySelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 bg-[#F4F0E7] rounded-md px-3 py-1">
      
      {/* Minus Button */}
      <button
        onClick={() => value > 1 && onChange(value - 1)}
        className="w-[30px] h-[30px] flex items-center justify-center rounded-full 
        border border-[#C1B8A2] text-black text-lg hover:bg-[#E1DACB]"
      >
        -
      </button>

      {/* Value Box */}
      <span className="w-[60px] h-10 flex items-center justify-center 
      border border-[#C1B8A2] text-black bg-[#F0EBE3] text-lg font-medium">
        {value}
      </span>

      {/* Plus Button */}
      <button
        onClick={() => onChange(value + 1)}
        className="w-[30px] h-[30px] flex items-center justify-center rounded-full 
        border border-[#C1B8A2] text-black text-lg hover:bg-[#E1DACB]"
      >
        +
      </button>

    </div>
  );
}
