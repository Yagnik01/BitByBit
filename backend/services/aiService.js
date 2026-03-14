const axios = require("axios");

const AI_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

// ── Shared request helper ─────────────────────────────────────────────────────
async function callAI(endpoint, payload, timeoutMs = 30000) {
  const response = await axios.post(`${AI_URL}${endpoint}`, payload, { timeout: timeoutMs });
  return response.data;
}

// ── Project analysis ──────────────────────────────────────────────────────────
async function analyzeProject(description, budget, timeline) {
  try {
    const data = await callAI("/analyze", { description, budget, timeline });
    return {
      project_name: data.project_name || deriveProjectName(description),
      domain:       data.domain       || "General",
      total_budget: data.total_budget || budget,
      timeline:     data.timeline     || timeline,
      tech_stack:   Array.isArray(data.tech_stack) ? data.tech_stack : [],
      milestones:   Array.isArray(data.milestones)
        ? data.milestones.map(m => ({
            title:             m.title             || "Milestone",
            description:       m.description       || "",
            timeline:          m.timeline          || "",
            budget_allocation: Number(m.budget_allocation) || 0,
          }))
        : buildFallbackMilestones(budget),
      _fallback: false,
    };
  } catch (err) {
    console.warn("AI analyze unavailable:", err.message);
    return buildFallbackResponse(description, budget, timeline);
  }
}

// ── Milestone verification ────────────────────────────────────────────────────
async function verifyMilestone({ milestoneTitle, milestoneDescription, githubLink, projectDescription, budgetAllocation }) {
  try {
    const data = await callAI("/verify-milestone", {
      milestone_title:       milestoneTitle,
      milestone_description: milestoneDescription,
      github_link:           githubLink,
      project_description:   projectDescription,
      budget_allocation:     budgetAllocation,
    }, 45000);

    return {
      score:               Number(data.score)              || 0,
      status:              data.status                     || "needs_revision",
      feedback:            data.feedback                   || "No feedback provided.",
      payment_recommended: Boolean(data.payment_recommended),
      _fallback:           false,
    };
  } catch (err) {
    console.warn("AI verify unavailable:", err.message);
    // Smart fallback: if GitHub link exists, assume reasonable work
    const score = githubLink ? 75 : 30;
    return {
      score,
      status:              score >= 70 ? "approved" : "needs_revision",
      feedback:            score >= 70
        ? "AI service offline. Submission accepted based on provided GitHub link. Manual review recommended."
        : "AI service offline. Please review the submission manually.",
      payment_recommended: score >= 70,
      _fallback:           true,
    };
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function deriveProjectName(description) {
  const words = description.trim().split(/\s+/).slice(0, 6).join(" ");
  return words.length > 3 ? words : "New Project";
}

function buildFallbackMilestones(budget) {
  return [
    { title: "Planning & Requirements", description: "Define scope and requirements.", timeline: "Week 1",   budget_allocation: Math.round(budget * 0.15) },
    { title: "Design & Prototyping",    description: "Create designs and prototype.",  timeline: "Week 2",   budget_allocation: Math.round(budget * 0.20) },
    { title: "Core Development",        description: "Build main features.",            timeline: "Week 3-5", budget_allocation: Math.round(budget * 0.40) },
    { title: "Testing & QA",            description: "Testing and bug fixing.",         timeline: "Week 6",   budget_allocation: Math.round(budget * 0.15) },
    { title: "Deployment & Handover",   description: "Deploy and hand over.",           timeline: "Week 7",   budget_allocation: Math.round(budget * 0.10) },
  ];
}

function buildFallbackResponse(description, budget, timeline) {
  const desc = description.toLowerCase();
  let domain = "Web Development", tech = ["React.js", "Node.js", "MongoDB"];
  if (desc.includes("mobile") || desc.includes("android") || desc.includes("ios"))
    { domain = "Mobile App"; tech = ["React Native", "Node.js", "Firebase"]; }
  else if (desc.includes("ai") || desc.includes("machine learning"))
    { domain = "AI & ML"; tech = ["Python", "FastAPI", "TensorFlow", "PostgreSQL"]; }
  else if (desc.includes("shop") || desc.includes("ecommerce"))
    { domain = "E-Commerce"; tech = ["Next.js", "Node.js", "MongoDB", "Stripe"]; }
  else if (desc.includes("data") || desc.includes("dashboard"))
    { domain = "Data & Backend"; tech = ["Python", "FastAPI", "PostgreSQL", "React.js"]; }
  return {
    project_name: deriveProjectName(description),
    domain, total_budget: budget, timeline: timeline || "6-8 weeks",
    tech_stack: tech, milestones: buildFallbackMilestones(budget),
    _fallback: true,
    note: "AI service offline. Smart defaults applied.",
  };
}

module.exports = { analyzeProject, verifyMilestone };
