"use client";

import { useState } from "react";
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
    setActiveTab(tabId);
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className={`bg-[#EBE3D6] ${className}`}>
      {/* Tab Headers - Desktop */}
      <div className="hidden md:flex border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-6 py-4 font-bold text-sm font-[Orbitron] uppercase tracking-wider transition-colors ${
              activeTab === tab.id
                ? "text-black border-b-2 border-black bg-[#EBE3D6]"
                : "text-gray-600 hover:text-black bg-[#F0EBE3]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content - Desktop */}
      <div className="hidden md:block p-8">
        {activeTabContent && (
          <div className="space-y-4">
            {activeTabContent.content}
          </div>
        )}
      </div>

      {/* Accordion - Mobile */}
      <div className="md:hidden">
        {tabs.map((tab) => (
          <div key={tab.id} className="border-b border-gray-300">
            <button
              onClick={() => toggleSection(tab.id)}
              className="w-full px-4 py-4 flex items-center justify-between font-bold text-sm uppercase tracking-wider hover:bg-gray-50 transition-colors"
            >
              {tab.label}
              <ChevronDown
                size={20}
                className={`transition-transform ${
                  expandedSections.has(tab.id) ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedSections.has(tab.id) && (
              <div className="px-4 py-4 bg-gray-50">
                {tab.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabbedSection;
