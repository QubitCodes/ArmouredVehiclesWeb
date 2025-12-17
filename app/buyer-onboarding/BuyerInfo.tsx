"use client";

import Image from "next/image";
import Stepper from "./Stepper";

type Props = {
  onNext: () => void;
};

export default function BuyerInfo({ onNext }: Props) {
  return (
    
    <>

        <div className="max-w-[1200px] mx-auto bg-[#F3EDE3] p-8 shadow-sm">
    
          {/* TITLE */}
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-[20px] font-bold uppercase text-black"
              style={{ fontFamily: "Orbitron" }}
            >
              Organization / Buyer Information
            </h2>
    
            {/* collapse icon (optional) */}
            <span className="text-xl cursor-pointer">⌃</span>
          </div>
    
          {/* FORM GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 text-sm text-black">
    
            {/* Type of Buyer */}
            <div>
              <label className="font-semibold mb-1 block">Type of Buyer:</label>
              <select className="w-full border border-[#C7B88A] bg-transparent px-3 py-2 focus:outline-none">
                <option>Government Entity</option>
                <option>Private Company</option>
                <option>Defense Contractor</option>
              </select>
            </div>
    
            {/* Company Name */}
            <div>
              <label className="font-semibold mb-1 block">
                Company / Organization Name:
              </label>
              <input
                type="text"
                value="Blueweb LLC"
                className="w-full border border-[#C7B88A] bg-transparent px-3 py-2 focus:outline-none"
              />
            </div>
    
            {/* Country & City */}
            <div>
              <label className="font-semibold mb-1 block">
                Country & City of Registration:
              </label>
              <select className="w-full border border-[#C7B88A] bg-transparent px-3 py-2 focus:outline-none">
                <option>United Arab Emirates</option>
              </select>
            </div>
    
            {/* Year */}
            <div>
              <label className="font-semibold mb-1 block">
                Year of Establishment:
              </label>
              <input
                type="text"
                placeholder="Office Address / Address Line"
                className="w-full border border-[#C7B88A] bg-transparent px-3 py-2 focus:outline-none"
              />
            </div>
    
            {/* Physical Address */}
            <div>
              <label className="font-semibold mb-1 block">
                Physical Address:
              </label>
              <input
                type="text"
                placeholder="eg : Warehouse No. 12, Al Quasis Industrial Area 3, Dubai, United Arab Emirates"
                className="w-full border border-[#C7B88A] bg-transparent px-3 py-2 focus:outline-none"
              />
            </div>
    
            {/* Website */}
            <div>
              <label className="font-semibold mb-1 block">
                Website (if any):
              </label>
              <input
                type="text"
                placeholder="eg: www.blueweb2.com"
                className="w-full border border-[#C7B88A] bg-transparent px-3 py-2 focus:outline-none"
              />
            </div>
          </div>
    
          {/* UPLOAD SECTION */}
          <div className="mt-6">
            <label className="font-semibold mb-2 block text-sm">
              Govt. or Compliance Registration (MOD, EOCN, etc.):
            </label>
    
            <div className="border border-dashed border-[#C7B88A] rounded-sm py-10 text-center bg-[#EFE8DC]">
              <div className="flex flex-col items-center gap-2">
                <Image
                  src="/icons/upload.png"
                  alt="upload"
                  width={28}
                  height={28}
                />
                <p className="text-sm text-black">
                  Choose a File or Drag & Drop It Here.
                </p>
                <p className="text-xs text-gray-600">
                  JPEG, PNG, PDF, and MP4 formats, up to 10 MB.
                </p>
              </div>
            </div>
          </div>
    
          {/* NEXT BUTTON */}
          <div className="flex justify-center mt-10">
            <button
              onClick={onNext}
              className="w-[280px] h-[42px] bg-[#D35400] text-white font-black font-orbitron clip-path-supplier uppercase text-sm hover:bg-[#39482C] transition-colors"
            >
              Next
            </button>
          </div>
        </div>
    </>
  );
}
