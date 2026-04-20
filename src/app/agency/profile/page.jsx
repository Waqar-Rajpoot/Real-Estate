// "use client";

// import React, { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { 
//   Building2, MapPin, Globe, Phone, Mail, Award, 
//   Users, Home, Eye, CheckCircle2, AlertCircle, Clock 
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";

// export default function AgencyProfilePage() {
//   const { data: session } = useSession();
//   const [agency, setAgency] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await fetch("/api/agency/profile");
//         const json = await res.json();
//         if (json.success) setAgency(json.data);
//       } catch (error) {
//         console.error("Failed to fetch agency profile", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   if (loading) return <div className="p-10 text-center">Loading Profile...</div>;
//   if (!agency) return <div className="p-10 text-center text-red-500">Profile not found.</div>;

//   return (
//     <div className="min-h-screen bg-slate-50 pb-20">
//       {/* 1. COVER IMAGE & LOGO SECTION */}
//       <div className="relative h-64 w-full bg-slate-200">
//         {agency.coverImageUrl ? (
//           <Image src={agency.coverImageUrl} fill className="object-cover" alt="Cover" />
//         ) : (
//           <div className="w-full h-full bg-linear-to-r from-blue-900 to-slate-800" />
//         )}
        
//         <div className="absolute -bottom-16 left-8 flex items-end gap-6">
//           <div className="relative h-32 w-32 rounded-2xl overflow-hidden border-4 border-white bg-white shadow-xl">
//             <Image src={agency.companyLogo} fill className="object-contain" alt="Logo" />
//           </div>
//           <div className="mb-4">
//             <div className="flex items-center gap-2">
//               <h1 className="text-3xl font-bold text-white drop-shadow-md">{agency.companyName}</h1>
//               {agency.verificationStatus === "Verified" && (
//                 <CheckCircle2 className="text-blue-400 fill-white" size={24} />
//               )}
//             </div>
//             <p className="text-white/90 flex items-center gap-1">
//               <MapPin size={16} /> {agency.city}, {agency.country}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-8 mt-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         {/* LEFT COLUMN: ABOUT & CONTACT */}
//         <div className="lg:col-span-2 space-y-8">
//           <Card className="border-none shadow-sm">
//             <CardHeader>
//               <CardTitle>About Agency</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-slate-600 leading-relaxed whitespace-pre-line">
//                 {agency.companyBio || "No biography provided yet."}
//               </p>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
//                 <div className="flex items-center gap-3 text-slate-600">
//                   <div className="p-2 bg-slate-100 rounded-lg"><Building2 size={18} /></div>
//                   <div>
//                     <p className="text-xs text-slate-400 uppercase font-bold">License</p>
//                     <p className="font-medium">{agency.licenseNumber}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3 text-slate-600">
//                   <div className="p-2 bg-slate-100 rounded-lg"><Clock size={18} /></div>
//                   <div>
//                     <p className="text-xs text-slate-400 uppercase font-bold">Established</p>
//                     <p className="font-medium">{agency.yearEstablished}</p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* QUICK STATS */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[
//               { label: "Total Agents", value: agency.totalAgents, icon: <Users /> },
//               { label: "Listings", value: agency.totalListings, icon: <Home /> },
//               { label: "Views", value: agency.totalViews, icon: <Eye /> },
//               { label: "Sold", value: agency.totalSoldProperties, icon: <Award /> },
//             ].map((stat, idx) => (
//               <Card key={idx} className="border-none shadow-sm text-center">
//                 <CardContent className="pt-6">
//                   <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-full mb-3">
//                     {React.cloneElement(stat.icon, { size: 20 })}
//                   </div>
//                   <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
//                   <p className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>

//         {/* RIGHT COLUMN: STATUS & CONTACT DETAILS */}
//         <div className="space-y-6">
//           {/* VERIFICATION STATUS CARD */}
//           <Card className={`border-none shadow-sm ${agency.verificationStatus === 'Verified' ? 'bg-green-50' : 'bg-amber-50'}`}>
//             <CardContent className="pt-6">
//               <div className="flex items-center gap-3 mb-4">
//                 {agency.verificationStatus === 'Verified' ? 
//                   <CheckCircle2 className="text-green-600" /> : 
//                   <AlertCircle className="text-amber-600" />
//                 }
//                 <span className="font-bold text-slate-800">
//                   Status: {agency.verificationStatus}
//                 </span>
//               </div>
//               <p className="text-sm text-slate-600 mb-4">
//                 {agency.verificationStatus === 'Verified' 
//                   ? "Your agency is verified and can list properties publicly." 
//                   : "Your documents are currently being reviewed by our team."}
//               </p>
//               <Button variant="outline" className="w-full bg-white">Refresh Status</Button>
//             </CardContent>
//           </Card>

//           {/* CONTACT INFO */}
//           <Card className="border-none shadow-sm">
//             <CardHeader><CardTitle className="text-lg">Contact Details</CardTitle></CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center gap-3 text-sm">
//                 <Mail className="text-slate-400" size={18} />
//                 <span className="text-slate-600">{agency.officialEmail}</span>
//               </div>
//               <div className="flex items-center gap-3 text-sm">
//                 <Phone className="text-slate-400" size={18} />
//                 <span className="text-slate-600">{agency.officialNumber}</span>
//               </div>
//               <div className="flex items-center gap-3 text-sm">
//                 <Globe className="text-slate-400" size={18} />
//                 <span className="text-slate-600">{agency.companyWebsite || "No website linked"}</span>
//               </div>
              
//               <div className="pt-4 border-t">
//                 <p className="text-xs font-bold text-slate-400 uppercase mb-2">Office Address</p>
//                 <p className="text-sm text-slate-600 italic">{agency.officeAddress}</p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }







"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { 
  Building2, MapPin, Globe, Phone, Mail, Award, 
  Users, Home, Eye, CheckCircle2, AlertCircle, Clock,
  ExternalLink, Briefcase, ShieldCheck, Map
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AgencyProfilePage() {
  const { data: session } = useSession();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/agency/profile");
        const json = await res.json();
        if (json.success) setAgency(json.data);
      } catch (error) {
        console.error("Failed to fetch agency profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (!agency) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium">
      Profile not found.
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* 1. PREMIUM HEADER SECTION */}
      <div className="relative h-80 w-full overflow-hidden">
        {agency.coverImageUrl ? (
          <Image src={agency.coverImageUrl} fill className="object-cover brightness-[0.7]" alt="Cover" priority />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900" />
        )}
        
        <div className="absolute inset-0 bg-black/20" /> {/* Subtle Overlay */}

        <div className="absolute -bottom-1 w-full h-24 bg-gradient-to-t from-[#F8FAFC] to-transparent" />

        <div className="absolute bottom-10 left-0 w-full px-8 lg:px-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative h-40 w-40 rounded-3xl overflow-hidden border-[6px] border-white bg-white shadow-2xl flex-shrink-0">
              <Image src={agency.companyLogo} fill className="object-contain p-2" alt="Logo" />
            </div>
            
            <div className="text-center md:text-left pb-4">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">
                  {agency.companyName}
                </h1>
                {agency.verificationStatus === "Verified" && (
                  <div className="bg-blue-500 p-1 rounded-full border-2 border-white shadow-lg">
                    <CheckCircle2 className="text-white" size={20} />
                  </div>
                )}
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <p className="text-blue-50 flex items-center gap-1.5 font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                  <MapPin size={16} className="text-blue-300" /> {agency.city}, {agency.country}
                </p>
                <p className="text-blue-50 flex items-center gap-1.5 font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                  <ShieldCheck size={16} className="text-blue-300" /> {agency.licenseNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-12 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: 8 Units Wide */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* ABOUT CARD */}
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="border-b border-slate-50 pb-4">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="text-blue-600" size={20} /> Agency Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                {agency.companyBio || "No biography provided yet."}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                  <div className="p-3 bg-white shadow-sm rounded-xl text-blue-600">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Registration License</p>
                    <p className="font-bold text-slate-800 text-lg">{agency.licenseNumber}</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                  <div className="p-3 bg-white shadow-sm rounded-xl text-blue-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Years in Business</p>
                    <p className="font-bold text-slate-800 text-lg">{agency.yearEstablished} (Est.)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* STATS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Elite Agents", value: agency.totalAgents, icon: <Users />, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Active Listings", value: agency.totalListings, icon: <Home />, color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "Client Views", value: agency.totalViews, icon: <Eye />, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Closed Deals", value: agency.totalSoldProperties, icon: <Award />, color: "text-amber-600", bg: "bg-amber-50" },
            ].map((stat, idx) => (
              <Card key={idx} className="border-none shadow-sm ring-1 ring-slate-200 group hover:ring-blue-400 transition-all duration-300">
                <CardContent className="pt-6 text-center">
                  <div className={`inline-flex p-3 ${stat.bg} ${stat.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                    {React.cloneElement(stat.icon, { size: 24 })}
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: 4 Units Wide */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* VERIFICATION BADGE */}
          <Card className={`border-none shadow-md overflow-hidden ${
            agency.verificationStatus === 'Verified' 
            ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
            : 'bg-gradient-to-br from-amber-400 to-orange-500'
          }`}>
            <CardContent className="pt-8 pb-6 text-white text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/30">
                {agency.verificationStatus === 'Verified' 
                  ? <CheckCircle2 size={32} /> 
                  : <AlertCircle size={32} />
                }
              </div>
              <h3 className="text-xl font-bold mb-2">
                {agency.verificationStatus === 'Verified' ? "Officially Verified" : "Verification Pending"}
              </h3>
              <p className="text-sm text-white/80 px-4 mb-6 leading-snug">
                {agency.verificationStatus === 'Verified' 
                  ? "Your agency has met all compliance standards for public listing." 
                  : "We are currently reviewing your documents for approval."}
              </p>
              <Button variant="outline" className="w-full bg-white/10 hover:bg-white/20 border-white/40 text-white shadow-none">
                Update Records
              </Button>
            </CardContent>
          </Card>

          {/* CONTACT INFO CARD */}
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-lg font-bold text-slate-900">Communication</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-center gap-4 group">
                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Mail className="text-slate-500 group-hover:text-blue-600" size={18} />
                </div>
                <div className="truncate">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Support Email</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{agency.officialEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Phone className="text-slate-500 group-hover:text-blue-600" size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Hotline</p>
                  <p className="text-sm font-bold text-slate-700">{agency.officialNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Globe className="text-slate-500 group-hover:text-blue-600" size={18} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Digital Presence</p>
                  <a href={agency.companyWebsite} target="_blank" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                    Visit Website <ExternalLink size={12} />
                  </a>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <div className="flex gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg h-fit">
                    <Map className="text-slate-500" size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Corporate Office</p>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed italic">{agency.officeAddress}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}