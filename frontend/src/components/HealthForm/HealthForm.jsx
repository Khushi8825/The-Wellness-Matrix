import { useState } from "react";
import DateSection from "./DateSection";
import VitalsSection from "./VitalsSection";
import BloodPressureSection from "./BloodPressureSection";
import LifestyleSection from "./LifestyleSection";
import FormActions from "./FormActions";

const HealthForm = ({ onSeverityUpdate, onLogSaved }) => {
  const [data, setData] = useState({ date: "", heartRate: "", systolicBP: "", diastolicBP: "", bloodSugar: "", weight: "", meals: "", sleep: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!data.date) return setError("Please select the date for this health record.");
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/health/log", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ log_date: data.date, heart_rate: data.heartRate, systolic_bp: data.systolicBP, diastolic_bp: data.diastolicBP, blood_sugar: data.bloodSugar, sleep: data.sleep, weight: data.weight, meals: data.meals }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to save health record.");
      if (result.severity && onSeverityUpdate) onSeverityUpdate({ severity: result.severity, reasons: result.reasons, explanation: result.explanation });
      if (onLogSaved) onLogSaved(result);
    } catch (submitError) {
      setError(submitError.message || "Unable to save health record. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4 sm:p-6">
    <DateSection setData={setData} data={data} />
    <VitalsSection setData={setData} data={data} />
    <BloodPressureSection setData={setData} data={data} />
    <LifestyleSection setData={setData} data={data} />
    {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
    <FormActions isSubmitting={isSubmitting} />
  </form>;
};

export default HealthForm;
