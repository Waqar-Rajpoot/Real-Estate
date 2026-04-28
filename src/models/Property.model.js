import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema({

  // ─── 1. SYSTEM HIERARCHY & OWNERSHIP ─────────────────────────────────────
  agency: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },

  // ─── 2. LISTING STATUS & WORKFLOW ────────────────────────────────────────
  status: {
    type: String,
    enum: ['Draft', 'Pending', 'Active', 'Sold', 'Rented', 'Rejected', 'Expired', 'Archived'],
    default: 'Draft',
  },
  rejectionReason: { type: String, trim: true },
  expiresAt: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },

  // ─── 3. CORE LISTING DETAILS ──────────────────────────────────────────────
  purpose: { type: String, enum: ['For Sale', 'For Rent'], required: true },
  category: { type: String, enum: ['Residential', 'Commercial', 'Plots'], required: true }, // Added 'Plots'
  propertyType: {
    type: String,
    enum: [
      'Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Villa Compound',
      'Hotel Apartment', 'Land', 'Floor', 'Building',
      'Office', 'Shop', 'Warehouse', 'Labour Camp', 'Bulk Unit',
      'Factory', 'Industrial Land', 'Mixed Use Land', 'Showroom', 'Other Commercial',
      'House', 'Upper Portion', 'Lower Portion', 'Farm House', 'Room', 'Annexe',
      'Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Industrial Plot', 'Plot File' // Plot specifics
    ],
    required: true,
  },
  title: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, required: true, maxlength: 5000 },
  referenceNumber: { type: String, unique: true },
  
  // Zameen Parity Fields
  facing: { 
    type: String, 
    enum: ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'] 
  },
  priceLabel: { 
    type: String, 
    enum: ['Fixed', 'Starting From', 'Price on Call'], 
    default: 'Fixed' 
  },

  // ─── 4. PRICING & PAYMENT STATUS ──────────────────────────────────────────
  price: { type: Number, required: true },
  pricePerSqFt: { type: Number },
  currency: { type: String, enum: ['PKR', 'AED', 'USD'], default: 'PKR' },
  rentFrequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
    required: function () { return this.purpose === 'For Rent'; },
  },
  isNegotiable: { type: Boolean, default: false },
  
  paymentStatus: {
    isOnInstalments: { type: Boolean, default: false }, 
    possessionPaid: { type: Boolean, default: false }, 
    downPayment: { type: Number },
    instalmentPeriodMonths: { type: Number },
    monthlyInstalment: { type: Number }, // Added
    membershipFee: { type: Number },    // Added (Common in PK Societies)
  },

  priceHistory: [
    {
      price: { type: Number },
      changedAt: { type: Date, default: Date.now },
      changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
    },
  ],

  // ─── 5. PHYSICAL ATTRIBUTES ───────────────────────────────────────────────
  area: { type: Number, required: true },
  areaUnit: {
    type: String,
    enum: ['Sqft', 'Sqm', 'Marla', 'Kanal', 'Acre', 'Sqyd'], // Added Sqyd (Gazz)
    default: 'Sqft',
  },
  // Zameen Society Marla Logic
  marlaSize: { 
    type: Number, 
    enum: [225, 250, 272.25], 
    default: 225 
  },
  areaInMarla: { type: Number }, 
  
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  parkingSpaces: { type: Number, default: 0 },
  floors: { type: Number },
  floorNumber: { type: Number },
  furnishingStatus: { type: String, enum: ['Furnished', 'Unfurnished', 'Partly Furnished'] },
  completionStatus: { type: String, enum: ['Off-plan', 'Ready'], required: true },
  occupancyStatus: { type: String, enum: ['Vacant', 'Tenanted'] },
  age: { type: Number },
  condition: { type: String, enum: ['New', 'Good', 'Needs Renovation'] },

  commercialDetails: {
    isRunningBusiness: { type: Boolean, default: false }, 
    hasBasement: { type: Boolean, default: false },
    hasLift: { type: Boolean, default: false },
  },

  // ─── 6. LOCATION ──────────────────────────────────────────────────────────
 location: {
  country: { type: String, default: 'Pakistan' },
  city: { type: String, required: true, trim: true },
  area: { type: String, trim: true },
  community: { type: String, required: true, trim: true },
  subCommunity: { type: String, trim: true },
  block: { type: String, trim: true },
  phase: { type: String, trim: true },
  building: { type: String, trim: true },
  
  // --- NEW FIELDS FOR API SYNC ---
  googlePlaceId: { type: String }, // To link directly to Google's data
  formattedAddress: { type: String, trim: true }, // Standardized address from API
  mapZoom: { type: Number, default: 15 }, // Custom zoom level for detail page
  // -------------------------------

  address: { type: String, trim: true }, // User's custom typed address
  nearbyLandmarks: [{ type: String }],
  coordinates: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { 
      type: [Number], 
      required: true // Ensure maps always have a point to render
    },
  },
  // You can keep mapEmbedUrl, but with JS API, you won't really need it anymore
  mapEmbedUrl: { type: String }, 
},

  // ─── 7. AMENITIES & FEATURES ──────────────────────────────────────────────
  amenities: [{ type: String }],
  features: {
    hasSwimmingPool: { type: Boolean, default: false },
    hasGym: { type: Boolean, default: false },
    hasCentralAC: { type: Boolean, default: false },
    hasBalcony: { type: Boolean, default: false },
    hasMaidRoom: { type: Boolean, default: false },
    hasStudyRoom: { type: Boolean, default: false },
    hasCoveredParking: { type: Boolean, default: false },
    hasBuiltInWardrobes: { type: Boolean, default: false },
    hasCCTV: { type: Boolean, default: false },
    hasMosque: { type: Boolean, default: false },
    gasAvailable: { type: Boolean, default: false },
    isCorner: { type: Boolean, default: false }, 
    
    // Zameen Specifics Added:
    hasElectricityBackup: { type: Boolean, default: false }, 
    hasWasteDisposal: { type: Boolean, default: false },
    hasBroadbandInternet: { type: Boolean, default: false },
    isWaterFront: { type: Boolean, default: false },
    isBoundaryWall: { type: Boolean, default: false }, // For plots
  },

  // ─── 8. MEDIA ─────────────────────────────────────────────────────────────
  images: {
    type: [{ originalUrl: { type: String, required: true } }],
    validate: {
      validator: function (v) { return v.length >= 8 && v.length <= 16; },
      message: 'Property must have between 8 and 16 images.',
    },
  },
  videoUrl: { type: String },
  virtualTourUrl: { type: String },
  floorPlan: { type: String },
  floorPlanInteractiveUrl: { type: String },
  documentUrls: [{ label: String, url: String }],

  // ─── 9. LEGAL & COMPLIANCE ────────────────────────────────────────────────
  legal: {
    ownerName: { type: String },
    ownerCNIC: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    ownerPhone: { type: String },
    marketingContract: { type: String, required: true },
    titleDeedUrl: { type: String },
    nocUrl: { type: String },
    possessionLetterUrl: { type: String },
    allottmentLetterUrl: { type: String },
  },

  // ─── 10. OFF-PLAN DETAILS ─────────────────────────────────────────────────
  offPlanDetails: {
    developerName: { type: String },
    projectName: { type: String },
    expectedHandoverDate: { type: Date },
    constructionProgress: { type: Number, min: 0, max: 100 },
    projectStatus: { type: String, enum: ['Under Construction', 'Finishing Stages', 'Completed'] },
    paymentPlan: {
      downPaymentPercentage: { type: Number },
      isPostHandoverAvailable: { type: Boolean, default: false },
      milestones: [{ milestone: String, percentage: Number, dueDate: Date }],
    },
    brochureUrl: { type: String },
    siteMapUrl: { type: String },
  },

  // ─── 11. LEAD FLOW & CONTACT ──────────────────────────────────────────────
  leadFlow: {
    centralDeskWhatsapp: { type: String, default: process.env.ADMIN_WHATSAPP_NUMBER || '' },
    routingLogic: { type: String, default: 'Admin -> Agent Redirection' },
    callTrackingNumber: { type: String },
    contactHours: { // Added
      from: { type: String, default: "09:00" },
      to: { type: String, default: "21:00" },
    }
  },

  // ─── 12. METRICS & ANALYTICS ─────────────────────────────────────────────
  metrics: {
    viewCount: { type: Number, default: 0 },
    uniqueViewCount: { type: Number, default: 0 },
    whatsappInquiryCount: { type: Number, default: 0 },
    callInquiryCount: { type: Number, default: 0 },
    emailInquiryCount: { type: Number, default: 0 },
    saveCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    lastViewedAt: { type: Date },
  },

  // ─── 13. VERIFICATION (TruCheck equivalent) ───────────────────────────────
  verification: {
    isTruCheck: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verificationNote: { type: String },
  },

  // ─── 14. LISTING QUALITY SCORE ────────────────────────────────────────────
  qualityScore: { type: Number, default: 0, min: 0, max: 100 },

  // ─── 15. FEATURED & PROMOTIONS ────────────────────────────────────────────
  isFeatured: { type: Boolean, default: false },
  featuredUntil: { type: Date },
  boostLevel: { type: String, enum: ['None', 'Standard', 'Premium', 'Platinum'], default: 'None' },
  boostExpiresAt: { type: Date },

  // ─── 16. SEO & SOFT DELETE ────────────────────────────────────────────────
  seo: { metaTitle: { type: String, maxlength: 70 }, metaDescription: { type: String, maxlength: 160 }, canonicalUrl: { type: String } },
  deletedAt: { type: Date, default: null },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },

}, { timestamps: true });

// ─── INDEXES ──────────────────────────────────────────────────────────────
PropertySchema.index({ areaInMarla: 1 });
PropertySchema.index({ "location.city": 1, "location.community": 1 }); // Essential for Zameen-style search
PropertySchema.index({ "location.coordinates": "2dsphere" });
// ─── UPDATED PRE-SAVE HOOK ─────────────────────────────────────────────────
PropertySchema.pre('save', async function () {
  // 1. DYNAMIC AREA CONVERSION (Handles 225/250/272 Marla)
  if (this.isModified('area') || this.isModified('areaUnit') || this.isModified('marlaSize')) {
    const mSize = this.marlaSize || 225;
    let factor = 1;

    if (this.areaUnit === 'Sqft') factor = 1 / mSize;
    else if (this.areaUnit === 'Sqyd') factor = 9 / mSize; // Gazz to Marla
    else if (this.areaUnit === 'Kanal') factor = 20;
    else if (this.areaUnit === 'Sqm') factor = 10.76 / mSize;
    else if (this.areaUnit === 'Acre') factor = 160;
    
    this.areaInMarla = Number((this.area * factor).toFixed(2));
  }

  // 2. DYNAMIC PRICE PER SQFT
  if ((this.isModified('price') || this.isModified('area')) && this.area > 0) {
    let areaInSqft = this.area;
    const mSize = this.marlaSize || 225;

    if (this.areaUnit === 'Marla') areaInSqft = this.area * mSize;
    if (this.areaUnit === 'Kanal') areaInSqft = this.area * (mSize * 20);
    if (this.areaUnit === 'Sqyd') areaInSqft = this.area * 9;
    
    this.pricePerSqFt = Math.round(this.price / areaInSqft);
  }
});

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);
export default Property;