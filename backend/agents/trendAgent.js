const { runAgent, Type } = require("../services/ai/geminiAgent.service");

/**
 * TREND ANALYSIS AGENT
 * ----------------------------------------------------------------------
 * INPUT:  the last 30 days of HealthLog rows for the user (fetched once
 *         by healthCoordinator.js and shared with this agent).
 * OUTPUT: { trends: [{ parameter, direction, changeDescription, note }],
 *           summary }
 * ALGORITHM: Least-Squares Linear Regression (simple, explainable trend
 *         line) computed per vital across the days that actually have a
 *         value. The slope tells us direction (rising/falling/stable) and
 *         magnitude tells us how fast — deterministic and reproducible.
 *         Gemini then converts the slopes into the kind of narrative
 *         sentences you described ("BP has been gradually increasing over
 *         the last 18 days"), grounded strictly in the numbers we give it.
 * ----------------------------------------------------------------------
 */

// A day-index (0, 1, 2, ...) is used as x so the slope is directly
// "unit change per day" regardless of gaps in logging.
const linearRegressionSlope = (points) => {
  const n = points.length;
  if (n < 2) return null;

  const meanX = points.reduce((sum, p) => sum + p.x, 0) / n;
  const meanY = points.reduce((sum, p) => sum + p.y, 0) / n;

  let numerator = 0;
  let denominator = 0;
  points.forEach(({ x, y }) => {
    numerator += (x - meanX) * (y - meanY);
    denominator += (x - meanX) ** 2;
  });

  if (denominator === 0) return 0;
  return numerator / denominator; // slope = units of y per day
};

// Turns a raw slope into a direction label. threshold is the minimum
// per-day change (in the parameter's own units) before we call it a real
// trend rather than noise.
const classifyDirection = (slope, threshold) => {
  if (slope === null) return "Insufficient data";
  if (slope > threshold) return "Increasing";
  if (slope < -threshold) return "Decreasing";
  return "Stable";
};

// Per-parameter noise thresholds, chosen conservatively so single noisy
// readings don't get reported as a "trend".
const THRESHOLDS = {
  systolicBp: 0.3, diastolicBp: 0.2, heartRate: 0.3,
  bloodSugar: 0.5, weight: 0.02, sleepHours: 0.05,
};

const extractSeries = (logs, field) =>
  logs
    .map((log, index) => ({ x: index, y: log[field], date: log.logDate }))
    .filter((p) => p.y !== null && p.y !== undefined);

const computeTrend = (logs, field) => {
  const series = extractSeries(logs, field);
  const slope = linearRegressionSlope(series);
  const direction = classifyDirection(slope, THRESHOLDS[field]);
  const spanDays = series.length ? series[series.length - 1].x - series[0].x : 0;
  const totalChange = slope !== null ? Number((slope * spanDays).toFixed(2)) : null;
  return { field, direction, slopePerDay: slope !== null ? Number(slope.toFixed(3)) : null, totalChange, daysTracked: series.length };
};

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    trends: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          parameter: { type: Type.STRING },
          direction: { type: Type.STRING },
          changeDescription: { type: Type.STRING, description: "e.g. 'increased by 2.4 kg over 30 days'" },
          note: { type: Type.STRING, description: "One plain-English sentence describing this trend, in the style of a clinician's note" },
        },
        required: ["parameter", "direction", "changeDescription", "note"],
      },
    },
    summary: { type: Type.STRING, description: "2-3 sentence overall summary of the patient's 30-day trajectory" },
  },
  required: ["trends", "summary"],
};

const SYSTEM_INSTRUCTION = `You are the Trend Analysis Agent inside a healthcare assistant.
You are given pre-computed linear-regression trend statistics (direction, slope per day, total
change, days tracked) for several health parameters over roughly 30 days. These numbers are
already calculated and correct — do not recompute or contradict them. Your job is only to turn
each parameter's statistics into one clear, human-readable sentence (in the style of "Blood
pressure has been gradually increasing over the last 18 days"), plus a short overall summary of
the patient's trajectory. If daysTracked is fewer than 5, say there isn't enough data yet for
that parameter instead of describing a trend.`;

/**
 * @param {Array} last30DaysLogs - HealthLog rows, oldest first (camelCase fields)
 * @returns {Promise<{trends: Array, summary: string}>}
 */
const runTrendAgent = async (last30DaysLogs) => {
  if (!last30DaysLogs || last30DaysLogs.length === 0) {
    return { trends: [], summary: "Not enough historical data yet to detect trends." };
  }

  const fields = ["systolicBp", "diastolicBp", "heartRate", "bloodSugar", "weight", "sleepHours"];
  const stats = fields.map((field) => computeTrend(last30DaysLogs, field)).filter((t) => t.daysTracked > 0);

  const userPrompt = `Pre-computed 30-day trend statistics (already correct — do not change the numbers):
${JSON.stringify(stats, null, 2)}

Write one trend object per parameter above, plus an overall summary.`;

  try {
    return await runAgent({ systemInstruction: SYSTEM_INSTRUCTION, userPrompt, responseSchema: RESPONSE_SCHEMA, temperature: 0.3 });
  } catch (err) {
    console.error("Trend Agent error:", err.message);
    return {
      trends: stats.map((t) => ({
        parameter: t.field,
        direction: t.direction,
        changeDescription: t.totalChange !== null ? `Changed by ${t.totalChange} over ${t.daysTracked} tracked days` : "Not enough data",
        note: `${t.field} trend: ${t.direction} (AI phrasing unavailable right now).`,
      })),
      summary: "Trends were computed using linear regression (AI narrative unavailable right now).",
    };
  }
};

module.exports = { runTrendAgent };
