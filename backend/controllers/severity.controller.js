const pool = require("../config/db");
const analyzeSeverity = require("../services/severity");

/**
 * GET /api/health/severity
 * Protected route (JWT required)
 */
const getSeverity = async (req, res) => {
  try {
    // 1️⃣ Get user id from auth middleware
    const userId = req.user.id;

    // 2️⃣ Fetch recent health logs (last 7 days)
    const [logs] = await pool.query(
      `
      SELECT 
        heart_rate,
        systolic_bp,
        diastolic_bp,
        blood_sugar,
        meals,
        log_date
      FROM health_logs
      WHERE user_id = ?
        AND log_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      ORDER BY log_date ASC
      `,
      [userId]
    );

    // 3️⃣ If no data
    if (!logs || logs.length === 0) {
      return res.status(200).json({
        severity: "NORMAL",
        reasons: ["Not enough recent data to analyze health trends"],
      });
    }

    // 4️⃣ Analyze severity using rules engine
    const result = analyzeSeverity(logs);

    // 5️⃣ Send response
    return res.status(200).json({
      severity: result.severity,
      reasons: result.reasons,
    });
  } catch (error) {
    console.error("Severity Controller Error:", error);

    return res.status(500).json({
      message: "Failed to analyze health severity",
    });
  }
};

module.exports = {
  getSeverity,
};
