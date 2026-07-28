import { createContext, useCallback, useEffect, useState } from "react";
import { API_URL } from "../config/api";

const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setProfile(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to load profile");
      const data = await response.json();
      setProfile(data);
      // Keep the existing localStorage-based fallbacks (used by DashboardHeader,
      // Profile, etc. before this context existed) in sync as a safety net.
      if (data.username) localStorage.setItem("username", data.username);
      if (data.email) localStorage.setItem("email", data.email);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Lets the upload flow reflect the new picture everywhere immediately,
  // without waiting on a refetch or a page refresh.
  const updateProfileImage = useCallback((profileImage) => {
    setProfile((prev) => (prev ? { ...prev, profileImage } : prev));
  }, []);

  const value = { profile, isLoading, error, refreshProfile: fetchProfile, updateProfileImage };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export { ProfileContext };
