const { GoogleGenAI, Type, ApiError } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// gemini-2.5-flash: fast + free-tier friendly + strong handwriting OCR.
// Kept as a single constant so it's a one-line change if you ever want to
// swap models (e.g. to a newer flash release) without touching the rest.
const MODEL = "gemini-3.5-flash";

// Every request has 30s to complete before we give up and surface a
// friendly timeout message instead of leaving the user staring at a spinner.
const REQUEST_TIMEOUT_MS = 30000;

const CONFIDENCE_LEVELS = ["High", "Medium", "Low"];

// responseSchema forces Gemini to return well-typed JSON instead of free-form
// prose, which is what makes the "don't guess, say so instead" instruction
// enforceable — the model can't quietly hand-wave uncertainty into vague text
// when every field has a defined shape it must fill in.
const PRESCRIPTION_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    medicines: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Medicine name, or 'Unable to confidently identify this medicine' if unreadable" },
          strength: { type: Type.STRING, nullable: true, description: "e.g. '500mg'; null if not legible" },
          dosage: { type: Type.STRING, nullable: true, description: "e.g. '1 tablet'; null if not legible" },
          frequency: { type: Type.STRING, nullable: true, description: "e.g. 'Twice a day'; null if not legible" },
          duration: { type: Type.STRING, nullable: true, description: "e.g. '5 days'; null if not written" },
          explanation: { type: Type.STRING, description: "One simple-English sentence on what this medicine is generally used for; a plain note about uncertainty if the name isn't identifiable" },
          confidence: { type: Type.STRING, enum: CONFIDENCE_LEVELS },
        },
        required: ["name", "explanation", "confidence"],
      },
    },
    doctorInstructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Plain instructions found on the prescription, e.g. 'After food', 'Empty stomach', 'Drink plenty of water'",
    },
    overallConfidence: { type: Type.STRING, enum: CONFIDENCE_LEVELS },
    unreadableNotes: { type: Type.STRING, nullable: true, description: "Plain-English note about anything that could not be read reliably; null if everything was clear" },
  },
  required: ["medicines", "doctorInstructions", "overallConfidence"],
};

const SYSTEM_INSTRUCTION = `You are a careful, conservative assistant that reads photographs of handwritten or printed doctor prescriptions.

Rules you must always follow:
1. Never invent, guess, or assume a medicine name, dosage, frequency, or duration. If a word is not clearly legible, set that field to null (or, for the medicine name itself, use the exact text "Unable to confidently identify this medicine") rather than producing your best guess.
2. Explain each identified medicine in one simple sentence a non-medical person would understand. Do not use complex medical terminology.
3. Extract only instructions that are actually written on the prescription (e.g. after food, before food, morning, night, empty stomach, drink plenty of water). Do not add instructions that are not present.
4. Set confidence per medicine, and one overall confidence, based only on how legible the handwriting actually is.
5. You are not diagnosing or prescribing anything. You are only transcribing and explaining what is written.
6. If the image is not a prescription at all, or nothing is legible, return an empty medicines array, overallConfidence "Low", and explain that in unreadableNotes.`;

const buildUserPrompt = () =>
  "Read this prescription image and extract the medicines, dosages, frequency, duration, doctor instructions, and your confidence, following the system rules exactly. Respond only with data matching the required JSON schema.";

/**
 * @param {Buffer} imageBuffer - raw image bytes from Multer's memoryStorage
 * @param {string} mimeType - e.g. "image/jpeg"
 * @returns {Promise<{medicines: Array, doctorInstructions: string[], overallConfidence: string, unreadableNotes: string|null}>}
 */
const analyzePrescriptionImage = async (imageBuffer, mimeType) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("MISSING_API_KEY");
  }

  const response = await ai.models.generateContent({
    
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { text: buildUserPrompt() },
          { inlineData: { mimeType, data: imageBuffer.toString("base64") } },
        ],
      },
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: PRESCRIPTION_RESPONSE_SCHEMA,
      temperature: 0.1, // low temperature: we want faithful transcription, not creative variation
      httpOptions: { timeout: REQUEST_TIMEOUT_MS },
    },
  });

  const rawText = response.text;
  console.log("Gemini Raw Response:");
  console.log(response.text)
  if (!rawText) {
    throw new Error("EMPTY_AI_RESPONSE");
  }

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    console.error("Failed to parse Gemini response as JSON:", rawText);
    throw new Error("MALFORMED_AI_RESPONSE");
  }

  return {
    medicines: Array.isArray(parsed.medicines) ? parsed.medicines : [],
    doctorInstructions: Array.isArray(parsed.doctorInstructions) ? parsed.doctorInstructions : [],
    overallConfidence: CONFIDENCE_LEVELS.includes(parsed.overallConfidence) ? parsed.overallConfidence : "Low",
    unreadableNotes: parsed.unreadableNotes || null,
  };
};

module.exports = { analyzePrescriptionImage, ApiError };
