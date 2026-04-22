// "use client";
// import React, { useState, useEffect } from "react";
// import { Building2, Clock, Search, Filter, ArrowUpRight, ShieldCheck, Download } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import AgencyDetailDrawer from "@/components/admin/AgencyDetailDrawer";

// export default function AgenciesPage() {
//   const [agencies, setAgencies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedAgencyId, setSelectedAgencyId] = useState(null);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   useEffect(() => { fetchAgencies(); }, []);

//   const fetchAgencies = async () => {
//     try {
//       const res = await fetch("/api/admin/agencies");
//       const data = await res.json();
//       setAgencies(data.agencies || []);
//     } finally { setLoading(false); }
//   };

//   const handleViewAgency = (id) => {
//     setSelectedAgencyId(id);
//     setIsDrawerOpen(true);
//   };

//   return (
//     <div className="max-w-400 mx-auto space-y-8 animate-in fade-in duration-500">

//       {/* 1. Refined Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-2 mb-2">
//              <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
//              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Partner Management</span>
//           </div>
//           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Agency Directory</h1>
//         </div>
//         <Button className="bg-slate-900 hover:bg-blue-600 text-white rounded-xl px-6 transition-all duration-300 shadow-md shadow-slate-200">
//           <Download className="mr-2 h-4 w-4" /> Export Report
//         </Button>
//       </div>

//       {/* 2. Stats with Border-Top instead of heavy glow */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {[
//           { label: "Total Agencies", value: agencies.length, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
//           { label: "Verified Partners", value: agencies.filter(a => a.verificationStatus === 'Verified').length, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
//           { label: "Pending Review", value: agencies.filter(a => a.verificationStatus === 'Pending').length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
//         ].map((stat, i) => (
//           <div key={i} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all border-t-4 border-t-blue-500">
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
//                 <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
//               </div>
//               <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
//                 <stat.icon className="h-6 w-6" />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* 3. The Table Surface - Removing the heavy white glow */}
//       <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//         <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
//           <div className="relative w-96">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//             <Input
//               placeholder="Filter by name, ID or license..."
//               className="pl-11 h-11 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500/10 transition-all rounded-xl placeholder:text-slate-400"
//             />
//           </div>
//           <Button variant="outline" className="rounded-xl border-slate-200 text-slate-100 font-bold">
//             <Filter className="h-4 w-4 mr-2" /> Advanced Filters
//           </Button>
//         </div>

//         <Table>
//           <TableHeader className="bg-slate-50/50">
//             <TableRow className="hover:bg-transparent border-slate-100">
//               <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider py-5 px-8">Company Entity</TableHead>
//               <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">License</TableHead>
//               <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Plan</TableHead>
//               <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Activity</TableHead>
//               <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider text-center">Status</TableHead>
//               <TableHead className="text-right font-bold text-slate-500 uppercase text-[10px] tracking-wider px-8">Action</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//                <TableRow><TableCell colSpan={6} className="text-center py-20 text-slate-400 font-medium">Syncing database...</TableCell></TableRow>
//             ) : agencies.map((agency) => (
//               <TableRow key={agency._id} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
//                 <TableCell className="px-8 py-4">
//                   <div className="flex items-center gap-4">
//                     <div className="h-12 w-12 rounded-xl border border-slate-100 bg-white p-1.5 shadow-sm group-hover:border-blue-200 transition-colors">
//                       <img src={agency.companyLogo} alt="" className="h-full w-full rounded-lg object-contain" />
//                     </div>
//                     <div>
//                       <p className="font-bold text-slate-900 text-sm">{agency.companyName}</p>
//                       <p className="text-[11px] text-slate-400 font-medium">{agency.officialEmail}</p>
//                     </div>
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
//                     {agency.licenseNumber}
//                   </span>
//                 </TableCell>
//                 <TableCell>
//                   <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 font-bold text-[10px]">
//                     {agency.subscriptionPlan}
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex flex-col gap-1">
//                      <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5"><div className="h-1 w-1 rounded-full bg-blue-500" /> {agency.totalListings} Listings</span>
//                      <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5"><div className="h-1 w-1 rounded-full bg-slate-300" /> {agency.totalAgents} Agents</span>
//                   </div>
//                 </TableCell>
//                 <TableCell className="text-center">
//                   <StatusBadge status={agency.verificationStatus} />
//                 </TableCell>
//                 <TableCell className="text-right px-8">
//                   <Button
//                     variant="ghost"
//                     onClick={() => handleViewAgency(agency._id)}
//                     className="h-9 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all font-bold text-xs"
//                   >
//                     EXPLORE <ArrowUpRight className="ml-1 h-3 w-3" />
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       <AgencyDetailDrawer
//         isOpen={isDrawerOpen}
//         onClose={() => setIsDrawerOpen(false)}
//         agencyId={selectedAgencyId}
//         refresh={fetchAgencies}
//       />
//     </div>
//   );
// }

// function StatusBadge({ status }) {
//   const styles = {
//     Verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
//     Pending: "bg-amber-50 text-amber-700 border-amber-200",
//     Rejected: "bg-red-50 text-red-700 border-red-200",
//     Suspended: "bg-slate-100 text-slate-600 border-slate-300",
//   };
//   return (
//     <Badge className={`${styles[status]} border px-3 py-0.5 font-bold text-[10px] rounded-full shadow-none`}>
//       {status}
//     </Badge>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Added for page navigation
import {
  Building2,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

export default function AgenciesPage() {
  const router = useRouter(); // Initialize router
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      const res = await fetch("/api/admin/agencies");
      const data = await res.json();
      setAgencies(data.agencies || []);
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: Now navigates to a full page instead of opening a drawer
  const handleViewAgency = (id) => {
    router.push(`/admin/agencies/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* 1. Refined Header - Light Theme */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">
              Partner Management
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Agency Directory
          </h1>
        </div>
        <Button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl px-6 transition-all duration-300 shadow-sm font-bold text-xs">
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* 2. Stats - Clean White Look */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Agencies",
            value: agencies.length,
            icon: Building2,
            color: "text-blue-600",
            border: "border-t-blue-500",
          },
          {
            label: "Verified Partners",
            value: agencies.filter((a) => a.verificationStatus === "Verified")
              .length,
            icon: ShieldCheck,
            color: "text-emerald-600",
            border: "border-t-emerald-500",
          },
          {
            label: "Pending Review",
            value: agencies.filter((a) => a.verificationStatus === "Pending")
              .length,
            icon: Clock,
            color: "text-amber-600",
            border: "border-t-amber-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all border-t-4 ${stat.border}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-black text-slate-900">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-2.5 rounded-xl bg-slate-50 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. The Table Surface - Light Mode */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by company name..."
              className="pl-11 h-11 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500/10 transition-all rounded-xl placeholder:text-slate-400 text-sm font-medium"
            />
          </div>
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
          >
            <Filter className="h-4 w-4 mr-2" /> Advanced Filters
          </Button>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-wider py-5 px-8 text-center">
                Entity
              </TableHead>
              <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-wider text-center">
                License
              </TableHead>
              <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-wider text-center">
                Plan
              </TableHead>
              <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-wider text-center">
                Activity
              </TableHead>
              <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-wider text-center">
                Status
              </TableHead>
              <TableHead className="text-right font-bold text-slate-400 uppercase text-[10px] tracking-wider px-8">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-20 text-slate-400 font-medium"
                >
                  Syncing database...
                </TableCell>
              </TableRow>
            ) : (
              agencies.map((agency) => (
                <TableRow
                  key={agency._id}
                  className="group hover:bg-slate-50/30 transition-colors border-slate-50"
                >
                  <TableCell className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      {/* Relative container is required for the 'fill' property */}
                      <div className="relative h-10 w-10 rounded-lg border border-slate-100 bg-white overflow-hidden flex-shrink-0 group-hover:border-blue-200 transition-colors">
                        <Image
                          src={agency.companyLogo || "/placeholder-logo.png"} // Fallback if logo is missing
                          alt={`${agency.companyName} logo`}
                          fill
                          className="object-contain p-1"
                          sizes="40px" // Optimization for the browser
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">
                          {agency.companyName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {agency.officialEmail}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-mono text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      {agency.licenseNumber}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-600 border-blue-100 font-bold text-[9px] hover:bg-blue-50"
                    >
                      {agency.subscriptionPlan}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col gap-1 items-center">
                      <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-blue-500" />{" "}
                        {agency.totalListings} Units
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                        <div className="h-1 w-1 rounded-full bg-slate-300" />{" "}
                        {agency.totalAgents} Agents
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={agency.verificationStatus} />
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <Button
                      variant="ghost"
                      onClick={() => handleViewAgency(agency._id)}
                      className="h-8 rounded-lg text-blue-600 hover:bg-blue-50 transition-all font-bold text-[10px]"
                    >
                      EXPLORE <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Verified: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Pending: "bg-amber-50 text-amber-600 border-amber-100",
    Rejected: "bg-red-50 text-red-600 border-red-100",
    Suspended: "bg-slate-50 text-slate-500 border-slate-200",
  };
  return (
    <Badge
      className={`${styles[status] || styles.Suspended} border px-2.5 py-0.5 font-bold text-[9px] rounded-full shadow-none hover:opacity-100`}
    >
      {status}
    </Badge>
  );
}
