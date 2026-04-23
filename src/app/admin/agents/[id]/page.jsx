"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronLeft, ShieldCheck, Mail, Phone, MapPin,
  Building2, FileText, UserCheck, Ban, Trash2, Trophy
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const AgentStatusManager = ({ agent, setAgent }) => {
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async (field, value, extra = {}) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/agents/${agent._id}/update-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value, ...extra }),
      });

      const data = await res.json();
      if (res.ok) {
        setAgent(data.agent);
        toast.success(`${field} updated successfully`);
      }
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card className="border-none shadow-sm rounded-4xl bg-indigo-900 text-white overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-black flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-indigo-300" /> Platform Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
          <div>
            <p className="font-bold text-sm">Public Visibility</p>
            <p className="text-[10px] text-indigo-200">Is this agent visible to clients?</p>
          </div>
          <Switch
            checked={agent.isPubliclyVisible}
            onCheckedChange={(val) => handleUpdate("isPubliclyVisible", val)}
            disabled={updating}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
          <div>
            <p className="font-bold text-sm">Account Active</p>
            <p className="text-[10px] text-indigo-200">Disable to block agent access.</p>
          </div>
          <Switch
            checked={agent.isActive}
            onCheckedChange={(val) => handleUpdate("isActive", val)}
            disabled={updating}
          />
        </div>

        <div className="flex flex-col gap-4 p-4 bg-indigo-800 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-sm flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-400" /> Featured Status
              </p>
              {agent.featuredUntil && (
                <p className="text-[10px] text-amber-300 font-bold">
                  Expires: {new Date(agent.featuredUntil).toLocaleDateString()}
                </p>
              )}
            </div>
            <Switch
              checked={agent.isFeatured}
              onCheckedChange={(val) => handleUpdate("isFeatured", val, { days: 30 })}
              disabled={updating}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AgentDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        const res = await fetch(`/api/admin/agents/${id}`);
        const data = await res.json();
        setAgent(data);
      } catch (error) {
        console.error("Failed to load agent:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgentDetails();
  }, [id]);

  if (loading) return <div className="p-10 text-center font-bold text-slate-400">Loading Agent Profile...</div>;
  if (!agent) return <div className="p-10 text-center text-red-500">Agent not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-6">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="hover:bg-white rounded-xl gap-2 font-bold text-slate-600">
          <ChevronLeft className="h-4 w-4" /> Back to Directory
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 font-bold text-red-600 hover:bg-red-50">
            <Ban className="h-4 w-4 mr-2" /> Suspend
          </Button>
          <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold">
            <UserCheck className="h-4 w-4 mr-2" /> Approve Verification
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
            <div className="h-32 bg-linear-to-r from-indigo-600 to-violet-600" />
            <CardContent className="relative pt-0">
              <div className="absolute -top-16 left-6 h-32 w-32 rounded-3xl overflow-hidden border-4 border-white shadow-lg bg-white">
                <Image
                  src={agent.profilePicture || "/placeholder.png"}
                  fill
                  className="object-cover"
                  alt={agent.fullName}
                />
              </div>
              <div className="pt-20 px-2">
                <h2 className="text-2xl font-black text-slate-900">{agent.fullName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-amber-100 text-amber-700 border-none px-2 py-0.5 uppercase text-[10px] font-black">{agent.agentRank}</Badge>
                  {agent.isVerified && <ShieldCheck className="h-4 w-4 text-blue-600" />}
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3 text-slate-600"><Mail className="h-4 w-4 text-slate-400" /><span className="text-sm font-medium">{agent.email}</span></div>
                  <div className="flex items-center gap-3 text-slate-600"><Phone className="h-4 w-4 text-slate-400" /><span className="text-sm font-medium">{agent.phoneNumber}</span></div>
                  <div className="flex items-center gap-3 text-slate-600"><MapPin className="h-4 w-4 text-slate-400" /><span className="text-sm font-medium">{agent.serviceCity}, Pakistan</span></div>
                </div>
                <Separator className="my-6" />
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agency Affiliation</p>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <Building2 className="h-8 w-8 text-indigo-600" />
                    <div>
                      <p className="text-sm font-black text-slate-900">{agent.agency?.companyName || "Independent"}</p>
                      <p className="text-[10px] font-bold text-slate-400">BRN: {agent.brnNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Control Manager */}
          <AgentStatusManager agent={agent} setAgent={setAgent} />
        </div>

        {/* Right Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-[2rem]">
            <CardHeader><CardTitle className="text-lg font-black flex items-center gap-2"><FileText className="h-5 w-5 text-indigo-600" /> Professional Summary</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-600 leading-relaxed italic">&ldquo;{agent.aboutAgent}&rdquo;</p>
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Languages</p>
                  <div className="flex gap-2">{agent.languages?.map(lang => (<Badge key={lang} variant="outline" className="rounded-lg">{lang}</Badge>))}</div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Specialization</p>
                  <Badge className="bg-indigo-50 text-indigo-700 border-none font-bold">{agent.specialization}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-[2rem]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-black flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-600" /> Identity Verification</CardTitle>
              <span className="text-xs font-bold text-slate-400 tracking-tighter">CNIC: {agent.cnic}</span>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['Front', 'Back'].map((side) => (
                  <div key={side} className="space-y-3">
                    <p className="text-xs font-bold text-slate-500">CNIC {side} View</p>
                    <div className="group relative rounded-2xl overflow-hidden border-2 border-slate-100 h-48 bg-slate-100">
                      <Image
                        src={side === 'Front' ? agent.cnicFrontUrl : agent.cnicBackUrl}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={`CNIC ${side}`}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Button variant="secondary" size="sm" onClick={() => window.open(side === 'Front' ? agent.cnicFrontUrl : agent.cnicBackUrl)}>View Full</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="p-6 bg-red-50 rounded-[2rem] border border-red-100 flex items-center justify-between">
            <div>
              <p className="text-red-900 font-black text-sm">Delete Agent Profile</p>
              <p className="text-red-600 text-xs font-medium">This will permanently remove the agent and all their listings.</p>
            </div>
            <Button variant="destructive" className="rounded-xl font-bold"><Trash2 className="h-4 w-4 mr-2" /> Delete Profile</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailsPage;






// "use client";
// import React, { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import {
//   ChevronLeft,
//   ShieldCheck,
//   Mail,
//   Phone,
//   Trophy,
//   Settings2,
//   Calendar as CalendarIcon,
// } from "lucide-react";
// import { format } from "date-fns";

// // UI Components
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
// import { toast } from "sonner";
// import { Textarea } from "@/components/ui/textarea";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const AgentStatusManager = ({ agent, setAgent }) => {
//   const [updating, setUpdating] = useState(false);

//   const handleUpdate = async (field, value, extra = {}) => {
//     setUpdating(true);
//     try {
//       const res = await fetch(`/api/admin/agents/${agent._id}/update-status`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ [field]: value, ...extra }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setAgent(data.agent);
//         toast.success("Updated successfully");
//       }
//     } catch (error) {
//         console.error("Update failed", error);
//       toast.error("Update failed");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   return (
//     <Card className="border-none shadow-sm rounded-[2rem] bg-indigo-900 text-white overflow-hidden">
//       <CardHeader>
//         <CardTitle className="text-lg font-black flex items-center gap-2">
//           <Settings2 className="h-5 w-5 text-indigo-300" /> Platform Controls
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {/* Visibility Switch */}
//         <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
//           <div>
//             <p className="font-bold text-sm">Public Visibility</p>
//             <p className="text-[10px] text-indigo-200">
//               Visible on search results
//             </p>
//           </div>
//           <Switch
//             checked={!!agent.isPubliclyVisible}
//             onCheckedChange={(val) => handleUpdate("isPubliclyVisible", val)}
//             disabled={updating}
//           />
//         </div>

//         {/* Featured Logic with Calendar */}
//         <div className="flex flex-col gap-4 p-4 bg-indigo-800 rounded-2xl">
//           <div className="flex items-center justify-between">
//             <p className="font-bold text-sm flex items-center gap-2">
//               <Trophy className="h-4 w-4 text-amber-400" /> Featured Status
//             </p>
//             <Switch
//               checked={!!agent.isFeatured}
//               onCheckedChange={(val) => handleUpdate("isFeatured", val)}
//               disabled={updating}
//             />
//           </div>

//           {agent.isFeatured && (
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start text-left font-normal bg-indigo-950/50 border-none text-white hover:bg-indigo-950"
//                 >
//                   <CalendarIcon className="mr-2 h-4 w-4" />
//                   {agent.featuredUntil ? (
//                     format(new Date(agent.featuredUntil), "PPP")
//                   ) : (
//                     <span>Pick expiry date</span>
//                   )}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0 border-none" align="start">
//                 <Calendar
//                   mode="single"
//                   selected={
//                     agent.featuredUntil
//                       ? new Date(agent.featuredUntil)
//                       : undefined
//                   }
//                   onSelect={(date) => handleUpdate("featuredUntil", date)}
//                   initialFocus
//                 />
//               </PopoverContent>
//             </Popover>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const AgentDetailsPage = () => {
//   const { id } = useParams();
//   const router = useRouter();
//   const [agent, setAgent] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Status Change Dialog State
//   const [isStatusOpen, setIsStatusOpen] = useState(false);
//   const [newStatus, setNewStatus] = useState("");
//   const [reason, setReason] = useState("");

//   useEffect(() => {
//     const fetchAgentDetails = async () => {
//       try {
//         const res = await fetch(`/api/admin/agents/${id}`);
//         const data = await res.json();
//         setAgent(data);
//         setNewStatus(data.accountStatus);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAgentDetails();
//   }, [id]);

//   const updateAccountStatus = async () => {
//     try {
//       const res = await fetch(`/api/admin/agents/${id}/update-status`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           accountStatus: newStatus,
//           rejectionReason: reason,
//         }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setAgent(data.agent);
//         setIsStatusOpen(false);
//         setReason("");
//         toast.success(`Status updated to ${newStatus}`);
//       }
//     } catch (error) {
//         console.error("Failed to update status", error);
//       toast.error("Failed to update status");
//     }
//   };

//   if (loading)
//     return (
//       <div className="p-10 text-center font-bold text-slate-400">
//         Loading...
//       </div>
//     );
//   if (!agent)
//     return <div className="p-10 text-center text-red-500">Not found.</div>;

//   return (
//     <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-6">
//       <div className="flex items-center justify-between">
//         <Button
//           variant="ghost"
//           onClick={() => router.back()}
//           className="hover:bg-white rounded-xl gap-2 font-bold text-slate-600"
//         >
//           <ChevronLeft className="h-4 w-4" /> Back
//         </Button>

//         {/* Status Dropdown Logic */}
//         <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
//           <DialogTrigger asChild>
//             <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold">
//               Account Status: {agent.accountStatus}
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="rounded-[2rem]">
//             <DialogHeader>
//               <DialogTitle>Update Agent Status</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4 py-4">
//               <Select value={newStatus} onValueChange={setNewStatus}>
//                 <SelectTrigger className="rounded-xl">
//                   <SelectValue placeholder="Select Status" />
//                 </SelectTrigger>
//                 <SelectContent className="rounded-xl">
//                   <SelectItem value="active">Active</SelectItem>
//                   <SelectItem value="suspended">Suspended</SelectItem>
//                   <SelectItem value="rejected">Rejected</SelectItem>
//                   <SelectItem value="blocked">Blocked</SelectItem>
//                 </SelectContent>
//               </Select>

//               <Textarea
//                 placeholder="Reason for changing status..."
//                 className="rounded-xl"
//                 value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//               />
//             </div>
//             <DialogFooter>
//               <Button
//                 onClick={updateAccountStatus}
//                 className="rounded-xl w-full bg-indigo-600"
//               >
//                 Confirm Update
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="space-y-6">
//           <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
//             <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600" />
//             <CardContent className="relative pt-0">
//               <div className="absolute -top-16 left-6 h-32 w-32 rounded-3xl overflow-hidden border-4 border-white shadow-lg bg-white">
//                 <Image
//                   src={agent.profilePicture || "/placeholder.png"}
//                   fill
//                   className="object-cover"
//                   alt={agent.fullName}
//                 />
//               </div>
//               <div className="pt-20 px-2">
//                 <h2 className="text-2xl font-black text-slate-900">
//                   {agent.fullName}
//                 </h2>
//                 <div className="flex items-center gap-2 mt-1">
//                   <Badge className="bg-amber-100 text-amber-700 border-none uppercase text-[10px] font-black">
//                     {agent.agentRank}
//                   </Badge>
//                   {agent.accountStatus === "active" && (
//                     <ShieldCheck className="h-4 w-4 text-blue-600" />
//                   )}
//                 </div>
//                 {/* Contact info remains the same */}
//                 <div className="mt-6 space-y-4">
//                   <div className="flex items-center gap-3 text-slate-600">
//                     <Mail className="h-4 w-4" />{" "}
//                     <span className="text-sm font-medium">{agent.email}</span>
//                   </div>
//                   <div className="flex items-center gap-3 text-slate-600">
//                     <Phone className="h-4 w-4" />{" "}
//                     <span className="text-sm font-medium">
//                       {agent.phoneNumber}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <AgentStatusManager agent={agent} setAgent={setAgent} />
//         </div>

//         {/* Right side for Documents & Bio */}
//         <div className="lg:col-span-2 space-y-6">
//           <Card className="border-none shadow-sm rounded-[2rem]">
//             <CardHeader>
//               <CardTitle className="text-lg font-black">
//                 Professional Summary
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-slate-600 italic">&quot;{agent.aboutAgent}&quot;</p>
//               {agent.rejectionReason && (
//                 <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100">
//                   <p className="text-xs font-bold uppercase tracking-widest">
//                     Admin Note / Reason:
//                   </p>
//                   <p className="text-sm">{agent.rejectionReason}</p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Identity Verification Images */}
//           <Card className="border-none shadow-sm rounded-[2rem]">
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle className="text-lg font-black">
//                 Identity Verification
//               </CardTitle>
//               <Badge variant="outline">CNIC: {agent.cnic}</Badge>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {["cnicFrontUrl", "cnicBackUrl"].map((field, idx) => (
//                   <div key={field} className="space-y-3">
//                     <p className="text-xs font-bold text-slate-500">
//                       CNIC {idx === 0 ? "Front" : "Back"}
//                     </p>
//                     <div className="group relative rounded-2xl overflow-hidden border-2 h-48 bg-slate-100">
//                       <Image
//                         src={agent[field] || "/placeholder.png"}
//                         fill
//                         className="object-cover"
//                         alt="ID Card"
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AgentDetailsPage;
