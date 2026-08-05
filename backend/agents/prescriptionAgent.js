const { runAgent, Type } = require("../services/ai/geminiAgent.service");

/**
 * PRESCRIPTION ANALYSIS AGENT
 * ----------------------------------------------------------------------
 * INPUT:  the user's most recent saved Prescription row — the SAME JSON
 *         already produced by the existing OCR pipeline
 *         (services/ai/prescriptionVision.service.js). This agent never
 *         touches an image and never calls the OCR model again; it only
 *         reads what was already extracted and saved (Phase 2 addition:
 *         prescription.controller.js now persists that result).
 * OUTPUT: { hasPrescription, medications, therapeuticAreas,
 *           instructionsSummary, medicationSummary }
 * ALGORITHM: Retrieval + LLM Summarization. No OCR, no re-extraction —
 *         just a single Gemini reasoning pass over already-structured
 *         data to (a) group medicines into therapeutic areas (e.g.
 *         "Hypertension", "Diabetes") and (b) produce one paragraph the
 *         Risk Assessment Agent (Phase 3) can combine with vitals/trends
 *         without needing to re-read raw medicine names itself.
 * ----------------------------------------------------------------------
 */

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    medications: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          dosageSummary: { type: Type.STRING, description: "e.g. '500mg, twice a day, after food, for 5 days'" },
          purpose: { type: Type.STRING, description: "One simple sentence on what this medicine is generally for" },
        },
        required: ["name", "dosageSummary", "purpose"],
      },
    },
    therapeuticAreas: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "e.g. ['Hypertension', 'Diabetes'] — inferred only from the medicines actually listed",
    },
    instructionsSummary: { type: Type.STRING, description: "One sentence combining the doctor's written instructions" },
    medicationSummary: {
      type: Type.STRING,
      description: "2-3 sentence summary for other agents to use, e.g. 'Patient is currently on antihypertensive therapy...'",
    },
  },
  required: ["medications", "therapeuticAreas", "instructionsSummary", "medicationSummary"],
};

const SYSTEM_INSTRUCTION = `You are the Prescription Analysis Agent inside a healthcare assistant.
You are given prescription data that was ALREADY extracted and confirmed by a separate OCR step —
never invent a medicine that isn't listed, never change a dosage. Your job is only to (1) write one
short dosage summary and purpose sentence per medicine, (2) infer general therapeutic areas from the
medicines listed (e.g. a beta-blocker implies "Hypertension" or "Heart condition"), and (3) write a
short medication summary that another AI agent (which does not see the raw prescription) can rely on
to understand what the patient is currently taking. Stay conservative: if a medicine name was marked
unreadable, mention that plainly instead of guessing what it might be.`;

/**
 * @param {Object|null} latestPrescription - saved Prescription row (camelCase), or null
 * @returns {Promise<Object>}
 */
const runPrescriptionAgent = async (latestPrescription) => {
  if (!latestPrescription) {
    return {
      hasPrescription: false,
      medications: [],
      therapeuticAreas: [],
      instructionsSummary: "No prescription on file.",
      medicationSummary: "The patient has no prescription on record.",
    };
  }

  const userPrompt = `Already-extracted prescription data (do not re-interpret medicine names or dosages —
only summarize what's here):
${JSON.stringify(
  {
    medicines: latestPrescription.medicines,
    doctorInstructions: latestPrescription.doctorInstructions,
    overallConfidence: latestPrescription.overallConfidence,
    unreadableNotes: latestPrescription.unreadableNotes,
  },
  null,
  2
)}`;

  try {
    const result = await runAgent({ systemInstruction: SYSTEM_INSTRUCTION, userPrompt, responseSchema: RESPONSE_SCHEMA, temperature: 0.2 });
    return { hasPrescription: true, ...result };
  } catch (err) {
    console.error("Prescription Agent error:", err.message);
    // Graceful fallback: still return the raw extracted data (unsumarized)
    // so downstream agents have something to work with even if the LLM call fails.
    const medicines = Array.isArray(latestPrescription.medicines) ? latestPrescription.medicines : [];
    return {
      hasPrescription: true,
      medications: medicines.map((m) => ({
        name: m.name,
        dosageSummary: [m.strength, m.dosage, m.frequency, m.duration].filter(Boolean).join(", ") || "Not specified",
        purpose: m.explanation || "Not available",
      })),
      therapeuticAreas: [],
      instructionsSummary: Array.isArray(latestPrescription.doctorInstructions) ? latestPrescription.doctorInstructions.join("; ") : "",
      medicationSummary: "Medication summary generated from raw extracted data (AI summarization unavailable right now).",
    };
  }
};

module.exports = { runPrescriptionAgent };
