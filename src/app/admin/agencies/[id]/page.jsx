"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  ExternalLink,
  User,
  MessageSquare,
  Briefcase,
  Users,
  Home,
  Eye,
  MousePointer2,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function AgencyDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAgencyDetails();
  }, [id]);

  const fetchAgencyDetails = async () => {
    try {
      const res = await fetch(`/api/admin/agencies/${id}`);
      const data = await res.json();
      if (data.success) setAgency(data.agency);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load agency details");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/agencies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setAgency(data.agency);
        toast.success(`Status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center font-bold text-slate-400">
        Loading Portfolio...
      </div>
    );
  if (!agency)
    return (
      <div className="p-10 text-center text-red-500">Agency not found.</div>
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto">
      {/* ── HEADER & STATUS CONTROL ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-slate-500 hover:text-blue-600 font-bold text-xs gap-2 w-fit"
        >
          <ArrowLeft size={16} /> Back to Directory
        </Button>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Update Status:
          </span>
          <Select
            onValueChange={updateStatus}
            defaultValue={agency.verificationStatus}
            disabled={updating}
          >
            <SelectTrigger className="w-40 h-9 rounded-xl font-bold text-xs border-slate-200 focus:ring-blue-500/10">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200">
              {["Pending", "Verified", "Suspended", "Rejected"].map(
                (status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    className="text-xs font-bold py-2"
                  >
                    {status}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── LEFT COLUMN: BRAND & OWNER ─────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-6">
          {/* Agency Brand Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="relative h-24 w-24 rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden mb-4 p-2">
                <Image
                  src={agency.companyLogo}
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-xl font-black text-slate-900">
                {agency.companyName}
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                {agency.licenseNumber}
              </p>
              <div className="flex gap-2 mt-4">
                <Badge className={cnStatus(agency.verificationStatus)}>
                  {agency.verificationStatus}
                </Badge>
                {agency.isPremium && (
                  <Badge className="bg-amber-50 text-amber-600 border-amber-100">
                    Premium
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-8 space-y-4 border-t border-slate-50 pt-6">
              <InfoItem
                icon={<Mail size={14} />}
                label="Official Email"
                value={agency.officialEmail}
              />
              <InfoItem
                icon={<Phone size={14} />}
                label="Phone Number"
                value={agency.officialNumber}
              />
              <InfoItem
                icon={<MessageSquare size={14} />}
                label="WhatsApp"
                value={agency.whatsappNumber}
              />
              <InfoItem
                icon={<MapPin size={14} />}
                label="Office Address"
                value={`${agency.officeAddress}, ${agency.city}`}
              />
              <InfoItem
                icon={<Briefcase size={14} />}
                label="Specialization"
                value={agency.specialization}
              />
            </div>
          </div>

          {/* Owner Details Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
              <User className="text-blue-600" size={16} /> Owner Identity
            </h3>
            <div className="space-y-4">
              <InfoItem label="Full Name" value={agency.ownerName} />
              <InfoItem label="CNIC Number" value={agency.ownerCNIC} />
              <div className="flex gap-2 mt-2">
                <Badge
                  variant={agency.emailVerified ? "success" : "outline"}
                  className="text-[9px]"
                >
                  Email {agency.emailVerified ? "Verified" : "Unverified"}
                </Badge>
                <Badge
                  variant={agency.phoneVerified ? "success" : "outline"}
                  className="text-[9px]"
                >
                  Phone {agency.phoneVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: STATS & DOCS ─────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatMini
              icon={<Users size={14} />}
              label="Agents"
              value={agency.totalAgents}
            />
            <StatMini
              icon={<Home size={14} />}
              label="Listings"
              value={agency.totalListings}
            />
            <StatMini
              icon={<Eye size={14} />}
              label="Views"
              value={agency.totalViews}
            />
            <StatMini
              icon={<MousePointer2 size={14} />}
              label="Leads"
              value={agency.totalLeads}
            />
          </div>

          {/* Subscription Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Active Plan
                </p>
                <p className="text-sm font-black text-slate-900">
                  {agency.subscriptionPlan} Plan
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Limits
              </p>
              <p className="text-xs font-bold text-slate-700">
                {agency.maxListings} Listings • {agency.maxAgents} Agents
              </p>
            </div>
          </div>

          {/* Legal Documentation */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="text-blue-600" size={18} /> Verification
              Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DocCard title="CNIC Front" url={agency.ownerCNICFrontUrl} />
              <DocCard title="CNIC Back" url={agency.ownerCNICBackUrl} />
              <DocCard title="Utility Bill" url={agency.utilityBillUrl} />
              <DocCard
                title="Registration Certificate"
                url={agency.registrationCertificateUrl}
              />
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-2 underline decoration-blue-500/30 underline-offset-4">
              Company Bio
            </h3>
            <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
              &quot;{agency.companyBio}&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── HELPER COMPONENTS ──────────────────────────────────────────────────

function StatMini({ icon, label, value }) {
  return (
    <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2 text-slate-400 mb-1">
        {icon}{" "}
        <span className="text-[9px] font-bold uppercase tracking-widest">
          {label}
        </span>
      </div>
      <p className="text-xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      {icon && <div className="mt-1 text-slate-400">{icon}</div>}
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
          {label}
        </p>
        <p className="text-xs font-bold text-slate-700">{value || "N/A"}</p>
      </div>
    </div>
  );
}

function DocCard({ title, url }) {
  if (!url) return null;
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {title}
      </p>
      <div className="relative group aspect-video bg-slate-50 rounded-xl border border-dashed border-slate-200 overflow-hidden">
        <Image
          src={url}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2"
        >
          <ExternalLink size={18} />
          <span className="text-[10px] font-black uppercase">
            Open Full View
          </span>
        </a>
      </div>
    </div>
  );
}

function cnStatus(status) {
  const styles = {
    Verified: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Pending: "bg-amber-50 text-amber-600 border-amber-100",
    Rejected: "bg-red-50 text-red-600 border-red-100",
    Suspended: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return styles[status] || styles.Pending;
}
