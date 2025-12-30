export default function QuantitySelector({ value, onChange }:any) {
  return (
    <div className="flex items-center gap-2 bg-[#F4F0E7] rounded-md px-2 lg:px-3 py-1">
      
      {/* Minus Button */}
      <button
        onClick={() => value > 1 && onChange(value - 1)}
        className="w-[25px] h-[25px] lg:w-[30px] lg:h-[30px] flex items-center justify-center rounded-full 
        border border-[#C1B8A2] text-black text-base lg:text-lg hover:bg-[#E1DACB]"
      >
        -
      </button>

      {/* Value Box */}
      <span className="w-[50px] h-8 lg:w-[60px] lg:h-10 flex items-center justify-center 
      border border-[#C1B8A2] text-black bg-[#F0EBE3] text-base lg:text-lg font-medium">
        {value}
      </span>

      {/* Plus Button */}
      <button
        onClick={() => onChange(value + 1)}
        className="w-[25px] h-[25px] lg:w-[30px] lg:h-[30px] flex items-center justify-center rounded-full 
        border border-[#C1B8A2] text-black text-base lg:text-lg hover:bg-[#E1DACB]"
      >
        +
      </button>

    </div>
  );
}
