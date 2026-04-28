import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({

  // ─── AGENCY RELATIONSHIP ──────────────────────────────────────────────────
  agency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency',
    required: [true, 'An agent must be affiliated with a registered company/agency'],
  },

  // ─── BASIC IDENTITY ───────────────────────────────────────────────────────
  fullName: {
    type: String,
    required: [true, 'Agent name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required for login and notifications'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    // direct call number (separate from WhatsApp)
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  whatsappNumber: {
    type: String,
    required: [true, 'WhatsApp number is required for internal lead routing'],
  },
  cnic: {
    type: String,
    required: [true, 'CNIC is mandatory for legal verification'],
    unique: true,
  },
  cnicFrontUrl: {
    type: String, // CNIC front image upload
  },
  cnicBackUrl: {
    type: String, // CNIC back image upload
  },
  nationality: {
    type: String,
  },

  // ─── AUTHENTICATION ───────────────────────────────────────────────────────

  phoneVerified: {
    type: Boolean,
    default: false,
  },

  lastLoginAt: {
    type: Date, // track last login for activity badges
  },

  // ─── PROFILE MEDIA ────────────────────────────────────────────────────────
  profilePicture: {
    type: String,
    required: [true, 'Agent picture is required for the property listing card'],
  },
  coverImageUrl: {
    type: String, // banner/header image on agent's public profile page
  },

  // ─── PROFESSIONAL BRANDING ────────────────────────────────────────────────
  aboutAgent: {
    type: String,
    trim: true,
  },
  experienceSince: {
    type: Date, // used to calculate years of experience
  },
  brnNumber: {
    type: String,
    unique: true,
    sparse: true, // Broker Registration/License Number
  },
  languages: [{ type: String }],

  // ─── SERVICE AREAS & EXPERTISE ────────────────────────────────────────────
  serviceAreas: [{ type: String }],
  serviceCity: {
    type: String,
    trim: true, // primary city for city-level filtering
  },
  specialization: {
    type: String,
    enum: ['Sales', 'Rentals', 'Off-plan', 'Commercial', 'Residential'],
    default: 'Residential',
  },
  propertyTypes: [
    {
      type: String,
      enum: ['Apartment', 'House', 'Villa', 'Plot', 'Commercial', 'Warehouse', 'Farm House'],
      // which property types this agent handles
    },
  ],

  // ─── ROLE & PERMISSIONS ───────────────────────────────────────────────────
  role: {
    type: String,
    default: 'Agent',
  },
  belongsToAgency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency',
    required: true,
  },

  // ─── VERIFICATION & STATUS ────────────────────────────────────────────────
  isVerified: {
    type: Boolean,
    default: false, // verified by platform admin
  },
  verifiedAt: {
    type: Date,
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency', 
  },
  accountStatus: {
  type: String,
  enum: ["active", "suspended", "rejected", "blocked"],
  default: "active",
  },
  rejectionReason: {
    type: String,
    trim: true, // shown when agent application is rejected by agency or admin
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isPubliclyVisible: {
    type: Boolean,
    default: true, // agency manager can hide agent without deactivating
  },
  suspensionReason: {
    type: String,
    trim: true,
  },
  blockReason: {
    type: String,
    trim: true,
  },

  // ─── RANK & FEATURED ──────────────────────────────────────────────────────
  agentRank: {
    type: String,
    enum: ['Junior', 'Mid-Level', 'Senior', 'Top Performer'],
    default: 'Junior',
  },
  isFeatured: {
    type: Boolean,
    default: false, // featured agents appear at top of search results
  },
  featuredUntil: {
    type: Date, // auto-expire featured status
  },

  // ─── TRUST & RESPONSE METRICS ─────────────────────────────────────────────
  avgResponseTime: {
    type: String,
    default: 'under 1 hour',
    // e.g. 'under 1 hour', 'within a few hours', 'within a day'
  },
  responseRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100, // percentage: how often agent responds to leads
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },

  // ─── AWARDS & ACHIEVEMENTS ────────────────────────────────────────────────
  awards: [
    {
      title:  { type: String }, // e.g. "Top Agent Q3 2024"
      year:   { type: Number },
      issuer: { type: String }, // e.g. "Agency" or "Platform"
    },
  ],
  badges: [
    {
      type: String,
      enum: ['Top Performer', 'Quick Responder', 'Highly Rated', 'Verified Expert'],
      // shown as tags on listing cards and profile
    },
  ],

  // ─── SOCIAL LINKS ─────────────────────────────────────────────────────────
  socialLinks: {
    linkedin:  { type: String },
    instagram: { type: String },
    twitter:   { type: String },
    youtube:   { type: String },
    facebook:  { type: String },
  },

  // ─── LISTING STATS (denormalized for fast display) ────────────────────────
  totalListings: {
    type: Number,
    default: 0,
  },
  activeListings: {
    type: Number,
    default: 0, // currently live listings count
  },
  totalViews: {
    type: Number,
    default: 0, // total profile + listing views
  },
  totalLeads: {
    type: Number,
    default: 0, // total inquiries received
  },
  closedDealsCount: {
    type: Number,
    default: 0,
  },
  closedProperties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
    },
  ],

  // ─── LISTING LIMITS (inherited from agency plan, overridable) ─────────────
  maxListings: {
    type: Number,
    default: 10, // hard cap — enforced before a new listing is created
  },

  // ─── SOFT DELETE ──────────────────────────────────────────────────────────
  deletedAt: {
    type: Date,
    default: null, // null = active; set to Date.now() to soft-delete
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency', // agency manager who removed this agent
  },

}, {
  timestamps: true, // createdAt + updatedAt
});


// ─── INDEXES ──────────────────────────────────────────────────────────────
agentSchema.index({ agency: 1, email: 1 });
agentSchema.index({ agency: 1, isActive: 1 });
agentSchema.index({ agency: 1, isVerified: 1 });
agentSchema.index({ serviceAreas: 1 });
agentSchema.index({ serviceCity: 1 });
agentSchema.index({ specialization: 1 });
agentSchema.index({ agentRank: 1 });
agentSchema.index({ rating: -1, reviewCount: -1 });
agentSchema.index({ isFeatured: 1, featuredUntil: -1 });
agentSchema.index({ deletedAt: 1 });
agentSchema.index({ agency: 1, deletedAt: 1, isActive: 1 }); // compound for agency dashboard


// ─── PRE-SAVE: auto-generate slug from fullName ──────────────────────────
// Remove the 'next' parameter and make the function async
// agentSchema.pre('save', async function () {
//   // 1. Double-check 'this' is defined
//   if (!this) return;

//   // 2. Slug generation logic
//   if (this.isModified('fullName') && !this.slug) {
//     this.slug = this.fullName
//       .toLowerCase()
//       .trim()
//       .replace(/[^a-z0-9\s-]/g, '')  // strip special chars
//       .replace(/\s+/g, '-')           // spaces → hyphens
//       .replace(/-+/g, '-');           // collapse double hyphens
//   }
  
//   // No next() call needed here; resolving the function is enough
// });


// ─── INSTANCE METHODS ────────────────────────────────────────────────────

// Can this agent create a new listing?
agentSchema.methods.canListProperty = function () {
  return (
    this.isVerified &&
    this.isActive &&
    !this.deletedAt &&
    this.activeListings < this.maxListings
  );
};

// Has this agent hit their listing cap?
agentSchema.methods.hasReachedListingLimit = function () {
  return this.activeListings >= this.maxListings;
};

// Is this agent currently featured?
agentSchema.methods.isFeaturedNow = function () {
  if (!this.featuredUntil) return false;
  return new Date() < this.featuredUntil;
};

// How many years of experience does this agent have?
agentSchema.methods.yearsOfExperience = function () {
  if (!this.experienceSince) return 0;
  const ms = Date.now() - new Date(this.experienceSince).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
};

// Soft-delete this agent (called by agency manager)
agentSchema.methods.softDelete = function (deletedByAgencyId) {
  this.deletedAt = new Date();
  this.deletedBy = deletedByAgencyId;
  this.isActive = false;
  return this.save();
};


const Agent = mongoose.models.Agent || mongoose.model('Agent', agentSchema);
export default Agent;