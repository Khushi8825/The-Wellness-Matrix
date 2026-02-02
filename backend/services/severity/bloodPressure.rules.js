module.exports = function bpSeverity(logs) {
  let highCount = 0;
  let crisis = false;

  logs.forEach(l => {
    if (l.systolic_bp >= 180 || l.diastolic_bp >= 120) {
      crisis = true;
    }
    if (l.systolic_bp >= 140 || l.diastolic_bp >= 90) {
      highCount++;
    }
  });

  if (crisis) {
    return {
      level: "CRITICAL",
      reason: "Blood pressure reached emergency range"
    };
  }

  if (highCount >= 2) {
    return {
      level: "WARNING",
      reason: "Repeated high blood pressure readings"
    };
  }

  if (highCount === 1) {
    return {
      level: "MONITOR",
      reason: "Occasional elevated blood pressure"
    };
  }

  return {
    level: "NORMAL",
    reason: "Blood pressure is within normal limits"
  };
};



// Backend Severity Logic
// NORMAL → <120 / <80
// MONITOR → Elevated once
// WARNING → ≥140/90 twice in 7 days
// CRITICAL → ≥180/120 (any day)