import mongoose from "mongoose";

const SensorSchema = new mongoose.Schema(
  {
    ax: Number,
    ay: Number,
    az: Number,
    gx: Number,
    gy: Number,
    gz: Number,
    mx: Number,
    my: Number,
    mz: Number,
    temp: Number,
    hum: Number,
    risk: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], default: "LOW" },
    riskScore: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "sensors" }
);

const Sensor = mongoose.model("Sensor", SensorSchema);

export default Sensor;
