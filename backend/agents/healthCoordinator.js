const prisma = require("../config/db");
const { runVitalsAgent } = require("./vitalsAgent");
const { runTrendAgent } = require("./trendAgent");
const { runPrescriptionAgent } = require("./prescriptionAgent");

// ----------------------------------------------------------------------
// PHASE STATUS (update this as later phases land):
//   ✅ Vitals Agent            (Phase 1)
//   ✅ Trend Agent             (Phase 1)
//   ✅ Prescription Agent      (Phase 2)
//   ⏳ Risk Assessment Agent   (Phase 3)
//   ⏳ Lifestyle Agent         (Phase 4)
//   ⏳ Report Generator Agent  (Phase 4)
//   ⏳ Emergency Detection     (Phase 3)
// ----------------------------------------------------------------------

/**
 * HEALTH COORDINATOR AGENT
 * ----------------------------------------------------------------------
 * INPUT:  userId (from the authenticated request)
 * OUTPUT: a single aggregated JSON object combining every agent's output.
 *         In later phases this becomes the input to the Report Generator
 *         Agent, which turns it into the final report shown to the user.
 * ALGORITHM: Sequential Orchestration (a simple, deterministic pipeline —
 *         not a multi-agent negotiation). Each agent is pure: it receives
 *         only the data it needs and returns structured JSON, so agents
 *         never call each other directly and can be tested/replaced in
 *         isolation. This is the "manager" pattern: one coordinator holds
 *         the workflow, the specialists hold the domain reasoning.
 * ----------------------------------------------------------------------
 */

const startOfUtcDay = (date = new Date()) => {
  const value = new Date(date);
  value.setUTCHours(0, 0, 0, 0);
  return value;
};

const runHealthCoordinator = async (userId) => {
  // Step 1 — fetch latest vitals
  const latestLog = await prisma.healthLog.findFirst({
    where: { userId },
    orderBy: { logDate: "desc" },
  });

  // Step 2 — fetch last 30 days of health records
  const thirtyDaysAgo = startOfUtcDay();
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 29);
  const last30DaysLogs = await prisma.healthLog.findMany({
    where: { userId, logDate: { gte: thirtyDaysAgo } },
    orderBy: { logDate: "asc" },
  });

  // Step 3 — fetch latest prescription data (only the single most recent
  // one — deliberately NOT merged with older prescriptions, so a past,
  // possibly-discontinued medication never gets blended into "current"
  // health trends).
  const latestPrescription = await prisma.prescription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Step 3.5 — Emergency Detection short-circuit (Phase 3)
  // TODO(Phase 3): if latestLog crosses an emergency threshold, stop here
  // and return an Emergency Alert payload instead of continuing the
  // normal pipeline.

  // Step 4 — Vitals Analysis Agent
  const vitalsResult = await runVitalsAgent(latestLog);

  // Step 5 — Trend Analysis Agent
  const trendResult = await runTrendAgent(last30DaysLogs);

  // Step 6 — Prescription Analysis Agent
  const prescriptionResult = await runPrescriptionAgent(latestPrescription);

  // Step 7 — Risk Assessment Agent (Phase 3)
  const riskResult = { status: "pending", note: "Risk Assessment Agent arrives in Phase 3." };

  // Step 8 — Lifestyle Recommendation Agent (Phase 4)
  const lifestyleResult = { status: "pending", note: "Lifestyle Agent arrives in Phase 4." };

  // Step 9 — Report Generator Agent (Phase 4)
  // TODO(Phase 4): combine every result above into one final report.

  // Step 10 — return aggregated (partial, for now) result
  return {
    generatedAt: new Date().toISOString(),
    emergency: null,
    vitals: vitalsResult,
    trends: trendResult,
    prescription: prescriptionResult,
    risk: riskResult,
    lifestyle: lifestyleResult,
    report: null, // populated once the Report Generator Agent exists (Phase 4)
  };
};

module.exports = { runHealthCoordinator };
