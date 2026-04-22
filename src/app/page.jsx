// import Navbar from "@/components/PublicNavbar";
// import {
//   Search,
//   Home,
//   SlidersHorizontal,
//   ShieldCheck,
//   BadgeDollarSign,
//   Map,
// } from "lucide-react";
// import Image from "next/image";

// export default function HomePage() {
//   return (
//     <main className="relative min-h-screen bg-white">
//       {/* Integrated Navbar */}
//       <Navbar />

//       {/* Hero Section */}
//       <section className="relative h-[650px] w-full flex items-center justify-center">
//         <Image
//           src="/hero-bg.jpg" // Use the modern building image from your template
//           alt="Modern Real Estate"
//           fill
//           className="object-cover brightness-50"
//           priority
//         />
//         <div className="relative z-10 text-center text-white px-4">
//           <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4">
//             It&rsquo;s great to be home!
//           </p>
//           <h1 className="text-4xl md:text-6xl font-bold mb-10">
//             Find Your Perfect Home
//           </h1>

//           {/* Tabbed Search Bar */}
//           <div className="max-w-5xl mx-auto">
//             <div className="flex justify-center space-x-6 mb-4">
//               {["Rent", "Sale", "Sold"].map((tab) => (
//                 <button
//                   key={tab}
//                   className="text-sm font-bold border-b-2 border-transparent hover:border-white pb-1 transition-all"
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>

//             <div className="bg-white rounded-lg p-2 md:p-4 flex flex-col md:flex-row items-center gap-4 shadow-2xl">
//               <div className="flex-1 w-full border-r border-slate-200 px-4 text-left">
//                 <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
//                   Type
//                 </label>
//                 <div className="flex items-center text-slate-900 font-medium">
//                   Property Type
//                 </div>
//               </div>
//               <div className="flex-1 w-full border-r border-slate-200 px-4 text-left">
//                 <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
//                   Locations
//                 </label>
//                 <div className="flex items-center text-slate-900 font-medium text-sm">
//                   All Cities
//                 </div>
//               </div>
//               <div className="flex-1 w-full px-4 text-left">
//                 <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
//                   Search
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter keywords"
//                   className="w-full text-slate-900 outline-none text-sm placeholder:text-slate-400"
//                 />
//               </div>
//               <div className="flex items-center gap-4 px-4">
//                 <button className="flex items-center gap-2 text-slate-600 text-sm font-medium">
//                   <SlidersHorizontal size={18} /> Advanced
//                 </button>
//                 <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all">
//                   <Search size={18} /> SEARCH
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Featured Properties Section */}
//       <section className="py-20 max-w-7xl mx-auto px-4">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-slate-900 mb-2">
//             Discover Our Featured Properties
//           </h2>
//           <p className="text-slate-500 text-sm">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {/* Example Card Structure matching your screenshot */}
//           {[1, 2, 3, 4].map((i) => (
//             <div
//               key={i}
//               className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
//             >
//               <div className="relative h-48 bg-slate-200">
//                 <div className="absolute top-2 left-2 flex gap-1">
//                   <span className="bg-blue-500 text-[8px] text-white font-bold px-2 py-1 rounded">
//                     FEATURED
//                   </span>
//                   <span className="bg-slate-900/80 text-[8px] text-white font-bold px-2 py-1 rounded uppercase">
//                     For Sale
//                   </span>
//                 </div>
//               </div>
//               <div className="p-4">
//                 <h4 className="font-bold text-slate-900">Luxury Family Home</h4>
//                 <p className="text-xs text-slate-400 mb-4">1595 York Ave, NY</p>
//                 <div className="flex justify-between text-slate-500 text-[10px] border-t pt-4">
//                   <span>3 Beds</span>
//                   <span>1 Baths</span>
//                   <span>250 sqft</span>
//                 </div>
//                 <div className="flex justify-between items-center mt-4">
//                   <span className="font-bold text-slate-900">$1800/mo</span>
//                   <div className="flex gap-2 text-slate-300">
//                     <SlidersHorizontal size={14} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Why Choose Us Section */}
//       <section className="bg-slate-50 py-20">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <h2 className="text-3xl font-bold text-slate-900 mb-2">
//             Why Choose Us
//           </h2>
//           <p className="text-slate-500 text-sm mb-16">
//             We provide full service at every step
//           </p>

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <WhyChooseCard
//               icon={<ShieldCheck className="text-blue-600" size={32} />}
//               title="Trusted By Thousands"
//             />
//             <WhyChooseCard
//               icon={<Home className="text-blue-600" size={32} />}
//               title="Wide Range Of Properties"
//             />
//             <WhyChooseCard
//               icon={<BadgeDollarSign className="text-blue-600" size={32} />}
//               title="Financing Made Easy"
//             />
//             <WhyChooseCard
//               icon={<Map className="text-blue-600" size={32} />}
//               title="See Neighborhoods"
//             />
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

// function WhyChooseCard({ icon, title }) {
//   return (
//     <div className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center text-center">
//       <div className="mb-4">{icon}</div>
//       <h4 className="font-bold text-slate-900 mb-3">{title}</h4>
//       <p className="text-xs text-slate-500 leading-relaxed">
//         With over 1 million+ homes for sale available on the website, Trulia can
//         match you with a house you will want to call home.
//       </p>
//     </div>
//   );
// }








"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/PublicNavbar";

// ─── ICONS (inline SVGs to avoid dependency issues) ───────────────────────────
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.06-1.06a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);
const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const SlidersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>
  </svg>
);
const BedIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16"/><path d="M2 8h18a2 2 0 012 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>
  </svg>
);
const BathIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6L6.5 3.5a1.5 1.5 0 00-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 002 2h12a2 2 0 002-2v-5"/><line x1="20" y1="12" x2="4" y2="12"/>
  </svg>
);
const GarageIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/><path d="M2 12h20"/>
  </svg>
);
const AreaIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M3 14h7v7H3z"/><path d="M14 14h7v7h-7z"/>
  </svg>
);
const HeartIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);
const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const MaximizeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
  </svg>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const FEATURED_PROPERTIES = [
  {
    id: 1,
    tag: "For Rent",
    tagColor: "bg-blue-600",
    badge: "Featured",
    title: "Luxury Family Home",
    address: "1595 York Ave, NY",
    beds: 3, baths: 1, garages: 0, area: 250,
    price: "$1800/mo",
    agent: "https://i.pravatar.cc/32?img=1",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80",
  },
  {
    id: 2,
    tag: "For Sale",
    tagColor: "bg-green-600",
    badge: "Featured",
    title: "Selway Apartments",
    address: "25-68 11th St, Queens, NY",
    beds: 3, baths: 1, garages: 1, area: 160,
    price: "$3900",
    agent: "https://i.pravatar.cc/32?img=2",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80",
  },
  {
    id: 3,
    tag: "For Rent",
    tagColor: "bg-blue-600",
    badge: "Featured",
    title: "Arlo Apartment",
    address: "518-042 E 71st St, NY",
    beds: 4, baths: 1, garages: 1, area: 250,
    price: "$1500/mo",
    agent: "https://i.pravatar.cc/32?img=3",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
  },
  {
    id: 4,
    tag: "For Sale",
    tagColor: "bg-green-600",
    badge: "Featured",
    title: "Gorgeous Villa Bay",
    address: "411 E 67th St, NY",
    beds: 3, baths: 1, garages: 1, area: 250,
    price: "$4400",
    agent: "https://i.pravatar.cc/32?img=4",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
  },
];

const WHY_CHOOSE = [
  {
    icon: "💬",
    title: "Trusted By Thousands",
    desc: "With over 1 million+ homes for sale available on the website, Trulia can match you with a house you will want to call home.",
    color: "bg-blue-50",
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    icon: "🏠",
    title: "Wide Range Of Properties",
    desc: "With over 1 million+ homes for sale available on the website, Trulia can match you with a house you will want to call home.",
    color: "bg-white",
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    icon: "🧮",
    title: "Financing Made Easy",
    desc: "With over 1 million+ homes for sale available on the website, Trulia can match you with a house you will want to call home.",
    color: "bg-white",
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    icon: "🗺️",
    title: "See Neighborhoods",
    desc: "With over 1 million+ homes for sale available on the website, Trulia can match you with a house you will want to call home.",
    color: "bg-white",
    iconBg: "bg-blue-100 text-blue-600",
  },
];

const NAV_LINKS = ["Home", "Properties", "Members", "Pages", "Contact"];

// ─── PROPERTY CARD ─────────────────────────────────────────────────────────────
function PropertyCard({ property }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-white bg-blue-800/80 px-2 py-0.5 rounded">
          Featured
        </span>
        <span className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded ${property.tagColor}`}>
          {property.tag}
        </span>
        <img
          src={property.agent}
          alt="agent"
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full border-2 border-white shadow"
        />
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm mb-1">{property.title}</h3>
        <p className="text-gray-400 text-xs flex items-center gap-1 mb-3">
          <MapPinIcon />{property.address}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-gray-400 text-xs border-t border-gray-100 pt-3 mb-3">
          <span className="flex items-center gap-1"><BedIcon />{property.beds} Beds</span>
          <span className="flex items-center gap-1"><BathIcon />{property.baths} Baths</span>
          {property.garages > 0 && <span className="flex items-center gap-1"><GarageIcon />{property.garages} Garages</span>}
          <span className="flex items-center gap-1"><AreaIcon />{property.area} sqft</span>
        </div>

        {/* Price + Actions */}
        <div className="flex items-center justify-between">
          <span className="text-blue-700 font-bold text-sm">{property.price}</span>
          <div className="flex items-center gap-2 text-gray-400">
            <button className="hover:text-gray-600 transition-colors"><MaximizeIcon /></button>
            <button onClick={() => setLiked(!liked)} className="hover:text-red-500 transition-colors">
              <HeartIcon filled={liked} />
            </button>
            <button className="hover:text-gray-600 transition-colors"><ShareIcon /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function HouzingHomePage() {
  const [activeTab, setActiveTab] = useState("Rent");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("All Cities");
  const [keyword, setKeyword] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <Navbar />

      {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[520px] flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,42,0.55), rgba(15,23,42,0.55)), url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 text-center px-4 w-full max-w-3xl mx-auto">
          {/* Subtitle */}
          <p className="text-gray-300 text-sm tracking-[0.2em] uppercase mb-3 font-medium">
            It&apos;s Great To Be Home!
          </p>

          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
            Find Your Perfect Home
          </h1>

          {/* Search Box */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden mx-auto max-w-2xl">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              {["Rent", "Sale", "Sold"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab
                      ? "text-blue-600 font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t" />
                  )}
                </button>
              ))}
            </div>

            {/* Search Fields */}
            <div className="flex items-stretch">
              {/* Property Type */}
              <div className="flex-1 border-r border-gray-100">
                <div className="px-4 pt-2 pb-0.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Type</label>
                </div>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 pb-3 pt-0 text-sm text-gray-500 bg-transparent border-none outline-none appearance-none cursor-pointer"
                >
                  <option value="">Property Type</option>
                  <option>House</option>
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>Office</option>
                </select>
              </div>

              {/* Location */}
              <div className="flex-1 border-r border-gray-100">
                <div className="px-4 pt-2 pb-0.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Locations</label>
                </div>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 pb-3 pt-0 text-sm text-gray-500 bg-transparent border-none outline-none appearance-none cursor-pointer"
                >
                  <option>All Cities</option>
                  <option>New York</option>
                  <option>Los Angeles</option>
                  <option>Chicago</option>
                </select>
              </div>

              {/* Keyword */}
              <div className="flex-1 border-r border-gray-100">
                <div className="px-4 pt-2 pb-0.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Search</label>
                </div>
                <input
                  type="text"
                  placeholder="Enter keywords"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full px-4 pb-3 pt-0 text-sm text-gray-600 bg-transparent border-none outline-none placeholder:text-gray-400"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-0 flex-shrink-0">
                <button className="flex items-center gap-1.5 px-4 h-full text-sm text-blue-600 font-medium border-r border-gray-100 hover:bg-blue-50 transition-colors whitespace-nowrap">
                  <SlidersIcon />
                  Advanced Search
                </button>
                <button className="flex items-center gap-2 px-5 h-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors whitespace-nowrap rounded-r-lg">
                  <SearchIcon />
                  SEARCH
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ─────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Discover Our Featured Properties
            </h2>
            <p className="text-gray-400 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </p>
          </div>

          {/* Property Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED_PROPERTIES.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Dots Pagination */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {[0,1,2,3,4,5].map((i) => (
              <button
                key={i}
                className={`rounded-full transition-all ${
                  i === 0
                    ? "w-6 h-2.5 bg-blue-600"
                    : "w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Why Choose Us
            </h2>
            <p className="text-gray-400 text-sm">We provide full service at every step</p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 text-2xl">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-800 text-sm mb-3">{item.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER (minimal matching template) ──────────────────────────────── */}
      <footer className="bg-gray-800 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
              <MapPinIcon />
            </div>
            <span className="text-white font-bold text-lg">Houzing</span>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Houzing. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs">
            {["Privacy Policy", "Terms of Use", "Contact"].map((l) => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}