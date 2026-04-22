"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  Info,
  Home,
  MapPin,
  DollarSign,
  Star,
  Camera,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Building2,
  Layers,
  FileText,
  Shield,
  TrendingUp,
  Loader2,
  X,
} from "lucide-react";

// ─── ZOD SCHEMA ───────────────────────────────────────────────────────────────
// const formSchema = z.object({
//   // Step 1 – Property Details
//   purpose: z.enum(["For Sale", "For Rent"]),
//   category: z.enum(["Residential", "Commercial", "Plots"]),
//   propertyType: z.string().min(1, "Property type is required"),
//   title: z.string().min(10, "Title must be at least 10 characters").max(150),
//   description: z.string().min(30, "Description must be at least 30 characters").max(5000),
//   facing: z.enum(["North","South","East","West","North-East","North-West","South-East","South-West"]).optional(),
//   completionStatus: z.enum(["Off-plan", "Ready"]),
//   condition: z.enum(["New", "Good", "Needs Renovation"]).optional(),
//   furnishingStatus: z.enum(["Furnished", "Unfurnished", "Partly Furnished"]).optional(),
//   occupancyStatus: z.enum(["Vacant", "Tenanted"]).optional(),
//   age: z.coerce.number().min(0).optional(),

//   // Step 2 – Area Details
//   area: z.coerce.number().positive("Area is required"),
//   areaUnit: z.enum(["Sqft", "Sqm", "Marla", "Kanal", "Acre", "Sqyd"]),
//   marlaSize: z.coerce.number().optional(),
//   bedrooms: z.coerce.number().min(0).default(0),
//   bathrooms: z.coerce.number().min(0).default(0),
//   parkingSpaces: z.coerce.number().min(0).default(0),
//   floors: z.coerce.number().min(0).optional(),
//   floorNumber: z.coerce.number().min(0).optional(),
//   kitchens: z.coerce.number().min(0).default(1),
//   servantRooms: z.coerce.number().min(0).default(0),
//   storeRooms: z.coerce.number().min(0).default(0),
//   drawingRooms: z.coerce.number().min(0).default(1),
//   diningRooms: z.coerce.number().min(0).default(1),

//   // Step 3 – Location
//   city: z.string().min(1, "City is required"),
//   community: z.string().min(1, "Location/Society is required"),
//   area_loc: z.string().optional(),
//   subCommunity: z.string().optional(),
//   phase: z.string().optional(),
//   block: z.string().optional(),
//   building: z.string().optional(),
//   address: z.string().optional(),
//   nearbyLandmarks: z.string().optional(),
//   latitude: z.coerce.number().optional(),
//   longitude: z.coerce.number().optional(),
//   mapEmbedUrl: z.string().optional(),

//   // Step 4 – Pricing
//   price: z.coerce.number().positive("Price is required"),
//   currency: z.enum(["PKR", "AED", "USD"]).default("PKR"),
//   priceLabel: z.enum(["Fixed", "Starting From", "Price on Call"]).default("Fixed"),
//   isNegotiable: z.boolean().default(false),
//   rentFrequency: z.enum(["Daily", "Weekly", "Monthly", "Yearly"]).optional(),
//   isOnInstalments: z.boolean().default(false),
//   possessionPaid: z.boolean().default(false),
//   downPayment: z.coerce.number().optional(),
//   instalmentPeriodMonths: z.coerce.number().optional(),
//   monthlyInstalment: z.coerce.number().optional(),
//   membershipFee: z.coerce.number().optional(),
//   boostLevel: z.enum(["None", "Standard", "Premium", "Platinum"]).default("None"),
//   expiresAt: z.string().optional(),

//   // Step 5 – Amenities & Features
//   hasSwimmingPool: z.boolean().default(false),
//   hasGym: z.boolean().default(false),
//   hasCentralAC: z.boolean().default(false),
//   hasBalcony: z.boolean().default(false),
//   hasMaidRoom: z.boolean().default(false),
//   hasStudyRoom: z.boolean().default(false),
//   hasCoveredParking: z.boolean().default(false),
//   hasBuiltInWardrobes: z.boolean().default(false),
//   hasCCTV: z.boolean().default(false),
//   hasMosque: z.boolean().default(false),
//   gasAvailable: z.boolean().default(false),
//   isCorner: z.boolean().default(false),
//   hasElectricityBackup: z.boolean().default(false),
//   hasWasteDisposal: z.boolean().default(false),
//   hasBroadbandInternet: z.boolean().default(false),
//   isWaterFront: z.boolean().default(false),
//   isBoundaryWall: z.boolean().default(false),
//   // Commercial details
//   isRunningBusiness: z.boolean().default(false),
//   hasBasement: z.boolean().default(false),
//   hasLift: z.boolean().default(false),

//   // Step 6 – Media
//   videoUrl: z.string().url().optional().or(z.literal("")),
//   virtualTourUrl: z.string().url().optional().or(z.literal("")),
//   images: z.array(z.string()).min(8, "At least 8 images are required").max(16, "Maximum 16 images allowed"),

//   // Step 7 – Legal & Compliance
//   ownerName: z.string().optional(),
//   ownerCNIC: z.string().min(13, "CNIC must be 13 digits").max(15),
//   ownerEmail: z.string().email("Invalid email"),
//   ownerPhone: z.string().optional(),
//   marketingContract: z.string().min(1, "Marketing contract is required"),

//   // Off-plan details (optional)
//   developerName: z.string().optional(),
//   projectName: z.string().optional(),
//   expectedHandoverDate: z.string().optional(),
//   constructionProgress: z.coerce.number().min(0).max(100).optional(),
//   projectStatus: z.enum(["Under Construction", "Finishing Stages", "Completed"]).optional(),
//   downPaymentPercentage: z.coerce.number().optional(),
//   isPostHandoverAvailable: z.boolean().default(false),

//   // SEO (optional)
//   metaTitle: z.string().max(70).optional(),
//   metaDescription: z.string().max(160).optional(),
// });

const formSchema = z.object({

  // ─── STEP 1: Property Details ─────────────────────────────────────────────
  purpose: z.enum(["For Sale", "For Rent"], {
    required_error: "Purpose is required",
  }),
  category: z.enum(["Residential", "Commercial", "Plots"], {
    required_error: "Category is required",
  }),
  propertyType: z.string().min(1, "Property type is required"),
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(150, "Title cannot exceed 150 characters"),
  description: z
    .string()
    .min(30, "Description must be at least 30 characters")
    .max(5000, "Description cannot exceed 5000 characters"),
  facing: z
    .enum(["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"])
    .optional(),
  completionStatus: z.enum(["Off-plan", "Ready"], {
    required_error: "Completion status is required",
  }),
  condition: z.enum(["New", "Good", "Needs Renovation"]).optional(),
  furnishingStatus: z.enum(["Furnished", "Unfurnished", "Partly Furnished"]).optional(),
  occupancyStatus: z.enum(["Vacant", "Tenanted"]).optional(),
  age: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().min(0, "Age cannot be negative").optional()
  ),

  // ─── STEP 2: Area Details ─────────────────────────────────────────────────
  area: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z
      .number({ invalid_type_error: "Area is required" })
      .positive("Area must be greater than 0")
  ),
  areaUnit: z.enum(["Sqft", "Sqm", "Marla", "Kanal", "Acre", "Sqyd"], {
    required_error: "Unit is required",
  }),
  marlaSize: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().optional()
  ),
  bedrooms: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? 0 : Number(val)),
    z.number().min(0).default(0)
  ),
  bathrooms: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? 0 : Number(val)),
    z.number().min(0).default(0)
  ),
  parkingSpaces: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? 0 : Number(val)),
    z.number().min(0).default(0)
  ),
  floors: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  floorNumber: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  kitchens: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? 1 : Number(val)),
    z.number().min(0).default(1)
  ),
  servantRooms: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? 0 : Number(val)),
    z.number().min(0).default(0)
  ),
  storeRooms: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? 0 : Number(val)),
    z.number().min(0).default(0)
  ),
  drawingRooms: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? 1 : Number(val)),
    z.number().min(0).default(1)
  ),
  diningRooms: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? 1 : Number(val)),
    z.number().min(0).default(1)
  ),

  // ─── STEP 3: Location ─────────────────────────────────────────────────────
  city: z.string().min(1, "City is required"),
  community: z.string().min(1, "Society / Community is required"),
  area_loc: z.string().optional(),
  subCommunity: z.string().optional(),
  phase: z.string().optional(),
  block: z.string().optional(),
  building: z.string().optional(),
  address: z.string().optional(),
  nearbyLandmarks: z.string().optional(),
  latitude: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().optional()
  ),
  longitude: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().optional()
  ),
  mapEmbedUrl: z.string().optional(),

  // ─── STEP 4: Pricing ──────────────────────────────────────────────────────
  price: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z
      .number({ invalid_type_error: "Price is required" })
      .positive("Price must be greater than 0")
  ),
  currency: z.enum(["PKR", "AED", "USD"]).default("PKR"),
  priceLabel: z.enum(["Fixed", "Starting From", "Price on Call"]).default("Fixed"),
  isNegotiable: z.boolean().default(false),
  rentFrequency: z.enum(["Daily", "Weekly", "Monthly", "Yearly"]).optional(),
  isOnInstalments: z.boolean().default(false),
  possessionPaid: z.boolean().default(false),
  downPayment: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().positive().optional()
  ),
  instalmentPeriodMonths: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().positive().optional()
  ),
  monthlyInstalment: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().positive().optional()
  ),
  membershipFee: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().positive().optional()
  ),
  boostLevel: z.enum(["None", "Standard", "Premium", "Platinum"]).default("None"),
  expiresAt: z.string().optional(),

  // ─── STEP 5: Amenities & Features ─────────────────────────────────────────
  hasSwimmingPool:     z.boolean().default(false),
  hasGym:              z.boolean().default(false),
  hasCentralAC:        z.boolean().default(false),
  hasBalcony:          z.boolean().default(false),
  hasMaidRoom:         z.boolean().default(false),
  hasStudyRoom:        z.boolean().default(false),
  hasCoveredParking:   z.boolean().default(false),
  hasBuiltInWardrobes: z.boolean().default(false),
  hasCCTV:             z.boolean().default(false),
  hasMosque:           z.boolean().default(false),
  gasAvailable:        z.boolean().default(false),
  isCorner:            z.boolean().default(false),
  hasElectricityBackup:z.boolean().default(false),
  hasWasteDisposal:    z.boolean().default(false),
  hasBroadbandInternet:z.boolean().default(false),
  isWaterFront:        z.boolean().default(false),
  isBoundaryWall:      z.boolean().default(false),
  isRunningBusiness:   z.boolean().default(false),
  hasBasement:         z.boolean().default(false),
  hasLift:             z.boolean().default(false),

  // ─── STEP 6: Media ────────────────────────────────────────────────────────
  videoUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  virtualTourUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  images: z
    .array(z.string())
    .min(8, "At least 8 images are required")
    .max(16, "Maximum 16 images allowed"),

  // ─── STEP 7: Legal & Compliance ───────────────────────────────────────────
  ownerName: z.string().optional(),
  ownerCNIC: z
    .string()
    .min(13, "CNIC must be at least 13 digits")
    .max(15, "CNIC cannot exceed 15 characters")
    .regex(/^[0-9-]+$/, "CNIC must contain only numbers"),
  ownerEmail: z.string().email("Please enter a valid email address"),
  ownerPhone: z.string().optional(),
  marketingContract: z.string().min(1, "Marketing contract is required"),

  // ─── Off-Plan Details (conditional) ──────────────────────────────────────
  developerName: z.string().optional(),
  projectName: z.string().optional(),
  expectedHandoverDate: z.string().optional(),
  constructionProgress: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().min(0).max(100, "Progress cannot exceed 100%").optional()
  ),
  projectStatus: z
    .enum(["Under Construction", "Finishing Stages", "Completed"])
    .optional(),
  downPaymentPercentage: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().min(0).max(100, "Percentage cannot exceed 100%").optional()
  ),
  isPostHandoverAvailable: z.boolean().default(false),

  // ─── SEO (optional) ───────────────────────────────────────────────────────
  metaTitle: z.string().max(70, "Meta title cannot exceed 70 characters").optional(),
  metaDescription: z.string().max(160, "Meta description cannot exceed 160 characters").optional(),
});
// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const PROPERTY_TYPES = {
  Residential: ["House", "Apartment", "Upper Portion", "Lower Portion", "Penthouse", "Farm House", "Room", "Annexe", "Townhouse", "Villa"],
  Plots: ["Residential Plot", "Commercial Plot", "Agricultural Land", "Industrial Plot", "Plot File"],
  Commercial: ["Office", "Shop", "Building", "Warehouse", "Factory", "Showroom", "Labour Camp", "Bulk Unit", "Industrial Land", "Mixed Use Land", "Hotel Apartment", "Other Commercial"],
};

const PK_CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala",
  "Hyderabad", "Abbottabad", "Bahawalpur", "Sargodha", "Sukkur",
];

const STEPS = [
  { label: "Property Details", icon: Home },
  { label: "Area & Rooms",     icon: Layers },
  { label: "Location",         icon: MapPin },
  { label: "Pricing",          icon: DollarSign },
  { label: "Amenities",        icon: Star },
  { label: "Media",            icon: Camera },
  { label: "Legal",            icon: Shield },
  { label: "Review & Submit",  icon: CheckCircle },
];

// ─── HELPER: NUM STEPPER ──────────────────────────────────────────────────────
function NumStepper({ label, value, onChange, min = 0 }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden w-fit">
        <button
          type="button"
          className="w-9 h-9 bg-slate-50 hover:bg-blue-50 text-blue-700 font-bold text-lg flex items-center justify-center border-r border-slate-200 transition-colors"
          onClick={() => onChange(Math.max(min, value - 1))}
        >−</button>
        <span className="w-10 text-center font-semibold text-sm text-slate-800">{value}</span>
        <button
          type="button"
          className="w-9 h-9 bg-slate-50 hover:bg-blue-50 text-blue-700 font-bold text-lg flex items-center justify-center border-l border-slate-200 transition-colors"
          onClick={() => onChange(value + 1)}
        >+</button>
      </div>
    </div>
  );
}

// ─── HELPER: SECTION HEADER ───────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, subtitle, color = "blue" }) {
  const colors = {
    blue:   "bg-blue-50 text-blue-700",
    green:  "bg-green-50 text-green-700",
    amber:  "bg-amber-50 text-amber-700",
    purple: "bg-purple-50 text-purple-700",
    teal:   "bg-teal-50 text-teal-700",
    red:    "bg-red-50 text-red-700",
  };
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon size={18} />
      </div>
      <div>
        <h3 className="font-semibold text-[#0b1c3c] text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── HELPER: CHECKBOX ITEM ───────────────────────────────────────────────────
function CheckItem({ label, checked, onCheckedChange }) {
  return (
    <label className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all text-sm select-none ${checked ? "border-blue-400 bg-blue-50 text-blue-800 font-medium" : "border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-slate-50"}`}>
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} className="border-slate-400" />
      {label}
    </label>
  );
}

// ─── PRICE FORMATTER ─────────────────────────────────────────────────────────
function formatPKR(val) {
  if (!val || isNaN(val)) return "—";
  const n = Number(val);
  if (n >= 10_000_000) return `PKR ${(n / 10_000_000).toFixed(2)} Crore`;
  if (n >= 100_000)    return `PKR ${(n / 100_000).toFixed(2)} Lac`;
  return `PKR ${n.toLocaleString()}`;
}

// ─── MAIN FORM COMPONENT ──────────────────────────────────────────────────────

const onInvalid = (errors) => {
  console.log("Form Errors:", errors);
};
export default function PostListingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [titleDeedFile, setTitleDeedFile] = useState(null);
  const [nocFile, setNocFile] = useState(null);
  const [marketingContractFile, setMarketingContractFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "", 
      description: "",
      city: "",
      area: undefined,
      price: undefined,
      address: "",
      age: 0,

      condition: "New",
      occupancyStatus: "Vacant",
      furnishingStatus: "Unfurnished",
      facing: "North",

      community: "",
      area_loc: "",
      subCommunity: undefined,
      phase: undefined,
      block: undefined,
      building: undefined,
      nearbyLandmarks: "",
      latitude: undefined,
      longitude: undefined,
      mapEmbedUrl: "",
      expiresAt: "",
      metaTitle: "",
      metaDescription: "",

      purpose: "For Sale",
      category: "Residential",
      propertyType: "House",
      completionStatus: "Ready",
      areaUnit: "Marla",
      marlaSize: 225,
      currency: "PKR",
      priceLabel: "Fixed",
      boostLevel: "None",
      isNegotiable: false,
      isOnInstalments: false,
      possessionPaid: false,
      isPostHandoverAvailable: false,
      bedrooms: 3, bathrooms: 2, parkingSpaces: 2,
      floors: 2, floorNumber: 0,
      kitchens: 1, servantRooms: 0, storeRooms: 0,
      drawingRooms: 1, diningRooms: 1,
      hasSwimmingPool: false, hasGym: false, hasCentralAC: false,
      hasBalcony: false, hasMaidRoom: false, hasStudyRoom: false,
      hasCoveredParking: false, hasBuiltInWardrobes: false,
      hasCCTV: false, hasMosque: false, gasAvailable: false,
      isCorner: false, hasElectricityBackup: false,
      hasWasteDisposal: false, hasBroadbandInternet: false,
      isWaterFront: false, isBoundaryWall: false,
      isRunningBusiness: false, hasBasement: false, hasLift: false,
      ownerName: "",
      ownerCNIC: "",
      ownerEmail: "",
      images: [],
    },
    mode: "onChange",
  });

  const watchCategory      = form.watch("category");
  const watchAreaUnit      = form.watch("areaUnit");
  const watchPurpose       = form.watch("purpose");
  const watchCompStatus    = form.watch("completionStatus");
  const watchIsInstalment  = form.watch("isOnInstalments");
  const watchPrice         = form.watch("price");
  const watchArea          = form.watch("area");
  const watchMarlaSize     = form.watch("marlaSize");

  const watchedAll = form.watch();

  // auto area conversion hint
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

  const isPlot = watchCategory === "Plots";
  const isCommercial = watchCategory === "Commercial";
  const isOffPlan = watchCompStatus === "Off-plan";
  const isRent = watchPurpose === "For Rent";

  async function onSubmit(values) {
    try {
    setIsSubmitting(true);
    console.log("Form Values:", values);
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
          nearbyLandmarks: values.nearbyLandmarks ? [values.nearbyLandmarks] : [],
          coordinates: values.latitude && values.longitude
            ? { type: "Point", coordinates: [values.longitude, values.latitude] }
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
          metaDescription: values.metaDescription,
        },
      };
      console.log("Property payload:", payload);
      const response = await axios.post("/api/agent/properties/register", payload);

    if (response.status === 201 || response.status === 200) {
        toast.success("Property submitted successfully! Pending admin approval.");
        form.reset(); // Clear form after success
    } else {
      toast.error("Submission failed. Please try again.");
    }
    } catch (err) {
    console.error("Submission Error:", err.response?.data || err.message);
    const errorMessage = err.response?.data?.message || "Submission failed. Please try again.";
    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
  }

  const STEP_FIELDS = {
  0: ["purpose", "category", "propertyType", "title", "description", "completionStatus"],
  1: ["area", "areaUnit"],
  2: ["city", "community"],
  3: ["price"],
  4: [], // amenities — all optional
  5: ["images"],
  6: ["ownerCNIC", "ownerEmail", "marketingContract"],
  7: [], // review step
};

async function goNext() {
  const fields = STEP_FIELDS[currentStep] || [];
  const isValid = await form.trigger(fields); // triggers validation ONLY for this step's fields
  if (!isValid) return; // blocks navigation, red messages already shown by FormMessage
  if (currentStep < STEPS.length - 1) setCurrentStep((s) => s + 1);
}
  function goPrev() {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }

  // ─── STEP RENDERERS ──────────────────────────────────────────────────────
  const renderStep0 = () => (
    <>
      {/* Purpose & Category */}
      <Card className="shadow-sm border-slate-100">
        <CardContent className="pt-6">
          <SectionHeader icon={Home} title="Purpose & Category" subtitle="What are you listing?" color="blue" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormField control={form.control} name="purpose" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Purpose <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-3 mt-1">
                    {["For Sale", "For Rent"].map((v) => (
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
                    {["Residential", "Plots", "Commercial"].map((v) => (
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
                    onClick={() => field.onChange(t)}
                  >{t}</button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )} />
        </CardContent>
      </Card>

      {/* Listing Content */}
      <Card className="shadow-sm border-slate-100">
        <CardContent className="pt-6">
          <SectionHeader icon={FileText} title="Listing Content" subtitle="Title and description visible to buyers" color="amber" />
          <div className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Listing Title <span className="text-red-500">*</span></FormLabel>
                <FormControl><Input {...field} placeholder="e.g. 10 Marla Modern House for Sale in DHA Phase 5" maxLength={150} className="border-slate-200" /></FormControl>
                <div className="text-xs text-slate-400">{(field.value || "").length} / 150 characters</div>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description <span className="text-red-500">*</span></FormLabel>
                <FormControl><Textarea {...field} placeholder="Describe your property in detail — location highlights, construction quality, nearby amenities, special features..." maxLength={5000} className="min-h-[130px] border-slate-200 leading-relaxed" /></FormControl>
                <div className="text-xs text-slate-400">{(field.value || "").length} / 5000 characters</div>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>

      {/* Completion & Condition */}
      <Card className="shadow-sm border-slate-100">
        <CardContent className="pt-6">
          <SectionHeader icon={Building2} title="Property Status" subtitle="Completion, furnishing and occupancy" color="teal" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField control={form.control} name="completionStatus" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Completion <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent className="text-slate-900 bg-slate-300"><SelectItem value="Ready">Ready</SelectItem><SelectItem value="Off-plan">Off-plan</SelectItem></SelectContent>
                </Select>
              </FormItem>
            )} />
            <FormField control={form.control} name="furnishingStatus" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Furnishing</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="border-slate-200"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="text-slate-900 bg-slate-300">
                    {["Unfurnished","Furnished","Partly Furnished"].map(v=><SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormItem>
            )} />
            <FormField control={form.control} name="occupancyStatus" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Occupancy</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="border-slate-200"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="text-slate-900 bg-slate-300"><SelectItem value="Vacant">Vacant</SelectItem><SelectItem value="Tenanted">Tenanted</SelectItem></SelectContent>
                </Select>
              </FormItem>
            )} />
            <FormField control={form.control} name="condition" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Condition</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="border-slate-200"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="text-slate-900 bg-slate-300">
                    {["New","Good","Needs Renovation"].map(v=><SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormItem>
            )} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <FormField control={form.control} name="facing" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Facing Direction</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="border-slate-200"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="text-slate-900 bg-slate-300">
                    {["North","South","East","West","North-East","North-West","South-East","South-West"].map(v=><SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormItem>
            )} />
            <FormField control={form.control} name="age" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Property Age (Yrs)</FormLabel>
                <FormControl><Input type="number" {...field} placeholder="e.g. 5" className="border-slate-200" /></FormControl>
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
    </>
  );

  const renderStep1 = () => (
    <>
      {/* Area */}
      <Card className="shadow-sm border-slate-100">
        <CardContent className="pt-6">
          <SectionHeader icon={Layers} title="Area Details" subtitle="Specify the size of the property" color="green" />
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
                  <SelectContent className="text-slate-900 bg-slate-300">
                    {["Marla","Kanal","Sqft","Sqyd","Sqm","Acre"].map(v=><SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormItem>
            )} />
            {(watchAreaUnit === "Marla" || watchAreaUnit === "Kanal") && (
              <FormField control={form.control} name="marlaSize" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    Marla Size <Info size={12} className="text-blue-500" />
                  </FormLabel>
                  <Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value)}>
                    <SelectTrigger className="border-slate-200"><SelectValue /></SelectTrigger>
                    <SelectContent className="text-slate-900 bg-slate-300">
                      <SelectItem value="225">225 Sq.ft (Standard)</SelectItem>
                      <SelectItem value="250">250 Sq.ft</SelectItem>
                      <SelectItem value="272.25">272.25 Sq.ft</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
            )}
          </div>

          {/* Rooms – hidden for plots */}
          {!isPlot && (
            <>
              <Separator className="my-5 bg-slate-100" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Rooms</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {[
                  ["bedrooms","Bedrooms"],["bathrooms","Bathrooms"],
                  ["kitchens","Kitchens"],["servantRooms","Servant Rooms"],
                  ["storeRooms","Store Rooms"],["drawingRooms","Drawing Rooms"],
                  ["diningRooms","Dining Rooms"],["floors","Floors"],
                  ["floorNumber","Floor No."],["parkingSpaces","Parking"],
                ].map(([key, label]) => (
                  <Controller key={key} control={form.control} name={key}
                    render={({ field }) => (
                      <NumStepper label={label} value={field.value || 0} onChange={field.onChange} />
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {/* Commercial extras */}
          {isCommercial && (
            <>
              <Separator className="my-5 bg-slate-100" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Commercial Specifics</p>
              <div className="flex flex-wrap gap-3">
                {[
                  ["isRunningBusiness","Running Business"],
                  ["hasBasement","Has Basement"],
                  ["hasLift","Has Lift / Elevator"],
                ].map(([key, label]) => (
                  <Controller key={key} control={form.control} name={key}
                    render={({ field }) => (
                      <CheckItem label={label} checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Off-plan details */}
      {isOffPlan && (
        <Card className="shadow-sm border-amber-100 bg-amber-50/30">
          <CardContent className="pt-6">
            <SectionHeader icon={TrendingUp} title="Off-Plan Details" subtitle="Developer and project information" color="amber" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField control={form.control} name="developerName" render={({ field }) => (
                <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Developer Name</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. Bahria Town" className="border-slate-200 bg-white" /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="projectName" render={({ field }) => (
                <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project Name</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. Precinct 12" className="border-slate-200 bg-white" /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="expectedHandoverDate" render={({ field }) => (
                <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Expected Handover</FormLabel>
                  <FormControl><Input type="date" {...field} className="border-slate-200 bg-white" /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="projectStatus" render={({ field }) => (
                <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="border-slate-200 bg-white"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent className="text-slate-900 bg-slate-300">
                      {["Under Construction","Finishing Stages","Completed"].map(v=><SelectItem key={v} value={v}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select></FormItem>
              )} />
              <FormField control={form.control} name="constructionProgress" render={({ field }) => (
                <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Construction % Complete</FormLabel>
                  <FormControl><Input type="number" min={0} max={100} {...field} placeholder="0–100" className="border-slate-200 bg-white" /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="downPaymentPercentage" render={({ field }) => (
                <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Down Payment %</FormLabel>
                  <FormControl><Input type="number" min={0} max={100} {...field} placeholder="e.g. 20" className="border-slate-200 bg-white" /></FormControl></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="isPostHandoverAvailable" render={({ field }) => (
              <FormItem><CheckItem label="Post-Handover Payment Available" checked={field.value} onCheckedChange={field.onChange} /></FormItem>
            )} />
          </CardContent>
        </Card>
      )}
    </>
  );

  const renderStep2 = () => (
    <Card className="shadow-sm border-slate-100">
      <CardContent className="pt-6">
        <SectionHeader icon={MapPin} title="Location & Address" subtitle="Where is the property located?" color="blue" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormField control={form.control} name="city" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">City <span className="text-red-500">*</span></FormLabel>
              <FormControl>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger className="border-slate-200"><SelectValue placeholder="Select city" /></SelectTrigger>
                <SelectContent className="text-slate-900 bg-slate-300">{PK_CITIES.map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="community" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Society / Community <span className="text-red-500">*</span></FormLabel>
              <FormControl><Input {...field} placeholder="e.g. DHA Phase 6, Bahria Town" className="border-slate-200" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="area_loc" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Area / Sub-area</FormLabel>
              <FormControl><Input {...field} placeholder="e.g. Gulberg III" className="border-slate-200" /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="subCommunity" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sub-community</FormLabel>
              <FormControl><Input {...field} placeholder="e.g. Sector F-7" className="border-slate-200" /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="phase" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Phase / Sector</FormLabel>
              <FormControl><Input {...field} placeholder="e.g. Phase 6" className="border-slate-200" /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="block" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Block</FormLabel>
              <FormControl><Input {...field} placeholder="e.g. Block B" className="border-slate-200" /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="building" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Building / Tower</FormLabel>
              <FormControl><Input {...field} placeholder="e.g. Centaurus Tower A" className="border-slate-200" /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="nearbyLandmarks" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nearby Landmark</FormLabel>
              <FormControl><Input {...field} placeholder="e.g. Near Packages Mall" className="border-slate-200" /></FormControl>
            </FormItem>
          )} />
        </div>
        <FormField control={form.control} name="address" render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Full Address</FormLabel>
            <FormControl><Textarea {...field} placeholder="Complete postal address..." className="border-slate-200 min-h-[70px]" /></FormControl>
          </FormItem>
        )} />
        <Separator className="my-4 bg-slate-100" />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Map Coordinates (Optional)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="latitude" render={({ field }) => (
            <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Latitude</FormLabel>
              <FormControl><Input type="number" step="any" {...field} placeholder="e.g. 31.5204" className="border-slate-200" /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="longitude" render={({ field }) => (
            <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Longitude</FormLabel>
              <FormControl><Input type="number" step="any" {...field} placeholder="e.g. 74.3587" className="border-slate-200" /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="mapEmbedUrl" render={({ field }) => (
            <FormItem className="md:col-span-2"><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Google Maps Embed URL</FormLabel>
              <FormControl><Input {...field} placeholder="https://maps.google.com/..." className="border-slate-200" /></FormControl></FormItem>
          )} />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card className="shadow-sm border-slate-100">
      <CardContent className="pt-6">
        <SectionHeader icon={DollarSign} title="Pricing & Payment" subtitle="Set your listing price and payment terms" color="green" />
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
                <SelectContent className="text-slate-900 bg-slate-300">{["PKR","AED","USD"].map(v=><SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
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
                <SelectContent className="text-slate-900 bg-slate-300">{["Fixed","Starting From","Price on Call"].map(v=><SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </FormItem>
          )} />
          {isRent && (
            <FormField control={form.control} name="rentFrequency" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rent Frequency <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="border-slate-200"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{["Daily","Weekly","Monthly","Yearly"].map(v=><SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </FormItem>
            )} />
          )}
          <FormField control={form.control} name="boostLevel" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Boost / Listing Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="border-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent className="text-slate-900 bg-slate-300">
                  <SelectItem value="None">Basic Listing</SelectItem>
                  <SelectItem value="Standard">Hot (+400% exposure)</SelectItem>
                  <SelectItem value="Premium">Super Hot (+2000% exposure)</SelectItem>
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
          <FormField control={form.control} name="isNegotiable" render={({ field }) => (
            <CheckItem label="Price is Negotiable" checked={field.value} onCheckedChange={field.onChange} />
          )} />
          <FormField control={form.control} name="isOnInstalments" render={({ field }) => (
            <CheckItem label="Instalment Plan Available" checked={field.value} onCheckedChange={field.onChange} />
          )} />
          <FormField control={form.control} name="possessionPaid" render={({ field }) => (
            <CheckItem label="Possession Paid" checked={field.value} onCheckedChange={field.onChange} />
          )} />
        </div>
        {watchIsInstalment && (
          <>
            <Separator className="my-4 bg-slate-100" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Instalment Plan Details</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField control={form.control} name="downPayment" render={({ field }) => (
                <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Down Payment (PKR)</FormLabel>
                  <FormControl><Input type="number" {...field} placeholder="e.g. 5000000" className="border-slate-200" /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="monthlyInstalment" render={({ field }) => (
                <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Monthly Instalment</FormLabel>
                  <FormControl><Input type="number" {...field} placeholder="e.g. 150000" className="border-slate-200" /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="instalmentPeriodMonths" render={({ field }) => (
                <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">No. of Months</FormLabel>
                  <FormControl><Input type="number" {...field} placeholder="e.g. 60" className="border-slate-200" /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="membershipFee" render={({ field }) => (
                <FormItem><FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500">Membership Fee</FormLabel>
                  <FormControl><Input type="number" {...field} placeholder="e.g. 100000" className="border-slate-200" /></FormControl></FormItem>
              )} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <div className="space-y-5">
      {[
        { title: "Utilities", sub: "Available utilities at the property", color: "purple", icon: Star,
          items: [
            ["gasAvailable","Gas Available"],["hasElectricityBackup","Electricity Backup / UPS"],
            ["hasBroadbandInternet","Broadband Internet"],["hasWasteDisposal","Waste Disposal"],
          ]
        },
        { title: "Construction & Plot Features", sub: "", color: "blue", icon: Building2,
          items: [
            ["isCorner","Corner Property"],["isBoundaryWall","Boundary Wall"],
            ["isWaterFront","Waterfront"],
          ]
        },
        { title: "Indoor Facilities", sub: "", color: "teal", icon: Home,
          items: [
            ["hasSwimmingPool","Swimming Pool"],["hasGym","Gym / Fitness"],
            ["hasCentralAC","Central AC / Heating"],["hasBalcony","Balcony / Terrace"],
            ["hasMaidRoom","Maid / Servant Room"],["hasStudyRoom","Study Room"],
            ["hasCoveredParking","Covered Parking"],["hasBuiltInWardrobes","Built-in Wardrobes"],
            ["hasMosque","Mosque / Prayer Room"],
          ]
        },
        { title: "Security & Infrastructure", sub: "", color: "red", icon: Shield,
          items: [["hasCCTV","CCTV Cameras"]]
        },
      ].map(({ title, sub, color, icon, items }) => (
        <Card key={title} className="shadow-sm border-slate-100">
          <CardContent className="pt-6">
            <SectionHeader icon={icon} title={title} subtitle={sub} color={color} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {items.map(([key, label]) => (
                <Controller key={key} control={form.control} name={key}
                  render={({ field }) => (
                    <CheckItem label={label} checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

const renderStep5 = () => {
  const currentImages = form.watch("images") || [];

  const handleImageSuccess = (url) => {
    const updatedImages = [...currentImages, url];
    form.setValue("images", updatedImages, { shouldValidate: true });
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = currentImages.filter((_, index) => index !== indexToRemove);
    form.setValue("images", updatedImages, { shouldValidate: true });
  };

  return (
    <div className="space-y-5">
      <Card className="shadow-sm border-slate-100 bg-white">
        <CardContent className="pt-6">
          <SectionHeader 
            icon={Camera} 
            title="Property Photos" 
            subtitle="Upload 8–16 high-quality images (Required)" 
            color="blue" 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {currentImages.map((url, index) => (
              <div key={index} className="relative aspect-video rounded-lg overflow-hidden border-2 border-slate-200">
                <img src={url} className="w-full h-full object-cover" alt={`Property ${index}`} />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
                >
                  <X size={14} />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                    MAIN COVER
                  </span>
                )}
              </div>
            ))}

            {currentImages.length < 16 && (
              <div className="aspect-video">
                {/* KEY IS THE FIX: 
                  Changing the key forces React to reset the component 
                  state and clear the file input automatically.
                */}
                <FileUpload
                  key={`uploader-${currentImages.length}`} 
                  label={`Upload Photo ${currentImages.length + 1}`}
                  folder="properties/gallery"
                  onUploadSuccess={(url) => handleImageSuccess(url)}
                  onRemove={() => {}} 
                />
              </div>
            )}
          </div>

          {form.formState.errors.images && (
            <p className="text-red-500 text-xs mt-2 font-medium">
              {form.formState.errors.images.message}
            </p>
          )}
          
          <p className="text-xs text-slate-500 mt-4 bg-blue-50 p-2 rounded border border-blue-100">
            <strong>Pro Tip:</strong> High quality landscape photos (horizontal) increase inquiries. First photo is your cover.
          </p>
        </CardContent>
      </Card>

      {/* Rest of your sections (Video & Documents) remain the same... */}
    </div>
  );
};



  const renderStep6 = () => (
    <Card className="shadow-sm border-red-100 bg-red-50/20">
      <CardContent className="pt-6">
        <SectionHeader icon={Shield} title="Legal & Compliance" subtitle="Required for listing approval — kept confidential" color="red" />
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 flex gap-2.5 items-start">
          <Info size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800 leading-relaxed">This information is used for verification purposes only and will not be displayed publicly. All fields marked * are required before admin approval.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <Separator className="my-5 bg-slate-100" />
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Document Uploads</p>
        <div className="space-y-3">
          {[
            ["Marketing Contract (Required)", marketingContractFile, setMarketingContractFile, true],
            ["Title Deed / Registry", titleDeedFile, setTitleDeedFile, false],
            ["NOC / Approval Letter", nocFile, setNocFile, false],
          ].map(([label, file, setter, required]) => (
            <div key={label} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer bg-white"
              onClick={() => { const el = document.createElement("input"); el.type="file"; el.accept=".pdf,image/*"; el.onchange=e=>{ setter(e.target.files[0]); if(label.includes("Marketing")) form.setValue("marketingContract", e.target.files[0]?.name || ""); }; el.click(); }}>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <span className="text-lg">📜</span>
                <span>{label}{required && <span className="text-red-500 ml-1">*</span>}</span>
              </div>
              {file ? (
                <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 text-xs">{file.name.slice(0,20)}</Badge>
              ) : (
                <span className="text-xs text-blue-500 font-medium">Upload</span>
              )}
            </div>
          ))}
        </div>
        <Separator className="my-5 bg-slate-100" />
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
  );

  const renderStep7 = () => {
    // const v = form.watch();
    const v = watchedAll;
    const rows = [
      ["Purpose",         v.purpose || "—"],
      ["Category",        `${v.category} — ${v.propertyType}` || "—"],
      ["Title",           v.title || "—"],
      ["Area",            v.area ? `${v.area} ${v.areaUnit}${areaHint ? ` (${areaHint})` : ""}` : "—"],
      ["Bedrooms / Baths",!isPlot ? `${v.bedrooms} beds / ${v.bathrooms} baths` : "N/A"],
      ["City",            v.city || "—"],
      ["Location",        v.community || "—"],
      ["Phase / Block",   [v.phase, v.block].filter(Boolean).join(", ") || "—"],
      ["Price",           formatPKR(v.price)],
      ["Price Label",     v.priceLabel || "—"],
      ["Completion",      v.completionStatus || "—"],
      ["Furnishing",      v.furnishingStatus || "—"],
      ["Boost",           v.boostLevel || "None"],
      ["Photos Uploaded", `${(form.getValues("images") || []).length} / min 8 required`],,
    ];
    return (
      <Card className="shadow-sm border-slate-100">
        <CardContent className="pt-6">
          <SectionHeader icon={CheckCircle} title="Review Your Listing" subtitle="Confirm all details before submitting for approval" color="green" />
          <p className="text-xs text-slate-400 mb-5">Click any step tab above to go back and make changes.</p>
          <div className="divide-y divide-slate-100">
            {rows.map(([label, val]) => (
              <div key={label} className="flex justify-between py-2.5 text-sm">
                <span className="text-slate-400">{label}</span>
                <span className="font-medium text-slate-800 text-right max-w-[55%]">{val}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 items-start">
            <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800 leading-relaxed">
              By submitting, you confirm all details are accurate and you have the legal right to list this property.Our staff will review and approve it before it goes live.
            </p>
          </div>
          {/* <div className="text-center mt-6">
            <Button type="submit" size="lg" className="bg-[#147a32] hover:bg-[#0f5c25] text-white h-14 px-16 font-bold text-base rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95 w-full md:w-auto">
              🚀 Submit Property for Approval
            </Button>
          </div> */}
        </CardContent>
      </Card>
    );
  };

  const stepRenderers = [renderStep0, renderStep1, renderStep2, renderStep3, renderStep4, renderStep5, renderStep6, renderStep7];

  return (
    <div className="bg-slate-100 min-h-screen pb-20 text-slate-900">
      {/* Header */}
      <div className="bg-[#0b1c3c] text-white py-8 shadow-md">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-2xl font-bold">Post a New Property Listing</h1>
          <p className="text-slate-400 mt-1 text-sm">Fill in all required details to list your property on the platform.</p>
        </div>
      </div>

      {/* Step tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 flex overflow-x-auto scrollbar-none">
          {STEPS.map(({ label, icon: Icon }, i) => (
            <button key={i} type="button"
              className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all flex-shrink-0 ${currentStep === i ? "border-blue-600 text-blue-700" : i < currentStep ? "border-green-500 text-green-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
              onClick={() => setCurrentStep(i)}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mr-0.5 ${currentStep === i ? "bg-blue-600 text-white" : i < currentStep ? "bg-green-500 text-white" : "bg-slate-200 text-slate-500"}`}>
                {i < currentStep ? "✓" : i + 1}
              </span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Form body */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="max-w-3xl mx-auto px-4 md:px-6 pt-6 space-y-5">
          {stepRenderers[currentStep]?.()}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2 pb-6">
            <Button type="button" variant="outline" onClick={goPrev} disabled={currentStep === 0}
              className="border-slate-300 text-slate-900 bg-slate-300 hover:border-blue-400 hover:text-blue-700 disabled:opacity-30">
              <ChevronLeft size={16} className="mr-1" /> Back
            </Button>
            <span className="text-xs text-slate-400 font-medium">Step {currentStep + 1} of {STEPS.length}</span>
            {currentStep < STEPS.length - 1 ? (
              <Button type="button" onClick={goNext} className="bg-[#1a56db] hover:bg-[#1546b8] text-white">
                Continue <ChevronRight size={16} className="ml-1" />
              </Button>
            ) : (
            <Button disabled={isSubmitting} type="submit"
            onClick={() => console.log("Submit button actually clicked")}
                className="bg-[#147a32] hover:bg-[#0f5c25] text-white h-14 px-16 font-bold text-base rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95 w-full md:w-auto flex items-center justify-center"
            >
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                SUBMIT PROPERTY
            </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
