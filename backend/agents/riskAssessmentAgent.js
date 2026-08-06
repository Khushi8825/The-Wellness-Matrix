const { runAgent, Type } = require("../services/ai/geminiAgent.service");

/**
 * RISK ASSESSMENT AGENT
 * ----------------------------------------------------------------------
 * INPUT:  the outputs of the Vitals, Trend, and Prescription agents
 *         (already computed by the coordinator — this agent never
 *         touches the database directly).
 * OUTPUT: { riskLevel, riskScore, keyFactors: [string], reasoning }
 * ALGORITHM: Deterministic Weighted Risk Scoring + LLM Reasoning
 *         Synthesis. A fixed point system (same spirit as the existing
 *         services/severity/*.rules.js engine) turns each vital's status,
 *         each trend's direction, and any medication/vital mismatch into
 *         a numeric score, which maps to Low/Moderate/High/Critical.
 *         Gemini is only asked to explain that already-decided level in
 *         plain language — exactly like the Vitals Agent, it can't
 *         override the score, only narrate it. This is what makes the
 *         "why" in the final report reproducible instead of the model
 *         picking a different risk level on every run.
 * ----------------------------------------------------------------------
 */

const STATUS_POINTS = { Critical: 4, High: 3, Elevated: 2, Normal: 0, Unknown: 0 };
const WORSENING_TREND_POINTS = 1;
// A vital that's abnormal DESPITE the patient already being medicated for
// that exact area is a stronger signal than either fact alone — mirrors
// your own example: "High Risk because BP kept rising despite already
// taking antihypertensive medication."
const UNCONTROLLED_ON_MEDICATION_POINTS = 2;

const THERAPEUTIC_AREA_TO_VITALS = {
  Hypertension: ["bloodPressure"],
  "Heart condition": ["bloodPressure", "heartRate"],
  Diabetes: ["bloodSugar"],
};

const scoreVitals = (vitalsFindings = []) =>
  vitalsFindings.reduce((sum, f) => sum + (STATUS_POINTS[f.status] ?? 0), 0);

const scoreTrends = (trends = []) => {
  // Direction is only "bad" for certain parameters — a decreasing weight
  // isn't automatically worsening the way an increasing BP is, so we only
  // score the directions that are unambiguously concerning.
  const worseningIfIncreasing = ["systolicBp", "diastolicBp", "heartRate", "bloodSugar"];
  return trends.reduce((sum, t) => {
    if (worseningIfIncreasing.includes(t.parameter) && t.direction === "Increasing") return sum + WORSENING_TREND_POINTS;
    if (t.parameter === "sleepHours" && t.direction === "Decreasing") return sum + WORSENING_TREND_POINTS;
    return sum;
  }, 0);
};

const scoreMedicationMismatch = (vitalsFindings = [], therapeuticAreas = []) => {
  let points = 0;
  const flagged = [];
  therapeuticAreas.forEach((area) => {
    const relatedVitals = THERAPEUTIC_AREA_TO_VITALS[area] || [];
    relatedVitals.forEach((vitalKey) => {
      const finding = vitalsFindings.find((f) => f.parameter === vitalKey);
      if (finding && finding.status !== "Normal" && finding.status !== "Unknown") {
        points += UNCONTROLLED_ON_MEDICATION_POINTS;
        flagged.push(`${vitalKey} remains ${finding.status} despite medication for ${area}`);
      }
    });
  });
  return { points, flagged };
};

const scoreToLevel = (score) => {
  if (score >= 8) return "Critical Risk";
  if (score >= 5) return "High Risk";
  if (score >= 2) return "Moderate Risk";
  return "Low Risk";
};

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    keyFactors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The specific data points that drove this risk level" },
    reasoning: { type: Type.STRING, description: "1-3 sentences explaining WHY this risk level was reached, referencing the key factors" },
  },
  required: ["keyFactors", "reasoning"],
};

const SYSTEM_INSTRUCTION = `You are the Risk Assessment Agent inside a healthcare assistant.
A risk level (Low/Moderate/High/Critical Risk) has ALREADY been calculated by a deterministic
scoring system — you must not change it or propose a different level. Your only job is to select
the most important contributing factors from the data given and write a short, clear explanation
of WHY that risk level was reached, in the style of a clinician's note (e.g. "High Risk because
blood pressure has continuously increased over the past 20 days despite the patient already
taking antihypertensive medication."). Be specific and reference actual numbers/directions from
the data. Do not diagnose a disease. Do not soften or escalate the already-decided level.`;

/**
 * @param {Object} vitalsResult - output of runVitalsAgent
 * @param {Object} trendResult - output of runTrendAgent
 * @param {Object} prescriptionResult - output of runPrescriptionAgent
 * @returns {Promise<{riskLevel: string, riskScore: number, keyFactors: string[], reasoning: string}>}
 */
const runRiskAssessmentAgent = async (vitalsResult, trendResult, prescriptionResult) => {
  const vitalsFindings = vitalsResult?.findings || [];
  const trends = trendResult?.trends || [];
  const therapeuticAreas = prescriptionResult?.therapeuticAreas || [];

  const vitalsScore = scoreVitals(vitalsFindings);
  const trendScore = scoreTrends(trends);
  const { points: medicationScore, flagged } = scoreMedicationMismatch(vitalsFindings, therapeuticAreas);

  const totalScore = vitalsScore + trendScore + medicationScore;
  const riskLevel = scoreToLevel(totalScore);

  const userPrompt = `Deterministic risk score (already calculated — do not change the level): ${totalScore} → ${riskLevel}

Score breakdown:
- Vitals contribution: ${vitalsScore} (from statuses: ${JSON.stringify(vitalsFindings.map((f) => ({ parameter: f.parameter, status: f.status })))})
- Trend contribution: ${trendScore} (from directions: ${JSON.stringify(trends.map((t) => ({ parameter: t.parameter, direction: t.direction })))})
- Medication-mismatch contribution: ${medicationScore} (${flagged.length ? flagged.join("; ") : "none"})

Medication summary: ${prescriptionResult?.medicationSummary || "No prescription on file."}

Select the most important factors and explain why the risk level above was reached.`;

  try {
    const result = await runAgent({ systemInstruction: SYSTEM_INSTRUCTION, userPrompt, responseSchema: RESPONSE_SCHEMA, temperature: 0.3 });
    return { riskLevel, riskScore: totalScore, ...result };
  } catch (err) {
    console.error("Risk Assessment Agent error:", err.message);
    return {
      riskLevel,
      riskScore: totalScore,
      keyFactors: flagged.length ? flagged : vitalsFindings.filter((f) => f.status !== "Normal").map((f) => `${f.parameter}: ${f.status}`),
      reasoning: `${riskLevel} based on a deterministic score of ${totalScore} (AI explanation unavailable right now).`,
    };
  }
};

module.exports = { runRiskAssessmentAgent };
