"use client";

interface WarrantyTabProps {
    warranty?: string;
}

export default function WarrantyTab({ warranty }: WarrantyTabProps) {
    if (!warranty) {
        return <div className="p-4 text-gray-500 italic">No warranty information available.</div>;
    }

    return (
        <div className="bg-[#EBE3D6] p-6 font-sans text-black">
            <h3 className="font-orbitron font-bold text-lg mb-4 uppercase">WARRANTY</h3>
            
            <p className="text-sm font-semibold mb-6">{warranty}</p>

            <div className="flex gap-8 text-xs text-black/70 border-t border-black/10 pt-4">
                <div className="w-48 font-medium text-black/50">Magnuson-Moss Warranty Act:</div>
                <div className="flex-1 leading-relaxed">
                    Legally, a vehicle manufacturer cannot void the warranty on a vehicle due to an aftermarket part unless they can prove that the aftermarket part caused or contributed to the failure in the vehicle (per the Magnuson Moss Warranty Act (15 U.S.C. 2302(C)) 
                    <a href="#" className="text-[#FF5C00] hover:underline ml-1">Learn More</a>
                </div>
            </div>
        </div>
    );
}
