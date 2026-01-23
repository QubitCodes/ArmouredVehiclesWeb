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
                 <h3 className="font-orbitron font-bold text-lg mb-4 uppercase">Key Attributes</h3>
                 <div className="p-4 text-gray-500 italic">No Key Attributes information available.</div>
            </div>
        );
    }

    // Handle Array (New Format) - Two Column Table Design
    if (Array.isArray(parsedFitment)) {
        // Mock data structure - replace with actual API data
        // Expected format: { label: string, value: string }[]
        const mockTableData = parsedFitment.map((item, idx) => ({
            label: `Attribute ${idx + 1}`,
            value: item
        }));

        return (
            <div className="bg-[#EBE3D6] p-6 font-sans">
                <h3 className="font-orbitron text-lg font-bold text-black mb-4 uppercase tracking-wider">
                    Key Attributes
                </h3>

                <div className="border border-[#D8D0C0] rounded overflow-hidden">
                    <div className="bg-[#F6F1E9]">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {mockTableData.map((item, idx) => {
                                const isRightCol = idx % 2 === 1;
                                return (
                                    <div
                                        key={idx}
                                        className={`flex border-b border-[#D8D0C0] ${isRightCol ? '' : 'md:border-r md:border-[#D8D0C0]'}`}
                                    >
                                        <div className="w-1/3 min-w-40 bg-[#EBE3D6] py-3 px-4 border-r border-[#D8D0C0] flex items-center">
                                            <span className="text-sm font-bold text-black">
                                                {item.label}
                                            </span>
                                        </div>
                                        <div className="flex-1 py-3 px-4 flex items-center">
                                            <span className="text-sm text-black">
                                                {item.value}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Handle String (Old Format / Mock)
    // Attempt to split by brand if possible, otherwise just show content
    // For now, mirroring the styling of the screenshot heavily
    
    return (
        <div className="bg-[#EBE3D6] p-4 space-y-2 font-sans text-black">
             <h3 className="font-orbitron font-bold text-lg mb-4 uppercase">Key Attributes</h3>
             
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
