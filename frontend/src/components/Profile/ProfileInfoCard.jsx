import { useState } from "react";
import { toAbsoluteUrl } from "../../config/api";
import PhotoUploadModal from "./PhotoUploadModal";

const InfoField = ({ label, value, muted }) => <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
  <dd className={`mt-1 break-words text-sm font-semibold ${muted ? "text-slate-500" : "text-slate-800"}`}>{value}</dd>
</div>;

const Avatar = ({ username, profileImage, onClick }) => {
  const imageUrl = toAbsoluteUrl(profileImage);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Change profile picture"
      title="Change profile picture"
      className="group relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-red-600 to-red-800 text-3xl font-bold text-white shadow-lg shadow-red-200"
    >
      {imageUrl ? (
        <img src={imageUrl} alt={`${username}'s profile`} className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden="true">{username.charAt(0).toUpperCase()}</span>
      )}
      <span className="absolute inset-0 grid place-items-center bg-slate-900/0 text-xs font-semibold text-transparent transition group-hover:bg-slate-900/50 group-hover:text-white">
        Edit
      </span>
    </button>
  );
};

const ProfileInfoCard = ({ profile }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return <section className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm sm:p-6">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <Avatar username={profile.username} profileImage={profile.profileImage} onClick={() => setModalOpen(true)} />
      <div className="min-w-0 flex-1"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-red-700">Personal information</p><h3 className="mt-1 truncate text-2xl font-bold text-slate-900">{profile.username}</h3><p className="mt-1 truncate text-sm text-slate-600">{profile.email}</p><button type="button" onClick={() => setModalOpen(true)} className="mt-4 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50">Upload / Change Photo</button></div>
    </div>
    <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <InfoField label="Username" value={profile.username} />
      <InfoField label="Email address" value={profile.email} muted={profile.emailUnavailable} />
      <InfoField label="Contact number" value={profile.phone} muted />
    </dl>
    <PhotoUploadModal open={modalOpen} onClose={() => setModalOpen(false)} />
  </section>;
};

export default ProfileInfoCard;
