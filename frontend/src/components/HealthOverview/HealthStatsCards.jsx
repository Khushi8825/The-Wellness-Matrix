import { useMemo } from "react";
import { computeHealthAverages } from "../../utils/healthStats";

const NO_DATA_LABEL = "No Data Available";

const buildStats = (logs) => {
  const averages = computeHealthAverages(logs);
  const hasBp = averages.systolic !== null && averages.diastolic !== null;

  return [
    {
      title: "Avg Heart Rate",
      value: averages.heartRate !== null ? `${averages.heartRate} bpm` : NO_DATA_LABEL,
      gradient: "from-red-400 to-red-600",
    },
    {
      title: "Avg BP",
      value: hasBp ? `${averages.systolic} / ${averages.diastolic}` : NO_DATA_LABEL,
      gradient: "from-blue-400 to-blue-600",
    },
    {
      title: "Sleep Avg",
      value: averages.sleepHours !== null ? `${averages.sleepHours} hrs` : NO_DATA_LABEL,
      gradient: "from-purple-400 to-purple-600",
    },
    {
      title: "Avg Blood Sugar",
      value: averages.bloodSugar !== null ? `${averages.bloodSugar} mg/dL` : NO_DATA_LABEL,
      gradient: "from-amber-400 to-amber-600",
    },
    {
      title: "Avg Weight",
      value: averages.weight !== null ? `${averages.weight} kg` : NO_DATA_LABEL,
      gradient: "from-emerald-400 to-emerald-600",
    },
  ];
};

const HealthStatsCards = ({ logs = [], isLoading = false, error = false }) => {
  const stats = useMemo(() => buildStats(logs), [logs]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-[76px] animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50/60 px-4 py-4 text-sm font-medium text-red-700">
        We couldn't load your health stats right now. Please refresh the page to try again.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className={`bg-gradient-to-r ${item.gradient} text-white p-4 rounded-xl shadow-md transition transform hover:-translate-y-2 hover:shadow-xl duration-300`}
        >
          <p className="text-sm opacity-80">{item.title}</p>
          <p className="text-xl font-bold mt-1">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default HealthStatsCards;
