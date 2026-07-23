const renderMarkdown = (text) => text.split("\n").map((line, index) => {
  if (line.startsWith("### ")) return <h4 key={index} className="mt-5 text-base font-bold text-red-900 first:mt-0">{line.slice(4)}</h4>;
  if (line.startsWith("## ")) return <h3 key={index} className="mt-5 text-lg font-bold text-red-900 first:mt-0">{line.slice(3)}</h3>;
  if (line.startsWith("- ") || line.startsWith("* ")) return <li key={index} className="ml-5 list-disc pl-1">{line.slice(2)}</li>;
  return line ? <p key={index} className="mt-2">{line}</p> : null;
});

const AiInsightCard = ({ analysis, loading, error }) => <section className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm">
  <div className="flex items-start gap-3 border-b border-red-100 bg-gradient-to-r from-red-50 to-white px-5 py-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-700 text-white"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a7 7 0 0 0-4 12.74V18h8v-3.26A7 7 0 0 0 12 2ZM9 22h6M9 18h6" /></svg></div><div><h2 className="font-bold text-slate-900">AI Health Analysis</h2><p className="text-xs text-slate-500">Generated using Groq · {analysis?.updatedAt ? `Updated ${new Date(analysis.updatedAt).toLocaleString()}` : "Waiting for your next vitals update"}</p></div></div>
  <div className="max-h-[420px] overflow-y-auto px-5 py-4 text-sm leading-6 text-slate-700">{loading && <div className="space-y-3">{[1, 2, 3, 4].map((item) => <div key={item} className="h-4 animate-pulse rounded bg-red-100" />)}</div>}{error && <p className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}{!loading && !error && analysis?.content && <div>{renderMarkdown(analysis.content)}</div>}{!loading && !error && !analysis?.content && <p className="rounded-lg border border-dashed border-red-200 bg-red-50/50 p-4 text-slate-600">Your personalized analysis will appear here after you save new vitals.</p>}</div>
</section>;

export default AiInsightCard;
