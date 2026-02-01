import { useState } from "react";

const HealthForm = () => {
  const [data, setData] = useState({
    heartRate: "",
    bp: "",
    weight: "",
    meals: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(data);
    // API call later
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        space-y-4 
        w-full
        bg-white/20
        backdrop-blur-md
        rounded-2xl
        p-4 sm:p-6
        border border-white/30
      "
    >
      <h3 className="text-lg font-semibold text-white">
        Add Daily Health Record
      </h3>

      {/* Heart Rate */}
      <input
        placeholder="Heart Rate"
        onChange={(e) => setData({ ...data, heartRate: e.target.value })}
        className="
          w-full
          px-4 py-2
          rounded-lg
          bg-white/70
          border border-transparent
          text-gray-800
          placeholder-gray-500
          focus:outline-none
          focus:ring-2
          focus:ring-red-500
        "
      />

      {/* Blood Pressure */}
      <input
        placeholder="BP (120/80)"
        onChange={(e) => setData({ ...data, bp: e.target.value })}
        className="
          w-full
          px-4 py-2
          rounded-lg
          bg-white/70
          border border-transparent
          text-gray-800
          placeholder-gray-500
          focus:outline-none
          focus:ring-2
          focus:ring-red-500
        "
      />

      {/* Weight */}
      <input
        placeholder="Weight (kg)"
        onChange={(e) => setData({ ...data, weight: e.target.value })}
        className="
          w-full
          px-4 py-2
          rounded-lg
          bg-white/70
          border border-transparent
          text-gray-800
          placeholder-gray-500
          focus:outline-none
          focus:ring-2
          focus:ring-red-500
        "
      />

      {/* Meals */}
      <textarea
        placeholder="Meals"
        rows={3}
        onChange={(e) => setData({ ...data, meals: e.target.value })}
        className="
          w-full
          px-4 py-2
          rounded-lg
          bg-white/70
          border border-transparent
          text-gray-800
          placeholder-gray-500
          focus:outline-none
          focus:ring-2
          focus:ring-red-500
          resize-none
        "
      />

      {/* Save Button (LOGIC UNCHANGED) */}
      <button
        type="submit"
        className="
          w-full
          mt-4
          bg-red-600
          text-white
          py-2.5
          rounded-xl
          font-semibold
          shadow-lg
          hover:bg-red-700
          active:scale-[0.97]
          transition-all
          duration-200
        "
      >
        Save Health Record
      </button>
    </form>
  );
};

export default HealthForm;
