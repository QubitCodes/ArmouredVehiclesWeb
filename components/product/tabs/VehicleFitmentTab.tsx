"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface VehicleFitmentTabProps {
    fitment?: string | string[];
}

export default function VehicleFitmentTab({ fitment }: VehicleFitmentTabProps) {
    // Parse fitment if it's a JSON string
    let parsedFitment = fitment;
    if (typeof fitment === 'string') {
        try {
            const parsed = JSON.parse(fitment);
            if (Array.isArray(parsed)) {
                parsedFitment = parsed;
            }
        } catch (e) {
            // Not JSON, keep as string
        }
    }
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        "Genesis": true,
        "Hyundai": false,
        "Kia": false
    });

    const toggle = (key: string) => {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (!parsedFitment || (Array.isArray(parsedFitment) && parsedFitment.length === 0)) {
        return (
            <div className="bg-[#EBE3D6] p-4 space-y-2 font-sans text-black">
                 <h3 className="font-orbitron font-bold text-lg mb-4 uppercase">VEHICLE FITMENT</h3>
                 <div className="p-4 text-gray-500 italic">No vehicle fitment information available.</div>
            </div>
        );
    }

    // Handle Array (New Format)
    if (Array.isArray(parsedFitment)) {
        return (
            <div className="bg-[#EBE3D6] p-4 space-y-2 font-sans text-black">
                <h3 className="font-orbitron font-bold text-lg mb-4 uppercase">VEHICLE FITMENT</h3>
                <ul className="list-disc pl-5 space-y-1 marker:text-black">
                    {parsedFitment.map((item, index) => (
                        <li key={index} className="text-sm">{item}</li>
                    ))}
                </ul>
            </div>
        );
    }

    // Handle String (Old Format / Mock)
    // Attempt to split by brand if possible, otherwise just show content
    // For now, mirroring the styling of the screenshot heavily
    
    return (
        <div className="bg-[#EBE3D6] p-4 space-y-2 font-sans text-black">
             <h3 className="font-orbitron font-bold text-lg mb-4 uppercase">VEHICLE FITMENT</h3>
             
             {/* Legacy/String Support: If string contains keys, show mock accordion, else raw */}
             {["Genesis", "Hyundai", "Kia"].some(b => (parsedFitment as string).includes(b)) ? (
                 ["Genesis", "Hyundai", "Kia"].map(brand => (
                    <div key={brand} className="border border-[#D8D0C0] bg-[#F0EBE3]">
                        <button 
                            onClick={() => toggle(brand)}
                            className="w-full flex justify-between items-center p-3 font-semibold text-sm hover:bg-[#EBE3D6] transition-colors"
                        >
                            <span>{brand}</span>
                            {openSections[brand] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        
                        {openSections[brand] && (
                            <div className="p-3 border-t border-[#D8D0C0] bg-[#EBE3D6] text-xs space-y-1">
                                <ul className="list-disc pl-5 space-y-1 marker:text-black">
                                    {brand === "Genesis" && (
                                        <>
                                            <li>2023-2025 Genesis Electrified GV70</li>
                                            <li>2021-2025 Genesis G80</li>
                                            <li>2023-2025 Genesis G90</li>
                                            <li>2023-2025 Genesis GV60</li>
                                            <li>2022-2025 Genesis GV70</li>
                                        </>
                                    )}
                                    {brand !== "Genesis" && <li>Compatible models for {brand}...</li>}
                                </ul>
                            </div>
                        )}
                    </div>
                 ))
             ) : (
                 <div className="whitespace-pre-wrap text-sm">{parsedFitment as string}</div>
             )}
        </div>
    );
}
