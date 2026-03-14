const mongoose = require("mongoose");

const portfolioProjectSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: "" },
  link:        { type: String, default: "" },
  tags:        [{ type: String }],
  image:       { type: String, default: "" },
}, { timestamps: true });

const experienceSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  company:     { type: String, required: true },
  period:      { type: String, default: "" },
  description: { type: String, default: "" },
});

const skillSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  level:    { type: Number, default: 80, min: 1, max: 100 },
  category: { type: String, default: "General" },
});

const userSchema = new mongoose.Schema({
  // ── Auth fields (already exist) ──
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // ── Profile fields (new) ──
  title:       { type: String, default: "" },
  bio:         { type: String, default: "" },
  tagline:     { type: String, default: "" },
  avatar:      { type: String, default: "" },
  coverImage:  { type: String, default: "" },
  location:    { type: String, default: "" },
  timezone:    { type: String, default: "" },
  hourlyRate:  { type: Number, default: 0 },
  languages:   [{ type: String }],

  skills:    [skillSchema],
  portfolio: [portfolioProjectSchema],
  experience:[experienceSchema],

  socialLinks: {
    github:   { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter:  { type: String, default: "" },
    website:  { type: String, default: "" },
  },

  // ── Stats (kept simple, can be computed later) ──
  completedJobs: { type: Number, default: 0 },
  successRate:   { type: Number, default: 0 },
  totalEarnings: { type: String, default: "₹0" },

  isVerified:       { type: Boolean, default: false },
  isTopRated:       { type: Boolean, default: false },
  availableForHire: { type: Boolean, default: true },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
