import { Link, useNavigate } from "react-router-dom";
import HealthForm from "../components/HealthForm/HealthForm";
import useToast from "../hooks/useToast";

const UpdateVitals = () => {
  const navigate = useNavigate();
  const showToast = useToast();

  const handleSaved = (result) => {
    // The existing POST response already contains Groq's new analysis.
    localStorage.setItem("wellness-ai-analysis", JSON.stringify({
      content: result.explanation,
      updatedAt: new Date().toISOString(),
    }));
    showToast("Health record saved successfully.");
    navigate("/dashboard", { replace: true });
  };

  return <main className="min-h-screen bg-gradient-to-br from-red-50 to-white px-4 py-8 sm:px-6 lg:px-8">
    <section className="mx-auto max-w-3xl">
      <Link to="/dashboard" className="text-sm font-semibold text-red-700 transition hover:text-red-800">← Back to dashboard</Link>
      <div className="mt-5 rounded-3xl border border-red-100 bg-white p-5 shadow-xl shadow-red-100/50 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-700">Daily check-in</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Update your vitals</h1>
        <p className="mt-2 text-slate-600">Record today’s health data to keep your insights and trends current.</p>
        <div className="mt-6"><HealthForm onLogSaved={handleSaved} /></div>
      </div>
    </section>
  </main>;
};

export default UpdateVitals;
