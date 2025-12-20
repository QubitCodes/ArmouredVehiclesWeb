"use client";

export default function PaymentInformation({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="max-w-6xl mx-auto text-black">
      {/* ================= TITLE ================= */}
      <h1 className="font-orbitron font-bold text-black mb-2 text-[26px]">
        PAYMENT INFORMATION
      </h1>

      <p className="text-[16px] font-bold mb-6 font-orbitron">
        CREDIT OR DEBIT CARD DETAILS
      </p>

      <div className="">

        {/* ================= INFO BOX ================= */}
        <div className=" bg-[#DAD4C5] px-5 py-4 text-xs">
          <p className="font-bold font-orbitron mb-1 text-[16px]">ITEM PERCENTAGE FEE</p>
          <p className="text-[#6B6B6B] leading-relaxed">
            You will be charged a percentage fee on each item sold. This fee is
            applied per sale and will be calculated based on the selling price
            of each listing. If you expand to sell in other marketplaces, the
            fee will be applied separately. For more information on this topic,
            please refer to our help section.
          </p>
        </div>

        {/* ================= CARD FORM ================= */}
       <div className="bg-[#F0EBE3] p-4 mt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
    
              {/* Card Number */}
              <div>
                <label className="block text-xs mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="Enter Card Number"
                  className="w-full bg-[#EBE3D6] border border-[#C7B88A] px-3 py-2"
                />
              </div>
    
              {/* Expiry */}
              <div>
                <label className="block text-xs mb-1">Expires On</label>
                <div className="flex gap-2">
                  <select className="w-1/2 bg-[#EBE3D6] border border-[#C7B88A] px-3 py-2">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
                    <option>11</option>
                    <option>12</option>
                  </select>
    
                  <select className="w-1/2 bg-[#EBE3D6] border border-[#C7B88A] px-3 py-2">
                    <option>2025</option>
                    <option>2026</option>
                    <option>2027</option>
                    <option>2028</option>
                    <option>2029</option>
                  </select>
                </div>
              </div>
    
              {/* Card Holder Name */}
              <div className="md:col-span-1">
                <label className="block text-xs mb-1">Card Holder Name</label>
                <input
                  type="text"
                  placeholder="Enter Card Holder’s Name"
                  className="w-full bg-[#EBE3D6] border border-[#C7B88A] px-3 py-2"
                />
              </div>
            </div>
       </div>

        {/* ================= BILLING ADDRESS ================= */}
       <div className="bg-[#F0EBE3] p-4 mt-5">
            <div className="text-xs">
              <p className="font-semibold mb-1">Billing Address</p>
              <p className="text-[#6B6B6B]">
                Office 502, Building 12, Sheikh Zayed Road, Dubai, UAE
              </p>
    
              <div className="mt-2 space-y-1">
                <p className="text-[#D35400] cursor-pointer">
                  • View saved addresses
                </p>
                <p className="text-[#D35400] cursor-pointer">
                  • Add a new address
                </p>
              </div>
            </div>
       </div>
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <div className="flex justify-center items-center mt-10 gap-6">
       
         <button
          onClick={onBack}
          className="relative w-[280px] h-[42px] bg-transparent"
        >
          {/* Border shape */}
          <span
            className="absolute inset-0 clip-path-supplier bg-[#C7B88A]"
            aria-hidden
          />

          {/* Inner fill */}
          <span
            className="absolute inset-[1.5px] clip-path-supplier bg-[#F0EBE3]"
            aria-hidden
          />

          {/* Text */}
          <span className="relative z-10 flex items-center justify-center h-full w-full
                   font-orbitron font-bold text-[13px] uppercase text-black">
            Previous
          </span>
        </button>

        <button
          onClick={onContinue}
          className="clip-next w-[240px] h-[42px]
                     bg-[#D35400] text-white
                     font-orbitron text-[12px]  hover:bg-[#39482C] transition-colors
               clip-next clip-path-supplier"
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
