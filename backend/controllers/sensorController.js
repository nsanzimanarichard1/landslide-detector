import Sensor from "../models/Sensor.js";

export const getSensorData = async (req, res) => {
  try {
    const data = await Sensor.find().sort({ createdAt: -1 }).limit(50);
    res.json(data.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAlerts = async (req, res) => {
  try {
    const alerts = await Sensor.find({ risk: { $in: ["HIGH", "CRITICAL"] } })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLatestRisk = async (req, res) => {
  try {
    const latest = await Sensor.findOne().sort({ createdAt: -1 });
    if (!latest) return res.json({ risk: "LOW", riskScore: 0 });
    res.json({ risk: latest.risk, riskScore: latest.riskScore, createdAt: latest.createdAt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
