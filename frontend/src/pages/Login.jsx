import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#f87171,#7f1d1d)]">
      
      {/* Fade animation styles */}
            <style>
        {`
          @keyframes flipIn {
            from {
              opacity: 0;
              transform: perspective(800px) rotateY(15deg) translateY(20px);
            }
            to {
              opacity: 1;
              transform: perspective(800px) rotateY(0deg) translateY(0);
            }
          }
        `}
      </style>

      {/* Login Card */}
      <div
        className="w-full max-w-md rounded-2xl p-8
        bg-white/30 backdrop-blur-md
        shadow-xl border border-white/30"
        style={{
          animation: "flipIn 1s ease-out 0.2s forwards",
        }}
      >
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-red-600 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-700 mb-6">
          Login to continue your wellness journey
        </p>

        {/* Login Form */}
        <form className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-2 rounded-lg
              bg-white/70 border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg
              bg-white/70 border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg
            font-semibold hover:bg-red-700 transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-700 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-red-700 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
