const MedicationSummaryCard = ({ prescription }) => {
  if (!prescription?.hasPrescription) {
    return <p className="text-sm text-slate-500">No prescription on file yet.</p>;
  }

  return (
    <div>
      <p className="mb-3 text-sm text-slate-600">{prescription.medicationSummary}</p>

      {prescription.therapeuticAreas?.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {prescription.therapeuticAreas.map((area, index) => (
            <span key={index} className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">{area}</span>
          ))}
        </div>
      )}

      <ul className="space-y-2">
        {prescription.medications?.map((med, index) => (
          <li key={index} className="rounded-lg border border-red-50 bg-red-50/40 px-3 py-2">
            <p className="text-sm font-semibold text-slate-800">{med.name}</p>
            <p className="text-xs text-slate-500">{med.dosageSummary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicationSummaryCard;
