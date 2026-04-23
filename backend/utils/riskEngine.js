/**
 * Landslide risk scoring using available sensors:
 * Accelerometer → ground shaking / sudden movement
 * Gyroscope     → tilt / slope rotation
 * Magnetometer  → magnetic field anomalies (ground shift)
 * Humidity      → saturated soil = landslide trigger
 */

export const computeRisk = ({ ax, ay, az, gx, gy, gz, mx, my, mz, hum }) => {
  let score = 0;

  // Accelerometer: deviation from resting (0,1,0)
  const accelMag = Math.sqrt(ax ** 2 + ay ** 2 + az ** 2);
  const accelDev = Math.abs(accelMag - 1.0);
  if (accelDev > 0.3)       score += 30;
  else if (accelDev > 0.15) score += 15;
  else if (accelDev > 0.05) score += 5;

  // Gyroscope: rotation magnitude
  const gyroMag = Math.sqrt(gx ** 2 + gy ** 2 + gz ** 2);
  if (gyroMag > 2.0)       score += 30;
  else if (gyroMag > 1.0)  score += 20;
  else if (gyroMag > 0.5)  score += 10;

  // Magnetometer: field anomaly
  const magMag = Math.sqrt(mx ** 2 + my ** 2 + mz ** 2);
  if (magMag > 100)      score += 20;
  else if (magMag > 80)  score += 10;

  // Humidity: saturated soil
  if (hum > 85)       score += 20;
  else if (hum > 75)  score += 10;
  else if (hum > 65)  score += 5;

  let risk = "LOW";
  if (score >= 70)      risk = "CRITICAL";
  else if (score >= 45) risk = "HIGH";
  else if (score >= 20) risk = "MEDIUM";

  return { risk, riskScore: score };
};
