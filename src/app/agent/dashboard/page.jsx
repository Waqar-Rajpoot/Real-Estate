// // "use client";

// // import { useEffect, useState } from "react";
// // import {
// //   Briefcase,
// //   MapPin,
// //   Phone,
// //   MessageSquare,
// //   Eye,
// //   Home,
// //   Star,
// //   Verified,
// //   ShieldCheck,
// //   Calendar,
// // } from "lucide-react";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import Image from "next/image";

// // export default function AgentDashboard() {
// //   const [agent, setAgent] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     fetch("/api/agent/profile")
// //       .then((res) => res.json())
// //       .then((data) => {
// //         if (data.success) setAgent(data.agent);
// //         setLoading(false);
// //       });
// //   }, []);

// //   if (loading)
// //     return (
// //       <div className="p-10 text-center font-bold">
// //         Loading Agent Dashboard...
// //       </div>
// //     );
// //   if (!agent)
// //     return <div className="p-10 text-center">No agent data found.</div>;

// //   const stats = [
// //     {
// //       label: "Active Listings",
// //       value: agent.activeListings,
// //       icon: <Home className="text-blue-600" />,
// //     },
// //     {
// //       label: "Total Views",
// //       value: agent.totalViews,
// //       icon: <Eye className="text-purple-600" />,
// //     },
// //     {
// //       label: "Leads Received",
// //       value: agent.totalLeads,
// //       icon: <MessageSquare className="text-green-600" />,
// //     },
// //     {
// //       label: "Closed Deals",
// //       value: agent.closedDealsCount,
// //       icon: <ShieldCheck className="text-amber-600" />,
// //     },
// //   ];

// //   return (
// //     <div className="min-h-screen bg-slate-50 p-4 md:p-8">
// //       <div className="max-w-6xl mx-auto space-y-6">
// //         {/* Header Section */}
// //         <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
// //           <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-50 shadow-md">
// //             <Image
// //               src={agent.profilePicture || "/default-avatar.png"}
// //               alt={agent.fullName}
// //               fill
// //               className="object-cover"
// //             />
// //           </div>
// //           <div className="flex-1 text-center md:text-left">
// //             <div className="flex items-center justify-center md:justify-start gap-2">
// //               <h1 className="text-2xl font-bold text-slate-900">
// //                 {agent.fullName}
// //               </h1>
// //               {agent.isVerified && (
// //                 <Verified className="text-blue-500" size={20} />
// //               )}
// //               <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
// //                 {agent.agentRank}
// //               </span>
// //             </div>
// //             <p className="text-slate-500 font-medium mb-2">
// //               {agent.specialization} Property Specialist
// //             </p>
// //             <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-600">
// //               <span className="flex items-center gap-1">
// //                 <MapPin size={14} /> {agent.serviceCity}
// //               </span>
// //               <span className="flex items-center gap-1">
// //                 <Phone size={14} /> {agent.whatsappNumber}
// //               </span>
// //               <span className="flex items-center gap-1">
// //                 <Star size={14} className="text-amber-400 fill-amber-400" />{" "}
// //                 {agent.rating} ({agent.reviewCount} Reviews)
// //               </span>
// //             </div>
// //           </div>
// //           <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hidden lg:block">
// //             <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">
// //               Response Rate
// //             </p>
// //             <p className="text-xl font-bold text-slate-900">
// //               {agent.responseRate}%
// //             </p>
// //             <p className="text-[10px] text-green-600">
// //               {agent.avgResponseTime}
// //             </p>
// //           </div>
// //         </div>

// //         {/* Stats Grid */}
// //         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
// //           {stats.map((stat, i) => (
// //             <Card key={i} className="border-none shadow-sm shadow-blue-100">
// //               <CardContent className="p-6 flex flex-col items-center justify-center space-y-2">
// //                 <div className="p-3 bg-slate-50 rounded-full">{stat.icon}</div>
// //                 <p className="text-2xl font-black text-slate-900">
// //                   {stat.value}
// //                 </p>
// //                 <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">
// //                   {stat.label}
// //                 </p>
// //               </CardContent>
// //             </Card>
// //           ))}
// //         </div>

// //         {/* Detailed Info Section */}
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //           {/* About Section */}
// //           <Card className="lg:col-span-2 border-slate-200">
// //             <CardHeader>
// //               <CardTitle className="text-lg">About Me</CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <p className="text-slate-600 leading-relaxed italic">
// //                 &quot;{agent.aboutAgent}&quot;
// //               </p>
// //               <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="text-xs font-bold text-slate-400 uppercase">
// //                     Languages
// //                   </label>
// //                   <p className="text-slate-900 font-medium">
// //                     {agent.languages.join(", ") || "English"}
// //                   </p>
// //                 </div>
// //                 <div>
// //                   <label className="text-xs font-bold text-slate-400 uppercase">
// //                     Nationality
// //                   </label>
// //                   <p className="text-slate-900 font-medium">
// //                     {agent.nationality}
// //                   </p>
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>

// //           {/* Verification & License */}
// //           <Card className="border-slate-200 bg-slate-900 text-white">
// //             <CardHeader>
// //               <CardTitle className="text-lg text-white flex items-center gap-2">
// //                 <Briefcase size={18} className="text-blue-400" /> Professional
// //                 Info
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent className="space-y-4">
// //               <div>
// //                 <label className="text-[10px] font-bold text-slate-400 uppercase">
// //                   BRN Number
// //                 </label>
// //                 <p className="font-mono text-blue-300">
// //                   {agent.brnNumber || "Not Provided"}
// //                 </p>
// //               </div>
// //               <div>
// //                 <label className="text-[10px] font-bold text-slate-400 uppercase">
// //                   Experience Since
// //                 </label>
// //                 <p className="flex items-center gap-2">
// //                   <Calendar size={14} />{" "}
// //                   {new Date(agent.experienceSince).getFullYear()}
// //                 </p>
// //               </div>
// //               <div>
// //                 <label className="text-[10px] font-bold text-slate-400 uppercase">
// //                   Account Status
// //                 </label>
// //                 <div className="flex items-center gap-2 mt-1">
// //                   <div
// //                     className={`w-2 h-2 rounded-full ${agent.isActive ? "bg-green-500" : "bg-red-500"}`}
// //                   />
// //                   <span className="text-sm font-bold uppercase">
// //                     {agent.isActive ? "Active" : "Disabled"}
// //                   </span>
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }










// // "use client";

// // import { useEffect, useState } from "react";
// // import { signOut } from "next-auth/react"; // Added for Logout functionality
// // import {
// //   Briefcase,
// //   MapPin,
// //   Phone,
// //   MessageSquare,
// //   Eye,
// //   Home,
// //   Star,
// //   Verified,
// //   ShieldCheck,
// //   Calendar,
// //   LogOut, // Added for the button icon
// // } from "lucide-react";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button"; // Added to use the UI button component
// // import Image from "next/image";

// // export default function AgentDashboard() {
// //   const [agent, setAgent] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     fetch("/api/agent/profile")
// //       .then((res) => res.json())
// //       .then((data) => {
// //         if (data.success) setAgent(data.agent);
// //         setLoading(false);
// //       });
// //   }, []);

// //   if (loading)
// //     return (
// //       <div className="p-10 text-center font-bold">
// //         Loading Agent Dashboard...
// //       </div>
// //     );
// //   if (!agent)
// //     return <div className="p-10 text-center">No agent data found.</div>;

// //   const stats = [
// //     {
// //       label: "Active Listings",
// //       value: agent.activeListings,
// //       icon: <Home className="text-blue-600" />,
// //     },
// //     {
// //       label: "Total Views",
// //       value: agent.totalViews,
// //       icon: <Eye className="text-purple-600" />,
// //     },
// //     {
// //       label: "Leads Received",
// //       value: agent.totalLeads,
// //       icon: <MessageSquare className="text-green-600" />,
// //     },
// //     {
// //       label: "Closed Deals",
// //       value: agent.closedDealsCount,
// //       icon: <ShieldCheck className="text-amber-600" />,
// //     },
// //   ];

// //   return (
// //     <div className="min-h-screen bg-slate-50 p-4 md:p-8">
// //       <div className="max-w-6xl mx-auto space-y-6">
// //         {/* Header Section */}
// //         <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
// //           <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-50 shadow-md">
// //             <Image
// //               src={agent.profilePicture || "/default-avatar.png"}
// //               alt={agent.fullName}
// //               fill
// //               className="object-cover"
// //             />
// //           </div>
// //           <div className="flex-1 text-center md:text-left">
// //             <div className="flex items-center justify-center md:justify-start gap-2">
// //               <h1 className="text-2xl font-bold text-slate-900">
// //                 {agent.fullName}
// //               </h1>
// //               {agent.isVerified && (
// //                 <Verified className="text-blue-500" size={20} />
// //               )}
// //               <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
// //                 {agent.agentRank}
// //               </span>
// //             </div>
// //             <p className="text-slate-500 font-medium mb-2">
// //               {agent.specialization} Property Specialist
// //             </p>
// //             <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-600">
// //               <span className="flex items-center gap-1">
// //                 <MapPin size={14} /> {agent.serviceCity}
// //               </span>
// //               <span className="flex items-center gap-1">
// //                 <Phone size={14} /> {agent.whatsappNumber}
// //               </span>
// //               <span className="flex items-center gap-1">
// //                 <Star size={14} className="text-amber-400 fill-amber-400" />{" "}
// //                 {agent.rating} ({agent.reviewCount} Reviews)
// //               </span>
// //             </div>
// //           </div>
// //           <div className="flex flex-col items-center md:items-end gap-3">
// //             <Button 
// //               variant="outline" 
// //               onClick={() => signOut({ callbackUrl: "/" })}
// //               className="rounded-xl border-slate-200 text-slate-300 font-bold flex items-center gap-2"
// //             >
// //               <LogOut size={16} /> Logout
// //             </Button>
// //             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hidden lg:block">
// //               <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">
// //                 Response Rate
// //               </p>
// //               <p className="text-xl font-bold text-slate-900">
// //                 {agent.responseRate}%
// //               </p>
// //               <p className="text-[10px] text-green-600">
// //                 {agent.avgResponseTime}
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Stats Grid */}
// //         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
// //           {stats.map((stat, i) => (
// //             <Card key={i} className="border-none shadow-sm shadow-blue-100">
// //               <CardContent className="p-6 flex flex-col items-center justify-center space-y-2">
// //                 <div className="p-3 bg-slate-50 rounded-full">{stat.icon}</div>
// //                 <p className="text-2xl font-black text-slate-900">
// //                   {stat.value}
// //                 </p>
// //                 <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">
// //                   {stat.label}
// //                 </p>
// //               </CardContent>
// //             </Card>
// //           ))}
// //         </div>

// //         {/* Detailed Info Section */}
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //           {/* About Section */}
// //           <Card className="lg:col-span-2 border-slate-200">
// //             <CardHeader>
// //               <CardTitle className="text-lg">About Me</CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <p className="text-slate-600 leading-relaxed italic">
// //                 &quot;{agent.aboutAgent}&quot;
// //               </p>
// //               <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="text-xs font-bold text-slate-400 uppercase">
// //                     Languages
// //                   </label>
// //                   <p className="text-slate-900 font-medium">
// //                     {agent.languages.join(", ") || "English"}
// //                   </p>
// //                 </div>
// //                 <div>
// //                   <label className="text-xs font-bold text-slate-400 uppercase">
// //                     Nationality
// //                   </label>
// //                   <p className="text-slate-900 font-medium">
// //                     {agent.nationality}
// //                   </p>
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>

// //           {/* Verification & License */}
// //           <Card className="border-slate-200 bg-slate-900 text-white">
// //             <CardHeader>
// //               <CardTitle className="text-lg text-white flex items-center gap-2">
// //                 <Briefcase size={18} className="text-blue-400" /> Professional
// //                 Info
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent className="space-y-4">
// //               <div>
// //                 <label className="text-[10px] font-bold text-slate-400 uppercase">
// //                   BRN Number
// //                 </label>
// //                 <p className="font-mono text-blue-300">
// //                   {agent.brnNumber || "Not Provided"}
// //                 </p>
// //               </div>
// //               <div>
// //                 <label className="text-[10px] font-bold text-slate-400 uppercase">
// //                   Experience Since
// //                 </label>
// //                 <p className="flex items-center gap-2">
// //                   <Calendar size={14} />{" "}
// //                   {new Date(agent.experienceSince).getFullYear()}
// //                 </p>
// //               </div>
// //               <div>
// //                 <label className="text-[10px] font-bold text-slate-400 uppercase">
// //                   Account Status
// //                 </label>
// //                 <div className="flex items-center gap-2 mt-1">
// //                   <div
// //                     className={`w-2 h-2 rounded-full ${agent.isActive ? "bg-green-500" : "bg-red-500"}`}
// //                   />
// //                   <span className="text-sm font-bold uppercase">
// //                     {agent.isActive ? "Active" : "Disabled"}
// //                   </span>
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }








// // "use client";

// // import { useEffect, useState } from "react";
// // import { signOut } from "next-auth/react";
// // import {
// //   Briefcase,
// //   MapPin,
// //   Phone,
// //   MessageSquare,
// //   Eye,
// //   Home,
// //   Star,
// //   Verified,
// //   ShieldCheck,
// //   Calendar,
// //   LogOut,
// //   Building2,
// //   Clock,
// //   CheckCircle2,
// // } from "lucide-react";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import Image from "next/image";

// // export default function AgentDashboard() {
// //   const [data, setData] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     // Note: Updated endpoint to match our new rich API
// //     fetch("/api/agent/dashboard") 
// //       .then((res) => res.json())
// //       .then((json) => {
// //         if (json.success) setData(json.data);
// //         setLoading(false);
// //       });
// //   }, []);

// //   if (loading)
// //     return (
// //       <div className="flex items-center justify-center min-h-screen font-bold text-indigo-600 animate-pulse">
// //         Loading Agent Workspace...
// //       </div>
// //     );
    
// //   if (!data) return <div className="p-10 text-center">No agent data found.</div>;

// //   const { profile, stats, agency } = data;

// //   const statCards = [
// //     {
// //       label: "Active Listings",
// //       value: stats.activeProperties,
// //       icon: <Home className="text-blue-600" />,
// //       sub: `${stats.pendingProperties} Pending`,
// //     },
// //     {
// //       label: "Total Views",
// //       value: stats.views.toLocaleString(),
// //       icon: <Eye className="text-purple-600" />,
// //       sub: "Across all listings",
// //     },
// //     {
// //       label: "Inquiries",
// //       value: stats.leads,
// //       icon: <MessageSquare className="text-green-600" />,
// //       sub: "New Leads",
// //     },
// //     {
// //       label: "Success Rate",
// //       value: `${profile.responseRate}%`,
// //       icon: <CheckCircle2 className="text-amber-600" />,
// //       sub: profile.avgResponseTime,
// //     },
// //   ];

// //   return (
// //     <div className="min-h-screen bg-slate-50 p-4 md:p-8">
// //       <div className="max-w-6xl mx-auto space-y-6">
        
// //         {/* Header Section */}
// //         <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
// //           <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-50 shadow-md">
// //             <Image
// //               src={profile.profilePicture || "/default-avatar.png"}
// //               alt={profile.fullName}
// //               fill
// //               className="object-cover"
// //             />
// //           </div>
// //           <div className="flex-1 text-center md:text-left">
// //             <div className="flex items-center justify-center md:justify-start gap-2">
// //               <h1 className="text-2xl font-bold text-slate-900">{profile.fullName}</h1>
// //               {profile.isVerified && <Verified className="text-blue-500" size={20} />}
// //               <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
// //                 {profile.agentRank}
// //               </span>
// //             </div>
// //             <p className="text-slate-500 font-medium mb-2">{profile.specialization} Specialist</p>
// //             <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-600">
// //               <span className="flex items-center gap-1"><MapPin size={14} /> {profile.serviceCity}</span>
// //               <span className="flex items-center gap-1"><Phone size={14} /> {profile.whatsappNumber}</span>
// //               <span className="flex items-center gap-1"><Star size={14} className="text-amber-400 fill-amber-400" /> {profile.rating} Rating</span>
// //             </div>
// //           </div>
// //           <div className="flex flex-col gap-2">
// //             <Button 
// //               variant="destructive" 
// //               onClick={() => signOut({ callbackUrl: "/" })}
// //               className="rounded-xl font-bold flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none"
// //             >
// //               <LogOut size={16} /> Logout
// //             </Button>
// //           </div>
// //         </div>

// //         {/* Stats Grid */}
// //         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
// //           {statCards.map((stat, i) => (
// //             <Card key={i} className="border-none shadow-sm transition-transform hover:scale-[1.02]">
// //               <CardContent className="p-6 flex flex-col items-center text-center space-y-1">
// //                 <div className="p-3 bg-slate-50 rounded-2xl mb-2">{stat.icon}</div>
// //                 <p className="text-2xl font-black text-slate-900">{stat.value}</p>
// //                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
// //                 <p className="text-[10px] text-slate-400 font-medium">{stat.sub}</p>
// //               </CardContent>
// //             </Card>
// //           ))}
// //         </div>

// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //           {/* About Section */}
// //           <Card className="lg:col-span-2 border-slate-200 shadow-sm">
// //             <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
// //               <CardTitle className="text-lg font-bold flex items-center gap-2">
// //                 <Clock className="text-indigo-500" size={18} /> Professional Bio
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent className="pt-6">
// //               <p className="text-slate-600 leading-relaxed italic text-sm">
// //                 &quot;{profile.aboutAgent || "No bio provided yet. Update your profile to attract more leads!"}&quot;
// //               </p>
// //               <div className="mt-8 grid grid-cols-2 gap-6">
// //                 <div>
// //                   <h4 className="text-[10px] font-black text-slate-400 uppercase mb-1">Languages</h4>
// //                   <div className="flex gap-2">
// //                     {profile.languages.map((lang) => (
// //                       <span key={lang} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-semibold">{lang}</span>
// //                     ))}
// //                   </div>
// //                 </div>
// //                 <div>
// //                   <h4 className="text-[10px] font-black text-slate-400 uppercase mb-1">Experience</h4>
// //                   <p className="text-slate-900 font-bold">{new Date().getFullYear() - new Date(profile.experienceSince).getFullYear()} Years</p>
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>

// //           {/* Agency Card */}
// //           <Card className="border-indigo-100 bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg">
// //             <CardHeader>
// //               <CardTitle className="text-lg text-white flex items-center gap-2">
// //                 <Building2 size={18} /> My Agency
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent className="space-y-6">
// //               {agency ? (
// //                 <>
// //                   <div className="flex items-center gap-4">
// //                     <div className="relative w-12 h-12 bg-white rounded-lg p-1">
// //                        <Image src={agency.logo || "/agency-placeholder.png"} alt="Agency" fill className="object-contain" />
// //                     </div>
// //                     <div>
// //                       <p className="font-bold text-sm leading-tight">{agency.companyName}</p>
// //                       <p className="text-[10px] text-indigo-200">{agency.serviceCity}</p>
// //                     </div>
// //                   </div>
// //                   <div className="space-y-3 pt-2 border-t border-white/10">
// //                     <div className="flex items-center justify-between text-xs">
// //                       <span className="text-indigo-200">Contact</span>
// //                       <span className="font-medium">{agency.phoneNumber}</span>
// //                     </div>
// //                     <div className="flex items-center justify-between text-xs">
// //                       <span className="text-indigo-200">License (BRN)</span>
// //                       <span className="font-mono text-indigo-100">{profile.brnNumber}</span>
// //                     </div>
// //                   </div>
// //                 </>
// //               ) : (
// //                 <p className="text-xs text-indigo-100 italic">Independent Agent</p>
// //               )}
              
// //               <div className="pt-4">
// //                 <div className={`p-3 rounded-xl flex items-center gap-3 ${profile.isActive ? "bg-white/10" : "bg-red-500/20"}`}>
// //                   <div className={`w-2 h-2 rounded-full ${profile.isActive ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
// //                   <span className="text-[10px] font-black uppercase tracking-widest">
// //                     {profile.isActive ? "System Online" : "Account Suspended"}
// //                   </span>
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }







// "use client";

// import { useEffect, useState } from "react";
// import { signOut } from "next-auth/react";
// import {
//   Briefcase, MapPin, Phone, MessageSquare, Eye, Home, Star, Verified,
//   ShieldCheck, Calendar, LogOut, Building2, Clock, CheckCircle2, TrendingUp
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";

// export default function AgentDashboard() {
//   const [dashboard, setDashboard] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("/api/agent/dashboard")
//       .then((res) => res.json())
//       .then((json) => {
//         if (json.success) setDashboard(json.data);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   if (loading) return <div className="p-10 text-center animate-pulse font-bold text-slate-400">Loading Dashboard...</div>;
//   if (!dashboard) return <div className="p-10 text-center">Failed to load agent profile.</div>;

//   const { profile, stats, agency } = dashboard;

//   const statCards = [
//     { label: "Active Listings", value: stats.listings.active, icon: <Home className="text-blue-600" />, sub: `${stats.listings.pending} Pending Approval` },
//     { label: "Total Views", value: stats.engagement.views, icon: <Eye className="text-purple-600" />, sub: "Across all properties" },
//     { label: "Total Leads", value: stats.engagement.leads, icon: <MessageSquare className="text-green-600" />, sub: "Customer Inquiries" },
//     { label: "Closed Deals", value: stats.performance.closedDeals, icon: <ShieldCheck className="text-amber-600" />, sub: "Successful transactions" },
//   ];

//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
//       <div className="max-w-6xl mx-auto space-y-6">
        
//         {/* TOP PROFILE HEADER */}
//         <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
//           <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-slate-50">
//             <Image src={profile.profilePicture || "/default-avatar.png"} alt={profile.fullName} fill className="object-cover" />
//           </div>
//           <div className="flex-1 text-center md:text-left">
//             <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
//               <h1 className="text-2xl font-bold text-slate-900">{profile.fullName}</h1>
//               {profile.isVerified && <Verified className="text-blue-500" size={18} />}
//               <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{profile.rank}</span>
//             </div>
//             <p className="text-slate-500 text-sm mb-3">{profile.specialization} Specialist • {profile.serviceCity}</p>
//             <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-medium text-slate-600">
//               <span className="flex items-center gap-1"><Phone size={14} className="text-slate-400" /> {profile.whatsapp}</span>
//               <span className="flex items-center gap-1"><Star size={14} className="text-amber-400 fill-amber-400" /> {stats.performance.rating} ({stats.performance.reviews} Reviews)</span>
//             </div>
//           </div>
//           <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })} className="text-red-500 border-red-100 hover:bg-red-50">
//             <LogOut size={16} className="mr-2" /> Logout
//           </Button>
//         </div>

//         {/* MAIN STATS GRID */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {statCards.map((stat, i) => (
//             <Card key={i} className="border-none shadow-sm">
//               <CardContent className="p-6 flex flex-col items-center text-center space-y-1">
//                 <div className="p-2 bg-slate-50 rounded-xl mb-1">{stat.icon}</div>
//                 <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.label}</p>
//                 <p className="text-[10px] text-slate-400 italic">{stat.sub}</p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* ABOUT SECTION */}
//           <Card className="lg:col-span-2 border-slate-200">
//             <CardHeader className="border-b border-slate-50">
//               <CardTitle className="text-md font-bold flex items-center gap-2">
//                 <TrendingUp size={18} className="text-blue-500" /> Performance Overview
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="pt-6">
//               <p className="text-slate-600 text-sm italic leading-relaxed">
//                 &quot;{profile.about || "This agent hasn't added a bio yet."}&quot;
//               </p>
//               <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-50 pt-6">
//                 <div>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase">Response Rate</p>
//                   <p className="text-lg font-bold text-slate-900">{stats.engagement.responseRate}%</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase">Avg. Time</p>
//                   <p className="text-lg font-bold text-slate-900 text-green-600">{stats.engagement.avgResponseTime}</p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase">Featured</p>
//                   <p className="text-lg font-bold text-slate-900">{stats.listings.featured}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* AGENCY INFO CARD */}
//           <Card className="border-none bg-slate-900 text-white overflow-hidden relative">
//             <div className="absolute top-0 right-0 p-4 opacity-10">
//               <Building2 size={80} />
//             </div>
//             <CardHeader>
//               <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Affiliated Agency</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {agency ? (
//                 <>
//                   <div className="flex items-center gap-4">
//                     <div className="relative w-12 h-12 rounded-lg bg-white p-1">
//                       <Image src={agency.logo || "/agency-placeholder.png"} alt="Agency" fill className="object-contain" />
//                     </div>
//                     <div>
//                       <p className="font-bold text-md text-white leading-tight">{agency.name}</p>
//                       <p className="text-[10px] text-slate-400">{agency.city}, Pakistan</p>
//                     </div>
//                   </div>
//                   <div className="space-y-3 pt-4 border-t border-slate-800">
//                     <div className="flex justify-between text-xs">
//                       <span className="text-slate-500">Official Email</span>
//                       <span className="text-slate-200">{agency.email}</span>
//                     </div>
//                     <div className="flex justify-between text-xs">
//                       <span className="text-slate-500">Verification</span>
//                       <span className="text-blue-400 font-bold">{agency.status}</span>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <div className="text-center py-4">
//                   <p className="text-xs text-slate-500">No agency information linked.</p>
//                 </div>
//               )}
//               <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2">
//                 <div className={`w-2 h-2 rounded-full ${profile.isActive ? "bg-green-500" : "bg-red-500"}`} />
//                 <span className="text-[10px] font-bold uppercase">{profile.isActive ? "Online & Accepting Leads" : "Account Offline"}</span>
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
import { signOut } from "next-auth/react";
import {
  Briefcase,
  MapPin,
  Phone,
  MessageSquare,
  Eye,
  Home,
  Star,
  Verified,
  ShieldCheck,
  Calendar,
  LogOut,
  Building2,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AgentDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agent/dashboard")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setDashboard(json.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard Load Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen font-bold text-indigo-600 animate-pulse">
        Initializing Agent Workspace...
      </div>
    );

  if (!dashboard) 
    return <div className="p-10 text-center font-bold text-red-500">Error: Could not retrieve agent data.</div>;

  const { profile, stats, agency } = dashboard;

  const statCards = [
    {
      label: "Active Listings",
      value: stats.listings.active,
      icon: <Home className="text-blue-600" />,
      sub: `${stats.listings.pending} Pending Review`,
    },
    {
      label: "Total Views",
      value: stats.engagement.views.toLocaleString(),
      icon: <Eye className="text-purple-600" />,
      sub: "Property Traffic",
    },
    {
      label: "Customer Leads",
      value: stats.engagement.leads,
      icon: <MessageSquare className="text-green-600" />,
      sub: "New Inquiries",
    },
    {
      label: "Closed Deals",
      value: stats.performance.closedDeals,
      icon: <ShieldCheck className="text-amber-600" />,
      sub: "Total Success",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-50 shadow-md bg-slate-100">
            <Image
              src={profile.profilePicture || "/default-avatar.png"}
              alt={profile.fullName}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{profile.fullName}</h1>
              {profile.isVerified && <Verified className="text-blue-500" size={20} />}
              <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {profile.rank}
              </span>
            </div>
            <p className="text-slate-500 font-medium mb-2">{profile.specialization} Specialist</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-600 font-medium">
              <span className="flex items-center gap-1"><MapPin size={14} className="text-indigo-400" /> {profile.serviceCity}</span>
              <span className="flex items-center gap-1"><Phone size={14} className="text-indigo-400" /> {profile.whatsapp}</span>
              <span className="flex items-center gap-1"><Star size={14} className="text-amber-400 fill-amber-400" /> {stats.performance.rating} Rating</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-1">
                <div className="p-3 bg-slate-50 rounded-2xl mb-2">{stat.icon}</div>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-[10px] text-indigo-500 font-semibold">{stat.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance & About Section */}
          <Card className="lg:col-span-2 border-slate-200 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="text-indigo-500" size={18} /> Professional Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-slate-50 p-4 rounded-xl mb-6">
                <p className="text-slate-600 leading-relaxed italic text-sm">
                  &quot;{profile.about || "Your professional bio will appear here to potential clients."}&quot;
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase">Languages</h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.languages?.map((lang) => (
                      <span key={lang} className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-bold">{lang}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase">Experience</h4>
                  <p className="text-slate-900 font-bold text-sm">
                    {new Date().getFullYear() - new Date(profile.experienceSince).getFullYear()} Years
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase">Response Rate</h4>
                  <p className="text-slate-900 font-bold text-sm text-green-600">{stats.engagement.responseRate}%</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase">Response Time</h4>
                  <p className="text-slate-900 font-bold text-sm">{stats.engagement.avgResponseTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agency Card */}
          <Card className="border-none bg-slate-900 text-white shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Building2 size={80} />
            </div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} className="text-indigo-400" /> Verified Agency
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              {agency ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 bg-white rounded-xl p-2 shadow-inner">
                       <Image 
                         src={agency.logo || "/agency-placeholder.png"} 
                         alt="Agency Logo" 
                         fill 
                         className="object-contain" 
                       />
                    </div>
                    <div>
                      <p className="font-bold text-base leading-tight text-white">{agency.name}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 uppercase tracking-tighter font-bold">
                        <MapPin size={10} /> {agency.city}, Pakistan
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-bold uppercase">Official Phone</span>
                      <span className="font-medium text-slate-200">{agency.phone}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-bold uppercase">Verification Status</span>
                      <span className="text-indigo-400 font-black uppercase tracking-tighter">{agency.status}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-xs text-slate-500 italic">Independent Professional</p>
                </div>
              )}
              
              <div className="pt-2">
                <div className={`p-3 rounded-xl flex items-center justify-between ${profile.isActive ? "bg-white/5 border border-white/10" : "bg-red-500/20 border border-red-500/30"}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${profile.isActive ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {profile.isActive ? "System Online" : "Account Suspended"}
                    </span>
                  </div>
                  {profile.isActive && <CheckCircle2 size={14} className="text-green-400" />}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}