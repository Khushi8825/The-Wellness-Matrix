const prisma = require("../config/db");
const analyzeSeverity = require("../services/severity");

const getSeverity = async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setUTCHours(0, 0, 0, 0);
    startDate.setUTCDate(startDate.getUTCDate() - 7);
    const records = await prisma.healthLog.findMany({
      where: { userId: Number(req.user.id), logDate: { gte: startDate } }, orderBy: { logDate: "asc" },
    });
    if (!records.length) {
      return res.status(200).json({ severity: "NORMAL", reasons: ["Not enough recent data to analyze health trends"] });
    }
    const logs = records.map((log) => ({ heart_rate: log.heartRate, systolic_bp: log.systolicBp, diastolic_bp: log.diastolicBp, blood_sugar: log.bloodSugar, meals: log.meals, log_date: log.logDate }));
    const result = analyzeSeverity(logs);
    return res.status(200).json({ severity: result.severity, reasons: result.reasons });
  } catch (error) {
    console.error("Severity controller error:", error);
    return res.status(500).json({ message: "Failed to analyze health severity" });
  }
};

module.exports = { getSeverity };
