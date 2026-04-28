"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// import Navbar from "@/components/PublicNavbar";
import RegisterInterestButton from "@/components/property/RegisterInterestButton";

// --- ICONS ---
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const PK_CITIES = ["Karachi","Lahore","Islamabad","Rawalpindi","Faisalabad","Multan","Peshawar","Quetta","Sialkot","Gujranwala","Hyderabad","Abbottabad","Bahawalpur","Sargodha","Sukkur"];

const PROPERTY_TYPES = [
  'Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Villa Compound',
  'Hotel Apartment', 'Land', 'Floor', 'Building', 'Office', 'Shop', 'Warehouse'
];

export default function HomePage() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState("Rent");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("All Cities");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/properties/featured");
        const json = await res.json();
        if (json.success) {
          setProperties(json.data);
        }
      } catch (err) {
        console.error("Error fetching featured properties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams({
      purpose: activeTab === "Rent" ? "For Rent" : "For Sale",
      type: propertyType,
      city: location === "All Cities" ? "" : location,
      keyword: keyword
    });
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* <Navbar /> */}
      {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
      <section 
        className="relative min-h-[650px] flex items-center justify-center bg-slate-900 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(10, 18, 38, 0.75), rgba(10, 18, 38, 0.75)), url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto pt-10">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Unlocking Trust in <span className="text-blue-500">Pakistani Real Estate</span>
          </h1>
          
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-gray-200 text-lg md:text-xl leading-relaxed font-light">
              At <span className="font-bold text-white border-b-2 border-blue-500">Leads to Key</span>, we are redefining the property market. 
              We are building more than a marketplace; we are creating an 
              <span className="text-blue-400 font-medium italic"> ecosystem of authenticity</span>. 
              By verifying every listing and vetting every agent, we eliminate uncertainty, bridging the gap between ambition and ownership.
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mx-auto max-w-4xl border border-gray-200">
            <div className="flex bg-gray-100 p-1">
              {["Rent", "Sale"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-sm font-bold uppercase rounded-xl transition-all ${
                    activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  For {tab}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row items-stretch p-3 gap-2">
              <div className="flex-1 p-2 text-left">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Property Type</label>
                <select 
                  className="w-full text-sm outline-none bg-transparent font-semibold text-gray-700"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="">Any Type</option>
                  {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="w-[1px] bg-gray-100 hidden md:block"></div>

              <div className="flex-1 p-2 text-left">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Location</label>
                <select 
                  className="w-full text-sm outline-none bg-transparent font-semibold text-gray-700"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option>All Cities</option>
                  {PK_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>

              <div className="w-[1px] bg-gray-100 hidden md:block"></div>

              <div className="flex-1 p-2 text-left">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Keywords</label>
                <input 
                  type="text"
                  placeholder="DHA Phase 6..."
                  className="w-full text-sm outline-none font-semibold text-gray-700"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <button 
                onClick={handleSearch}
                className="bg-blue-600 text-white px-10 py-4 flex items-center justify-center gap-2 font-black text-sm uppercase hover:bg-blue-700 transition-all rounded-xl shadow-lg shadow-blue-200"
              >
                <SearchIcon /> Find Key
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED SECTION ────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 italic uppercase">Featured Listings</h2>
              <div className="h-1.5 w-24 bg-blue-600 rounded-full"></div>
              <p className="text-gray-500 mt-4 max-w-md">Vetted, verified, and ready for you. Explore our top-tier properties across Pakistan.</p>
            </div>
            <button
              onClick={() => router.push('/properties')}
             className="text-blue-600 font-bold border-b-2 border-blue-600 pb-1 hover:text-blue-800 transition-all">View All Properties</button>
          </div>
          
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
               {[1,2,3,4].map(i => <div key={i} className="h-[400px] bg-gray-200 rounded-2xl" />)}
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {properties.length > 0 ? (
                properties.map((prop) => (
                  <PropertyCard key={prop._id} property={{
                    ...prop,
                    image: prop.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image',
                    price: prop.price.toLocaleString(),
                    address: `${prop.location?.area}, ${prop.location?.city}`,
                    tag: prop.purpose
                  }} />
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-medium">Currently preparing premium listings for you.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


const BedIcon = () => <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const BathIcon = () => <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4" /></svg>;
const AreaIcon = () => <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>;

function PropertyCard({ property }) {
  const propertyId = property._id?.$oid || property._id;
  const mainImage = property.images?.[0]?.originalUrl || "/placeholder-house.jpg";
  const displayPrice = property.price?.toLocaleString();
  const fullAddress = `${property.location?.area}, ${property.location?.city}`;

  return (
    <Link href={`/properties/${propertyId}`}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority={property.isFeatured}
          />
          <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg z-10">
            {property.purpose}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10">
            <p className="text-white font-black text-xl">
              {property.currency} {displayPrice}
              {property.purpose === "For Rent" && <span className="text-xs font-normal ml-1">/{property.rentFrequency}</span>}
            </p>
          </div>
        </div>
        
        <div className="p-5 flex flex-col grow">
          <span className="text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-1">
            {property.category} • {property.propertyType}
          </span>

          <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>

          <p className="text-gray-500 text-sm mb-4 flex items-start line-clamp-1">
            <MapPinIcon /> {fullAddress}
          </p>

          <div className="flex items-center gap-4 text-gray-600 text-sm mb-4 pt-2 border-t border-gray-50">
            <div className="flex items-center">
              <BedIcon />
              <span className="font-semibold">{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <BathIcon />
              <span className="font-semibold">{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <AreaIcon />
              <span className="font-semibold">{property.area} {property.areaUnit}</span>
            </div>
          </div>
          
          {/* ── WHATSAPP BUTTON INTEGRATION ── */}
          <div 
            className="mt-auto pt-4"
            onClick={(e) => {
              // This prevents the <Link> from navigating when clicking the button area
              e.preventDefault(); 
              e.stopPropagation();
            }}
          >
            <RegisterInterestButton property={property} compact={true} />
          </div>
        </div>
      </div>
    </Link>
  );
}