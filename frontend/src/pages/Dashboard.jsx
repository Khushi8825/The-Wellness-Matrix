import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BloodPressureChart from "../components/Charts/BloodPressureChart";
import HeartRateChart from "../components/Charts/HeartRateChart";
import SleepChart from "../components/Charts/SleepChart";
import HealthOverview from "../components/HealthOverview/HealthOverview";
import { AiInsightCard, DashboardHeader, HealthRecords, SeverityCard } from "../components";

const Dashboard = () => {
  const [severityData, setSeverityData] = useState(null);
  const [allLogs, setAllLogs] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [analysis] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wellness-ai-analysis")) || null; } catch { return null; }
  });

  useEffect(() => {
    const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
    const loadDashboard = async () => {
      try {
        const [logsResponse, recordsResponse, severityResponse] = await Promise.all([
          fetch("http://localhost:5000/api/health/chart", { headers }),
          fetch("http://localhost:5000/api/health/records", { headers }),
          fetch("http://localhost:5000/api/health/severity", { headers }),
        ]);
        if (!logsResponse.ok || !recordsResponse.ok) throw new Error("Health records request failed");
        const logs = await logsResponse.json();
        const allRecords = await recordsResponse.json();
        setAllLogs(logs);
        setRecords(allRecords);
        if (severityResponse.ok) {
          const severity = await severityResponse.json();
          if (severity.severity) setSeverityData(severity);
        }
      } catch (error) {
        console.error("Dashboard data error:", error);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const handleDateSelect = (date) => setSelectedLog(allLogs.find((log) => new Date(log.log_date).toDateString() === date.toDateString()) || null);
  const needsDoctor = ["CRITICAL", "WARNING"].includes(severityData?.severity);

  return <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fee2e2,_transparent_35%),linear-gradient(180deg,#fffafa_0%,#fff1f2_100%)] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <DashboardHeader />
      <header className="mb-7 flex flex-col gap-4 rounded-2xl border border-red-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-red-700">Personal wellness overview</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Your health, clearly tracked.</h2><p className="mt-2 text-slate-600">Your last 30 days of trends, in one private place.</p></div><Link to="/update-vitals" className="inline-flex items-center justify-center rounded-xl bg-red-700 px-5 py-3 font-semibold text-white shadow-lg shadow-red-200 transition hover:-translate-y-0.5 hover:bg-red-800">Update Vitals</Link></header>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <ChartCard title="Blood Pressure (mmHg)"><BloodPressureChart /></ChartCard>
        <ChartCard title="Heart Rate (bpm)"><HeartRateChart /></ChartCard>
        <ChartCard title="Sleep Duration (hours)"><SleepChart /></ChartCard>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm sm:p-6"><h2 className="text-xl font-bold text-slate-900">Health overview</h2><div className="mt-4"><HealthOverview logs={allLogs} selectedLog={selectedLog} onDateSelect={handleDateSelect} /></div></div>
        <div className="space-y-5">{severityData && <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm"><SeverityCard severity={severityData.severity} reasons={severityData.reasons} />{needsDoctor && <p className="mt-3 text-sm font-medium text-red-700">We recommend consulting a healthcare professional.</p>}</div>}<AiInsightCard analysis={analysis} loading={false} error={null} /></div>
      </section>

      <section className="mt-8 rounded-2xl border border-red-100 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5 flex items-baseline justify-between gap-4"><div><h2 className="text-xl font-bold text-slate-900">Your health records</h2><p className="mt-1 text-sm text-slate-600">Newest first · your complete record history</p></div><span className="text-xs font-medium text-slate-500">{records.length} record{records.length === 1 ? "" : "s"}</span></div><HealthRecords logs={records} loading={isLoading} error={loadError} /></section>
    </div>
  </main>;
};

const ChartCard = ({ title, children }) => <article className="min-w-0 rounded-2xl border border-red-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"><h2 className="mb-4 text-base font-bold text-slate-800">{title}</h2>{children}</article>;

export default Dashboard;
