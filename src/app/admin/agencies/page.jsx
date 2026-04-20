// "use client";
// import React, { useState, useEffect } from "react";
// import { 
//   Building2, 
//   CheckCircle2, 
//   Clock, 
//   MoreHorizontal, 
//   Eye, 
//   Filter,
//   Search
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import AgencyDetailDrawer from "@/components/admin/AgencyDetailDrawer";

// export default function AgenciesPage() {
//   const [agencies, setAgencies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedAgencyId, setSelectedAgencyId] = useState(null);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   // Stats Summary
//   const stats = [
//     { label: "Total Agencies", value: agencies.length, icon: Building2, color: "text-blue-600" },
//     { label: "Verified", value: agencies.filter(a => a.verificationStatus === 'Verified').length, icon: CheckCircle2, color: "text-green-600" },
//     { label: "Pending Review", value: agencies.filter(a => a.verificationStatus === 'Pending').length, icon: Clock, color: "text-amber-600" },
//   ];

//   useEffect(() => {
//     fetchAgencies();
//   }, []);

//   const fetchAgencies = async () => {
//     try {
//       const res = await fetch("/api/admin/agencies");
//       const data = await res.json();
//       setAgencies(data.agencies || []);
//     } catch (error) {
//       console.error("Error loading agencies:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewAgency = (id) => {
//     setSelectedAgencyId(id);
//     setIsDrawerOpen(true);
//   };

//   return (
//     <div className="space-y-8">
//       {/* Page Header */}
//       <div>
//         <h1 className="text-2xl font-bold text-slate-900">Agencies Management</h1>
//         <p className="text-slate-500">Review and verify real estate companies on the platform.</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {stats.map((stat, i) => (
//           <div key={i} className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-4">
//             <div className={`p-3 rounded-lg bg-slate-50 ${stat.color}`}>
//               <stat.icon className="h-6 w-6" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-slate-500">{stat.label}</p>
//               <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Table Section */}
//       <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
//         <div className="p-4 border-b flex flex-col md:flex-row justify-between gap-4 bg-slate-50/50">
//           <div className="relative w-full md:w-80">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//             <Input placeholder="Filter by company name..." className="pl-10 bg-white" />
//           </div>
//           <Button variant="outline" className="flex gap-2">
//             <Filter className="h-4 w-4" /> Filter
//           </Button>
//         </div>

//         <Table>
//           <TableHeader className="bg-slate-50">
//             <TableRow>
//               <TableHead>Company</TableHead>
//               <TableHead>License No.</TableHead>
//               <TableHead>Plan</TableHead>
//               <TableHead>Listings/Agents</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//                <TableRow><TableCell colSpan={6} className="text-center py-10 text-slate-400">Loading agencies...</TableCell></TableRow>
//             ) : agencies.map((agency) => (
//               <TableRow key={agency._id} className="hover:bg-slate-50/50 transition-colors">
//                 <TableCell>
//                   <div className="flex items-center gap-3">
//                     <img src={agency.companyLogo} alt="" className="h-10 w-10 rounded-md object-cover border bg-slate-100" />
//                     <div>
//                       <p className="font-bold text-slate-900">{agency.companyName}</p>
//                       <p className="text-xs text-slate-500">{agency.officialEmail}</p>
//                     </div>
//                   </div>
//                 </TableCell>
//                 <TableCell className="font-mono text-xs uppercase">{agency.licenseNumber}</TableCell>
//                 <TableCell>
//                   <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
//                     {agency.subscriptionPlan}
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <div className="text-xs">
//                     <p>🏡 {agency.totalListings} Listings</p>
//                     <p>👥 {agency.totalAgents} Agents</p>
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <StatusBadge status={agency.verificationStatus} />
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end" className="w-40">
//                       <DropdownMenuLabel>Options</DropdownMenuLabel>
//                       <DropdownMenuItem onClick={() => handleViewAgency(agency._id)}>
//                         <Eye className="mr-2 h-4 w-4" /> Review Profile
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Detail Drawer Component */}
//       <AgencyDetailDrawer 
//         isOpen={isDrawerOpen} 
//         onClose={() => setIsDrawerOpen(false)} 
//         agencyId={selectedAgencyId} 
//         refresh={fetchAgencies}
//       />
//     </div>
//   );
// }

// // Helper Status Badge Component
// function StatusBadge({ status }) {
//   const styles = {
//     Verified: "bg-green-100 text-green-700 border-green-200",
//     Pending: "bg-amber-100 text-amber-700 border-amber-200",
//     Rejected: "bg-red-100 text-red-700 border-red-200",
//     Suspended: "bg-slate-100 text-slate-700 border-slate-200",
//   };
//   return <Badge className={`${styles[status]} border shadow-none`}>{status}</Badge>;
// }







// "use client";
// import React, { useState, useEffect } from "react";
// import { 
//   Building2, 
//   CheckCircle2, 
//   Clock, 
//   MoreHorizontal, 
//   Eye, 
//   Filter,
//   Search,
//   ArrowUpRight,
//   ShieldCheck
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import AgencyDetailDrawer from "@/components/admin/AgencyDetailDrawer";

// export default function AgenciesPage() {
//   const [agencies, setAgencies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedAgencyId, setSelectedAgencyId] = useState(null);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   useEffect(() => {
//     fetchAgencies();
//   }, []);

//   const fetchAgencies = async () => {
//     try {
//       const res = await fetch("/api/admin/agencies");
//       const data = await res.json();
//       setAgencies(data.agencies || []);
//     } catch (error) {
//       console.error("Error loading agencies:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewAgency = (id) => {
//     setSelectedAgencyId(id);
//     setIsDrawerOpen(true);
//   };

//   const stats = [
//     { label: "Partner Agencies", value: agencies.length, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
//     { label: "Verified Partners", value: agencies.filter(a => a.verificationStatus === 'Verified').length, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
//     { label: "Pending Review", value: agencies.filter(a => a.verificationStatus === 'Pending').length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
//   ];

//   return (
//     <div className="space-y-8 animate-in fade-in duration-500">
//       {/* Page Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Agency Ecosystem</h1>
//           <p className="text-slate-500 text-sm mt-1 font-medium">Govern company authentications and professional tiering.</p>
//         </div>
//         <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
//           Export Directory
//         </Button>
//       </div>

//       {/* Stats Cards - Premium Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {stats.map((stat, i) => (
//           <div key={i} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
//             <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${stat.bg} opacity-20 group-hover:scale-110 transition-transform`} />
//             <div className="flex items-center gap-5">
//               <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} shadow-inner`}>
//                 <stat.icon className="h-7 w-7" />
//               </div>
//               <div>
//                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
//                 <h3 className="text-3xl font-black text-slate-900 mt-0.5">{stat.value}</h3>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Table Section - Enterprise Layout */}
//       <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//         <div className="p-5 border-b flex flex-col md:flex-row justify-between gap-4 bg-white">
//           <div className="relative w-full md:w-96 group">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
//             <Input 
//               placeholder="Search companies by name or license..." 
//               className="pl-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-lg" 
//             />
//           </div>
//           <div className="flex items-center gap-3">
//             <Button variant="outline" size="sm" className="h-10 text-slate-600 border-slate-200 font-bold px-4">
//               <Filter className="h-4 w-4 mr-2" /> Advanced Filter
//             </Button>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader className="bg-slate-50/80">
//               <TableRow className="border-none">
//                 <TableHead className="font-bold text-slate-500 uppercase text-[11px] tracking-wider py-4">Corporate Profile</TableHead>
//                 <TableHead className="font-bold text-slate-500 uppercase text-[11px] tracking-wider">License ID</TableHead>
//                 <TableHead className="font-bold text-slate-500 uppercase text-[11px] tracking-wider">Tier</TableHead>
//                 <TableHead className="font-bold text-slate-500 uppercase text-[11px] tracking-wider">Capacity</TableHead>
//                 <TableHead className="font-bold text-slate-500 uppercase text-[11px] tracking-wider">Verification</TableHead>
//                 <TableHead className="text-right font-bold text-slate-500 uppercase text-[11px] tracking-wider px-6">Manage</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={6} className="text-center py-24">
//                     <div className="flex flex-col items-center gap-2">
//                       <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//                       <p className="text-slate-400 font-medium text-sm">Syncing agency data...</p>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ) : agencies.map((agency) => (
//                 <TableRow key={agency._id} className="hover:bg-blue-50/30 transition-colors group">
//                   <TableCell className="py-4">
//                     <div className="flex items-center gap-4">
//                       <div className="h-12 w-12 rounded-xl border border-slate-200 bg-white p-1 shadow-sm group-hover:border-blue-200 transition-colors">
//                         <img src={agency.companyLogo} alt="" className="h-full w-full rounded-lg object-contain" />
//                       </div>
//                       <div>
//                         <p className="font-bold text-slate-900 leading-none">{agency.companyName}</p>
//                         <p className="text-xs text-slate-500 mt-1">{agency.officialEmail}</p>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
//                       {agency.licenseNumber}
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 font-bold px-2.5 py-0.5 rounded-md">
//                       {agency.subscriptionPlan}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex flex-col gap-1">
//                        <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs">
//                           <span className="text-blue-600">🏡</span> {agency.totalListings} Listings
//                        </div>
//                        <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs">
//                           <span className="text-blue-600">👥</span> {agency.totalAgents} Agents
//                        </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <StatusBadge status={agency.verificationStatus} />
//                   </TableCell>
//                   <TableCell className="text-right px-6">
//                     <Button 
//                       variant="ghost" 
//                       size="sm" 
//                       onClick={() => handleViewAgency(agency._id)}
//                       className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all font-bold"
//                     >
//                       View Profile <ArrowUpRight className="ml-1 h-3 w-3" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
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
//     Verified: "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100",
//     Pending: "bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100",
//     Rejected: "bg-red-50 text-red-700 border-red-200 shadow-red-100",
//     Suspended: "bg-slate-100 text-slate-600 border-slate-300 shadow-slate-100",
//   };
  
//   return (
//     <Badge className={`${styles[status]} border px-3 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full shadow-sm`}>
//       {status}
//     </Badge>
//   );
// }






"use client";
import React, { useState, useEffect } from "react";
import { Building2, Clock, Search, Filter, ArrowUpRight, ShieldCheck, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AgencyDetailDrawer from "@/components/admin/AgencyDetailDrawer";

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgencyId, setSelectedAgencyId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => { fetchAgencies(); }, []);

  const fetchAgencies = async () => {
    try {
      const res = await fetch("/api/admin/agencies");
      const data = await res.json();
      setAgencies(data.agencies || []);
    } finally { setLoading(false); }
  };

  const handleViewAgency = (id) => {
    setSelectedAgencyId(id);
    setIsDrawerOpen(true);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Refined Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
             <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Partner Management</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Agency Directory</h1>
        </div>
        <Button className="bg-slate-900 hover:bg-blue-600 text-white rounded-xl px-6 transition-all duration-300 shadow-md shadow-slate-200">
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* 2. Stats with Border-Top instead of heavy glow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Agencies", value: agencies.length, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Verified Partners", value: agencies.filter(a => a.verificationStatus === 'Verified').length, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pending Review", value: agencies.filter(a => a.verificationStatus === 'Pending').length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all border-t-4 border-t-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. The Table Surface - Removing the heavy white glow */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Filter by name, ID or license..." 
              className="pl-11 h-11 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500/10 transition-all rounded-xl placeholder:text-slate-400" 
            />
          </div>
          <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 font-bold">
            <Filter className="h-4 w-4 mr-2" /> Advanced Filters
          </Button>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider py-5 px-8">Company Entity</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">License</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Plan</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Activity</TableHead>
              <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-wider text-center">Status</TableHead>
              <TableHead className="text-right font-bold text-slate-500 uppercase text-[10px] tracking-wider px-8">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
               <TableRow><TableCell colSpan={6} className="text-center py-20 text-slate-400 font-medium">Syncing database...</TableCell></TableRow>
            ) : agencies.map((agency) => (
              <TableRow key={agency._id} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                <TableCell className="px-8 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl border border-slate-100 bg-white p-1.5 shadow-sm group-hover:border-blue-200 transition-colors">
                      <img src={agency.companyLogo} alt="" className="h-full w-full rounded-lg object-contain" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{agency.companyName}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{agency.officialEmail}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {agency.licenseNumber}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 font-bold text-[10px]">
                    {agency.subscriptionPlan}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                     <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5"><div className="h-1 w-1 rounded-full bg-blue-500" /> {agency.totalListings} Listings</span>
                     <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5"><div className="h-1 w-1 rounded-full bg-slate-300" /> {agency.totalAgents} Agents</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <StatusBadge status={agency.verificationStatus} />
                </TableCell>
                <TableCell className="text-right px-8">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleViewAgency(agency._id)}
                    className="h-9 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all font-bold text-xs"
                  >
                    EXPLORE <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AgencyDetailDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        agencyId={selectedAgencyId} 
        refresh={fetchAgencies}
      />
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
    Suspended: "bg-slate-100 text-slate-600 border-slate-300",
  };
  return (
    <Badge className={`${styles[status]} border px-3 py-0.5 font-bold text-[10px] rounded-full shadow-none`}>
      {status}
    </Badge>
  );
}