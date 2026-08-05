const { GoogleGenAI, Type, ApiError } = require("@google/genai");

// Single shared client — every agent borrows this instead of creating its
// own, same pattern as prescriptionVision.service.js but factored out so
// the 5 new agents (vitals, trend, risk, lifestyle, report) don't each
// duplicate SDK setup, timeout handling, and JSON-parsing/error logic.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// NOTE: prescriptionVision.service.js currently hardcodes MODEL =
// "gemini-3.5-flash", which is not a published Gemini model name (likely
// meant to be "gemini-2.5-flash" per its own comment). We're not touching
// that existing file per your "don't modify existing features" instruction
// — just flagging it here so you can fix it separately if it's a typo.
const MODEL = "gemini-2.5-flash";

const REQUEST_TIMEOUT_MS = 30000;

/**
 * Runs one "agent turn": a dedicated system instruction + user prompt,
 * constrained to a JSON schema, exactly like the existing prescription
 * analyzer does. This is the building block every specialized agent uses,
 * so each agent's own file only has to define *what* to ask, not *how* to
 * call the model.
 *
 * @param {Object} params
 * @param {string} params.systemInstruction - defines the agent's role/rules
 * @param {string} params.userPrompt - the agent-specific question + data
 * @param {Object} params.responseSchema - Gemini structured-output schema
 * @param {number} [params.temperature=0.3]
 * @returns {Promise<Object>} parsed JSON matching responseSchema
 */
const runAgent = async ({ systemInstruction, userPrompt, responseSchema, temperature = 0.3 }) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("MISSING_API_KEY");
  }

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema,
      temperature,
      httpOptions: { timeout: REQUEST_TIMEOUT_MS },
    },
  });

  const rawText = response.text;
  if (!rawText) throw new Error("EMPTY_AI_RESPONSE");

  try {
    return JSON.parse(rawText);
  } catch (err) {
    console.error("Agent JSON parse failure:", rawText);
    throw new Error("MALFORMED_AI_RESPONSE");
  }
};

module.exports = { runAgent, Type, ApiError };
