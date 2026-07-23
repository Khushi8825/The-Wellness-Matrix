const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
const severityRoutes = require("./routes/severity.routes");
app.use("/api/health", severityRoutes);

const healthRoutes = require("./routes/health.routes");
const profileRoutes = require("./routes/profile.routes");

app.use("/api/health", healthRoutes);
app.use("/api/profile", profileRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});




