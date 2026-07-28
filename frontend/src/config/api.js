// Keeps the backend origin in one place. The rest of the app already
// hardcodes "http://localhost:5000" for its fetch calls, so new code
// mirrors that convention instead of introducing a separate pattern.
export const API_BASE_URL = "http://localhost:5000";
export const API_URL = `${API_BASE_URL}/api`;

// Backend returns relative paths for uploaded files (e.g. "/uploads/..").
// This turns them into an absolute URL the <img> tag can load.
export const toAbsoluteUrl = (relativeOrAbsolutePath) => {
  if (!relativeOrAbsolutePath) return null;
  if (/^https?:\/\//i.test(relativeOrAbsolutePath)) return relativeOrAbsolutePath;
  return `${API_BASE_URL}${relativeOrAbsolutePath}`;
};
