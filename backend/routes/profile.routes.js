const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { getProfile, updateProfile } = require("../controllers/profile.controller");

const router = express.Router();

router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);

module.exports = router;
