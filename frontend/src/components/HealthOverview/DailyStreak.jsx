const calculateStreak = (logs = []) => {
  if (!logs.length) return 0;

  // Convert logs to Set for O(1) lookup
  const logSet = new Set(
    logs.map(log =>
      new Date(log.log_date).toDateString()
    )
  );

  let streak = 0;
  let current = new Date();

  // 🔥 IMPORTANT: check TODAY first
  if (!logSet.has(current.toDateString())) {
    return 0; // break immediately if today not logged
  }

  // Loop backward day by day
  while (logSet.has(current.toDateString())) {
    streak++;
    current.setDate(current.getDate() - 1);
  }

  return streak;
};

const DailyStreak = ({ logs = [] }) => {
  const streak = calculateStreak(logs);

  return (
    <div className="flex items-center justify-center">
      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg flex flex-col items-center justify-center text-white">
        <span className="text-5xl font-bold">{streak}</span>
        <span className="text-sm mt-2 opacity-80">Day Streak 🔥</span>
      </div>
    </div>
  );
};

export default DailyStreak;