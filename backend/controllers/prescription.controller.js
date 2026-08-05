const { analyzePrescriptionImage, ApiError } = require("../services/ai/prescriptionVision.service");
const { validatePrescriptionFile } = require("../validators/prescription.validator");
const prisma = require("../config/db");

const SAFETY_WARNING =
  "This AI interpretation may contain mistakes because handwritten prescriptions can be difficult to read. " +
  "Always verify the extracted medicines and instructions with your doctor or pharmacist before taking any medication.";

const analyzePrescription = async (req, res) => {
  const validation = validatePrescriptionFile(req.file);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  try {
    const result = await analyzePrescriptionImage(req.file.buffer, req.file.mimetype);

    // Phase 2 (Agentic AI upgrade): persist the analysis so the Health
    // Coordinator can read the latest prescription automatically later,
    // instead of it only ever existing in this one response. This is
    // purely additive — saving never blocks or changes the response the
    // user already gets today, and a save failure never fails the request.
    try {
      await prisma.prescription.create({
        data: {
          userId: Number(req.user.id),
          medicines: result.medicines,
          doctorInstructions: result.doctorInstructions,
          overallConfidence: result.overallConfidence,
          unreadableNotes: result.unreadableNotes,
        },
      });
    } catch (saveError) {
      console.error("Prescription save error (non-fatal):", saveError.message);
    }

    return res.status(200).json({ ...result, safetyWarning: SAFETY_WARNING });
  } catch (err) {
    console.error("Prescription analysis error:", err);

    // Missing/invalid API key — a setup problem, not a user problem.
    if (err.message === "MISSING_API_KEY") {
      return res.status(500).json({ message: "Prescription analysis isn't configured yet. Please contact support." });
    }

    // The SDK throws ApiError (with a numeric .status) for HTTP-level failures.
    if (err instanceof ApiError) {
      if (err.status === 429) {
        return res.status(429).json({ message: "We're getting a lot of requests right now. Please wait a moment and try again." });
      }
      if (err.status >= 500) {
        return res.status(502).json({ message: "The AI service is temporarily unavailable. Please try again shortly." });
      }
      return res.status(502).json({ message: "The AI service couldn't process this image. Please try a clearer photo." });
    }

    // Network-level failures: no internet, DNS failure, or our own timeout.
    if (err.name === "AbortError" || err.code === "ENOTFOUND" || err.code === "ECONNREFUSED" || /timeout/i.test(err.message || "")) {
      return res.status(504).json({ message: "The request took too long or the network is unavailable. Please check your connection and try again." });
    }

    if (err.message === "EMPTY_AI_RESPONSE" || err.message === "MALFORMED_AI_RESPONSE") {
      return res.status(502).json({ message: "We couldn't make sense of the AI's response. Please try again." });
    }

    return res.status(500).json({ message: "Something went wrong while analyzing the prescription. Please try again." });
  }
};

module.exports = { analyzePrescription };
