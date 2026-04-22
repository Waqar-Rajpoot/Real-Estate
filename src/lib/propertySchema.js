// import * as z from "zod";

// export const propertyFormSchema = z.object({
//   purpose: z.enum(["For Sale", "For Rent"]),
//   category: z.enum(["Residential", "Commercial", "Plots"]),
//   propertyType: z.string().min(1, "Select property type"),
//   city: z.string().min(1, "City is required"),
//   community: z.string().min(1, "Location is required"),
//   block: z.string().optional(),
//   phase: z.string().optional(),
//   address: z.string().optional(),
//   title: z.string().min(10).max(150),
//   description: z.string().min(20).max(5000),
//   price: z.coerce.number().min(1),
//   priceLabel: z.enum(["Fixed", "Starting From", "Price on Call"]),
//   currency: z.string().default("PKR"),
//   area: z.coerce.number().min(1),
//   areaUnit: z.enum(["Sqft", "Sqm", "Marla", "Kanal", "Acre", "Sqyd"]),
//   marlaSize: z.coerce.number().default(225),
//   bedrooms: z.coerce.number().optional(),
//   bathrooms: z.coerce.number().optional(),
//   facing: z.string().optional(),
//   completionStatus: z.enum(["Off-plan", "Ready"]),
//   isNegotiable: z.boolean().default(false),
//   // Features
//   features: z.object({
//     hasElectricityBackup: z.boolean().default(false),
//     gasAvailable: z.boolean().default(false),
//     hasSwimmingPool: z.boolean().default(false),
//     isCorner: z.boolean().default(false),
//     isBoundaryWall: z.boolean().default(false),
//     hasCCTV: z.boolean().default(false),
//   }),
//   // Legal
//   ownerCNIC: z.string().min(13, "Invalid CNIC"),
//   ownerEmail: z.string().email(),
//   images: z.array(z.object({ originalUrl: z.string() })).min(8).max(16),
// });







import * as z from "zod";

export const propertyFormSchema = z.object({
  // --- Basic Info ---
  title: z.string().min(5).max(150),
  description: z.string().min(10).max(5000),
  purpose: z.enum(["For Sale", "For Rent"]),
  category: z.enum(["Residential", "Commercial", "Plots"]),
  propertyType: z.string().min(1),
  
  // --- Location ---
  city: z.string().min(1),
  community: z.string().min(1),
  area_loc: z.string().optional(),
  subCommunity: z.string().optional(),
  phase: z.string().optional(),
  block: z.string().optional(),
  building: z.string().optional(),
  address: z.string().optional(),
  nearbyLandmarks: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  mapEmbedUrl: z.string().optional(),

  // --- Pricing & Area ---
  price: z.coerce.number().min(1),
  priceLabel: z.enum(["Fixed", "Starting From", "Price on Call"]),
  currency: z.string().default("PKR"),
  area: z.coerce.number().min(1),
  areaUnit: z.string(),
  marlaSize: z.coerce.number().default(225),
  isNegotiable: z.boolean().default(false),
  isOnInstalments: z.boolean().default(false),

  // --- Features & Status (Flat structure from your console) ---
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  kitchens: z.coerce.number().optional(),
  floors: z.coerce.number().optional(),
  floorNumber: z.coerce.number().optional(),
  parkingSpaces: z.coerce.number().optional(),
  servantRooms: z.coerce.number().optional(),
  storeRooms: z.coerce.number().optional(),
  diningRooms: z.coerce.number().optional(),
  drawingRooms: z.coerce.number().optional(),
  age: z.coerce.number().optional(),
  facing: z.string().optional(),
  completionStatus: z.enum(["Off-plan", "Ready"]),
  furnishingStatus: z.string().optional(),
  occupancyStatus: z.string().optional(),
  condition: z.string().optional(),
  
  // --- Boolean Features ---
  gasAvailable: z.boolean().default(false),
  hasElectricityBackup: z.boolean().default(false),
  hasCCTV: z.boolean().default(false),
  hasCentralAC: z.boolean().default(false),
  hasSwimmingPool: z.boolean().default(false),
  hasGym: z.boolean().default(false),
  hasWasteDisposal: z.boolean().default(false),
  hasBroadbandInternet: z.boolean().default(false),
  hasStudyRoom: z.boolean().default(false),
  hasCoveredParking: z.boolean().default(false),
  hasBalcony: z.boolean().default(false),
  hasBasement: z.boolean().default(false),
  hasLift: z.boolean().default(false),
  hasMaidRoom: z.boolean().default(false),
  hasMosque: z.boolean().default(false),
  hasBuiltInWardrobes: z.boolean().default(false),
  isBoundaryWall: z.boolean().default(false),
  isCorner: z.boolean().default(false),
  isPostHandoverAvailable: z.boolean().default(false),
  isRunningBusiness: z.boolean().default(false),
  isWaterFront: z.boolean().default(false),
  possessionPaid: z.boolean().default(false),

  // --- Media ---
  images: z.array(z.string()).min(8).max(16),

  // --- Legal & SEO (New fields found in your console) ---
  ownerName: z.string().min(1),
  ownerCNIC: z.string().min(13),
  ownerEmail: z.string().email(),
  ownerPhone: z.string().min(10),
  boostLevel: z.string().default("None"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  marketingContract: z.string().optional(),
  expiresAt: z.string().optional(),
});