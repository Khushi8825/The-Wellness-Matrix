import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Landing, Login, Register } from "./pages";
import { Landing, Login, Register, Dashboard, UpdateVitals } from "./pages/index";
import { ProtectedRoute, ToastProvider } from "./components";
function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/update-vitals" element={<ProtectedRoute><UpdateVitals /></ProtectedRoute>} />
      </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
