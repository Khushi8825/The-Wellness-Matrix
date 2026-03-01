import HealthStatsCards from "./HealthStatsCards";
import HealthCalendar from "./HealthCalendar";
import DailyStreak from "./DailyStreak";

const HealthOverview = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-6">
      <HealthStatsCards />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DailyStreak />
        <HealthCalendar />
       
      </div>
    </div>
  );
};

export default HealthOverview;
