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
        <div className="my-10 font-sans max-w-3xl">
            <Typography variant="h2" className="text-xl font-bold text-black mb-4">
                Technical Details
            </Typography>

            <div className="border border-gray-300 rounded overflow-hidden">
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
                                    <div className="bg-gray-100 border-b border-gray-300 py-2.5 px-4">
                                        <Typography className="text-xs font-bold text-gray-700 uppercase tracking-wider">
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
                                                    className={`w-full py-2 px-6 bg-white ${hasBorder ? 'border-b border-gray-300' : ''}`}
                                                >
                                                    <Typography className="text-sm text-gray-800 flex items-start">
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
                                                className={`flex bg-white ${hasBorder ? 'border-b border-gray-300' : ''}`}
                                            >
                                                <div className="w-1/3 min-w-[140px] bg-[#F9F9F9] py-3 px-4 border-r border-gray-300 flex items-center">
                                                    <Typography className="text-sm font-bold text-gray-900">
                                                        {item.label}
                                                    </Typography>
                                                </div>
                                                <div className="flex-1 py-3 px-4 flex items-center">
                                                    <Typography className="text-sm text-gray-800">
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
    );
}
