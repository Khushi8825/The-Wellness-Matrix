const VitalsSection = ({ data, setData }) => {
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
          value={data.heartRate}
          onChange={(e) =>
            setData((prev) => ({ ...prev, heartRate: e.target.value }))
          }
        />

        <input
          type="number"
          placeholder="Weight (kg)"
          className="input"
          value={data.weight}
          onChange={(e) =>
            setData((prev) => ({ ...prev, weight: e.target.value }))
          }
        />
      </div>
    </div>
  );
};

export default VitalsSection;
