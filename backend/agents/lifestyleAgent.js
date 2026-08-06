const { runAgent, Type } = require("../services/ai/geminiAgent.service");

/**
 * LIFESTYLE RECOMMENDATION AGENT
 * ----------------------------------------------------------------------
 * INPUT:  outputs of the Vitals, Trend, Prescription, and Risk agents
 *         (already computed by the coordinator).
 * OUTPUT: { recommendations: [{ category, advice, reason }], summary }
 * ALGORITHM: Grounded LLM Recommendation Generation. Unlike the earlier
 *         agents there's no numeric formula here — lifestyle advice is
 *         inherently qualitative. What keeps it from turning into generic
 *         "drink more water" tips is that the prompt forces every single
 *         recommendation to cite a specific fact from THIS patient's data
 *         (a status, a trend direction, a medication, or the risk level)
 *         in its "reason" field — if Gemini can't point to a specific
 *         data point, we don't accept the recommendation as personalized.
 * ----------------------------------------------------------------------
 */

const CATEGORIES = ["Diet", "Exercise", "Sleep", "Water intake", "Stress management", "Daily routine"];

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: `One of: ${CATEGORIES.join(", ")}` },
          advice: { type: Type.STRING, description: "One specific, actionable recommendation" },
          reason: { type: Type.STRING, description: "Must reference a specific fact from this patient's data (a vital status, a trend, a medication, or the risk level)" },
        },
        required: ["category", "advice", "reason"],
      },
    },
    summary: { type: Type.STRING, description: "1-2 sentence overview of the lifestyle focus for this patient right now" },
  },
  required: ["recommendations", "summary"],
};

const SYSTEM_INSTRUCTION = `You are the Lifestyle Recommendation Agent inside a healthcare assistant.
Write personalized recommendations for THIS patient only, based strictly on the data given below —
never give generic advice that could apply to anyone (e.g. never write "eat healthy and exercise
regularly" with no connection to their data). Every recommendation's "reason" field must reference
a specific fact you were given: a vital's status, a trend's direction, a medication the patient is
on, or the current risk level. Cover a reasonable mix of categories (Diet, Exercise, Sleep, Water
intake, Stress management, Daily routine) but only include categories that are actually relevant to
this patient's data — do not pad the list with irrelevant categories. Do not contradict any
medication the patient is on (e.g. never suggest a supplement or exercise intensity that would be
unsafe given their prescriptions). You are not a doctor — never suggest changing or stopping any
medication.`;

/**
 * @param {Object} vitalsResult - output of runVitalsAgent
 * @param {Object} trendResult - output of runTrendAgent
 * @param {Object} prescriptionResult - output of runPrescriptionAgent
 * @param {Object} riskResult - output of runRiskAssessmentAgent
 * @returns {Promise<{recommendations: Array, summary: string}>}
 */
const runLifestyleAgent = async (vitalsResult, trendResult, prescriptionResult, riskResult) => {
  const userPrompt = `Patient data to base recommendations on (do not use anything outside this):

Vitals findings: ${JSON.stringify(vitalsResult?.findings || [])}
Trend directions: ${JSON.stringify((trendResult?.trends || []).map((t) => ({ parameter: t.parameter, direction: t.direction, changeDescription: t.changeDescription })))}
Medication summary: ${prescriptionResult?.medicationSummary || "No prescription on file."}
Therapeutic areas: ${JSON.stringify(prescriptionResult?.therapeuticAreas || [])}
Risk level: ${riskResult?.riskLevel || "Unknown"}
Risk reasoning: ${riskResult?.reasoning || "N/A"}

Write personalized recommendations grounded strictly in the above.`;

  try {
    return await runAgent({ systemInstruction: SYSTEM_INSTRUCTION, userPrompt, responseSchema: RESPONSE_SCHEMA, temperature: 0.5 });
  } catch (err) {
    console.error("Lifestyle Agent error:", err.message);
    return {
      recommendations: [],
      summary: "Lifestyle recommendations are temporarily unavailable — please try refreshing the dashboard shortly.",
    };
  }
};

module.exports = { runLifestyleAgent };
