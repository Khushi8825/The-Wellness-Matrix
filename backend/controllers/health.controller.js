const pool = require("../config/db");

/**
 * POST /api/health/log
 * Add or update daily health record
 */
const addHealthLog = async (req, res) => {
  try {
    const userId = req.user.id;

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
      return res.status(400).json({
        message: "log_date is required",
      });
    }

    const query = `
      INSERT INTO health_logs (
        user_id,
        log_date,
        heart_rate,
        systolic_bp,
        diastolic_bp,
        blood_sugar,
        weight,
        meals
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
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [
      userId,
      log_date,
      heart_rate,
      systolic_bp,
      diastolic_bp,
      blood_sugar,
      weight,
      meals,
    ];

    const { rows } = await pool.query(query, values);

    return res.status(201).json({
      message: "Health log saved successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("❌ Health Log Error:", error);

    return res.status(500).json({
      message: "Failed to save health log",
    });
  }
};

module.exports = {
  addHealthLog,
};
