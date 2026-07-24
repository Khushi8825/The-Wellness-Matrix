import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardHeader = ({ title = "Health Dashboard" }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Wellness Member";
  const initial = username.charAt(0).toUpperCase();

  useEffect(() => {
    const closeMenu = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("wellness-ai-analysis");
    navigate("/login");
  };

  return <header className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-100 bg-white px-4 py-3 shadow-sm sm:px-6">
    <div className="flex min-w-0 items-center gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-700 text-lg font-black text-white shadow-md shadow-red-200">W</div>
      <div className="min-w-0"><p className="truncate text-sm font-bold text-red-800">The Wellness Matrix</p><h1 className="truncate text-lg font-semibold text-slate-900">{title}</h1></div>
    </div>
    <div className="flex items-center gap-3">
      <button type="button" aria-label="Notifications" className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-red-50 hover:text-red-700"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg></button>
      <div ref={menuRef} className="relative"><button type="button" onClick={() => setOpen((value) => !value)} className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-red-50"><span className="grid h-8 w-8 place-items-center rounded-full bg-red-700 text-sm font-bold text-white">{initial}</span><span className="hidden max-w-28 truncate text-sm font-semibold text-slate-700 sm:block">{username}</span><svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg></button>
        {open && <div className="absolute right-0 top-12 z-30 w-44 rounded-xl border border-red-100 bg-white p-1.5 shadow-xl"><button type="button" onClick={() => navigate("/profile")} className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-red-50">My Profile</button><button type="button" className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-red-50">Settings</button><button type="button" onClick={logout} className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-700 hover:bg-red-50">Logout</button></div>}
      </div>
    </div>
  </header>;
};

export default DashboardHeader;
