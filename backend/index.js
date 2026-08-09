const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL, // only this frontend is allowed to call the API
  credentials: true,                // lets cookies/auth headers pass through if used later
}));
app.use(express.json());

// Serve uploaded profile pictures
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
const severityRoutes = require("./routes/severity.routes");
app.use("/api/health", severityRoutes);

const healthRoutes = require("./routes/health.routes");

app.use("/api/health", healthRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/api/users", userRoutes);

const prescriptionRoutes = require("./routes/prescription.routes");
app.use("/api/prescription", prescriptionRoutes);

// Agentic AI Health Coordinator — mounted under /api/health alongside the
// existing severity/health routes, so the frontend just adds one more call.
const coordinatorRoutes = require("./routes/coordinator.routes");
app.use("/api/health", coordinatorRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});




