import { z } from "zod";

export const formSchema = z.object({
  purpose: z.enum(["For Sale", "For Rent"], {
    required_error: "Purpose is required",
  }),
  category: z.enum(["Residential", "Commercial", "Plots"], {
    required_error: "Category is required",
  }),
  propertyType: z.string().min(1, "Property type is required"),
  title: z.string().min(10, "Title must be at least 10 characters").max(150),
  description: z
    .string()
    .min(30, "Description must be at least 30 characters")
    .max(5000),
  facing: z
    .enum([
      "North",
      "South",
      "East",
      "West",
      "North-East",
      "North-West",
      "South-East",
      "South-West",
    ])
    .optional(),
  completionStatus: z.enum(["Off-plan", "Ready"], {
    required_error: "Completion status is required",
  }),
  condition: z.enum(["New", "Good", "Needs Renovation"]).optional(),
  furnishingStatus: z
    .enum(["Furnished", "Unfurnished", "Partly Furnished"])
    .optional(),
  occupancyStatus: z.enum(["Vacant", "Tenanted"]).optional(),
  age: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().min(0).optional(),
  ),
  area: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z
      .number({ invalid_type_error: "Area is required" })
      .positive("Area must be greater than 0"),
  ),
  areaUnit: z.enum(["Sqft", "Sqm", "Marla", "Kanal", "Acre", "Sqyd"], {
    required_error: "Unit is required",
  }),
  marlaSize: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().optional(),
  ),
  bedrooms: z.preprocess(
    (v) => (v === "" || v == null ? 0 : Number(v)),
    z.number().min(0).default(0),
  ),
  bathrooms: z.preprocess(
    (v) => (v === "" || v == null ? 0 : Number(v)),
    z.number().min(0).default(0),
  ),
  parkingSpaces: z.preprocess(
    (v) => (v === "" || v == null ? 0 : Number(v)),
    z.number().min(0).default(0),
  ),
  floors: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().min(0).optional(),
  ),
  floorNumber: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().min(0).optional(),
  ),
  kitchens: z.preprocess(
    (v) => (v === "" || v == null ? 1 : Number(v)),
    z.number().min(0).default(1),
  ),
  servantRooms: z.preprocess(
    (v) => (v === "" || v == null ? 0 : Number(v)),
    z.number().min(0).default(0),
  ),
  storeRooms: z.preprocess(
    (v) => (v === "" || v == null ? 0 : Number(v)),
    z.number().min(0).default(0),
  ),
  drawingRooms: z.preprocess(
    (v) => (v === "" || v == null ? 1 : Number(v)),
    z.number().min(0).default(1),
  ),
  diningRooms: z.preprocess(
    (v) => (v === "" || v == null ? 1 : Number(v)),
    z.number().min(0).default(1),
  ),
  city: z.string().min(1, "City is required"),
  community: z.string().min(1, "Society / Community is required"),
  area_loc: z.string().optional(),
  subCommunity: z.string().optional(),
  phase: z.string().optional(),
  block: z.string().optional(),
  building: z.string().optional(),
  address: z.string().optional(),
  nearbyLandmarks: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  googlePlaceId: z.string().optional(),
  mapEmbedUrl: z.string().optional(),
  price: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z
      .number({ invalid_type_error: "Price is required" })
      .positive("Price must be greater than 0"),
  ),
  currency: z.enum(["PKR", "AED", "USD"]).default("PKR"),
  priceLabel: z
    .enum(["Fixed", "Starting From", "Price on Call"])
    .default("Fixed"),
  isNegotiable: z.boolean().default(false),
  rentFrequency: z.enum(["Daily", "Weekly", "Monthly", "Yearly"]).optional(),
  isOnInstalments: z.boolean().default(false),
  possessionPaid: z.boolean().default(false),
  downPayment: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().positive().optional(),
  ),
  instalmentPeriodMonths: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().positive().optional(),
  ),
  monthlyInstalment: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().positive().optional(),
  ),
  membershipFee: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().positive().optional(),
  ),
  boostLevel: z
    .enum(["None", "Standard", "Premium", "Platinum"])
    .default("None"),
  expiresAt: z.string().optional(),
  hasSwimmingPool: z.boolean().default(false),
  hasGym: z.boolean().default(false),
  hasCentralAC: z.boolean().default(false),
  hasBalcony: z.boolean().default(false),
  hasMaidRoom: z.boolean().default(false),
  hasStudyRoom: z.boolean().default(false),
  hasCoveredParking: z.boolean().default(false),
  hasBuiltInWardrobes: z.boolean().default(false),
  hasCCTV: z.boolean().default(false),
  hasMosque: z.boolean().default(false),
  gasAvailable: z.boolean().default(false),
  isCorner: z.boolean().default(false),
  hasElectricityBackup: z.boolean().default(false),
  hasWasteDisposal: z.boolean().default(false),
  hasBroadbandInternet: z.boolean().default(false),
  isWaterFront: z.boolean().default(false),
  isBoundaryWall: z.boolean().default(false),
  isRunningBusiness: z.boolean().default(false),
  hasBasement: z.boolean().default(false),
  hasLift: z.boolean().default(false),
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
  ownerName: z.string().optional(),
  ownerCNIC: z
    .string()
    .min(13, "CNIC must be at least 13 digits")
    .max(15)
    .regex(/^[0-9-]+$/, "CNIC must contain only numbers"),
  ownerEmail: z.string().email("Please enter a valid email address"),
  ownerPhone: z.string().optional(),
  marketingContract: z.string().min(1, "Marketing contract is required"),
  developerName: z.string().optional(),
  projectName: z.string().optional(),
  expectedHandoverDate: z.string().optional(),
  constructionProgress: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().min(0).max(100).optional(),
  ),
  projectStatus: z
    .enum(["Under Construction", "Finishing Stages", "Completed"])
    .optional(),
  downPaymentPercentage: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().min(0).max(100).optional(),
  ),
  isPostHandoverAvailable: z.boolean().default(false),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
});
