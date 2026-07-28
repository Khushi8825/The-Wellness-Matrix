// Normalizes a date to a UTC "YYYY-MM-DD" key. Health logs are stored and
// returned as UTC midnight timestamps (see backend's startOfUtcDay), so
// comparing by UTC date keeps the streak accurate regardless of the
// viewer's local timezone.
const toUtcDateKey = (date) => {
  const value = new Date(date);
  return `${value.getUTCFullYear()}-${value.getUTCMonth()}-${value.getUTCDate()}`;
};

const calculateStreak = (logs = []) => {
  if (!logs.length) return 0;

  const logDateKeys = new Set(
    logs
      .filter((log) => log?.log_date)
      .map((log) => toUtcDateKey(log.log_date))
  );

  let streak = 0;
  const cursor = new Date();

  // Check TODAY first — the streak only counts if today's vitals were logged.
  if (!logDateKeys.has(toUtcDateKey(cursor))) {
    return 0;
  }

  while (logDateKeys.has(toUtcDateKey(cursor))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
};

const DailyStreak = ({ logs = [] }) => {
  const streak = calculateStreak(logs);
  const isActive = streak > 0;

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`w-48 h-48 rounded-full shadow-lg flex flex-col items-center justify-center text-white transition ${
          isActive ? "bg-gradient-to-br from-indigo-500 to-blue-600" : "bg-gradient-to-br from-slate-400 to-slate-500"
        }`}
      >
        <span className="text-5xl font-bold">{streak}</span>
        <span className="text-sm mt-2 opacity-80">Day Streak 🔥</span>
      </div>
      <p className="text-center text-xs text-slate-500">
        {isActive
          ? "Log your vitals today to keep this streak going."
          : "Log today's vitals to start a new streak."}
      </p>
    </div>
  );
};

export default DailyStreak;
