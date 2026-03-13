const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");


router.get("/test", (req,res)=>{
  res.send("Test route working");
});

const {
  analyzeProjectWithAI,
  createProject,
  getAllProjects,
  acquireProject,
  getFreelancerProjects,
} = require("../controllers/projectController.js");

router.post("/analyze", analyzeProjectWithAI);
router.post("/create", protect, createProject);
router.get("/", getAllProjects);
router.post("/acquire/:id", protect, acquireProject);
router.get("/my-projects/:userId", protect, getFreelancerProjects);


module.exports = router;