"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import CartItem from "./CartItem";
import OrderSummary from "./OrderSummary";
import { useEffect, useMemo, useState } from "react";
import { Typography } from "../ui";
import SimilarProductCard from "../product/SimilarProductCard";
import { Container } from "../ui";
import SelectAddressModal from "../modal/SelectAddressModal";
import api from "@/lib/api";
import { useCartStore } from "@/lib/cart-store";
import {
  hydrateCartFromServer,
  pushLocalCartToServer,
  syncRemoveFromServer,
  syncUpdateQtyToServer,
} from "@/lib/cart-sync";
import { Address } from "@/lib/types";
import { getAccessToken } from "@/lib/api";
import { useAddressStore } from "@/lib/address-store";

type UiCartItem = {
  id: number;
  title: string;
  image?: string;
  part?: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  qty: number;
  stock?: string;
};

export default function CartPage() {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  // Using persisted store; no async loading needed
  const [error, setError] = useState<string | null>(null);
  const storeItems = useCartStore((s) => s.items);
  const updateQtyStore = useCartStore((s) => s.updateQty);
  const removeItemStore = useCartStore((s) => s.removeItem);
  const router = useRouter();

  // No loading effect required; store hydrates client-side

  const items: UiCartItem[] = useMemo(() => {
    return (storeItems || []).map((i) => ({
      id: i.id as any,
      title: i.name,
      image: i.image,
      part: i.sku ? `#${i.sku}` : undefined,
      price: Number(i.price ?? 0),
      qty: Number(i.qty ?? 1),
      stock:
        typeof i.stock === "number"
          ? i.stock > 0
            ? "In Stock"
            : "Out of Stock"
          : undefined,
    }));
  }, [storeItems]);

  const handleCheckout = async () => {
    if (!address) {
       setShowAddressModal(true);
       return;
    }
    
    setIsCheckoutLoading(true);
    try {
       const res: any = await api.checkout.createSession();
       const data = res.data || res;
       
       if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
       } else if (data.requiresApproval) {
          router.push('/profile/orders'); 
       } else {
          console.error("Unknown checkout response", res);
          setError("Unexpected response from server");
       }
    } catch (e: any) {
        console.error("Checkout failed", e);
        setError(e.message || "Checkout failed");
    } finally {
        setIsCheckoutLoading(false);
    }
  };

  const updateQty = async (id: number, newQty: number) => {
    try {
      updateQtyStore(String(id), newQty);
      const pid = Number(id);
      if (Number.isFinite(pid)) {
        await syncUpdateQtyToServer(pid, newQty);
      }
    } catch (e: any) {
      console.error("Update qty failed", e);
    }
  };

  const removeItem = async (id: number) => {
    try {
      removeItemStore(String(id));
      const pid = Number(id);
      if (Number.isFinite(pid)) {
        await syncRemoveFromServer(pid);
      }
    } catch (e: any) {
      console.error("Remove item failed", e);
    }
  };
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.qty * i.price, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );


  // On mount: Always hydrate from server (Source of Truth) to match Stripe/DB
  useEffect(() => {
    (async () => {
      try {
        await hydrateCartFromServer();
      } catch (e) {
          console.error("Cart hydration failed", e);
      }
    })();
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Store hooks
  const fetchAddresses = useAddressStore((s) => s.fetchAddresses);
  const addresses = useAddressStore((s) => Array.isArray(s.addresses) ? s.addresses : []);
  const selectedId = useAddressStore((s) => s.selectedId);
  
  // Derived state
  const address = useMemo(() => 
    addresses.find((a) => a.id === selectedId) || null, 
    [addresses, selectedId]
  );

  useEffect(() => {
    // Check auth on mount to avoid hydration mismatch
    const token = getAccessToken();
    const logged = !!token;
    setIsLoggedIn(logged);

    if (logged) {
        // Fetch addresses on mount (store handles caching/updating)
        fetchAddresses();
    }
  }, []);

  return (

    <section className="bg-[#F0EBE3]">
      <div className=" max-w-[1660px] mx-auto px-6 py-10">
        <Link href="/products" className="inline-flex items-center text-[#D34D24] hover:text-[#B84A00] font-orbitron font-bold uppercase mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Continue Shopping
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                {/* Delivery Address Section */}
                <div className="mb-10">
                   <div className="flex items-center justify-between mb-3">
                       <h2 className="font-orbitron font-bold text-[36px] text-black leading-[100%] tracking-[0%] uppercase">
                          Delivery Address
                       </h2>
                  </div>
                  <div className="bg-[#EBE3D6] p-5 text-black border border-[#E2DACB] flex items-center justify-between">
                    <div>
                      {address ? (
                        <>
                          <p className="text-sm font-semibold">Deliver to: {address.label}</p>
                          <p className="text-[14px] text-[#6E6E6E] mt-1">
                            {address.addressLine1}
                            {address.addressLine2 ? `, ${address.addressLine2}` : ""}, {address.city}, {address.state} - {address.postalCode}, {address.country}
                          </p>
                        </>
                      ) : (
                        <p className="text-[14px] text-[#6E6E6E] mt-1">
                            {isLoggedIn ? "No address selected. Please select an address." : "Please login to manage your addresses."}
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={() => setShowAddressModal(true)} 
                      className="bg-[#D34D24] text-white font-orbitron font-bold text-[14px] uppercase px-6 py-2 relative clip-path-[polygon(10%_0%,100%_0%,90%_100%,0%_100%)] hover:bg-[#B84A00] transition-colors ml-4 shrink-0"
                    >
                      CHANGE
                    </button>
                  </div>
                </div>

                <h1 className="font-orbitron font-bold text-[36px] text-black leading-[100%] tracking-[0%] uppercase mb-6">
                  MY CART{" "}
                  <span
                    className="text-[#737373] normal-case"
                    style={{
                      fontFamily: "Inter sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "16px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                    }}>
                    ({itemCount} {itemCount === 1 ? "item" : "items"})
                  </span>
                </h1>

                <div className="space-y-5 p-5 bg-[#EBE3D6]">
                    {error && <div className="text-red-600">{error}</div>}
                    {!error && items.length === 0 && (
                    <div className="text-[#737373]">Your cart is empty.</div>
                    )}
                    {items.map((item) => (
                    <CartItem
                        key={item.id}
                        data={item}
                        updateQty={updateQty}
                        removeItem={removeItem}
                    />
                    ))}
                </div>
            </div>

            {items.length > 0 && (
            <div className="mt-10 lg:mt-0 lg:sticky lg:top-36 self-start bg-[#EBE3D6]">
                <OrderSummary
                subtotal={subtotal}
                itemCount={itemCount}
                onCheckout={
                    isLoggedIn ? handleCheckout : () => router.push("/login")
                }
                buttonText={isLoggedIn ? (subtotal >= 10000 ? "REQUEST PURCHASE" : "CHECKOUT") : "LOGIN TO CONTINUE"}
                isLoading={isCheckoutLoading}
                />
            </div>
            )}
        </div>
      </div>

      {showAddressModal && (
        <SelectAddressModal 
          onClose={() => setShowAddressModal(false)}
        />
      )}
    </section>
  );
}
