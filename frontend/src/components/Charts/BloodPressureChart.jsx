import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
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
      <AreaChart data={data}>
        {/* 🔥 STRONG VISIBLE GRADIENTS */}
        <defs>
          {/* 💙 Soft Systolic Gradient */}
          <linearGradient id="systolicGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
            <stop offset="40%" stopColor="#3b82f6" stopOpacity={0.18} />
            <stop offset="75%" stopColor="#3b82f6" stopOpacity={0.08} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>

          {/* 💙 Softer Dark Blue for Diastolic */}
          <linearGradient id="diastolicGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e40af" stopOpacity={0.28} />
            <stop offset="40%" stopColor="#1e40af" stopOpacity={0.15} />
            <stop offset="75%" stopColor="#1e40af" stopOpacity={0.07} />
            <stop offset="100%" stopColor="#1e40af" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Softer Grid */}
        <CartesianGrid stroke="#e5e7eb" vertical={false} />

        <XAxis dataKey="log_date" tick={{ fontSize: 12 }} />

        <YAxis domain={['dataMin - 10', 'dataMax + 10']} />

        <Tooltip />
        <Legend />

        {/* 🔵 Systolic Area FIRST */}
        <Area
          type="natural"
          dataKey="systolic_bp"
          stroke="none"
          fill="url(#systolicGradient)"
          fillOpacity={1}
          baseValue="dataMin"
        />

        <Line
          type="monotone"
          dataKey="systolic_bp"
          stroke="#2563eb"
          strokeWidth={3}
          dot={{ r: 5 }}
          name="Systolic (mmHg)"
        />

        {/* 🔷 Diastolic Area */}
        <Area
          type="natural"
          dataKey="diastolic_bp"
          stroke="none"
          fill="url(#diastolicGradient)"
          fillOpacity={1}
          baseValue="dataMin"
        />

        <Line
          type="monotone"
          dataKey="diastolic_bp"
          stroke="#1e3a8a"
          strokeWidth={3}
          dot={{ r: 5 }}
          name="Diastolic (mmHg)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default BloodPressureChart;
