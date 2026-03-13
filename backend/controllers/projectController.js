const Project = require("../models/Project");
const { analyzeProject } = require("../services/aiService");


/* AI ANALYSIS */

exports.analyzeProjectWithAI = async (req, res) => {

  try {

    const { description } = req.body;

    const aiData = await analyzeProject(description);
    // console.log("AI response:", aiData);
    res.json(aiData);

  } catch (error) {

    console.log(error);
    res.status(500).json({ error: "AI analysis failed" });

  }

};



/* CREATE PROJECT */

exports.createProject = async (req, res) => {

  try {

    const project = new Project(req.body);

    const savedProject = await project.save();

    res.json(savedProject);

  } catch (error) {

    res.status(500).json(error);

  }

};



/* GET ALL PROJECTS */

exports.getAllProjects = async (req, res) => {

  try {

    const projects = await Project.find({
      status: "open",
    });

    res.json(projects);

  } catch (error) {

    res.status(500).json(error);

  }

};



/* FREELANCER ACQUIRE PROJECT */

exports.acquireProject = async (req, res) => {

  try {

    const { freelancerId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {

      return res.status(404).json({

        message: "Project not found",
      });

    }

    if (project.freelancerId) {

      return res.status(400).json({
        message: "Project already taken",
      });

    }

    project.freelancerId = freelancerId;
    project.status = "in-progress";

    await project.save();

    res.json(project);

  } catch (error) {

    res.status(500).json(error);

  }

};



/* FREELANCER PROJECTS */

exports.getFreelancerProjects = async (req, res) => {

  try {

    const projects = await Project.find({
      freelancerId: req.params.userId,
    });

    res.json(projects);

  } catch (error) {

    res.status(500).json(error);

  }

};