import { useEffect, useState, useCallback, useRef } from "react";
import { API_URL } from "../../config/api";

/**
 * AIExplanationBox
 * ------------------------------------------------------------------
 * ADDITIVE, SELF-CONTAINED component. Does not modify, call, or depend
 * on the existing `/prescription/analyze` endpoint or its request/response
 * contract in any way. It only *reads* the already-fetched `result` object
 * that PrescriptionAnalyzer/PrescriptionResult already have in memory.
 *
 * Backend contract (NEW endpoint, does not touch any existing route):
 *
 *   POST {API_URL}/prescription/explain
 *   Headers: Authorization: Bearer <token>   (same pattern as /analyze)
 *   Body (JSON):
 *     {
 *       language: "en" | "hi",
 *       medicines: result.medicines,             // as returned by /analyze
 *       doctorInstructions: result.doctorInstructions,
 *       unreadableNotes: result.unreadableNotes,
 *       overallConfidence: result.overallConfidence
 *     }
 *   Expected response (JSON):
 *     {
 *       problem: string,        // plain-language summary of what's going on
 *       whatToDo: string[],     // array of simple action items
 *       medicines: [
 *         { name: string, why: string }   // plain-language "why" per medicine
 *       ]
 *     }
 *
 * If this endpoint does not exist yet / is unreachable, the component
 * automatically falls back to a locally-generated plain-language summary
 * built from the existing `result` fields, so the box still renders
 * something useful and never breaks the page.
 * ------------------------------------------------------------------
 */

const LANG_STORAGE_KEY = "wm_ai_explanation_lang";

const COPY = {
  en: {
    title: "AI Explanation (Simple Summary)",
    subtitle: "A plain-language recap of your prescription.",
    problemLabel: "What's going on",
    todoLabel: "What you should do",
    medsLabel: "Your medicines, in simple terms",
    loading: "Putting this into simple words...",
    errorFallbackNote: "Live AI explanation is unavailable right now, so here's a quick summary from your report:",
    noProblem: "Your prescription has been reviewed. Please check the details below.",
    fallbackTodoGeneric: "Take your medicines exactly as instructed and follow up with your doctor if anything is unclear.",
    fallbackWhy: "Prescribed by your doctor as part of your treatment.",
    toggleLabel: "Language",
    retry: "Try again",
  },
  hi: {
    title: "एआई स्पष्टीकरण (सरल सारांश)",
    subtitle: "आपके प्रिस्क्रिप्शन का आसान भाषा में सारांश।",
    problemLabel: "समस्या क्या है",
    todoLabel: "आपको क्या करना चाहिए",
    medsLabel: "आपकी दवाइयाँ, सरल शब्दों में",
    loading: "इसे सरल शब्दों में तैयार किया जा रहा है...",
    errorFallbackNote: "अभी लाइव एआई स्पष्टीकरण उपलब्ध नहीं है, इसलिए यहाँ आपकी रिपोर्ट से एक त्वरित सारांश है:",
    noProblem: "आपके प्रिस्क्रिप्शन की समीक्षा कर ली गई है। कृपया नीचे विवरण देखें।",
    fallbackTodoGeneric: "अपनी दवाइयाँ बताए अनुसार ही लें और कोई भी बात स्पष्ट न हो तो डॉक्टर से संपर्क करें।",
    fallbackWhy: "आपके इलाज के हिस्से के रूप में डॉक्टर द्वारा दी गई।",
    toggleLabel: "भाषा",
    retry: "फिर से कोशिश करें",
  },
};

const detectDefaultLang = () => {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === "en" || saved === "hi") return saved;
  } catch {
    /* localStorage may be unavailable (e.g. private mode) — ignore */
  }
  const nav = typeof navigator !== "undefined" ? navigator.language || "" : "";
  return nav.toLowerCase().startsWith("hi") ? "hi" : "en";
};

/** Builds a best-effort plain-language summary purely from existing result data. */
const buildFallbackExplanation = (result, lang) => {
  const t = COPY[lang];
  const medicines = Array.isArray(result?.medicines) ? result.medicines : [];
  const instructions = Array.isArray(result?.doctorInstructions) ? result.doctorInstructions : [];

  return {
    problem: result?.unreadableNotes || t.noProblem,
    whatToDo: instructions.length > 0 ? instructions : [t.fallbackTodoGeneric],
    medicines: medicines.map((m) => ({
      name: m.name,
      why: m.explanation || t.fallbackWhy,
    })),
  };
};

const LanguageToggle = ({ lang, onChange, label }) => (
  <div className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white p-1 text-xs font-semibold">
    <span className="px-2 text-slate-400">{label}</span>
    {["en", "hi"].map((code) => (
      <button
        key={code}
        type="button"
        onClick={() => onChange(code)}
        className={`rounded-full px-3 py-1 transition-colors ${
          lang === code ? "bg-red-700 text-white" : "text-slate-600 hover:bg-red-50"
        }`}
        aria-pressed={lang === code}
      >
        {code === "en" ? "EN" : "हिं"}
      </button>
    ))}
  </div>
);

const AIExplanationBox = ({ result }) => {
  const [lang, setLang] = useState(detectDefaultLang);
  const [explanation, setExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const cacheRef = useRef({}); // { [lang]: explanation } — avoids refetching on toggle

  const handleLangChange = (code) => {
    setLang(code);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, code);
    } catch {
      /* ignore storage errors */
    }
  };

  const fetchExplanation = useCallback(
    async (targetLang, signal) => {
      if (cacheRef.current[targetLang]) {
        setExplanation(cacheRef.current[targetLang]);
        setUsedFallback(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/prescription/explain`, {
          method: "POST",
          signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            language: targetLang,
            medicines: result.medicines,
            doctorInstructions: result.doctorInstructions,
            unreadableNotes: result.unreadableNotes,
            overallConfidence: result.overallConfidence,
          }),
        });

        if (!response.ok) throw new Error("explain endpoint unavailable");
        const data = await response.json();

        cacheRef.current[targetLang] = data;
        setExplanation(data);
        setUsedFallback(false);
      } catch (err) {
        if (err.name === "AbortError") return;
        // Graceful, non-breaking fallback — never surfaces an error to the user.
        const fallback = buildFallbackExplanation(result, targetLang);
        cacheRef.current[targetLang] = fallback;
        setExplanation(fallback);
        setUsedFallback(true);
      } finally {
        setIsLoading(false);
      }
    },
    [result]
  );

  useEffect(() => {
    if (!result) return;
    const controller = new AbortController();
    fetchExplanation(lang, controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, result]);

  if (!result) return null;

  const t = COPY[lang];

  return (
    <section className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">{t.title}</h4>
          <p className="mt-0.5 text-sm text-slate-500">{t.subtitle}</p>
        </div>
        <LanguageToggle lang={lang} onChange={handleLangChange} label={t.toggleLabel} />
      </div>

      {isLoading && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-red-200 bg-red-50/40 px-4 py-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-700" />
          <p className="text-sm text-slate-600">{t.loading}</p>
        </div>
      )}

      {!isLoading && explanation && (
        <div className="mt-4 space-y-4">
          {usedFallback && (
            <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-500">
              {t.errorFallbackNote}
            </p>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-red-700">{t.problemLabel}</p>
            <p className="mt-1 text-sm leading-6 text-slate-800">{explanation.problem}</p>
          </div>

          {Array.isArray(explanation.whatToDo) && explanation.whatToDo.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700">{t.todoLabel}</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-800">
                {explanation.whatToDo.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(explanation.medicines) && explanation.medicines.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700">{t.medsLabel}</p>
              <div className="mt-1.5 space-y-2">
                {explanation.medicines.map((m, i) => (
                  <div key={i} className="rounded-lg bg-red-50/40 px-3 py-2">
                    <p className="text-sm font-semibold text-slate-900">{m.name}</p>
                    <p className="text-sm leading-6 text-slate-700">{m.why}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default AIExplanationBox;