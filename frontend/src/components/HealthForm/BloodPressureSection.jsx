const BloodPressureSection = () => {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-800 mb-3">
        Blood Pressure
      </h4>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Systolic"
          className="input"
        />
        <input
          type="number"
          placeholder="Diastolic"
          className="input"
        />
      </div>
    </div>
  );
};

export default BloodPressureSection;
