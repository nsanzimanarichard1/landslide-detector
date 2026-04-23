import express from "express";
import { getSensorData, getAlerts, getLatestRisk } from "../controllers/sensorController.js";

const router = express.Router();

router.get("/data", getSensorData);
router.get("/alerts", getAlerts);
router.get("/risk", getLatestRisk);

export default router;
