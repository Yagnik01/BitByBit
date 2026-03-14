const express = require("express");
const router  = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  getMyProfile,
  getProfileById,
  updateProfile,
  addSkill,
  removeSkill,
  addPortfolioProject,
  updatePortfolioProject,
  deletePortfolioProject,
  addExperience,
  deleteExperience,
} = require("../controllers/userController");

// ── Public ──────────────────────────────────────────────────────────────────
router.get("/profile/:id", getProfileById);          // GET  /api/users/profile/:id

// ── Protected (JWT required) ─────────────────────────────────────────────────
router.get   ("/profile",                protect, getMyProfile);          // GET  /api/users/profile
router.put   ("/profile",                protect, updateProfile);         // PUT  /api/users/profile

router.post  ("/skills",                 protect, addSkill);              // POST /api/users/skills
router.delete("/skills/:skillId",        protect, removeSkill);           // DEL  /api/users/skills/:skillId

router.post  ("/portfolio",              protect, addPortfolioProject);   // POST /api/users/portfolio
router.put   ("/portfolio/:projectId",   protect, updatePortfolioProject);// PUT  /api/users/portfolio/:projectId
router.delete("/portfolio/:projectId",   protect, deletePortfolioProject);// DEL  /api/users/portfolio/:projectId

router.post  ("/experience",             protect, addExperience);         // POST /api/users/experience
router.delete("/experience/:expId",      protect, deleteExperience);      // DEL  /api/users/experience/:expId

module.exports = router;
