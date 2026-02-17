const {
  generateHealthExplanation,
} = require("../services/ai/healthExplanation.service");

const pool = require("../config/db");
const analyzeSeverity = require("../services/severity");

/**
 * POST /api/health/log
 * Save daily health log + auto calculate severity
 */
const addHealthLog = async (req, res) => {
  try {
    const userId = req.user.id;

    const sanitizeNumber = (value) =>
      value === "" || value === undefined ? null : Number(value);

    const {
      log_date,
      heart_rate,
      systolic_bp,
      diastolic_bp,
      blood_sugar,
      weight,
      meals,
    } = req.body;

    if (!log_date) {
      return res.status(400).json({ message: "log_date is required" });
    }

    const cleanedData = {
      heart_rate: sanitizeNumber(heart_rate),
      systolic_bp: sanitizeNumber(systolic_bp),
      diastolic_bp: sanitizeNumber(diastolic_bp),
      blood_sugar: sanitizeNumber(blood_sugar),
      weight: sanitizeNumber(weight),
      meals: meals || null,
    };

    /* 1️⃣ SAVE / UPDATE DAILY HEALTH LOG */
    const insertQuery = `
      INSERT INTO health_logs (
        user_id, log_date, heart_rate, systolic_bp, diastolic_bp,
        blood_sugar, weight, meals
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (user_id, log_date)
      DO UPDATE SET
        heart_rate = EXCLUDED.heart_rate,
        systolic_bp = EXCLUDED.systolic_bp,
        diastolic_bp = EXCLUDED.diastolic_bp,
        blood_sugar = EXCLUDED.blood_sugar,
        weight = EXCLUDED.weight,
        meals = EXCLUDED.meals,
        updated_at = CURRENT_TIMESTAMP;
    `;

    await pool.query(insertQuery, [
      userId,
      log_date,
      cleanedData.heart_rate,
      cleanedData.systolic_bp,
      cleanedData.diastolic_bp,
      cleanedData.blood_sugar,
      cleanedData.weight,
      cleanedData.meals,
    ]);

    /* 2️⃣ FETCH LAST 7 DAYS DATA FOR SEVERITY */
    const logsQuery = `
      SELECT heart_rate, systolic_bp, diastolic_bp, blood_sugar, meals
      FROM health_logs
      WHERE user_id = $1
        AND log_date >= CURRENT_DATE - INTERVAL '7 days'
      ORDER BY log_date ASC;
    `;

    const { rows: logs } = await pool.query(logsQuery, [userId]);

    /* 3️⃣ FETCH LATEST RECORD (STRICT) */
    const latestQuery = `
      SELECT heart_rate, systolic_bp, diastolic_bp, blood_sugar
      FROM health_logs
      WHERE user_id = $1
      ORDER BY updated_at DESC
      LIMIT 1;
    `;

    const { rows: latestRows } = await pool.query(latestQuery, [userId]);
    const latestLog = latestRows[0];

    console.log("LATEST LOG SENT TO AI:", latestLog);

    /* 4️⃣ ANALYZE SEVERITY */
    const severityResult = analyzeSeverity(logs);

    /* 5️⃣ STORE SEVERITY RESULT */
    const severityInsertQuery = `
      INSERT INTO health_severity (
        user_id, start_date, end_date, severity, reasons
      )
      VALUES ($1, CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE, $2, $3);
    `;

    await pool.query(severityInsertQuery, [
      userId,
      severityResult.severity,
      severityResult.reasons.join(", "),
    ]);

    /* 6️⃣ AI EXPLANATION */
    let aiExplanation = null;

    try {
      aiExplanation = await generateHealthExplanation(
        severityResult.severity,
        severityResult.reasons,
        latestLog
      );
    } catch (aiError) {
      console.error("❌ AI ERROR:", aiError.message);
      aiExplanation =
        "Your health data has been recorded successfully. Please maintain healthy habits.";
    }

    return res.status(201).json({
      message: "Health log saved & severity updated",
      severity: severityResult.severity,
      reasons: severityResult.reasons,
      explanation: aiExplanation,
    });

  } catch (error) {
    console.error("❌ Health Log + Severity Error:", error);

    return res.status(500).json({
      message: "Failed to save health log",
    });
  }
};

const getHealthChartData = async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT 
        log_date,
        heart_rate,
        systolic_bp
      FROM health_logs
      WHERE user_id = $1
        AND log_date >= CURRENT_DATE - INTERVAL '7 days'
      ORDER BY log_date ASC;
    `;

    const { rows } = await pool.query(query, [userId]);

    return res.json(rows);
  } catch (error) {
    console.error("❌ Chart Data Error:", error);
    return res.status(500).json({ message: "Failed to fetch chart data" });
  }
};
module.exports = {
  addHealthLog,
  getHealthChartData,
};
