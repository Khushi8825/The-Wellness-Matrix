const multer = require("multer");

// memoryStorage keeps the file only as an in-memory Buffer on req.file.buffer.
// Unlike the profile-picture upload (diskStorage), nothing touches the disk here —
// the buffer is sent straight to Gemini and discarded once the request finishes.
// Prescription photos from phone cameras run larger than typical profile pictures,
// so the limit here (8MB) is higher than the 5MB used for profile pictures.
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(new Error("INVALID_FILE_TYPE"));
  }
  cb(null, true);
};

const prescriptionUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
}).single("prescription");

// Wraps multer so failures come back as clean JSON instead of throwing.
const handlePrescriptionUpload = (req, res, next) => {
  prescriptionUpload(req, res, (err) => {
    if (!err) return next();

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "That image is larger than 8MB. Please choose a smaller photo." });
    }
    if (err.message === "INVALID_FILE_TYPE") {
      return res.status(400).json({ message: "Only JPG, JPEG, PNG, and WEBP images are allowed." });
    }
    console.error("Prescription upload error:", err);
    return res.status(400).json({ message: "Failed to process the uploaded image." });
  });
};

module.exports = handlePrescriptionUpload;
