const express = require("express");
const router = express.Router();

const { addHealthLog, getHealthChartData, getHealthRecords } = require("../controllers/health.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Add or update daily health log
router.post("/log", authMiddleware, addHealthLog);

router.get("/chart", authMiddleware, getHealthChartData);
router.get("/records", authMiddleware, getHealthRecords);

module.exports = router;
