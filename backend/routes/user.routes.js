const express = require("express");
const router = express.Router();

const { getMe, uploadProfilePicture } = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const handleProfilePictureUpload = require("../middlewares/upload.middleware");

router.get("/me", authMiddleware, getMe);
router.post("/me/photo", authMiddleware, handleProfilePictureUpload, uploadProfilePicture);

module.exports = router;
