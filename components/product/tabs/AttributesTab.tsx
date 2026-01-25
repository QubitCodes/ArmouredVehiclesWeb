"use client";

import ProductSpecificationsTable from "@/app/product/components/shared/ProductSpecificationsTable";
import SpecificationsTab from "./SpecificationsTab";
import FeaturesTab from "./FeaturesTab";
import VehicleFitmentTab from "./VehicleFitmentTab";

interface AttributesTabProps {
    product?: any;
}

export default function AttributesTab({ product }: AttributesTabProps) {
    if (!product) {
        return <div className="p-4 text-gray-500 italic">No attributes available.</div>;
    }

    return (
        <div className="bg-[#EBE3D6] font-sans text-black space-y-6">
            {/* Technical Details (API-driven) */}
            {product?.id != null && (
                <ProductSpecificationsTable productId={Number(product.id)} />
            )}

            {/* Item Specifics (derived from product fields) */}
            <SpecificationsTab product={product} />

            {/* Features list */}
            <FeaturesTab features={product?.features || []} />

            {/* Vehicle Fitment */}
            <VehicleFitmentTab fitment={product?.vehicle_fitment || product?.vehicleFitment || undefined} />
        </div>
    );
}
