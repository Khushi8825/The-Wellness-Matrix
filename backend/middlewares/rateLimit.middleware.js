const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const redisClient = require("../config/redis");

// Backed by Redis instead of the default in-memory store, so limits
// survive a server restart and stay consistent across multiple server
// instances. Same rate-limit-express API — only the `store:` option is new.
const makeRedisStore = (prefix) =>
  new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
    prefix,
  });

// Applies to login: 10 attempts per 15 minutes per IP.
// Generous enough that a real person mistyping their password a few times
// never gets blocked, but stops a script from guessing thousands of
// passwords back-to-back.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  message: { message: "Too many login attempts. Please try again in 15 minutes." },
  standardHeaders: true, // sends rate-limit info in response headers
  legacyHeaders: false,
  store: makeRedisStore("rl:login:"),
});

// Applies to register: 5 accounts per hour per IP.
// Stops bots from mass-creating fake accounts, while still letting a
// household/office behind the same IP register a few real accounts.
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5,
  message: { message: "Too many accounts created from this network. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  store: makeRedisStore("rl:register:"),
});

// Applies to Google login: matches the login limiter, since it's another
// way to get in and should be equally protected against abuse.
const googleAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: "Too many attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
  store: makeRedisStore("rl:google:"),
});

module.exports = { loginLimiter, registerLimiter, googleAuthLimiter };