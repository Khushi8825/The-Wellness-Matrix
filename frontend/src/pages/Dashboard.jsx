import HeartRateChart from "../components/Charts/HeartRateChart";
import HealthForm from "../components/HealthForm";

const Dashboard = () => {
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

          {/* Chart automatically adjusts because ResponsiveContainer */}
          <div className="w-full h-62.5 sm:h-75">
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

          <HealthForm />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
