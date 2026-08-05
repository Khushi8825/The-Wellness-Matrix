const express = require("express");
const router = express.Router();

const { getCoordinatorReport } = require("../controllers/coordinator.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// GET /api/health/coordinator — runs the full agentic pipeline for the
// authenticated user and returns the aggregated report.
router.get("/coordinator", authMiddleware, getCoordinatorReport);

module.exports = router;
