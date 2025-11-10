'use client';

import Image from 'next/image';

export default function SponsoredAd() {
  return (
    <div className="bg-[#F6F3ED] border border-[#E8E3D6] rounded-md overflow-hidden flex flex-col justify-between">
      {/* Image Section */}
       <Image
        src="/sponsored/Rectangle 263.png"
        alt="Sponsored Advertisement"
        width={400}
        height={600}
        className="w-full h-auto object-cover"
        priority
      />

      {/* Disclaimer Section */}
      <div className="p-3 text-[11px] text-[black] bg-[#F6F3ED] border-t border-[#E8E3D6]">
        <p className="text-right text-[18px] font-[inter, sans-serif]">sponsored</p>
        <p className='text-[12px]'>
          <span className="text-[#D35400] font-semibold text-[12px]">Disclaimer:</span> This is sponsored content. ArmoredMart
          assumes no responsibility for the accuracy, validity, or claims presented herein.
        </p>
      </div>
    </div>
  );
}
