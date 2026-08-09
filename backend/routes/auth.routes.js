const express = require("express");
const router = express.Router();
const { register, login, googleAuth } = require("../controllers/auth.controller");
const { loginLimiter, registerLimiter, googleAuthLimiter } = require("../middlewares/rateLimit.middleware");

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/google", googleAuthLimiter, googleAuth);

module.exports = router;