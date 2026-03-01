import { useState, useEffect } from "react";
import BloodPressureChart from "../components/Charts/bloodPressureChart";
import HeartRateChart from "../components/Charts/HeartRateChart";
import SleepChart from "../components/Charts/SleepChart";
import HealthForm from "../components/HealthForm/HealthForm";
import HealthOverview from "../components/HealthOverview/HealthOverview";
import { SeverityCard } from "../components/index";

const Dashboard = () => {
  const [severityData, setSeverityData] = useState(null);
  const [chartRefreshKey, setChartRefreshKey] = useState(0);

  useEffect(() => {
    fetch("/api/health/severity", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.severity) setSeverityData(data);
      });
  }, []);

  const needsDoctor =
    severityData?.severity === "CRITICAL" ||
    severityData?.severity === "WARNING";

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-red-600">
            Your Health Dashboard
          </h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Track, understand, and improve your wellness
          </p>
        </div>

        {/* ================= CHARTS GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Blood Pressure */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
              Blood Pressure (mmHg)
            </h3>
            <BloodPressureChart refreshKey={chartRefreshKey} />
          </div>

          {/* Heart Rate */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
              Heart Rate (bpm)
            </h3>
            <HeartRateChart refreshKey={chartRefreshKey} />
          </div>

          {/* Sleep */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
              Sleep Duration (hours)
            </h3>
            <SleepChart refreshKey={chartRefreshKey} />
          </div>

          {/* Empty reserved space */}
          <HealthOverview/>
          <div></div>
        </div>
        {/* ================= END GRID ================= */}


        {/* ================= SEVERITY + AI ================= */}
        {severityData && (
          <div className="mt-10">

            <SeverityCard
              severity={severityData.severity}
              reasons={severityData.reasons}
            />

            {/* AI Explanation */}
            {severityData.explanation && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">
                <h4 className="text-sm font-semibold text-blue-700 mb-2">
                  🤖 AI Health Insight
                </h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  {severityData.explanation}
                </p>
              </div>
            )}

            {/* Doctor Warning */}
            {needsDoctor && (
              <p className="mt-3 text-sm text-red-600 font-medium">
                ⚠️ We recommend consulting a healthcare professional.
              </p>
            )}

          </div>
        )}
        {/* ================= END SEVERITY ================= */}


        {/* ================= HEALTH FORM ================= */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6 mt-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Add Daily Health Record
          </h3>

          <HealthForm
            onSeverityUpdate={setSeverityData}
            onLogSaved={() => setChartRefreshKey((prev) => prev + 1)}
          />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;