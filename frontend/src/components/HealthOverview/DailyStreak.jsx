const DailyStreak = () => {
  const streak = 5;

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