const express = require("express");
const router = express.Router();

const { addHealthLog } = require("../controllers/health.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Add or update daily health log
router.post("/log", authMiddleware, addHealthLog);

const { getHealthChartData } = require("../controllers/health.controller");
router.get("/chart", authMiddleware, getHealthChartData);

module.exports = router;
