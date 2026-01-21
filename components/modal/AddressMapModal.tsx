"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const DEFAULT_LOCATION: [number, number] = [25.2048, 55.2708];

interface AddressMapModalProps {
  onClose: () => void;
  onConfirmLocation: (address: string) => void;
}

export default function AddressMapModal({ onClose, onConfirmLocation }: AddressMapModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPickupPoints, setShowPickupPoints] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(
    "Al Qusais Industrial Area 3, Damascus Street, Dubai, United Arab Emirates"
  );
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        { headers: { "Accept-Language": "en" } }
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
      if (mapInstanceRef.current) return;

      try {
        const container = mapContainerRef.current as any;
        if (container._leaflet_id) container._leaflet_id = null;

        const map = window.L.map(mapContainerRef.current).setView(DEFAULT_LOCATION, 14);
        mapInstanceRef.current = map;

        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap",
        }).addTo(map);

        const marker = window.L.marker(DEFAULT_LOCATION, { draggable: true }).addTo(map);
        markerInstanceRef.current = marker;

        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          reverseGeocode(pos.lat, pos.lng);
        });

        map.on("click", (e: any) => {
          marker.setLatLng([e.latlng.lat, e.latlng.lng]);
          reverseGeocode(e.latlng.lat, e.latlng.lng);
        });

        setTimeout(() => {
          if (map && isMounted) map.invalidateSize();
        }, 200);

        if (isMounted) setIsMapLoaded(true);
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

    const loadLeaflet = () => {
      if (window.L) {
        initMap();
        return;
      }
      const existingScript = document.getElementById("leaflet-js");
      if (existingScript) {
        existingScript.addEventListener("load", initMap);
        return;
      }
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => { if (isMounted) initMap(); };
      script.onerror = () => { console.error("Failed to load Leaflet"); };
      document.body.appendChild(script);
    };

    const timer = setTimeout(loadLeaflet, 100);
    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try { mapInstanceRef.current.remove(); } catch {}
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
      () => {
        setIsLoading(false);
        alert("Could not get your location. Please enable location services.");
      }
    );
  };

  const confirmAndProceed = () => {
    onConfirmLocation(selectedAddress);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    try {
      setSearching(true);
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=json&addressdetails=1&limit=1`;
      const res = await fetch(url, { headers: { "Accept-Language": "en" } });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const first = data[0];
        const lat = parseFloat(first.lat);
        const lon = parseFloat(first.lon);
        const display = first.display_name as string;
        if (Number.isFinite(lat) && Number.isFinite(lon)) {
          // Move map & marker
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([lat, lon], 16);
          }
          if (markerInstanceRef.current) {
            markerInstanceRef.current.setLatLng([lat, lon]);
          }
          setSelectedAddress(display);
        }
      }
    } catch (err) {
      console.error("Geocoding search failed", err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-[#EBE3D6] w-full max-w-[900px] max-h-[85vh] flex flex-col rounded-md border border-[#E2DACB] shadow-lg animate-fadeIn overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2DACB] flex items-center justify-between shrink-0">
          <h2 className="font-orbitron font-bold text-[22px] uppercase text-black">Add New Address</h2>
          <button onClick={onClose} className="text-[#515151] hover:text-black transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="bg-white flex-1 overflow-y-auto p-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="mb-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search a place, city or address"
                className="flex-1 bg-[#F0EBE3] border border-[#C2B280] px-3 py-2 text-sm text-black outline-none"
              />
              <button
                type="submit"
                disabled={searching}
                className="bg-[#D35400] hover:bg-[#39482C] text-white h-10 px-4 transition-colors disabled:opacity-50"
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </div>
          </form>
         
         
          {/* Address */}
          <div className="bg-white border border-[#E8E3D9] px-4 py-3 mb-4 flex items-center gap-2">
            {isLoading && (
              <svg className="animate-spin h-4 w-4 text-[#D35400] shrink-0" viewBox="0 0 24 24">
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
              onClick={confirmAndProceed}
              className="bg-[#D35400] hover:bg-[#39482C] text-white clip-path-supplier flex items-center justify-center h-10 px-6 cursor-pointer transition-colors"
            >
              <span className="font-black text-[13px] font-orbitron uppercase">Confirm Location</span>
            </button>
          </div>
        </div>

        {/* <div className="p-6 border-t border-[#E2DACB] flex justify-end gap-4 shrink-0 bg-[#EBE3D6]">
          <button
            className="bg-[#C8C0A8] text-black font-semibold text-[14px] px-10 py-2 relative clip-path-[polygon(7%_0%,100%_0%,93%_100%,0%_100%)]"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
        </div> */}
      </div>
    </div>
  );
}

declare global {
  interface Window { L: any }
}
