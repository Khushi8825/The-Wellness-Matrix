import { useState, useEffect } from "react";
import HeartRateChart from "../components/Charts/HeartRateChart";
import HealthForm from "../components/HealthForm/HealthForm";
import { SeverityCard } from "../components/index";

const Dashboard = () => {
  const [severityData, setSeverityData] = useState(null);

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
      {/* Main container */}
      <div
        className="
          w-full 
          max-w-6xl 
          px-4 sm:px-6 lg:px-8 
          py-6
        "
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-red-600">
            Your Health Dashboard
          </h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Track, understand, and improve your wellness
          </p>
        </div>

        {/* Chart Card */}
        <div
          className="
            bg-white 
            rounded-2xl 
            shadow-md 
            border border-gray-200 
            p-4 sm:p-6 
            mb-6
          "
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Heart Rate Overview
          </h3>
          {severityData && (
            <>
              <SeverityCard
                severity={severityData.severity}
                reasons={severityData.reasons}
              />

              {/* 🤖 AI Explanation */}
              {severityData.explanation && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-blue-700 mb-1">
                    AI Health Insight
                  </h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {severityData.explanation}
                  </p>
                </div>
              )}
            </>
          )}

          {needsDoctor && (
            <p className="mt-2 text-sm text-red-600">
              ⚠️ We recommend consulting a healthcare professional.
            </p>
          )}

          {/* Chart automatically adjusts because ResponsiveContainer */}
          <div className="w-full h-[300px] sm:h-[350px]">
            <HeartRateChart />
          </div>
        </div>

        {/* Health Form Card */}
        <div
          className="
            bg-white 
            rounded-2xl 
            shadow-md 
            border border-gray-200 
            p-4 sm:p-6
          "
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Add Daily Health Record
          </h3>

          <HealthForm onSeverityUpdate={setSeverityData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
