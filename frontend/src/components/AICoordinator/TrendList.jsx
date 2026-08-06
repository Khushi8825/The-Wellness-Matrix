const DIRECTION_ICON = {
  Increasing: { symbol: "↑", color: "text-orange-600" },
  Decreasing: { symbol: "↓", color: "text-blue-600" },
  Stable: { symbol: "→", color: "text-green-600" },
  "Insufficient data": { symbol: "…", color: "text-slate-400" },
};

const TrendList = ({ trends }) => {
  if (!trends?.trends?.length) {
    return <p className="text-sm text-slate-500">Not enough historical data yet to detect trends.</p>;
  }

  return (
    <div>
      {trends.summary && <p className="mb-3 text-sm text-slate-600">{trends.summary}</p>}
      <ul className="space-y-2">
        {trends.trends.map((trend, index) => {
          const icon = DIRECTION_ICON[trend.direction] || DIRECTION_ICON["Insufficient data"];
          return (
            <li key={index} className="rounded-lg border border-red-50 bg-red-50/40 px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-800">{trend.parameter}</p>
                <span className={`text-lg font-bold ${icon.color}`}>{icon.symbol} {trend.direction}</span>
              </div>
              {trend.note && <p className="mt-1 text-xs text-slate-500">{trend.note}</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TrendList;
