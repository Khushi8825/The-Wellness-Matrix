const { runHealthCoordinator } = require("../agents/healthCoordinator");

const getCoordinatorReport = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const result = await runHealthCoordinator(userId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Health Coordinator error:", error);
    return res.status(500).json({ message: "Failed to generate the AI health report" });
  }
};

module.exports = { getCoordinatorReport };
