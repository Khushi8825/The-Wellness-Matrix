import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
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
  // Conditions:
  // - Minimum 8 characters
  // - At least 1 uppercase letter
  // - At least 1 lowercase letter
  // - At least 1 number
  // - At least 1 special character
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Password match check
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Strong password validation
    if (!isStrongPassword(formData.password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    // ✅ Username uniqueness check
    // TODO: When backend & database are connected,
    // check if username already exists before creating user

    setError("");
    console.log("Register data:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-red-700">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join The Wellness Matrix
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
          />

          {/* Last Name (Optional) */}
          <input
            type="text"
            name="lastName"
            placeholder="Last Name (Optional)"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
          />

          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Choose a unique username"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
          />

          {/* Email (Optional) */}
          <input
            type="email"
            name="email"
            placeholder="Email (Optional)"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
          />

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Register
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-red-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
