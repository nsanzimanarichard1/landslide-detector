import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import startSerial from "./serial/serialReader.js";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Expose Google Maps API key to frontend
app.use((req, res, next) => {
  res.locals.googleMapsApiKey = process.env.GOOGLEMAP_API_KEY;
  next();
});

connectDB();
startSerial();

app.use("/api", sensorRoutes);

// API key endpoint for frontend
app.get("/api/config", (req, res) => {
  res.json({
    googleMapsApiKey: process.env.GOOGLEMAP_API_KEY || "",
  });
});

app.listen(5000, () => console.log("Backend running on port 5000"));
