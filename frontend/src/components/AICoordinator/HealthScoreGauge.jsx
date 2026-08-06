// Small circular gauge for the 0-100 Health Score the Report Generator
// Agent computes deterministically from the Risk Agent's score.
const scoreColor = (score) => {
  if (score >= 80) return "#15803d"; // green-700
  if (score >= 60) return "#ca8a04"; // yellow-600
  if (score >= 35) return "#ea580c"; // orange-600
  return "#b91c1c"; // red-700
};

const HealthScoreGauge = ({ score }) => {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score ?? 0));
  const offset = circumference - (clamped / 100) * circumference;
  const color = scoreColor(clamped);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#fee2e2" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="-mt-[76px] text-center">
        <p className="text-3xl font-bold" style={{ color }}>{clamped}</p>
        <p className="text-xs font-medium text-slate-500">Health Score</p>
      </div>
    </div>
  );
};

export default HealthScoreGauge;
