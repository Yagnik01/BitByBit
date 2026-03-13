const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema({
  projectId: String,
  title: String,
  description: String,
  amount: Number,
  status: {
    type: String,
    default: "pending",
  },
});

module.exports = mongoose.model("Milestone", milestoneSchema);