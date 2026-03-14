const User = require("../models/User");

// ─────────────────────────────────────────────
// Helper – strip password before sending user
// ─────────────────────────────────────────────
const sanitize = (user) => {
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

// ─────────────────────────────────────────────
// GET  /api/users/profile
// Returns the logged-in user's full profile
// ─────────────────────────────────────────────
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("getMyProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// GET  /api/users/profile/:id
// Returns any user's public profile
// ─────────────────────────────────────────────
exports.getProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("getProfileById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// PUT  /api/users/profile
// Update core profile fields (no skills/portfolio – handled separately)
// ─────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const allowed = [
      "name", "title", "bio", "tagline", "avatar",
      "coverImage", "location", "timezone", "hourlyRate",
      "languages", "socialLinks", "availableForHire",
      "completedJobs", "successRate", "totalEarnings",
    ];

    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// POST  /api/users/skills
// Add a skill  { name, level, category }
// ─────────────────────────────────────────────
exports.addSkill = async (req, res) => {
  try {
    const { name, level = 80, category = "General" } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: "Skill name is required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const exists = user.skills.some(
      (s) => s.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (exists) return res.status(400).json({ message: "Skill already exists" });

    user.skills.push({ name: name.trim(), level: Number(level), category });
    await user.save();

    res.status(201).json(user.skills);
  } catch (err) {
    console.error("addSkill error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// DELETE  /api/users/skills/:skillId
// Remove a skill by its sub-document _id
// ─────────────────────────────────────────────
exports.removeSkill = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const before = user.skills.length;
    user.skills = user.skills.filter(
      (s) => s._id.toString() !== req.params.skillId
    );
    if (user.skills.length === before) {
      return res.status(404).json({ message: "Skill not found" });
    }

    await user.save();
    res.json(user.skills);
  } catch (err) {
    console.error("removeSkill error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// POST  /api/users/portfolio
// Add a portfolio project { title, description, link, tags, image }
// ─────────────────────────────────────────────
exports.addPortfolioProject = async (req, res) => {
  try {
    const { title, description = "", link = "", tags = [], image = "" } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ message: "Project title is required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.portfolio.push({
      title: title.trim(),
      description,
      link,
      tags: Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim()).filter(Boolean),
      image,
    });
    await user.save();

    res.status(201).json(user.portfolio);
  } catch (err) {
    console.error("addPortfolioProject error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// PUT  /api/users/portfolio/:projectId
// Update a portfolio project
// ─────────────────────────────────────────────
exports.updatePortfolioProject = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const project = user.portfolio.id(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Portfolio project not found" });

    const { title, description, link, tags, image } = req.body;
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (link !== undefined) project.link = link;
    if (image !== undefined) project.image = image;
    if (tags !== undefined) {
      project.tags = Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    await user.save();
    res.json(user.portfolio);
  } catch (err) {
    console.error("updatePortfolioProject error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// DELETE  /api/users/portfolio/:projectId
// Remove a portfolio project
// ─────────────────────────────────────────────
exports.deletePortfolioProject = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const before = user.portfolio.length;
    user.portfolio = user.portfolio.filter(
      (p) => p._id.toString() !== req.params.projectId
    );
    if (user.portfolio.length === before) {
      return res.status(404).json({ message: "Portfolio project not found" });
    }

    await user.save();
    res.json(user.portfolio);
  } catch (err) {
    console.error("deletePortfolioProject error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// POST  /api/users/experience
// Add experience entry
// ─────────────────────────────────────────────
exports.addExperience = async (req, res) => {
  try {
    const { title, company, period = "", description = "" } = req.body;
    if (!title || !company) return res.status(400).json({ message: "Title and company are required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.experience.push({ title, company, period, description });
    await user.save();
    res.status(201).json(user.experience);
  } catch (err) {
    console.error("addExperience error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────
// DELETE  /api/users/experience/:expId
// ─────────────────────────────────────────────
exports.deleteExperience = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.experience = user.experience.filter(
      (e) => e._id.toString() !== req.params.expId
    );
    await user.save();
    res.json(user.experience);
  } catch (err) {
    console.error("deleteExperience error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
