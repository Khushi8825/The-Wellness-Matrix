import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const SleepChart = ({ refreshKey }) => {
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
          sleep_hours: item.sleep_hours ? Number(item.sleep_hours) : 0,
        }));

        setData(formatted);
      });
  }, [refreshKey]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="log_date"
          label={{ value: "Date", position: "insideBottom", offset: -5 }}
        />

        <YAxis
          domain={[0, 12]}
          label={{
            value: "Sleep (hours)",
            angle: -90,
            position: "insideLeft",
          }}
        />

        <Tooltip />

        <Bar dataKey="sleep_hours" fill="#dc2626" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SleepChart;
