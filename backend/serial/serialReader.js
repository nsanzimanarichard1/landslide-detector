import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import Sensor from "../models/Sensor.js";
import { computeRisk } from "../utils/riskEngine.js";

const startSerial = () => {
  const port = new SerialPort({ path: "COM5", baudRate: 115200 });
  const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

  port.on("open", () => console.log("Serial port COM5 opened"));
  port.on("error", (err) => console.error("Serial port error:", err.message));

  parser.on("data", async (line) => {
    let data;

    try {
      data = JSON.parse(line.trim());
    } catch {
      console.log("Invalid JSON:", line.trim());
      return;
    }

    try {
      const { risk, riskScore } = computeRisk(data);
      const saved = await Sensor.create({ ...data, risk, riskScore });
      console.log(
        `[${risk}] saved:${saved._id} score:${riskScore} temp:${data.temp} hum:${data.hum}`
      );
    } catch (err) {
      console.error("MongoDB save error:", err.message, data);
    }
  });
};

export default startSerial;
