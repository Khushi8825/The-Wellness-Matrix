import AIExplanationBox from "./AIExplanationBox";

const CONFIDENCE_STYLES = {
  High: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-red-50 text-red-700 border-red-200",
};

const ConfidenceBadge = ({ level }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${CONFIDENCE_STYLES[level] || CONFIDENCE_STYLES.Low}`}>
    {level || "Low"} confidence
  </span>
);

const Field = ({ label, value }) => {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-800">{value}</dd>
    </div>
  );
};

const MedicineCard = ({ medicine }) => (
  <article className="rounded-xl border border-red-100 bg-red-50/30 p-4">
    <div className="flex flex-wrap items-start justify-between gap-2">
      <h4 className="text-base font-bold text-slate-900">{medicine.name}</h4>
      <ConfidenceBadge level={medicine.confidence} />
    </div>
    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
      <Field label="Strength" value={medicine.strength} />
      <Field label="Dosage" value={medicine.dosage} />
      <Field label="Frequency" value={medicine.frequency} />
      <Field label="Duration" value={medicine.duration} />
    </dl>
    {medicine.explanation && <p className="mt-3 text-sm leading-6 text-slate-700">{medicine.explanation}</p>}
  </article>
);

const PrescriptionResult = ({ result }) => {
  if (!result) return null;

  const hasMedicines = Array.isArray(result.medicines) && result.medicines.length > 0;
  const hasInstructions = Array.isArray(result.doctorInstructions) && result.doctorInstructions.length > 0;

  return (
    <div className="mt-6 space-y-5">
      <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
        ⚠️ This AI interpretation may contain mistakes because handwritten prescriptions can be difficult to read.
        Always verify the extracted medicines and instructions with your doctor or pharmacist before taking any medication.
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-slate-900">Analysis result</h3>
        <ConfidenceBadge level={result.overallConfidence} />
      </div>

      {result.unreadableNotes && (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">{result.unreadableNotes}</p>
      )}

      <section>
        <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">Medicines</h4>
        {hasMedicines ? (
          <div className="mt-3 space-y-3">
            {result.medicines.map((medicine, index) => <MedicineCard key={index} medicine={medicine} />)}
          </div>
        ) : (
          <p className="mt-3 rounded-xl border border-dashed border-red-200 bg-red-50/50 p-4 text-sm text-slate-600">
            No medicines could be confidently identified from this image.
          </p>
        )}
      </section>

      {hasInstructions && (
        <section>
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">Doctor instructions</h4>
          <ul className="mt-3 flex flex-wrap gap-2">
            {result.doctorInstructions.map((instruction, index) => (
              <li key={index} className="rounded-full border border-red-100 bg-white px-3 py-1.5 text-sm font-medium text-red-700 shadow-sm">
                {instruction}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ADDITIVE: new AI Explanation Box. Uses the same `result` data already
          fetched above — does not call, alter, or depend on /prescription/analyze. */}
      <AIExplanationBox result={result} />
    </div>
  );
};

export default PrescriptionResult;
