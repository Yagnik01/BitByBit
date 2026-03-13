const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: String,

    description: String,

    skills: [String],

    budget: Number,

    timeline: Number,

    employerId: String,

    freelancerId: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["open", "in-progress", "completed"],
      default: "open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);