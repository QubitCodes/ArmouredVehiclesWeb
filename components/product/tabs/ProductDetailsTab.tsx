"use client";

import { Info, PlayCircle, Image as ImageIcon, Users, CheckCircle, ShieldCheck } from "lucide-react";

interface ProductDetailsTabProps {
    product?: any;
}

export default function ProductDetailsTab({ product }: ProductDetailsTabProps) {
    return (
        <div className="bg-[#EBE3D6] p-6 font-sans text-black">
            <h3 className="font-orbitron font-bold text-lg mb-4 uppercase">PRODUCT DETAILS</h3>
            
            <div className="text-xs md:text-sm leading-relaxed mb-8 space-y-4">
                 <p>{product?.description || "No product details available."}</p>
                 
                 {product?.country_of_origin && <p><strong>Country of Origin:</strong> {product.country_of_origin}</p>}
                 {product?.condition && <p><strong>Condition:</strong> {product.condition}</p>}
                 {product?.certifications && <p><strong>Certifications:</strong> {product.certifications}</p>}
            </div>

            {/* Action Buttons Row */}
            {/* <div className="flex flex-wrap gap-3 mb-8">
                <ActionButton label="Information" icon={<Info size={14} className="text-[#FF5C00]" />} />
                <ActionButton label="Features" icon={<CheckCircle size={14} className="text-[#3D4A26]" />} />
                <ActionButton label="Authorized Dealer" icon={<ShieldCheck size={14} className="text-[#1890FF]" />} />
                <ActionButton label="Video" icon={<PlayCircle size={14} className="text-[#FF4D4F]" />} />
                <ActionButton label="Gallery" icon={<ImageIcon size={14} className="text-[#13C2C2]" />} />
                <ActionButton label="About Us" icon={<Users size={14} className="text-[#FA8C16]" />} />
            </div> */}

            {/* Warning Section */}
            {/* <div className="mb-4">
                 <p className="font-bold text-xs mb-1">UAL Residents</p>
                 <div className="flex items-start gap-2 text-[10px] text-gray-700">
                     <span className="text-[#FAAD14] text-sm">⚠️</span>
                     <p className="text-sm">
                        WARNING: Cancer and Reproductive Harm. 
                     </p>
                 </div>
            </div> */}

            <div className="grid grid-cols-2 max-w-sm gap-y-1 text-sm text-gray-500 mt-6">
                <div>Part Number:</div>
                <div className="text-black font-medium">{product?.identifiers?.partNumber ?? product?.sku ?? "N/A"}</div>
                
                <div>Make/Model:</div>
                <div className="text-black font-medium">{product?.make} {product?.model} {product?.year ? `(${product.year})` : ''}</div>
{/*                 
                <div>MPN:</div>
                <div className="text-black font-medium">{product?.sku ?? "N/A"}</div> */}
            </div>
        </div>
    );
}

function ActionButton({ label, icon }: { label: string; icon: React.ReactNode }) {
    return (
        <button className="flex items-center gap-2 px-3 py-1.5 bg-[#F6F1E9] border border-[#D8D0C0] rounded shadow-sm hover:shadow active:scale-95 transition text-xs font-bold text-black">
            {label}
            {icon}
        </button>
    );
}
