// Multer's fileFilter already rejects the wrong mime type / oversized files
// before this ever runs (see middlewares/prescriptionUpload.middleware.js).
// This validator is the controller-level defense-in-depth check: it confirms
// a file actually arrived and isn't an empty/corrupt buffer, independent of
// however the route got wired up. Keeping it separate also gives us one place
// to add stricter checks later (e.g. image dimensions) without touching the
// controller.
const validatePrescriptionFile = (file) => {
  if (!file) {
    return { valid: false, message: "Please upload a prescription image." };
  }
  if (!file.buffer || file.buffer.length === 0) {
    return { valid: false, message: "The uploaded image appears to be empty or corrupted. Please try again." };
  }
  return { valid: true };
};

module.exports = { validatePrescriptionFile };
