import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      default: null,
      index: true,
    },
    channel: {
      type: String,
      enum: ["WhatsApp", "Call", "Form"],
      default: "WhatsApp",
    },
    source: {
      type: String,
      enum: ["PropertyDetail", "SearchResults", "AgentProfile", "SharedLink"],
      default: "PropertyDetail",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Forwarded", "Converted", "Closed"],
      default: "New",
      index: true,
    },
    adminNote: {
      type: String,
      default: null,
    },
    forwardedToAgentAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Admin inbox — newest unhandled leads first
leadSchema.index({ status: 1, createdAt: -1 });

// Agent's forwarded leads
leadSchema.index({ agentId: 1, status: 1 });

const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

export default Lead;