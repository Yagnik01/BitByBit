const Project      = require("../models/Project");
const Notification = require("../models/Notification");
const User         = require("../models/User");
const { analyzeProject } = require("../services/aiService");

// Helper — emit a socket event to a specific user's room
const emit = (io, userId, event, payload) => {
  if (io && userId) io.to(`user_${userId}`).emit(event, payload);
};

// ─── POST /api/projects/analyze ──────────────────────────────────────────────
exports.analyzeProjectWithAI = async (req, res) => {
  try {
    const { description, budget, timeline } = req.body;
    if (!description?.trim()) return res.status(400).json({ message: "description is required" });
    const aiData = await analyzeProject(description, Number(budget) || 5000, timeline || "flexible");
    res.json(aiData);
  } catch (err) {
    console.error("AI analyze error:", err);
    res.status(500).json({ message: "AI generation failed" });
  }
};

// ─── POST /api/projects/create ───────────────────────────────────────────────
exports.createProject = async (req, res) => {
  try {
    const { title, description, domain, requiredSkills, total_budget, timeline, milestones, aiAnalysis } = req.body;
    if (!description) return res.status(400).json({ message: "Description is required" });

    const project = new Project({
      title:          title || description.slice(0, 80),
      description,
      domain:         domain || "",
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      total_budget:   Number(total_budget) || 0,
      timeline:       timeline || "",
      milestones:     Array.isArray(milestones) ? milestones : [],
      employerId:     req.user.id,
      status:         "open",
      aiAnalysis:     aiAnalysis ? { ...aiAnalysis, generatedAt: new Date() } : undefined,
    });
    await project.save();
    const populated = await Project.findById(project._id).populate("employerId", "name email avatar");
    res.status(201).json(populated);
  } catch (err) {
    console.error("createProject error:", err);
    res.status(500).json({ message: "Failed to create project" });
  }
};

// ─── GET /api/projects/ ──────────────────────────────────────────────────────
exports.getAllProjects = async (req, res) => {
  try {
    const { domain, skill, search, page = 1, limit = 20 } = req.query;
    const filter = { status: "open" };
    if (domain) filter.domain = { $regex: domain, $options: "i" };
    if (skill)  filter.requiredSkills = { $in: [new RegExp(skill, "i")] };
    if (search) filter.$or = [
      { title:       { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
      .populate("employerId", "name email avatar location")
      .sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    res.json({ projects, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

// ─── GET /api/projects/:id ───────────────────────────────────────────────────
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("employerId",  "name email avatar location")
      .populate("freelancerId","name email avatar")
      .populate("applications.freelancerId", "name email avatar");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── PUT /api/projects/:id ───────────────────────────────────────────────────
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (String(project.employerId) !== String(req.user.id))
      return res.status(403).json({ message: "Not authorised" });
    ["title","description","domain","requiredSkills","total_budget","timeline","milestones","status"]
      .forEach(f => { if (req.body[f] !== undefined) project[f] = req.body[f]; });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to update project" });
  }
};

// ─── POST /api/projects/:id/apply ────────────────────────────────────────────
// Freelancer applies → persist notification + socket emit to client
exports.applyToProject = async (req, res) => {
  try {
    const { coverLetter = "", bidAmount = 0 } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project)                                             return res.status(404).json({ message: "Project not found" });
    if (String(project.employerId) === String(req.user.id))  return res.status(400).json({ message: "Cannot apply to your own project" });
    if (project.status !== "open")                           return res.status(400).json({ message: "Project is not open" });
    if (project.applications.some(a => String(a.freelancerId) === String(req.user.id)))
                                                              return res.status(400).json({ message: "Already applied" });

    const freelancer = await User.findById(req.user.id).select("name");
    project.applications.push({ freelancerId: req.user.id, freelancerName: freelancer.name, coverLetter, bidAmount: Number(bidAmount) });
    await project.save();

    const projectTitle = project.title || project.description.slice(0, 50);

    // Persist notification for the client
    const notif = await Notification.create({
      recipientId:  project.employerId,
      senderId:     req.user.id,
      senderName:   freelancer.name,
      type:         "freelancer_applied",
      title:        "New Application Received",
      message:      `${freelancer.name} applied for your project: "${projectTitle}"`,
      projectId:    project._id,
      projectTitle,
    });

    // Real-time push to client's dashboard
    const io = req.app.get("io");
    emit(io, project.employerId.toString(), "new_notification", notif);

    res.status(201).json({ message: "Application submitted successfully", application: project.applications.slice(-1)[0] });
  } catch (err) {
    console.error("applyToProject error:", err);
    res.status(500).json({ message: "Failed to apply" });
  }
};

// ─── POST /api/projects/:id/accept/:applicationId ────────────────────────────
// Client accepts freelancer → notify ALL applicants + push project_assigned to freelancer
exports.acceptApplication = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project)                                            return res.status(404).json({ message: "Project not found" });
    if (String(project.employerId) !== String(req.user.id)) return res.status(403).json({ message: "Not authorised" });

    const application = project.applications.id(req.params.applicationId);
    if (!application) return res.status(404).json({ message: "Application not found" });

    // Update all application statuses
    project.applications.forEach(a => {
      a.status = a._id.toString() === req.params.applicationId ? "accepted" : "rejected";
    });
    project.freelancerId = application.freelancerId;
    project.status       = "in-progress";
    await project.save();

    const projectTitle = project.title || project.description.slice(0, 50);
    const io = req.app.get("io");

    // ── Notify accepted freelancer ── //
    const acceptNotif = await Notification.create({
      recipientId:  application.freelancerId,
      senderId:     req.user.id,
      type:         "application_accepted",
      title:        "🎉 Application Accepted!",
      message:      `Your application for "${projectTitle}" was accepted! The project is now in your dashboard.`,
      projectId:    project._id,
      projectTitle,
    });
    emit(io, application.freelancerId.toString(), "new_notification", acceptNotif);

    // ── Key: push "project_assigned" so freelancer dashboard auto-refreshes ──
    emit(io, application.freelancerId.toString(), "project_assigned", {
      projectId:    project._id,
      projectTitle,
      message:      `You have been assigned to "${projectTitle}"`,
    });

    // ── Notify rejected applicants ── //
    for (const a of project.applications) {
      if (a.status === "rejected") {
        const rejNotif = await Notification.create({
          recipientId:  a.freelancerId,
          senderId:     req.user.id,
          type:         "application_rejected",
          title:        "Application Update",
          message:      `Your application for "${projectTitle}" was not selected this time.`,
          projectId:    project._id,
          projectTitle,
        });
        emit(io, a.freelancerId.toString(), "new_notification", rejNotif);
      }
    }

    const populated = await Project.findById(project._id)
      .populate("employerId",  "name email avatar")
      .populate("freelancerId","name email avatar")
      .populate("applications.freelancerId","name email avatar");

    res.json({ message: "Freelancer accepted", project: populated });
  } catch (err) {
    console.error("acceptApplication error:", err);
    res.status(500).json({ message: "Failed to accept application" });
  }
};

// ─── GET /api/projects/my-projects/:userId ───────────────────────────────────
exports.getFreelancerProjects = async (req, res) => {
  try {
    const projects = await Project.find({ freelancerId: req.params.userId })
      .populate("employerId", "name email avatar")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

// ─── GET /api/projects/employer-projects/:userId ─────────────────────────────
exports.getEmployerProjects = async (req, res) => {
  try {
    const projects = await Project.find({ employerId: req.params.userId })
      .populate("freelancerId", "name email avatar")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

// ─── LEGACY: POST /api/projects/acquire/:id ──────────────────────────────────
exports.acquireProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.freelancerId) return res.status(400).json({ message: "Project already taken" });
    if (String(project.employerId) === String(req.user.id))
      return res.status(400).json({ message: "Cannot acquire your own project" });
    project.freelancerId = req.user.id;
    project.status       = "in-progress";
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to acquire project" });
  }
};
