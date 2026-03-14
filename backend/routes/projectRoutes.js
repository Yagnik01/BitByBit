const express = require("express");
const router  = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  analyzeProjectWithAI,
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  applyToProject,
  acceptApplication,
  getFreelancerProjects,
  getEmployerProjects,
  acquireProject,
} = require("../controllers/projectController");

router.get("/test", (req, res) => res.json({ ok: true }));

router.post  ("/analyze",                           analyzeProjectWithAI);        // public
router.post  ("/create",               protect,     createProject);
router.get   ("/",                                  getAllProjects);               // public
router.get   ("/:id",                               getProjectById);              // public
router.put   ("/:id",                  protect,     updateProject);
router.post  ("/:id/apply",            protect,     applyToProject);
router.post  ("/:id/accept/:applicationId", protect, acceptApplication);
router.get   ("/my-projects/:userId",  protect,     getFreelancerProjects);
router.get   ("/employer-projects/:userId", protect, getEmployerProjects);
router.post  ("/acquire/:id",          protect,     acquireProject);              // legacy

module.exports = router;
