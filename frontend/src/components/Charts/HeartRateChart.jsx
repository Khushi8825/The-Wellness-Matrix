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
        setData(result);
      })
      .catch((err) => console.error("Chart fetch error:", err));
  }, [refreshKey]); // 🔥 refresh when key changes

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="log_date" tick={{ fontSize: 12 }} />
        <YAxis />

        <Tooltip />
        <Legend />

        {/* 🔴 Heart Rate */}
        <Line
          type="monotone"
          dataKey="heart_rate"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ r: 3 }}
          name="Heart Rate (bpm)"
        />

        {/* 🔵 Blood Pressure (Systolic) */}
        <Line
          type="monotone"
          dataKey="systolic_bp"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 3 }}
          name="Blood Pressure (mmHg)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HeartRateChart;
