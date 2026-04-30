"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Maximize, ShieldCheck, ArrowRight,
  ChevronLeft, ChevronRight, Bed, Bath,
  Search, X, SlidersHorizontal, Star,
  CheckCircle2,
} from "lucide-react";
import RegisterInterestButton from "@/components/property/RegisterInterestButton";

// ─── Constants ────────────────────────────────────────────────────────────────
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

const ALL_TYPES = Object.values(PROPERTY_TYPE_MAP).flat();

const MAX_PRICE_SALE = 200_000_000;
const MAX_PRICE_RENT = 1_000_000;

const PRICE_STEPS = { "For Sale": 500_000, "For Rent": 5_000 };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatPrice(price, currency = "PKR") {
  if (!price && price !== 0) return "—";
  if (price >= 10_000_000) return `${currency} ${(price / 10_000_000).toFixed(2)} Cr`;
  if (price >= 100_000)   return `${currency} ${(price / 100_000).toFixed(1)} Lac`;
  return `${currency} ${price.toLocaleString()}`;
}

function pct(value, max) {
  return Math.round((Number(value) / max) * 100);
}

// ─── Default filter values ────────────────────────────────────────────────────
function defaultFilters(searchParams) {
  const purpose = searchParams.get("purpose") || "For Sale";
  return {
    purpose,
    category:         searchParams.get("category")         || "",
    propertyType:     searchParams.get("propertyType") || searchParams.get("type") || "",
    city:             searchParams.get("city")              || "",
    keyword:          searchParams.get("keyword")           || "",
    minPrice:         searchParams.get("minPrice")          || "",
    maxPrice:         searchParams.get("maxPrice")          || "",
    bedrooms:         searchParams.get("bedrooms")          || "",
    bathrooms:        searchParams.get("bathrooms")         || "",
    completionStatus: searchParams.get("completionStatus")  || "",
    furnishing:       searchParams.get("furnishing")        || "",
    verified:         searchParams.get("verified")          || "",
    minArea:          searchParams.get("minArea")           || "",
    maxArea:          searchParams.get("maxArea")           || "",
  };
}

function PropertyImageCarousel({ images, title }) {
  const [idx, setIdx]     = useState(0);
  const [loaded, setLoaded] = useState({});
  const total = images?.length || 0;

  const prev = (e) => {
    e.preventDefault(); e.stopPropagation();
    setIdx(i => (i - 1 + total) % total);
  };
  const next = (e) => {
    e.preventDefault(); e.stopPropagation();
    setIdx(i => (i + 1) % total);
  };

  if (!total) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <span className="text-gray-300 text-sm font-medium">No images</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Images — only current is visible, others are preloaded but hidden */}
      {images.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-400 ${i === idx ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <Image
            src={img.originalUrl || "/placeholder.jpg"}
            alt={`${title} — image ${i + 1}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className={`object-cover transition-transform duration-700 ${i === idx ? "group-hover:scale-105" : ""}`}
            priority={i === 0}
            onLoad={() => setLoaded(p => ({ ...p, [i]: true }))}
          />
          {/* Skeleton while loading */}
          {!loaded[i] && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
        </div>
      ))}

      {/* Navigation — only shown when multiple images */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            aria-label="Previous image"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            aria-label="Next image"
          >
            <ChevronRight size={16} />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === idx ? "bg-white w-4" : "bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-3 right-3 z-20 bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full">
            {idx + 1}/{total}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Property Card ────────────────────────────────────────────────────────────
// export function VerticalPropertyCard({ property }) {
//   const propId   = property._id?.$oid || property._id;
//   const address  = property.location?.area
//     ? `${property.location.area}, ${property.location.city}`
//     : property.location?.city || property.location?.address || "Pakistan";

//   return (
//     <Link href={`/properties/${propId}`} className="group block h-full">
//       <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-50/60 hover:border-blue-100 transition-all duration-500 overflow-hidden flex flex-col h-full">

//         {/* ── Image carousel ── */}
//         <div className="relative w-full h-60 shrink-0">
//           <PropertyImageCarousel images={property.images} title={property.title} />

//           {/* Purpose badge */}
//           <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
//             <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg ${
//               property.purpose === "For Sale" ? "bg-blue-600 text-white" : "bg-emerald-500 text-white"
//             }`}>
//               {property.purpose}
//             </span>
//             {property.completionStatus === "Off-plan" && (
//               <span className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest bg-orange-500 text-white shadow-sm">
//                 Off-plan
//               </span>
//             )}
//           </div>

//           {/* Boost badge */}
//           {property.boostLevel && property.boostLevel !== "None" && (
//             <div className="absolute top-3 right-3 z-20">
//               <span className={`flex items-center gap-1 text-[9px] font-black px-2.5 py-1 rounded-full shadow-sm ${
//                 property.boostLevel === "Platinum" ? "bg-violet-600 text-white"
//                 : property.boostLevel === "Premium"  ? "bg-amber-500 text-white"
//                 : "bg-gray-700 text-white"
//               }`}>
//                 <Star size={9} fill="currentColor" /> {property.boostLevel}
//               </span>
//             </div>
//           )}
//         </div>

//         {/* ── Details ── */}
//         <div className="flex-1 p-5 flex flex-col">
//           <div className="flex justify-between items-start mb-2">
//             <p className="text-[9px] font-black text-blue-600 uppercase tracking-wider">
//               {property.propertyType} · {property.category}
//             </p>
//             {property.verification?.isTruCheck && (
//               <span className="flex items-center gap-1 text-[9px] font-black text-emerald-600">
//                 <ShieldCheck size={11} /> TruCheck™
//               </span>
//             )}
//           </div>

//           <h3 className="text-base font-black text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
//             {property.title}
//           </h3>

//           <div className="flex items-center text-gray-400 text-[11px] font-semibold mb-4 gap-1">
//             <MapPin size={11} className="text-blue-500 shrink-0" />
//             <span className="line-clamp-1">{address}</span>
//           </div>

//           {/* Specs */}
//           <div className="grid grid-cols-3 gap-1 py-3 border-y border-gray-50 mb-4">
//             <div className="flex flex-col items-center gap-1">
//               <Bed size={15} className="text-gray-300" />
//               <span className="text-[10px] font-black text-gray-800">
//                 {property.bedrooms || "—"}{" "}
//                 <span className="text-[8px] text-gray-400 font-bold uppercase">Beds</span>
//               </span>
//             </div>
//             <div className="flex flex-col items-center gap-1">
//               <Bath size={15} className="text-gray-300" />
//               <span className="text-[10px] font-black text-gray-800">
//                 {property.bathrooms || "—"}{" "}
//                 <span className="text-[8px] text-gray-400 font-bold uppercase">Baths</span>
//               </span>
//             </div>
//             <div className="flex flex-col items-center gap-1">
//               <Maximize size={15} className="text-gray-300" />
//               <span className="text-[10px] font-black text-gray-800">
//                 {property.area}{" "}
//                 <span className="text-[8px] text-gray-400 font-bold uppercase">{property.areaUnit}</span>
//               </span>
//             </div>
//           </div>

//           {/* Price + CTA */}
//           <div className="mt-auto space-y-3">
//             <div className="flex justify-between items-end">
//               <div>
//                 <p className="text-[8px] font-black text-gray-400 uppercase tracking-wider mb-0.5">
//                   {property.priceLabel === "Starting From" ? "Starting from" : "Total price"}
//                 </p>
//                 <p className="text-xl font-black text-gray-900 leading-none">
//                   <span className="text-[10px] text-blue-600 mr-1 font-black">{property.currency}</span>
//                   {property.price?.toLocaleString()}
//                   {property.purpose === "For Rent" && property.rentFrequency && (
//                     <span className="text-[10px] text-gray-400 font-normal ml-1">/{property.rentFrequency}</span>
//                   )}
//                 </p>
//               </div>
//               <Link
//                 href={`/properties/${propId}`}
//                 onClick={e => e.stopPropagation()}
//                 className="p-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
//               >
//                 <ArrowRight size={17} />
//               </Link>
//             </div>

//             {/* WhatsApp — stops link navigation */}
//             <div onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
//               <RegisterInterestButton property={property} compact />
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }

export function VerticalPropertyCard({ property }) {
  const propId = property._id?.$oid || property._id;
  const address = property.location?.area
    ? `${property.location.area}, ${property.location.city}`
    : property.location?.city || property.location?.address || "Pakistan";

  return (
    <div className="group relative bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-50/60 hover:border-blue-100 transition-all duration-500 flex flex-col h-full overflow-hidden">
      
      {/* 1. THE STRETCHED LINK 
          This makes the whole card clickable without nesting <a> tags.
          The 'z-10' ensures it covers the card, while buttons use 'z-20' to stay clickable. */}
      <Link 
        href={`/properties/${propId}`} 
        className="absolute inset-0 z-10"
        aria-label={`View details for ${property.title}`}
      />

      {/* ── Image carousel ── */}
      <div className="relative w-full h-60 shrink-0">
        <PropertyImageCarousel images={property.images} title={property.title} />

        {/* Badges - Elevated to z-20 to be visible/interactive above stretched link */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg ${
            property.purpose === "For Sale" ? "bg-blue-600 text-white" : "bg-emerald-500 text-white"
          }`}>
            {property.purpose}
          </span>
          {property.completionStatus === "Off-plan" && (
            <span className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest bg-orange-500 text-white shadow-sm">
              Off-plan
            </span>
          )}
        </div>

        {/* Boost badge */}
        {property.boostLevel && property.boostLevel !== "None" && (
          <div className="absolute top-3 right-3 z-20">
            <span className={`flex items-center gap-1 text-[9px] font-black px-2.5 py-1 rounded-full shadow-sm ${
              property.boostLevel === "Platinum" ? "bg-violet-600 text-white"
              : property.boostLevel === "Premium" ? "bg-amber-500 text-white"
              : "bg-gray-700 text-white"
            }`}>
              <Star size={9} fill="currentColor" /> {property.boostLevel}
            </span>
          </div>
        )}
      </div>

      {/* ── Details ── */}
      <div className="flex-1 p-5 flex flex-col relative z-0">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[9px] font-black text-blue-600 uppercase tracking-wider">
            {property.propertyType} · {property.category}
          </p>
          {property.verification?.isTruCheck && (
            <span className="flex items-center gap-1 text-[9px] font-black text-emerald-600">
              <ShieldCheck size={11} /> TruCheck™
            </span>
          )}
        </div>

        <h3 className="text-base font-black text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
          {property.title}
        </h3>

        <div className="flex items-center text-gray-400 text-[11px] font-semibold mb-4 gap-1">
          <MapPin size={11} className="text-blue-500 shrink-0" />
          <span className="line-clamp-1">{address}</span>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-1 py-3 border-y border-gray-50 mb-4">
          <div className="flex flex-col items-center gap-1">
            <Bed size={15} className="text-gray-300" />
            <span className="text-[10px] font-black text-gray-800">
              {property.bedrooms || "—"}{" "}
              <span className="text-[8px] text-gray-400 font-bold uppercase">Beds</span>
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Bath size={15} className="text-gray-300" />
            <span className="text-[10px] font-black text-gray-800">
              {property.bathrooms || "—"}{" "}
              <span className="text-[8px] text-gray-400 font-bold uppercase">Baths</span>
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Maximize size={15} className="text-gray-300" />
            <span className="text-[10px] font-black text-gray-800">
              {property.area}{" "}
              <span className="text-[8px] text-gray-400 font-bold uppercase">{property.areaUnit}</span>
            </span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto space-y-3">
          <div className="flex justify-between items-end">
            <div className="relative z-20">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-wider mb-0.5">
                {property.priceLabel === "Starting From" ? "Starting from" : "Total price"}
              </p>
              <p className="text-xl font-black text-gray-900 leading-none">
                <span className="text-[10px] text-blue-600 mr-1 font-black">{property.currency}</span>
                {property.price?.toLocaleString()}
                {property.purpose === "For Rent" && property.rentFrequency && (
                  <span className="text-[10px] text-gray-400 font-normal ml-1">/{property.rentFrequency}</span>
                )}
              </p>
            </div>
            
            {/* Arrow Link - Elevated to z-20 */}
            <Link
              href={`/properties/${propId}`}
              className="relative z-20 p-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            >
              <ArrowRight size={17} />
            </Link>
          </div>

          {/* WhatsApp / Action Button - Elevated to z-20 */}
          <div 
            className="relative z-20" 
            onClick={e => { e.preventDefault(); e.stopPropagation(); }}
          >
            <RegisterInterestButton property={property} compact />
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Price Range Slider ───────────────────────────────────────────────────────
function PriceRangeSlider({ purpose, minPrice, maxPrice, onMinChange, onMaxChange }) {
  const maxVal  = purpose === "For Sale" ? MAX_PRICE_SALE : MAX_PRICE_RENT;
  const step    = PRICE_STEPS[purpose] || 500_000;
  const minVal  = Number(minPrice) || 0;
  const maxVal_ = Number(maxPrice) || maxVal;
  const trackRef = useRef(null);

  const minPct = pct(minVal, maxVal);
  const maxPct = pct(maxVal_, maxVal);

  return (
    <div className="space-y-3">
      {/* Labels */}
      <div className="flex justify-between text-[10px] font-black text-gray-500">
        <span>{formatPrice(minVal)}</span>
        <span className="text-blue-600">{maxVal_ >= maxVal ? "No limit" : formatPrice(maxVal_)}</span>
      </div>

      {/* Dual-thumb track */}
      <div ref={trackRef} className="relative h-2 rounded-full bg-gray-100">
        {/* Filled range */}
        <div
          className="absolute h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />

        {/* Min thumb */}
        <input
          type="range"
          min={0}
          max={maxVal}
          step={step}
          value={minVal}
          onChange={e => {
            const v = Math.min(Number(e.target.value), maxVal_ - step);
            onMinChange(v || "");
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          style={{ pointerEvents: "auto" }}
        />

        {/* Max thumb */}
        <input
          type="range"
          min={0}
          max={maxVal}
          step={step}
          value={maxVal_}
          onChange={e => {
            const v = Math.max(Number(e.target.value), minVal + step);
            onMaxChange(v >= maxVal ? "" : v);
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />

        {/* Visual thumb circles */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-blue-600 shadow-md z-10 pointer-events-none"
          style={{ left: `calc(${minPct}% - 8px)` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-blue-600 shadow-md z-10 pointer-events-none"
          style={{ left: `calc(${maxPct}% - 8px)` }}
        />
      </div>

      {/* Manual inputs */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Min</label>
          <input
            type="number"
            value={minVal || ""}
            placeholder="0"
            onChange={e => onMinChange(e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500 font-semibold"
          />
        </div>
        <div>
          <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Max</label>
          <input
            type="number"
            value={maxVal_ >= maxVal ? "" : maxVal_}
            placeholder="No limit"
            onChange={e => onMaxChange(e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500 font-semibold"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Active filter chips ──────────────────────────────────────────────────────
function ActiveFilterChips({ filters, onRemove, onClearAll }) {
  const chips = [];
  if (filters.city)             chips.push({ key: "city",             label: filters.city });
  if (filters.category)         chips.push({ key: "category",         label: filters.category });
  if (filters.propertyType)     chips.push({ key: "propertyType",     label: filters.propertyType });
  if (filters.bedrooms)         chips.push({ key: "bedrooms",         label: `${filters.bedrooms} Bed+` });
  if (filters.bathrooms)        chips.push({ key: "bathrooms",        label: `${filters.bathrooms} Bath+` });
  if (filters.completionStatus) chips.push({ key: "completionStatus", label: filters.completionStatus });
  if (filters.furnishing)       chips.push({ key: "furnishing",       label: filters.furnishing });
  if (filters.verified)         chips.push({ key: "verified",         label: "Verified" });
  if (filters.minPrice)         chips.push({ key: "minPrice",         label: `Min ${formatPrice(+filters.minPrice)}` });
  if (filters.maxPrice)         chips.push({ key: "maxPrice",         label: `Max ${formatPrice(+filters.maxPrice)}` });
  if (filters.minArea)          chips.push({ key: "minArea",          label: `Min ${filters.minArea} Marla` });
  if (filters.maxArea)          chips.push({ key: "maxArea",          label: `Max ${filters.maxArea} Marla` });
  if (filters.keyword)          chips.push({ key: "keyword",          label: `"${filters.keyword}"` });

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100 mt-4">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Active:</span>
      {chips.map(chip => (
        <span key={chip.key}
          className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
          {chip.label}
          <button type="button" onClick={() => onRemove(chip.key)}
            className="ml-0.5 hover:text-red-500 transition-colors">
            <X size={11} />
          </button>
        </span>
      ))}
      <button type="button" onClick={onClearAll}
        className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 text-xs font-black rounded-full border border-red-100 hover:bg-red-100 transition-colors">
        <X size={11} /> Clear all filters
      </button>
    </div>
  );
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────
function FilterPanel({ filters, onUpdate, onClearAll }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const maxSliderVal = filters.purpose === "For Sale" ? MAX_PRICE_SALE : MAX_PRICE_RENT;

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 space-y-5">

      {/* Row 1: Purpose · Category · Type · City · Keyword */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        {/* Purpose */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400">Purpose</label>
          <div className="flex rounded-xl overflow-hidden border border-gray-200">
            {["For Sale", "For Rent"].map(p => (
              <button key={p} type="button"
                onClick={() => onUpdate("purpose", p)}
                className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wide transition-all ${
                  filters.purpose === p
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {p === "For Sale" ? "Buy" : "Rent"}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400">Category</label>
          <select value={filters.category} onChange={e => onUpdate("category", e.target.value)}
            className="w-full bg-gray-50 rounded-xl text-xs font-bold p-3 outline-none border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20">
            <option value="">All Categories</option>
            {Object.keys(PROPERTY_TYPE_MAP).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Property Type */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400">Property Type</label>
          <select value={filters.propertyType} onChange={e => onUpdate("propertyType", e.target.value)}
            className="w-full bg-gray-50 rounded-xl text-xs font-bold p-3 outline-none border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20">
            <option value="">Any Type</option>
            {(filters.category ? PROPERTY_TYPE_MAP[filters.category] || ALL_TYPES : ALL_TYPES).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400">City</label>
          <input type="text" placeholder="Lahore, Karachi..."
            value={filters.city}
            onChange={e => onUpdate("city", e.target.value)}
            className="w-full bg-gray-50 rounded-xl text-xs font-bold p-3 outline-none border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 placeholder-gray-300" />
        </div>

        {/* Keyword / Search */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400">Keyword</label>
          <input type="text" placeholder="DHA, Gulberg, Bahria..."
            value={filters.keyword}
            onChange={e => onUpdate("keyword", e.target.value)}
            className="w-full bg-gray-50 rounded-xl text-xs font-bold p-3 outline-none border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 placeholder-gray-300" />
        </div>
      </div>

      {/* Row 2: Price Range */}
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-gray-400 flex items-center justify-between">
          <span>Price Range ({filters.purpose === "For Sale" ? "PKR" : "PKR/mo"})</span>
          <span className="text-blue-600 normal-case font-bold">
            {filters.minPrice ? formatPrice(+filters.minPrice) : "0"} — {filters.maxPrice ? formatPrice(+filters.maxPrice) : "No limit"}
          </span>
        </label>
        <PriceRangeSlider
          purpose={filters.purpose}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinChange={v => onUpdate("minPrice", v)}
          onMaxChange={v => onUpdate("maxPrice", v)}
        />
      </div>

      {/* Row 3: Beds · Baths · Status */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">

        {/* Bedrooms */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400">Beds</label>
          <select value={filters.bedrooms} onChange={e => onUpdate("bedrooms", e.target.value)}
            className="w-full bg-gray-50 rounded-xl text-xs font-bold p-2.5 outline-none border border-gray-200 focus:border-blue-500">
            <option value="">Any</option>
            <option value="Studio">Studio</option>
            {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}+</option>)}
          </select>
        </div>

        {/* Bathrooms */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400">Baths</label>
          <select value={filters.bathrooms} onChange={e => onUpdate("bathrooms", e.target.value)}
            className="w-full bg-gray-50 rounded-xl text-xs font-bold p-2.5 outline-none border border-gray-200 focus:border-blue-500">
            <option value="">Any</option>
            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}+</option>)}
          </select>
        </div>

        {/* Completion */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400">Completion</label>
          <select value={filters.completionStatus} onChange={e => onUpdate("completionStatus", e.target.value)}
            className="w-full bg-gray-50 rounded-xl text-xs font-bold p-2.5 outline-none border border-gray-200 focus:border-blue-500">
            <option value="">Any</option>
            <option value="Ready">Ready</option>
            <option value="Off-plan">Off-plan</option>
          </select>
        </div>

        {/* Furnishing */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400">Furnishing</label>
          <select value={filters.furnishing} onChange={e => onUpdate("furnishing", e.target.value)}
            className="w-full bg-gray-50 rounded-xl text-xs font-bold p-2.5 outline-none border border-gray-200 focus:border-blue-500">
            <option value="">Any</option>
            <option value="Furnished">Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
            <option value="Partly Furnished">Partly Furnished</option>
          </select>
        </div>

        {/* Min Area */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400">Min Area (Marla)</label>
          <input type="number" placeholder="0" value={filters.minArea}
            onChange={e => onUpdate("minArea", e.target.value)}
            className="w-full bg-gray-50 rounded-xl text-xs font-bold p-2.5 outline-none border border-gray-200 focus:border-blue-500 placeholder-gray-300" />
        </div>

        {/* Max Area */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400">Max Area (Marla)</label>
          <input type="number" placeholder="∞" value={filters.maxArea}
            onChange={e => onUpdate("maxArea", e.target.value)}
            className="w-full bg-gray-50 rounded-xl text-xs font-bold p-2.5 outline-none border border-gray-200 focus:border-blue-500 placeholder-gray-300" />
        </div>
      </div>

      {/* Row 4: Verified toggle + Clear all */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3">
          <button type="button"
            onClick={() => onUpdate("verified", filters.verified ? "" : "true")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-black transition-all ${
              filters.verified
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            <ShieldCheck size={13} />
            Verified Only
          </button>
        </div>

        <button type="button" onClick={onClearAll}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-100 text-xs font-black hover:bg-red-100 transition-all">
          <X size={13} /> Clear All Filters
        </button>
      </div>

      {/* Active chips */}
      <ActiveFilterChips
        filters={filters}
        onRemove={key => onUpdate(key, "")}
        onClearAll={onClearAll}
      />
    </div>
  );
}

// ─── Result count bar ─────────────────────────────────────────────────────────
function ResultBar({ total, loading }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-sm font-black text-gray-700">
        {loading ? (
          <span className="inline-block w-24 h-4 bg-gray-200 animate-pulse rounded" />
        ) : (
          <>
            <span className="text-blue-600">{total?.toLocaleString() || 0}</span> properties found
          </>
        )}
      </p>
    </div>
  );
}

// ─── Skeleton grid ────────────────────────────────────────────────────────────
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-[460px] bg-white rounded-[2rem] border border-gray-100 animate-pulse flex flex-col overflow-hidden">
          <div className="h-60 bg-gray-100 shrink-0" />
          <div className="p-5 flex-1 space-y-3">
            <div className="h-3 bg-gray-100 rounded w-1/3" />
            <div className="h-5 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
            <div className="grid grid-cols-3 gap-2 py-3">
              <div className="h-8 bg-gray-50 rounded-lg" />
              <div className="h-8 bg-gray-50 rounded-lg" />
              <div className="h-8 bg-gray-50 rounded-lg" />
            </div>
            <div className="h-10 bg-gray-100 rounded-xl mt-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ pagination, currentPage, filters }) {
  const router = useRouter();

  const goToPage = (page) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
    params.set("page", String(page));
    router.push(`/properties?${params.toString()}`);
  };

  if (!pagination?.totalPages || pagination.totalPages <= 1) return null;

  const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);
  // Show at most 5 page buttons around current
  const visible = pages.filter(p =>
    p === 1 || p === pagination.totalPages ||
    Math.abs(p - currentPage) <= 2
  );

  return (
    <div className="flex justify-center items-center gap-2 mt-12 mb-20">
      <button onClick={() => goToPage(currentPage - 1)}
        disabled={!pagination.hasPrevPage}
        className="p-3 rounded-2xl bg-white border border-gray-200 disabled:opacity-30 hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm">
        <ChevronLeft size={18} />
      </button>

      {visible.map((page, i) => {
        const prev = visible[i - 1];
        const showEllipsis = prev && page - prev > 1;
        return (
          <span key={page} className="flex items-center gap-2">
            {showEllipsis && <span className="text-gray-400 text-sm px-1">…</span>}
            <button onClick={() => goToPage(page)}
              className={`w-11 h-11 rounded-2xl text-sm font-black transition-all shadow-sm ${
                page === currentPage
                  ? "bg-blue-600 text-white shadow-blue-200"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300"
              }`}
            >{page}</button>
          </span>
        );
      })}

      <button onClick={() => goToPage(currentPage + 1)}
        disabled={!pagination.hasNextPage}
        className="p-3 rounded-2xl bg-white border border-gray-200 disabled:opacity-30 hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm">
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

// ─── Main content (inside Suspense) ───────────────────────────────────────────
function PropertiesContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [properties,  setProperties]  = useState([]);
  const [pagination,  setPagination]  = useState({});
  const [loading,     setLoading]     = useState(true);
  const [filters,     setFilters]     = useState(() => defaultFilters(searchParams));

  const currentPage = parseInt(searchParams.get("page")) || 1;

  // Re-sync local filter state when URL changes (back/forward nav)
  useEffect(() => {
    setFilters(defaultFilters(searchParams));
  }, [searchParams]);

  // Fetch whenever searchParams changes
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res  = await fetch(`/api/properties?${searchParams.toString()}`);
        const json = await res.json();
        if (json.success) {
          setProperties(json.data);
          setPagination(json.pagination);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams]);

  // Update a single filter key and push to URL
  const updateFilter = (key, value) => {
    const updated = { ...filters, [key]: value };
    // Reset page to 1 on any filter change
    const params = new URLSearchParams();
    Object.entries(updated).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
    router.push(`/properties?${params.toString()}`);
  };

  const clearAll = () => {
    router.push(`/properties?purpose=${filters.purpose}`);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 pb-12">

      {/* Filter panel — overlaps hero bottom */}
      <div className="-mt-10 relative z-20 mb-8">
        <FilterPanel filters={filters} onUpdate={updateFilter} onClearAll={clearAll} />
      </div>

      <ResultBar total={pagination.total} loading={loading} />

      {/* Grid */}
      {loading ? (
        <SkeletonGrid />
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map(prop => (
            <VerticalPropertyCard key={prop._id?.$oid || prop._id} property={prop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
          <Search className="mx-auto text-gray-200 mb-4" size={48} />
          <p className="text-gray-400 font-black uppercase tracking-widest text-xs mb-4">
            No properties match your filters
          </p>
          <button onClick={clearAll}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 transition-all">
            Clear filters &amp; browse all
          </button>
        </div>
      )}

      <Pagination
        pagination={pagination}
        currentPage={currentPage}
        filters={filters}
      />
    </div>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────
export default function PropertiesListingPage() {
  return (
    <div className="bg-[#f8f9fc] min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 pt-32 pb-28 text-center relative overflow-hidden">
        {/* Grid decoration */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-400/30 text-blue-300 text-[10px] font-black uppercase tracking-widest mb-5">
            <CheckCircle2 size={11} /> Verified Listings Across Pakistan
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-3">
            Find Your <span className="text-blue-400">Dream</span> Space
          </h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em]">
            Properties Across Pakistan
          </p>
        </div>
      </div>

      <Suspense fallback={
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 pt-6">
          <div className="h-48 bg-white rounded-3xl animate-pulse mb-8" />
          <SkeletonGrid />
        </div>
      }>
        <PropertiesContent />
      </Suspense>
    </div>
  );
}