import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/**
 * Props:
 * refreshKey → changes when new health log is added
 */
const HeartRateChart = ({ refreshKey }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/health/chart", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("Chart Data:", result);
        setData(result);
      })
      .catch((err) => console.error("Chart fetch error:", err));
  }, [refreshKey]); // 🔥 refresh when key changes

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="log_date" tick={{ fontSize: 12 }} />

        {/* Left Axis → HR & BP */}
        <YAxis yAxisId="left" />

        {/* Right Axis → Sleep */}
        <YAxis yAxisId="right" orientation="right" domain={[0, 12]} />

        <Tooltip />
        <Legend />

        {/* 🔴 Heart Rate */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="heart_rate"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ r: 3 }}
          name="Heart Rate (bpm)"
        />

        {/* 🔵 Blood Pressure */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="systolic_bp"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 3 }}
          name="Blood Pressure (mmHg)"
        />

        {/* 🟣 Sleep */}
        <Line
          yAxisId="right"
          type="stepAfter"
          dataKey="sleep_hours"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ r: 3 }}
          name="Sleep (hrs)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HeartRateChart;
