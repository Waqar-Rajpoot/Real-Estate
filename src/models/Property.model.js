// import mongoose from "mongoose";

// const PropertySchema = new mongoose.Schema({

//   // ─── 1. SYSTEM HIERARCHY & OWNERSHIP ─────────────────────────────────────
//   agency: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Agency',
//     required: true,
//   },
//   agent: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Agent',
//     required: true,
//   },

//   // ─── 2. LISTING STATUS & WORKFLOW ────────────────────────────────────────
//   status: {
//     type: String,
//     enum: ['Draft', 'Pending', 'Active', 'Sold', 'Rented', 'Rejected', 'Expired', 'Archived'],
//     default: 'Draft',
//   },
//   rejectionReason: {
//     type: String,
//     trim: true, // shown to agent when status = Rejected
//   },
//   expiresAt: {
//     type: Date, // auto-set on activation; cron flips status to Expired
//   },
//   approvedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // Admin user who approved the listing
//   },
//   approvedAt: {
//     type: Date,
//   },

//   // ─── 3. CORE LISTING DETAILS ──────────────────────────────────────────────
//   purpose: {
//     type: String,
//     enum: ['For Sale', 'For Rent'],
//     required: true,
//   },
//   category: {
//     type: String,
//     enum: ['Residential', 'Commercial'],
//     required: true,
//   },
//   propertyType: {
//     type: String,
//     enum: [
//       // Residential
//       'Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Villa Compound',
//       'Hotel Apartment', 'Land', 'Floor', 'Building',
//       // Commercial
//       'Office', 'Shop', 'Warehouse', 'Labour Camp', 'Bulk Unit',
//       'Factory', 'Industrial Land', 'Mixed Use Land', 'Showroom', 'Other Commercial',
//       // Pakistan-specific
//       'House', 'Upper Portion', 'Lower Portion', 'Farm House', 'Room', 'Annexe',
//     ],
//     required: true,
//   },
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 150,
//   },
//   slug: {
//     type: String,
//     unique: true,
//     lowercase: true,
//     trim: true,
//     // e.g. "3-bed-apartment-gulberg-lahore-a1b2c3"
//   },
//   description: {
//     type: String,
//     required: true,
//     maxlength: 5000,
//   },
//   referenceNumber: {
//     type: String,
//     unique: true,
//     // human-readable ID shown on listing page e.g. "LTK-2024-00142"
//   },

//   // ─── 4. PRICING ───────────────────────────────────────────────────────────
//   price: {
//     type: Number,
//     required: true,
//   },
//   pricePerSqFt: {
//     type: Number, // auto-calculated: price / area
//   },
//   currency: {
//     type: String,
//     enum: ['PKR', 'AED', 'USD'],
//     default: 'PKR',
//   },
//   rentFrequency: {
//     type: String,
//     enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
//     required: function () { return this.purpose === 'For Rent'; },
//   },
//   isNegotiable: {
//     type: Boolean,
//     default: false, // shows "Negotiable" badge on card
//   },
//   priceHistory: [
//     {
//       price:     { type: Number },
//       changedAt: { type: Date, default: Date.now },
//       changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
//     },
//   ],

//   // ─── 5. PHYSICAL ATTRIBUTES ───────────────────────────────────────────────
//   area: {
//     type: Number,
//     required: true, // in Sq. Ft.
//   },
//   areaUnit: {
//     type: String,
//     enum: ['Sqft', 'Sqm', 'Marla', 'Kanal', 'Acre'],
//     default: 'Sqft',
//     // Pakistan uses Marla / Kanal heavily
//   },
//   bedrooms: {
//     type: Number,
//     default: 0,
//   },
//   bathrooms: {
//     type: Number,
//     default: 0,
//   },
//   parkingSpaces: {
//     type: Number,
//     default: 0,
//   },
//   floors: {
//     type: Number, // total floors in building (for floor/building listings)
//   },
//   floorNumber: {
//     type: Number, // which floor the unit is on
//   },
//   furnishingStatus: {
//     type: String,
//     enum: ['Furnished', 'Unfurnished', 'Partly Furnished'],
//   },
//   completionStatus: {
//     type: String,
//     enum: ['Off-plan', 'Ready'],
//     required: true,
//   },
//   occupancyStatus: {
//     type: String,
//     enum: ['Vacant', 'Tenanted'],
//   },
//   age: {
//     type: Number, // property age in years
//   },
//   condition: {
//     type: String,
//     enum: ['New', 'Good', 'Needs Renovation'],
//   },

//   // ─── 6. LOCATION ──────────────────────────────────────────────────────────
//   location: {
//     country: { type: String, default: 'Pakistan' },
//     city:      { type: String, required: true, trim: true },
//     area:      { type: String, trim: true },      // e.g. "Gulberg III"
//     community: { type: String, required: true, trim: true },
//     subCommunity: { type: String, trim: true },   // e.g. "Block A"
//     building:  { type: String, trim: true },       // building/tower name
//     address:   { type: String, trim: true },       // full street address
//     nearbyLandmarks: [{ type: String }],
//     coordinates: {
//       type: {
//         type: String,
//         enum: ['Point'],
//         default: 'Point',
//       },
//       coordinates: {
//         type: [Number], // [longitude, latitude] — GeoJSON standard
//         index: '2dsphere',
//       },
//     },
//     mapEmbedUrl: { type: String }, // Google Maps embed URL for the listing page iframe
//   },

//   // ─── 7. AMENITIES & FEATURES ──────────────────────────────────────────────
//   amenities: [{ type: String }],
//   // e.g. ['Swimming Pool', 'Gym', 'Central A/C', 'Security', 'Balcony', 'Maid Room']

//   features: {
//     // structured boolean features for fast filtering
//     hasSwimmingPool:  { type: Boolean, default: false },
//     hasGym:           { type: Boolean, default: false },
//     hasCentralAC:     { type: Boolean, default: false },
//     hasBalcony:       { type: Boolean, default: false },
//     hasMaidRoom:      { type: Boolean, default: false },
//     hasStudyRoom:     { type: Boolean, default: false },
//     hasCoveredParking:{ type: Boolean, default: false },
//     hasBuiltInWardrobes: { type: Boolean, default: false },
//     hasCCTV:          { type: Boolean, default: false },
//     hasMosque:        { type: Boolean, default: false },  // Pakistan-specific
//     gasAvailable:     { type: Boolean, default: false },  // Pakistan-specific
//   },

//   // ─── 8. MEDIA ─────────────────────────────────────────────────────────────
//   images: {
//     type: [
//       {
//         originalUrl:    { type: String, required: true },
//         // watermarkedUrl: { type: String }, // generated after upload
//         // thumbnailUrl:   { type: String }, // 400x300 compressed version
//         // caption:        { type: String },
//         // isPrimary:      { type: Boolean, default: false }, // first shown on card
//         // order:          { type: Number },  // display sort order
//       },
//     ],
//     validate: {
//       validator: function (v) { return v.length >= 8 && v.length <= 16; },
//       message: 'Property must have between 8 and 16 images.',
//     },
//   },
//   videoUrl: {
//     type: String, // YouTube / Vimeo link or direct video URL
//   },
//   virtualTourUrl: {
//     type: String, // 360° tour embed URL (Matterport, etc.)
//   },
//   floorPlan: {
//     type: String, // image URL of floor plan
//   },
//   floorPlanInteractiveUrl: {
//     type: String, // interactive floor plan URL
//   },
//   documentUrls: [
//     {
//       label: String, // e.g. "Title Deed", "NOC"
//       url:   String,
//     },
//   ],

//   // ─── 9. LEGAL & COMPLIANCE ────────────────────────────────────────────────
//   legal: {
//     ownerName:          { type: String },
//     ownerCNIC:          { type: String, required: true },
//     ownerEmail:         { type: String, required: true },
//     ownerPhone:         { type: String },
//     marketingContract:  { type: String, required: true }, // URL to signed agreement
//     titleDeedUrl:       { type: String },  // property ownership document
//     nocUrl:             { type: String },  // No Objection Certificate (if applicable)
//     possessionLetterUrl:{ type: String },
//     allottmentLetterUrl:{ type: String },
//   },

//   // ─── 10. OFF-PLAN DETAILS ─────────────────────────────────────────────────
//   offPlanDetails: {
//     developerName:          { type: String },
//     projectName:            { type: String },
//     expectedHandoverDate:   { type: Date },
//     constructionProgress:   { type: Number, min: 0, max: 100 }, // percentage
//     projectStatus: {
//       type: String,
//       enum: ['Under Construction', 'Finishing Stages', 'Completed'],
//     },
//     paymentPlan: {
//       downPaymentPercentage:    { type: Number },
//       isPostHandoverAvailable:  { type: Boolean, default: false },
//       milestones: [
//         {
//           milestone:  { type: String },   // e.g. "On Booking", "On Handover"
//           percentage: { type: Number },   // e.g. 20
//           dueDate:    { type: Date },
//         },
//       ],
//     },
//     brochureUrl: { type: String },
//     siteMapUrl:  { type: String },
//   },

//   // ─── 11. LEAD FLOW & ROUTING ──────────────────────────────────────────────
//   leadFlow: {
//     centralDeskWhatsapp: {
//       type: String,
//       default: process.env.ADMIN_WHATSAPP_NUMBER || '',
//     },
//     routingLogic: {
//       type: String,
//       default: 'Admin -> Agent Redirection',
//     },
//     callTrackingNumber: { type: String }, // masked number for call tracking
//   },

//   // ─── 12. METRICS & ANALYTICS ─────────────────────────────────────────────
//   metrics: {
//     viewCount:            { type: Number, default: 0 },
//     uniqueViewCount:      { type: Number, default: 0 }, // deduplicated by IP/user
//     whatsappInquiryCount: { type: Number, default: 0 },
//     callInquiryCount:     { type: Number, default: 0 },
//     emailInquiryCount:    { type: Number, default: 0 },
//     saveCount:            { type: Number, default: 0 }, // times saved/favourited
//     shareCount:           { type: Number, default: 0 },
//     lastViewedAt:         { type: Date },
//   },

//   // ─── 13. VERIFICATION (TruCheck equivalent) ───────────────────────────────
//   verification: {
//     isTruCheck:     { type: Boolean, default: false },
//     verifiedAt:     { type: Date },
//     verifiedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     verificationNote: { type: String },
//     // Physical inspection has confirmed property exists & matches listing
//   },

//   // ─── 14. LISTING QUALITY SCORE ────────────────────────────────────────────
//   qualityScore: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 100,
//     // Computed score based on:
//     // images count, description length, amenities filled,
//     // floor plan present, coordinates set, video present
//     // Used to rank listings in search results
//   },

//   // ─── 15. FEATURED & PROMOTION ────────────────────────────────────────────
//   isFeatured: {
//     type: Boolean,
//     default: false,
//   },
//   featuredUntil: {
//     type: Date, // auto-expire featured status
//   },
//   boostLevel: {
//     type: String,
//     enum: ['None', 'Standard', 'Premium', 'Platinum'],
//     default: 'None',
//     // Platinum = top of search, Premium = above fold, Standard = boosted in rank
//   },
//   boostExpiresAt: {
//     type: Date,
//   },

//   // ─── 16. SEO ──────────────────────────────────────────────────────────────
//   seo: {
//     metaTitle:       { type: String, maxlength: 70 },
//     metaDescription: { type: String, maxlength: 160 },
//     canonicalUrl:    { type: String },
//   },

//   // ─── 17. SOFT DELETE ──────────────────────────────────────────────────────
//   deletedAt: {
//     type: Date,
//     default: null,
//   },
//   deletedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Agent',
//   },

// }, { timestamps: true });


// // ─── INDEXES ──────────────────────────────────────────────────────────────
// PropertySchema.index({ price: 1, propertyType: 1, 'location.city': 1 });
// PropertySchema.index({ slug: 1 });
// PropertySchema.index({ referenceNumber: 1 });
// PropertySchema.index({ agent: 1, status: 1 });
// PropertySchema.index({ agency: 1, status: 1 });
// PropertySchema.index({ status: 1, deletedAt: 1 });
// PropertySchema.index({ purpose: 1, category: 1, propertyType: 1 });
// PropertySchema.index({ 'location.city': 1, 'location.community': 1 });
// PropertySchema.index({ 'location.coordinates': '2dsphere' });   // geo queries
// PropertySchema.index({ isFeatured: 1, featuredUntil: -1 });
// PropertySchema.index({ boostLevel: 1, boostExpiresAt: -1 });
// PropertySchema.index({ qualityScore: -1 });
// PropertySchema.index({ 'verification.isTruCheck': 1 });
// PropertySchema.index({ expiresAt: 1 });                          // for expiry cron
// PropertySchema.index({ price: 1, area: 1, bedrooms: 1 });        // filter combos
// PropertySchema.index({ completionStatus: 1, purpose: 1 });


// // ─── PRE-SAVE HOOKS ───────────────────────────────────────────────────────

// // 1. Auto-generate Slug
// PropertySchema.pre('save', async function () {
//   if (this.isModified('title') && !this.slug) {
//     const suffix = this._id.toString().slice(-6);
//     this.slug = this.title
//       .toLowerCase()
//       .trim()
//       .replace(/[^a-z0-9\s-]/g, '')
//       .replace(/\s+/g, '-')
//       .replace(/-+/g, '-')
//       + '-' + suffix;
//   }
// });

// // 2. Auto-calculate pricePerSqFt
// PropertySchema.pre('save', async function () {
//   if ((this.isModified('price') || this.isModified('area')) && this.area > 0) {
//     this.pricePerSqFt = Math.round(this.price / this.area);
//   }
// });

// // 3. Auto-generate human-readable referenceNumber
// PropertySchema.pre('save', async function () {
//   if (this.isNew && !this.referenceNumber) {
//     const year = new Date().getFullYear();
//     const rand = Math.floor(10000 + Math.random() * 90000);
//     this.referenceNumber = `LTK-${year}-${rand}`;
//   }
// });

// // 4. Auto-compute qualityScore
// PropertySchema.pre('save', async function () {
//   let score = 0;
//   const imgCount = this.images ? this.images.length : 0;
  
//   if (imgCount >= 8)  score += 15;
//   if (imgCount >= 12) score += 10;
//   if (imgCount >= 16) score += 5;
//   if (this.description && this.description.length >= 200) score += 15;
//   if (this.description && this.description.length >= 500) score += 5;
//   if (this.amenities && this.amenities.length >= 5)   score += 10;
//   if (this.floorPlan)                                score += 10;
//   if (this.videoUrl)                                 score += 10;
//   if (this.virtualTourUrl)                           score += 10;
//   if (this.location?.coordinates?.coordinates?.length === 2) {
//     score += 10;
//   }
//   if (this.verification?.isTruCheck) score += 10;
//   this.qualityScore = Math.min(score, 100);
// });


// // ─── INSTANCE METHODS ─────────────────────────────────────────────────────

// // Is this listing currently live and publicly visible?
// PropertySchema.methods.isLive = function () {
//   return this.status === 'Active' && !this.deletedAt;
// };

// // Is this listing currently featured?
// PropertySchema.methods.isFeaturedNow = function () {
//   if (!this.featuredUntil) return false;
//   return new Date() < this.featuredUntil;
// };

// // Is this listing boosted?
// PropertySchema.methods.isBoosted = function () {
//   if (this.boostLevel === 'None' || !this.boostExpiresAt) return false;
//   return new Date() < this.boostExpiresAt;
// };

// // Soft-delete this property
// PropertySchema.methods.softDelete = function (agentId) {
//   this.deletedAt = new Date();
//   this.deletedBy = agentId;
//   this.status    = 'Archived';
//   return this.save();
// };

// // Increment a specific metric atomically
// PropertySchema.methods.incrementMetric = function (field) {
//   return mongoose.model('Property').updateOne(
//     { _id: this._id },
//     { $inc: { [`metrics.${field}`]: 1 } }
//   );
// };


// const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);
// export default Property;









// import mongoose from "mongoose";

// const PropertySchema = new mongoose.Schema({

//   // ─── 1. SYSTEM HIERARCHY & OWNERSHIP ─────────────────────────────────────
//   agency: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
//   agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },

//   // ─── 2. LISTING STATUS & WORKFLOW ────────────────────────────────────────
//   status: {
//     type: String,
//     enum: ['Draft', 'Pending', 'Active', 'Sold', 'Rented', 'Rejected', 'Expired', 'Archived'],
//     default: 'Draft',
//   },
//   rejectionReason: { type: String, trim: true },
//   expiresAt: { type: Date },
//   approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   approvedAt: { type: Date },

//   // ─── 3. CORE LISTING DETAILS ──────────────────────────────────────────────
//   purpose: { type: String, enum: ['For Sale', 'For Rent'], required: true },
//   category: { type: String, enum: ['Residential', 'Commercial'], required: true },
//   propertyType: {
//     type: String,
//     enum: [
//       'Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Villa Compound',
//       'Hotel Apartment', 'Land', 'Floor', 'Building',
//       'Office', 'Shop', 'Warehouse', 'Labour Camp', 'Bulk Unit',
//       'Factory', 'Industrial Land', 'Mixed Use Land', 'Showroom', 'Other Commercial',
//       'House', 'Upper Portion', 'Lower Portion', 'Farm House', 'Room', 'Annexe',
//     ],
//     required: true,
//   },
//   title: { type: String, required: true, trim: true, maxlength: 150 },
//   slug: { type: String, unique: true, lowercase: true, trim: true },
//   description: { type: String, required: true, maxlength: 5000 },
//   referenceNumber: { type: String, unique: true },

//   // ─── 4. PRICING & PAYMENT STATUS ──────────────────────────────────────────
//   price: { type: Number, required: true },
//   pricePerSqFt: { type: Number },
//   currency: { type: String, enum: ['PKR', 'AED', 'USD'], default: 'PKR' },
//   rentFrequency: {
//     type: String,
//     enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
//     required: function () { return this.purpose === 'For Rent'; },
//   },
//   isNegotiable: { type: Boolean, default: false },
  
//   // NEW: Zameen-style Instalment/Possession logic
//   paymentStatus: {
//     isOnInstalments: { type: Boolean, default: false }, 
//     possessionPaid: { type: Boolean, default: false }, 
//     downPayment: { type: Number },
//     instalmentPeriodMonths: { type: Number },
//   },

//   priceHistory: [
//     {
//       price: { type: Number },
//       changedAt: { type: Date, default: Date.now },
//       changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
//     },
//   ],

//   // ─── 5. PHYSICAL ATTRIBUTES ───────────────────────────────────────────────
//   area: { type: Number, required: true },
//   areaUnit: {
//     type: String,
//     enum: ['Sqft', 'Sqm', 'Marla', 'Kanal', 'Acre'],
//     default: 'Sqft',
//   },
//   // NEW: Auto-calculated field for Zameen filters (5 Marla, 10 Marla, etc)
//   areaInMarla: { type: Number }, 
  
//   bedrooms: { type: Number, default: 0 },
//   bathrooms: { type: Number, default: 0 },
//   parkingSpaces: { type: Number, default: 0 },
//   floors: { type: Number },
//   floorNumber: { type: Number },
//   furnishingStatus: { type: String, enum: ['Furnished', 'Unfurnished', 'Partly Furnished'] },
//   completionStatus: { type: String, enum: ['Off-plan', 'Ready'], required: true },
//   occupancyStatus: { type: String, enum: ['Vacant', 'Tenanted'] },
//   age: { type: Number },
//   condition: { type: String, enum: ['New', 'Good', 'Needs Renovation'] },

//   // NEW: Commercial Specifics
//   commercialDetails: {
//     isRunningBusiness: { type: Boolean, default: false }, 
//     hasBasement: { type: Boolean, default: false },
//     hasLift: { type: Boolean, default: false },
//   },

//   // ─── 6. LOCATION ──────────────────────────────────────────────────────────
//   location: {
//     country: { type: String, default: 'Pakistan' },
//     city: { type: String, required: true, trim: true },
//     area: { type: String, trim: true },
//     community: { type: String, required: true, trim: true },
//     subCommunity: { type: String, trim: true },
//     building: { type: String, trim: true },
//     address: { type: String, trim: true },
//     nearbyLandmarks: [{ type: String }],
//     coordinates: {
//       type: { type: String, enum: ['Point'], default: 'Point' },
//       coordinates: { type: [Number], index: '2dsphere' },
//     },
//     mapEmbedUrl: { type: String },
//   },

//   // ─── 7. AMENITIES & FEATURES ──────────────────────────────────────────────
//   amenities: [{ type: String }],
//   features: {
//     hasSwimmingPool: { type: Boolean, default: false },
//     hasGym: { type: Boolean, default: false },
//     hasCentralAC: { type: Boolean, default: false },
//     hasBalcony: { type: Boolean, default: false },
//     hasMaidRoom: { type: Boolean, default: false },
//     hasStudyRoom: { type: Boolean, default: false },
//     hasCoveredParking: { type: Boolean, default: false },
//     hasBuiltInWardrobes: { type: Boolean, default: false },
//     hasCCTV: { type: Boolean, default: false },
//     hasMosque: { type: Boolean, default: false },
//     gasAvailable: { type: Boolean, default: false },
//     isCorner: { type: Boolean, default: false }, // Added for plot/house value
//   },

//   // ─── 8. MEDIA ─────────────────────────────────────────────────────────────
//   images: {
//     type: [{ originalUrl: { type: String, required: true } }],
//     validate: {
//       validator: function (v) { return v.length >= 8 && v.length <= 16; },
//       message: 'Property must have between 8 and 16 images.',
//     },
//   },
//   videoUrl: { type: String },
//   virtualTourUrl: { type: String },
//   floorPlan: { type: String },
//   floorPlanInteractiveUrl: { type: String },
//   documentUrls: [{ label: String, url: String }],

//   // ─── 9. LEGAL & COMPLIANCE ────────────────────────────────────────────────
//   legal: {
//     ownerName: { type: String },
//     ownerCNIC: { type: String, required: true },
//     ownerEmail: { type: String, required: true },
//     ownerPhone: { type: String },
//     marketingContract: { type: String, required: true },
//     titleDeedUrl: { type: String },
//     nocUrl: { type: String },
//     possessionLetterUrl: { type: String },
//     allottmentLetterUrl: { type: String },
//   },

//   // ─── 10. OFF-PLAN DETAILS ─────────────────────────────────────────────────
//   offPlanDetails: {
//     developerName: { type: String },
//     projectName: { type: String },
//     expectedHandoverDate: { type: Date },
//     constructionProgress: { type: Number, min: 0, max: 100 },
//     projectStatus: { type: String, enum: ['Under Construction', 'Finishing Stages', 'Completed'] },
//     paymentPlan: {
//       downPaymentPercentage: { type: Number },
//       isPostHandoverAvailable: { type: Boolean, default: false },
//       milestones: [{ milestone: String, percentage: Number, dueDate: Date }],
//     },
//     brochureUrl: { type: String },
//     siteMapUrl: { type: String },
//   },

//   // ─── 11. LEAD FLOW & ROUTING ──────────────────────────────────────────────
//   leadFlow: {
//     centralDeskWhatsapp: { type: String, default: process.env.ADMIN_WHATSAPP_NUMBER || '' },
//     routingLogic: { type: String, default: 'Admin -> Agent Redirection' },
//     callTrackingNumber: { type: String },
//   },

//   // ─── 12. METRICS & ANALYTICS ─────────────────────────────────────────────
//   metrics: {
//     viewCount: { type: Number, default: 0 },
//     uniqueViewCount: { type: Number, default: 0 },
//     whatsappInquiryCount: { type: Number, default: 0 },
//     callInquiryCount: { type: Number, default: 0 },
//     emailInquiryCount: { type: Number, default: 0 },
//     saveCount: { type: Number, default: 0 },
//     shareCount: { type: Number, default: 0 },
//     lastViewedAt: { type: Date },
//   },

//   // ─── 13. VERIFICATION (TruCheck equivalent) ───────────────────────────────
//   verification: {
//     isTruCheck: { type: Boolean, default: false },
//     verifiedAt: { type: Date },
//     verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     verificationNote: { type: String },
//   },

//   // ─── 14. LISTING QUALITY SCORE ────────────────────────────────────────────
//   qualityScore: { type: Number, default: 0, min: 0, max: 100 },

//   // ─── 15. FEATURED & PROMOTIONS ────────────────────────────────────────────
//   isFeatured: { type: Boolean, default: false },
//   featuredUntil: { type: Date },
//   boostLevel: { type: String, enum: ['None', 'Standard', 'Premium', 'Platinum'], default: 'None' },
//   boostExpiresAt: { type: Date },

//   // ─── 16. SEO & SOFT DELETE ────────────────────────────────────────────────
//   seo: { metaTitle: { type: String, maxlength: 70 }, metaDescription: { type: String, maxlength: 160 }, canonicalUrl: { type: String } },
//   deletedAt: { type: Date, default: null },
//   deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },

// }, { timestamps: true });

// // ─── INDEXES ──────────────────────────────────────────────────────────────
// PropertySchema.index({ areaInMarla: 1 }); // Index for fast "Browse by Marla" filters
// PropertySchema.index({ "paymentStatus.isOnInstalments": 1 });
// PropertySchema.index({ "commercialDetails.isRunningBusiness": 1 });

// // ─── PRE-SAVE HOOKS ───────────────────────────────────────────────────────

// // 1. Auto-calculate areaInMarla & pricePerSqFt
// PropertySchema.pre('save', async function () {
//   // Area standardization (Zameen-style)
//   if (this.isModified('area') || this.isModified('areaUnit')) {
//     let factor = 1;
//     if (this.areaUnit === 'Sqft') factor = 1 / 225;
//     else if (this.areaUnit === 'Kanal') factor = 20;
//     else if (this.areaUnit === 'Sqm') factor = 1 / 20.9;
//     else if (this.areaUnit === 'Acre') factor = 160;
    
//     this.areaInMarla = Number((this.area * factor).toFixed(2));
//   }

//   // Price per SqFt calculation
//   if ((this.isModified('price') || this.isModified('area')) && this.area > 0) {
//     // Standardize area back to SqFt for this specific metric if unit is different
//     let areaInSqft = this.area;
//     if (this.areaUnit === 'Marla') areaInSqft = this.area * 225;
//     if (this.areaUnit === 'Kanal') areaInSqft = this.area * 4500;
    
//     this.pricePerSqFt = Math.round(this.price / areaInSqft);
//   }
// });

// // [Keep existing hooks for Slug, ReferenceNumber, and QualityScore...]

// const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);
// export default Property;











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
  // slug: { type: String, unique: true, lowercase: true, trim: true },
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
    block: { type: String, trim: true }, // Added Block (e.g. Block A)
    phase: { type: String, trim: true }, // Added Phase (e.g. Phase 6)
    building: { type: String, trim: true },
    address: { type: String, trim: true },
    nearbyLandmarks: [{ type: String }],
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere' },
    },
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