"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, ShieldCheck, Trophy, Search, 
  Star, MapPin, Building2, ChevronRight 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const AgentsPage = () => {
  const router = useRouter();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Grouping Logic by Agency
  const groupedAgents = useMemo(() => {
    const filtered = agents.filter(agent => 
      agent.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.serviceCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.agency?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.reduce((acc, agent) => {
      const agencyName = agent.agency?.companyName || "Independent / Freelance";
      if (!acc[agencyName]) acc[agencyName] = [];
      acc[agencyName].push(agent);
      return acc;
    }, {});
  }, [agents, searchTerm]);

  const stats = [
    { label: "Total Talent Pool", value: agents.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50/50", border: "border-t-blue-500" },
    { label: "Verified Experts", value: agents.filter(a => a.isVerified).length, icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50/50", border: "border-t-indigo-500" },
    { label: "Top Performers", value: agents.filter(a => a.agentRank === 'Top Performer' || a.rating >= 4.5).length, icon: Trophy, color: "text-amber-500", bg: "bg-amber-50/50", border: "border-t-amber-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div>
         <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none px-3 mb-2">Talent Management</Badge>
         <h1 className="text-4xl font-black text-slate-900 tracking-tight">Agent Directory</h1>
         <p className="text-slate-500 font-medium">Categorized view of all registered agents and their affiliations.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`group p-6 bg-white border border-slate-200 rounded-2xl shadow-sm border-t-4 ${stat.border}`}>
            <div className="flex justify-between items-start">
               <div>
                 <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">{stat.label}</p>
                 <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
               </div>
               <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}><stat.icon className="h-6 w-6" /></div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Table */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-white">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
            <Input 
              placeholder="Search by name, city, or agency..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-slate-200 focus:border-indigo-500 ring-offset-0 focus-visible:ring-2 focus-visible:ring-indigo-500/20" 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="font-bold text-[10px] tracking-[0.2em] px-8 py-4">PROFESSIONAL IDENTITY</TableHead>
                <TableHead className="font-bold text-[10px] tracking-[0.2em]">RANK</TableHead>
                <TableHead className="font-bold text-[10px] tracking-[0.2em]">PERFORMANCE</TableHead>
                <TableHead className="font-bold text-[10px] tracking-[0.2em]">COMPLIANCE</TableHead>
                <TableHead className="text-right font-bold text-[10px] tracking-[0.2em] px-8">VIEW</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-32 font-bold text-slate-400 uppercase tracking-widest">Loading Records...</TableCell></TableRow>
              ) : Object.keys(groupedAgents).length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-32 text-slate-400">No agents found matching your search.</TableCell></TableRow>
              ) : Object.keys(groupedAgents).map((agencyName) => (
                <React.Fragment key={agencyName}>
                  {/* Agency Sub-header */}
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-y border-slate-200">
                    <TableCell colSpan={5} className="py-3 px-8">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-indigo-600" />
                        <span className="font-black text-slate-700 uppercase text-xs tracking-widest">
                          {agencyName} 
                          <span className="ml-2 text-slate-400 font-medium lowercase">({groupedAgents[agencyName].length} agents)</span>
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Agent Rows */}
                  {groupedAgents[agencyName].map((agent) => (
                    <TableRow 
                      key={agent._id} 
                      className="border-b border-slate-50 hover:bg-indigo-50/30 transition-all cursor-pointer group"
                      onClick={() => router.push(`/admin/agents/${agent._id}`)}
                    >
                      <TableCell className="py-5 px-8">
                        <div className="flex items-center gap-4">
                          <img 
                            src={agent.profilePicture || "/placeholder-user.png"} 
                            className="h-12 w-12 rounded-xl object-cover shadow-sm border border-slate-100" 
                            alt=""
                          />
                          <div>
                            <p className="font-black text-slate-900 text-sm leading-none group-hover:text-indigo-600 transition-colors">{agent.fullName}</p>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 font-bold">
                               <MapPin className="h-2.5 w-2.5" /> {agent.serviceCity}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-slate-100 text-slate-600 font-bold text-[9px] uppercase border-none shadow-none">
                          {agent.agentRank || "Junior"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                           <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                           <span className="text-xs font-black text-slate-900">{agent.rating || "0.0"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {agent.isVerified ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[9px] uppercase font-black">Verified</Badge>
                        ) : (
                          <Badge className="bg-slate-50 text-slate-300 text-[9px] uppercase font-bold">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right px-8">
                         <Button variant="ghost" size="icon" className="rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <ChevronRight className="h-4 w-4" />
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default AgentsPage;