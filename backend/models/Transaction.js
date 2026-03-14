const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  // Parties
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  toUserId:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  type: {
    type: String,
    enum: [
      "escrow_deposit",      // Client locks funds into escrow
      "milestone_payment",   // AI approves → escrow → freelancer
      "refund",              // Milestone rejected → escrow back to client
    ],
    required: true,
  },

  amount: { type: Number, required: true, min: 0 },

  // Context
  projectId:    { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  projectTitle: { type: String, default: "" },
  milestoneId:  { type: String, default: "" },   // subdoc _id as string
  milestoneTitle:{ type: String, default: "" },

  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed",
  },

  description: { type: String, default: "" },

}, { timestamps: true });

transactionSchema.index({ fromUserId: 1 });
transactionSchema.index({ toUserId:   1 });
transactionSchema.index({ projectId:  1 });

module.exports = mongoose.model("Transaction", transactionSchema);
