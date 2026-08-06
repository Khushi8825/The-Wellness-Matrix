const CATEGORY_ICON = {
  Diet: "🥗",
  Exercise: "🏃",
  Sleep: "😴",
  "Water intake": "💧",
  "Stress management": "🧘",
  "Daily routine": "📅",
};

const LifestyleRecommendationsList = ({ lifestyle }) => {
  if (!lifestyle?.recommendations?.length) {
    return <p className="text-sm text-slate-500">Personalized recommendations will appear here after your next vitals update.</p>;
  }

  return (
    <div>
      {lifestyle.summary && <p className="mb-3 text-sm text-slate-600">{lifestyle.summary}</p>}
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {lifestyle.recommendations.map((rec, index) => (
          <li key={index} className="rounded-lg border border-red-50 bg-red-50/40 p-3">
            <p className="text-sm font-semibold text-slate-800">
              <span className="mr-1.5" aria-hidden="true">{CATEGORY_ICON[rec.category] || "✅"}</span>
              {rec.category}
            </p>
            <p className="mt-1 text-sm text-slate-700">{rec.advice}</p>
            <p className="mt-1 text-xs italic text-slate-500">{rec.reason}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LifestyleRecommendationsList;
