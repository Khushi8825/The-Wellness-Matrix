import { useState } from "react";
import DateSection from "./DateSection";
import VitalsSection from "./VitalsSection";
import BloodPressureSection from "./BloodPressureSection";
import LifestyleSection from "./LifestyleSection";
import FormActions from "./FormActions";

const HealthForm = ({ onSeverityUpdate,onLogSaved }) => {
  const [data, setData] = useState({
    date: "",
    heartRate: "",
    systolicBP: "",
    diastolicBP: "",
    bloodSugar: "",
    weight: "",
    meals: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/health/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          log_date: data.date,
          heart_rate: data.heartRate,
          systolic_bp: data.systolicBP,
          diastolic_bp: data.diastolicBP,
          blood_sugar: data.bloodSugar,
          weight: data.weight,
          meals: data.meals,
        }),
      });

      const result = await res.json();

      // 🔥 INSTANT SEVERITY UPDATE
      if (result.severity && onSeverityUpdate) {
        onSeverityUpdate({
          severity: result.severity,
          reasons: result.reasons,
          explanation: result.explanation,
        });
      }
    } catch (err) {
      console.error("Health log submit failed:", err);
    }
    if (onLogSaved) {
      onLogSaved(); // 🔥 triggers chart refresh
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        space-y-4 
        w-full
        bg-white/20
        backdrop-blur-md
        rounded-2xl
        p-4 sm:p-6
        border border-white/30
      "
    >
      {/* Pass setters to sections (NO UI BREAK) */}
      <DateSection setData={setData} data={data} />
      <VitalsSection setData={setData} data={data} />
      <BloodPressureSection setData={setData} data={data} />
      <LifestyleSection setData={setData} data={data} />
      <FormActions />
    </form>
  );
};

export default HealthForm;
