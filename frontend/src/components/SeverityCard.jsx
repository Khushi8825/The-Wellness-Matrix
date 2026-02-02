const colors = {
  NORMAL: "bg-green-100 text-green-800",
  MONITOR: "bg-yellow-100 text-yellow-800",
  WARNING: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-800",
};

const SeverityCard = ({ severity, reasons }) => {
  return (
    <div className="bg-white rounded-2xl border p-4 mb-6">
      <h3 className="text-lg font-semibold mb-2">
        Health Status
      </h3>

      <span
        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colors[severity]}`}
      >
        {severity}
      </span>

      <ul className="mt-3 list-disc list-inside text-sm text-gray-700">
        {reasons.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
};

export default SeverityCard;
