// Computes dashboard-card averages from raw health log/record objects.
// Records come from /api/health/records or /api/health/chart, both of
// which return the same shape (see backend toApiLog):
//   { log_date, heart_rate, systolic_bp, diastolic_bp, blood_sugar, weight, sleep_hours, meals }

const average = (values) => {
  const numeric = values
    .map((value) => (value === null || value === undefined ? null : Number(value)))
    .filter((value) => value !== null && !Number.isNaN(value));

  if (!numeric.length) return null;
  return numeric.reduce((sum, value) => sum + value, 0) / numeric.length;
};

const round = (value, decimals = 1) => {
  if (value === null) return null;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

/**
 * @param {Array<object>} logs - health records/logs for the current user
 * @returns {{
 *   heartRate: number|null,
 *   systolic: number|null,
 *   diastolic: number|null,
 *   sleepHours: number|null,
 *   bloodSugar: number|null,
 *   weight: number|null,
 *   recordCount: number,
 * }}
 */
export const computeHealthAverages = (logs = []) => {
  const safeLogs = Array.isArray(logs) ? logs : [];

  return {
    heartRate: round(average(safeLogs.map((log) => log.heart_rate)), 0),
    systolic: round(average(safeLogs.map((log) => log.systolic_bp)), 0),
    diastolic: round(average(safeLogs.map((log) => log.diastolic_bp)), 0),
    sleepHours: round(average(safeLogs.map((log) => log.sleep_hours)), 1),
    bloodSugar: round(average(safeLogs.map((log) => log.blood_sugar)), 0),
    weight: round(average(safeLogs.map((log) => log.weight)), 1),
    recordCount: safeLogs.length,
  };
};
