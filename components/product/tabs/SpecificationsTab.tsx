"use client";

interface SpecificationsTabProps {
    product?: any;
}


const parseArrayField = (value: any): any[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {
            return value.split(',').map(s => s.trim()); // Fallback for comma-separated strings
        }
    }
    return [];
};

export default function SpecificationsTab({ product }: SpecificationsTabProps) {
    if (!product) {
        return <div className="p-4 text-gray-500 italic">No specifications available.</div>;
    }

    // Dynamic Specs Mapping
    const specs = [];

    if (product.sku) specs.push({ label: "SKU", value: product.sku });
    
    // Dimensions
    if (product.dimension_length || product.dimension_width || product.dimension_height) {
        const dims = [
            product.dimension_length,
            product.dimension_width,
            product.dimension_height
        ].filter(Boolean).join(" x ");
        if (dims) specs.push({ label: "Dimensions (L x W x H)", value: `${dims} ${product.dimension_unit || ''}` });
    }

    // Weight
    if (product.weight_value) {
        specs.push({ label: "Weight", value: `${product.weight_value} ${product.weight_unit || ''}` });
    }

    // Materials
    const materials = parseArrayField(product.materials);
    if (materials.length > 0) {
        specs.push({ label: "Material", value: materials.join(", ") });
    }

    // Colors
    const colors = parseArrayField(product.colors);
    if (colors.length > 0) {
        specs.push({ label: "Colors", value: colors.join(", ") });
    }

    // Sizes
    const sizes = parseArrayField(product.sizes);
    if (sizes.length > 0) {
        specs.push({ label: "Available Sizes", value: sizes.join(", ") });
    }

     // Drive Types
    const driveTypes = parseArrayField(product.drive_types);
    if (driveTypes.length > 0) {
        specs.push({ label: "Drive Types", value: driveTypes.join(", ") });
    }

    // Custom Specs from specifications array/string
    if (product.specifications) {
         const specifications = parseArrayField(product.specifications);
         if (specifications.length > 0) {
             specifications.forEach((s: string) => {
                 // Try to split "Key: Value"
                 const parts = s.split(':');
                 if (parts.length > 1) {
                     specs.push({ label: parts[0].trim(), value: parts.slice(1).join(':').trim() });
                 } else {
                     specs.push({ label: "Spec", value: s });
                 }
             });
         }
    }
    
    // Technical Description (if short enough to be a spec, else it might be in details)
    // Let's add specific fields if they exist
    if (product.technical_description) specs.push({ label: "Technical Desc", value: product.technical_description });


    if (specs.length === 0) {
         return <div className="bg-[#EBE3D6] p-6 font-sans text-black italic">No specific specifications listed.</div>;
    }

    return (
        <div className="bg-[#EBE3D6] p-6 font-sans text-black">
            <h3 className="font-orbitron font-bold text-lg mb-6 uppercase">ITEM SPECIFICS</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
                {specs.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start text-xs border-b border-[#D8D0C0] pb-1 last:border-0 border-opacity-50">
                        <span className="text-gray-500 font-medium">{item.label}</span>
                        <span className="font-bold text-black text-right">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

