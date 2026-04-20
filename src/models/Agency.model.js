import mongoose from 'mongoose';

const AgencySchema = new mongoose.Schema({

  // ─── COMPANY IDENTITY ────────────────────────────────────────────────────
  companyName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  }, 
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    // e.g. "al-hamd-real-estate" → used in /agencies/al-hamd-real-estate
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  yearEstablished: {
    type: Number,
    trim: true,
  },

  // ─── CONTACT INFORMATION ─────────────────────────────────────────────────
  officialEmail: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
  },
  officialNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  whatsappNumber: {
    type: String, // separate WhatsApp number (common in Pakistan market)
    trim: true,
    unique: true,
  },
  officeAddress: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    trim: true,  
  },
  country: {
    type: String,
    default: 'Pakistan',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // ─── AUTHENTICATION ───────────────────────────────────────────────────────
  emailVerified: {
    type: Boolean,
    default: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },

  // ─── OWNER / KYC ─────────────────────────────────────────────────────────
  ownerName: {
    type: String,
    required: true,
  },
  ownerCNIC: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  ownerCNICFrontUrl: {
    type: String, // CNIC front image upload
    trim: true,
  },
  ownerCNICBackUrl: {
    type: String, // CNIC back image upload
    trim: true,
  },

  // ─── DOCUMENTS / VERIFICATION FILES ──────────────────────────────────────
  utilityBillUrl: {
    type: String,
    required: true,
    trim: true,
  },
  registrationCertificateUrl: {
    type: String, // business registration certificate
    trim: true,
  },

  // ─── PROFILE MEDIA ───────────────────────────────────────────────────────
  companyLogo: {
    type: String,
    required: true,
  },
  coverImageUrl: {
    type: String, // banner image shown on public agency profile page
    trim: true,
  },
  galleryImages: [
    {
      type: String, // office photos, team photos, etc.
      trim: true,
    },
  ],

  // ─── PROFILE CONTENT ─────────────────────────────────────────────────────
  companyBio: {
    type: String,
    trim: true,
  },
  companyWebsite: {
    type: String,
    trim: true,
  },

  // ─── SOCIAL LINKS ────────────────────────────────────────────────────────
  socialLinks: {
    linkedin:  { type: String , trim: true },
    facebook:  { type: String, trim: true },
    instagram: { type: String, trim: true },
    twitter:   { type: String, trim: true },
    youtube:   { type: String, trim: true },
  },

  // ─── SERVICE PROFILE ─────────────────────────────────────────────────────
  languagesSpoken: [{ type: String }],
  serviceAreas:    [{ type: String }],
  specialization: {
    type: String,
    enum: ['Residential', 'Commercial', 'Both'],
    default: 'Both',
  },

  // ─── SUBSCRIPTION & PLAN ─────────────────────────────────────────────────
  subscriptionPlan: {
    type: String,
    enum: ['Free', 'Basic', 'Premium', 'Enterprise'],
    default: 'Free',
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  subscriptionStartDate: {
    type: Date,
  },
  subscriptionEndDate: {
    type: Date, // when the plan expires
  },
  featuredUntil: {
    type: Date, // agency appears at top of search results until this date
  },

  // ─── LIMITS (enforced by plan) ────────────────────────────────────────────
  maxAgents: {
    type: Number,
    default: 30, // Free plan: 30 agents max
  },
  maxListings: {
    type: Number,
    default: 500, // Free plan: 500 listings max
  },

  // ─── VERIFICATION ────────────────────────────────────────────────────────
  verificationStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Suspended', 'Rejected'],
    default: 'Pending',
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // which admin approved this agency
  },
  verifiedAt: {
    type: Date,
  },
  rejectionReason: {
    type: String,
    trim: true, // shown to agency when status = Rejected
  },
  suspensionReason: {
    type: String,
    trim: true, // shown to agency when status = Suspended
  },

  // ─── STATUS FLAGS ─────────────────────────────────────────────────────────
  isActive: {
    type: Boolean,
    default: true,
  },
  isPubliclyVisible: {
    type: Boolean,
    default: true, // admin can hide agency from public search without suspending
  },

  // ─── RATINGS & REVIEWS ───────────────────────────────────────────────────
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

  // ─── AWARDS ──────────────────────────────────────────────────────────────
  awards: [
    {
      title:  { type: String }, // e.g. "Agency of the Quarter"
      year:   { type: Number },
      issuer: { type: String }, // e.g. "Zameen Awards 2024"
    },
  ],

  // ─── STATS (denormalized for fast display) ────────────────────────────────
  totalAgents: {
    type: Number,
    default: 0,
  },
  totalListings: {
    type: Number,
    default: 0,
  },
  totalSoldProperties: {
    type: Number,
    default: 0, // completed/sold listings count
  },
  totalViews: {
    type: Number,
    default: 0, // profile page view count
  },
  totalLeads: {
    type: Number,
    default: 0, // total inquiries received
  },

  // ─── ACTIVITY & SOFT DELETE ───────────────────────────────────────────────
  lastActiveAt: {
    type: Date, // updated on each login; used for "active in last 30 days" badge
  },
  deletedAt: {
    type: Date,
    default: null, // null = not deleted; soft delete pattern
  },

}, { timestamps: true }); // adds createdAt + updatedAt automatically


// ─── INDEXES ───────────────────────────────────────────────────────────────
// AgencySchema.index({ slug: 1 });
AgencySchema.index({ verificationStatus: 1, isActive: 1 });
AgencySchema.index({ serviceAreas: 1 });
AgencySchema.index({ city: 1 });
AgencySchema.index({ subscriptionPlan: 1, featuredUntil: -1 });
AgencySchema.index({ rating: -1, reviewCount: -1 });
AgencySchema.index({ deletedAt: 1 });
AgencySchema.index({ isPubliclyVisible: 1, verificationStatus: 1 });


// ─── INSTANCE METHODS ─────────────────────────────────────────────────────

// Can agents of this agency list a property?
AgencySchema.methods.canListProperty = function () {
  return (
    this.verificationStatus === 'Verified' &&
    this.isActive &&
    !this.deletedAt
  );
};

// Has this agency reached its agent limit?
AgencySchema.methods.hasReachedAgentLimit = function () {
  return this.totalAgents >= this.maxAgents;
};

// Has this agency reached its listing limit?
AgencySchema.methods.hasReachedListingLimit = function () {
  return this.totalListings >= this.maxListings;
};

// Is the agency's subscription currently active?
AgencySchema.methods.isSubscriptionActive = function () {
  if (!this.subscriptionEndDate) return false;
  return new Date() < this.subscriptionEndDate;
};

// Is this agency featured right now?
AgencySchema.methods.isFeatured = function () {
  if (!this.featuredUntil) return false;
  return new Date() < this.featuredUntil;
};


// ─── PRE-SAVE HOOK: auto-generate slug from companyName ───────────────────
AgencySchema.pre('save', function () {
  
  if (this.isModified('companyName')) {
    this.slug = this.companyName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')   // remove special chars
      .replace(/\s+/g, '-')            // spaces to hyphens
      .replace(/-+/g, '-');            // collapse multiple hyphens
  }
});


const Agency = mongoose.models.Agency || mongoose.model('Agency', AgencySchema);
export default Agency;
