const hr = require("./heartRate.rules");
const bp = require("./bloodPressure.rules");
const sugar = require("./bloodSugar.rules");
const diet = require("./diet.rules");

module.exports = function analyzeSeverity(logs) {
  const results = [
    hr(logs),
    bp(logs),
    sugar(logs),
    diet(logs)
  ];

  const levels = results.map(r => r.level);
  const reasons = results.map(r => r.reason);

  if (levels.includes("CRITICAL")) return { severity: "CRITICAL", reasons };
  if (levels.includes("WARNING")) return { severity: "WARNING", reasons };
  if (levels.includes("MONITOR")) return { severity: "MONITOR", reasons };

  return { severity: "NORMAL", reasons };
};
