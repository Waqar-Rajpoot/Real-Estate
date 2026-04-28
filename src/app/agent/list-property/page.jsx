"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/schemas/property.schema";
import PropertyMapPicker from "@/components/PropertyMapPicker";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import FileUpload from "@/components/common/FileUpload";
import axios from "axios";
import {
  Info, Home, MapPin, DollarSign, Star, Camera,
  Building2, Layers, FileText, Shield, TrendingUp, Loader2, X, Rocket
} from "lucide-react";


// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const PROPERTY_TYPES = {
  Residential: ["House","Apartment","Upper Portion","Lower Portion","Penthouse","Farm House","Room","Annexe","Townhouse","Villa"],
  Plots: ["Residential Plot","Commercial Plot","Agricultural Land","Industrial Plot","Plot File"],
  Commercial: ["Office","Shop","Building","Warehouse","Factory","Showroom","Labour Camp","Bulk Unit","Industrial Land","Mixed Use Land","Hotel Apartment","Other Commercial"],
};

const SECTIONS  = [
  { id: "sec-purpose",   label: "Purpose & Type" },
  { id: "sec-area",      label: "Area & Rooms" },
  { id: "sec-location",  label: "Location" },
  { id: "sec-pricing",   label: "Pricing" },
  { id: "sec-amenities", label: "Amenities" },
  { id: "sec-media",     label: "Media" },
  { id: "sec-legal",     label: "Legal" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const ICON_COLORS = {
  blue:   "bg-blue-50 text-blue-700",
  green:  "bg-green-50 text-green-700",
  amber:  "bg-amber-50 text-amber-700",
  purple: "bg-purple-50 text-purple-700",
  teal:   "bg-teal-50 text-teal-700",
  red:    "bg-red-50 text-red-700",
};

function SecHeader({ icon: Icon, title, subtitle, color = "blue" }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${ICON_COLORS[color]}`}>
        <Icon size={18} />
      </div>
      <div>
        <h3 className="font-semibold text-[#0b1c3c] text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function NumStepper({ label, value, onChange, min = 0 }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden w-fit">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))}
          className="w-9 h-9 bg-slate-50 hover:bg-blue-50 text-blue-700 font-bold text-lg flex items-center justify-center border-r border-slate-200 transition-colors">−</button>
        <span className="w-10 text-center font-semibold text-sm text-slate-800">{value}</span>
        <button type="button" onClick={() => onChange(value + 1)}
          className="w-9 h-9 bg-slate-50 hover:bg-blue-50 text-blue-700 font-bold text-lg flex items-center justify-center border-l border-slate-200 transition-colors">+</button>
      </div>
    </div>
  );
}

function CheckItem({ label, checked, onCheckedChange }) {
  return (
    <label className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all text-sm select-none ${checked ? "border-blue-400 bg-blue-50 text-blue-800 font-medium" : "border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-slate-50"}`}>
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} className="border-slate-400" />
      {label}
    </label>
  );
}

function formatPKR(val) {
  if (!val || isNaN(val)) return "";
  const n = Number(val);
  if (n >= 10_000_000) return `PKR ${(n / 10_000_000).toFixed(2)} Crore`;
  if (n >= 100_000)    return `PKR ${(n / 100_000).toFixed(2)} Lac`;
  return `PKR ${n.toLocaleString()}`;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function PostListingForm() {
  const [titleDeedFile,          setTitleDeedFile]          = useState(null);
  const [nocFile,                setNocFile]                = useState(null);
  const [marketingContractFile,  setMarketingContractFile]  = useState(null);
  const [isSubmitting,           setIsSubmitting]           = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purpose: "For Sale", category: "Residential", propertyType: "House",
      title: "", description: "",
      completionStatus: "Ready", furnishingStatus: "Unfurnished",
      occupancyStatus: "Vacant", condition: "New", facing: "North", age: 0,
      area: "", areaUnit: "Marla", marlaSize: 225,
      bedrooms: 0, bathrooms: 0, parkingSpaces: 0, floors: 0, floorNumber: 0,
      kitchens: 0, servantRooms: 0, storeRooms: 0, drawingRooms: 0, diningRooms: 0,
      developerName: "", projectName: "", expectedHandoverDate: "", constructionProgress: 0, projectStatus: "Under Construction", downPaymentPercentage: 0,
      city: "", community: "", area_loc: "", subCommunity: "", phase: "",
      block: "", building: "", nearbyLandmarks: "", address: "",
      latitude: 0, longitude: 0, mapEmbedUrl: "",
      price: "", currency: "PKR", priceLabel: "Fixed",
      isNegotiable: false, isOnInstalments: false, possessionPaid: false,
      boostLevel: "None", expiresAt: "",
      hasSwimmingPool: false, hasGym: false, hasCentralAC: false,
      hasBalcony: false, hasMaidRoom: false, hasStudyRoom: false,
      hasCoveredParking: false, hasBuiltInWardrobes: false, hasCCTV: false,
      hasMosque: false, gasAvailable: false, isCorner: false,
      hasElectricityBackup: false, hasWasteDisposal: false, hasBroadbandInternet: false,
      isWaterFront: false, isBoundaryWall: false,
      isRunningBusiness: false, hasBasement: false, hasLift: false,
      images: [], videoUrl: "", virtualTourUrl: "",
      ownerName: "", ownerCNIC: "", ownerEmail: "", ownerPhone: "",
      marketingContract: "", isPostHandoverAvailable: false,
      metaTitle: "", metaDescription: "",
    },
    mode: "onSubmit",
  });


  const handleMapUpdate = (data) => {
    form.setValue("city", data.city || "");
    form.setValue("community", data.community || "");
    form.setValue("subCommunity", data.subCommunity || "");
    form.setValue("address", data.formattedAddress || "");
    form.setValue("latitude", data.lat);
    form.setValue("longitude", data.lng);
    if(data.googlePlaceId) form.setValue("googlePlaceId", data.googlePlaceId);
  };

  const watchCategory     = form.watch("category");
  const watchAreaUnit     = form.watch("areaUnit");
  const watchPurpose      = form.watch("purpose");
  const watchCompStatus   = form.watch("completionStatus");
  const watchIsInstalment = form.watch("isOnInstalments");
  const watchPrice        = form.watch("price");
  const watchArea         = form.watch("area");
  const watchMarlaSize    = form.watch("marlaSize");
  const currentImages     = form.watch("images") || [];

  const isPlot       = watchCategory === "Plots";
  const isCommercial = watchCategory === "Commercial";
  const isOffPlan    = watchCompStatus === "Off-plan";
  const isRent       = watchPurpose === "For Rent";

  const areaHint = (() => {
    const a = parseFloat(watchArea) || 0;
    const ms = parseFloat(watchMarlaSize) || 225;
    if (!a) return "";
    if (watchAreaUnit === "Marla") return `≈ ${Math.round(a * ms).toLocaleString()} sq.ft`;
    if (watchAreaUnit === "Kanal") return `≈ ${Math.round(a * ms * 20).toLocaleString()} sq.ft`;
    if (watchAreaUnit === "Sqyd")  return `≈ ${Math.round(a * 9).toLocaleString()} sq.ft`;
    if (watchAreaUnit === "Sqm")   return `≈ ${Math.round(a * 10.764).toLocaleString()} sq.ft`;
    return "";
  })();

  // ── image handlers ──────────────────────────────────────────────────────────
  const handleImageSuccess = (url) => {
    form.setValue("images", [...currentImages, url], { shouldValidate: true });
  };
  const handleRemoveImage = (i) => {
    form.setValue("images", currentImages.filter((_, idx) => idx !== i), { shouldValidate: true });
  };

  async function onSubmit(values) {
  try {
    setIsSubmitting(true);

    const payload = {
      ...values,
      location: {
        city: values.city,
        community: values.community,
        area: values.area_loc,
        subCommunity: values.subCommunity,
        phase: values.phase,
        block: values.block,
        building: values.building,
        address: values.address,
        formattedAddress: values.address, 
        googlePlaceId: values.googlePlaceId,
        mapZoom: 16, 
        nearbyLandmarks: values.nearbyLandmarks ? [values.nearbyLandmarks] : [],
        
        coordinates: values.latitude && values.longitude
          ? {
              type: "Point",
              coordinates: [
                parseFloat(values.longitude),
                parseFloat(values.latitude)
              ]
            }
          : undefined,
        mapEmbedUrl: values.mapEmbedUrl,
      },
      features: {
        hasSwimmingPool: values.hasSwimmingPool,
        hasGym: values.hasGym,
        hasCentralAC: values.hasCentralAC,
        hasBalcony: values.hasBalcony,
        hasMaidRoom: values.hasMaidRoom,
        hasStudyRoom: values.hasStudyRoom,
        hasCoveredParking: values.hasCoveredParking,
        hasBuiltInWardrobes: values.hasBuiltInWardrobes,
        hasCCTV: values.hasCCTV,
        hasMosque: values.hasMosque,
        gasAvailable: values.gasAvailable,
        isCorner: values.isCorner,
        hasElectricityBackup: values.hasElectricityBackup,
        hasWasteDisposal: values.hasWasteDisposal,
        hasBroadbandInternet: values.hasBroadbandInternet,
        isWaterFront: values.isWaterFront,
        isBoundaryWall: values.isBoundaryWall,
      },
      commercialDetails: {
        isRunningBusiness: values.isRunningBusiness,
        hasBasement: values.hasBasement,
        hasLift: values.hasLift,
      },
      paymentStatus: {
        isOnInstalments: values.isOnInstalments,
        possessionPaid: values.possessionPaid,
        downPayment: values.downPayment,
        instalmentPeriodMonths: values.instalmentPeriodMonths,
        monthlyInstalment: values.monthlyInstalment,
        membershipFee: values.membershipFee,
      },
      legal: {
        ownerName: values.ownerName,
        ownerCNIC: values.ownerCNIC,
        ownerEmail: values.ownerEmail,
        ownerPhone: values.ownerPhone,
        marketingContract: values.marketingContract,
      },
      offPlanDetails: isOffPlan ? {
        developerName: values.developerName,
        projectName: values.projectName,
        expectedHandoverDate: values.expectedHandoverDate,
        constructionProgress: values.constructionProgress,
        projectStatus: values.projectStatus,
        paymentPlan: {
          downPaymentPercentage: values.downPaymentPercentage,
          isPostHandoverAvailable: values.isPostHandoverAvailable,
        },
      } : undefined,
      seo: { 
        metaTitle: values.metaTitle, 
        metaDescription: values.metaDescription 
      },
    };

    const response = await axios.post("/api/agent/properties/register", payload);
    
    if (response.status === 201 || response.status === 200) {
      toast.success("Property submitted successfully! Pending admin approval.");
      form.reset();
    } else {
      toast.error("Submission failed. Please try again.");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Submission failed. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
}


  function onInvalid(errors) {
    const firstKey = Object.keys(errors)[0];
    const el = document.querySelector(`[name="${firstKey}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    toast.error("Please fix the highlighted errors before submitting.");
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-slate-100 min-h-screen text-slate-900">

      {/* PAGE HEADER */}
      

      {/* STICKY SECTION JUMP NAV */}
      <div className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex overflow-x-auto scrollbar-none justify-center">
          {SECTIONS.map(({ id, label }) => (
            <button key={id} type="button"
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="px-4 py-3.5 text-xs font-semibold whitespace-nowrap text-slate-500 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-500 transition-all shrink-0">
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── FORM ─────────────────────────────────────────────────────────────── */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-6">

          {/* ══ 1. PURPOSE & TYPE ══════════════════════════════════════════════ */}
          <div id="sec-purpose" className="scroll-mt-20">
            <Card className="shadow-sm border-slate-100">
              <CardContent className="pt-6">
                <SecHeader icon={Home} title="Purpose & Property Type" subtitle="What are you listing?" color="blue" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <FormField control={form.control} name="purpose" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Purpose <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-3 mt-1">
                          {["For Sale","For Rent"].map((v) => (
                            <label key={v} className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg cursor-pointer transition-all text-sm font-medium select-none ${field.value === v ? "border-blue-500 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-600 hover:border-blue-200"}`}>
                              <RadioGroupItem value={v} className="sr-only" />{v}
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-2 mt-1 flex-wrap">
                          {["Residential","Plots","Commercial"].map((v) => (
                            <label key={v} className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg cursor-pointer transition-all text-sm font-medium select-none ${field.value === v ? "border-blue-500 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-600 hover:border-blue-200"}`}>
                              <RadioGroupItem value={v} className="sr-only" />{v}
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="propertyType" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Property Type <span className="text-red-500">*</span></FormLabel>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {(PROPERTY_TYPES[watchCategory] || []).map((t) => (
                        <button key={t} type="button"
                          className={`px-3 py-1.5 rounded-full border text-sm transition-all ${field.value === t ? "border-blue-500 bg-blue-600 text-white font-medium" : "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50"}`}
                          onClick={() => field.onChange(t)}>{t}</button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />

                <Separator className="my-5 bg-slate-100" />

                {/* Title & Description */}
                <SecHeader icon={FileText} title="Listing Content" subtitle="Title and description visible to buyers" color="amber" />
                <div className="space-y-4 mb-5">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Listing Title <span className="text-red-500">*</span></FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. 10 Marla Modern House for Sale in DHA Phase 5" maxLength={150} className="border-slate-200" /></FormControl>
                      <div className="text-xs text-slate-400">{(field.value||"").length} / 150</div>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description <span className="text-red-500">*</span></FormLabel>
                      <FormControl><Textarea {...field} placeholder="Describe your property in detail..." maxLength={5000} className="min-h-[120px] border-slate-200 leading-relaxed" /></FormControl>
                      <div className="text-xs text-slate-400">{(field.value||"").length} / 5000</div>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <Separator className="my-5 bg-slate-100" />

                {/* Status */}
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Property Status</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[
                    { name:"completionStatus", label:"Completion", required:true, opts:["Ready","Off-plan"] },
                    { name:"furnishingStatus",  label:"Furnishing",  opts:["Unfurnished","Furnished","Partly Furnished"] },
                    { name:"occupancyStatus",   label:"Occupancy",   opts:["Vacant","Tenanted"] },
                    { name:"condition",         label:"Condition",   opts:["New","Good","Needs Renovation"] },
                  ].map(({ name, label, required, opts }) => (
                    <FormField key={name} control={form.control} name={name} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          {label}{required && <span className="text-red-500 ml-1">*</span>}
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="border-slate-200"><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent className="bg-white">{opts.map(v=><SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField control={form.control} name="facing" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Facing</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="border-slate-200"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent className="bg-white">{["North","South","East","West","North-East","North-West","South-East","South-West"].map(v=><SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Age (Years)</FormLabel>
                      <FormControl><Input type="number" {...field} placeholder="e.g. 5" className="border-slate-200" /></FormControl>
                    </FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ══ 2. AREA & ROOMS ════════════════════════════════════════════════ */}
          <div id="sec-area" className="scroll-mt-20">
            <Card className="shadow-sm border-slate-100">
              <CardContent className="pt-6">
                <SecHeader icon={Layers} title="Area & Rooms" subtitle="Specify the size and room count" color="green" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <FormField control={form.control} name="area" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Area <span className="text-red-500">*</span></FormLabel>
                      <FormControl><Input type="number" {...field} placeholder="e.g. 10" className="border-slate-200" /></FormControl>
                      {areaHint && <div className="text-xs text-blue-600 font-medium mt-1">{areaHint}</div>}
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="areaUnit" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Unit <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="border-slate-200"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-white">{["Marla","Kanal","Sqft","Sqyd","Sqm","Acre"].map(v=><SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                  {(watchAreaUnit === "Marla" || watchAreaUnit === "Kanal") && (
                    <FormField control={form.control} name="marlaSize" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">Marla Size <Info size={12} className="text-blue-500" /></FormLabel>
                        <Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value)}>
                          <SelectTrigger className="border-slate-200"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="225">225 Sq.ft (Standard)</SelectItem>
                            <SelectItem value="250">250 Sq.ft</SelectItem>
                            <SelectItem value="272.25">272.25 Sq.ft</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  )}
                </div>

                {!isPlot && (
                  <>
                    <Separator className="my-5 bg-slate-100" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Rooms</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
                      {[["bedrooms","Bedrooms"],["bathrooms","Bathrooms"],["kitchens","Kitchens"],["servantRooms","Servant"],["storeRooms","Store"],["drawingRooms","Drawing"],["diningRooms","Dining"],["floors","Floors"],["floorNumber","Floor No."],["parkingSpaces","Parking"]].map(([key, label]) => (
                        <Controller key={key} control={form.control} name={key}
                          render={({ field }) => <NumStepper label={label} value={field.value || 0} onChange={field.onChange} />} />
                      ))}
                    </div>
                  </>
                )}

                {isCommercial && (
                  <>
                    <Separator className="my-5 bg-slate-100" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Commercial Specifics</p>
                    <div className="flex flex-wrap gap-3">
                      {[["isRunningBusiness","Running Business"],["hasBasement","Has Basement"],["hasLift","Has Lift / Elevator"]].map(([key, label]) => (
                        <Controller key={key} control={form.control} name={key}
                          render={({ field }) => <CheckItem label={label} checked={field.value} onCheckedChange={field.onChange} />} />
                      ))}
                    </div>
                  </>
                )}

                {isOffPlan && (
                  <>
                    <Separator className="my-5 bg-slate-100" />
                    <SecHeader icon={TrendingUp} title="Off-Plan Details" subtitle="Developer and project information" color="amber" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {[["developerName","Developer Name","e.g. Bahria Town"],["projectName","Project Name","e.g. Precinct 12"]].map(([name,label,ph]) => (
                        <FormField key={name} control={form.control} name={name} render={({ field }) => (
                          <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</FormLabel>
                            <FormControl><Input {...field} placeholder={ph} className="border-slate-200" /></FormControl></FormItem>
                        )} />
                      ))}
                      <FormField control={form.control} name="expectedHandoverDate" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Expected Handover</FormLabel>
                          <FormControl><Input type="date" {...field} className="border-slate-200" /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="projectStatus" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="border-slate-200"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent className="bg-white">{["Under Construction","Finishing Stages","Completed"].map(v=><SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                          </Select></FormItem>
                      )} />
                      <FormField control={form.control} name="constructionProgress" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Construction %</FormLabel>
                          <FormControl><Input type="number" min={0} max={100} {...field} placeholder="0–100" className="border-slate-200" /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="downPaymentPercentage" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Down Payment %</FormLabel>
                          <FormControl><Input type="number" min={0} max={100} {...field} placeholder="e.g. 20" className="border-slate-200" /></FormControl></FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="isPostHandoverAvailable" render={({ field }) => (
                      <CheckItem label="Post-Handover Payment Available" checked={field.value} onCheckedChange={field.onChange} />
                    )} />
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ══ 3. LOCATION ════════════════════════════════════════════════════ */}
          <div id="sec-location" className="scroll-mt-20">
  <Card className="shadow-sm border-slate-100">
    <CardContent className="pt-6">
      <SecHeader 
        icon={MapPin} 
        title="Location & Address" 
        subtitle="Search for a location or drop a pin on the map for precision" 
        color="blue" 
      />

      {/* 1. THE DYNAMIC MAP PICKER */}
      <div className="mb-6">
        <PropertyMapPicker 
          onLocationChange={handleMapUpdate}
          defaultLocation={form.getValues("latitude") ? {
            lat: form.getValues("latitude"),
            lng: form.getValues("longitude")
          } : null}
        />
      </div>

      <Separator className="my-6 bg-slate-100" />

      {/* 2. PRIMARY LOCATION FIELDS (Auto-filled by Map) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormField control={form.control} name="city" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">City <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input {...field} readOnly className="bg-slate-50 border-slate-200 cursor-not-allowed font-medium" placeholder="Detected from map..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="community" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Society / Community <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g. DHA Phase 6, Bahria Town" className="border-slate-200" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* 3. SUB-LOCATION DETAILS (Dynamic Mapping) */}
        {[
          ["area_loc", "Area / Sub-area", "e.g. Gulberg III"],
          ["subCommunity", "Sub-community", "e.g. Sector F-7"],
          ["phase", "Phase / Sector", "e.g. Phase 6"],
          ["block", "Block", "e.g. Block B"],
          ["building", "Building / Tower", "e.g. Centaurus Tower A"],
          ["nearbyLandmarks", "Nearby Landmark", "e.g. Near Packages Mall"]
        ].map(([name, label, ph]) => (
          <FormField key={name} control={form.control} name={name} render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={ph} className="border-slate-200" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        ))}
      </div>

      {/* 4. FULL ADDRESS & EMBED URL */}
      <div className="space-y-4">
        <FormField control={form.control} name="address" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Full Standardized Address</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                readOnly 
                className="border-slate-200 min-h-17.5 bg-slate-50 italic text-slate-600" 
                placeholder="Full address will be generated from map selection..." 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="mapEmbedUrl" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Google Maps Embed URL (Optional)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://www.google.com/maps/embed?pb=..." className="border-slate-200" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      {/* 5. COORDINATES FOOTER */}
      <div className="mt-6 flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live GPS Feed</span>
        </div>
        <div className="flex gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-slate-400 uppercase font-bold">Latitude</span>
            <span className="text-xs font-mono font-semibold text-blue-600">{form.watch("latitude") || "0.000000"}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-slate-400 uppercase font-bold">Longitude</span>
            <span className="text-xs font-mono font-semibold text-blue-600">{form.watch("longitude") || "0.000000"}</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</div>

          {/* ══ 4. PRICING ═════════════════════════════════════════════════════ */}
          <div id="sec-pricing" className="scroll-mt-20">
            <Card className="shadow-sm border-slate-100">
              <CardContent className="pt-6">
                <SecHeader icon={DollarSign} title="Pricing & Payment" subtitle="Set your listing price and payment terms" color="green" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Price <span className="text-red-500">*</span></FormLabel>
                      <FormControl><Input type="number" {...field} placeholder="e.g. 35000000" className="border-slate-200" /></FormControl>
                      {watchPrice && <div className="text-sm font-semibold text-green-700 mt-1">{formatPKR(watchPrice)}</div>}
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="currency" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Currency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="border-slate-200"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-white">{["PKR","AED","USD"].map(v=><SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <FormField control={form.control} name="priceLabel" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Price Label</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="border-slate-200"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-white">{["Fixed","Starting From","Price on Call"].map(v=><SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                  {isRent && (
                    <FormField control={form.control} name="rentFrequency" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rent Frequency <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="border-slate-200"><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent className="bg-white">{["Daily","Weekly","Monthly","Yearly"].map(v=><SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  )}
                  <FormField control={form.control} name="boostLevel" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Listing Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="border-slate-200"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="None">Basic Listing</SelectItem>
                          <SelectItem value="Standard">Hot (+400% exposure)</SelectItem>
                          <SelectItem value="Premium">Super Hot (+2000%)</SelectItem>
                          <SelectItem value="Platinum">Platinum</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="expiresAt" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Listing Expiry</FormLabel>
                      <FormControl><Input type="date" {...field} className="border-slate-200" /></FormControl>
                    </FormItem>
                  )} />
                </div>
                <div className="flex flex-wrap gap-3 mb-4">
                  {[["isNegotiable","Price is Negotiable"],["isOnInstalments","Instalment Plan Available"],["possessionPaid","Possession Paid"]].map(([key,label]) => (
                    <FormField key={key} control={form.control} name={key} render={({ field }) => (
                      <CheckItem label={label} checked={field.value} onCheckedChange={field.onChange} />
                    )} />
                  ))}
                </div>
                {watchIsInstalment && (
                  <>
                    <Separator className="my-4 bg-slate-100" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Instalment Plan Details</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[["downPayment","Down Payment (PKR)","e.g. 5000000"],["monthlyInstalment","Monthly Instalment","e.g. 150000"],["instalmentPeriodMonths","No. of Months","e.g. 60"],["membershipFee","Membership Fee","e.g. 100000"]].map(([name,label,ph]) => (
                        <FormField key={name} control={form.control} name={name} render={({ field }) => (
                          <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</FormLabel>
                            <FormControl><Input type="number" {...field} placeholder={ph} className="border-slate-200" /></FormControl></FormItem>
                        )} />
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ══ 5. AMENITIES ═══════════════════════════════════════════════════ */}
          <div id="sec-amenities" className="scroll-mt-20 space-y-4">
            {[
              { icon: Star,     title: "Utilities",                    color: "purple",
                items: [["gasAvailable","Gas Available"],["hasElectricityBackup","Electricity Backup"],["hasBroadbandInternet","Broadband Internet"],["hasWasteDisposal","Waste Disposal"]] },
              { icon: Building2, title: "Construction & Plot Features", color: "blue",
                items: [["isCorner","Corner Property"],["isBoundaryWall","Boundary Wall"],["isWaterFront","Waterfront"]] },
              { icon: Home,     title: "Indoor Facilities",             color: "teal",
                items: [["hasSwimmingPool","Swimming Pool"],["hasGym","Gym / Fitness"],["hasCentralAC","Central AC"],["hasBalcony","Balcony / Terrace"],["hasMaidRoom","Maid Room"],["hasStudyRoom","Study Room"],["hasCoveredParking","Covered Parking"],["hasBuiltInWardrobes","Built-in Wardrobes"],["hasMosque","Mosque / Prayer Room"]] },
              { icon: Shield,   title: "Security",                      color: "red",
                items: [["hasCCTV","CCTV Cameras"]] },
            ].map(({ icon: Ico, title, color, items }) => (
              <Card key={title} className="shadow-sm border-slate-100">
                <CardContent className="pt-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${ICON_COLORS[color]}`}>
                      {React.createElement(Ico, { size: 14 })}
                    </div>
                    <span className="font-semibold text-[#0b1c3c] text-xs uppercase tracking-wide">{title}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {items.map(([key, label]) => (
                      <Controller key={key} control={form.control} name={key}
                        render={({ field }) => <CheckItem label={label} checked={field.value} onCheckedChange={field.onChange} />} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ══ 6. MEDIA ════════════════════════════════════════════════════════ */}
          <div id="sec-media" className="scroll-mt-20">
            <Card className="shadow-sm border-slate-100">
              <CardContent className="pt-6">
                <SecHeader icon={Camera} title="Photos & Media" subtitle="Upload 8–16 high-quality images (required)" color="blue" />

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-3">
                  {currentImages.map((url, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden border-2 border-slate-200">
                      <img src={url} className="w-full h-full object-cover" alt={`Property ${index}`} />
                      <button type="button" onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 shadow hover:bg-red-600">
                        <X size={12} />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">COVER</span>
                      )}
                    </div>
                  ))}
                  {currentImages.length < 16 && (
                    <div className="aspect-video">
                      <FileUpload
                        key={`uploader-${currentImages.length}`}
                        label={`Photo ${currentImages.length + 1}`}
                        folder="properties/gallery"
                        onUploadSuccess={handleImageSuccess}
                        onRemove={() => {}}
                      />
                    </div>
                  )}
                </div>
                {form.formState.errors.images && (
                  <p className="text-red-500 text-xs mb-3 font-medium">{form.formState.errors.images.message}</p>
                )}
                <p className="text-xs text-slate-500 bg-blue-50 p-2 rounded border border-blue-100 mb-5">
                  <strong>Tip:</strong> First photo is your cover. Min 8, max 16 photos required.
                </p>

                <Separator className="my-4 bg-slate-100" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Video & Virtual Tour (Optional)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="videoUrl" render={({ field }) => (
                    <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">YouTube / Vimeo Link</FormLabel>
                      <FormControl><Input {...field} placeholder="https://youtube.com/watch?v=..." className="border-slate-200" /></FormControl>
                      <FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="virtualTourUrl" render={({ field }) => (
                    <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">360° Virtual Tour URL</FormLabel>
                      <FormControl><Input {...field} placeholder="https://..." className="border-slate-200" /></FormControl>
                      <FormMessage /></FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ══ 7. LEGAL ════════════════════════════════════════════════════════ */}
          <div id="sec-legal" className="scroll-mt-20">
            <Card className="shadow-sm border-red-100 bg-red-50/20">
              <CardContent className="pt-6">
                <SecHeader icon={Shield} title="Legal & Compliance" subtitle="Required for listing approval — kept confidential" color="red" />
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 flex gap-2.5 items-start">
                  <Info size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-800 leading-relaxed">This information is for verification only and will not be displayed publicly.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <FormField control={form.control} name="ownerName" render={({ field }) => (
                    <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Owner / Seller Name</FormLabel>
                      <FormControl><Input {...field} placeholder="Full legal name" className="border-slate-200 bg-white" /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="ownerCNIC" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Owner CNIC <span className="text-red-500">*</span></FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. 3520112345671" maxLength={15} className="border-slate-200 bg-white" /></FormControl>
                      <FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="ownerEmail" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Owner Email <span className="text-red-500">*</span></FormLabel>
                      <FormControl><Input type="email" {...field} placeholder="owner@email.com" className="border-slate-200 bg-white" /></FormControl>
                      <FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="ownerPhone" render={({ field }) => (
                    <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Owner Phone</FormLabel>
                      <FormControl><Input {...field} placeholder="+92 3XX XXXXXXX" className="border-slate-200 bg-white" /></FormControl></FormItem>
                  )} />
                </div>

                <Separator className="my-4 bg-slate-100" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Document Uploads</p>
                <div className="space-y-3 mb-5">
                  {[
                    ["Marketing Contract (Required)", marketingContractFile, setMarketingContractFile, true],
                    ["Title Deed / Registry",         titleDeedFile,         setTitleDeedFile,         false],
                    ["NOC / Approval Letter",         nocFile,               setNocFile,               false],
                  ].map(([label, file, setter, required]) => (
                    <div key={label}
                      className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer bg-white"
                      onClick={() => {
                        const el = document.createElement("input");
                        el.type = "file"; el.accept = ".pdf,image/*";
                        el.onchange = (e) => {
                          setter(e.target.files[0]);
                          if (label.includes("Marketing")) form.setValue("marketingContract", e.target.files[0]?.name || "");
                        };
                        el.click();
                      }}>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <span>📜</span>
                        <span>{label}{required && <span className="text-red-500 ml-1">*</span>}</span>
                      </div>
                      {file
                        ? <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 text-xs">{file.name.slice(0,20)}</Badge>
                        : <span className="text-xs text-blue-500 font-medium">Upload</span>}
                    </div>
                  ))}
                </div>

                <Separator className="my-4 bg-slate-100" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">SEO (Optional)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="metaTitle" render={({ field }) => (
                    <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Meta Title (max 70)</FormLabel>
                      <FormControl><Input {...field} maxLength={70} className="border-slate-200 bg-white" /></FormControl>
                      <div className="text-xs text-slate-400">{(field.value||"").length}/70</div></FormItem>
                  )} />
                  <FormField control={form.control} name="metaDescription" render={({ field }) => (
                    <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Meta Description (max 160)</FormLabel>
                      <FormControl><Textarea {...field} maxLength={160} className="border-slate-200 bg-white min-h-[60px]" /></FormControl>
                      <div className="text-xs text-slate-400">{(field.value||"").length}/160</div></FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ══ SUBMIT ══════════════════════════════════════════════════════════ */}
          <div className="flex justify-end pb-10 pt-2">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="h-16 px-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black text-lg uppercase tracking-wider rounded-[2rem] shadow-xl shadow-indigo-200/50 transition-all duration-300 hover:scale-[1.03] active:scale-95 flex items-center gap-3 disabled:opacity-70 disabled:grayscale"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Submit Property</span>
                  <Rocket size={22} className="fill-white/20" />
                </>
              )}
            </Button>
</div>

        </form>
      </Form>
    </div>
  );
}