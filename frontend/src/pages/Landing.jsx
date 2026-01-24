import Navbar from "../components/Navbar";
import Lottie from "lottie-react";
import graphAnimation from "../assets/graph.json";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="bg-white text-gray-700">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <Lottie
            animationData={graphAnimation}
            loop={true}
            className="w-150 md:w-225"
          />
        </div>
        {/* Soft Red Overlay */}
        <div className="absolute inset-0 bg-red-50 opacity-50"></div>
        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-red-600">
            Know Your Body.
            <br />
            Know Its Needs.
          </h1>

          <p className="mt-4 max-w-xl text-gray-600 mx-auto">
            The Wellness Matrix helps you understand your health data with
            clarity, care, and complete transparency.
          </p>
          <Link to="/login">
            {" "}
            <button className="mt-6 bg-red-500 text-white px-8 py-3 rounded-full hover:bg-red-600 transition">
              Login
            </button>
          </Link>
        </div>
      </section>

      {/* Platform Purpose */}
      <section id="purpose" className="py-20 px-6 bg-red-50">
        <h2 className="text-3xl font-semibold text-red-600 text-center">
          Platform Purpose
        </h2>
        <p className="mt-4 max-w-3xl mx-auto text-center">
          Our platform exists to help you understand your health, not just
          measure it. We turn numbers into meaning.
        </p>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 px-6">
        <h2 className="text-3xl font-semibold text-red-600 text-center">
          Benefits
        </h2>
        <div className="mt-10 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            "Clear health insights",
            "Time-series health tracking",
            "Downloadable reports",
          ].map((text, i) => (
            <div key={i} className="p-6 border rounded-xl text-center">
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* Privacy First */}
      <section id="privacy" className="py-20 px-6 bg-red-50">
        <h2 className="text-3xl font-semibold text-red-600 text-center">
          Privacy-First Guarantee
        </h2>
        <p className="mt-4 max-w-3xl mx-auto text-center">
          Your health data belongs only to you. Encrypted, secure, and never
          misused.
        </p>
      </section>

      {/* Explainable AI */}
      <section id="ai" className="py-20 px-6">
        <h2 className="text-3xl font-semibold text-red-600 text-center">
          Explainable AI
        </h2>
        <p className="mt-4 max-w-3xl mx-auto text-center">
          No black boxes. We explain every health suggestion in simple language
          so you always know why.
        </p>
      </section>

      {/* Reports */}
      <section id="reports" className="py-20 px-6 bg-red-50">
        <h2 className="text-3xl font-semibold text-red-600 text-center">
          Download Reports
        </h2>
        <p className="mt-4 max-w-3xl mx-auto text-center">
          Weekly and monthly health summaries that you can save and share.
        </p>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <h2 className="text-3xl font-semibold text-red-600 text-center">
          Testimonials
        </h2>
        <p className="mt-4 text-center text-gray-500">
          (Optional – You can add real stories later)
        </p>
      </section>
    </div>
  );
}

export default Landing;
