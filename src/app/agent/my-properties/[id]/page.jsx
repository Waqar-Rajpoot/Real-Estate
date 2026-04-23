// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import { 
//   MapPin, BedDouble, Bath, Maximize2, Eye, 
//   ArrowLeft, Calendar, Info, CheckCircle2, 
//   Wallet, Building, Hash, Clock
// } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export default function PropertyDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [property, setProperty] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeImage, setActiveImage] = useState(0);

//   useEffect(() => {
//     fetch(`/api/agent/properties/${id}`)
//       .then((res) => res.json())
//       .then((json) => {
//         if (json.success) setProperty(json.data);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, [id]);

//   if (loading) return <div className="p-20 text-center font-bold text-blue-600 animate-pulse">Loading property details...</div>;
//   if (!property) return <div className="p-20 text-center">Property not found.</div>;

//   return (
//     <div className="min-h-screen bg-slate-50/50 pb-20">
//       {/* Top Navigation */}
//       <div className="bg-white border-b sticky top-0 z-10 p-4">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <Button variant="ghost" onClick={() => router.back()} className="font-bold gap-2">
//             <ArrowLeft size={18} /> Back to Listings
//           </Button>
//           <div className="flex gap-2">
//             <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-4 py-1.5 rounded-full font-bold">
//               {property.status}
//             </Badge>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         {/* Left Column: Gallery & Details */}
//         <div className="lg:col-span-2 space-y-6">
          
//           {/* Gallery Section */}
//           <section className="space-y-4">
//             <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-200 border shadow-sm">
//               <Image 
//                 src={property.images[activeImage]?.originalUrl || "/placeholder.jpg"} 
//                 alt="Main view" fill className="object-cover" 
//               />
//             </div>
//             <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
//               {property.images.map((img, idx) => (
//                 <button 
//                   key={idx} 
//                   onClick={() => setActiveImage(idx)}
//                   className={`relative w-24 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === idx ? "border-blue-600 ring-2 ring-blue-100" : "border-transparent"}`}
//                 >
//                   <Image src={img.originalUrl} alt="thumbnail" fill className="object-cover" />
//                 </button>
//               ))}
//             </div>
//           </section>

//           {/* Core Info */}
//           <section className="bg-white p-6 rounded-3xl border shadow-sm">
//             <div className="flex justify-between items-start mb-4">
//               <div>
//                 <span className="text-blue-600 font-black text-xs uppercase tracking-widest">{property.category} • {property.propertyType}</span>
//                 <h1 className="text-3xl font-black text-slate-900 mt-1">{property.title}</h1>
//                 <p className="flex items-center gap-1 text-slate-500 font-medium mt-2">
//                   <MapPin size={18} className="text-red-500" /> {property.location.address}, {property.location.city}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-3xl font-black text-slate-900">{property.currency} {property.price.toLocaleString()}</p>
//                 <p className="text-slate-400 font-bold text-xs uppercase">Total Price</p>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-100 my-6">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><BedDouble size={20}/></div>
//                 <div><p className="text-xs text-slate-400 font-bold">Bedrooms</p><p className="font-bold">{property.bedrooms}</p></div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Bath size={20}/></div>
//                 <div><p className="text-xs text-slate-400 font-bold">Baths</p><p className="font-bold">{property.bathrooms}</p></div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Maximize2 size={20}/></div>
//                 <div><p className="text-xs text-slate-400 font-bold">Area</p><p className="font-bold">{property.area} {property.areaUnit}</p></div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Clock size={20}/></div>
//                 <div><p className="text-xs text-slate-400 font-bold">Age</p><p className="font-bold">{property.age} Years</p></div>
//               </div>
//             </div>

//             <div>
//               <h3 className="font-black text-slate-900 mb-2">Description</h3>
//               <p className="text-slate-600 leading-relaxed font-medium">{property.description}</p>
//             </div>
//           </section>

//           {/* Tabs: Features, Payment, Location */}
//           <Tabs defaultValue="features" className="w-full">
//             <TabsList className="bg-slate-100 p-1 rounded-2xl w-full justify-start gap-2">
//               <TabsTrigger value="features" className="rounded-xl font-bold">Features</TabsTrigger>
//               <TabsTrigger value="payment" className="rounded-xl font-bold">Payment Plan</TabsTrigger>
//               <TabsTrigger value="amenities" className="rounded-xl font-bold">Amenities</TabsTrigger>
//             </TabsList>
            
//             <TabsContent value="features" className="bg-white p-6 rounded-3xl border shadow-sm mt-4">
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
//                 {Object.entries(property.features).map(([key, value]) => (
//                   value === true && (
//                     <div key={key} className="flex items-center gap-2 text-slate-700 font-medium capitalize">
//                       <CheckCircle2 size={16} className="text-emerald-500" />
//                       {key.replace("has", "").replace(/([A-Z])/g, ' $1').trim()}
//                     </div>
//                   )
//                 ))}
//               </div>
//             </TabsContent>

//             <TabsContent value="payment" className="bg-white p-6 rounded-3xl border shadow-sm mt-4">
//               {property.paymentStatus.isOnInstalments ? (
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-2 text-blue-600 font-bold mb-4">
//                     <Wallet size={20} /> Installment Plan Available
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="p-4 bg-slate-50 rounded-2xl border">
//                       <p className="text-xs text-slate-400 font-bold uppercase">Down Payment</p>
//                       <p className="text-lg font-black">{property.currency} {property.paymentStatus.downPayment.toLocaleString()}</p>
//                     </div>
//                     <div className="p-4 bg-slate-50 rounded-2xl border">
//                       <p className="text-xs text-slate-400 font-bold uppercase">Monthly Installment</p>
//                       <p className="text-lg font-black">{property.currency} {property.paymentStatus.monthlyInstalment.toLocaleString()}</p>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-slate-500 font-medium">This property requires full payment upfront.</p>
//               )}
//             </TabsContent>
//           </Tabs>
//         </div>

//         {/* Right Column: Sidebar Stats */}
//         <div className="space-y-6">
//           <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
//             <CardContent className="p-6">
//               <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
//                 <Info size={18} className="text-blue-600" /> Listing Analytics
//               </h3>
//               <div className="space-y-4">
//                 <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
//                   <span className="text-slate-500 font-bold text-sm">Total Views</span>
//                   <span className="font-black flex items-center gap-1"><Eye size={14}/> {property.metrics.viewCount}</span>
//                 </div>
//                 <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
//                   <span className="text-slate-500 font-bold text-sm">WhatsApp Leads</span>
//                   <span className="font-black">{property.metrics.whatsappInquiryCount}</span>
//                 </div>
//                 <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
//                   <span className="text-slate-500 font-bold text-sm">Quality Score</span>
//                   <span className="font-black text-emerald-600">{property.qualityScore}%</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="rounded-3xl border-none shadow-sm bg-slate-900 text-white overflow-hidden">
//             <CardContent className="p-6">
//               <h3 className="font-black mb-4">Listing Actions</h3>
//               <div className="space-y-3">
//                 <Button className="w-full bg-blue-600 hover:bg-blue-700 font-bold rounded-xl">Edit Property</Button>
//                 <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl">Mark as Sold</Button>
//                 <Button variant="ghost" className="w-full text-red-400 hover:text-red-300 font-bold">Delete Listing</Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }









"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  MapPin, BedDouble, Bath, Maximize2, Eye, 
  ArrowLeft, CheckCircle2, Wallet, Info, 
  Clock, Share2, Pencil, Trash2, CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const statusConfig = {
  Active: { color: "bg-emerald-50 text-emerald-600 border-emerald-200", label: "Active Listing" },
  Pending: { color: "bg-amber-50 text-amber-600 border-amber-200", label: "Under Review" },
  Rejected: { color: "bg-red-50 text-red-600 border-red-200", label: "Action Required" },
};

export default function PropertyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetch(`/api/agent/properties/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setProperty(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-sm font-semibold text-slate-500">Loading Details...</p>
      </div>
    </div>
  );

  if (!property) return <div className="p-20 text-center font-medium">Listing not found.</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Sticky Bar */}
      <div className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <Button variant="ghost" onClick={() => router.back()} className="text-slate-600 hover:bg-slate-100">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden border-slate-200 sm:flex">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button size="sm" className="bg-blue-600 font-bold hover:bg-blue-700">
              <Pencil className="mr-2 h-4 w-4" /> Edit Listing
            </Button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* LEFT CONTENT - 8 Columns */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Title & Status Section */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className={`${statusConfig[property.status]?.color} border font-bold px-3 py-1 rounded-md`}>
                  {statusConfig[property.status]?.label}
                </Badge>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">{property.category} • {property.propertyType}</span>
              </div>
              
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{property.title}</h1>
                  <p className="mt-2 flex items-center text-slate-500 font-medium">
                    <MapPin className="mr-1 h-4 w-4 text-slate-400" /> {property.location.address}, {property.location.city}
                  </p>
                </div>
                <div className="flex flex-col md:items-end">
                  <p className="text-xs font-bold uppercase text-slate-400">Asking Price</p>
                  <p className="text-3xl font-extrabold text-blue-600">
                    <span className="text-lg font-bold mr-1">{property.currency}</span>
                    {property.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Gallery Wrapper */}
            <div className="space-y-3">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border bg-slate-100 shadow-sm">
                <Image 
                  src={property.images[activeImage]?.originalUrl || "/placeholder.jpg"} 
                  alt="Property Image" fill className="object-cover transition-all duration-500" 
                  priority
                />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {property.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${activeImage === idx ? "border-blue-600 opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <Image src={img.originalUrl} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { icon: BedDouble, label: "Bedrooms", value: property.bedrooms },
                { icon: Bath, label: "Bathrooms", value: property.bathrooms },
                { icon: Maximize2, label: "Area", value: `${property.area} ${property.areaUnit}` },
                { icon: Clock, label: "Built In", value: `${property.age} Yrs` }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center rounded-2xl border bg-white p-4 text-center shadow-sm">
                  <stat.icon className="mb-2 h-5 w-5 text-slate-400" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</p>
                  <p className="text-sm font-bold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Tabs Styling */}
            <Tabs defaultValue="details" className="w-full">
  {/* 1. Added 'overflow-x-auto' and 'scrollbar-hide' to allow swiping on mobile.
      2. Removed 'h-12' to let it adjust, and added 'w-max' or 'min-w-full' 
  */}
  <TabsList className="flex w-full justify-start gap-4 md:gap-8 border-b bg-transparent p-0 overflow-x-auto scrollbar-hide shrink-0 mb-2">
    <TabsTrigger 
      value="details" 
      className="rounded-none border-b-2 border-transparent px-2 pb-3 pt-0 font-bold whitespace-nowrap data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600"
    >
      Overview
    </TabsTrigger>
    <TabsTrigger 
      value="amenities" 
      className="rounded-none border-b-2 border-transparent px-2 pb-3 pt-0 font-bold whitespace-nowrap data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600"
    >
      Amenities
    </TabsTrigger>
    <TabsTrigger 
      value="payment" 
      className="rounded-none border-b-2 border-transparent px-2 pb-3 pt-0 font-bold whitespace-nowrap data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600"
    >
      Payment Plan
    </TabsTrigger>
  </TabsList>

  <TabsContent value="details" className="mt-6 space-y-6 overflow-hidden">
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">About this property</h3>
      {/* Added break-words to handle long descriptions */}
      <p className="text-slate-600 leading-relaxed font-medium break-words whitespace-pre-wrap">
        {property.description}
      </p>
    </div>
    
    <Separator />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="min-w-0"> {/* min-w-0 prevents grid item overflow */}
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Property Details</h4>
        <ul className="space-y-3">
          <li className="flex justify-between gap-4 text-sm font-medium">
            <span className="text-slate-500 shrink-0">Purpose</span> 
            <span className="text-right break-words">{property.purpose}</span>
          </li>
          <li className="flex justify-between gap-4 text-sm font-medium">
            <span className="text-slate-500 shrink-0">Condition</span> 
            <span className="text-right break-words">{property.condition}</span>
          </li>
          <li className="flex justify-between gap-4 text-sm font-medium">
            <span className="text-slate-500 shrink-0">Furnishing</span> 
            <span className="text-right break-words">{property.furnishingStatus}</span>
          </li>
        </ul>
      </div>
      
      <div className="min-w-0">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Location Context</h4>
        <ul className="space-y-3">
          <li className="flex justify-between gap-4 text-sm font-medium">
            <span className="text-slate-500 shrink-0">Area Unit</span> 
            <span className="text-right break-words">{property.areaUnit}</span>
          </li>
          <li className="flex justify-between gap-4 text-sm font-medium">
            <span className="text-slate-500 shrink-0">Landmarks</span> 
            <span className="text-right break-words leading-tight">{property.location.nearbyLandmarks?.join(", ")}</span>
          </li>
        </ul>
      </div>
    </div>
  </TabsContent>

  <TabsContent value="amenities" className="mt-6">
    {/* Switched to 1 column on very small screens, 2 on mobile, 3 on desktop */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {Object.entries(property.features).map(([key, value]) => (
        value === true && (
          <div key={key} className="flex items-center gap-2 rounded-xl border bg-white p-3 text-sm font-semibold text-slate-700 shadow-sm min-w-0">
            <CheckCircle className="h-4 w-4 text-blue-600 shrink-0" />
            <span className="truncate">{key.replace("has", "").replace(/([A-Z])/g, ' $1').trim()}</span>
          </div>
        )
      ))}
    </div>
  </TabsContent>

  <TabsContent value="payment" className="mt-6">
    <Card className="border-slate-200 bg-blue-50/30 overflow-hidden">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-3 text-blue-700 font-bold mb-4">
          <Wallet size={20} className="shrink-0" /> Installment Structure
        </div>
        {property.paymentStatus.isOnInstalments ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-white p-4 border shadow-sm">
              <p className="text-xs font-bold uppercase text-slate-400 mb-1">Down Payment</p>
              <p className="text-lg md:text-xl font-black text-slate-900 truncate">
                {property.currency} {property.paymentStatus.downPayment.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 border shadow-sm">
              <p className="text-xs font-bold uppercase text-slate-400 mb-1">Monthly</p>
              <p className="text-lg md:text-xl font-black text-slate-900 truncate">
                {property.currency} {property.paymentStatus.monthlyInstalment.toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm font-medium text-slate-600">Full payment is required for this property.</p>
        )}
      </CardContent>
    </Card>
  </TabsContent>
</Tabs>
          </div>

          {/* RIGHT SIDEBAR - 4 Columns */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="overflow-hidden border-slate-200 shadow-sm rounded-2xl">
              <CardHeader className="bg-slate-50/50 pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {[
                  { label: "Total Page Views", value: property.metrics.viewCount, icon: Eye },
                  { label: "WhatsApp Leads", value: property.metrics.whatsappInquiryCount, icon: Info },
                  { label: "Quality Score", value: `${property.qualityScore}%`, icon: CheckCircle2 }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <item.icon className="h-4 w-4 text-slate-400" /> {item.label}
                    </div>
                    <span className="text-sm font-bold text-slate-900">{item.value}</span>
                  </div>
                ))}
                <Separator className="my-4" />
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase text-slate-400">Listed On</p>
                  <p className="text-sm font-medium text-slate-900">{new Date(property.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button className="w-full rounded-xl bg-blue-600 py-6 text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700">
                Feature this Listing
              </Button>
              <Button variant="outline" className="w-full rounded-xl py-6 text-sm font-bold border-slate-200 hover:bg-slate-50">
                Mark as Sold / Rented
              </Button>
              <Button variant="ghost" className="w-full py-6 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> Permanently Delete
              </Button>
            </div>

            {property.status === "Rejected" && (
              <Card className="border-red-200 bg-red-50/50 rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-red-500 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-red-900">Correction Required</p>
                      <p className="mt-1 text-sm text-red-700 leading-snug">{property.rejectionReason || "Please review images and description quality."}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}