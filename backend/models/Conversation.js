const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  // Always exactly two participants: [clientId, freelancerId]
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }],

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  projectTitle: { type: String, default: "" },

  // Quick access to last message for listing
  lastMessage:   { type: String, default: "" },
  lastMessageAt: { type: Date, default: Date.now },

  // Unread counts per participant: { userId: count }
  unreadCounts: {
    type: Map,
    of: Number,
    default: {},
  },

}, { timestamps: true });

conversationSchema.index({ participants: 1 });
conversationSchema.index({ projectId: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);
