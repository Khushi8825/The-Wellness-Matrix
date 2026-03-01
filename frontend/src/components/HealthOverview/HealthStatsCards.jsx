const HealthStatsCards = () => {
  const stats = [
    {
      title: "Avg Heart Rate",
      value: "92 bpm",
      gradient: "from-red-400 to-red-600",
    },
    {
      title: "Avg BP",
      value: "120 / 80",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      title: "Sleep Avg",
      value: "6.5 hrs",
      gradient: "from-purple-400 to-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl shadow-md transition transform hover:-translate-y-2 hover:shadow-xl duration-300"
        >
          <p className="text-sm opacity-80">{item.title}</p>
          <p className="text-xl font-bold mt-1">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default HealthStatsCards;