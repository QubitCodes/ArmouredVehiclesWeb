import { useEffect, useState } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api';

interface AdData {
  id: string;
  image_url: string;
  title?: string;
  link?: string;
}

export default function SponsoredAd() {
  const [ad, setAd] = useState<AdData | null>(null);

  useEffect(() => {
    // Fetch ad for sidebar location
    api.webFrontend.getAds('sidebar')
      .then(res => {
        const data = Array.isArray(res) ? res : res?.data;
        if (Array.isArray(data) && data.length > 0) {
          setAd(data[0]);
        }
      })
      .catch(err => console.error(err));
  }, []);

  if (!ad) return null;

  return (
    <div className="bg-[#F0EBE3] rounded-md overflow-hidden flex flex-col justify-between mb-6 mt-6">
      {/* Image Section */}
      <a
        href={ad.link || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className={!ad.link ? 'pointer-events-none' : ''}
      >
        <Image
          src={ad.image_url}
          alt={ad.title || "Sponsored Advertisement"}
          width={400}
          height={600}
          className="w-full h-auto object-cover"
          priority
        />
      </a>

      {/* Disclaimer Section */}
      <div className="p-3 text-[11px] text-[black] bg-[#F0EBE3] border-t border-[#E8E3D6]">
        <p className="text-right text-[18px] font-[inter, sans-serif]">Sponsored</p>
        <p className='text-[12px]'>
          <span className="text-[#D35400] font-semibold text-[12px]">Disclaimer:</span> This is sponsored content. ArmoredMart
          assumes no responsibility for the accuracy, validity, or claims presented herein.
        </p>
      </div>
    </div>
  );
}
