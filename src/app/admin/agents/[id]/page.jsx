"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronLeft, ShieldCheck, Mail, Phone, MapPin,
  Building2, FileText, Trophy, AlertCircle, Ban,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// ─── Custom Toggle ────────────────────────────────────────────────────────────
// Replaces shadcn/ui Switch entirely.
// Built from a plain <button> — React state is the ONLY source of truth.
// No internal controlled/uncontrolled conflict possible.
function CustomToggle({ checked, onChange, disabled = false, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        width: 44,
        height: 24,
        borderRadius: 9999,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        outline: "none",
        padding: 0,
        flexShrink: 0,
        transition: "background 0.2s ease",
        background: checked ? "#6366f1" : "rgba(255,255,255,0.2)",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#ffffff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
          transition: "left 0.18s ease",
          pointerEvents: "none",
        }}
      />
    </button>
  );
}

// ─── Inline Calendar ──────────────────────────────────────────────────────────
// Renders inside the featured-agent row. No external library needed.
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_LABELS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function InlineCalendar({ selectedDate, onSelect }) {
  const todayRef = new Date();
  todayRef.setHours(0, 0, 0, 0);

  const [viewYear,  setViewYear]  = useState(todayRef.getFullYear());
  const [viewMonth, setViewMonth] = useState(todayRef.getMonth());

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const firstWeekDay  = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth   = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Build grid: leading nulls + day numbers
  const cells = [
    ...Array(firstWeekDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function cellDate(day) { return new Date(viewYear, viewMonth, day); }
  function isSelected(day) {
    if (!day || !selectedDate) return false;
    return cellDate(day).toDateString() === new Date(selectedDate).toDateString();
  }
  function isPast(day) {
    if (!day) return false;
    const d = cellDate(day); d.setHours(0,0,0,0);
    return d < todayRef;
  }
  function isToday(day) {
    if (!day) return false;
    return cellDate(day).toDateString() === todayRef.toDateString();
  }

  return (
    <div style={{
      background: "#1e1b4b", borderRadius: 14,
      padding: 14, width: "100%", userSelect: "none",
    }}>
      {/* Month navigation row */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 10,
      }}>
        <button
          type="button" onClick={prevMonth}
          style={{
            background: "rgba(255,255,255,0.1)", border: "none",
            borderRadius: 7, padding: "3px 9px", cursor: "pointer",
            color: "#a5b4fc", fontSize: 15, lineHeight: 1,
          }}
        >‹</button>
        <span style={{ color: "#e0e7ff", fontSize: 11, fontWeight: 700 }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          type="button" onClick={nextMonth}
          style={{
            background: "rgba(255,255,255,0.1)", border: "none",
            borderRadius: 7, padding: "3px 9px", cursor: "pointer",
            color: "#a5b4fc", fontSize: 15, lineHeight: 1,
          }}
        >›</button>
      </div>

      {/* Day-of-week headers */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
        gap: 2, marginBottom: 4,
      }}>
        {DAY_LABELS.map(d => (
          <div key={d} style={{
            textAlign: "center", fontSize: 9, fontWeight: 700,
            color: "#6366f1", padding: "2px 0",
          }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {cells.map((day, i) => {
          const past     = isPast(day);
          const selected = isSelected(day);
          const today    = isToday(day);
          return (
            <button
              key={i}
              type="button"
              disabled={!day || past}
              onClick={() => day && !past && onSelect(cellDate(day))}
              style={{
                height: 28, width: "100%", borderRadius: 6, border: "none",
                fontSize: 10, fontWeight: selected ? 700 : 500,
                cursor: !day || past ? "default" : "pointer",
                background: selected
                  ? "#6366f1"
                  : today ? "rgba(99,102,241,0.28)" : "transparent",
                color: !day ? "transparent"
                  : past ? "rgba(255,255,255,0.18)"
                  : selected ? "#fff" : "#c7d2fe",
                outline: today && !selected ? "1px solid rgba(99,102,241,0.7)" : "none",
              }}
            >{day || ""}</button>
          );
        })}
      </div>

      {/* Chosen date label */}
      {selectedDate && (
        <div style={{
          marginTop: 10, textAlign: "center",
          fontSize: 10, color: "#a5b4fc", fontWeight: 600,
        }}>
          Featured until:{" "}
          <span style={{ color: "#fbbf24" }}>
            {new Date(selectedDate).toLocaleDateString("en-PK", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const AgentDetailsPage = () => {
  const { id }   = useParams();
  const router   = useRouter();

  const [agent,         setAgent]         = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [updatingField, setUpdatingField] = useState(null);

  // Status dialog
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [tempStatus,      setTempStatus]      = useState("");
  const [reason,          setReason]          = useState("");

  // Featured calendar
  const [showCalendar,  setShowCalendar]  = useState(false);
  const [featuredUntil, setFeaturedUntil] = useState(null);

  useEffect(() => { fetchAgentDetails(); }, [id]);

  const fetchAgentDetails = async () => {
    try {
      const res  = await fetch(`/api/admin/agents/${id}`);
      const data = await res.json();
      setAgent(data);
      if (data.featuredUntil) setFeaturedUntil(new Date(data.featuredUntil));
    } catch (err) {
      console.error("Failed to load agent:", err);
      toast.error("Failed to load agent profile");
    } finally {
      setLoading(false);
    }
  };

  // ── handleUpdate ──────────────────────────────────────────────────────────
  const handleUpdate = async (field, value, extra = {}) => {
    const previousValue = agent[field];

    setAgent(prev => ({ ...prev, [field]: value }));   // optimistic
    setUpdatingField(field);

    try {
      const res  = await fetch(`/api/admin/agents/${id}/update-status`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ [field]: value, ...extra }),
      });
      const data = await res.json();

      if (res.ok) {
        // Merge — never replace the whole object
        if (data.agent && typeof data.agent === "object") {
          setAgent(prev => ({ ...prev, ...data.agent }));
        }
        toast.success("Updated successfully");
      } else {
        setAgent(prev => ({ ...prev, [field]: previousValue })); // rollback
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error("ADMIN_AGENT_UPDATE_ERROR:", err);
      setAgent(prev => ({ ...prev, [field]: previousValue }));
      toast.error("Failed to update — please try again");
    } finally {
      setUpdatingField(null);
    }
  };

  // ── Featured toggle ───────────────────────────────────────────────────────
  const handleFeaturedToggle = (val) => {
    if (val) {
      // Turning ON → show calendar inline first
      setFeaturedUntil(null);
      setShowCalendar(true);
    } else {
      // Turning OFF → update immediately
      setShowCalendar(false);
      setFeaturedUntil(null);
      handleUpdate("isFeatured", false, { featuredUntil: null });
    }
  };

  const confirmFeaturedDate = () => {
    if (!featuredUntil) { toast.error("Please pick a date first"); return; }
    setShowCalendar(false);
    handleUpdate("isFeatured", true, {
      featuredUntil: featuredUntil.toISOString(),
    });
  };

  // ── Status select ─────────────────────────────────────────────────────────
  const handleStatusSelect = (newStatus) => {
    if (["rejected", "suspended", "blocked"].includes(newStatus)) {
      setTempStatus(newStatus);
      setShowStatusModal(true);
    } else {
      handleUpdate("accountStatus", newStatus);
    }
  };

  const confirmStatusUpdate = () => {
    handleUpdate("accountStatus", tempStatus, {
      rejectionReason:  tempStatus === "rejected"  ? reason : "",
      suspensionReason: tempStatus === "suspended" ? reason : "",
      blockReason:      tempStatus === "blocked"   ? reason : "",
    });
    setShowStatusModal(false);
    setReason("");
  };

  // ── Guards ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="p-10 text-center font-bold text-slate-400">Loading Agent Profile...</div>
  );
  if (!agent) return (
    <div className="p-10 text-center text-red-500">Agent not found.</div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-6 max-w-7xl mx-auto">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-slate-500 hover:text-indigo-600 font-bold text-xs gap-2 w-fit"
        >
          <ChevronLeft size={16} /> Back to Directory
        </Button>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Account Status:
          </span>
          <Select
            onValueChange={handleStatusSelect}
            value={agent.accountStatus}
            disabled={!!updatingField}
          >
            <SelectTrigger className="w-40 h-9 rounded-xl font-bold text-xs border-slate-200 focus:ring-indigo-500/10">
              <SelectValue placeholder="Set Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200">
              {["active", "suspended", "rejected", "blocked"].map(s => (
                <SelectItem key={s} value={s} className="text-xs font-bold py-2 capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── LEFT COLUMN ───────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Profile card */}
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
            <div className="h-32 bg-linear-to-r from-indigo-600 to-violet-600" />
            <CardContent className="relative pt-0">
              <div className="absolute -top-16 left-6 h-32 w-32 rounded-3xl overflow-hidden border-4 border-white shadow-lg bg-white">
                <Image
                  src={agent.profilePicture || "/placeholder.png"}
                  fill className="object-cover" alt={agent.fullName}
                />
              </div>
              <div className="pt-20 px-2">
                <h2 className="text-2xl font-black text-slate-900">{agent.fullName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-amber-100 text-amber-700 border-none px-2 py-0.5 uppercase text-[10px] font-black">
                    {agent.agentRank}
                  </Badge>
                  {agent.isVerified && <ShieldCheck className="h-4 w-4 text-blue-600" />}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium">{agent.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium">{agent.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium">{agent.serviceCity}, Pakistan</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Agency Affiliation
                  </p>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <Building2 className="h-8 w-8 text-indigo-600" />
                    <div>
                      <p className="text-sm font-black text-slate-900">
                        {agent.agency?.companyName || "Independent"}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400">
                        BRN: {agent.brnNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin controls card */}
          <Card className="border-none shadow-sm rounded-4xl bg-indigo-900 text-white overflow-hidden">
            <CardHeader>
              <CardTitle className="text-sm font-black flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-indigo-300" /> Admin Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Public Visibility */}
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                <div>
                  <p className="font-bold text-xs">Public Visibility</p>
                  <p className="text-[9px] text-indigo-200">Visible on marketplace</p>
                </div>
                <CustomToggle
                  checked={!!agent.isPubliclyVisible}
                  onChange={(val) => handleUpdate("isPubliclyVisible", val)}
                  disabled={updatingField === "isPubliclyVisible"}
                  label="Toggle public visibility"
                />
              </div>

              {/* System Active */}
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                <div>
                  <p className="font-bold text-xs">System Active</p>
                  <p className="text-[9px] text-indigo-200">Login permissions</p>
                </div>
                <CustomToggle
                  checked={!!agent.isActive}
                  onChange={(val) => handleUpdate("isActive", val)}
                  disabled={updatingField === "isActive"}
                  label="Toggle system active"
                />
              </div>

              {/* Featured Agent — inline calendar expands below */}
              <div className="rounded-xl overflow-hidden bg-indigo-800">
                <div className="flex items-center justify-between p-3">
                  <div>
                    <p className="font-bold text-xs flex items-center gap-2">
                      <Trophy className="h-3 w-3 text-amber-400" /> Featured Agent
                    </p>
                    {agent.isFeatured && featuredUntil ? (
                      <p className="text-[9px] text-amber-300 mt-0.5">
                        Until {new Date(featuredUntil).toLocaleDateString("en-PK", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    ) : (
                      <p className="text-[9px] text-indigo-300 mt-0.5">
                        Pick end date to activate
                      </p>
                    )}
                  </div>
                  <CustomToggle
                    checked={!!agent.isFeatured}
                    onChange={handleFeaturedToggle}
                    disabled={updatingField === "isFeatured"}
                    label="Toggle featured agent"
                  />
                </div>

                {/* Calendar expands inline when toggling ON */}
                {showCalendar && (
                  <div className="px-3 pb-3 space-y-3">
                    <InlineCalendar
                      selectedDate={featuredUntil}
                      onSelect={setFeaturedUntil}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCalendar(false);
                          setFeaturedUntil(null);
                          setAgent(prev => ({ ...prev, isFeatured: false }));
                        }}
                        style={{
                          flex: 1, padding: "7px 0", borderRadius: 8,
                          border: "1px solid rgba(255,255,255,0.18)",
                          background: "transparent", color: "#a5b4fc",
                          fontSize: 11, fontWeight: 700, cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={confirmFeaturedDate}
                        disabled={!featuredUntil}
                        style={{
                          flex: 1, padding: "7px 0", borderRadius: 8,
                          border: "none",
                          background: featuredUntil ? "#6366f1" : "rgba(99,102,241,0.3)",
                          color: "#ffffff", fontSize: 11, fontWeight: 700,
                          cursor: featuredUntil ? "pointer" : "not-allowed",
                          opacity: featuredUntil ? 1 : 0.6,
                        }}
                      >
                        Confirm Date
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </CardContent>
          </Card>
        </div>

        {/* ── RIGHT COLUMN ──────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {agent.accountStatus === "rejected" && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-start gap-4">
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Rejection Reason</p>
                <p className="text-sm font-bold text-red-900 mt-1">
                  {agent.rejectionReason || "No reason provided."}
                </p>
              </div>
            </div>
          )}

          {agent.accountStatus === "suspended" && (
            <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 flex items-start gap-4">
              <Ban className="text-slate-600 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Suspension Details</p>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  {agent.suspensionReason || "No reason provided."}
                </p>
              </div>
            </div>
          )}

          <Card className="border-none shadow-sm rounded-4xl">
            <CardHeader>
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" /> Professional Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-600 leading-relaxed italic">&ldquo;{agent.aboutAgent}&rdquo;</p>
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Languages</p>
                  <div className="flex gap-2">
                    {agent.languages?.map(lang => (
                      <Badge key={lang} variant="outline" className="rounded-lg">{lang}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Specialization</p>
                  <Badge className="bg-indigo-50 text-indigo-700 border-none font-bold">
                    {agent.specialization}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-4xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" /> Identity Verification
              </CardTitle>
              <span className="text-xs font-bold text-slate-400 tracking-tighter">CNIC: {agent.cnic}</span>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["Front", "Back"].map((side) => (
                  <div key={side} className="space-y-3">
                    <p className="text-xs font-bold text-slate-500">CNIC {side} View</p>
                    <div className="group relative rounded-2xl overflow-hidden border-2 border-slate-100 h-48 bg-slate-100">
                      <Image
                        src={side === "Front" ? agent.cnicFrontUrl : agent.cnicBackUrl}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={`CNIC ${side}`}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Button
                          variant="secondary" size="sm"
                          onClick={() => window.open(side === "Front" ? agent.cnicFrontUrl : agent.cnicBackUrl)}
                        >
                          View Full
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── STATUS DIALOG ───────────────────────────────────────────────── */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent className="bg-white rounded-3xl sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900 font-black">
              Update to {tempStatus?.toUpperCase()}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Please provide a reason for this account status change.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder={`Enter ${tempStatus} reason...`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="rounded-xl border-slate-200 min-h-30 focus:ring-indigo-500/10"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowStatusModal(false)}
              className="rounded-xl font-bold"
            >
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
              onClick={confirmStatusUpdate}
              disabled={!reason.trim() || !!updatingField}
            >
              Confirm Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default AgentDetailsPage;