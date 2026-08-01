import { useState } from "react";
import { DashboardHeader } from "../components";
import PrescriptionUploader from "../components/Prescription/PrescriptionUploader";
import PrescriptionResult from "../components/Prescription/PrescriptionResult";
import useToast from "../hooks/useToast";
import { API_URL } from "../config/api";

const LoadingAnimation = () => (
  <div className="mt-6 flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-100 bg-white p-10 shadow-sm">
    <div className="relative h-16 w-16">
      <div className="absolute inset-0 animate-spin rounded-full border-4 border-red-100 border-t-red-700" />
      <div className="absolute inset-0 grid place-items-center text-xl" aria-hidden="true">💊</div>
    </div>
    <div className="text-center">
      <p className="font-semibold text-slate-800">Reading your prescription...</p>
      <p className="mt-1 text-sm text-slate-500">This can take up to 15 seconds.</p>
    </div>
  </div>
);

const PrescriptionAnalyzer = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const showToast = useToast();

  const handleAnalyze = async (file) => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("prescription", file);

      const response = await fetch(`${API_URL}/prescription/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Failed to analyze the prescription.");

      setResult(data);
    } catch (err) {
      console.error("Prescription analysis error:", err);
      showToast(err.message || "Something went wrong. Please try again.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fee2e2,_transparent_35%),linear-gradient(180deg,#fffafa_0%,#fff1f2_100%)] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <DashboardHeader title="Understand Your Prescription" />

        <header className="mt-1 rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-red-700">AI prescription reader</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Understand what your doctor wrote.</h2>
          <p className="mt-2 text-slate-600">Upload or photograph a prescription and get a plain-English breakdown of each medicine.</p>
        </header>

        <div className="mt-6">
          <PrescriptionUploader onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        </div>

        {isAnalyzing && <LoadingAnimation />}
        {!isAnalyzing && result && <PrescriptionResult result={result} />}
      </div>
    </main>
  );
};

export default PrescriptionAnalyzer;
