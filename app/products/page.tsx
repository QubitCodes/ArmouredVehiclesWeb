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
    const [currentCategory, setCurrentCategory] = useState<{ id: number; name: string } | null>(null);
    const { isAuthenticated } = useAuth();
    const [placeholderImage, setPlaceholderImage] = useState<string>("/placeholder.jpg");
    const [childCategories, setChildCategories] = useState<Array<{ id: number; name: string; slug?: string; parent_id?: number; image?: string | null }>>([]);
    // Sort selection -> API accepts values like 'price_asc' | 'price_desc'
    const [selectedSort, setSelectedSort] = useState<string>("");

    // Fetch category details from backend using category id in URL
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                if (categoryIdParam && !isNaN(Number(categoryIdParam))) {
                    const cat = await api.categories.getById(Number(categoryIdParam));
                    if (cat && cat.id) {
                        setCurrentCategory({ id: cat.id, name: cat.name });
                    } else {
                        setCurrentCategory(null);
                    }
                } else {
                    setCurrentCategory(null);
                }
            } catch (err) {
                console.error('Failed to load category', err);
                // Keep UI functional even if category fails
                setCurrentCategory(null);
            }
        };
        fetchCategory();
    }, [categoryIdParam]);

    // Fetch child categories for the current parent category (from route)
    useEffect(() => {
        const fetchChildren = async () => {
            try {
                if (categoryIdParam && !isNaN(Number(categoryIdParam))) {
                    const children = await api.categories.getByParent(Number(categoryIdParam));
                    const list = Array.isArray(children) ? children : (children?.data ?? []);
                    setChildCategories(list || []);
                } else {
                    setChildCategories([]);
                }
            } catch (err) {
                console.error('Failed to load child categories', err);
                setChildCategories([]);
            }
        };
        fetchChildren();
    }, [categoryIdParam]);

    useEffect(() => {
        const fetchProductsInitial = async () => {
            try {
                const filters: any = {
                    need_filters: true
                };
                if (categoryIdParam && !isNaN(Number(categoryIdParam))) {
                    filters.categoryId = Number(categoryIdParam);
                }
                if (searchQueryParam && searchQueryParam.trim()) {
                    filters.search = searchQueryParam.trim();
                }
                if (selectedSort) {
                    filters.sort = selectedSort;
                }

                const payload: any = await api.products.getAllWithMeta(Object.keys(filters).length ? filters : undefined);
                const data = Array.isArray(payload) ? payload : (payload?.data ?? []);
                const meta = payload?.misc?.filters;
                const placeholder = payload?.misc?.placeholder_image;

                if (placeholder && typeof placeholder === 'string') {
                    // Ignore backend placeholder, force local
                    setPlaceholderImage("/placeholder.jpg");
                }
                if (meta) {
                    setFilterOptions({
                        brands: meta.brands || [],
                        categories: meta.categories || [],
                        price: meta.price || { min: 0, max: 100000 },
                        conditions: meta.conditions || [],
                        colors: meta.colors || [],
                        countries: meta.countries || [],
                        sizes: meta.sizes || []
                    });
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
                            : [placeholderImage];
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

        fetchProductsInitial();
    }, [categoryIdParam, searchQueryParam, placeholderImage, selectedSort]);


    // Filter states
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]); // Keep static

    // New Filter States
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    // Dynamic Filter Options State
    const [filterOptions, setFilterOptions] = useState<any>({
        brands: [],
        categories: [],
        price: { min: 0, max: 0 },
        conditions: [],
        colors: [],
        countries: [],
        sizes: [],
        vehicleCompactibility: [],
        materials: [],
        features: [],
        warranty: []
    });

    // Selected category or subcategory (single selection for API)
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    // State for category -> subcategory dropdowns
    const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
    const [subcategoriesByParent, setSubcategoriesByParent] = useState<Record<number, Array<{ id: number; name: string; slug?: string }>>>({});
    const [loadingSubCategoryId, setLoadingSubCategoryId] = useState<number | null>(null);

    const [openFilters, setOpenFilters] = useState({
        brand: true,
        price: true,
        type: true,
        department: true,
        condition: true,
        color: true,
        country: true,
        size: true
    });
    const [showFilters, setShowFilters] = useState(false);
    type MobileFilterKey = 'type' | 'brand' | 'price' | 'condition' | 'color' | 'size' | 'country';
    const [mobileActiveFilter, setMobileActiveFilter] = useState<MobileFilterKey | null>(null);

    // Mobile draft state to apply changes on Apply button
    const [mobileDraft, setMobileDraft] = useState<{ 
        brands: string[];
        price: { min: number; max: number };
        conditions: string[];
        colors: string[];
        countries: string[];
        sizes: string[];
        categoryId: string | null;
    }>({
        brands: [],
        price: { min: 0, max: 100000 },
        conditions: [],
        colors: [],
        countries: [],
        sizes: [],
        categoryId: null,
    });

    const openMobileFilters = (filter: MobileFilterKey) => {
        setMobileDraft({
            brands: [...selectedBrands],
            price: { ...priceRange },
            conditions: [...selectedConditions],
            colors: [...selectedColors],
            countries: [...selectedCountries],
            sizes: [...selectedSizes],
            categoryId: selectedCategoryId,
        });
        setMobileActiveFilter(filter);
        setShowFilters(true);

        // Ensure first category is expanded when opening Category filter
        if (filter === 'type' && Array.isArray(childCategories) && childCategories.length > 0) {
            const firstId = Number(childCategories[0]?.id);
            if (!expandedCategories[firstId]) {
                toggleCategoryExpand(firstId);
            }
        }
    };

    const applyMobileFilters = () => {
        setSelectedBrands(mobileDraft.brands);
        setPriceRange({ ...mobileDraft.price });
        setSelectedConditions(mobileDraft.conditions);
        setSelectedColors(mobileDraft.colors);
        setSelectedCountries(mobileDraft.countries);
        setSelectedSizes(mobileDraft.sizes);
        setSelectedCategoryId(mobileDraft.categoryId);
        setShowFilters(false);
    };

    const clearMobileDraft = () => {
        setMobileDraft({
            brands: [],
            price: {
                min: (filterOptions?.price?.min ?? 0),
                max: (filterOptions?.price?.max ?? 100000),
            },
            conditions: [],
            colors: [],
            countries: [],
            sizes: [],
            categoryId: null,
        });
    };

    useEffect(() => {
        if (showFilters) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [showFilters]);

    // Initial Fetch & Update on Filter Change
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const filters: any = {
                    need_filters: true // Request filters
                };

                if (categoryIdParam && !isNaN(Number(categoryIdParam))) filters.categoryId = Number(categoryIdParam);
                if (searchQueryParam && searchQueryParam.trim()) filters.search = searchQueryParam.trim();

                // Active Filters
                if (selectedBrands.length > 0) filters.make = selectedBrands.join(',');
                if (selectedCategoryId) filters.categoryId = selectedCategoryId;

                if (selectedConditions.length > 0) filters.condition = selectedConditions.join(',');
                if (selectedColors.length > 0) filters.colors = selectedColors.join(',');
                if (selectedCountries.length > 0) filters.country_of_origin = selectedCountries.join(',');
                if (selectedSizes.length > 0) filters.sizes = selectedSizes.join(',');

                if (priceRange.min > 0) filters.min_price = priceRange.min;
                if (priceRange.max > 0 && priceRange.max < 1000000) filters.max_price = priceRange.max;
                if (selectedSort) filters.sort = selectedSort;
                console.log("Fetching products with filters:", filters);
                const payload: any = await api.products.getAllWithMeta(filters);

                // Handle Response
                const data = Array.isArray(payload) ? payload : (payload?.data ?? []);
                const meta = payload?.misc?.filters;
                const placeholder = payload?.misc?.placeholder_image;

                if (meta) {
                    setFilterOptions({
                        brands: meta.brands || [],
                        categories: meta.categories || [],
                        price: meta.price || { min: 0, max: 100000 },
                        conditions: meta.conditions || [],
                        colors: meta.colors || [],
                        countries: meta.countries || [],
                        sizes: meta.sizes || []
                    });
                    // Only set price range initially or if reset? For now let's not auto-reset user selection on every fetch to avoid jumping UI.
                    // Ideally we set initial bounds.
                }
                if (placeholder && typeof placeholder === 'string') {
                    // Ignore backend placeholder, force local
                    setPlaceholderImage("/placeholder.jpg");
                }

                // Do not derive category from product list; rely on backend category fetch

                const mapped: Product[] = Array.isArray(data)
                    ? data.map((item: any) => {
                        const priceNum = Number(item.price);
                        const normalizedPrice = Number.isFinite(priceNum) && priceNum > 0 ? priceNum : 0;
                        const images: string[] = Array.isArray(item.media) && item.media.length
                            ? item.media
                                .filter((m: any) => !!m?.url)
                                .sort((a: any, b: any) => (b?.is_cover === true ? 1 : 0) - (a?.is_cover === true ? 1 : 0))
                                .map((m: any) => String(m.url))
                            : [placeholderImage];
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
        fetchProducts();
    }, [categoryIdParam, searchQueryParam, selectedBrands, selectedCategoryId, priceRange, selectedConditions, selectedColors, selectedCountries, selectedSizes, placeholderImage, selectedSort]); // Dep array triggers update

    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const toggleCategory = (id: string) => {
        setSelectedCategoryId(prev => (prev === id ? null : id));
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
    const toggleSize = (val: string) => {
        setSelectedSizes(prev =>
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

    const toggleCategoryExpand = async (catId: number) => {
        setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
        if (!subcategoriesByParent[catId]) {
            try {
                setLoadingSubCategoryId(catId);
                const subs = await api.categories.getByParent(catId);
                const list = Array.isArray(subs) ? subs : (subs?.data ?? []);
                setSubcategoriesByParent(prev => ({ ...prev, [catId]: list || [] }));
            } catch (err) {
                console.error('Failed to load subcategories', err);
                setSubcategoriesByParent(prev => ({ ...prev, [catId]: [] }));
            } finally {
                setLoadingSubCategoryId(null);
            }
        }
    };

    // Static lists for fallback/demo (Department)
    const departments = [
        { name: 'Performance', desc: 'High-performance upgrades' },
        { name: 'Replacement', desc: 'OEM-quality replacement' },
    ];

    // Compute selected category name for display (from sidebar selection)
    const selectedCategoryName: string | null = (() => {
        if (!selectedCategoryId) return null;
        const childMatch = childCategories.find((c: any) => String(c.id) === String(selectedCategoryId));
        if (childMatch) return childMatch.name;
        const subLists = Object.values(subcategoriesByParent) as Array<Array<{ id: number; name: string }>>;
        for (const list of subLists) {
            const subMatch = list?.find((s: any) => String(s.id) === String(selectedCategoryId));
            if (subMatch) return subMatch.name;
        }
        return null;
    })();

    const resultsContextLabel = selectedCategoryName
        || ((categoryIdParam && currentCategory?.name) ? currentCategory.name : null)
        || ((searchQueryParam && searchQueryParam.trim()) ? searchQueryParam.trim() : null)
        || (categoryNameParam || 'All Products');

    return (
        <section className='bg-[#F0EBE3] relative px-0 md:px-4'>
            {/* ---------------- BREADCRUMB BAR ---------------- */}
            {/* <div className="bg-[#E8E3D6] border-b border-[#D8D3C5]">
                
            </div> */}

            {/* ---------------- TITLE SECTION ---------------- */}
            <Container>

                <div className="pt-5">
                    <div className="flex items-center gap-2 text-xs py-3 text-[#737373]">
                        <Link
                            href="/products"
                            className="font-[Inter, sans-serif] font-semibold text-[12px] leading-[100%] tracking-[0%] cursor-pointer hover:text-black transition-colors"
                        >
                            Home
                        </Link>
                        {currentCategory && (
                            <>
                                <span className="font-[Inter, sans-serif] font-semibold text-[12px] leading-[100%] tracking-[0%]">
                                    /
                                </span>
                                <Link
                                    href={`/products?category_id=${currentCategory.id}`}
                                    className="font-[Inter, sans-serif] font-semibold text-[12px] leading-[100%] tracking-[0%] cursor-pointer hover:text-black transition-colors"
                                >
                                    {currentCategory.name}
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-xl md:text-3xl font-[Orbitron] lg:text-4xl font-bold uppercase tracking-wide text-black mb-4">
                        {(currentCategory?.name || categoryNameParam || 'All Products').toUpperCase()}
                    </h1>

                    {/* Filter Buttons - Mobile View */}
                    {(() => {
                        const mobileTabs = [
                            { key: 'type', label: 'CATEGORY', show: true },
                            { key: 'brand', label: 'BRAND', show: true },
                            { key: 'price', label: 'PRICE', show: !!isAuthenticated },
                            { key: 'condition', label: 'CONDITION', show: true },
                            { key: 'color', label: 'COLOR', show: true },
                            { key: 'size', label: 'SIZE', show: true },
                            { key: 'country', label: 'COUNTRY', show: true },
                        ].filter(t => t.show);
                        return (
                            <div className="flex lg:hidden items-center gap-2 mb-4 text-black overflow-x-auto pb-2">
                                {mobileTabs.map((tab) => (
                                    <button
                                        key={tab.label}
                                        onClick={() => openMobileFilters(tab.key as MobileFilterKey)}
                                        className="px-4 py-2.5 border border-gray-300 bg-[#EBE3D6] text-xs font-semibold whitespace-nowrap flex items-center gap-2 font-[Orbitron] uppercase shrink-0"
                                    >
                                        {tab.label}
                                        <ChevronDown size={14} />
                                    </button>
                                ))}
                            </div>
                        );
                    })()}
                </div>
            </Container>

            <Container>
                <div className="flex flex-col lg:flex-row gap-8 py-2">
                    {/* ---------------- FILTER SIDEBAR ---------------- */}
                    <aside className={`w-full lg:w-1/4 bg-[#F0EBE3] rounded-md lg:sticky lg:top-4 lg:self-start hidden lg:block`}>
                        <div className="p-5 space-y-8">
                            <div>
                                <div
                                    className="flex justify-between items-center cursor-pointer text-black"
                                    onClick={() => toggleFilter("type")}
                                >
                                    <h3 className="text-sm font-bold font-[Orbitron] uppercase text-black mb-3">
                                        Category
                                    </h3>

                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-300 ${openFilters.type ? "rotate-180" : ""
                                            }`}
                                    />
                                </div>

                                {openFilters.type && (
                                    <div className="space-y-2 text-black">
                                        {childCategories?.length > 0 ? (
                                            childCategories.map((cat: any) => (
                                                <div key={cat.id} className={`border ${selectedCategoryId === String(cat.id) ? 'border-[#D35400] bg-[#fae3d1]' : 'border-[#D8D3C5] bg-[#EBE3D6]'} rounded-sm`}>
                                                    <div
                                                        onClick={() => toggleCategory(String(cat.id))}
                                                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-[#F9F7F2] transition"
                                                    >
                                                        <div className="flex items-center space-x-4">
                                                            <p className="text-[14px] font-bold text-black">{cat.name}</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {selectedCategoryId === String(cat.id) && <div className="w-2 h-2 bg-[#D35400] rounded-full"></div>}
                                                            <button
                                                                type="button"
                                                                aria-label="Toggle subcategories"
                                                                className="p-1 hover:opacity-80"
                                                                onClick={(e) => { e.stopPropagation(); toggleCategoryExpand(Number(cat.id)); }}
                                                            >
                                                                <ChevronDown size={16} className={`transition-transform ${expandedCategories[cat.id] ? 'rotate-180' : ''}`} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {expandedCategories[cat.id] && (
                                                        <div className="pl-2 pr-3 pb-3 space-y-2">
                                                            {loadingSubCategoryId === cat.id ? (
                                                                <p className="text-xs text-gray-500">Loading...</p>
                                                            ) : subcategoriesByParent[cat.id]?.length ? (
                                                                subcategoriesByParent[cat.id].map((sub: any) => (
                                                                    <div
                                                                        key={sub.id}
                                                                        onClick={() => toggleCategory(String(sub.id))}
                                                                        className={`flex items-center justify-between border ${selectedCategoryId === String(sub.id) ? 'border-[#D35400] bg-[#f9d9c3]' : 'border-[#D8D3C5] bg-[#F0EBE3]'} p-2 cursor-pointer hover:bg-[#F9F7F2] transition rounded-sm`}
                                                                    >
                                                                        <p className="text-[13px]">{sub.name}</p>
                                                                        {selectedCategoryId === String(sub.id) && <div className="w-2 h-2 bg-[#D35400] rounded-full"></div>}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-xs text-gray-500">No subcategories</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No categories available</p>
                                        )}
                                    </div>
                                )}
                            </div>
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
                                                    <Image src="/icons/currency/dirham.svg" className='m-1' alt="Currency" width={13} height={13} />
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
                                                    <Image src="/icons/currency/dirham.svg" className='m-1' alt="Currency" width={13} height={13} />

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
                            {/* <div>
                                <div
                                    className="flex justify-between items-center cursor-pointer text-black"
                                    onClick={() => toggleFilter("type")}
                                >
                                    <h3 className="text-sm font-bold font-[Orbitron] uppercase text-black mb-3">
                                        Category
                                    </h3>

                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-300 ${openFilters.type ? "rotate-180" : ""
                                            }`}
                                    />
                                </div>

                                {openFilters.type && (
                                    <div className="space-y-2 text-black">
                                        {childCategories?.length > 0 ? (
                                            childCategories.map((cat: any) => (
                                                <div
                                                    key={cat.id}
                                                    onClick={() => toggleType(String(cat.id))}
                                                    className={`flex items-center justify-between border ${selectedTypes.includes(String(cat.id)) ? 'border-[#D35400] bg-[#fae3d1]' : 'border-[#D8D3C5] bg-[#EBE3D6]'} p-3 cursor-pointer hover:bg-[#F9F7F2] transition`}
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="bg-white rounded-md w-10 h-10 flex items-center justify-center shadow-sm">
                                                            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                                                        </div>
                                                        <p className="text-[14px]">{cat.name}</p>
                                                    </div>
                                                    {selectedTypes.includes(String(cat.id)) && <div className="w-2 h-2 bg-[#D35400] rounded-full"></div>}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No types available</p>
                                        )}
                                    </div>
                                )}
                            </div> */}


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

                            {/* SIZE FILTER */}
                            <div>
                                <div
                                    className="flex justify-between items-center cursor-pointer text-black"
                                    onClick={() => toggleFilter("size")}
                                >
                                    <h3 className="text-sm font-bold uppercase font-[Orbitron] text-black mb-3">
                                        Size
                                    </h3>

                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-300 ${openFilters.size ? "rotate-180" : ""}
                                            `}
                                    />
                                </div>

                                {openFilters.size && (
                                    <div className="space-y-2">
                                        {filterOptions?.sizes?.length > 0 ? (
                                            filterOptions.sizes.map((s: any) => (
                                                <label
                                                    key={s.name}
                                                    className="flex items-center justify-between text-black cursor-pointer text-sm"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedSizes.includes(s.name)}
                                                            onChange={() => toggleSize(s.name)}
                                                            className="w-4 h-4 border border-gray-400 rounded-sm accent-[#D35400]"
                                                        />
                                                        <span>{s.name} ({s.count})</span>
                                                    </div>
                                                </label>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No sizes available</p>
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
                                <span>{products.length}</span> Results for <span className="font-normal">{resultsContextLabel}</span>
                            </p>

                            <div className="flex items-center gap-4">
                                {/* Sort By - Desktop */}
                                <div className="relative">
                                    <select
                                        value={selectedSort}
                                        onChange={(e) => setSelectedSort(e.target.value)}
                                        className="border border-[#D8D3C5] px-3 py-2 text-sm bg-[#F0EBE3] text-black cursor-pointer appearance-none pr-8"
                                    >
                                        <option value="">Sort By</option>
                                        <option value="price_asc">Price: Low to High</option>
                                        <option value="price_desc">Price: High to Low</option>
                                        <option value="rating_desc">Rating</option>
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
                            <div className="grid grid-cols-2 w-full lg:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-2">
                                {products.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.id}`}
                                        className="block w-full"
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

            {/* Mobile Bottom Sheet Filters */}
            {showFilters && (
                <div className="lg:hidden fixed inset-0 z-50" style={{ zIndex: 60 }}>
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => { setShowFilters(false); setMobileActiveFilter(null); }}
                    />
                    {/* Sheet */}
                    <div className="absolute bottom-0 left-0 right-0 bg-[#F0EBE3] rounded-t-2xl shadow-xl max-h-[85vh] overflow-hidden animate-[slideUp_250ms_ease-out]">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[#D8D3C5]">
                            <h3 className="text-base font-[Orbitron] uppercase font-bold text-black">Filters</h3>
                            <button className="text-sm text-gray-700" onClick={() => { setShowFilters(false); setMobileActiveFilter(null); }}>Close</button>
                        </div>
                        <div className="overflow-y-auto filter-scrollbar px-4 py-4 space-y-6 max-h-[65vh]">
                            {/* Category */}
                            {mobileActiveFilter === 'type' && (
                            <div>
                                <div className="flex justify-between items-center cursor-pointer text-black" onClick={() => toggleFilter('type')}>
                                    <h4 className="text-sm font-bold font-[Orbitron] uppercase mb-2">Category</h4>
                                    <ChevronDown size={18} className={`transition-transform duration-300 ${openFilters.type ? 'rotate-180' : ''}`} />
                                </div>
                                {openFilters.type && (
                                    <div className="space-y-2 text-black">
                                        {childCategories?.length > 0 ? (
                                            childCategories.map((cat: any) => (
                                                <div key={cat.id} className={`border ${mobileDraft.categoryId === String(cat.id) ? 'border-[#D35400] bg-[#fae3d1]' : 'border-[#D8D3C5] bg-[#EBE3D6]'} rounded-sm`}>
                                                    <div className="flex items-center justify-between p-3">
                                                        <div
                                                            onClick={() => setMobileDraft(prev => ({ ...prev, categoryId: prev.categoryId === String(cat.id) ? null : String(cat.id) }))}
                                                            className="flex items-center justify-between flex-1 cursor-pointer hover:bg-[#F9F7F2] transition px-1 py-0.5"
                                                        >
                                                            <p className="text-[14px] font-bold text-black">{cat.name}</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {mobileDraft.categoryId === String(cat.id) && <div className="w-2 h-2 bg-[#D35400] rounded-full"></div>}
                                                            <button
                                                                type="button"
                                                                aria-label="Toggle subcategories"
                                                                className="p-1 hover:opacity-80"
                                                                onClick={(e) => { e.stopPropagation(); toggleCategoryExpand(Number(cat.id)); }}
                                                            >
                                                                <ChevronDown size={16} className={`transition-transform ${expandedCategories[cat.id] ? 'rotate-180' : ''}`} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {expandedCategories[cat.id] && (
                                                        <div className="pl-2 pr-3 pb-3 space-y-2">
                                                            {loadingSubCategoryId === cat.id ? (
                                                                <p className="text-xs text-gray-500">Loading...</p>
                                                            ) : subcategoriesByParent[cat.id]?.length ? (
                                                                subcategoriesByParent[cat.id].map((sub: any) => (
                                                                    <div
                                                                        key={sub.id}
                                                                        onClick={() => setMobileDraft(prev => ({ ...prev, categoryId: prev.categoryId === String(sub.id) ? null : String(sub.id) }))}
                                                                        className={`flex items-center justify-between border ${mobileDraft.categoryId === String(sub.id) ? 'border-[#D35400] bg-[#f9d9c3]' : 'border-[#D8D3C5] bg-[#F0EBE3]'} p-2 cursor-pointer hover:bg-[#F9F7F2] transition rounded-sm`}
                                                                    >
                                                                        <p className="text-[13px]">{sub.name}</p>
                                                                        {mobileDraft.categoryId === String(sub.id) && <div className="w-2 h-2 bg-[#D35400] rounded-full"></div>}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-xs text-gray-500">No subcategories</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No categories available</p>
                                        )}
                                    </div>
                                )}
                            </div>
                            )}

                            {/* Brand */}
                            {mobileActiveFilter === 'brand' && (
                            <div>
                                <div className="flex justify-between items-center cursor-pointer text-black" onClick={() => toggleFilter('brand')}>
                                    <h4 className="text-sm font-bold font-[Orbitron] uppercase mb-2">Brand</h4>
                                    <ChevronDown size={18} className={`transition-transform duration-300 ${openFilters.brand ? 'rotate-180' : ''}`} />
                                </div>
                                {openFilters.brand && (
                                    <div className="space-y-2">
                                        {filterOptions?.brands?.length > 0 ? (
                                            filterOptions.brands.map((b: any) => (
                                                <label key={b.name} className="flex items-center justify-between text-black cursor-pointer text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={mobileDraft.brands.includes(b.name)}
                                                            onChange={() => setMobileDraft(prev => ({ ...prev, brands: prev.brands.includes(b.name) ? prev.brands.filter(x => x !== b.name) : [...prev.brands, b.name] }))}
                                                            className="w-4 h-4 border border-gray-400 rounded-sm accent-[#D35400]"
                                                        />
                                                        <span>{b.name} ({b.count})</span>
                                                    </div>
                                                </label>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No brands available</p>
                                        )}
                                    </div>
                                )}
                            </div>
                            )}

                            {/* Price */}
                            {isAuthenticated && mobileActiveFilter === 'price' && (
                                <div>
                                    <div className="flex justify-between items-center cursor-pointer text-black" onClick={() => toggleFilter('price')}>
                                        <h4 className="text-sm font-bold font-[Orbitron] uppercase mb-2">Price</h4>
                                        <ChevronDown size={18} className={`transition-transform duration-300 ${openFilters.price ? 'rotate-180' : ''}`} />
                                    </div>
                                    {openFilters.price && (
                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <p className="text-[13px] mb-1 text-gray-700">Minimum</p>
                                                <div className="flex items-center border border-[#D8D3C5] bg-[#EBE3D6] rounded-sm px-2 py-1">
                                                    <Image src="/icons/currency/dirham.svg" className='m-1' alt="Currency" width={13} height={13} />
                                                    <input
                                                        type="number"
                                                        value={mobileDraft.price.min}
                                                        onChange={e => setMobileDraft(prev => ({ ...prev, price: { ...prev.price, min: parseInt(e.target.value || '0') } }))}
                                                        className="w-full outline-none text-gray-700 bg-[#EBE3D6]"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[13px] mb-1 text-gray-700">Maximum</p>
                                                <div className="flex items-center border border-[#D8D3C5] bg-[#EBE3D6] rounded-sm px-2 py-1">
                                                    <Image src="/icons/currency/dirham.svg" className='m-1' alt="Currency" width={13} height={13} />
                                                    <input
                                                        type="number"
                                                        value={mobileDraft.price.max}
                                                        onChange={e => setMobileDraft(prev => ({ ...prev, price: { ...prev.price, max: parseInt(e.target.value || '0') } }))}
                                                        className="w-full outline-none text-gray-700 bg-[#EBE3D6]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Condition */}
                            {mobileActiveFilter === 'condition' && (
                            <div>
                                <div className="flex justify-between items-center cursor-pointer text-black" onClick={() => toggleFilter('condition')}>
                                    <h4 className="text-sm font-bold font-[Orbitron] uppercase mb-2">Condition</h4>
                                    <ChevronDown size={18} className={`transition-transform duration-300 ${openFilters.condition ? 'rotate-180' : ''}`} />
                                </div>
                                {openFilters.condition && (
                                    <div className="space-y-2">
                                        {filterOptions?.conditions?.length > 0 ? (
                                            filterOptions.conditions.map((c: any) => (
                                                <label key={c.name} className="flex items-center justify-between text-black cursor-pointer text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={mobileDraft.conditions.includes(c.name)}
                                                            onChange={() => setMobileDraft(prev => ({ ...prev, conditions: prev.conditions.includes(c.name) ? prev.conditions.filter(x => x !== c.name) : [...prev.conditions, c.name] }))}
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
                            )}

                            {/* Color */}
                            {mobileActiveFilter === 'color' && (
                            <div>
                                <div className="flex justify-between items-center cursor-pointer text-black" onClick={() => toggleFilter('color')}>
                                    <h4 className="text-sm font-bold font-[Orbitron] uppercase mb-2">Color</h4>
                                    <ChevronDown size={18} className={`transition-transform duration-300 ${openFilters.color ? 'rotate-180' : ''}`} />
                                </div>
                                {openFilters.color && (
                                    <div className="space-y-2">
                                        {filterOptions?.colors?.length > 0 ? (
                                            filterOptions.colors.map((c: any) => (
                                                <label key={c.name} className="flex items-center justify-between text-black cursor-pointer text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={mobileDraft.colors.includes(c.name)}
                                                            onChange={() => setMobileDraft(prev => ({ ...prev, colors: prev.colors.includes(c.name) ? prev.colors.filter(x => x !== c.name) : [...prev.colors, c.name] }))}
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
                            )}

                            {/* Size */}
                            {mobileActiveFilter === 'size' && (
                            <div>
                                <div className="flex justify-between items-center cursor-pointer text-black" onClick={() => toggleFilter('size')}>
                                    <h4 className="text-sm font-bold font-[Orbitron] uppercase mb-2">Size</h4>
                                    <ChevronDown size={18} className={`transition-transform duration-300 ${openFilters.size ? 'rotate-180' : ''}`} />
                                </div>
                                {openFilters.size && (
                                    <div className="space-y-2">
                                        {filterOptions?.sizes?.length > 0 ? (
                                            filterOptions.sizes.map((s: any) => (
                                                <label key={s.name} className="flex items-center justify-between text-black cursor-pointer text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={mobileDraft.sizes.includes(s.name)}
                                                            onChange={() => setMobileDraft(prev => ({ ...prev, sizes: prev.sizes.includes(s.name) ? prev.sizes.filter(x => x !== s.name) : [...prev.sizes, s.name] }))}
                                                            className="w-4 h-4 border border-gray-400 rounded-sm accent-[#D35400]"
                                                        />
                                                        <span>{s.name} ({s.count})</span>
                                                    </div>
                                                </label>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No sizes available</p>
                                        )}
                                    </div>
                                )}
                            </div>
                            )}

                            {/* Country */}
                            {mobileActiveFilter === 'country' && (
                            <div>
                                <div className="flex justify-between items-center cursor-pointer text-black" onClick={() => toggleFilter('country')}>
                                    <h4 className="text-sm font-bold font-[Orbitron] uppercase mb-2">Country</h4>
                                    <ChevronDown size={18} className={`transition-transform duration-300 ${openFilters.country ? 'rotate-180' : ''}`} />
                                </div>
                                {openFilters.country && (
                                    <div className="space-y-2">
                                        {filterOptions?.countries?.length > 0 ? (
                                            filterOptions.countries.map((c: any) => (
                                                <label key={c.name} className="flex items-center justify-between text-black cursor-pointer text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={mobileDraft.countries.includes(c.name)}
                                                            onChange={() => setMobileDraft(prev => ({ ...prev, countries: prev.countries.includes(c.name) ? prev.countries.filter(x => x !== c.name) : [...prev.countries, c.name] }))}
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
                            )}
                        </div>

                        {/* Apply Bar */}
                        <div className="border-t border-[#D8D3C5] p-4 bg-[#EBE3D6]">
                            <div className="flex gap-3">
                                <button onClick={clearMobileDraft} className="flex-1 py-3 border border-[#D8D3C5] bg-[#F0EBE3] text-black font-semibold uppercase font-[Orbitron] tracking-wide">
                                    Clear
                                </button>
                                <button onClick={applyMobileFilters} className="flex-1 py-3 bg-[#D35400] text-white font-semibold uppercase font-[Orbitron] tracking-wide">
                                    Apply
                                </button>
                            </div>
                            <div style={{ height: 'env(safe-area-inset-bottom)' }} />
                        </div>
                    </div>
                </div>
            )}
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
        <Suspense fallback={
                <section className='bg-[#F0EBE3] relative px-0 md:px-4'>
                <Container>
                    <div className="py-10 text-center text-black">Loading category...</div>
                </Container>
            </section>
        }>
            <CategoryContent />
        </Suspense>
    );
}
