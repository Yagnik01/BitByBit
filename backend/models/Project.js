const mongoose = require("mongoose");

// ── AI Verification result sub-document ──────────────────────────────────────
const aiVerificationSchema = new mongoose.Schema({
  score:    { type: Number, default: 0 },
  status:   { type: String, enum: ["pending", "approved", "rejected", "needs_revision"], default: "pending" },
  feedback: { type: String, default: "" },
  verifiedAt: { type: Date },
}, { _id: false });

// ── Submission sub-document ───────────────────────────────────────────────────
const submissionSchema = new mongoose.Schema({
  githubLink:   { type: String, default: "" },
  notes:        { type: String, default: "" },
  submittedAt:  { type: Date, default: Date.now },
  submittedBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  aiVerification: aiVerificationSchema,
}, { _id: false });

// ── Milestone sub-document ───────────────────────────────────────────────────
const milestoneSchema = new mongoose.Schema({
  title:             { type: String, required: true },
  description:       { type: String, default: "" },
  timeline:          { type: String, default: "" },
  budget_allocation: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["pending", "submitted", "in-review", "completed", "paid", "rejected"],
    default: "pending",
  },
  submission:     submissionSchema,
  escrowReleased: { type: Boolean, default: false },
  paidAt:         { type: Date },
  dueDate:        { type: Date },
}, { _id: true });

// ── Application sub-document ─────────────────────────────────────────────────
const applicationSchema = new mongoose.Schema({
  freelancerId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  freelancerName: { type: String, required: true },
  coverLetter:    { type: String, default: "" },
  bidAmount:      { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  appliedAt: { type: Date, default: Date.now },
}, { _id: true });

// ── Main Project schema ───────────────────────────────────────────────────────
const projectSchema = new mongoose.Schema({
  title:          { type: String, default: "" },
  description:    { type: String, required: true },
  domain:         { type: String, default: "" },
  requiredSkills: [{ type: String }],
  total_budget:   { type: Number, default: 0 },
  timeline:       { type: String, default: "" },

  employerId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  freelancerId:{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

  status: {
    type: String,
    enum: ["draft", "open", "in-progress", "completed", "cancelled"],
    default: "open",
  },

  milestones:   [milestoneSchema],
  applications: [applicationSchema],

  aiAnalysis: {
    domain:            { type: String, default: "" },
    suggestedSkills:   [{ type: String }],
    suggestedTimeline: { type: String, default: "" },
    note:              { type: String, default: "" },
    generatedAt:       { type: Date },
  },

  escrowAmount: { type: Number, default: 0 },
  paymentStatus: {
    type: String,
    enum: ["none", "escrowed", "partially-released", "fully-released"],
    default: "none",
  },

}, { timestamps: true });

projectSchema.index({ employerId: 1 });
projectSchema.index({ freelancerId: 1 });
projectSchema.index({ status: 1 });

module.exports = mongoose.model("Project", projectSchema);
