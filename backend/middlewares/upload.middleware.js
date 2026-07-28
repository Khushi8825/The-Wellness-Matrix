const fs = require("fs");
const path = require("path");
const multer = require("multer");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "profile-pictures");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const EXTENSION_BY_MIME = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const userId = req.user?.id || "anon";
    const ext = EXTENSION_BY_MIME[file.mimetype] || path.extname(file.originalname).toLowerCase() || ".jpg";
    cb(null, `user-${userId}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(new Error("INVALID_FILE_TYPE"));
  }
  cb(null, true);
};

const profilePictureUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
}).single("photo");

// Wraps multer so failures come back as clean JSON instead of throwing.
const handleProfilePictureUpload = (req, res, next) => {
  profilePictureUpload(req, res, (err) => {
    if (!err) return next();

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Image must be 5MB or smaller" });
    }
    if (err.message === "INVALID_FILE_TYPE") {
      return res.status(400).json({ message: "Only JPG, JPEG, PNG, and WEBP images are allowed" });
    }
    console.error("Profile picture upload error:", err);
    return res.status(400).json({ message: "Failed to process the uploaded image" });
  });
};

module.exports = handleProfilePictureUpload;
module.exports.UPLOAD_DIR = UPLOAD_DIR;
