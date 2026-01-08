const axios = require("axios");

const ML_BASE_URL = "https://flexmi-ml.onrender.com";

exports.getPulseScore = async (data) => {
  const res = await axios.post(`${ML_BASE_URL}/predict/pulse`, data);
  return res.data;
};

exports.getIntentRisk = async (data) => {
  const res = await axios.post(`${ML_BASE_URL}/predict/intent`, data);
  return res.data;
};
