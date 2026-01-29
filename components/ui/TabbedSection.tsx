"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface TabContent {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabbedSectionProps {
  tabs: TabContent[];
  defaultTab?: string;
  className?: string;
}

const TabbedSection = ({
  tabs,
  defaultTab,
  className = "",
}: TabbedSectionProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set([defaultTab || tabs[0]?.id])
  );

  // Create refs for each section
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Mobile Accordion Toggle
  const toggleSection = (tabId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tabId)) {
        newSet.delete(tabId);
      } else {
        newSet.add(tabId);
      }
      return newSet;
    });
  };

  // Scroll to section using ref
  const scrollToSection = (tabId: string) => {
    const ref = sectionRefs.current[tabId];
    if (ref) {
      ref.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setActiveTab(tabId);
    }
  };

  return (
    <div className={` ${className}`}>

      {/* ---------------- DESKTOP: STICKY TABS + STACKED CONTENT ---------------- */}
      <div className="hidden md:block">
        {/* Sticky Header - positioned below main navbar (navbar ~120px on desktop) */}
        <div className="sticky top-[123px] z-[49]  border-b border-gray-300 shadow-sm pointer-events-auto">
          <div className="flex container-figma !pr-0 relative max-w-[70%]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => scrollToSection(tab.id)}
                className={`flex-1 px-6 py-4 font-bold text-sm font-[Orbitron] uppercase tracking-wider transition-colors text-center flex items-center justify-center cursor-pointer relative z-10 ${activeTab === tab.id
                  ? "text-black border-b-2 border-black bg-[#F0EBE3]"
                  : "text-gray-600 hover:text-black bg-[#F0EBE3]"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stacked Content */}
        <div className="container-figma !pr-0 p-4 pb-12">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              ref={(el) => { sectionRefs.current[tab.id] = el; }}
              className="mb-8 last:mb-0 border-b border-gray-300 pb-8 last:border-0 last:pb-0 scroll-mt-[180px]"
            >
              {tab.content}
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- MOBILE: ACCORDION ---------------- */}
      <div className="md:hidden">
        {tabs.map((tab) => {
          const isOpen = expandedSections.has(tab.id);

          return (
            <div key={tab.id} className="mb-4">
              {/* HEADER */}
              <button
                onClick={() => toggleSection(tab.id)}
                className="w-full flex items-center justify-between
                     px-4 py-4
                     bg-[#F0EBE3]
                     border border-[#cecbc5]
                     font-bold text-sm uppercase tracking-wide
                     text-black"
              >
                {tab.label}
                <ChevronDown
                  size={20}
                  className={`transition-transform ${isOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* CONTENT */}
              {isOpen && (
                <div className="border border-t-0 border-[#cecbc5]
                          bg-[#F6F1E9]
                          ">
                  {tab.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default TabbedSection;
