const { runHealthCoordinator } = require("../agents/healthCoordinator");
const redisClient = require("../config/redis");

// 15 minutes — short enough that a stale report is never shown for long,
// long enough to absorb repeated dashboard refreshes without re-running the
// 5+ sequential Gemini calls (and burning API quota) each time.
const COORDINATOR_CACHE_TTL_SECONDS = 15 * 60;
const coordinatorCacheKey = (userId) => `coordinator:${userId}`;

const getCoordinatorReport = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const cacheKey = coordinatorCacheKey(userId);

    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.status(200).json(JSON.parse(cached));
      }
    } catch (cacheError) {
      console.error("Coordinator cache read error (non-fatal):", cacheError.message);
    }

    const result = await runHealthCoordinator(userId);

    try {
      await redisClient.set(cacheKey, JSON.stringify(result), "EX", COORDINATOR_CACHE_TTL_SECONDS);
    } catch (cacheError) {
      console.error("Coordinator cache write error (non-fatal):", cacheError.message);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Health Coordinator error:", error);
    return res.status(500).json({ message: "Failed to generate the AI health report" });
  }
};

module.exports = { getCoordinatorReport };
