// "use client";

// import { useEffect, useState } from "react";
// import {
//   Briefcase,
//   MapPin,
//   Phone,
//   MessageSquare,
//   Eye,
//   Home,
//   Star,
//   Verified,
//   ShieldCheck,
//   Calendar,
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Image from "next/image";

// export default function AgentDashboard() {
//   const [agent, setAgent] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("/api/agent/profile")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) setAgent(data.agent);
//         setLoading(false);
//       });
//   }, []);

//   if (loading)
//     return (
//       <div className="p-10 text-center font-bold">
//         Loading Agent Dashboard...
//       </div>
//     );
//   if (!agent)
//     return <div className="p-10 text-center">No agent data found.</div>;

//   const stats = [
//     {
//       label: "Active Listings",
//       value: agent.activeListings,
//       icon: <Home className="text-blue-600" />,
//     },
//     {
//       label: "Total Views",
//       value: agent.totalViews,
//       icon: <Eye className="text-purple-600" />,
//     },
//     {
//       label: "Leads Received",
//       value: agent.totalLeads,
//       icon: <MessageSquare className="text-green-600" />,
//     },
//     {
//       label: "Closed Deals",
//       value: agent.closedDealsCount,
//       icon: <ShieldCheck className="text-amber-600" />,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 md:p-8">
//       <div className="max-w-6xl mx-auto space-y-6">
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
//           <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-50 shadow-md">
//             <Image
//               src={agent.profilePicture || "/default-avatar.png"}
//               alt={agent.fullName}
//               fill
//               className="object-cover"
//             />
//           </div>
//           <div className="flex-1 text-center md:text-left">
//             <div className="flex items-center justify-center md:justify-start gap-2">
//               <h1 className="text-2xl font-bold text-slate-900">
//                 {agent.fullName}
//               </h1>
//               {agent.isVerified && (
//                 <Verified className="text-blue-500" size={20} />
//               )}
//               <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
//                 {agent.agentRank}
//               </span>
//             </div>
//             <p className="text-slate-500 font-medium mb-2">
//               {agent.specialization} Property Specialist
//             </p>
//             <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-600">
//               <span className="flex items-center gap-1">
//                 <MapPin size={14} /> {agent.serviceCity}
//               </span>
//               <span className="flex items-center gap-1">
//                 <Phone size={14} /> {agent.whatsappNumber}
//               </span>
//               <span className="flex items-center gap-1">
//                 <Star size={14} className="text-amber-400 fill-amber-400" />{" "}
//                 {agent.rating} ({agent.reviewCount} Reviews)
//               </span>
//             </div>
//           </div>
//           <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hidden lg:block">
//             <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">
//               Response Rate
//             </p>
//             <p className="text-xl font-bold text-slate-900">
//               {agent.responseRate}%
//             </p>
//             <p className="text-[10px] text-green-600">
//               {agent.avgResponseTime}
//             </p>
//           </div>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {stats.map((stat, i) => (
//             <Card key={i} className="border-none shadow-sm shadow-blue-100">
//               <CardContent className="p-6 flex flex-col items-center justify-center space-y-2">
//                 <div className="p-3 bg-slate-50 rounded-full">{stat.icon}</div>
//                 <p className="text-2xl font-black text-slate-900">
//                   {stat.value}
//                 </p>
//                 <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">
//                   {stat.label}
//                 </p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Detailed Info Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* About Section */}
//           <Card className="lg:col-span-2 border-slate-200">
//             <CardHeader>
//               <CardTitle className="text-lg">About Me</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-slate-600 leading-relaxed italic">
//                 &quot;{agent.aboutAgent}&quot;
//               </p>
//               <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-xs font-bold text-slate-400 uppercase">
//                     Languages
//                   </label>
//                   <p className="text-slate-900 font-medium">
//                     {agent.languages.join(", ") || "English"}
//                   </p>
//                 </div>
//                 <div>
//                   <label className="text-xs font-bold text-slate-400 uppercase">
//                     Nationality
//                   </label>
//                   <p className="text-slate-900 font-medium">
//                     {agent.nationality}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Verification & License */}
//           <Card className="border-slate-200 bg-slate-900 text-white">
//             <CardHeader>
//               <CardTitle className="text-lg text-white flex items-center gap-2">
//                 <Briefcase size={18} className="text-blue-400" /> Professional
//                 Info
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <label className="text-[10px] font-bold text-slate-400 uppercase">
//                   BRN Number
//                 </label>
//                 <p className="font-mono text-blue-300">
//                   {agent.brnNumber || "Not Provided"}
//                 </p>
//               </div>
//               <div>
//                 <label className="text-[10px] font-bold text-slate-400 uppercase">
//                   Experience Since
//                 </label>
//                 <p className="flex items-center gap-2">
//                   <Calendar size={14} />{" "}
//                   {new Date(agent.experienceSince).getFullYear()}
//                 </p>
//               </div>
//               <div>
//                 <label className="text-[10px] font-bold text-slate-400 uppercase">
//                   Account Status
//                 </label>
//                 <div className="flex items-center gap-2 mt-1">
//                   <div
//                     className={`w-2 h-2 rounded-full ${agent.isActive ? "bg-green-500" : "bg-red-500"}`}
//                   />
//                   <span className="text-sm font-bold uppercase">
//                     {agent.isActive ? "Active" : "Disabled"}
//                   </span>
//                 </div>
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
import { signOut } from "next-auth/react"; // Added for Logout functionality
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
  LogOut, // Added for the button icon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Added to use the UI button component
import Image from "next/image";

export default function AgentDashboard() {
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agent/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAgent(data.agent);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center font-bold">
        Loading Agent Dashboard...
      </div>
    );
  if (!agent)
    return <div className="p-10 text-center">No agent data found.</div>;

  const stats = [
    {
      label: "Active Listings",
      value: agent.activeListings,
      icon: <Home className="text-blue-600" />,
    },
    {
      label: "Total Views",
      value: agent.totalViews,
      icon: <Eye className="text-purple-600" />,
    },
    {
      label: "Leads Received",
      value: agent.totalLeads,
      icon: <MessageSquare className="text-green-600" />,
    },
    {
      label: "Closed Deals",
      value: agent.closedDealsCount,
      icon: <ShieldCheck className="text-amber-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-50 shadow-md">
            <Image
              src={agent.profilePicture || "/default-avatar.png"}
              alt={agent.fullName}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl font-bold text-slate-900">
                {agent.fullName}
              </h1>
              {agent.isVerified && (
                <Verified className="text-blue-500" size={20} />
              )}
              <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                {agent.agentRank}
              </span>
            </div>
            <p className="text-slate-500 font-medium mb-2">
              {agent.specialization} Property Specialist
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {agent.serviceCity}
              </span>
              <span className="flex items-center gap-1">
                <Phone size={14} /> {agent.whatsappNumber}
              </span>
              <span className="flex items-center gap-1">
                <Star size={14} className="text-amber-400 fill-amber-400" />{" "}
                {agent.rating} ({agent.reviewCount} Reviews)
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-xl border-slate-200 text-slate-300 font-bold flex items-center gap-2"
            >
              <LogOut size={16} /> Logout
            </Button>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hidden lg:block">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">
                Response Rate
              </p>
              <p className="text-xl font-bold text-slate-900">
                {agent.responseRate}%
              </p>
              <p className="text-[10px] text-green-600">
                {agent.avgResponseTime}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm shadow-blue-100">
              <CardContent className="p-6 flex flex-col items-center justify-center space-y-2">
                <div className="p-3 bg-slate-50 rounded-full">{stat.icon}</div>
                <p className="text-2xl font-black text-slate-900">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* About Section */}
          <Card className="lg:col-span-2 border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 leading-relaxed italic">
                &quot;{agent.aboutAgent}&quot;
              </p>
              <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">
                    Languages
                  </label>
                  <p className="text-slate-900 font-medium">
                    {agent.languages.join(", ") || "English"}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">
                    Nationality
                  </label>
                  <p className="text-slate-900 font-medium">
                    {agent.nationality}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification & License */}
          <Card className="border-slate-200 bg-slate-900 text-white">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Briefcase size={18} className="text-blue-400" /> Professional
                Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  BRN Number
                </label>
                <p className="font-mono text-blue-300">
                  {agent.brnNumber || "Not Provided"}
                </p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Experience Since
                </label>
                <p className="flex items-center gap-2">
                  <Calendar size={14} />{" "}
                  {new Date(agent.experienceSince).getFullYear()}
                </p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Account Status
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className={`w-2 h-2 rounded-full ${agent.isActive ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span className="text-sm font-bold uppercase">
                    {agent.isActive ? "Active" : "Disabled"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}