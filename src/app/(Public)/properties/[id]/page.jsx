"use client";

import { useState, useEffect, useMemo } from "react"; // Added useMemo
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, Bed, Bath, Maximize, Calendar, CheckCircle2, 
  Phone, Mail, ShieldCheck, Info, Tag, Compass, 
  Layers, Hammer, Home, Landmark, ReceiptPoundSterling,
  Map as MapIcon // Added MapIcon
} from "lucide-react";
// Import Google Maps components
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import RegisterInterestButton from "@/components/property/RegisterInterestButton";

// Map Container Style
const containerStyle = {
  width: '100%',
  height: '450px',
  borderRadius: '2rem'
};

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // 1. Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY // Ensure this is in your .env
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${id}`);
        const json = await res.json();
        if (json.success) setProperty(json.data);
      } catch (err) {
        console.error("Failed to fetch property", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  // 2. Set Map Center based on property coordinates
  const center = useMemo(() => ({
    lat: property?.location?.coordinates?.lat || 31.5204, // Default to Lahore if empty
    lng: property?.location?.coordinates?.lng || 74.3587
  }), [property]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading premium listing...</div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center">Property not found.</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">

      {/* ── HEADER SECTION ────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 pt-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <div className="flex gap-2 mb-2">
                <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  {property.purpose}
                </span>
                <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                   {property.category}
                </span>
                <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  {property.propertyType}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 leading-tight">{property.title}</h1>
              <p className="text-gray-500 flex items-center text-sm font-medium">
                <MapPin className="w-4 h-4 mr-1 text-blue-600" /> {property.location?.address}
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Asking Price</p>
              <p className="text-3xl md:text-4xl font-black text-blue-600">
                {property.currency} {property.price?.toLocaleString()}
              </p>
              <div className="flex flex-col md:items-end mt-1">
                 <span className="text-gray-500 text-xs font-bold bg-gray-100 px-2 py-0.5 rounded">{property.priceLabel}</span>
                 {property.isNegotiable && <span className="text-green-600 text-[10px] font-bold uppercase mt-1 italic">Price Negotiable</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* Gallery Section */}
            <section className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100">
              <div className="relative h-[350px] md:h-[550px]">
                <Image 
                  src={property.images[activeImage]?.originalUrl || "/placeholder.jpg"} 
                  alt="Property Main" fill className="object-cover" priority
                />
              </div>
              <div className="flex gap-3 p-6 overflow-x-auto bg-white no-scrollbar">
                {property.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-20 rounded-2xl overflow-hidden border-4 transition-all flex-shrink-0 ${activeImage === idx ? 'border-blue-600 scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <Image src={img.originalUrl} alt="thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </section>

            {/* Property Insights Table */}
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-6 uppercase italic tracking-tight flex items-center">
                <Tag className="w-5 h-5 mr-2 text-blue-600" /> Property Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                 <StatRow label="Facing" value={property.facing} icon={<Compass className="w-4 h-4"/>} />
                 <StatRow label="Area Size" value={`${property.area} ${property.areaUnit} (${property.areaInMarla} Marla)`} icon={<Maximize className="w-4 h-4"/>}/>
                 <StatRow label="Price per Sq.Ft" value={`${property.currency} ${property.pricePerSqFt}`} icon={<Landmark className="w-4 h-4"/>}/>
                 <StatRow label="Condition" value={property.condition} icon={<Hammer className="w-4 h-4"/>} />
                 <StatRow label="Furnishing" value={property.furnishingStatus} icon={<Home className="w-4 h-4"/>} />
                 <StatRow label="Floors" value={property.floors > 0 ? property.floors : "Single Story"} icon={<Layers className="w-4 h-4"/>} />
                 <StatRow label="Occupancy" value={property.occupancyStatus} icon={<Info className="w-4 h-4"/>} />
                 <StatRow label="Listing Status" value={property.status} icon={<CheckCircle2 className="w-4 h-4 text-green-500"/>} />
              </div>
            </section>

            {/* Description */}
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-4 uppercase italic tracking-tight">Project Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg font-medium">
                {property.description}
              </p>
            </section>

            {/* Financial & Payment Section */}
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 bg-gradient-to-br from-white to-gray-50">
              <h3 className="text-xl font-black text-gray-900 mb-6 uppercase italic tracking-tight flex items-center">
                <ReceiptPoundSterling className="w-5 h-5 mr-2 text-blue-600" /> Payment & Legal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Installments</p>
                    <p className={`font-bold ${property.paymentStatus?.isOnInstalments ? 'text-blue-600' : 'text-gray-400 italic'}`}>
                        {property.paymentStatus?.isOnInstalments ? "Plan Available" : "Lump Sum Only"}
                    </p>
                 </div>
                 <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Possession</p>
                    <p className="font-bold text-gray-900">
                        {property.paymentStatus?.possessionPaid ? "Paid" : "Pending"}
                    </p>
                 </div>
                 <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">TruCheck™</p>
                    <p className={`font-bold ${property.verification?.isTruCheck ? 'text-green-600' : 'text-gray-400'}`}>
                        {property.verification?.isTruCheck ? "Verified Listing" : "In Progress"}
                    </p>
                 </div>
              </div>
            </section>

            {/* Features & Amenities */}
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-6 uppercase italic tracking-tight">Modern Amenities</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6">
                {Object.entries(property.features || {}).map(([key, val]) => (
                  val === true && (
                    <div key={key} className="flex items-center text-gray-700">
                      <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mr-3">
                         <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                      <span className="text-sm font-bold capitalize text-gray-600">{key.replace(/has|is/g, '').replace(/([A-Z])/g, ' $1')}</span>
                    </div>
                  )
                ))}
              </div>
            </section>

            {/* ── MAP SECTION (NEW) ────────────────────────────────────────── */}
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-6 uppercase italic tracking-tight flex items-center">
                <MapIcon className="w-5 h-5 mr-2 text-blue-600" /> Location Map
              </h3>
              <div className="relative overflow-hidden rounded-[2rem] border border-gray-100">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={15}
                    options={{
                      disableDefaultUI: false,
                      zoomControl: true,
                      styles: [
                        {
                          featureType: "all",
                          elementType: "geometry.fill",
                          stylers: [{ weight: "2.00" }],
                        },
                        {
                          featureType: "all",
                          elementType: "geometry.stroke",
                          stylers: [{ color: "#9c9c9c" }],
                        },
                        {
                          featureType: "all",
                          elementType: "labels.text",
                          stylers: [{ visibility: "on" }],
                        },
                      ],
                    }}
                  >
                    <MarkerF 
                      position={center} 
                      title={property.title}
                    />
                  </GoogleMap>
                ) : (
                  <div className="h-[450px] bg-gray-100 flex items-center justify-center animate-pulse rounded-[2rem]">
                    <p className="text-gray-400 font-bold">Initializing Map...</p>
                  </div>
                )}
              </div>
              <p className="mt-4 text-gray-400 text-xs font-medium flex items-center">
                <Info size={14} className="mr-1" /> Exact location is provided for verified inquiries. 
              </p>
            </section>
          </div>

          {/* ── RIGHT COLUMN: AGENT STICKY CARD ────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Agent Card */}
              <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-blue-600 p-8 text-white text-center">
                  <div className="relative w-28 h-28 mx-auto mb-4">
                    <Image 
                      src={property.agent?.profilePicture || "/default-avatar.png"} 
                      alt="Agent" fill className="rounded-full object-cover border-4 border-white/30" 
                    />
                    {property.agent?.isVerified && (
                      <div className="absolute bottom-1 right-1 bg-green-500 p-1.5 rounded-full border-4 border-blue-600">
                        <ShieldCheck className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-black text-xl mb-1 tracking-tight">{property.agent?.fullName}</h4>
                  <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {property.agent?.agentRank} Specialist
                  </div>
                </div>

                <div className="p-8 space-y-5">
                  <RegisterInterestButton property={property} variant="detail" />

                  <div className="grid grid-cols-2 gap-4">
                    <a href={`tel:${property.agent?.phoneNumber}`} className="flex items-center justify-center gap-2 border-2 border-gray-100 py-3 rounded-2xl font-black text-xs uppercase hover:bg-blue-50 hover:border-blue-100 hover:text-blue-600 transition-all">
                      <Phone className="w-4 h-4" /> Call
                    </a>
                    <a href={`mailto:${property.agent?.email}`} className="flex items-center justify-center gap-2 border-2 border-gray-100 py-3 rounded-2xl font-black text-xs uppercase hover:bg-blue-50 hover:border-blue-100 hover:text-blue-600 transition-all">
                      <Mail className="w-4 h-4" /> Email
                    </a>
                  </div>

                  <Link 
                    href={`/properties?agent=${property.agent?._id}`}
                    className="block text-center text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-blue-600 transition-all"
                  >
                    View agent portfolio
                  </Link>

                  <hr className="border-gray-50" />

                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <Image src={property.agency?.companyLogo} alt="Agency" fill className="object-contain" />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Managing Agency</p>
                      <h5 className="font-black text-gray-800 text-sm leading-tight">{property.agency?.companyName}</h5>
                      <span className="text-[10px] text-green-600 font-bold flex items-center mt-0.5">
                        <ShieldCheck className="w-3 h-3 mr-1"/> {property.agency?.verificationStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Stats Box */}
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-around text-center">
                 <div>
                    <p className="text-xl font-black text-blue-600">{property.metrics?.viewCount || 0}</p>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Views</p>
                 </div>
                 <div className="w-[1px] h-8 bg-gray-100"></div>
                 <div>
                    <p className="text-xl font-black text-blue-600">{property.metrics?.whatsappInquiryCount || 0}</p>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Leads</p>
                 </div>
                 <div className="w-[1px] h-8 bg-gray-100"></div>
                 <div>
                    <p className="text-xl font-black text-blue-600">{property.metrics?.saveCount || 0}</p>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Saves</p>
                 </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// Helper component
function StatRow({ label, value, icon }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div className="flex items-center text-gray-500 gap-2">
                <span className="text-blue-500">{icon}</span>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter">{label}</span>
            </div>
            <span className="text-sm font-black text-gray-800">{value || "Standard"}</span>
        </div>
    );
}