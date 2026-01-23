"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Typography } from "@/components/ui/Typography";

type Specification = {
    id: string;
    product_id: number;
    label?: string;
    value?: string;
    type: 'general' | 'title_only' | 'value_only';
    active: boolean;
    sort: number;
};

export default function ProductSpecificationsTable({ productId }: { productId: number }) {
    const [specs, setSpecs] = useState<Specification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!productId) return;
        api.products.getSpecifications(productId)
            .then(data => {
                const active = Array.isArray(data)
                    ? data.filter((s: any) => s.active).sort((a: any, b: any) => a.sort - b.sort)
                    : [];
                setSpecs(active);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [productId]);

    if (loading || specs.length === 0) return null;

    return (
        <div className="my-6 font-sans max-w-4xl">
            <div className="bg-[#EBE3D6] p-6">
                <Typography variant="h2" className="font-orbitron text-lg font-bold text-black mb-4 uppercase tracking-wider">
                    Technical Details
                </Typography>

                <div className="border border-[#D8D0C0] rounded overflow-hidden">
                    <div className="flex flex-col">
                    {(() => {
                        const sections: { title: Specification; items: Specification[] }[] = [];
                        let current: { title: Specification; items: Specification[] } | null = null;

                        specs.forEach(spec => {
                            if (spec.type === 'title_only') {
                                current = { title: spec, items: [] };
                                sections.push(current);
                            } else if (current) {
                                current.items.push(spec);
                            } else {
                                // Fallback for data that might not follow the rule yet
                                current = {
                                    title: { id: 'fallback', label: 'Technical Details', type: 'title_only' } as any,
                                    items: [spec]
                                };
                                sections.push(current);
                            }
                        });

                        return sections.map((section, sIdx) => {
                            const isAllValueOnly = section.items.length > 0 && section.items.every(item => item.type === 'value_only');
                            const isLastSection = sIdx === sections.length - 1;

                            return (
                                <div key={section.title.id} className="flex flex-col">
                                    {/* Section Header */}
                                    <div className="bg-[#F0EBE3] border-b border-[#D8D0C0] py-2.5 px-4">
                                        <Typography className="text-xs font-bold text-black uppercase tracking-wider font-orbitron">
                                            {section.title.label}
                                        </Typography>
                                    </div>

                                    {/* Section Items */}
                                    {section.items.map((item, iIdx) => {
                                        const isLastInGroup = iIdx === section.items.length - 1;
                                        // No borders between value_only items in the same group
                                        const hasBorder = isAllValueOnly
                                            ? (isLastInGroup && !isLastSection)
                                            : !isLastInGroup || !isLastSection;

                                        if (item.type === 'value_only') {
                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`w-full py-2 px-6 bg-[#F6F1E9] ${hasBorder ? 'border-b border-[#D8D0C0]' : ''}`}
                                                >
                                                    <Typography className="text-sm text-black flex items-start">
                                                        <span className="mr-2 text-primary mt-1 text-[8px]">●</span>
                                                        {item.value}
                                                    </Typography>
                                                </div>
                                            );
                                        }

                                        // General (Key-Value)
                                        return (
                                            <div
                                                key={item.id}
                                                className={`flex bg-[#F6F1E9] ${hasBorder ? 'border-b border-[#D8D0C0]' : ''}`}
                                            >
                                                <div className="w-1/3 min-w-40 bg-[#EBE3D6] py-3 px-4 border-r border-[#D8D0C0] flex items-center">
                                                    <Typography className="text-sm font-bold text-black">
                                                        {item.label}
                                                    </Typography>
                                                </div>
                                                <div className="flex-1 py-3 px-4 flex items-center">
                                                    <Typography className="text-sm text-black">
                                                        {item.value}
                                                    </Typography>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        });
                    })()}
                    </div>
                </div>
            </div>
        </div>
    );
}
