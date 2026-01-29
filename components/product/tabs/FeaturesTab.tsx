"use client";

interface FeaturesTabProps {
    features?: string[];
}

export default function FeaturesTab({ features = [] }: FeaturesTabProps) {
    return (
        <div className=" p-6 font-sans text-black">
            <h3 className="font-orbitron font-bold text-lg mb-4 uppercase">FEATURES</h3>

            {(!features || features.length === 0) ? (
                <div className="p-4 text-gray-500 italic">No features listed.</div>
            ) : (
                <ul className="space-y-2">
                    {features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm md:text-sm leading-relaxed group">
                            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-[5px] shrink-0">
                                <path d="M6 5L0 10V0L6 5Z" fill="black"/>
                            </svg>
                            <span className="text-black font-medium">{f}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
