module.exports = function dietSeverity(logs) {
  let riskyDays = 0;

  logs.forEach(l => {
    if (!l.meals) return;

    const m = l.meals.toLowerCase();
    if (
      m.includes("fried") ||
      m.includes("junk") ||
      m.includes("sweet") ||
      m.includes("cola")
    ) {
      riskyDays++;
    }
  });

  if (riskyDays >= 4) {
    return {
      level: "WARNING",
      reason: "Diet pattern indicates high sugar/fat intake"
    };
  }

  if (riskyDays > 0) {
    return {
      level: "MONITOR",
      reason: "Occasional unhealthy food choices"
    };
  }

  return {
    level: "NORMAL",
    reason: "Diet appears balanced"
  };
};



// Risk Indicators:
// “fried”, “junk”, “cola”, “sweet”, “bakery” → sugar/fat risk
// “skipped meals” → metabolic stress
// “very salty”, “pickles”, “chips” → BP risk