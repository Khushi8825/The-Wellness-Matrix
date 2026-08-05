const { runAgent, Type } = require("../services/ai/geminiAgent.service");

/**
 * VITALS ANALYSIS AGENT
 * ----------------------------------------------------------------------
 * INPUT:  the single most recent HealthLog row for the user (already
 *         fetched by healthCoordinator.js — this agent never queries the
 *         database itself, keeping each agent single-responsibility).
 * OUTPUT: { findings: [{ parameter, value, status, note }], summary }
 * ALGORITHM: Threshold-Based Rule Classification (deterministic, same
 *         clinical cut-offs already used in services/severity/*.rules.js)
 *         to decide Normal/Monitor/High/Critical per parameter, THEN a
 *         single Gemini call turns those deterministic labels into a
 *         short, human-readable finding per vital. Gemini is never asked
 *         to invent the thresholds — only to phrase the already-decided
 *         status in plain language. This keeps the medical classification
 *         reproducible while still getting natural-language output.
 * ----------------------------------------------------------------------
 */

// Deterministic classification — pure functions, no AI involved.
// Ranges mirror the ones already documented in services/severity/*.rules.js
// so the "latest vitals" view stays consistent with the existing 7-day
// severity engine instead of introducing a second set of numbers.
const classifyBloodPressure = (systolic, diastolic) => {
  if (systolic == null || diastolic == null) return "Unknown";
  if (systolic >= 180 || diastolic >= 120) return "Critical";
  if (systolic >= 140 || diastolic >= 90) return "High";
  if (systolic >= 120 || diastolic >= 80) return "Elevated";
  return "Normal";
};

const classifyHeartRate = (hr) => {
  if (hr == null) return "Unknown";
  if (hr > 120 || hr < 40) return "Critical";
  if (hr > 100) return "High";
  return "Normal";
};

const classifyBloodSugar = (sugar) => {
  if (sugar == null) return "Unknown";
  if (sugar >= 250) return "Critical";
  if (sugar >= 126) return "High";
  return "Normal";
};

const classifySleep = (hours) => {
  if (hours == null) return "Unknown";
  if (hours < 5) return "Low";
  if (hours > 9) return "High";
  return "Normal";
};

// No height field exists in the schema, so BMI can't be computed reliably.
// We surface the raw weight value and let the Trend Agent (Phase 1, see
// trendAgent.js) speak to direction of change instead of guessing a
// weight-status label out of thin air.
const buildDeterministicFindings = (log) => ({
  bloodPressure: {
    value: log.systolicBp != null && log.diastolicBp != null ? `${log.systolicBp}/${log.diastolicBp} mmHg` : null,
    status: classifyBloodPressure(log.systolicBp, log.diastolicBp),
  },
  heartRate: { value: log.heartRate != null ? `${log.heartRate} bpm` : null, status: classifyHeartRate(log.heartRate) },
  bloodSugar: { value: log.bloodSugar != null ? `${log.bloodSugar} mg/dL` : null, status: classifyBloodSugar(log.bloodSugar) },
  sleepHours: { value: log.sleepHours != null ? `${log.sleepHours} hrs` : null, status: classifySleep(log.sleepHours) },
  weight: { value: log.weight != null ? `${log.weight} kg` : null, status: "Not classified (no height on file)" },
});

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    findings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          parameter: { type: Type.STRING },
          value: { type: Type.STRING, nullable: true },
          status: { type: Type.STRING },
          note: { type: Type.STRING, description: "One short, plain-English sentence about this specific reading" },
        },
        required: ["parameter", "value", "status", "note"],
      },
    },
    summary: { type: Type.STRING, description: "1-2 sentence plain-English summary of today's vitals overall" },
  },
  required: ["findings", "summary"],
};

const SYSTEM_INSTRUCTION = `You are the Vitals Analysis Agent inside a healthcare assistant.
You are given a set of health parameters that have ALREADY been classified by a deterministic
rule engine (status values like Normal, Elevated, High, Critical, Unknown are fixed and must not
be changed, reinterpreted, or overridden). Your only job is to write one short, plain-English
note per parameter explaining what that status means for the patient today, plus one short
overall summary. Do not diagnose. Do not invent values that were not provided. If a value is
null, say it was not recorded today.`;

/**
 * @param {Object} latestLog - most recent HealthLog row (camelCase fields)
 * @returns {Promise<{findings: Array, summary: string}>}
 */
const runVitalsAgent = async (latestLog) => {
  if (!latestLog) {
    return { findings: [], summary: "No vitals have been recorded yet today." };
  }

  const deterministic = buildDeterministicFindings(latestLog);

  const userPrompt = `Today's date: ${latestLog.logDate}
Deterministic classification (already decided — do not change the status values):
${JSON.stringify(deterministic, null, 2)}

Write one finding object per parameter (skip "weight" only if its value is null) and a short
overall summary.`;

  try {
    return await runAgent({ systemInstruction: SYSTEM_INSTRUCTION, userPrompt, responseSchema: RESPONSE_SCHEMA, temperature: 0.2 });
  } catch (err) {
    console.error("Vitals Agent error:", err.message);
    // Graceful degradation: fall back to the deterministic labels alone so
    // the coordinator workflow never breaks just because the LLM call failed.
    return {
      findings: Object.entries(deterministic)
        .filter(([, v]) => v.value !== null)
        .map(([parameter, v]) => ({ parameter, value: v.value, status: v.status, note: `Status: ${v.status}.` })),
      summary: "Vitals were classified using rule-based thresholds (AI phrasing unavailable right now).",
    };
  }
};

module.exports = { runVitalsAgent };
