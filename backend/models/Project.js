const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema({
  title: String,
  description: String,
  timeline: String,
  budget_allocation: Number,

  status: {
    type: String,
    default: "pending"
  }
});

const projectSchema = new mongoose.Schema(
{
  description: String,

  domain: String,

  total_budget: Number,

  timeline: String,

  employerId: String,

  freelancerId: {
    type: String,
    default: null
  },

  status: {
    type: String,
    default: "draft"
  },

  milestones: [milestoneSchema]

},
{timestamps:true}
);

module.exports = mongoose.model("Project", projectSchema);