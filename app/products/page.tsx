'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useEffect, Suspense } from 'react';
import { Container } from '@/components/ui';
import { ChevronRight, ExternalLink, Grid3x3, List, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import SponsoredAd from '@/components/sponsored/SponsoredAd';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SeoText from '@/components/footer/SeoText';
import { TopSellingProducts } from '@/components/home';
import DescriptionSection from '@/components/all-products/DescriptionSection';
import { searchProducts } from '@/app/services/auth';


interface Product {
    id: string;
    name: string;
    price: number;
    rating: number;
    reviews: number;
    image: string[];
    action: 'ADD TO CART' | 'SUBMIT AN INQUIRY';
}

function CategoryContent() {
    const searchParams = useSearchParams();
    const categoryIdParam = searchParams.get('categoryId') || searchParams.get('category_id');
    const categoryNameParam = searchParams.get('name');
    const searchQueryParam = searchParams.get('search') || searchParams.get('q');

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params: any = { need_filters: true };
                if (categoryIdParam && !isNaN(Number(categoryIdParam))) {
                    params.category_id = Number(categoryIdParam);
                }
                if (searchQueryParam && searchQueryParam.trim()) {
                    params.search = searchQueryParam.trim();
                }

                const response = await searchProducts(params);
                const payload: any = response?.data;
                const data = Array.isArray(payload) ? payload : payload?.data ?? [];

                const mapped: Product[] = Array.isArray(data)
                    ? data.map((item: any) => {
                        const priceNum = Number(item.price);
                        const normalizedPrice = Number.isFinite(priceNum) && priceNum > 0 ? priceNum : 0;
                        const images: string[] = Array.isArray(item.media) && item.media.length
                            ? item.media
                                .filter((m: any) => !!m?.url)
                                .sort((a: any, b: any) => (b?.is_cover === true ? 1 : 0) - (a?.is_cover === true ? 1 : 0))
                                .map((m: any) => String(m.url))
                                .map((m: any) => String(m.url))
                            : ["/placeholder.svg"];
                        const ratingNum = typeof item.rating === 'number' ? item.rating : Number(item.rating) || 0;
                        const reviewCount = typeof item.review_count === 'number' ? item.review_count : Number(item.review_count) || 0;

                        return {
                            id: String(item.id),
                            name: item.name || 'Unknown Product',
                            price: normalizedPrice,
                            rating: ratingNum,
                            reviews: reviewCount,
                            image: images,
                            action: normalizedPrice > 0 ? 'ADD TO CART' : 'SUBMIT AN INQUIRY',
                        } as Product;
                    })
                    : [];

                setProducts(mapped);
                // Set dynamic filters if available
                const filtersFromApi = payload?.misc?.filters;
                if (filtersFromApi) {
                    setFilterOptions(filtersFromApi);
                    if (filtersFromApi.price && filtersFromApi.price.min != null && filtersFromApi.price.max != null) {
                        const min = Number(filtersFromApi.price.min);
                        const max = Number(filtersFromApi.price.max);
                        if (Number.isFinite(min) && Number.isFinite(max)) {
                            setPriceRange({ min, max });
                        }
                    }
                } else {
                    setFilterOptions(null);
                }
                setError(null);
            } catch (err) {
                console.error("Failed to load products", err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [categoryIdParam, searchQueryParam]);


    // Filter states
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState({ min: 9, max: 10850 });
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    // filters state
    const [filterOptions, setFilterOptions] = useState<any>(null);

    const [showFilters, setShowFilters] = useState(false);
    const [openFilters, setOpenFilters] = useState({
        categories: true,
        brand: true,
        price: true,
        type: true,
        department: true,
    });

    const brands = filterOptions?.brands ?? [];

    const productTypes: any[] = [];

    const departments: any[] = [];

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

    // Filters now come via products endpoint when need_filters is true


    return (
        <section className='bg-[#F0EBE3] relative px-4'>
            {/* ---------------- BREADCRUMB BAR ---------------- */}
            {/* <div className="bg-[#E8E3D6] border-b border-[#D8D3C5]">
                
            </div> */}

            {/* ---------------- TITLE SECTION ---------------- */}
            <Container>

                <div className="pt-5">
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

                    {/* Title */}
                    <h1 className="text-xl md:text-3xl font-[Orbitron] lg:text-4xl font-bold uppercase tracking-wide text-black mb-4">
                        {(categoryNameParam || 'Categories').toUpperCase()}
                    </h1>

                    {/* Results Count and Sort By - Mobile View */}
                    {/* <div className="flex justify-between items-center mb-4">
                        <div className="flex-1 border border-gray-300 bg-[#F0EBE3] px-4 py-3">
                            <p className="text-black text-sm font-[Inter, sans-serif]">
                                <span className="font-semibold">{products.length}</span> Results for <span className="font-normal">{categoryNameParam || 'All Products'}</span>
                            </p>
                        </div>
                        <button className="ml-2 p-3 border border-gray-300 bg-[#F0EBE3]">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_199_3457)">
                                    <path d="M13.3083 3.26234C11.3392 3.26234 9.37004 3.26234 7.40926 3.26234C6.90863 3.26234 6.65832 3.00368 6.68335 2.54477C6.70004 2.21102 6.91698 1.98574 7.25073 1.94402C7.35085 1.93568 7.45932 1.93568 7.55944 1.93568C11.4143 1.93568 15.2607 1.93568 19.1156 1.93568C19.2157 1.93568 19.3242 1.92734 19.4243 1.94402C19.7664 1.98574 19.9917 2.23606 19.9917 2.57815C20 2.92024 19.758 3.21228 19.4243 3.25399C19.3075 3.27068 19.199 3.26234 19.0822 3.26234C17.1548 3.26234 15.2274 3.26234 13.3083 3.26234Z" fill="#737373"/>
                                    <path d="M13.3075 10.8711C11.3467 10.8711 9.39423 10.8711 7.43345 10.8711C6.89944 10.8711 6.63244 10.5958 6.67416 10.1119C6.69919 9.80313 6.89944 9.59454 7.20816 9.55282C7.33332 9.53613 7.45848 9.53613 7.58363 9.53613C11.4134 9.53613 15.2432 9.53613 19.073 9.53613C19.1648 9.53613 19.2566 9.53613 19.3567 9.54448C19.7488 9.57785 19.9825 9.80313 19.9908 10.1786C19.9992 10.5374 19.7405 10.8294 19.365 10.8711C19.2649 10.8795 19.1564 10.8795 19.0563 10.8795C17.1372 10.8711 15.2265 10.8711 13.3075 10.8711Z" fill="#737373"/>
                                    <path d="M13.3411 17.1293C15.3102 17.1293 17.2794 17.1293 19.2401 17.1293C19.8075 17.1293 20.1246 17.5465 19.941 18.0221C19.8492 18.2641 19.674 18.4142 19.407 18.4476C19.2819 18.4643 19.1567 18.4643 19.0315 18.4643C15.2184 18.4643 11.4137 18.4643 7.60059 18.4643C7.47543 18.4643 7.35027 18.4643 7.22512 18.4476C6.88302 18.4059 6.68277 18.189 6.66608 17.8469C6.6494 17.4714 6.83296 17.2127 7.1834 17.146C7.30855 17.121 7.43371 17.1293 7.55887 17.1293C9.49462 17.121 11.4137 17.121 13.3411 17.1293Z" fill="#737373"/>
                                    <path d="M-0.00019791 17.5712C-0.00019791 17.204 -0.00854167 16.8452 -0.00019791 16.4781C0.00814585 15.7522 0.525459 15.2099 1.25137 15.1932C1.98562 15.1765 2.72821 15.1765 3.46246 15.1932C4.18837 15.2099 4.71403 15.7355 4.73072 16.4698C4.7474 17.2624 4.7474 18.0467 4.73072 18.8394C4.72237 19.4485 4.20506 19.9658 3.58762 19.9825C2.79496 19.9992 2.01065 20.0075 1.21799 19.9825C0.508772 19.9575 0.00814585 19.4068 -0.00019791 18.6976C-0.00019791 18.3221 -0.00019791 17.9466 -0.00019791 17.5712ZM3.44578 16.5198C2.70318 16.5198 2.00231 16.5198 1.31812 16.5198C1.31812 17.2791 1.31812 17.9883 1.31812 18.6809C2.05237 18.6809 2.7449 18.6809 3.44578 18.6809C3.44578 17.9216 3.44578 17.2124 3.44578 16.5198Z" fill="#737373"/>
                                    <path d="M0.0662083 2.33559C0.0662083 1.96012 0.0662083 1.58465 0.0662083 1.20918C0.0662083 0.524995 0.550147 0.0160252 1.23434 0.00768142C1.97693 -0.0090061 2.71118 -0.00066234 3.45378 0.00768142C4.163 0.0160252 4.70534 0.516651 4.73037 1.23421C4.7554 2.04356 4.7554 2.86125 4.73872 3.67059C4.72203 4.28803 4.19637 4.78866 3.54556 4.80535C2.81131 4.82203 2.06871 4.82203 1.32612 4.80535C0.600209 4.78866 0.0828959 4.24631 0.0662083 3.52041C0.0578646 3.12825 0.0662083 2.72775 0.0662083 2.33559ZM3.42875 3.52875C3.42875 2.7194 3.42875 2.00184 3.42875 1.326C2.69449 1.326 1.99362 1.326 1.31777 1.326C1.31777 2.04356 1.31777 2.70272 1.32612 3.37022C1.32612 3.42862 1.4179 3.52041 1.45962 3.52041C2.11877 3.52875 2.77793 3.52875 3.42875 3.52875Z" fill="#737373"/>
                                    <path d="M2.42014 12.3898C2.04468 12.3898 1.66921 12.3982 1.29374 12.3898C0.601204 12.3565 0.0838907 11.8475 0.0672031 11.1466C0.0505156 10.3957 0.0505156 9.64473 0.0672031 8.90213C0.0838907 8.21795 0.601204 7.69229 1.28539 7.6756C2.04468 7.65891 2.80396 7.65891 3.56324 7.6756C4.24743 7.69229 4.77309 8.18457 4.79812 8.8771C4.82315 9.63639 4.82315 10.3957 4.79812 11.1549C4.78143 11.8308 4.2224 12.3648 3.54655 12.3898C3.17108 12.3982 2.79561 12.3898 2.42014 12.3898ZM1.31042 11.0799C2.06136 11.0799 2.74555 11.0799 3.44643 11.0799C3.44643 10.3206 3.44643 9.61135 3.44643 8.92717C2.71218 8.92717 2.00296 8.92717 1.31042 8.92717C1.31042 9.66976 1.31042 10.3706 1.31042 11.0799Z" fill="#737373"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_199_3457">
                                        <rect width="20" height="20" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </button>
                    </div> */}

                    {/* Filter Buttons - Mobile View */}
                    <div className="flex lg:hidden items-center gap-2 mb-4 text-black overflow-x-auto pb-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-2.5 border border-gray-300 bg-[#EBE3D6] text-xs font-semibold whitespace-nowrap flex items-center gap-2 font-[Orbitron] uppercase"
                        >
                            BRAND
                            <ChevronDown size={14} />
                        </button>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-2.5 border border-gray-300 bg-[#EBE3D6] text-xs font-semibold whitespace-nowrap flex items-center gap-2 font-[Orbitron] uppercase"
                        >
                            PRICE
                            <ChevronDown size={14} />
                        </button>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-2.5 border border-gray-300 bg-[#EBE3D6] text-xs font-semibold whitespace-nowrap flex items-center gap-2 font-[Orbitron] uppercase"
                        >
                            SELECT PRODUCT TYPE
                            <ChevronDown size={14} />
                        </button>
                    </div>
                </div>
            </Container>

            <Container>
                <div className="flex flex-col lg:flex-row gap-8 py-5">
                    {/* ---------------- FILTER SIDEBAR ---------------- */}
                    <aside className={`w-full lg:w-1/4 bg-[#F0EBE3] rounded-md lg:sticky lg:top-4 lg:self-start ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="p-5 space-y-8">
                            {/* CATEGORIES FILTER */}
                            {filterOptions?.categories?.length ? (
                                <div>
                                    <div
                                        className="flex justify-between items-center cursor-pointer text-black"
                                        onClick={() => toggleFilter("categories")}
                                    >
                                        <h3 className="text-sm font-bold font-[Orbitron] uppercase text-black mb-3">
                                            Categories
                                        </h3>

                                        <ChevronDown
                                            size={18}
                                            className={`transition-transform duration-300 ${openFilters.categories ? "rotate-180" : ""}`}
                                        />
                                    </div>

                                    {openFilters.categories && (
                                        <div className="space-y-2">
                                            {filterOptions.categories.map((c: any) => (
                                                <div key={c.id} className="flex items-center justify-between text-sm text-black">
                                                    <span>{c.name}</span>
                                                    <span className="text-gray-600">{c.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : null}
                            {/* BRAND FILTER */}
                            {brands?.length ? (<div>
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
                                        {brands.map((b: any) => (
                                            <label
                                                key={b.name || b}
                                                className="flex items-center justify-between text-black cursor-pointer text-sm"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedBrands.includes(b.name || b)}
                                                        onChange={() => toggleBrand(b.name || b)}
                                                        className="w-4 h-4 border border-gray-400 rounded-sm accent-[#D35400]"
                                                    />
                                                    <span>{b.name || b} {b.count != null ? `(${b.count})` : ""}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>) : null}


                            {/* PRICE FILTER */}
                            {filterOptions?.price?.min != null && filterOptions?.price?.max != null ? (<div>
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
                            </div>) : null}


                            {/* PRODUCT TYPE FILTER */}
                            {productTypes.length ? (<div>
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
                                    <div className="space-y-2 text-black">
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
                            </div>) : null}


                            {/* DEPARTMENT FILTER */}
                            {departments.length ? (<div>
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
                            </div>) : null}

                        </div>
                        {/* Sponsored Ad Section */}

                        <div className="mt-6">
                            <SponsoredAd />
                        </div>
                    </aside>


                    {/* ---------------- PRODUCT LISTING ---------------- */}
                    <main className="flex-1">
                        {/* Top bar: Sort By - Desktop Only */}
                        <div className="hidden md:flex justify-between items-center mb-6">
                            {/* Result Count - Desktop */}
                            <p className="text-black text-[16px] font-semibold font-[Inter, sans-serif]">
                                <span>{products.length}</span> Results for <span className="font-normal">{(searchQueryParam && searchQueryParam.trim()) ? searchQueryParam : (categoryNameParam || 'All Products')}</span>
                            </p>

                            <div className="flex items-center gap-4">
                                {/* Sort By - Desktop */}
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
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="w-full py-10 text-center text-black">Loading products...</div>
                        ) : error ? (
                            <div className="w-full py-10 text-center text-red-600">{error}</div>
                        ) : (
                            <div className="grid grid-cols-2 w-full lg:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-6 items-stretch">
                                {products.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/product-details/${product.id}`}
                                        className="flex h-full"
                                    >
                                        <ProductCard
                                            id={product.id}
                                            images={product.image}
                                            name={product.name}
                                            rating={product.rating}
                                            reviews={`${product.reviews}`}
                                            price={product.price}
                                            delivery="Standard Delivery"
                                            action={product.action}
                                        />
                                    </Link>
                                ))}

                            </div>
                        )}
                    </main>
                </div>
                {/* <TopSellingProducts title={"Recommended For You"} />
                <div className="hidden lg:block">
                    <DescriptionSection />
                </div> */}
            </Container>
            {/* <section className="w-full bg-[#31332C] text-white py-10">
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


                     <SeoText /> 
                </div>
            </section> */}
            {/* <SponsoredAd /> */}

        </section>
    );
}

export default function ProductListingPage() {
    return (
        <Suspense fallback={<section className='bg-[#F0EBE3] relative px-4'><Container><div className="py-10 text-center text-black">Loading category...</div></Container></section>}>
            <CategoryContent />
        </Suspense>
    );
}
