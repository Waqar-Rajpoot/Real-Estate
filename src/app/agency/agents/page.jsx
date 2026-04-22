"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Phone,
  Mail,
  ExternalLink,
  Loader2,
  Search,
  CheckCircle,
  ShieldAlert,
  MapPin,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function MyAgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("/api/agency/my-agents");
        const data = await res.json();
        if (data.success) setAgents(data.agents);
      } catch (err) {
        console.error("Failed to load agents", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const filteredAgents = agents.filter(
    (agent) =>
      agent.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <p className="text-slate-500 font-medium animate-pulse">Syncing team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Users size={20} />
              </div>
              <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">Team Management</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Agency Agents</h1>
            <p className="text-slate-500 mt-1 font-medium">
              Monitor, manage, and scale your real estate workforce.
            </p>
          </div>
          <Link href="/agency/add-agent">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 h-auto rounded-2xl shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 gap-3 text-base font-bold">
              <UserPlus size={20} /> Add New Agent
            </Button>
          </Link>
        </div>

        {/* ANALYTICS MINI-CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Users size={24}/></div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Team</p>
              <p className="text-2xl font-black text-slate-900">{agents.length}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><UserCheck size={24}/></div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Now</p>
              <p className="text-2xl font-black text-slate-900">{agents.filter(a => a.isActive).length}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><TrendingUp size={24}/></div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Growth</p>
              <p className="text-2xl font-black text-slate-900">+12%</p>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="relative mb-8 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
            size={20}
          />
          <Input
            placeholder="Search agents by name, email, or specialization..."
            className="pl-12 text-slate-900 h-14 bg-white border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-100 transition-all text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* AGENTS GRID */}
        {filteredAgents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAgents.map((agent) => (
              <Card
                key={agent._id}
                className="overflow-hidden border-none bg-white ring-1 ring-slate-200 shadow-sm hover:shadow-2xl hover:ring-blue-400 transition-all duration-500 group rounded-3xl"
              >
                {/* Image Section */}
                <div className="relative h-72 w-full overflow-hidden">
                  <Image
                    src={agent.profilePicture || "/default-avatar.png"}
                    alt={agent.fullName}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1.5 text-[11px] font-black rounded-xl uppercase tracking-widest backdrop-blur-md border shadow-lg ${
                        agent.isActive
                          ? "bg-emerald-500/90 text-white border-emerald-400"
                          : "bg-red-500/90 text-white border-red-400"
                      }`}
                    >
                      {agent.isActive ? "Active" : "Suspended"}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6 relative">
                  <div className="mb-4">
                    <h3 className="font-black text-xl text-slate-900 truncate leading-tight">
                      {agent.fullName}
                    </h3>
                    <p className="text-sm text-blue-600 font-bold flex items-center gap-1 mt-1 uppercase tracking-tighter">
                      <MapPin size={14} /> {agent.serviceCity || "Professional Agent"}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <Mail size={16} className="text-slate-400 shrink-0" />
                      <span className="truncate">{agent.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <Phone size={16} className="text-slate-400 shrink-0" />
                      <span>{agent.whatsappNumber}</span>
                    </div>
                  </div>

                  <Link href={`/agency/agents/${agent._id}`}>
                    <Button
                      variant="outline"
                      className="w-full h-12 bg-slate-300 rounded-xl border-slate-200 text-slate-700 font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all gap-2 group/btn"
                    >
                      Manage Profile 
                      <ExternalLink size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="text-slate-300" size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              No Agents Found
            </h3>
            <p className="text-slate-500 max-w-xs mx-auto font-medium">
              We couldnt find any team members matching your search criteria.
            </p>
            <Button 
              variant="link" 
              onClick={() => setSearchTerm("")}
              className="text-blue-600 font-bold mt-4"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}