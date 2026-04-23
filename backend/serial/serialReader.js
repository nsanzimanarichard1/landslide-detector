import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import Sensor from "../models/Sensor.js";
import { computeRisk } from "../utils/riskEngine.js";

const startSerial = () => {
  const port = new SerialPort({ path: "COM5", baudRate: 115200 });
  const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

  port.on("open", () => console.log("✅ Serial port COM5 opened"));
  port.on("error", (err) => console.error("❌ Serial port error:", err.message));

  parser.on("data", async (line) => {
    try {
      const data = JSON.parse(line.trim());
      const { risk, riskScore } = computeRisk(data);

      await Sensor.create({ ...data, risk, riskScore });

      const icon = risk === "CRITICAL" ? "🔴" : risk === "HIGH" ? "🟠" : risk === "MEDIUM" ? "🟡" : "🟢";
      console.log(`${icon} [${risk}] score:${riskScore} temp:${data.temp} hum:${data.hum}`);
    } catch {
      console.log("⚠️  Invalid JSON:", line.trim());
    }
  });
};

export default startSerial;
