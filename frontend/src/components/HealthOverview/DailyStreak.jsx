const calculateStreak = (logs = []) => {
  const sorted = logs
    .map(log => new Date(log.log_date).toDateString())
    .sort((a, b) => new Date(b) - new Date(a));

  let streak = 0;
  let current = new Date();

  for (let i = 0; i < sorted.length; i++) {
    const logDate = new Date(sorted[i]);
    if (
      logDate.toDateString() === current.toDateString()
    ) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
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