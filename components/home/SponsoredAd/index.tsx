"use client";

import Image from "next/image";
import Link from "next/link";
import SeoText from '@/components/footer/SeoText';

const SponsoredAd = () => {


    return (
        <section className="w-full bg-[#31332C] text-white py-10">
            <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-[140px]">
                {/* Top Banner */}
                <div className="relative rounded-lg overflow-hidden mb-3">
                    {/* Desktop View */}
                    <div className="hidden md:block">
                        <Link
                            href="https://princetontec.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                src="/sponsored/Group 362.png"
                                alt="Princeton Tec VIZZ 550 RGB Headlamp"
                                width={1920}
                                height={400}
                                className="w-full h-auto"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden rounded-lg overflow-hidden">
                        <Link
                            href="https://princetontec.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                src="/sponsored/group361.png"
                                alt="Princeton Tec VIZZ 550 RGB Headlamp"
                                width={800}
                                height={600}
                                className="w-full h-auto"
                            />
                        </Link>
                    </div>

                    {/* Disclaimer and Sponsored - Mobile */}
                    <div className="md:hidden mt-1">
                        <div className="flex flex-row justify-between items-start gap-3 flex-wrap">
                            <p className="text-xs leading-relaxed flex-1">
                                <span className="text-[#D35400] font-semibold">Disclaimer:</span>{" "}
                                <span className="text-white">
                                    This is sponsored content. ArmoredMart assumes no responsibility for the accuracy, validity, or claims presented herein.
                                </span>
                            </p>
                            <p className="text-xs text-[#737373] ml-4 shrink-0">sponsored</p>
                        </div>
                    </div>

                    {/* Disclaimer + Sponsored Row - Desktop */}
                    <div className="hidden md:flex flex-row justify-between items-start mt-1 gap-3 mb-10 flex-wrap">
                        <p className="text-xs leading-relaxed flex-1">
                            <span
                                className="text-[#D35400] font-semibold"
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 700,
                                    fontSize: "14px",
                                    lineHeight: "100%",
                                    letterSpacing: "0%",
                                }}
                            >
                                Disclaimer:
                            </span>{" "}
                            <span
                                className="text-white"
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 400,
                                    fontStyle: "normal",
                                    fontSize: "12px",
                                    lineHeight: "100%",
                                    letterSpacing: "0%",
                                }}
                            >
                                This is sponsored content. ArmoredMart assumes no responsibility
                                for the accuracy, validity, or claims presented herein.
                            </span>
                        </p>
                        <p
                            className="text-[#737373] ml-4 shrink-0 mt-0"
                            style={{
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 400,
                                fontStyle: "normal",
                                fontSize: "14px",
                                lineHeight: "100%",
                                letterSpacing: "0%",
                            }}
                        >
                            sponsored
                        </p>
                    </div>
                </div>

                {/* Disclaimer + Sponsored Row */}

                {/* Info Boxes */}
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
                <SeoText expandable />
            </div>
        </section>
    );
};

export default SponsoredAd;
