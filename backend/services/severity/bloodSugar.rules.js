module.exports = function sugarSeverity(logs) {
  let high = 0;
  let critical = false;

  logs.forEach(l => {
    if (l.blood_sugar >= 250) critical = true;
    if (l.blood_sugar >= 126) high++;
  });

  if (critical) {
    return {
      level: "CRITICAL",
      reason: "Blood sugar dangerously high"
    };
  }

  if (high >= 2) {
    return {
      level: "WARNING",
      reason: "Repeated high blood sugar readings"
    };
  }

  if (high === 1) {
    return {
      level: "MONITOR",
      reason: "Occasional elevated blood sugar"
    };
  }

  return {
    level: "NORMAL",
    reason: "Blood sugar within healthy range"
  };
};




// Backend Interpretation
// NORMAL → consistently normal
// MONITOR → prediabetic range occasionally
// WARNING → repeated ≥126 fasting OR ≥200 post-meal
// CRITICAL → ≥250 (risk of acute complications