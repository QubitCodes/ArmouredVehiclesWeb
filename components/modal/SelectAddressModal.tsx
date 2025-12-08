"use client";
import { Edit, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SelectAddressModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const address = {
    label: "Office",
    isDefault: true,
    name: "John Martin",
    address:
      "3 - 56th St - Al Wasl - Dubai - Dubai Dubai, 3 - 56th St - Al Wasl - Dubai, Dubai, United Arab Emirates",
    phone: "+971-52-1234567",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-[#EBE3D6] w-full max-w-[950px] rounded-md border border-[#E2DACB] shadow-lg animate-fadeIn overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2DACB] flex items-center justify-between">
          <h2 className="font-orbitron font-bold text-[22px] uppercase text-black">
            Select Delivery Address
          </h2>

          {/* Country Selector Placeholder */}
          <div className="text-sm font-semibold flex text-black items-center gap-2">
            <span className="text-[#006A4E]">🇦🇪</span> Ship to UAE ▼
          </div>
        </div>

        {/* Address card */}
        <div className="p-6 border-b border-[#C2B280] bg-white">

          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center text-black gap-2 mb-2">
                <span className="font-bold">{address.label}</span>
                {address.isDefault && (
                  <span className="text-[10px] bg-[#FF8A00] text-black px-2 py-[2px] rounded-md">
                    Default
                  </span>
                )}
              </div>

              <p className="text-[13px] text-black">
                <span className="font-semibold">Name: </span>{address.name}
              </p>
              <p className="text-[13px] text-black">
                <span className="font-semibold">Address: </span>{address.address}
              </p>
              <p className="text-[13px] text-black">
                <span className="font-semibold">Phone: </span>{address.phone}
              </p>
            </div>

            <button className="text-sm flex items-center gap-1 text-[#515151] hover:text-black">
              <Edit size={15} /> Edit
            </button>
          </div>

        </div>

        {/* Add new address */}
        <button className="px-6 py-4 text-sm text-[#444] flex items-center gap-2 hover:bg-gray-50 w-full text-left">
          <Plus size={16} /> Add New Address
        </button>

        {/* Footer Buttons */}
        <div className="p-6 flex justify-end gap-4">

          <button
            className="
              bg-[#C8C0A8] text-black font-semibold text-[14px] px-10 py-2 relative
              clip-path-[polygon(7%_0%,100%_0%,93%_100%,0%_100%)]
            "
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="
              bg-[#D34D24] text-white font-orbitron font-bold text-[14px] uppercase px-10 py-2 relative
              clip-path-[polygon(7%_0%,100%_0%,93%_100%,0%_100%)]
            "
            onClick={() => {
              onClose();
              router.push("/checkout");
            }}
          >
            Confirm
          </button>

        </div>
      </div>
    </div>
  );
}
