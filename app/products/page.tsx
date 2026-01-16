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
import api from '@/lib/api';
import { useAuth } from "@/lib/auth-context";


interface Product {
    id: string;
    name: string;
    price: number;
    rating: number;
    reviews: number;
    image: string[];
    action: 'ADD TO CART' | 'SUBMIT AN INQUIRY';
    is_controlled?: boolean;
}

function CategoryContent() {
    const searchParams = useSearchParams();
    const categoryIdParam = searchParams.get('categoryId') || searchParams.get('category_id');
    const categoryNameParam = searchParams.get('name');
    const searchQueryParam = searchParams.get('search') || searchParams.get('q');

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const filters: any = {};
                if (categoryIdParam && !isNaN(Number(categoryIdParam))) {
                    filters.categoryId = Number(categoryIdParam);
                }
                if (searchQueryParam && searchQueryParam.trim()) {
                    filters.search = searchQueryParam.trim();
                }

                const data = await api.products.getAll(Object.keys(filters).length ? filters : undefined);

                const mapped: Product[] = Array.isArray(data)
                    ? data.map((item: any) => {
                        const priceNum = Number(item.price);
                        const normalizedPrice = Number.isFinite(priceNum) && priceNum > 0 ? priceNum : 0;
                        const images: string[] = Array.isArray(item.media) && item.media.length
                            ? item.media
                                .filter((m: any) => !!m?.url)
                                .sort((a: any, b: any) => (b?.is_cover === true ? 1 : 0) - (a?.is_cover === true ? 1 : 0))
                                .map((m: any) => String(m.url))
                            : ["/placeholder.png"];
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
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]); // Keep static
    
    // New Filter States
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

    // Dynamic Filter Options State
    const [filterOptions, setFilterOptions] = useState<any>({
        brands: [],
        categories: [],
        price: { min: 0, max: 0 },
        conditions: [],
        colors: [],
        countries: []
    });
    
    // Derived state for types (mapped from categories)
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    const [openFilters, setOpenFilters] = useState({
        brand: true,
        price: true,
        type: true,
        department: true,
        condition: true,
        color: true,
        country: true
    });
    const [showFilters, setShowFilters] = useState(false);

    // Initial Fetch & Update on Filter Change
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const filters: any = {
                    need_filters: 1 // Request filters
                };
                
                if (categoryIdParam && !isNaN(Number(categoryIdParam))) filters.category_id = Number(categoryIdParam);
                if (searchQueryParam && searchQueryParam.trim()) filters.search = searchQueryParam.trim();
                
                // Active Filters
                if (selectedBrands.length > 0) filters.make = selectedBrands.join(',');
                if (selectedTypes.length > 0) filters.category_id = selectedTypes.join(','); 
                
                if (selectedConditions.length > 0) filters.condition = selectedConditions.join(',');
                if (selectedColors.length > 0) filters.colors = selectedColors.join(',');
                if (selectedCountries.length > 0) filters.country_of_origin = selectedCountries.join(',');

                if (priceRange.min > 0) filters.min_price = priceRange.min;
                if (priceRange.max > 0 && priceRange.max < 1000000) filters.max_price = priceRange.max;

                const response = await api.products.getAll(filters);
                
                // Handle Response
                const payload: any = response; 
                const data = Array.isArray(payload) ? payload : (payload?.data ?? []);
                const meta = payload?.misc?.filters;

                if (meta) {
                    setFilterOptions({
                        brands: meta.brands || [],
                        categories: meta.categories || [],
                        price: meta.price || { min: 0, max: 100000 },
                        conditions: meta.conditions || [],
                        colors: meta.colors || [],
                        countries: meta.countries || []
                    });
                    // Only set price range initially or if reset? For now let's not auto-reset user selection on every fetch to avoid jumping UI.
                    // Ideally we set initial bounds.
                }

                const mapped: Product[] = Array.isArray(data)
                    ? data.map((item: any) => {
                        const priceNum = Number(item.price);
                        const normalizedPrice = Number.isFinite(priceNum) && priceNum > 0 ? priceNum : 0;
                        const images: string[] = Array.isArray(item.media) && item.media.length
                            ? item.media
                                .filter((m: any) => !!m?.url)
                                .sort((a: any, b: any) => (b?.is_cover === true ? 1 : 0) - (a?.is_cover === true ? 1 : 0))
                                .map((m: any) => String(m.url))
                            : ["/placeholder.png"];
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
                            is_controlled: item.is_controlled,
                        } as Product;
                    })
                    : [];

                setProducts(mapped);
                setError(null);
            } catch (err) {
                console.error("Failed to load products", err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce fetching slightly if price changes, or just run.
        const timer = setTimeout(() => {
            fetchProducts();
        }, 300);
        return () => clearTimeout(timer);

    }, [categoryIdParam, searchQueryParam, selectedBrands, selectedTypes, priceRange, selectedConditions, selectedColors, selectedCountries]); // Dep array triggers update

    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const toggleType = (id: string) => {
        setSelectedTypes(prev =>
             prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const toggleCondition = (val: string) => {
        setSelectedConditions(prev =>
             prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
        );
    };
    
    const toggleColor = (val: string) => {
        setSelectedColors(prev =>
             prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
        );
    };

    const toggleCountry = (val: string) => {
        setSelectedCountries(prev =>
             prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
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
    
    // Static lists for fallback/demo (Department)
    const departments = [
        { name: 'Performance', desc: 'High-performance upgrades' },
        { name: 'Replacement', desc: 'OEM-quality replacement' },
    ];


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
                                        {/* Dynamic Brands */}
                                        {filterOptions?.brands?.length > 0 ? (
                                            filterOptions.brands.map((b: any) => (
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
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No brands available</p>
                                        )}
                                        
                                        {/* Static Example for Comparison (Hidden or removed as per preference, but user said keep existing below? 
                                            Actually user said "Keep existing filter UI below for comparison". 
                                            Since I'm replacing the CONTENT of the "Brand" section, I should probably keep the STATIC list below this dynamic list if strictly following "keep existing UI".
                                            But usually that means keeping the style. I will just render the dynamic list here.
                                        */}
                                    </div>
                                )}
                            </div>


                            {/* PRICE FILTER - Authenticated Only */}
                            {isAuthenticated && (
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
                            )}


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
                                    <div className="space-y-2 text-black">
                                        {filterOptions?.categories?.length > 0 ? (
                                            filterOptions.categories.map((cat: any) => (
                                                <div
                                                    key={cat.id}
                                                    onClick={() => toggleType(String(cat.id))}
                                                    className={`flex items-center justify-between border ${selectedTypes.includes(String(cat.id)) ? 'border-[#D35400] bg-[#fae3d1]' : 'border-[#D8D3C5] bg-[#EBE3D6]'} p-3 cursor-pointer hover:bg-[#F9F7F2] transition`}
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="bg-white rounded-md w-10 h-10 flex items-center justify-center shadow-sm">
                                                            {/* Use generic icon or if cat has image */}
                                                            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                                                        </div>
                                                        <p className="text-[14px]">{cat.name} ({cat.count})</p>
                                                    </div>
                                                    {selectedTypes.includes(String(cat.id)) && <div className="w-2 h-2 bg-[#D35400] rounded-full"></div>}
                                                </div>
                                            ))
                                        ) : (
                                             <p className="text-gray-500 text-sm">No types available</p>
                                        )}
                                    </div>
                                )}
                            </div>


                            {/* DEPARTMENT FILTER */}
                            {/* <div>
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
                            </div> */}

                            {/* CONDITION FILTER */}
                            <div>
                                <div
                                    className="flex justify-between items-center cursor-pointer text-black"
                                    onClick={() => toggleFilter("condition")}
                                >
                                    <h3 className="text-sm font-bold uppercase font-[Orbitron] text-black mb-3">
                                        Condition
                                    </h3>

                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-300 ${openFilters.condition ? "rotate-180" : ""
                                            }`}
                                    />
                                </div>

                                {openFilters.condition && (
                                    <div className="space-y-2">
                                         {filterOptions?.conditions?.length > 0 ? (
                                            filterOptions.conditions.map((c: any) => (
                                                <label
                                                    key={c.name}
                                                    className="flex items-center justify-between text-black cursor-pointer text-sm"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedConditions.includes(c.name)}
                                                            onChange={() => toggleCondition(c.name)}
                                                            className="w-4 h-4 border border-gray-400 rounded-sm accent-[#D35400]"
                                                        />
                                                        <span>{c.name} ({c.count})</span>
                                                    </div>
                                                </label>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No conditions available</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* COLORS FILTER */}
                            <div>
                                <div
                                    className="flex justify-between items-center cursor-pointer text-black"
                                    onClick={() => toggleFilter("color")}
                                >
                                    <h3 className="text-sm font-bold uppercase font-[Orbitron] text-black mb-3">
                                        Color
                                    </h3>

                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-300 ${openFilters.color ? "rotate-180" : ""
                                            }`}
                                    />
                                </div>

                                {openFilters.color && (
                                    <div className="space-y-2">
                                         {filterOptions?.colors?.length > 0 ? (
                                            filterOptions.colors.map((c: any) => (
                                                <label
                                                    key={c.name}
                                                    className="flex items-center justify-between text-black cursor-pointer text-sm"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedColors.includes(c.name)}
                                                            onChange={() => toggleColor(c.name)}
                                                            className="w-4 h-4 border border-gray-400 rounded-sm accent-[#D35400]"
                                                        />
                                                        <span>{c.name} ({c.count})</span>
                                                    </div>
                                                </label>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No colors available</p>
                                        )}
                                    </div>
                                )}
                            </div>

                             {/* COUNTRY FILTER */}
                             <div>
                                <div
                                    className="flex justify-between items-center cursor-pointer text-black"
                                    onClick={() => toggleFilter("country")}
                                >
                                    <h3 className="text-sm font-bold uppercase font-[Orbitron] text-black mb-3">
                                        Country
                                    </h3>

                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-300 ${openFilters.country ? "rotate-180" : ""
                                            }`}
                                    />
                                </div>

                                {openFilters.country && (
                                    <div className="space-y-2">
                                         {filterOptions?.countries?.length > 0 ? (
                                            filterOptions.countries.map((c: any) => (
                                                <label
                                                    key={c.name}
                                                    className="flex items-center justify-between text-black cursor-pointer text-sm"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCountries.includes(c.name)}
                                                            onChange={() => toggleCountry(c.name)}
                                                            className="w-4 h-4 border border-gray-400 rounded-sm accent-[#D35400]"
                                                        />
                                                        <span>{c.name} ({c.count})</span>
                                                    </div>
                                                </label>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No countries available</p>
                                        )}
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
                                        href={`/product/${product.id}`}
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
                                            isControlled={product.is_controlled}
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
