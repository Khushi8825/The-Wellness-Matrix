const express = require("express");
const router = express.Router();
const { getSeverity } = require("../controllers/severity.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/severity", authMiddleware, getSeverity);

module.exports = router;
