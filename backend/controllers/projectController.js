const Project = require("../models/Project");
const { analyzeProject } = require("../services/aiService");

/* AI ANALYSIS */
exports.analyzeProjectWithAI = async (req, res) => {
  try {
    const { description, budget, timeline } = req.body;
    if (!description) return res.status(400).json({ message: "Description is required" });

    const aiData = await analyzeProject(description, budget, timeline);
    res.json(aiData);
  } catch (error) {
    console.error("AI analyze error:", error);
    res.status(500).json({ message: "AI generation failed" });
  }
};

/* CREATE PROJECT */
exports.createProject = async (req, res) => {
  try {
    const { description, domain, total_budget, timeline, milestones } = req.body;

    if (!description) return res.status(400).json({ message: "Description is required" });

    const project = new Project({
      description,
      domain,
      total_budget: Number(total_budget) || 0,
      timeline,
      milestones: milestones || [],
      employerId: req.user.id,
      status: "open",
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

/* GET ALL OPEN PROJECTS */
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: "open" }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

/* FREELANCER ACQUIRE PROJECT */
exports.acquireProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.freelancerId) return res.status(400).json({ message: "Project already taken" });
    if (String(project.employerId) === String(req.user.id)) {
      return res.status(400).json({ message: "You cannot acquire your own project" });
    }

    project.freelancerId = req.user.id;
    project.status = "in-progress";
    await project.save();

    res.json(project);
  } catch (error) {
    console.error("Acquire project error:", error);
    res.status(500).json({ message: "Failed to acquire project" });
  }
};

/* GET FREELANCER'S PROJECTS */
exports.getFreelancerProjects = async (req, res) => {
  try {
    const projects = await Project.find({ freelancerId: req.params.userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error("Get freelancer projects error:", error);
    res.status(500).json({ message: "Failed to fetch freelancer projects" });
  }
};

/* GET EMPLOYER'S PROJECTS */
exports.getEmployerProjects = async (req, res) => {
  try {
    const projects = await Project.find({ employerId: req.params.userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error("Get employer projects error:", error);
    res.status(500).json({ message: "Failed to fetch employer projects" });
  }
};
