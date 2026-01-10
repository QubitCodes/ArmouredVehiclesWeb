"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getAddresses,
  deleteAddress,
  setDefaultAddress,
} from "@/app/services/address";
import { Address } from "@/lib/types";

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  /* ---------------- LOAD ADDRESSES ---------------- */
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const res = await getAddresses();
        setAddresses(res.data);
      } catch (err) {
        console.error("Failed to fetch addresses", err);
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, []);

  /* ---------------- DELETE ADDRESS ---------------- */
  const handleDelete = async (id: number) => {
    try {
      await deleteAddress(id);
      setAddresses(prev => prev.filter(addr => addr.id !== id));
    } catch (err) {
      console.error("Failed to delete address", err);
    }
  };

  /* ---------------- SET DEFAULT ADDRESS ---------------- */
  const handleSetDefault = async (id: number) => {
    try {
      setUpdatingId(id);
      await setDefaultAddress(id);

      // Optimistic update
      setAddresses(prev =>
        prev.map(addr => ({
          ...addr,
          isDefault: addr.id === id,
        }))
      );
    } catch (err) {
      console.error("Failed to set default address", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const defaultAddress = addresses.find(a => a.isDefault);
  const otherAddresses = addresses.filter(a => !a.isDefault);

  return (
    <main className="flex-1 text-black p-6 lg:p-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-orbitron font-black text-xl lg:text-[32px] uppercase">
          Addresses
        </h1>
        <p className="font-inter text-sm text-[#666] mt-1">
          Manage your saved addresses for quicker checkout.
        </p>
      </div>

      {/* Add New Address */}
      <div className="mb-8">
        <Link href="/address/new">
          <button className="bg-[#D35400] hover:bg-[#39482C] text-white h-10 px-6">
            <span className="font-black text-[13px] font-orbitron uppercase">
              Add New Address
            </span>
          </button>
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <p className="font-inter text-sm text-[#666]">
          Loading addresses...
        </p>
      )}

      {/* Default Address */}
      {!loading && defaultAddress && (
        <div className="mb-8">
          <h2 className="font-orbitron font-black uppercase mb-4">
            Default Address
          </h2>

          <AddressCard
            address={defaultAddress}
            updating={updatingId === defaultAddress.id}
            onDelete={handleDelete}
            onSetDefault={handleSetDefault}
          />
        </div>
      )}

      {/* Other Addresses */}
      {!loading && (
        <div>
          <h2 className="font-orbitron font-black uppercase mb-4">
            Other Addresses
          </h2>

          {otherAddresses.length === 0 ? (
            <p className="font-inter text-sm text-[#666]">
              No other addresses saved.
            </p>
          ) : (
            <div className="space-y-4">
              {otherAddresses.map(address => (
                <AddressCard
                  key={address.id}
                  address={address}
                  updating={updatingId === address.id}
                  onDelete={handleDelete}
                  onSetDefault={handleSetDefault}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

/* ---------------- ADDRESS CARD ---------------- */
function AddressCard({
  address,
  onDelete,
  onSetDefault,
  updating,
}: {
  address: Address;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
  updating: boolean;
}) {
  return (
    <div className="bg-[#EBE3D6] border border-[#E8E3D9] p-5">
      <div className="flex justify-between mb-4">
        <h3 className="font-inter font-semibold">
          {address.label}
        </h3>

        <div className="flex gap-4">
          <button
            onClick={() => onDelete(address.id)}
            className="text-sm underline text-[#666] hover:text-[#D35400]"
          >
            Delete
          </button>

          <Link
            href={`/address/edit/${address.id}`}
            className="text-sm underline text-[#666] hover:text-[#D35400]"
          >
            Edit
          </Link>

          {!address.isDefault && (
            <button
              disabled={updating}
              onClick={() => onSetDefault(address.id)}
              className="text-sm text-[#D35400] font-semibold"
            >
              {updating ? "Setting..." : "Set Default"}
            </button>
          )}
        </div>
      </div>

      <p className="text-sm">
        <b>Name:</b> {address.fullName}
      </p>

      <p className="text-sm">
        <b>Address:</b>{" "}
        {address.addressLine1}
        {address.addressLine2 && `, ${address.addressLine2}`},{" "}
        {address.city}, {address.state} - {address.postalCode}
      </p>

      <p className="text-sm">
        <b>Country:</b> {address.country}
      </p>

      <p className="text-sm">
        <b>Phone:</b> {address.phone}
      </p>
    </div>
  );
}
