const VitalsSection = () => {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-800 mb-3">
        Vitals
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Heart Rate (bpm)"
          className="input"
        />
        <input
          type="number"
          placeholder="Weight (kg)"
          className="input"
        />
      </div>
    </div>
  );
};

export default VitalsSection;

