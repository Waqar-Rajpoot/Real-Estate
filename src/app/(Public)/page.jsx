"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// ── shadcn carousel ───────────────────────────────────────────────────────────
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// ── RegisterInterestButton (owns all WhatsApp logic — DRY) ────────────────────
import RegisterInterestButton from "@/components/property/RegisterInterestButton";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Pin: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Bed: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16" /><path d="M2 8h18a2 2 0 012 2v10" /><path d="M2 17h20" /><path d="M6 8v9" />
    </svg>
  ),
  Bath: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6L9 2a1 1 0 012 0v4" /><path d="M3 14a7 7 0 1014 0H3z" /><path d="M3 14v4" /><path d="M21 14v4" />
    </svg>
  ),
  Area: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8V4h4" /><path d="M4 16v4h4" /><path d="M16 4h4v4" /><path d="M16 20h4v-4" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Shield: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Star: () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Close: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

// ─── Static constants (from PropertySchema enums) ─────────────────────────────

// Fallback shown immediately; Google Places API results replace this list
// once the Maps JS SDK finishes loading on the client.
const FALLBACK_CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan",
  "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Hyderabad", "Abbottabad",
  "Bahawalpur", "Sargodha", "Sukkur", "Sahiwal", "Gujrat", "Sheikhupura",
  "Rahim Yar Khan", "Jhang",
];

const PROPERTY_TYPE_MAP = {
  Residential: [
    "Apartment", "House", "Villa", "Townhouse", "Penthouse", "Upper Portion",
    "Lower Portion", "Farm House", "Room", "Annexe", "Hotel Apartment",
  ],
  Commercial: [
    "Office", "Shop", "Warehouse", "Building", "Floor", "Labour Camp",
    "Bulk Unit", "Factory", "Showroom", "Other Commercial",
  ],
  Plots: [
    "Residential Plot", "Commercial Plot", "Agricultural Land",
    "Industrial Plot", "Industrial Land", "Mixed Use Land", "Plot File", "Land",
  ],
};

const ALL_TYPES       = Object.values(PROPERTY_TYPE_MAP).flat();
const BEDROOM_OPTIONS  = ["Studio", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];
const BATHROOM_OPTIONS = ["1", "2", "3", "4", "5", "6+"];

const PRICE_RANGES_SALE = [
  { label: "Under 50 Lakh",   min: 0,         max: 5_000_000   },
  { label: "50L – 1 Crore",   min: 5_000_000,   max: 10_000_000  },
  { label: "1 – 2 Crore",     min: 10_000_000,  max: 20_000_000  },
  { label: "2 – 5 Crore",     min: 20_000_000,  max: 50_000_000  },
  { label: "5 – 10 Crore",    min: 50_000_000,  max: 100_000_000 },
  { label: "Above 10 Crore",  min: 100_000_000, max: null        },
];

const PRICE_RANGES_RENT = [
  { label: "Under 25K/mo",  min: 0,       max: 25_000  },
  { label: "25K – 50K/mo",  min: 25_000,  max: 50_000  },
  { label: "50K – 1L/mo",   min: 50_000,  max: 100_000 },
  { label: "1L – 2L/mo",    min: 100_000, max: 200_000 },
  { label: "Above 2L/mo",   min: 200_000, max: null    },
];

const AREA_RANGES = [
  { label: "Under 5 Marla",       min: 0,  max: 5    },
  { label: "5 – 10 Marla",        min: 5,  max: 10   },
  { label: "10 Marla – 1 Kanal",  min: 10, max: 20   },
  { label: "1 – 2 Kanal",         min: 20, max: 40   },
  { label: "Above 2 Kanal",       min: 40, max: null  },
];

// Pakistan-specific popular searches (mirrors Bayut's section structure)
const POPULAR_SEARCHES = [
  {
    heading: "Houses for Sale",
    links: [
      { label: "Houses for sale in Karachi",    q: { purpose: "For Sale", type: "House", city: "Karachi"    } },
      { label: "Houses for sale in Lahore",     q: { purpose: "For Sale", type: "House", city: "Lahore"     } },
      { label: "Houses for sale in Islamabad",  q: { purpose: "For Sale", type: "House", city: "Islamabad"  } },
      { label: "Houses for sale in Rawalpindi", q: { purpose: "For Sale", type: "House", city: "Rawalpindi" } },
      { label: "Houses for sale in Faisalabad", q: { purpose: "For Sale", type: "House", city: "Faisalabad" } },
      { label: "Houses for sale in Multan",     q: { purpose: "For Sale", type: "House", city: "Multan"     } },
    ],
  },
  {
    heading: "Plots for Sale",
    links: [
      { label: "Plots in Karachi",           q: { purpose: "For Sale", type: "Residential Plot", city: "Karachi"   } },
      { label: "Plots in Lahore",            q: { purpose: "For Sale", type: "Residential Plot", city: "Lahore"    } },
      { label: "Plots in Islamabad",         q: { purpose: "For Sale", type: "Residential Plot", city: "Islamabad" } },
      { label: "Plots in DHA Lahore",        q: { purpose: "For Sale", type: "Residential Plot", keyword: "DHA Lahore"    } },
      { label: "Plots in Bahria Town",       q: { purpose: "For Sale", type: "Residential Plot", keyword: "Bahria Town"   } },
      { label: "Commercial plots Karachi",   q: { purpose: "For Sale", type: "Commercial Plot",  city: "Karachi"           } },
    ],
  },
  {
    heading: "Apartments & Flats",
    links: [
      { label: "Apartments for rent in Karachi",    q: { purpose: "For Rent", type: "Apartment", city: "Karachi"   } },
      { label: "Apartments for rent in Lahore",     q: { purpose: "For Rent", type: "Apartment", city: "Lahore"    } },
      { label: "Apartments for sale in Islamabad",  q: { purpose: "For Sale", type: "Apartment", city: "Islamabad" } },
      { label: "Studio apartments Islamabad",       q: { purpose: "For Rent", type: "Apartment", city: "Islamabad", bedrooms: "Studio" } },
      { label: "2 bed apartments Lahore",           q: { purpose: "For Rent", type: "Apartment", city: "Lahore",    bedrooms: "2"      } },
      { label: "Luxury apartments Karachi",         q: { purpose: "For Sale", type: "Apartment", city: "Karachi"   } },
    ],
  },
  {
    heading: "Commercial Properties",
    links: [
      { label: "Offices for rent in Karachi",    q: { purpose: "For Rent", type: "Office",    city: "Karachi"   } },
      { label: "Offices for rent in Lahore",     q: { purpose: "For Rent", type: "Office",    city: "Lahore"    } },
      { label: "Shops for sale in Islamabad",    q: { purpose: "For Sale", type: "Shop",      city: "Islamabad" } },
      { label: "Warehouses in Karachi",          q: { purpose: "For Rent", type: "Warehouse", city: "Karachi"   } },
      { label: "Showrooms in Lahore",            q: { purpose: "For Sale", type: "Showroom",  city: "Lahore"    } },
      { label: "Buildings for sale in Karachi",  q: { purpose: "For Sale", type: "Building",  city: "Karachi"   } },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatPrice(price, currency = "PKR") {
  if (!price && price !== 0) return "Price on Call";
  if (price >= 10_000_000) return `${currency} ${(price / 10_000_000).toFixed(2)} Cr`;
  if (price >= 100_000)   return `${currency} ${(price / 100_000).toFixed(1)} Lac`;
  return `${currency} ${price.toLocaleString()}`;
}

// ─── Hook: populate city list from Google Places API ─────────────────────────
// Requires the Maps JavaScript API + Places library to already be loaded via
// <Script src="https://maps.googleapis.com/maps/api/js?key=...&libraries=places" />
// in your layout.jsx. Falls back to FALLBACK_CITIES immediately so the UI is
// never blocked.
function usePakistanCities() {
  const [cities, setCities] = useState(FALLBACK_CITIES);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Wait up to 3 s for the Maps SDK to attach to window.google
    let attempts = 0;
    const MAX    = 30; // 30 × 100 ms = 3 s
    const timer  = setInterval(() => {
      attempts++;
      const places = window?.google?.maps?.places;

      if (places) {
        clearInterval(timer);

        const service = new places.AutocompleteService();
        const found   = new Set(FALLBACK_CITIES);

        // Query a range of broad terms to surface as many PK cities as possible
        const queries = ["city in Punjab Pakistan", "city in Sindh Pakistan", "city in KPK Pakistan", "city in Balochistan Pakistan"];
        let pending   = queries.length;

        queries.forEach(q => {
          service.getQueryPredictions(
            { input: q, componentRestrictions: { country: "pk" } },
            (predictions, status) => {
              pending--;
              if (status === places.PlacesServiceStatus.OK && predictions) {
                predictions.forEach(p => {
                  const name = p.structured_formatting?.main_text;
                  if (name && !found.has(name)) found.add(name);
                });
              }
              if (pending === 0) {
                const merged = Array.from(found).sort();
                if (merged.length > FALLBACK_CITIES.length) setCities(merged);
              }
            }
          );
        });
      }

      if (attempts >= MAX) clearInterval(timer);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return cities;
}

// ══════════════════════════════════════════════════════════════════════════════
// PURE UI COMPONENTS
// Each component is self-contained and receives only the props it needs.
// ══════════════════════════════════════════════════════════════════════════════

// ─── FilterDropdown ───────────────────────────────────────────────────────────
function FilterDropdown({ label, value, onClear, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-semibold transition-all whitespace-nowrap ${
          value
            ? "border-blue-600 bg-blue-50 text-blue-700"
            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
        }`}
      >
        {label}
        {value ? (
          <span
            className="ml-1 text-blue-500 hover:text-red-500 transition-colors"
            onClick={e => { e.stopPropagation(); onClear(); }}
          >
            <Icon.Close />
          </span>
        ) : (
          <Icon.ChevronDown />
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-gray-200/60 min-w-[260px] overflow-hidden">
          <div className="p-4">{children}</div>
        </div>
      )}
    </div>
  );
}

// ─── PillSelector ─────────────────────────────────────────────────────────────
function PillSelector({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(value === opt ? "" : opt)}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
            value === opt
              ? "bg-blue-600 border-blue-600 text-white"
              : "bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ─── PriceRangeSelector ───────────────────────────────────────────────────────
function PriceRangeSelector({ purpose, minPrice, maxPrice, onMinChange, onMaxChange }) {
  const ranges = purpose === "Sale" ? PRICE_RANGES_SALE : PRICE_RANGES_RENT;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Min Price</label>
          <input type="number" placeholder="e.g. 5000000" value={minPrice}
            onChange={e => onMinChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 font-medium" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Max Price</label>
          <input type="number" placeholder="No limit" value={maxPrice}
            onChange={e => onMaxChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 font-medium" />
        </div>
      </div>
      <p className="text-[10px] font-bold text-gray-400 uppercase">Quick Select</p>
      <div className="flex flex-col gap-1">
        {ranges.map(r => (
          <button key={r.label} type="button"
            onClick={() => { onMinChange(r.min ?? ""); onMaxChange(r.max ?? ""); }}
            className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-blue-50 hover:text-blue-600 ${
              String(minPrice) === String(r.min ?? "") && String(maxPrice) === String(r.max ?? "")
                ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-600"
            }`}
          >{r.label}</button>
        ))}
      </div>
    </div>
  );
}

// ─── AreaRangeSelector ────────────────────────────────────────────────────────
function AreaRangeSelector({ minArea, maxArea, onMinChange, onMaxChange }) {
  return (
    <div className="space-y-3 min-w-[240px]">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Min (Marla)</label>
          <input type="number" placeholder="0" value={minArea}
            onChange={e => onMinChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 font-medium" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Max (Marla)</label>
          <input type="number" placeholder="No limit" value={maxArea}
            onChange={e => onMaxChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 font-medium" />
        </div>
      </div>
      <p className="text-[10px] font-bold text-gray-400 uppercase">Quick Select</p>
      <div className="flex flex-col gap-1">
        {AREA_RANGES.map(r => (
          <button key={r.label} type="button"
            onClick={() => { onMinChange(r.min ?? ""); onMaxChange(r.max ?? ""); }}
            className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-blue-50 hover:text-blue-600 ${
              String(minArea) === String(r.min ?? "") && String(maxArea) === String(r.max ?? "")
                ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-600"
            }`}
          >{r.label}</button>
        ))}
      </div>
    </div>
  );
}

// ─── ActiveFilters ────────────────────────────────────────────────────────────
function ActiveFilters({ filters, onRemove, onClearAll }) {
  const labels = [];
  if (filters.city)             labels.push({ key: "city",             label: filters.city });
  if (filters.propertyType)     labels.push({ key: "propertyType",     label: filters.propertyType });
  if (filters.bedrooms)         labels.push({ key: "bedrooms",         label: `${filters.bedrooms} Bed${filters.bedrooms !== "Studio" ? "+" : ""}` });
  if (filters.bathrooms)        labels.push({ key: "bathrooms",        label: `${filters.bathrooms} Bath+` });
  if (filters.minPrice || filters.maxPrice) {
    const p = [filters.minPrice && formatPrice(+filters.minPrice), filters.maxPrice && formatPrice(+filters.maxPrice)].filter(Boolean);
    labels.push({ key: "price", label: `Price: ${p.join(" – ")}` });
  }
  if (filters.minArea || filters.maxArea)
    labels.push({ key: "area", label: `Area: ${filters.minArea || "0"} – ${filters.maxArea || "∞"} Marla` });
  if (filters.completionStatus) labels.push({ key: "completionStatus", label: filters.completionStatus });
  if (filters.furnishing)       labels.push({ key: "furnishing",       label: filters.furnishing });
  if (filters.verifiedOnly)     labels.push({ key: "verifiedOnly",     label: "Verified Only" });

  if (!labels.length) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap mt-3 px-3 pb-3">
      <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Active:</span>
      {labels.map(l => (
        <span key={l.key} className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
          {l.label}
          <button type="button" onClick={() => onRemove(l.key)} className="hover:text-red-500 transition-colors ml-0.5">
            <Icon.Close />
          </button>
        </span>
      ))}
      <button type="button" onClick={onClearAll} className="text-xs font-bold text-gray-400 hover:text-red-500 underline transition-colors">
        Clear all
      </button>
    </div>
  );
}

// ─── PropertyCard ─────────────────────────────────────────────────────────────
// All WhatsApp logic has been removed from this file.
// RegisterInterestButton handles it internally (DRY).
function PropertyCard({ property }) {
  const propId     = property._id?.$oid || property._id;
  const mainImage  = property.images?.[0]?.originalUrl;
  const city       = property.location?.city || "";
  const area       = property.location?.area || property.location?.community || "";
  const address    = [area, city].filter(Boolean).join(", ");
  const isVerified = property.verification?.isTruCheck;

  return (
    <Link href={`/properties/${propId}`} className="group block h-full">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 h-full flex flex-col">

        {/* ── Image ── */}
        <div className="relative h-52 w-full overflow-hidden bg-gray-100 flex-shrink-0">
          {mainImage ? (
            <Image src={mainImage} alt={property.title} fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={property.boostLevel === "Platinum"} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-300 text-sm">No image</span>
            </div>
          )}

          {/* Purpose + Verified badges */}
          <div className="absolute top-3 left-3 flex gap-1.5 z-10">
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm ${
              property.purpose === "For Sale" ? "bg-blue-600 text-white" : "bg-emerald-500 text-white"
            }`}>{property.purpose}</span>
            {isVerified && (
              <span className="flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full bg-white/95 text-blue-700 shadow-sm border border-blue-100">
                <Icon.Shield /> Verified
              </span>
            )}
          </div>

          {/* Boost badge */}
          {property.boostLevel && property.boostLevel !== "None" && (
            <div className="absolute top-3 right-3 z-10">
              <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full shadow-sm ${
                property.boostLevel === "Platinum" ? "bg-violet-600 text-white"
                : property.boostLevel === "Premium"  ? "bg-amber-500 text-white"
                : "bg-gray-800 text-white"
              }`}><Icon.Star /> {property.boostLevel}</span>
            </div>
          )}

          {/* Price overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10">
            <p className="text-white font-black text-lg leading-none">
              {property.priceLabel === "Price on Call"
                ? "Price on Call"
                : formatPrice(property.price, property.currency)}
              {property.purpose === "For Rent" && property.rentFrequency && (
                <span className="text-xs font-normal ml-1 opacity-80">/{property.rentFrequency}</span>
              )}
            </p>
            {property.priceLabel === "Starting From" && (
              <p className="text-white/70 text-[10px] font-medium mt-0.5">Starting from</p>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="text-blue-600 text-[10px] font-black uppercase tracking-wider">
              {property.category} · {property.propertyType}
            </span>
            {property.completionStatus === "Off-plan" && (
              <span className="text-[9px] font-black px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-full uppercase whitespace-nowrap">
                Off-plan
              </span>
            )}
          </div>

          <h3 className="font-bold text-gray-900 text-base mb-1.5 line-clamp-1 group-hover:text-blue-600 transition-colors leading-snug">
            {property.title}
          </h3>

          <p className="text-gray-400 text-xs mb-3 flex items-center gap-0.5 line-clamp-1">
            <Icon.Pin size={12} />{address || "Pakistan"}
          </p>

          {/* Specs row */}
          <div className="flex items-center gap-3 text-gray-500 text-xs border-t border-gray-50 pt-3 mb-3">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1 font-semibold"><Icon.Bed />{property.bedrooms} Beds</span>
            )}
            {property.bathrooms > 0 && (
              <span className="flex items-center gap-1 font-semibold"><Icon.Bath />{property.bathrooms} Baths</span>
            )}
            <span className="flex items-center gap-1 font-semibold">
              <Icon.Area />{property.area} {property.areaUnit}
            </span>
          </div>

          {/*
            ── Register Interest ──────────────────────────────────────────────
            e.preventDefault() + e.stopPropagation() on the wrapper stops the
            parent <Link> from navigating to the detail page when the button
            is clicked, while still allowing the card itself to be tapped.
          */}
          <div
            className="mt-auto"
            onClick={e => { e.preventDefault(); e.stopPropagation(); }}
          >
            <RegisterInterestButton property={property} compact />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── FeaturedSection ──────────────────────────────────────────────────────────
function FeaturedSection({ properties, loading }) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header row */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <p className="text-blue-600 text-xs font-black uppercase tracking-widest mb-2">Hand-Picked For You</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Featured Listings</h2>
            <div className="h-1 w-16 bg-blue-600 rounded-full" />
            <p className="text-gray-400 mt-3 text-sm max-w-md leading-relaxed">
              Vetted, verified, and ready for you. Every listing here has passed our authenticity check.
            </p>
          </div>
          <Link
            href="/properties"
            className="text-blue-600 text-sm font-black border-b-2 border-blue-600 pb-0.5 hover:text-blue-800 hover:border-blue-800 transition-all whitespace-nowrap"
          >
            View All Properties →
          </Link>
        </div>

        {/* Skeleton */}
        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="min-w-[280px] h-[420px] bg-gray-200 rounded-2xl animate-pulse flex-shrink-0" />
            ))}
          </div>
        ) : properties.length > 0 ? (
          /* shadcn Carousel */
          <Carousel opts={{ align: "start", loop: false }} className="w-full">
            <CarouselContent className="-ml-4">
              {properties.map(prop => (
                <CarouselItem
                  key={prop._id?.$oid || prop._id}
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  {/* Wrap in a fixed-height container so all cards are equal */}
                  <div className="h-full">
                    <PropertyCard property={prop} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-5 bg-white border-gray-200 shadow-md hover:bg-blue-50 hover:border-blue-300 transition-all" />
            <CarouselNext    className="hidden md:flex -right-5 bg-white border-gray-200 shadow-md hover:bg-blue-50 hover:border-blue-300 transition-all" />
          </Carousel>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-semibold text-lg mb-2">No featured listings yet</p>
            <p className="text-gray-300 text-sm">Premium listings will appear here once approved.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── PopularSearchesSection ───────────────────────────────────────────────────
function PopularSearchesSection({ onSearch }) {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        <div className="mb-10">
          <p className="text-blue-600 text-xs font-black uppercase tracking-widest mb-2">Trending</p>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">Popular Real Estate Searches</h2>
          <div className="h-1 w-16 bg-blue-600 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {POPULAR_SEARCHES.map(group => (
            <div key={group.heading}>
              <h3 className="text-sm font-black text-gray-900 mb-4 pb-2 border-b border-gray-100 uppercase tracking-wide">
                {group.heading}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map(item => (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => onSearch(item.q)}
                      className="text-sm text-gray-500 hover:text-blue-600 transition-colors text-left leading-snug group/link"
                    >
                      <span className="group-hover/link:underline underline-offset-2">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// PAGE — composes all sections
// ──────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const cities = usePakistanCities(); // Google Places API or fallback

  const [properties, setProperties] = useState([]);
  const [loading,    setLoading]    = useState(true);

  // Filter state — every key maps to a PropertySchema field
  const [purpose,          setPurpose]          = useState("Sale");
  const [city,             setCity]             = useState("");
  const [keyword,          setKeyword]          = useState("");
  const [propertyType,     setPropertyType]     = useState("");
  const [bedrooms,         setBedrooms]         = useState("");
  const [bathrooms,        setBathrooms]        = useState("");
  const [minPrice,         setMinPrice]         = useState("");
  const [maxPrice,         setMaxPrice]         = useState("");
  const [minArea,          setMinArea]          = useState("");
  const [maxArea,          setMaxArea]          = useState("");
  const [completionStatus, setCompletionStatus] = useState("");
  const [furnishing,       setFurnishing]       = useState("");
  const [verifiedOnly,     setVerifiedOnly]     = useState(false);

  // Fetch featured properties on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res  = await fetch("/api/properties/featured");
        const json = await res.json();
        if (json.success) setProperties(json.data);
      } catch (e) {
        console.error("Featured fetch error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Build URLSearchParams and push to /properties.
  // Accepts an optional `overrides` object so PopularSearchesSection can
  // trigger a search without touching the widget state.
  const handleSearch = useCallback((overrides = {}) => {
    const params = new URLSearchParams();
    const v = (key, fallback) => overrides[key] ?? fallback;

    const p = v("purpose", purpose === "Sale" ? "For Sale" : "For Rent");
    params.set("purpose", p);

    const c = v("city", city !== "All Cities" ? city : "");
    if (c)  params.set("city", c);

    const kw = v("keyword", keyword.trim());
    if (kw) params.set("keyword", kw);

    const t = v("type", propertyType);
    if (t)  params.set("type", t);

    const bd = v("bedrooms", bedrooms);
    if (bd) params.set("bedrooms", bd);

    const bt = v("bathrooms", bathrooms);
    if (bt) params.set("bathrooms", bt);

    const mnP = v("minPrice", minPrice);
    if (mnP) params.set("minPrice", mnP);

    const mxP = v("maxPrice", maxPrice);
    if (mxP) params.set("maxPrice", mxP);

    const mnA = v("minArea", minArea);
    if (mnA) params.set("minArea", mnA);

    const mxA = v("maxArea", maxArea);
    if (mxA) params.set("maxArea", mxA);

    const cs = v("completionStatus", completionStatus);
    if (cs) params.set("completionStatus", cs);

    const fn = v("furnishing", furnishing);
    if (fn) params.set("furnishing", fn);

    if (verifiedOnly) params.set("verified", "true");

    router.push(`/properties?${params.toString()}`);
  }, [purpose, city, keyword, propertyType, bedrooms, bathrooms, minPrice, maxPrice, minArea, maxArea, completionStatus, furnishing, verifiedOnly, router]);

  const removeFilter = (key) => ({
    city:             () => setCity(""),
    propertyType:     () => setPropertyType(""),
    bedrooms:         () => setBedrooms(""),
    bathrooms:        () => setBathrooms(""),
    price:            () => { setMinPrice(""); setMaxPrice(""); },
    area:             () => { setMinArea(""); setMaxArea(""); },
    completionStatus: () => setCompletionStatus(""),
    furnishing:       () => setFurnishing(""),
    verifiedOnly:     () => setVerifiedOnly(false),
  }[key]?.());

  const clearAll = () => {
    setCity(""); setPropertyType(""); setBedrooms(""); setBathrooms("");
    setMinPrice(""); setMaxPrice(""); setMinArea(""); setMaxArea("");
    setCompletionStatus(""); setFurnishing(""); setVerifiedOnly(false); setKeyword("");
  };

  const activeFilters  = { city, propertyType, bedrooms, bathrooms, minPrice, maxPrice, minArea, maxArea, completionStatus, furnishing, verifiedOnly };
  const hasPriceFilter = minPrice || maxPrice;
  const hasAreaFilter  = minArea  || maxArea;
  const hasAnyActive   = Object.values(activeFilters).some(v => v && v !== "");

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[640px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(5,15,40,0.88) 0%, rgba(10,30,65,0.82) 100%), url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-16 text-center">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-widest mb-6">
            <Icon.Shield /> Pakistan&apos;s Most Trusted Real Estate Platform
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-5 tracking-tight leading-tight">
            Find Your <span className="text-blue-400">Dream Property</span><br />Across Pakistan
          </h1>

          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto font-light">
            Verified listings. Vetted agents. Every property on{" "}
            <span className="text-white font-semibold">Leads to Keys</span> is authenticated
            — because trust is the foundation of every great deal.
          </p>

          {/* ── SEARCH WIDGET ─────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-visible mx-auto border border-gray-100">

            {/* Purpose tabs */}
            <div className="flex bg-gray-50 border-b border-gray-100 p-1 rounded-t-2xl">
              {["Sale", "Rent"].map(tab => (
                <button key={tab} type="button"
                  onClick={() => { setPurpose(tab); setMinPrice(""); setMaxPrice(""); }}
                  className={`flex-1 py-2.5 text-sm font-black uppercase tracking-wide rounded-xl transition-all ${
                    purpose === tab ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                  }`}
                >For {tab}</button>
              ))}
            </div>

            {/* Primary row */}
            <div className="flex flex-col md:flex-row items-stretch gap-0 p-2">

              {/* City — populated from Google Places API or fallback */}
              <div className="flex-1 px-3 py-2 border-b md:border-b-0 md:border-r border-gray-100">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">City</label>
                <select className="w-full text-sm outline-none bg-transparent font-semibold text-gray-700 cursor-pointer"
                  value={city} onChange={e => setCity(e.target.value)}>
                  <option value="">All Cities</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Property Type */}
              <div className="flex-1 px-3 py-2 border-b md:border-b-0 md:border-r border-gray-100">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Property Type</label>
                <select className="w-full text-sm outline-none bg-transparent font-semibold text-gray-700 cursor-pointer"
                  value={propertyType} onChange={e => setPropertyType(e.target.value)}>
                  <option value="">Any Type</option>
                  {ALL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Keyword */}
              <div className="flex-[1.5] px-3 py-2 border-b md:border-b-0 md:border-r border-gray-100">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Location / Keywords</label>
                <input type="text" placeholder="DHA Phase 5, Gulberg, community..."
                  className="w-full text-sm outline-none font-semibold text-gray-700 placeholder-gray-300"
                  value={keyword} onChange={e => setKeyword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()} />
              </div>

              {/* Search button */}
              <div className="flex-shrink-0 p-1">
                <button type="button" onClick={() => handleSearch()}
                  className="h-full w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
                  <Icon.Search /> Find Key
                </button>
              </div>
            </div>

            {/* Advanced filters row */}
            <div className="flex flex-wrap items-center gap-2 px-3 pb-3 pt-0">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mr-1">Filters:</span>

              <FilterDropdown label={bedrooms ? `${bedrooms} Beds` : "Bedrooms"} value={bedrooms} onClear={() => setBedrooms("")}>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Select Bedrooms</p>
                  <PillSelector options={BEDROOM_OPTIONS} value={bedrooms} onChange={setBedrooms} />
                </div>
              </FilterDropdown>

              <FilterDropdown label={bathrooms ? `${bathrooms} Baths` : "Bathrooms"} value={bathrooms} onClear={() => setBathrooms("")}>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Select Bathrooms</p>
                  <PillSelector options={BATHROOM_OPTIONS} value={bathrooms} onChange={setBathrooms} />
                </div>
              </FilterDropdown>

              <FilterDropdown
                label={hasPriceFilter ? `${minPrice ? formatPrice(+minPrice) : "0"} – ${maxPrice ? formatPrice(+maxPrice) : "Any"}` : "Price"}
                value={hasPriceFilter ? "set" : ""}
                onClear={() => { setMinPrice(""); setMaxPrice(""); }}
              >
                <PriceRangeSelector purpose={purpose} minPrice={minPrice} maxPrice={maxPrice} onMinChange={setMinPrice} onMaxChange={setMaxPrice} />
              </FilterDropdown>

              <FilterDropdown
                label={hasAreaFilter ? `${minArea || "0"} – ${maxArea || "∞"} Marla` : "Area"}
                value={hasAreaFilter ? "set" : ""}
                onClear={() => { setMinArea(""); setMaxArea(""); }}
              >
                <AreaRangeSelector minArea={minArea} maxArea={maxArea} onMinChange={setMinArea} onMaxChange={setMaxArea} />
              </FilterDropdown>

              <FilterDropdown label={completionStatus || "Completion"} value={completionStatus} onClear={() => setCompletionStatus("")}>
                <div className="space-y-2 min-w-[180px]">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Completion Status</p>
                  <PillSelector options={["Ready", "Off-plan"]} value={completionStatus} onChange={setCompletionStatus} />
                </div>
              </FilterDropdown>

              <FilterDropdown label={furnishing || "Furnishing"} value={furnishing} onClear={() => setFurnishing("")}>
                <div className="space-y-2 min-w-[220px]">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Furnishing Status</p>
                  <PillSelector options={["Furnished", "Unfurnished", "Partly Furnished"]} value={furnishing} onChange={setFurnishing} />
                </div>
              </FilterDropdown>

              <button type="button" onClick={() => setVerifiedOnly(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-semibold transition-all whitespace-nowrap ${
                  verifiedOnly ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                }`}
              >
                <Icon.Shield /> Verified Only
              </button>
            </div>

            {/* Active filter chips */}
            {hasAnyActive && (
              <ActiveFilters filters={activeFilters} onRemove={removeFilter} onClearAll={clearAll} />
            )}
          </div>
        </div>
      </section>

      {/* ── FEATURED LISTINGS (Carousel) ──────────────────────────────────── */}
      <FeaturedSection properties={properties} loading={loading} />

      {/* ── POPULAR SEARCHES ──────────────────────────────────────────────── */}
      <PopularSearchesSection onSearch={handleSearch} />

    </div>
  );
}