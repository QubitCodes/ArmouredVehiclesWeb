'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Container } from '@/components/ui';
import { ChevronRight, ExternalLink, Grid3x3, List, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import SponsoredAd from '@/components/sponsored/SponsoredAd';
import Link from 'next/link';
import SeoText from '@/components/footer/SeoText';
import { TopSellingProducts } from '@/components/home';
import DescriptionSection from '@/components/all-products/DescriptionSection';

interface Product {
    id: string;
    name: string;
    price: number;
    rating: number;
    reviews: number;
    image: string[];
    action: 'ADD TO CART' | 'SUBMIT AN INQUIRY';
}

export default function ProductListingPage() {
    const [products] = useState<Product[]>([
        {
            id: '1',
            name: 'DFC® - 4000 HybriDynamic Hybrid Rear Brake Pads',
            price: 679,
            rating: 4.6,
            reviews: 4.5,
            image: ['/product/image.jpeg', '/product/image.jpeg'],
            action: 'ADD TO CART',
        },
        {
            id: '3',
            name: 'DFC® - 4000 HybriDynamic Hybrid Rear Brake Pads',
            price: 679,
            rating: 4.6,
            reviews: 4.5,
            image: ['/product/Group 853.jpg', '/product/image.jpeg', '/product/rim1.png', '/product/image.png'],
            action: 'ADD TO CART',
        },
        {
            id: '2',
            name: 'DFC® - 4000 HybriDynamic Hybrid Rear Brake Pads',
            price: 16769,
            rating: 4.6,
            reviews: 4.5,
            image: ['/product/rim1.png', '/product/rim1.png'],
            action: 'SUBMIT AN INQUIRY',
        },
    ]);

    // Filter states
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState({ min: 9, max: 10850 });
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [openFilters, setOpenFilters] = useState({
        brand: true,
        price: true,
        type: true,
        department: true,
    });

    const brands = [
        { name: 'Brembo', count: 7 },
        { name: 'EBC Brakes', count: 12975 },
        { name: 'PowerStop', count: 18200 },
        { name: 'R1 Concepts', count: 39935 },
    ];

    const productTypes = [
        { name: 'Brake Rotors', image: '/filter/Rectangle 260.svg' },
        { name: 'Disc Brake Pads', image: '/filter/Rectangle 260.svg' },
        { name: 'Brake Hardware', image: '/filter/Rectangle 260.svg' },
        { name: 'Brake Fluids & Lubricants', image: '/filter/Rectangle 260.svg' },
    ];

    const departments = [
        {
            name: 'Performance',
            desc: 'High-performance upgrades for maximum power',
        },
        {
            name: 'Replacement',
            desc: 'OEM-quality replacement components',
        },
    ];

    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const toggleDepartment = (dep: string) => {
        setSelectedDepartments(prev =>
            prev.includes(dep) ? prev.filter(d => d !== dep) : [...prev, dep]
        );
    };
    const toggleFilter = (key: string) => {
    setOpenFilters(prev => ({ 
        ...prev, 
        [key]: !(prev as any)[key] 
    }));
};

    return (
        <section className='bg-[#F0EBE3] relative px-4'>
            {/* ---------------- BREADCRUMB BAR ---------------- */}
            {/* <div className="bg-[#E8E3D6] border-b border-[#D8D3C5]">
                
            </div> */}

            {/* ---------------- TITLE SECTION ---------------- */}
            <Container>

                <div className="pt-3">
                    <div className="flex items-center gap-2 text-xs py-3 text-[#737373]">
                        <span className="font-[Inter, sans-serif] font-semibold text-[12px] leading-[100%] tracking-[0%] uppercase cursor-pointer">
                            AUTO PARTS
                        </span>
                        <span className="font-[Inter, sans-serif] font-semibold text-[12px] leading-[100%] tracking-[0%] uppercase ">
                            /
                        </span>
                        <span className="font-[Inter, sans-serif] font-semibold text-[12px] leading-[100%] tracking-[0%] uppercase cursor-pointer">
                            BRAKES
                        </span>
                        <span className="font-[Inter, sans-serif] font-semibold text-[12px] leading-[100%] tracking-[0%] uppercase">
                            /
                        </span>
                        <span className="font-[Inter, sans-serif] font-medium text-[12px] leading-[100%] tracking-[0%] uppercase">
                            PERFORMANCE BRAKE KITS
                        </span>
                    </div>
                    <h1 className="text-3xl font-[Orbitron] sm:text-4xl font-bold uppercase tracking-wide text-black">
                        PERFORMANCE BRAKES
                    </h1>
                </div>
            </Container>

            <Container>
                <div className="flex flex-col lg:flex-row gap-8 py-5">
                    {/* ---------------- FILTER SIDEBAR ---------------- */}
                    <aside className="w-full lg:w-1/4 bg-[#F0EBE3] rounded-md lg:sticky lg:top-4 lg:self-start">
                        <div className="p-5 space-y-8 max-h-[calc(100vh-8rem)] overflow-y-auto filter-scrollbar">
                            {/* BRAND FILTER */}
                            <div>
                                {/* Heading */}
                                <div
                                    className="flex justify-between items-center cursor-pointer text-black"
                                    onClick={() => toggleFilter("brand")}
                                >
                                    <h3 className="text-sm font-bold font-[Orbitron] uppercase text-black mb-3">
                                        Brand
                                    </h3>

                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-300 ${openFilters.brand ? "rotate-180" : ""
                                            }`}
                                    />
                                </div>

                                {/* Content */}
                                {openFilters.brand && (
                                    <div className="space-y-2">
                                        {brands.map(b => (
                                            <label
                                                key={b.name}
                                                className="flex items-center justify-between text-black cursor-pointer text-sm"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedBrands.includes(b.name)}
                                                        onChange={() => toggleBrand(b.name)}
                                                        className="w-4 h-4 border border-gray-400 rounded-sm accent-[#D35400]"
                                                    />
                                                    <span>{b.name} ({b.count})</span>
                                                </div>
                                            </label>
                                        ))}

                                        <p className="text-[#D35400] text-sm font-medium cursor-pointer">
                                            Show More
                                        </p>
                                    </div>
                                )}
                            </div>


                            {/* PRICE FILTER */}
                            <div>
                                <div
                                    className="flex justify-between items-center cursor-pointer text-black"
                                    onClick={() => toggleFilter("price")}
                                >
                                    <h3 className="text-sm font-bold font-[Orbitron] uppercase text-black mb-3">
                                        Price
                                    </h3>

                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-300 ${openFilters.price ? "rotate-180" : ""
                                            }`}
                                    />
                                </div>

                                {openFilters.price && (
                                    <div className="space-y-2 text-sm">
                                        {/* Min */}
                                        <div>
                                            <p className="text-[13px] mb-1 text-gray-700">Minimum</p>
                                            <div className="flex items-center border border-[#D8D3C5] bg-[#EBE3D6] rounded-sm px-2 py-1">
                                                <span className="mr-2 text-gray-700">฿</span>
                                                <input
                                                    type="number"
                                                    value={priceRange.min}
                                                    onChange={e =>
                                                        setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))
                                                    }
                                                    className="w-full outline-none text-gray-700 bg-[#EBE3D6]"
                                                />
                                            </div>
                                        </div>

                                        {/* Max */}
                                        <div>
                                            <p className="text-[13px] mb-1 text-gray-700">Maximum</p>
                                            <div className="flex items-center border border-[#D8D3C5] bg-[#EBE3D6] rounded-sm px-2 py-1">
                                                <span className="mr-2 text-gray-700">฿</span>
                                                <input
                                                    type="number"
                                                    value={priceRange.max}
                                                    onChange={e =>
                                                        setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))
                                                    }
                                                    className="w-full outline-none text-gray-700 bg-[#EBE3D6]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>


                            {/* PRODUCT TYPE FILTER */}
                            <div>
                                <div
                                    className="flex justify-between items-center cursor-pointer text-black"
                                    onClick={() => toggleFilter("type")}
                                >
                                    <h3 className="text-sm font-bold font-[Orbitron] uppercase text-black mb-3">
                                        Select Product Type
                                    </h3>

                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-300 ${openFilters.type ? "rotate-180" : ""
                                            }`}
                                    />
                                </div>

                                {openFilters.type && (
                                    <div className="space-y-2">
                                        {productTypes.map(type => (
                                            <div
                                                key={type.name}
                                                className="flex items-center justify-between border border-[#D8D3C5] bg-[#EBE3D6] p-3 cursor-pointer hover:bg-[#F9F7F2] transition"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="bg-white rounded-md w-20 h-12 flex items-center justify-center shadow-sm">
                                                        <Image
                                                            src={type.image}
                                                            alt={type.name}
                                                            width={40}
                                                            height={40}
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                    <p className="text-[14px]">{type.name}</p>
                                                </div>

                                                <ChevronRight size={16} className="text-gray-500" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>


                            {/* DEPARTMENT FILTER */}
                            <div>
                                <div
                                    className="flex justify-between items-center cursor-pointer text-black"
                                    onClick={() => toggleFilter("department")}
                                >
                                    <h3 className="text-sm font-bold uppercase font-[Orbitron] text-black mb-3">
                                        Select Department
                                    </h3>

                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-300 ${openFilters.department ? "rotate-180" : ""
                                            }`}
                                    />
                                </div>

                                {openFilters.department && (
                                    <div className="space-y-3">
                                        {departments.map(dep => (
                                            <label key={dep.name} className="flex items-start space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedDepartments.includes(dep.name)}
                                                    onChange={() => toggleDepartment(dep.name)}
                                                    className="mt-1 w-4 h-4 border border-gray-400 rounded-sm accent-[#D35400]"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{dep.name}</p>
                                                    <p className="text-xs text-gray-500">{dep.desc}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                        {/* Sponsored Ad Section */}

                        <div className="mt-6">
                            <SponsoredAd />
                        </div>
                    </aside>


                    {/* ---------------- PRODUCT LISTING ---------------- */}
                    <main className="flex-1">
                        {/* Top bar: Sort By + Icons */}
                        <div className="flex justify-between items-center mb-6">

                            {/* Result Count */}
                            <p className="text-black text-[16px] font-semibold font-[Inter, sans-serif]">
                                <span>{products.length}</span> Results
                            </p>

                            <div className="flex items-center gap-4">

                                {/* Sort By */}
                                <div className="relative">
                                    <select
                                        className="border border-[#D8D3C5] px-3 py-2 text-sm bg-[#F0EBE3] text-black cursor-pointer appearance-none pr-8"
                                    >
                                        <option value="">Sort By</option>
                                        <option value="lth">Price: Low to High</option>
                                        <option value="htl">Price: High to Low</option>
                                        <option value="rating">Rating</option>
                                    </select>

                                    {/* Down Arrow Icon */}
                                    <ChevronDown
                                        size={16}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none"
                                    />
                                </div>

                                {/* View Icons */}
                                {/* <div className="flex items-center gap-3">

                                    <List
                                        size={22}
                                        onClick={() => setViewMode("list")}
                                        className={`cursor-pointer ${viewMode === "list" ? "text-[#D35400]" : "text-gray-700"
                                            }`}
                                    />
                                    <Grid3x3
                                        size={22}
                                        onClick={() => setViewMode("grid")}
                                        className={`cursor-pointer ${viewMode === "grid" ? "text-[#D35400]" : "text-gray-700"
                                            }`}
                                    />
                                </div> */}

                            </div>
                        </div>



                        <div className="grid grid-cols-1 w-full sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {products.map(product => (
                                // <Link key={product.id} href={`/product-details`} className="block">
                                <ProductCard
                                    key={product.id}
                                    images={product.image}
                                    name={product.name}
                                    rating={product.rating}
                                    reviews={`${product.reviews}k`}
                                    price={product.price}
                                    delivery="Standard Delivery by tomorrow"
                                    action={product.action}
                                />
                                // </Link>
                            ))}
                        </div>
                    </main>
                </div>
                <TopSellingProducts title={"Recommended For You"} />
                <DescriptionSection />
            </Container>
            <section className="w-full bg-[#31332C] text-white py-10">
                <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-[140px]">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 2xl:mt-[120px] xl:mt-[100px] mb-16">
                        {[
                            {
                                icon: "/icons/complaince.svg",
                                title: "COMPLIANCE BUILT IN",
                                text: "Global standards. Automatic protection.",
                            },
                            {
                                icon: "/icons/secure.svg",
                                title: "SECURE COMMERCE PLATFORM",
                                text: "Every transaction, fully encrypted.",
                            },
                            {
                                icon: "/icons/verified.svg",
                                title: "VERIFIED SELLERS & BUYERS",
                                text: "Only trusted partners allowed.",
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 p-4"
                            >
                                <div
                                    className="relative bg-white/10 p-5"
                                    style={{
                                        width: 70,
                                        height: 70,
                                    }}
                                >
                                    <Image
                                        src={item.icon}
                                        alt={item.title}
                                        width={40}
                                        height={40}
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <h4
                                        className="mb-1"
                                        style={{
                                            fontFamily: "Orbitron",
                                            fontWeight: 700,
                                            fontStyle: "normal",
                                            fontSize: "16px",
                                            lineHeight: "100%",
                                            letterSpacing: "0%",
                                            textTransform: "uppercase"
                                        }}
                                    >
                                        {item.title}
                                    </h4>
                                    <p
                                        className="text-gray-300"
                                        style={{
                                            fontFamily: "Inter, sans-serif",
                                            fontWeight: 400,
                                            fontStyle: "normal",
                                            fontSize: "14px",
                                            lineHeight: "100%",
                                            letterSpacing: "0%",
                                        }}
                                    >
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="w-full h-px bg-gray-700 mb-10"></div>


                    {/* Text Section (shared) */}
                    <SeoText />
                </div>
            </section>
        </section>
    );
}
