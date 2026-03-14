const axios = require("axios");

async function analyzeProject(description, budget, timeline) {

  const response = await axios.post(
    "http://localhost:8000/analyze",
    {
      description,
      budget,
      timeline
    }
  );

  return response.data;
}

module.exports = {
  analyzeProject
};