import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

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
        const formatted = result.reverse().map((item) => ({
          ...item,
          heart_rate: item.heart_rate ? Number(item.heart_rate) : null,
        }));

        setData(formatted);
      });
  }, [refreshKey]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="log_date"
          label={{ value: "Date", position: "insideBottom", offset: -5 }}
        />

        <YAxis
          domain={[40, 150]}
          label={{
            value: "Heart Rate (bpm)",
            angle: -90,
            position: "insideLeft",
          }}
        />

        <Tooltip />

        <Area
          type="natural"
          dataKey="heart_rate"
          stroke="#ef4444"
          fill="rgba(239,68,68,0.25)"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default HeartRateChart;
