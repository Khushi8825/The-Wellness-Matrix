const STATUS_COLORS = {
  Normal: "bg-green-100 text-green-800",
  Elevated: "bg-yellow-100 text-yellow-800",
  High: "bg-orange-100 text-orange-800",
  Low: "bg-yellow-100 text-yellow-800",
  Critical: "bg-red-100 text-red-800",
  Unknown: "bg-slate-100 text-slate-600",
};

const VitalFindingsList = ({ vitals }) => {
  if (!vitals?.findings?.length) {
    return <p className="text-sm text-slate-500">No vitals recorded yet today.</p>;
  }

  return (
    <div>
      {vitals.summary && <p className="mb-3 text-sm text-slate-600">{vitals.summary}</p>}
      <ul className="space-y-2">
        {vitals.findings.map((finding, index) => (
          <li key={index} className="flex items-center justify-between gap-3 rounded-lg border border-red-50 bg-red-50/40 px-3 py-2">
            <div>
              <p className="text-sm font-semibold text-slate-800">{finding.parameter}</p>
              {finding.value && <p className="text-xs text-slate-500">{finding.value}</p>}
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[finding.status] || STATUS_COLORS.Unknown}`}>
              {finding.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VitalFindingsList;
