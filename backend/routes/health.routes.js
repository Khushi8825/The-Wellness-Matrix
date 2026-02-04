const express = require("express");
const router = express.Router();

const { addHealthLog } = require("../controllers/health.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Add or update daily health log
router.post("/log", authMiddleware, addHealthLog);

module.exports = router;
