const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  analyzeProjectWithAI,
  createProject,
  getAllProjects,
  acquireProject,
  getFreelancerProjects,
  getEmployerProjects,
} = require("../controllers/projectController.js");

router.get("/test", (req, res) => res.json({ message: "Project routes working" }));

router.post("/analyze", analyzeProjectWithAI);                          // POST /api/projects/analyze
router.post("/create", protect, createProject);                         // POST /api/projects/create
router.get("/", getAllProjects);                                         // GET  /api/projects/
router.post("/acquire/:id", protect, acquireProject);                   // POST /api/projects/acquire/:id
router.get("/my-projects/:userId", protect, getFreelancerProjects);     // GET  /api/projects/my-projects/:userId
router.get("/employer-projects/:userId", protect, getEmployerProjects); // GET  /api/projects/employer-projects/:userId

module.exports = router;
