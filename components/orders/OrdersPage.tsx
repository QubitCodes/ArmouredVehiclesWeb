"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  ChevronDown,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";
import OrdersSupportPanel from "@/components/modal/OrdersSupportPanel";
import { useOrders } from "@/lib/hooks/orders";
import type { Order } from "@/lib/types";

function formatStatusText(order: Order): string {
  switch (order.order_status) {
    case "approved":
    case "pending_review":
    case "pending_approval":
      return "Processing"; // Map these to Processing for user view
    case "order_received":
      return "Order Received";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
    case "rejected":
      return "Cancelled";
    case "returned":
      return "Returned";
    default:
      return order.order_status.replace(/_/g, ' ');
  }
}

export default function OrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("Last 3 Months");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showSupportPanel, setShowSupportPanel] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: orders, isLoading, error } = useOrders();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Group Orders Logic
  const groupedOrders = (orders || []).reduce((acc: any, order) => {
    const groupId = order.order_group_id || order.id;
    if (!acc[groupId]) {
      acc[groupId] = {
        ...order, // Base props from first order
        id: groupId, // Use Group ID as main ID
        displayId: order.order_group_id || order.order_id || order.id,
        subOrders: [],
        totalAmount: 0,
        items: [] // Aggregate items for preview
      };
    }
    acc[groupId].subOrders.push(order);
    acc[groupId].totalAmount += Number(order.total_amount || 0);
    if (order.items) {
      acc[groupId].items.push(...order.items);
    }
    // Status Logic: If any sub-order is "in progress", the group is in progress?
    // Or verify logic later. For now, use first order's status as proxy for filter group?
    // Actually, we should filter GROUPS.
    return acc;
  }, {});

  const orderGroups = Object.values(groupedOrders);

  // Filter Groups based on Sub-Orders
  const inProgressGroups = orderGroups.filter((group: any) =>
    group.subOrders.some((o: any) => ["order_received", "pending_review", "pending_approval", "approved", "processing", "shipped"].includes(o.order_status))
  );

  const completedGroups = orderGroups.filter((group: any) =>
    group.subOrders.every((o: any) => ["delivered", "cancelled", "returned", "rejected"].includes(o.order_status))
  );

  // Debug logging
  useEffect(() => {
    if (orders?.length) {
      console.log("[OrdersPage] Grouped Orders:", orderGroups);
    }
  }, [orders]);

  return (
    <main className="flex-1">
      {isLoading && (
        <div className="mb-4 text-sm text-[#6E6E6E]">Loading your orders...</div>
      )}
      {error && (
        <div className="mb-4 text-sm text-red-600">Failed to load orders.</div>
      )}
      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden mb-4">
        <h1 className="font-orbitron font-black text-xl uppercase tracking-wide text-black">
          Orders
        </h1>
      </div>

      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden lg:flex items-center justify-between mb-6">
        <h1 className="font-orbitron font-black text-[32px] uppercase tracking-wide text-black">
          Orders
        </h1>
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6E6E] w-5 h-5" />
            <input
              type="text"
              placeholder="Find Items"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[355px] bg-[#E8E0D4] border border-[#CCCCCC] pl-12 pr-4 py-3 text-sm text-[#6E6E6E] placeholder:text-[#6E6E6E] outline-none focus:border-[#39482C] transition-colors"
            />
          </div>
          {/* Time Filter */}
          <button className="flex items-center gap-2 bg-[#E8E0D4] border border-[#CCCCCC] px-4 py-3 font-inter text-[16px] font-normal text-[#6E6E6E] leading-none tracking-normal hover:bg-[#DDD5C8] transition-colors">
            {timeFilter}
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Mobile Search & Filter - Inline */}
      <div className="lg:hidden flex items-center mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6E6E6E] w-4 h-4" />
          <input
            type="text"
            placeholder="Find Items"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#EBE3D6] border border-[#D4CEC3] pl-9 pr-3 py-2.5 text-sm text-[#6E6E6E] placeholder:text-[#6E6E6E] outline-none focus:border-[#39482C] transition-colors"
          />
        </div>
        <button className="flex items-center gap-1 bg-[#EBE3D6] border border-[#D4CEC3] px-3 py-2.5 text-sm text-[#6E6E6E] hover:bg-[#E0D9CC] transition-colors whitespace-nowrap">
          Last 3 months
          <ChevronDown size={14} />
        </button>
      </div>

      {/* IN PROGRESS Section */}
      <div className="mb-6 lg:mb-8 px-3 py-4 lg:px-5 lg:py-5 bg-[#EBE3D6] border border-[#EBE3D6]  overflow-hidden">
        <h2 className="font-orbitron font-bold text-xs lg:text-sm uppercase tracking-wider text-black mb-3 lg:mb-4">
          In Progress{" "}
          <span className="text-[#666] font-normal">({inProgressGroups.length} Item)</span>
        </h2>

        <div className="space-y-3 lg:space-y-4">
          {inProgressGroups.map((group: any, index: any) => {
            // First product for display
            const firstItem = group.items?.[0];
            const image = firstItem?.product?.image || firstItem?.image || "/placeholder.jpg";
            const baseName = firstItem?.product?.name || firstItem?.product_name || firstItem?.name || `Order ${group.displayId}`;

            const totalItemsCount = group.items?.length || 0;
            const extraCount = totalItemsCount - 1;
            const title = extraCount > 0 ? `${baseName} + ${extraCount} products` : baseName;

            // Status from the most relevant sub-order (e.g. the one preventing completion)
            const activeOrder = group.subOrders.find((o: any) => !["delivered", "cancelled"].includes(o.order_status)) || group.subOrders[0];
            const statusText = formatStatusText(activeOrder);
            const statusNote = activeOrder.estimatedDelivery ? `ETA: ${activeOrder.estimatedDelivery}` : "on time";
            const totalPrice = group.totalAmount;

            return (
              <div key={index} className="bg-[#F0EBE3] border border-[#C2B280] overflow-hidden">
                {/* Order Header - Mobile */}
                <div className="lg:hidden px-3 py-3">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-sm text-black">{activeOrder.estimatedDelivery || ""}</p>
                    <div className="flex flex-col items-end gap-1">
                      <p className="font-bold text-black">{totalPrice.toFixed(2)} AED</p>
                      <p className="text-xs text-[#666]">
                        <span className="text-[#009900]">{statusText}</span>
                        <span className="text-[#666]"> · {statusNote}</span>
                      </p>
                    </div>
                  </div>
                  {/* Track + More (Mobile) */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/orders/track/${activeOrder.id}`)} // Track specific order? Or Group? Default to active
                      className="flex-1 bg-[#3D4A26] h-[40px] hover:bg-[#4A5D3A] text-white clip-path-supplier flex items-center justify-center py-2.5 transition-colors"
                    >
                      <span className="font-bold text-[11px]  font-orbitron uppercase tracking-wide">
                        Track Order
                      </span>
                    </button>

                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() =>
                          setOpenDropdown(openDropdown === group.id ? null : group.id)
                        }
                        className="h-[40px] w-[40px] flex items-center justify-center hover:bg-[#E0D9CC] transition-colors"
                      >
                        <MoreVertical size={18} className="text-[#333]" />
                      </button>

                      {openDropdown === group.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#EBE3D6] border border-[#E2DACB] rounded-lg shadow-lg z-10 overflow-visible">
                          <button
                            onClick={() => router.push(`/orders/summary/${group.id}`)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#333] hover:bg-[#F5F5F5]"
                          >
                            <Image src="/order/Frame10.png" alt="Order Summary" width={16} height={16} />
                            Order Details
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Order Header - Desktop */}
                <div className="hidden lg:flex px-5 py-4 items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-black">{activeOrder.estimatedDelivery || ""}</p>
                    <p className="text-sm">
                      <span className="text-[#009900]">{statusText}</span>
                      <span className="text-[#666]"> · {statusNote}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => router.push(`/orders/summary/${group.id}`)}
                      className="bg-[#39482C] hover:bg-[#D35400] text-white clip-path-supplier flex items-center justify-center px-6 h-[38px] transition-colors"
                    >
                      <span className="font-black text-[12px] font-orbitron uppercase whitespace-nowrap">
                        View Details
                      </span>
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-3 lg:mx-5 border-b border-[#C2B280]"></div>

                {/* Order Content */}
                <div
                  className="p-3 lg:p-5 flex items-start gap-5 lg:gap-5 cursor-pointer hover:bg-[#EAEAEA] transition-colors"
                  onClick={() => router.push(`/orders/summary/${group.id}`)}
                >
                  <img
                    src={image}
                    alt={title}
                    className="w-16 h-16 lg:w-20 lg:h-20 object-contain flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-black mb-1 line-clamp-2">
                      {title}
                    </h3>
                    <div className="flex items-center gap-1 mb-1">
                      <Image
                        src="/icons/currency/dirham.svg"
                        alt="AED"
                        width={14}
                        height={12}
                        className="inline-block w-[14px] h-[12px] lg:w-[16px] lg:h-[14px]"
                      />

                      <span className="font-semibold text-sm text-black">
                        {totalPrice.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs text-[#666]">Order ID: #{group.displayId}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* COMPLETED Section */}
      <div className="mb-6 lg:mb-8 px-3 py-4 lg:px-5 lg:py-5 bg-[#EBE3D6] border border-[#EBE3D6]  overflow-hidden">
        <h2 className="font-orbitron font-bold text-xs lg:text-sm uppercase tracking-wider text-black mb-3 lg:mb-4">
          Completed
        </h2>

        <div className="space-y-3 lg:space-y-4">
          {completedGroups.map((group: any, index: any) => {
            const firstItem = group.items?.[0];
            const price = group.totalAmount;

            // Status from the most relevant sub-order
            const activeOrder = group.subOrders.find((o: any) => ["delivered", "returned"].includes(o.order_status)) || group.subOrders[0];
            const statusText = formatStatusText(activeOrder);

            // Use product image from relation, or legacy image, or placeholder
            const image = firstItem?.product?.image || firstItem?.image || "/placeholder.jpg";
            const baseName = firstItem?.product?.name || firstItem?.product_name || firstItem?.name || `Order ${group.displayId}`;
            const extraCount = group.items?.length - 1;
            const title = extraCount > 0 ? `${baseName} + ${extraCount} products` : baseName;

            return (
              <div key={index} className="bg-[#F0EBE3] border border-[#C2B280] overflow-hidden">
                {/* Order Header - Mobile */}
                <div className="lg:hidden px-3 py-3">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-start gap-2">
                      {activeOrder.order_status === "delivered" ? (
                        <div className="w-5 h-5 bg-[#27AE60] rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg width="12" height="8" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 bg-[#C2B280] rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Image src="/order/Frame12.png" alt="Status" width={12} height={12} />
                        </div>
                      )}
                      <p className="text-sm text-black leading-tight">{statusText}</p>
                    </div>
                    <div className="relative">
                      <button
                        className="text-[#666] hover:text-black p-1 flex-shrink-0"
                        onClick={() => setOpenDropdown(openDropdown === `completed-${index}` ? null : `completed-${index}`)}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openDropdown === `completed-${index}` && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#EBE3D6] border border-[#E2DACB] rounded-lg shadow-lg z-10 overflow-visible">
                          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#333] hover:bg-[#F5F5F5]">
                            <Image src="/order/Frame9.png" alt="Tracking" width={16} height={16} />
                            Tracking Details
                          </button>
                          <button
                            onClick={() => router.push(`/orders/summary/${group.id}`)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#333] hover:bg-[#F5F5F5]"
                          >
                            <Image src="/order/Frame10.png" alt="Order Summary" width={16} height={16} />
                            Order Details
                          </button>
                          <button
                            onClick={() => {
                              setShowSupportPanel(true);
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#333] hover:bg-[#F5F5F5]"
                          >
                            <Image src="/order/Frame11.png" alt="Help" width={16} height={16} />
                            Need Help?
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Track Refund Button - Mobile with angled sides */}
                  {activeOrder.order_status === "cancelled" && (
                    <div className="w-full p-[1px] clip-path-supplier bg-[#C2B280]">
                      <button
                        onClick={() => router.push(`/orders/refund/${activeOrder.id}`)}
                        className="w-full bg-[#F0EBE3] hover:bg-[#E8E3DB] text-[#333] clip-path-supplier flex items-center justify-center py-2.5 transition-colors"
                      >
                        <span className="font-bold text-[11px] font-orbitron uppercase tracking-wide">
                          Track Refund
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Order Header - Desktop */}
                <div className="hidden lg:flex px-5 py-4 items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    {activeOrder.order_status === "delivered" ? (
                      <div className="w-6 h-6 bg-[#27AE60] rounded flex items-center justify-center flex-shrink-0">
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-[#C2B280] rounded flex items-center justify-center flex-shrink-0">
                        <Image src="/order/Frame12.png" alt="Status" width={14} height={14} />
                      </div>
                    )}
                    <p className="text-sm text-black truncate">{statusText}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {activeOrder.order_status === "cancelled" && (
                      <div className="relative clip-path-supplier bg-[#C2B280] p-[1px]">
                        <button
                          onClick={() => router.push(`/orders/refund/${activeOrder.id}`)}
                          className="bg-[#F5F0E6] text-[#333333] clip-path-supplier flex items-center justify-center px-8 h-[36px] hover:bg-[#EBE6DC] transition-colors"
                        >
                          <span className="font-semibold text-[12px] font-orbitron uppercase leading-none tracking-normal whitespace-nowrap">
                            Track Refund
                          </span>
                        </button>
                      </div>
                    )}
                    <div className="relative">
                      <button
                        className="text-[#666] hover:text-black p-1"
                        onClick={() => setOpenDropdown(openDropdown === `completed-${index}` ? null : `completed-${index}`)}
                      >
                        <MoreVertical size={20} />
                      </button>
                      {openDropdown === `completed-${index}` && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#EBE3D6] border border-[#E2DACB] rounded-lg shadow-lg z-10 overflow-hidden">
                          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#333] hover:bg-[#F5F5F5] transition-colors">
                            <Image src="/order/Frame9.png" alt="Tracking" width={16} height={16} />
                            Tracking Details
                          </button>
                          <button
                            onClick={() => router.push(`/orders/summary/${group.id}`)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#333] hover:bg-[#F5F5F5] transition-colors"
                          >
                            <Image src="/order/Frame10.png" alt="Order Summary" width={16} height={16} />
                            Order Details
                          </button>
                          <button
                            onClick={() => {
                              setShowSupportPanel(true);
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#333] hover:bg-[#F5F5F5] transition-colors"
                          >
                            <Image src="/order/Frame11.png" alt="Help" width={16} height={16} />
                            Need Help?
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-3 lg:mx-5 border-b border-[#C2B280]"></div>

                {/* Order Content */}
                <div
                  className="p-3 lg:p-5 flex items-start gap-3 lg:gap-10 cursor-pointer hover:bg-[#EAEAEA] transition-colors"
                  onClick={() => router.push(`/orders/summary/${group.id}`)}
                >
                  <img
                    src={image}
                    alt={title}
                    className="w-16 h-16 lg:w-20 lg:h-20 object-contain flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs lg:text-sm font-medium text-black mb-1 line-clamp-2">
                      {title}
                    </h3>
                    <div className="flex items-center gap-1 mb-2 lg:mb-0">
                      <Image
                        src="/icons/currency/dirham.svg"
                        alt="AED"
                        width={14}
                        height={12}
                        className="flex-shrink-0 w-[12px] h-[10px] lg:w-[14px] lg:h-[12px]"
                      />
                      <span className="font-semibold text-xs lg:text-sm text-black">
                        {price.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-[10px] lg:text-xs text-[#666] lg:hidden">Order ID: #{group.displayId}</p>
                  </div>
                  <p className="hidden lg:block text-xs text-[#666] flex-shrink-0">Order ID: #{group.displayId}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Orders Support Panel */}
      <OrdersSupportPanel
        isOpen={showSupportPanel}
        onClose={() => setShowSupportPanel(false)}
      />
    </main>
  );
}
