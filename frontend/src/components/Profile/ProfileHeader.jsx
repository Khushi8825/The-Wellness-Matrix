import { Link } from "react-router-dom";

const ProfileHeader = () => <div className="flex flex-col gap-4 rounded-2xl border border-red-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
  <div>
    <Link to="/dashboard" className="text-sm font-semibold text-red-700 transition hover:text-red-900">← Back to dashboard</Link>
    <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-red-700">Account centre</p>
    <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">My Profile</h2>
    <p className="mt-2 max-w-xl text-slate-600">Keep your personal information and medical history organised in one secure place.</p>
  </div>
  <span className="w-fit rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">Private health profile</span>
</div>;

export default ProfileHeader;
