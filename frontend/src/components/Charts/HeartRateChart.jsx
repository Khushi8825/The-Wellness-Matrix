import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Mon", heartRate: 72 },
  { day: "Tue", heartRate: 75 },
  { day: "Wed", heartRate: 80 },
  { day: "Thu", heartRate: 78 },
  { day: "Fri", heartRate: 74 },
];

const HeartRateChart = () => {
  return (
    <div
      className="
        w-full h-full
        bg-white/20
        backdrop-blur-md
        rounded-2xl
        p-4 sm:p-6
        border border-white/30
      "
    >
      <h3 className="text-lg font-semibold text-white mb-4">
        Heart Rate Trend
      </h3>

      <div className="w-full h-[220px] sm:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
            <XAxis dataKey="day" stroke="#ffe4e6" />
            <YAxis stroke="#ffe4e6" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.9)",
                borderRadius: "8px",
                border: "none",
              }}
              labelStyle={{ color: "#7f1d1d" }}
            />
            <Line
              type="monotone"
              dataKey="heartRate"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ r: 4, fill: "#ef4444" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HeartRateChart;
