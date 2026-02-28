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

const BloodPressureChart = ({ refreshKey }) => {
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
          systolic_bp: item.systolic_bp ? Number(item.systolic_bp) : null,
          diastolic_bp: item.diastolic_bp ? Number(item.diastolic_bp) : null,
        }));

        setData(formatted);
      });
  }, [refreshKey]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="log_date"
          label={{
            value: "Date",
            position: "insideBottom",
            offset: -5,
          }}
        />

        <YAxis
          domain={[40, 180]}
          label={{
            value: "Blood Pressure (mmHg)",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip />
        <Legend />

        <Line
          type="monotone"
          dataKey="systolic_bp"
          stroke="#3b82f6"
          strokeWidth={3}
          name="Systolic (mmHg)"
        />

        <Line
          type="monotone"
          dataKey="diastolic_bp"
          stroke="#1e40af"
          strokeWidth={3}
          name="Diastolic (mmHg)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BloodPressureChart;