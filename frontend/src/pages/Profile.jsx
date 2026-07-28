import { DashboardHeader } from "../components";
import HealthRecordCard from "../components/Profile/HealthRecordCard";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileInfoCard from "../components/Profile/ProfileInfoCard";
import useProfile from "../hooks/useProfile";

const Profile = () => {
  const { profile: fetchedProfile, isLoading } = useProfile();

  // Falls back to localStorage while the profile request is in flight (or if
  // it fails), so the page still renders something useful immediately.
  const username = fetchedProfile?.username || localStorage.getItem("username") || "Wellness Member";
  const email = fetchedProfile?.email || localStorage.getItem("email");
  const profile = {
    username,
    email: email || "Email available after profile sync",
    emailUnavailable: !email,
    phone: "Not added",
    profileImage: fetchedProfile?.profileImage || null,
  };

  return <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fee2e2,_transparent_35%),linear-gradient(180deg,#fffafa_0%,#fff1f2_100%)] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl"><DashboardHeader title="My Profile" /><ProfileHeader /><div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]"><ProfileInfoCard profile={profile} isLoading={isLoading} /><HealthRecordCard /></div></div>
  </main>;
};

export default Profile;
