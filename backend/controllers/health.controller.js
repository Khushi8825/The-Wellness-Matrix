const { generateHealthExplanation } = require("../services/ai/healthExplanation.service");
const prisma = require("../config/db");
const analyzeSeverity = require("../services/severity");

const startOfUtcDay = (date = new Date()) => {
  const value = new Date(date);
  value.setUTCHours(0, 0, 0, 0);
  return value;
};

const toApiLog = (log) => ({
  log_date: log.logDate,
  heart_rate: log.heartRate,
  systolic_bp: log.systolicBp,
  diastolic_bp: log.diastolicBp,
  blood_sugar: log.bloodSugar,
  weight: log.weight,
  sleep_hours: log.sleepHours,
  meals: log.meals,
});

const addHealthLog = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { log_date, heart_rate, systolic_bp, diastolic_bp, blood_sugar, weight, sleep, meals } = req.body;
    if (!log_date) return res.status(400).json({ message: "log_date is required" });

    const logDate = new Date(`${log_date}T00:00:00.000Z`);
    if (Number.isNaN(logDate.getTime())) return res.status(400).json({ message: "log_date is invalid" });
    const optionalNumber = (value) => (value === "" || value === undefined ? null : Number(value));
    const data = {
      heartRate: optionalNumber(heart_rate), systolicBp: optionalNumber(systolic_bp),
      diastolicBp: optionalNumber(diastolic_bp), bloodSugar: optionalNumber(blood_sugar),
      weight: optionalNumber(weight), sleepHours: optionalNumber(sleep), meals: meals || null,
    };

    await prisma.healthLog.upsert({
      where: { userId_logDate: { userId, logDate } },
      create: { userId, logDate, ...data },
      update: { ...data, updatedAt: new Date() },
    });

    const sevenDaysAgo = startOfUtcDay();
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
    const recentLogs = await prisma.healthLog.findMany({
      where: { userId, logDate: { gte: sevenDaysAgo } }, orderBy: { logDate: "asc" },
    });
    const severityResult = analyzeSeverity(recentLogs.map(toApiLog));
    const thirtyDaysAgo = startOfUtcDay();
    thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 29);
    const analysisLogs = await prisma.healthLog.findMany({
      where: { userId, logDate: { gte: thirtyDaysAgo } }, orderBy: { logDate: "asc" },
    });
    const today = startOfUtcDay();

    await prisma.healthSeverity.create({
      data: { userId, startDate: sevenDaysAgo, endDate: today, severity: severityResult.severity, reasons: severityResult.reasons.join(", ") },
    });

    let aiExplanation;
    try {
      aiExplanation = await generateHealthExplanation(severityResult.severity, severityResult.reasons, analysisLogs.map(toApiLog));
    } catch (aiError) {
      console.error("AI explanation error:", aiError.message);
      aiExplanation = "Your health data has been recorded successfully. Please maintain healthy habits.";
    }

    return res.status(201).json({
      message: "Health log saved & severity updated", severity: severityResult.severity,
      reasons: severityResult.reasons, explanation: aiExplanation,
    });
  } catch (error) {
    console.error("Health log error:", error);
    return res.status(500).json({ message: "Failed to save health log" });
  }
};

const getHealthChartData = async (req, res) => {
  try {
    const startDate = startOfUtcDay();
    startDate.setUTCDate(startDate.getUTCDate() - 29);
    const logs = await prisma.healthLog.findMany({
      where: { userId: Number(req.user.id), logDate: { gte: startDate } }, orderBy: { logDate: "asc" },
    });
    return res.json(logs.map(toApiLog));
  } catch (error) {
    console.error("Chart data error:", error);
    return res.status(500).json({ message: "Failed to fetch chart data" });
  }
};

const getHealthRecords = async (req, res) => {
  try {
    const logs = await prisma.healthLog.findMany({
      where: { userId: Number(req.user.id) }, orderBy: { logDate: "desc" },
    });
    return res.json(logs.map(toApiLog));
  } catch (error) {
    console.error("Health records error:", error);
    return res.status(500).json({ message: "Failed to fetch health records" });
  }
};

module.exports = { addHealthLog, getHealthChartData, getHealthRecords };
