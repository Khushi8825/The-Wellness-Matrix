const BloodPressureSection = ({ data, setData }) => {
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
          value={data.systolicBP}
          onChange={(e) =>
            setData((prev) => ({ ...prev, systolicBP: e.target.value }))
          }
        />

        <input
          type="number"
          placeholder="Diastolic"
          className="input"
          value={data.diastolicBP}
          onChange={(e) =>
            setData((prev) => ({ ...prev, diastolicBP: e.target.value }))
          }
        />
      </div>
    </div>
  );
};

export default BloodPressureSection;
