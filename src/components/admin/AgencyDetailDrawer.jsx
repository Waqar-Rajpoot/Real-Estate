// "use client";
// import React, { useState, useEffect } from "react";
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Check, X, AlertTriangle } from "lucide-react";

// export default function AgencyDetailDrawer({ isOpen, onClose, agencyId, refresh }) {
//   const [agency, setAgency] = useState(null);
//   const [processing, setProcessing] = useState(false);

//   useEffect(() => {
//     if (isOpen && agencyId) {
//       fetch(`/api/admin/agencies/${agencyId}`)
//         .then(res => res.json())
//         .then(data => setAgency(data));
//     }
//   }, [isOpen, agencyId]);

//   const handleAction = async (status, reason = "") => {
//     setProcessing(true);
//     try {
//       await fetch(`/api/admin/agencies/${agencyId}/verify`, {
//         method: "PATCH",
//         body: JSON.stringify({ verificationStatus: status, rejectionReason: reason }),
//       });
//       onClose();
//       refresh();
//     } catch (error) {
//       alert("Action failed");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   if (!agency) return null;

//   return (
//     <Sheet open={isOpen} onOpenChange={onClose}>
//       <SheetContent className="sm:max-w-xl overflow-y-auto">
//         <SheetHeader className="space-y-4">
//           <div className="flex items-center gap-4">
//             <img src={agency.companyLogo} className="h-16 w-16 rounded border" alt="" />
//             <div>
//               <SheetTitle className="text-xl font-bold">{agency.companyName}</SheetTitle>
//               <p className="text-sm text-slate-500">License: {agency.licenseNumber}</p>
//             </div>
//           </div>
//         </SheetHeader>

//         <div className="mt-8 space-y-6">
//           {/* Section: Owner Info */}
//           <div className="bg-slate-50 p-4 rounded-lg border">
//             <h4 className="font-semibold text-slate-900 mb-2">Owner Details</h4>
//             <p className="text-sm">Name: <span className="font-medium">{agency.ownerName}</span></p>
//             <p className="text-sm">CNIC: <span className="font-medium">{agency.ownerCNIC}</span></p>
//           </div>

//           {/* Section: Documents */}
//           <div>
//             <h4 className="font-semibold text-slate-900 mb-4">Legal Documents</h4>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">CNIC Front</p>
//                 <img src={agency.ownerCNICFrontUrl} className="rounded border w-full aspect-video object-cover cursor-pointer hover:opacity-90" alt="CNIC Front" />
//               </div>
//               <div>
//                 <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Trade License / Certificate</p>
//                 <img src={agency.registrationCertificateUrl} className="rounded border w-full aspect-video object-cover cursor-pointer hover:opacity-90" alt="Registration" />
//               </div>
//             </div>
//           </div>

//           <Separator />

//           {/* Admin Actions */}
//           <div className="space-y-3">
//             <h4 className="font-semibold text-slate-900">Verification Decisions</h4>
//             <div className="grid grid-cols-2 gap-3">
//               <Button 
//                 onClick={() => handleAction("Verified")} 
//                 className="bg-green-600 hover:bg-green-700" 
//                 disabled={processing}
//               >
//                 <Check className="mr-2 h-4 w-4" /> Approve Agency
//               </Button>
//               <Button 
//                 variant="destructive" 
//                 onClick={() => handleAction("Rejected", "Documents are unclear.")} 
//                 disabled={processing}
//               >
//                 <X className="mr-2 h-4 w-4" /> Reject
//               </Button>
//             </div>
//             <Button 
//               variant="outline" 
//               className="w-full text-amber-600 border-amber-200 hover:bg-amber-50"
//               onClick={() => handleAction("Suspended", "Manual admin suspension.")}
//               disabled={processing}
//             >
//               <AlertTriangle className="mr-2 h-4 w-4" /> Suspend Account
//             </Button>
//           </div>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// }








"use client";
import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Check, 
  X, 
  AlertTriangle, 
  User, 
  FileText, 
  ShieldCheck, 
  ExternalLink,
  Fingerprint
} from "lucide-react";

export default function AgencyDetailDrawer({ isOpen, onClose, agencyId, refresh }) {
  const [agency, setAgency] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isOpen && agencyId) {
      fetch(`/api/admin/agencies/${agencyId}`)
        .then(res => res.json())
        .then(data => setAgency(data));
    }
  }, [isOpen, agencyId]);

  const handleAction = async (status, reason = "") => {
    setProcessing(true);
    try {
      await fetch(`/api/admin/agencies/${agencyId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationStatus: status, rejectionReason: reason }),
      });
      onClose();
      refresh();
    } catch (error) {
      alert("Action failed");
    } finally {
      setProcessing(false);
    }
  };

  if (!agency) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl overflow-y-auto bg-white border-l shadow-2xl p-0">
        {/* Header Section with Gradient Accent */}
        <div className="bg-slate-900 p-8 text-white">
          <SheetHeader className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <img 
                  src={agency.companyLogo} 
                  className="relative h-20 w-20 rounded-2xl border-2 border-white/10 bg-white object-contain p-1 shadow-xl" 
                  alt={agency.companyName} 
                />
              </div>
              <div className="text-center sm:text-left">
                <SheetTitle className="text-2xl font-black text-white tracking-tight leading-none">
                  {agency.companyName}
                </SheetTitle>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 hover:bg-blue-600/30">
                    {agency.licenseNumber}
                  </Badge>
                  <Badge variant="outline" className="text-slate-400 border-slate-700 capitalize">
                    {agency.subscriptionPlan} Tier
                  </Badge>
                </div>
              </div>
            </div>
          </SheetHeader>
        </div>

        <div className="p-8 space-y-8">
          {/* Section: Owner Info with High Contrast */}
          <div className="grid grid-cols-1 gap-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <User className="h-3 w-3" /> Principal Contact
            </h4>
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 border-l-4 border-l-blue-600 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-tighter">Legal Full Name</p>
                  <p className="text-lg font-bold text-slate-900">{agency.ownerName}</p>
                </div>
                <Fingerprint className="h-8 w-8 text-slate-200" />
              </div>
              <div className="pt-4 border-t border-slate-200 flex justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Identity (CNIC)</p>
                  <p className="text-sm font-mono font-bold text-slate-700">{agency.ownerCNIC}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase text-right">Official Email</p>
                  <p className="text-sm font-bold text-slate-700 text-right">{agency.officialEmail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Documents with Premium Preview */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <FileText className="h-3 w-3" /> Compliance Vault
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Identity (Front)", url: agency.ownerCNICFrontUrl },
                { label: "Trade Certificate", url: agency.registrationCertificateUrl }
              ].map((doc, idx) => (
                <div key={idx} className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video shadow-sm hover:shadow-md transition-all">
                  <img 
                    src={doc.url} 
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110 group-hover:opacity-40" 
                    alt={doc.label} 
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-blue-900/40 backdrop-blur-[2px]">
                    <Button variant="secondary" size="sm" className="font-bold text-xs h-8">
                      <ExternalLink className="h-3 w-3 mr-2" /> View Original
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-[10px] text-white font-bold uppercase truncate">{doc.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Decision Engine Styling */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheck className="h-3 w-3" /> Verification Engine
              </h4>
              <p className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Action Required</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => handleAction("Verified")} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 shadow-lg shadow-emerald-200 transition-all active:scale-95" 
                disabled={processing}
              >
                <Check className="mr-2 h-5 w-5" /> Approve Partner
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleAction("Rejected", "Documents are unclear.")} 
                className="border-red-200 text-red-600 hover:bg-red-50 font-bold h-12 transition-all active:scale-95"
                disabled={processing}
              >
                <X className="mr-2 h-5 w-5" /> Reject Application
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              className="w-full text-slate-400 hover:text-amber-600 hover:bg-amber-50 h-10 font-semibold text-xs tracking-tight"
              onClick={() => handleAction("Suspended", "Manual admin suspension.")}
              disabled={processing}
            >
              <AlertTriangle className="mr-2 h-4 w-4" /> Place Under Administrative Suspension
            </Button>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t flex items-center justify-center">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise Compliance Dashboard v1.4</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}