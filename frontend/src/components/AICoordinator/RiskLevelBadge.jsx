// Same color language as the existing SeverityCard (green/yellow/orange/red)
// so a returning user reads the two consistently.
const RISK_COLORS = {
  "Low Risk": "bg-green-100 text-green-800",
  "Moderate Risk": "bg-yellow-100 text-yellow-800",
  "High Risk": "bg-orange-100 text-orange-800",
  "Critical Risk": "bg-red-100 text-red-800",
};

const RiskLevelBadge = ({ level }) => (
  <span className={`inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${RISK_COLORS[level] || "bg-slate-100 text-slate-700"}`}>
    {level || "Unknown"}
  </span>
);

export default RiskLevelBadge;
