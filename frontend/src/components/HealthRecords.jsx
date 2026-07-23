const formatDate = (date) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(date));
const value = (item, suffix = "") => (item == null ? "—" : `${item}${suffix}`);

const HealthRecords = ({ logs, loading, error }) => {
  if (loading) return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-44 animate-pulse rounded-2xl bg-slate-100" />)}</div>;
  if (error) return <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Unable to load health records. Please refresh and try again.</p>;
  if (!logs.length) return <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">No health records found.</div>;

  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {logs.map((log) => <article key={log.log_date} className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <time className="text-sm font-semibold text-indigo-600">{formatDate(log.log_date)}</time>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div><dt className="text-slate-500">Heart rate</dt><dd className="font-semibold text-slate-800">{value(log.heart_rate, " bpm")}</dd></div>
        <div><dt className="text-slate-500">Blood pressure</dt><dd className="font-semibold text-slate-800">{log.systolic_bp != null || log.diastolic_bp != null ? `${log.systolic_bp ?? "—"}/${log.diastolic_bp ?? "—"}` : "—"}</dd></div>
        <div><dt className="text-slate-500">Sleep</dt><dd className="font-semibold text-slate-800">{value(log.sleep_hours, " hrs")}</dd></div>
        <div><dt className="text-slate-500">Weight / BMI*</dt><dd className="font-semibold text-slate-800">{value(log.weight, " kg")}</dd></div>
        <div className="col-span-2"><dt className="text-slate-500">Diet</dt><dd className="truncate font-semibold text-slate-800">{log.meals || "—"}</dd></div>
      </dl>
      <p className="mt-4 text-xs text-slate-400">*BMI is unavailable because height is not collected in the existing form.</p>
    </article>)}
  </div>;
};

export default HealthRecords;
