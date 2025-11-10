'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Container } from '@/components/ui';
import { ChevronRight, ExternalLink, Grid3x3, List, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import SponsoredAd from '@/components/sponsored/SponsoredAd';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
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
            image: '/product/rim.png',
            action: 'ADD TO CART',
        },
        {
            id: '2',
            name: 'DFC® - 4000 HybriDynamic Hybrid Rear Brake Pads',
            price: 16769,
            rating: 4.6,
            reviews: 4.5,
            image: '/product/rim.png',
            action: 'SUBMIT AN INQUIRY',
        },
        {
            id: '3',
            name: 'DFC® - 4000 HybriDynamic Hybrid Rear Brake Pads',
            price: 679,
            rating: 4.6,
            reviews: 4.5,
            image: '/product/rim.png',
            action: 'ADD TO CART',
        },
    ]);

    // Filter states
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState({ min: 9, max: 10850 });
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

    return (
        <section className='bg-[#F0EBE3]'>
            {/* ---------------- BREADCRUMB BAR ---------------- */}
            <div className="bg-[#E8E3D6] border-b border-[#D8D3C5]">
                {/* <Container> */}

                {/* </Container> */}
            </div>

            {/* ---------------- TITLE SECTION ---------------- */}
            <Container>

                <div className="py-6">
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
                <div className="flex flex-col lg:flex-row gap-8 py-10">
                    {/* ---------------- FILTER SIDEBAR ---------------- */}
                    <aside className="w-full lg:w-1/4 bg-[#F3EFE6] rounded-md lg:sticky lg:top-4 lg:self-start">
                        <div className="p-5 space-y-8 max-h-[calc(100vh-8rem)] overflow-y-auto filter-scrollbar">
                            {/* BRAND FILTER */}
                            <div>
                                <h3 className="text-sm font-bold font-[Orbitron] uppercase text-black mb-3">Brand</h3>
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
                                            {/* <span className="text-gray-500 text-xs">({b.count})</span> */}
                                        </label>
                                    ))}
                                    <p className="text-[#D35400] text-underline text-sm font-medium cursor-pointer">
                                        Show More
                                    </p>
                                </div>
                            </div>

                            {/* PRICE FILTER */}
                            <div>
                                <h3 className="text-sm font-bold font-[Orbitron] uppercase text-black mb-3">Price</h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <p className="text-[13px] mb-1 text-gray-700">Minimum</p>
                                        <div className="flex items-center border border-[#D8D3C5] bg-[#EBE3D6] rounded-sm px-2 py-1">
                                            <span className="mr-2 text-gray-700">฿</span>
                                            <input
                                                type="number"
                                                value={priceRange.min}
                                                onChange={e =>
                                                    setPriceRange(prev => ({
                                                        ...prev,
                                                        min: parseInt(e.target.value),
                                                    }))
                                                }
                                                className="w-full outline-none text-gray-700 bg-[#EBE3D6]"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[13px] mb-1 text-gray-700">Maximum</p>
                                        <div className="flex items-center border border-[#D8D3C5] bg-[#EBE3D6] rounded-sm px-2 py-1">
                                            <span className="mr-2 text-gray-700">฿</span>
                                            <input
                                                type="number"
                                                value={priceRange.max}
                                                onChange={e =>
                                                    setPriceRange(prev => ({
                                                        ...prev,
                                                        max: parseInt(e.target.value),
                                                    }))
                                                }
                                                className="w-full outline-none text-gray-700 bg-[#EBE3D6]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PRODUCT TYPE FILTER */}
                            <div>
                                <h3 className="text-sm font-bold font-[Orbitron] uppercase text-black mb-3">
                                    Select Product Type
                                </h3>
                                <div className="space-y-2">
                                    {productTypes.map(type => (
                                        <div
                                            key={type.name}
                                            className="flex items-center justify-between border border-[#D8D3C5] bg-[#EBE3D6] pl-0 p-3 cursor-pointer hover:bg-[#F9F7F2] transition"
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
                                                <p className="text-[14px] font-normal text-black font-[Inter, sans-serif] leading-[100%] tracking-[0%]">
                                                    {type.name}
                                                </p>
                                            </div>
                                            <ChevronRight size={16} className="text-gray-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* DEPARTMENT FILTER */}
                            <div>
                                <h3 className="text-sm font-bold uppercase font-[Orbitron] text-black mb-3">
                                    Select Department
                                </h3>
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
                            </div>
                        </div>
                        {/* Sponsored Ad Section */}

                        <div className="mt-6">
                            <SponsoredAd />
                        </div>
                    </aside>


                    {/* ---------------- PRODUCT LISTING ---------------- */}
                    <main className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-black text-[16px] font-semibold font-[Inter, sans-serif]">
                                <span className="">{products.length}</span> Results
                            </p>
                            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-[#EBE3D6]">
                                <option className="bg-[#EBE3D6]" style={{ backgroundColor: '#EBE3D6' }}>Sort By</option>
                                <option className="bg-[#EBE3D6]" style={{ backgroundColor: '#EBE3D6' }}>Price: Low to High</option>
                                <option className="bg-[#EBE3D6]" style={{ backgroundColor: '#EBE3D6' }}>Price: High to Low</option>
                                <option className="bg-[#EBE3D6]" style={{ backgroundColor: '#EBE3D6' }}>Rating</option>
                            </select>

                        </div>


                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {products.map(product => (
                                <ProductCard
                                    key={product.id}
                                    image={product.image}
                                    name={product.name}
                                    rating={product.rating}
                                    reviews={`${product.reviews}k`}
                                    price={product.price}
                                    delivery="Standard Delivery by tomorrow"
                                    action={product.action}
                                />
                            ))}
                        </div>
                    </main>
                </div>
                <section className=" text-[black] py-12 mt-12 border-t border-[#E8E3D6]">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 text-[15px] leading-relaxed">
                        {/* ---------- LEFT COLUMN ---------- */}
                        <div className="space-y-8 font-[Inter,sans-serif]">
                            <div>
                                <h2 className="font-[Orbitron] font-bold text-[16px] uppercase mb-2">
                                    About Brake Pads
                                </h2>
                                <p className="font-semibold underline mb-2">
                                    Restore your vehicle’s stopping power with premium brake pads from Armored Mart.
                                </p>
                                <p>
                                    We carry high-quality parts from trusted brands that meet or exceed OE standards — engineered for
                                    safety, performance, and long life. Order online for fast, free shipping, or pick up your parts
                                    today at a nearby Armored Mart location (where available).
                                </p>
                            </div>

                            <div>
                                <h2 className="font-[Orbitron] font-bold text-[16px] uppercase mb-2">
                                    Why Change Your Brake Pads?
                                </h2>
                                <p>
                                    If your car takes longer to stop, makes squealing noises, or it’s been around{' '}
                                    <span className="font-semibold underline">40,000 miles</span> since your last brake job, it’s time
                                    to replace your pads.
                                </p>
                                <p className="mt-2">
                                    Drive with confidence again using{' '}
                                    <span className="font-semibold underline">new brake pads from Armored Mart</span> — available in
                                    multiple materials and performance levels. Our selection includes options that match or exceed
                                    original equipment quality, ensuring dependable performance for every type of driver.
                                </p>
                            </div>

                            <div>
                                <h2 className="font-[Orbitron] font-bold text-[16px] uppercase mb-2">
                                    Signs of Worn or Bad Brake Pads
                                </h2>
                                <p>Watch for these common indicators that it’s time for replacement:</p>
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>
                                        <span className="font-semibold">Squealing or grinding sounds</span> while braking
                                    </li>
                                    <li>
                                        <span className="font-semibold">Pulsation or vibration</span> through the brake pedal
                                    </li>
                                    <li>
                                        <span className="font-semibold">Brake warning light</span> illuminated on your dashboard
                                    </li>
                                    <li>
                                        <span className="font-semibold">Longer stopping distances</span> or reduced braking performance
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="font-[Orbitron] font-bold text-[16px] uppercase mb-2">
                                    Types of Brake Pads Available at Armored Mart
                                </h2>
                                <p>
                                    Armored Mart offers a full selection of brake pad types for every vehicle and driving style:
                                </p>
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>
                                        <span className="font-semibold underline">Ceramic Brake Pads</span> – Smooth, quiet, and long-lasting
                                    </li>
                                    <li>
                                        <span className="font-semibold underline">Semi-Metallic Brake Pads</span> – Strong stopping power and heat resistance
                                    </li>
                                    <li>
                                        <span className="font-semibold underline">Carbon Fiber Brake Pads</span> – High-performance, durable choice for sporty driving
                                    </li>
                                    <li>
                                        <span className="font-semibold underline">OE Replacement Pads</span> – Reliable factory-level quality and fit
                                    </li>
                                </ul>
                                <p className="mt-2">
                                    Whether you’re doing routine maintenance or upgrading your performance,{' '}
                                    <span className="font-semibold underline">Armored Mart</span> is your one-stop destination for all your
                                    brake needs — pads, rotors, and accessories included.
                                </p>
                            </div>
                        </div>

                        {/* ---------- RIGHT COLUMN ---------- */}
                        <div className="space-y-8 font-[Inter,sans-serif]">
                            <div>
                                <h2 className="font-[Orbitron] font-bold text-[16px] uppercase mb-2">
                                    What Are Brake Pads?
                                </h2>
                                <p>
                                    Brake pads are essential components of your car’s braking system. Mounted on either side of the brake
                                    rotor, they create friction when you press the brake pedal, helping slow or stop your vehicle.
                                </p>
                                <p className="mt-2">
                                    Over time, this friction wears down the pad surface. As they get thinner, your braking efficiency
                                    decreases — which is why regular replacement is critical for maintaining safe stopping distances.
                                </p>
                            </div>

                            <div>
                                <h2 className="font-[Orbitron] font-bold text-[16px] uppercase mb-2">
                                    How Often Should Brake Pads Be Replaced?
                                </h2>
                                <p>
                                    Brake pads should be replaced as part of regular vehicle maintenance. As the friction material wears
                                    away, braking performance decreases and your rotors may get damaged if neglected.
                                </p>
                                <p className="mt-2">
                                    Avoid unnecessary repair costs by replacing worn pads early. Armored Mart carries everything you need
                                    for your brake service — from pads and rotors to lubricants and installation hardware.
                                </p>
                            </div>

                            <div>
                                <h2 className="font-[Orbitron] font-bold text-[16px] uppercase mb-2">
                                    How to Check Your Brake Pads
                                </h2>
                                <p>There are a few simple ways to check the condition of your brake pads:</p>
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    <li>
                                        <span className="font-semibold">Listen for squeaks:</span> Many pads have built-in wear indicators
                                        that make noise when it’s time to change them.
                                    </li>
                                    <li>
                                        <span className="font-semibold">Feel for response changes:</span> If braking feels weaker or you need
                                        to press harder, your pads might be worn.
                                    </li>
                                    <li>
                                        <span className="font-semibold">Inspect visually:</span> Remove your wheels and look at the pad
                                        thickness — if it’s thin, replacement is due.
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="font-[Orbitron] font-bold text-[16px] uppercase mb-2">
                                    Stop Safely with Armored Mart
                                </h2>
                                <p>
                                    Brake pads are one of the most important safety components on your vehicle. Don’t wait until you hear
                                    grinding — replace worn pads early to maintain control and protect your rotors.
                                </p>
                                <p className="mt-2">
                                    Shop confidently with{' '}
                                    <span className="font-semibold underline">Armored Mart’s top-quality brake pads</span>, trusted brands,
                                    and unbeatable prices. Get everything you need for your next brake job — shipped fast and built to perform.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
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


                    {/* Text Section */}
                    <div className="text-white font-[inter, sans-serif] font-[14px] 2xl:mt-20 xl:mt-16 text-sm space-y-4 leading-relaxed">
                        <p>
                            Perform preventive maintenance and make timely repairs, increase
                            horsepower and improve handling and braking for better overall
                            performance, and give your{" "}
                            <Link href="#" className="text-white font-bold underline cursor-pointer">
                                car
                            </Link>
                            ,{" "}
                            <Link href="#" className="text-white font-bold underline cursor-pointer">
                                truck
                            </Link>
                            , or{" "}
                            <Link href="#" className="text-white font-bold underline cursor-pointer">
                                SUV
                            </Link>{" "}
                            the unique appearance that will have heads turning wherever you roll.
                            You can do it all with{" "}
                            <Link href="#" className="text-white font-bold underline cursor-pointer">
                                parts and accessories
                            </Link>{" "}
                            from{" "}
                            <Link href="#" className="text-white font-bold underline cursor-pointer">
                                Armed Mart
                            </Link>
                            . Unlike some online aftermarket vendors that have{" "}
                            <Link href="#" className="text-white font-bold underline cursor-pointer">
                                repair parts
                            </Link>{" "}
                            but can’t help you dress up your ride, or{" "}
                            <Link href="#" className="text-white font-bold underline cursor-pointer">
                                sell
                            </Link>{" "}
                            exterior accessories but don’t have the{" "}
                            <Link href="#" className="text-white font-bold underline cursor-pointer">
                                wheels
                            </Link>{" "}
                            and tires you need to complete the look, we’re the one-stop
                            destination for all your automotive essentials.
                        </p>

                        <p>
                            Explore our extensive range of options with our{" "}
                            <Link href="#" className="text-white font-bold underline cursor-pointer">
                                Shop by Product
                            </Link>{" "}
                            and{" "}
                            <Link href="#" className="text-white font-bold underline cursor-pointer">
                                Shop by Brand
                            </Link>{" "}
                            sections to find exactly what you need quickly and easily. No matter
                            what you want to do with your{" "}
                            <Link href="#" className="text-white font-bold underline cursor-pointer">
                                vehicle
                            </Link>{" "}
                            or where you get your kicks — on the street, at the track, or
                            off-road — you’ll find quality,{" "}
                            <Link href="#" className="text-white font-bold underline cursor-pointer">
                                name-brand parts and accessories
                            </Link>{" "}
                            on our digital shelves to turn your{" "}
                            <Link href="#" className="text-white font-bold underline cursor-pointer">
                                automotive
                            </Link>{" "}
                            dreams into reality. And we’ve gathered all the vehicle-appropriate
                            products you’re looking for in our{" "}
                            <Link href="#" className="text-white font-bold underline cursor-pointer">
                                Jeep, Truck, and SUV
                            </Link>{" "}
                            shops.
                        </p>

                        <Link
                            href="#"
                            className="inline-block mt-3 text-white hover:text-gray-400 font-inter font-semibold text-sm leading-[100%] tracking-[0%] underline decoration-solid underline-offset-[0%] decoration-[0%]"
                        >
                            Read More
                        </Link>
                    </div>
                </div>
            </section>
        </section>
    );
}
