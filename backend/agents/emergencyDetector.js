/**
 * EMERGENCY DETECTION
 * ----------------------------------------------------------------------
 * INPUT:  the single most recent HealthLog row.
 * OUTPUT: { isEmergency, triggers: [{ parameter, value, message }] }
 * ALGORITHM: Deterministic Threshold Check — intentionally NOT an AI call.
 *         In a genuine emergency, correctness and speed both matter more
 *         than natural-language phrasing, and a fixed rule can't
 *         hallucinate or time out. This runs first, before any agent, so
 *         a true emergency is detected even if the Gemini API is down.
 * ----------------------------------------------------------------------
 */

const EMERGENCY_THRESHOLDS = {
  systolicBp: 180,
  diastolicBp: 120,
  bloodSugarHigh: 350,
  heartRateLow: 40,
  heartRateHigh: 150,
};

const checkEmergency = (latestLog) => {
  const triggers = [];
  if (!latestLog) return { isEmergency: false, triggers };

  const { systolicBp, diastolicBp, bloodSugar, heartRate } = latestLog;

  if (systolicBp != null && systolicBp >= EMERGENCY_THRESHOLDS.systolicBp) {
    triggers.push({ parameter: "systolicBp", value: systolicBp, message: `Systolic blood pressure of ${systolicBp} mmHg is in the hypertensive crisis range.` });
  }
  if (diastolicBp != null && diastolicBp >= EMERGENCY_THRESHOLDS.diastolicBp) {
    triggers.push({ parameter: "diastolicBp", value: diastolicBp, message: `Diastolic blood pressure of ${diastolicBp} mmHg is in the hypertensive crisis range.` });
  }
  if (bloodSugar != null && bloodSugar >= EMERGENCY_THRESHOLDS.bloodSugarHigh) {
    triggers.push({ parameter: "bloodSugar", value: bloodSugar, message: `Blood sugar of ${bloodSugar} mg/dL is dangerously high.` });
  }
  if (heartRate != null && heartRate < EMERGENCY_THRESHOLDS.heartRateLow) {
    triggers.push({ parameter: "heartRate", value: heartRate, message: `Heart rate of ${heartRate} bpm is dangerously low.` });
  }
  if (heartRate != null && heartRate > EMERGENCY_THRESHOLDS.heartRateHigh) {
    triggers.push({ parameter: "heartRate", value: heartRate, message: `Heart rate of ${heartRate} bpm is dangerously high.` });
  }

  return { isEmergency: triggers.length > 0, triggers };
};

module.exports = { checkEmergency, EMERGENCY_THRESHOLDS };
