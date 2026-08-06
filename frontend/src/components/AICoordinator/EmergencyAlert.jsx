// Rendered instead of the normal report whenever the coordinator's
// deterministic Emergency Detection step trips — deliberately louder and
// simpler than every other card on the dashboard.
const EmergencyAlert = ({ emergency }) => (
  <div className="rounded-2xl border-2 border-red-600 bg-red-50 p-6 shadow-lg">
    <div className="flex items-start gap-3">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-red-600 text-white">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
        </svg>
      </div>
      <div>
        <h2 className="text-lg font-bold text-red-800">Emergency reading detected</h2>
        <p className="mt-1 text-sm font-medium text-red-700">{emergency.advice}</p>
      </div>
    </div>

    <ul className="mt-4 space-y-2">
      {emergency.triggers.map((trigger, index) => (
        <li key={index} className="rounded-lg bg-white/70 px-4 py-2 text-sm text-red-800">
          {trigger.message}
        </li>
      ))}
    </ul>
  </div>
);

export default EmergencyAlert;
