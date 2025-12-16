"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddNewAddressPage() {
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPickupPoints, setShowPickupPoints] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(
    "Al Qusais Industrial Area 3, Damascus Street, Dubai, United Arab Emirates"
  );

  const defaultLocation: [number, number] = [25.2048, 55.2708];

  // Reverse geocode function
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      const data = await res.json();
      if (data?.display_name) {
        setSelectedAddress(data.display_name);
      }
    } catch (e) {
      console.error("Reverse geocode failed", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initMap = () => {
      if (!isMounted || !mapContainerRef.current || !window.L) return;
      if (mapInstanceRef.current) return; // Already initialized

      try {
        // Clear any previous Leaflet instance
        const container = mapContainerRef.current as any;
        if (container._leaflet_id) {
          container._leaflet_id = null;
        }

        // Create map
        const map = window.L.map(mapContainerRef.current).setView(defaultLocation, 14);
        mapInstanceRef.current = map;

        // Add tile layer
        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap",
        }).addTo(map);

        // Add draggable marker
        const marker = window.L.marker(defaultLocation, { draggable: true }).addTo(map);
        markerInstanceRef.current = marker;

        // Marker drag event
        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          reverseGeocode(pos.lat, pos.lng);
        });

        // Map click event
        map.on("click", (e: any) => {
          marker.setLatLng([e.latlng.lat, e.latlng.lng]);
          reverseGeocode(e.latlng.lat, e.latlng.lng);
        });

        // Resize fix
        setTimeout(() => {
          if (map && isMounted) {
            map.invalidateSize();
          }
        }, 200);

        if (isMounted) {
          setIsMapLoaded(true);
        }
      } catch (error) {
        console.error("Map init error:", error);
      }
    };

    // Load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const css = document.createElement("link");
      css.id = "leaflet-css";
      css.rel = "stylesheet";
      css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(css);
    }

    // Load Leaflet JS
    const loadLeaflet = () => {
      if (window.L) {
        initMap();
        return;
      }

      const existingScript = document.getElementById("leaflet-js");
      if (existingScript) {
        // Wait for existing script to load
        existingScript.addEventListener("load", initMap);
        return;
      }

      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => {
        if (isMounted) {
          initMap();
        }
      };
      script.onerror = () => {
        console.error("Failed to load Leaflet");
      };
      document.body.appendChild(script);
    };

    // Start loading after a small delay
    const timer = setTimeout(loadLeaflet, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // ignore
        }
        mapInstanceRef.current = null;
        markerInstanceRef.current = null;
      }
    };
  }, []);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        if (mapInstanceRef.current && markerInstanceRef.current) {
          mapInstanceRef.current.setView(loc, 16);
          markerInstanceRef.current.setLatLng(loc);
          reverseGeocode(loc[0], loc[1]);
        }
      },
      (err) => {
        setIsLoading(false);
        alert("Could not get your location. Please enable location services.");
      }
    );
  };

  const handleConfirmLocation = () => {
    localStorage.setItem("newAddress", JSON.stringify({ address: selectedAddress }));
    router.push("/address/details");
  };

  return (
    <main className="flex-1">
      <Link
        href="/address"
        className="inline-flex items-center gap-2 text-[#666] hover:text-black transition-colors mb-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="font-inter text-sm">Back to Addresses</span>
      </Link>

      <h1 className="font-orbitron font-black text-xl lg:text-[32px] uppercase tracking-wide text-black">
        Add New Address
      </h1>
      <p className="font-inter text-sm text-[#666] mt-1 mb-4">
        Select your location on the map for faster delivery
      </p>

      <div className="bg-[#EBE3D6] border border-[#E8E3D9] p-4">
        {/* Toggle */}
        <div className="flex items-center justify-end gap-2 mb-3">
          <button
            onClick={() => setShowPickupPoints(!showPickupPoints)}
            className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${
              showPickupPoints ? "bg-[#D35400]" : "bg-[#C2B280]"
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${
                showPickupPoints ? "translate-x-[22px] left-0.5" : "translate-x-0 left-0.5"
              }`}
            />
          </button>
          <span className="font-inter text-sm text-black">Show pickup points</span>
          <Image src="/order/Frame4.png" alt="Pickup" width={20} height={20} className="object-contain" />
        </div>

        {/* Address */}
        <div className="bg-white border border-[#E8E3D9] px-4 py-3 mb-4 flex items-center gap-2">
          {isLoading && (
            <svg className="animate-spin h-4 w-4 text-[#D35400] flex-shrink-0" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          )}
          <span className="font-inter text-sm text-black">{selectedAddress}</span>
        </div>

        {/* Map */}
        <div
          ref={mapContainerRef}
          className="w-full h-[350px] lg:h-[400px] bg-[#E8E3D9] relative"
          style={{ minHeight: "350px", zIndex: 0 }}
        >
          {!isMapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#F0EBE3] z-10">
              <div className="text-center">
                <svg className="animate-spin h-8 w-8 text-[#D35400] mx-auto mb-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <p className="font-inter text-sm text-[#666]">Loading map...</p>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handleLocateMe}
            disabled={isLoading || !isMapLoaded}
            className="flex items-center gap-2 bg-white border border-[#E8E3D9] px-4 py-2 hover:bg-[#F5F5F5] transition-colors disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="7.5" stroke="#D35400" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="3" stroke="#D35400" strokeWidth="1.5"/>
              <path d="M12 4.5V2M12 22V19.5M4.5 12H2M22 12H19.5" stroke="#D35400" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="font-orbitron font-black text-[13px] uppercase text-black">Locate Me</span>
          </button>

          <button
            onClick={handleConfirmLocation}
            className="bg-[#D35400] hover:bg-[#39482C] text-white clip-path-supplier flex items-center justify-center h-[40px] px-6 cursor-pointer transition-colors"
          >
            <span className="font-black text-[13px] font-orbitron uppercase">Confirm Location</span>
          </button>
        </div>
      </div>
    </main>
  );
}

// Add Leaflet types to Window
declare global {
  interface Window {
    L: any;
  }
}
