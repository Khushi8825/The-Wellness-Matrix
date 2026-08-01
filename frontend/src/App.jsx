import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Landing, Login, Register } from "./pages";
import { Landing, Login, Register, Dashboard, UpdateVitals, Profile, PrescriptionAnalyzer } from "./pages/index";
import { ProtectedRoute, ToastProvider } from "./components";
import { ProfileProvider } from "./context/ProfileContext";
function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
      <ProfileProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/update-vitals" element={<ProtectedRoute><UpdateVitals /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/prescription" element={<ProtectedRoute><PrescriptionAnalyzer /></ProtectedRoute>} />
      </Routes>
      </ProfileProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
