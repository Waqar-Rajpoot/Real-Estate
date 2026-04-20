// "use client";
// import React, { useState, useEffect } from "react";
// import { 
//   Users, 
//   ShieldCheck, 
//   Trophy, 
//   Search, 
//   Filter, 
//   MoreVertical, 
//   ExternalLink,
//   Star
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
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import AgentDetailDrawer from "@/components/admin/AgentDetailDrawer";

// export default function AgentsPage() {
//   const [agents, setAgents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedAgentId, setSelectedAgentId] = useState(null);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   useEffect(() => {
//     fetchAgents();
//   }, []);

//   const fetchAgents = async () => {
//     try {
//       const res = await fetch("/api/admin/agents");
//       const data = await res.json();
//       // Ensure your GET route returns an array or object with agents key
//       setAgents(Array.isArray(data) ? data : data.agents || []);
//     } catch (error) {
//       console.error("Error loading agents:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openReview = (id) => {
//     setSelectedAgentId(id);
//     setIsDrawerOpen(true);
//   };

//   const stats = [
//     { label: "Active Agents", value: agents.length, icon: Users, color: "text-blue-600" },
//     { label: "Verified Experts", value: agents.filter(a => a.isVerified).length, icon: ShieldCheck, color: "text-indigo-600" },
//     { label: "Top Performers", value: agents.filter(a => a.agentRank === 'Top Performer').length, icon: Trophy, color: "text-amber-500" },
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Agent Directory</h1>
//         <p className="text-slate-500 text-sm">Manage professional rankings, badges, and verification across the platform.</p>
//       </div>

//       {/* Stats Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {stats.map((stat, i) => (
//           <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
//             <div>
//               <p className="text-xs font-semibold text-slate-400 uppercase mb-1">{stat.label}</p>
//               <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
//             </div>
//             <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
//           </div>
//         ))}
//       </div>

//       {/* Table Container */}
//       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//         <div className="p-4 border-b bg-slate-50/50 flex flex-col md:flex-row gap-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//             <Input placeholder="Search by name, email, or BRN..." className="pl-10 bg-white" />
//           </div>
//           <Button variant="outline" className="text-slate-600">
//             <Filter className="h-4 w-4 mr-2" /> Filters
//           </Button>
//         </div>

//         <Table>
//           <TableHeader className="bg-slate-50">
//             <TableRow>
//               <TableHead className="w-[300px]">Agent Profile</TableHead>
//               <TableHead>Affiliated Agency</TableHead>
//               <TableHead>Rank</TableHead>
//               <TableHead>Performance</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead className="text-right">Action</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow><TableCell colSpan={6} className="text-center py-20 text-slate-400">Fetching professional records...</TableCell></TableRow>
//             ) : agents.map((agent) => (
//               <TableRow key={agent._id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => openReview(agent._id)}>
//                 <TableCell>
//                   <div className="flex items-center gap-3">
//                     <img src={agent.profilePicture} className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm" alt="" />
//                     <div>
//                       <p className="font-bold text-slate-900 leading-tight">{agent.fullName}</p>
//                       <p className="text-xs text-slate-500">{agent.email}</p>
//                     </div>
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex flex-col">
//                     <span className="text-sm font-medium text-slate-700">{agent.agency?.companyName || "Independent"}</span>
//                     <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{agent.serviceCity}</span>
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-medium border-none px-2 py-0.5">
//                     {agent.agentRank}
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <div className="space-y-1">
//                     <div className="flex items-center gap-1 text-amber-500">
//                       <Star className="h-3 w-3 fill-current" />
//                       <span className="text-xs font-bold">{agent.rating || 0}</span>
//                     </div>
//                     <p className="text-[10px] text-slate-500 font-medium">{agent.activeListings} Active Listings</p>
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   {agent.isVerified ? (
//                     <Badge className="bg-blue-50 text-blue-600 border-blue-200 shadow-none hover:bg-blue-50">Verified</Badge>
//                   ) : (
//                     <Badge className="bg-slate-50 text-slate-400 border-slate-200 shadow-none hover:bg-slate-50 font-normal">Unverified</Badge>
//                   )}
//                 </TableCell>
//                 <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900">
//                         <MoreVertical className="h-4 w-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end" className="w-48">
//                       <DropdownMenuItem onClick={() => openReview(agent._id)}>
//                         <ExternalLink className="mr-2 h-4 w-4" /> Professional Review
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       <AgentDetailDrawer 
//         isOpen={isDrawerOpen} 
//         onClose={() => setIsDrawerOpen(false)} 
//         agentId={selectedAgentId} 
//         refresh={fetchAgents} 
//       />
//     </div>
//   );
// }







"use client";
import React, { useState, useEffect } from "react";
import { 
  Users, 
  ShieldCheck, 
  Trophy, 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink,
  Star,
  MapPin,
  UserPlus
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AgentDetailDrawer from "@/components/admin/AgentDetailDrawer";

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await fetch("/api/admin/agents");
      const data = await res.json();
      setAgents(Array.isArray(data) ? data : data.agents || []);
    } catch (error) {
      console.error("Error loading agents:", error);
    } finally {
      setLoading(false);
    }
  };

  const openReview = (id) => {
    setSelectedAgentId(id);
    setIsDrawerOpen(true);
  };

  const stats = [
    { label: "Total Talent Pool", value: agents.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50/50", border: "border-t-blue-500" },
    { label: "Verified Experts", value: agents.filter(a => a.isVerified).length, icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50/50", border: "border-t-indigo-500" },
    { label: "Top Performers", value: agents.filter(a => a.agentRank === 'Top Performer').length, icon: Trophy, color: "text-amber-500", bg: "bg-amber-50/50", border: "border-t-amber-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none px-3 mb-2">Talent Management</Badge>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Agent Directory</h1>
          <p className="text-slate-500 font-medium mt-1">Audit professional rankings, verify credentials, and manage affiliations.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`group p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 ${stat.border}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-900 tabular-nums tracking-tight">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
            <Input 
              placeholder="Search by agent name, BRN, or city..." 
              className="pl-11 h-12 bg-slate-50/50 border-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all rounded-2xl font-medium" 
            />
          </div>
          <Button variant="outline" className="h-12 rounded-2xl border-slate-200 text-slate-100 font-bold px-6 hover:bg-slate-50 transition-all">
            <Filter className="h-4 w-4 mr-2" /> Advanced Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-[0.2em] py-6 px-8">Professional Identity</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-[0.2em]">Affiliation</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-[0.2em]">Rank</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-[0.2em]">Performance</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-[0.2em]">Compliance</TableHead>
                <TableHead className="text-right font-bold text-slate-400 uppercase text-[10px] tracking-[0.2em] px-8">Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-32">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative h-12 w-12">
                        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Indexing Talent Pool...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : agents.map((agent) => (
                <TableRow 
                  key={agent._id} 
                  className="border-b border-slate-50 hover:bg-slate-50/80 transition-all group cursor-pointer"
                  onClick={() => openReview(agent._id)}
                >
                  <TableCell className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={agent.profilePicture} 
                          className="h-14 w-14 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300" 
                          alt="" 
                        />
                        {agent.isVerified && (
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                            <ShieldCheck className="h-4 w-4 text-blue-600 fill-blue-50" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-base leading-none tracking-tight">{agent.fullName}</p>
                        <p className="text-xs text-slate-400 font-medium mt-1.5">{agent.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-700 leading-tight">
                        {agent.agency?.companyName || "Freelance Agent"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 mt-1">
                        <MapPin className="h-2.5 w-2.5" /> {agent.serviceCity}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-black text-[10px] px-3 py-1 rounded-lg border-none shadow-sm uppercase tracking-tighter">
                      {agent.agentRank}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-2.5 w-2.5 ${i < Math.floor(agent.rating) ? 'fill-current' : 'text-slate-200'}`} 
                          />
                        ))}
                        <span className="text-xs font-black ml-1 text-slate-900">{agent.rating || "0.0"}</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {agent.activeListings} Active Inventories
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {agent.isVerified ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-black text-[9px] px-3 py-1 rounded-xl uppercase tracking-widest shadow-sm">
                        Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-50 text-slate-300 border-slate-100 font-bold text-[9px] px-3 py-1 rounded-xl uppercase tracking-widest shadow-none">
                        Unverified
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right px-8" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-slate-100">
                        <DropdownMenuItem 
                          className="rounded-xl font-bold text-xs uppercase tracking-tight py-3 cursor-pointer"
                          onClick={() => openReview(agent._id)}
                        >
                          <ExternalLink className="mr-2 h-4 w-4 text-indigo-600" /> Professional Review
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl font-bold text-xs uppercase tracking-tight py-3 text-red-600 cursor-pointer">
                          <ShieldCheck className="mr-2 h-4 w-4" /> Revoke Certification
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AgentDetailDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        agentId={selectedAgentId} 
        refresh={fetchAgents} 
      />
    </div>
  );
}