// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Check, X, ShieldCheck, Trophy, Mail, Phone, Info, Star } from "lucide-react";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";

// export default function AgentDetailDrawer({
//   isOpen,
//   onClose,
//   agentId,
//   refresh,
// }) {
//   const [agent, setAgent] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [updating, setUpdating] = useState(false);

//   useEffect(() => {
//     if (isOpen && agentId) {
//       setLoading(true);
//       fetch(`/api/admin/agents/${agentId}`)
//         .then((res) => res.json())
//         .then((data) => {
//           setAgent(data);
//           setLoading(false);
//         });
//     }
//   }, [isOpen, agentId]);

//   const handleUpdate = async (payload) => {
//     setUpdating(true);
//     try {
//       const res = await fetch(`/api/admin/agents/${agentId}/verify`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (res.ok) {
//         const updated = await res.json();
//         setAgent(updated.agent);
//         refresh();
//       }
//     } catch (error) {
//       console.error("Update failed", error);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleStatusToggle = async (active) => {
//     setUpdating(true);
//     try {
//       await fetch(`/api/admin/agents/${agentId}/status`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           isActive: active,
//           suspensionReason: active ? "" : "Admin Discretion",
//         }),
//       });
//       setAgent((prev) => ({ ...prev, isActive: active }));
//       refresh();
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading || !agent) return null;

//   return (
//     <Sheet open={isOpen} onOpenChange={onClose}>
//       <SheetContent className="sm:max-w-xl overflow-y-auto bg-white border-l shadow-2xl">
//         <SheetHeader className="pb-6 border-b">
//           <div className="flex items-start justify-between mt-4">
//             <div className="flex items-center gap-4">
//               <img
//                 src={agent.profilePicture}
//                 className="h-20 w-20 rounded-xl object-cover border-4 border-slate-50 shadow-md"
//                 alt=""
//               />
//               <div>
//                 <SheetTitle className="text-2xl font-bold text-slate-900">
//                   {agent.fullName}
//                 </SheetTitle>
//                 <div className="flex items-center gap-2 mt-1">
//                   <Badge className="bg-blue-600 hover:bg-blue-600 uppercase text-[10px] tracking-widest">
//                     {agent.agentRank}
//                   </Badge>
//                   {agent.isVerified && (
//                     <ShieldCheck className="h-4 w-4 text-blue-600" />
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </SheetHeader>

//         <div className="py-8 space-y-8">
//           {/* Quick Contact */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
//               <Mail className="h-4 w-4 text-slate-400" />
//               <span className="text-xs font-medium truncate">
//                 {agent.email}
//               </span>
//             </div>
//             <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
//               <Phone className="h-4 w-4 text-slate-400" />
//               <span className="text-xs font-medium">{agent.phoneNumber}</span>
//             </div>
//           </div>

//           {/* Verification Documents */}
//           <section className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
//                 KYC Documentation
//               </h4>
//               <span className="text-[10px] font-bold text-slate-400">
//                 CNIC: {agent.cnic}
//               </span>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <p className="text-[10px] font-bold text-slate-500 uppercase">
//                   Front View
//                 </p>
//                 <img
//                   src={agent.cnicFrontUrl}
//                   className="rounded-lg border shadow-sm w-full h-32 object-cover hover:opacity-90 cursor-pointer"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <p className="text-[10px] font-bold text-slate-500 uppercase">
//                   Back View
//                 </p>
//                 <img
//                   src={agent.cnicBackUrl}
//                   className="rounded-lg border shadow-sm w-full h-32 object-cover hover:opacity-90 cursor-pointer"
//                 />
//               </div>
//             </div>
//           </section>

//           <Separator />

//           {/* Admin Controls */}
//           <section className="space-y-6">
//             <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
//               <Trophy className="h-4 w-4 text-amber-500" /> Platform Controls
//             </h4>

//             <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
//               <div className="flex items-center justify-between">
//                 <div className="space-y-0.5">
//                   <Label className="text-sm font-bold">
//                     Verified Professional
//                   </Label>
//                   <p className="text-xs text-slate-500">
//                     Grant the &quot;Verified&quot; badge to this agent.
//                   </p>
//                 </div>
//                 <Switch
//                   checked={agent.isVerified}
//                   onCheckedChange={(val) => handleUpdate({ isVerified: val })}
//                   disabled={updating}
//                 />
//               </div>

//               <div className="flex items-center justify-between pt-4 border-t">
//                 <div className="space-y-0.5">
//                   <Label className="text-sm font-bold">Account Access</Label>
//                   <p className="text-xs text-slate-500">
//                     Suspend or enable agent&quot;s platform access.
//                   </p>
//                 </div>
//                 <Switch
//                   checked={agent.isActive}
//                   onCheckedChange={handleStatusToggle}
//                   disabled={updating}
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <Button
//                 variant="outline"
//                 className="w-full text-slate-700 border-slate-200 font-bold"
//                 onClick={() =>
//                   handleUpdate({
//                     agentRank: "Top Performer",
//                     badges: ["Verified Expert", "Quick Responder"],
//                   })
//                 }
//                 disabled={updating}
//               >
//                 <Star className="mr-2 h-4 w-4 text-amber-500 fill-amber-500" />{" "}
//                 Promote to Top
//               </Button>
//               <Button
//                 variant="outline"
//                 className="w-full text-blue-600 border-blue-100 hover:bg-blue-50 font-bold"
//                 onClick={() =>
//                   handleUpdate({
//                     isFeatured: !agent.isFeatured,
//                     featuredUntil: new Date(
//                       Date.now() + 30 * 24 * 60 * 60 * 1000,
//                     ),
//                   })
//                 }
//                 disabled={updating}
//               >
//                 {agent.isFeatured ? "Unfeature" : "Feature Agent"}
//               </Button>
//             </div>
//           </section>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  X,
  ShieldCheck,
  Trophy,
  Mail,
  Phone,
  Star,
  Fingerprint,
  UserCheck,
  Zap,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AgentDetailDrawer({
  isOpen,
  onClose,
  agentId,
  refresh,
}) {
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (isOpen && agentId) {
      setLoading(true);
      fetch(`/api/admin/agents/${agentId}`)
        .then((res) => res.json())
        .then((data) => {
          setAgent(data);
          setLoading(false);
        });
    }
  }, [isOpen, agentId]);

  const handleUpdate = async (payload) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/agents/${agentId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await res.json();
        setAgent(updated.agent);
        refresh();
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusToggle = async (active) => {
    setUpdating(true);
    try {
      await fetch(`/api/admin/agents/${agentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: active,
          suspensionReason: active ? "" : "Administrative Review",
        }),
      });
      setAgent((prev) => ({ ...prev, isActive: active }));
      refresh();
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !agent) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl p-0 overflow-y-auto bg-slate-50 border-l border-slate-200">
        {/* Header Section with Glass Effect */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <img
                  src={agent.profilePicture}
                  className="h-24 w-24 rounded-[2rem] object-cover border-4 border-white shadow-2xl transition-transform group-hover:scale-105 duration-500"
                  alt=""
                />
                {agent.isActive && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-500 border-4 border-white rounded-full shadow-sm" />
                )}
              </div>
              <div>
                <SheetTitle className="text-3xl font-black text-slate-900 tracking-tight">
                  {agent.fullName}
                </SheetTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                    {agent.agentRank}
                  </Badge>
                  {agent.isVerified && (
                    <Badge
                      variant="outline"
                      className="border-blue-200 text-blue-600 bg-blue-50/50 font-bold text-[10px] py-1 px-3 rounded-lg flex items-center gap-1"
                    >
                      <ShieldCheck className="h-3 w-3" /> VERIFIED
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8 pb-24">
          {/* Action Grid */}
          <div className="grid grid-cols-2 gap-4">
            <a
              href={`mailto:${agent.email}`}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-500 hover:text-blue-600 transition-all group"
            >
              <Mail className="h-5 w-5 mb-2 text-slate-400 group-hover:text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Email Agent
              </span>
            </a>
            <a
              href={`tel:${agent.phoneNumber}`}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-500 hover:text-emerald-600 transition-all group"
            >
              <Phone className="h-5 w-5 mb-2 text-slate-400 group-hover:text-emerald-600" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Direct Call
              </span>
            </a>
          </div>

          {/* KYC Audit Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Fingerprint className="h-4 w-4" /> Identity Verification
              </h4>
              <span className="text-[11px] font-mono font-black text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                BRN: {agent.cnic || "PENDING"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Front Document", url: agent.cnicFrontUrl },
                { label: "Rear Document", url: agent.cnicBackUrl },
              ].map((doc, idx) => (
                <div key={idx} className="space-y-2 group">
                  <p className="text-[9px] font-black text-slate-500 uppercase px-1">
                    {doc.label}
                  </p>
                  <div className="relative rounded-3xl overflow-hidden border-2 border-white shadow-xl aspect-video bg-slate-200">
                    <img
                      src={doc.url}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                      alt={doc.label}
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ExternalLink className="text-white h-6 w-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Separator className="bg-slate-200/60" />

          {/* Platform Governance */}
          <section className="space-y-6">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
              <ShieldAlert className="h-4 w-4 text-slate-400" /> Platform
              Governance
            </h4>

            <div className="space-y-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-black text-slate-900 flex items-center gap-2">
                    Verified Status{" "}
                    {agent.isVerified && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </Label>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Grant professional authenticity badges.
                  </p>
                </div>
                <Switch
                  checked={agent.isVerified}
                  onCheckedChange={(val) => handleUpdate({ isVerified: val })}
                  disabled={updating}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <Separator className="bg-slate-50" />

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-1">
                  <Label className="text-sm font-black text-slate-900">
                    Platform Visibility
                  </Label>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Temporarily disable account functionality.
                  </p>
                </div>
                <Switch
                  checked={agent.isActive}
                  onCheckedChange={handleStatusToggle}
                  disabled={updating}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </div>

            {/* Premium Rank Controls */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-14 rounded-2xl bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50 group transition-all"
                onClick={() => handleUpdate({ agentRank: "Top Performer" })}
                disabled={updating}
              >
                <Trophy className="mr-2 h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
                <span className="font-black text-xs uppercase tracking-tight text-slate-700">
                  Set Top Performer
                </span>
              </Button>

              <Button
                variant="outline"
                className={`h-14 rounded-2xl transition-all border-indigo-100 ${agent.isFeatured ? "bg-indigo-600 text-white border-none" : "bg-white hover:bg-indigo-50"}`}
                onClick={() => handleUpdate({ isFeatured: !agent.isFeatured })}
                disabled={updating}
              >
                <Zap
                  className={`mr-2 h-4 w-4 ${agent.isFeatured ? "text-white animate-pulse" : "text-indigo-600"}`}
                />
                <span className="font-black text-xs uppercase tracking-tight">
                  {agent.isFeatured ? "Featured" : "Promote"}
                </span>
              </Button>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 flex gap-4">
          <Button
            onClick={onClose}
            variant="ghost"
            className="flex-1 font-black text-xs uppercase tracking-widest text-slate-400 h-12 rounded-xl"
          >
            Dismiss Audit
          </Button>
          <Button
            onClick={onClose} 
            className="flex-1 bg-slate-900 hover:bg-slate-800 font-black text-xs uppercase tracking-widest h-12 rounded-xl text-white shadow-xl"
          >
            Complete Review
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
