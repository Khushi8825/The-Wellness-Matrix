import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import HealthScoreGauge from "./HealthScoreGauge";
import RiskLevelBadge from "./RiskLevelBadge";
import EmergencyAlert from "./EmergencyAlert";
import VitalFindingsList from "./VitalFindingsList";
import TrendList from "./TrendList";
import MedicationSummaryCard from "./MedicationSummaryCard";
import LifestyleRecommendationsList from "./LifestyleRecommendationsList";
import DoctorAdviceCard from "./DoctorAdviceCard";

// This section talks to the new agentic pipeline (GET /api/health/coordinator)
// added in Phases 1-4. It sits alongside — and never replaces — the existing
// charts, SeverityCard, and AiInsightCard already on the dashboard.
const AIHealthCoordinatorSection = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadCoordinatorReport = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/health/coordinator`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("AI Health Coordinator request failed");
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("AI Health Coordinator error:", err);
          setError(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCoordinatorReport();
    return () => controller.abort();
  }, []);

  return (
    <section className="mt-6 rounded-2xl border border-red-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-700 text-white">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2 3 7v6c0 5 4 9 9 9s9-4 9-9V7l-9-5Z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">AI Health Coordinator</h2>
          <p className="text-xs text-slate-500">Six specialized agents working together on your latest data</p>
        </div>
      </div>

      {isLoading && <CoordinatorSkeleton />}

      {!isLoading && error && (
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          Couldn't generate your AI health report right now. Please refresh the dashboard shortly.
        </p>
      )}

      {!isLoading && !error && data?.emergency && <EmergencyAlert emergency={data.emergency} />}

      {!isLoading && !error && data && !data.emergency && (
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-red-50/50 p-5 sm:flex-row sm:justify-around">
            <HealthScoreGauge score={data.report?.healthScore} />
            <div className="text-center sm:text-left">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Current Risk Level</p>
              <RiskLevelBadge level={data.report?.riskLevel} />
              {data.report?.overallSummary && <p className="mt-3 max-w-md text-sm text-slate-700">{data.report.overallSummary}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <SubCard title="Current Vital Analysis"><VitalFindingsList vitals={data.vitals} /></SubCard>
            <SubCard title="30-Day Trend Analysis"><TrendList trends={data.trends} /></SubCard>
            <SubCard title="Medication Summary"><MedicationSummaryCard prescription={data.prescription} /></SubCard>
            <SubCard title="Doctor Recommendation"><DoctorAdviceCard report={data.report} /></SubCard>
          </div>

          <SubCard title="Lifestyle Recommendations"><LifestyleRecommendationsList lifestyle={data.lifestyle} /></SubCard>
        </div>
      )}
    </section>
  );
};

const SubCard = ({ title, children }) => (
  <div className="rounded-xl border border-red-50 p-4">
    <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-red-700">{title}</h3>
    {children}
  </div>
);

const CoordinatorSkeleton = () => (
  <div className="space-y-4">
    <div className="h-28 animate-pulse rounded-2xl bg-red-100/60" />
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {[1, 2, 3, 4].map((item) => <div key={item} className="h-32 animate-pulse rounded-xl bg-red-100/60" />)}
    </div>
  </div>
);

export default AIHealthCoordinatorSection;
