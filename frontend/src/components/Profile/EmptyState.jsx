const EmptyState = ({ title, description }) => <div className="rounded-xl border border-dashed border-red-200 bg-red-50/50 px-5 py-10 text-center">
  <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-white text-red-700 shadow-sm" aria-hidden="true">
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
  </div>
  <h3 className="mt-3 font-semibold text-slate-800">{title}</h3>
  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
</div>;

export default EmptyState;
