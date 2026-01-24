import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          {/* 
            When you have your logo:
            <img src="example.image" alt="Logo" className="h-8" />
          */}
          <h1 className="text-xl font-bold text-red-600">
            The Wellness Matrix
          </h1>
        </div>

        {/* Center: Section Links */}
        <div className="hidden md:flex gap-6 text-sm text-gray-600">
          <a href="#purpose" className="hover:text-red-500">Purpose</a>
          <a href="#benefits" className="hover:text-red-500">Benefits</a>
          <a href="#privacy" className="hover:text-red-500">Privacy</a>
          <a href="#ai" className="hover:text-red-500">Explainable AI</a>
          <a href="#reports" className="hover:text-red-500">Reports</a>
          <a href="#testimonials" className="hover:text-red-500">Testimonials</a>
        </div>

        {/* Right: Login Button */}
        <Link to="/login">
        <button className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition">
          Login
        </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
