const Redis = require("ioredis");

// Single shared Redis connection, reused by:
//   - middlewares/rateLimit.middleware.js (rate-limit-redis store)
//   - controllers/coordinator.controller.js (AI coordinator report cache)
//   - controllers/health.controller.js (chart/records cache)
const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null, // required by rate-limit-redis / ioredis recommendation
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});

module.exports = redisClient;
