const DoctorAdviceCard = ({ report }) => {
  if (!report) return null;

  return (
    <div>
      {report.doctorConsultationAdvice && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-800">{report.doctorConsultationAdvice}</p>
      )}

      {report.nextSteps?.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-800">Next steps</p>
          <ul className="space-y-1.5">
            {report.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-0.5 text-red-600" aria-hidden="true">✓</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DoctorAdviceCard;
