module.exports = function heartRateSeverity(logs) {
  let highDays = 0;
  let critical = false;

  logs.forEach(l => {
    if (l.heart_rate > 120 || l.heart_rate < 40) {
      critical = true;
    }
    if (l.heart_rate > 100) {
      highDays++;
    }
  });

  if (critical) {
    return {
      level: "CRITICAL",
      reason: "Heart rate reached unsafe levels"
    };
  }

  if (highDays >= 3) {
    return {
      level: "WARNING",
      reason: "Heart rate elevated for multiple days"
    };
  }

  if (highDays > 0) {
    return {
      level: "MONITOR",
      reason: "Occasional elevated heart rate"
    };
  }

  return {
    level: "NORMAL",
    reason: "Heart rate within healthy range"
  };
};


// Rules:
// NORMAL → 60–100 (adults)
// MONITOR → 100–110 (1–2 days)
// WARNING → >110 for 2+ days
// CRITICAL → >120 OR <40 (any day)