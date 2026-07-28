import HealthStatsCards from "./HealthStatsCards";
import HealthCalendar from "./HealthCalendar";
import DailyStreak from "./DailyStreak";

// `logs` = last 30 days (used for the streak + calendar view)
// `records` = the user's full health record history (used for lifetime averages)
const HealthOverview = ({ logs = [], records, selectedLog, onDateSelect, isLoading = false, error = false }) => {
  const statsSource = records && records.length ? records : logs;

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-6">
      <HealthStatsCards logs={statsSource} isLoading={isLoading} error={error} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DailyStreak logs={logs} />
        <HealthCalendar logs={logs} selectedLog={selectedLog} onDateSelect={onDateSelect} />
      </div>
    </div>
  );
};

export default HealthOverview;
