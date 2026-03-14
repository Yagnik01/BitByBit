const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  senderId:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  senderName:  { type: String, default: "" },

  type: {
    type: String,
    enum: [
      "freelancer_applied",
      "application_accepted",
      "application_rejected",
      "project_completed",
      "milestone_updated",
      "milestone_submitted",
      "milestone_approved",
      "milestone_rejected",
      "payment_released",
      "new_message",
    ],
    required: true,
  },

  title:   { type: String, required: true },
  message: { type: String, required: true },

  projectId:    { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  projectTitle: { type: String, default: "" },

  read: { type: Boolean, default: false },

}, { timestamps: true });

notificationSchema.index({ recipientId: 1, read: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
