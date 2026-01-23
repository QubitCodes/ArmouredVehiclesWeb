"use client";

interface DescriptionTabProps {
    product?: any;
}

export default function DescriptionTab({ product }: DescriptionTabProps) {
    const description = product?.description;

    return (
        <div className="bg-[#EBE3D6] p-6 font-sans text-black">
            <h3 className="font-orbitron font-bold text-lg mb-4 uppercase">DESCRIPTION</h3>
            <div className="text-xs md:text-sm leading-relaxed space-y-4">
                {description ? (
                    <p>{description}</p>
                ) : (
                    <div className="p-4 text-gray-500 italic">No description available.</div>
                )}
            </div>
        </div>
    );
}
