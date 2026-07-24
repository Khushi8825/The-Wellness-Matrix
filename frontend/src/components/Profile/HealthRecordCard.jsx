import EmptyState from "./EmptyState";

const HealthRecordCard = ({ records = [] }) => <section className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm sm:p-6">
  <div className="flex items-start gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-700"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v8m-4-4h8M4 5h16v14H4z" /></svg></div><div><h3 className="text-xl font-bold text-slate-900">Health Records</h3><p className="mt-1 text-sm text-slate-600">Your previous medical history and supporting notes.</p></div></div>
  <div className="mt-5">{records.length ? <div /> : <EmptyState title="No health records available yet" description="Your medical history will appear here once records are added." />}</div>
  <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-medium text-slate-500 sm:grid-cols-5">{["Previous Health Issues", "Chronic Diseases", "Allergies", "Medications", "Medical Notes"].map((item) => <span key={item} className="rounded-lg bg-slate-50 px-2 py-2 text-center">{item}</span>)}</div>
</section>;

export default HealthRecordCard;
