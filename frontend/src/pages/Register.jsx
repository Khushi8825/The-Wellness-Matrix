import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
 

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  // 🔐 Strong password check algorithm
  const isStrongPassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isStrongPassword(formData.password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      );
      return;
    }

    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      console.log("✅ Backend response:", data);
      alert("User registered successfully 🎉");
      navigate("/login");
    } catch (err) {
      console.error("❌ Register error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#f87171,#7f1d1d)]">
      {/* Drop animation styles */}
      <style>
        {`
          @keyframes dropIn {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {/* Register Card */}
      <div
        className="w-full max-w-lg rounded-2xl p-8
        backdrop-blur-md
        shadow-xl border border-white/30
        bg-white/30 opacity-0"
        style={{
          animation: "dropIn 0.8s ease-out forwards",
        }}
      >
        <h2 className="text-3xl font-bold text-center text-red-600 mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-700 mb-6">
          Join The Wellness Matrix
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg
            bg-white/70 border border-gray-300
            focus:ring-2 focus:ring-red-500 outline-none"
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name (Optional)"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg
            bg-white/70 border border-gray-300
            focus:ring-2 focus:ring-red-500 outline-none"
          />

          <input
            type="text"
            name="username"
            placeholder="Choose a unique username"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg
            bg-white/70 border border-gray-300
            focus:ring-2 focus:ring-red-500 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email (Optional)"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg
            bg-white/70 border border-gray-300
            focus:ring-2 focus:ring-red-500 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Create Password"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg
            bg-white/70 border border-gray-300
            focus:ring-2 focus:ring-red-500 outline-none"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg
            bg-white/70 border border-gray-300
            focus:ring-2 focus:ring-red-500 outline-none"
          />

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg
            font-semibold hover:bg-red-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-700 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-700 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
