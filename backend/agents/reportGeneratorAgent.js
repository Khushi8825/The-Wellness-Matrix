const { runAgent, Type } = require("../services/ai/geminiAgent.service");

/**
 * REPORT GENERATOR AGENT
 * ----------------------------------------------------------------------
 * INPUT:  outputs of every other agent — Vitals, Trend, Prescription,
 *         Risk, Lifestyle (already computed by the coordinator).
 * OUTPUT: { overallSummary, currentVitalAnalysis, trendAnalysis,
 *           medicationSummary, riskLevel, riskReasoning,
 *           lifestyleRecommendations, doctorConsultationAdvice,
 *           nextSteps: [string], healthScore }
 * ALGORITHM: LLM Aggregation & Synthesis, plus one deterministic number
 *         (healthScore, derived directly from the Risk Agent's numeric
 *         score — see scoreToHealthScore below). This is the only agent
 *         that is explicitly told NOT to introduce any new medical fact —
 *         its entire job is to take what the five other agents already
 *         decided and turn it into one coherent, readable report. This
 *         mirrors how a doctor synthesizes multiple specialists' notes
 *         into a single patient summary, rather than re-diagnosing.
 * ----------------------------------------------------------------------
 */

// Simple, explainable inverse-linear mapping from the Risk Agent's point
// score to a 0-100 "health score" for the dashboard. Deterministic and
// reproducible — Gemini never touches this number.
const scoreToHealthScore = (riskScore) => Math.max(0, Math.min(100, Math.round(100 - riskScore * 10)));

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallSummary: { type: Type.STRING, description: "2-4 sentence plain-English summary of the patient's overall health right now" },
    currentVitalAnalysis: { type: Type.STRING, description: "Short paragraph synthesizing today's vitals" },
    trendAnalysis: { type: Type.STRING, description: "Short paragraph synthesizing the 30-day trends" },
    medicationSummary: { type: Type.STRING, description: "Short paragraph synthesizing current medications" },
    doctorConsultationAdvice: { type: Type.STRING, description: "One clear sentence on whether/when to see a doctor, matching the risk level's urgency" },
    nextSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 short, concrete next actions for the patient" },
  },
  required: ["overallSummary", "currentVitalAnalysis", "trendAnalysis", "medicationSummary", "doctorConsultationAdvice", "nextSteps"],
};

const SYSTEM_INSTRUCTION = `You are the Report Generator Agent inside a healthcare assistant — the final step
after five specialist agents (Vitals, Trend, Prescription, Risk, Lifestyle) have already produced
their findings. Your ONLY job is to weave their already-decided outputs into one coherent,
professional health report. Do not introduce any new medical claim, number, or finding that isn't
already present in the data you're given. Do not change the risk level. Match the tone of the
doctor-consultation advice to the risk level: Low Risk should sound reassuring and routine, Critical
Risk should be direct about the need to seek care soon (but the report generator is never used for
true emergencies — those are handled separately). Write in plain, warm, professional English.`;

/**
 * @param {Object} agentResults - { vitalsResult, trendResult, prescriptionResult, riskResult, lifestyleResult }
 * @returns {Promise<Object>} the final report object
 */
const runReportGeneratorAgent = async ({ vitalsResult, trendResult, prescriptionResult, riskResult, lifestyleResult }) => {
  const healthScore = scoreToHealthScore(riskResult?.riskScore ?? 0);

  const userPrompt = `Specialist agent outputs (already decided — synthesize only, do not contradict):

VITALS: ${JSON.stringify(vitalsResult)}
TRENDS: ${JSON.stringify(trendResult)}
PRESCRIPTION: ${JSON.stringify(prescriptionResult)}
RISK: ${JSON.stringify(riskResult)}
LIFESTYLE: ${JSON.stringify(lifestyleResult)}

Write the final report fields based strictly on the above.`;

  try {
    const synthesized = await runAgent({ systemInstruction: SYSTEM_INSTRUCTION, userPrompt, responseSchema: RESPONSE_SCHEMA, temperature: 0.3 });
    return {
      healthScore,
      riskLevel: riskResult?.riskLevel || "Unknown",
      riskReasoning: riskResult?.reasoning || "",
      lifestyleRecommendations: lifestyleResult?.recommendations || [],
      ...synthesized,
    };
  } catch (err) {
    console.error("Report Generator Agent error:", err.message);
    // Graceful fallback: assemble a plainer report directly from the
    // individual agent summaries instead of failing the whole coordinator.
    return {
      healthScore,
      riskLevel: riskResult?.riskLevel || "Unknown",
      riskReasoning: riskResult?.reasoning || "",
      overallSummary: `${riskResult?.riskLevel || "Risk level unavailable"}. ${riskResult?.reasoning || ""}`,
      currentVitalAnalysis: vitalsResult?.summary || "Not available.",
      trendAnalysis: trendResult?.summary || "Not available.",
      medicationSummary: prescriptionResult?.medicationSummary || "Not available.",
      lifestyleRecommendations: lifestyleResult?.recommendations || [],
      doctorConsultationAdvice: "Please consult a doctor if you have concerns about these results.",
      nextSteps: ["Review your latest vitals", "Check in again tomorrow", "Consult a doctor if symptoms worsen"],
    };
  }
};

module.exports = { runReportGeneratorAgent };
