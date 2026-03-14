const axios = require("axios");

async function analyzeProject(description, budget, timeline) {
  try {
    const response = await axios.post(
      "http://localhost:8000/analyze",
      { description, budget, timeline },
      { timeout: 10000 }
    );
    return response.data;
  } catch (error) {
    // AI service not running — return a basic suggestion instead of crashing
    console.log("AI service unavailable, returning fallback suggestion.");
    return {
      suggestion: `Based on your project: "${description}"`,
      recommended_milestones: [
        { title: "Planning & Setup", budget_allocation: Math.round(budget * 0.2) },
        { title: "Core Development", budget_allocation: Math.round(budget * 0.5) },
        { title: "Testing & Deployment", budget_allocation: Math.round(budget * 0.3) },
      ],
      estimated_timeline: timeline || "2-4 weeks",
      note: "AI service is offline. These are default suggestions."
    };
  }
}

module.exports = { analyzeProject };
