const express = require("express");
const router = express.Router();

const { analyzePrescription } = require("../controllers/prescription.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const handlePrescriptionUpload = require("../middlewares/prescriptionUpload.middleware");

router.post("/analyze", authMiddleware, handlePrescriptionUpload, analyzePrescription);

module.exports = router;
