const axios = require("axios");

exports.analyzeProject = async (description) => {

  const response = await axios.post(
    "http://localhost:8000/analyze-requirements",
    {
      prompt: description,
    }
  );

  return response.data;
};