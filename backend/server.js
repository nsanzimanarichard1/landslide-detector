import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import startSerial from "./serial/serialReader.js";

const app = express();
app.use(cors());
app.use(express.json());

connectDB();
startSerial();

app.use("/api", sensorRoutes);

app.listen(5000, () => console.log("Backend running on port 5000"));
