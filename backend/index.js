const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});




