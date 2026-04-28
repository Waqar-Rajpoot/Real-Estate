"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, Maximize, ShieldCheck, ArrowRight, 
  ChevronLeft, LayoutGrid, List
} from "lucide-react";
import RegisterInterestButton from "@/components/property/RegisterInterestButton";

// ── 2. MOVE YOUR CURRENT LOGIC INTO THIS INNER COMPONENT ──────────────────
function PropertiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  
  const currentPage = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams(searchParams.toString());
        const res = await fetch(`/api/properties?${query.toString()}`);
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
    };
    fetchProperties();
  }, [searchParams]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage);
    router.push(`/properties?${params.toString()}`);
  };

  return (
     <main className="max-w-7xl mx-auto px-4 md:px-6 mt-10">
        {/* Results Info & Toggle */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-600 font-bold text-sm">
            Showing <span className="text-blue-600">{properties.length}</span> of {pagination.totalProperties || 0} listings
          </p>
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
            <button className="p-2 bg-gray-100 rounded-lg text-blue-600"><LayoutGrid size={18}/></button>
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><List size={18}/></button>
          </div>
        </div>

        {/* ── PROPERTY GRID ──────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[450px] bg-white rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}

        {/* ── PAGINATION CONTROLS ────────────────────────────────────────── */}
        {!loading && pagination.totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="p-4 rounded-2xl bg-white border border-gray-100 disabled:opacity-30 shadow-sm hover:text-blue-600 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        )}
      </main>
  );
}

// ── 3. WRAP EVERYTHING IN THE DEFAULT EXPORT ──────────────────────────────
export default function PropertiesListingPage() {
  return (
    <div className="bg-[#F7F8F9] min-h-screen mt-20 pb-20">
      {/* Search Header (Can be outside suspense) */}
      <div className="bg-white border-b border-gray-200 py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">
            New Projects <span className="text-blue-600">Pakistan</span>
          </h1>
        </div>
      </div>

      {/* 4. WRAP THE COMPONENT THAT USES useSearchParams IN SUSPENSE */}
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 mt-10 text-center font-bold text-gray-400">
          Loading Listings...
        </div>
      }>
        <PropertiesContent />
      </Suspense>
    </div>
  );
}


function PropertyCard({ property }) {
  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <Image 
          src={property.images[0]?.originalUrl || "/placeholder.jpg"} 
          alt={property.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {property.isFeatured && (
            <span className="bg-orange-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Featured</span>
          )}
          <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{property.purpose}</span>
        </div>
        
        {/* Verification Badge */}
        {property.verification?.isTruCheck && (
          <div className="absolute bottom-4 left-4 bg-green-500 text-white flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">
            <ShieldCheck size={12} /> TruCheck™
          </div>
        )}

        {/* Agency Logo Overlaid (Bayut Style) */}
        <div className="absolute bottom-4 right-4 bg-white p-2 rounded-2xl shadow-xl border border-gray-100 w-14 h-14 flex items-center justify-center">
          <Image 
            src={property.agency?.companyLogo} 
            alt="Agency" width={40} height={40} className="object-contain" 
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{property.propertyType}</p>
            <h3 className="text-lg font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">{property.title}</h3>
          </div>
        </div>

        <div className="flex items-center text-gray-400 text-xs mb-4">
          <MapPin size={14} className="mr-1 text-gray-300" />
          <span className="line-clamp-1">{property.location?.address}</span>
        </div>

        <div className="flex items-center gap-4 mb-6 py-3 border-y border-gray-50">
          <div className="flex items-center gap-1.5">
            <Maximize size={16} className="text-gray-400" />
            <span className="text-sm font-black text-gray-800">{property.areaInMarla} <span className="text-[10px] text-gray-400 font-bold">MARLA</span></span>
          </div>
          <div className="w-[1px] h-4 bg-gray-200"></div>
          <div className="text-sm font-bold text-gray-500 capitalize">{property.category}</div>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-end mb-5">
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{property.priceLabel}</p>
              <p className="text-xl font-black text-gray-900 tracking-tight">
                {property.currency} {property.price?.toLocaleString()}
              </p>
            </div>
            <Link 
              href={`/properties/${property._id}`} 
              className="p-3 bg-gray-50 text-gray-900 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            >
              <ArrowRight size={20} />
            </Link>
          </div>

          <RegisterInterestButton property={property} variant="outline" />
        </div>
      </div>
    </div>
  );
}