const LifestyleSection = ({ data, setData }) => {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-800 mb-3">
        Lifestyle
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input
          type="number"
          placeholder="Sleep Hours"
          className="input"
          value={data.sleep || ""}
          onChange={(e) =>
            setData((prev) => ({ ...prev, sleep: e.target.value }))
          }
        />

        <input
          type="number"
          placeholder="Exercise (minutes)"
          className="input"
          value={data.exercise || ""}
          onChange={(e) =>
            setData((prev) => ({ ...prev, exercise: e.target.value }))
          }
        />
      </div>

      <textarea
        rows="3"
        placeholder="Meals / Notes"
        className="input resize-none"
        value={data.meals}
        onChange={(e) =>
          setData((prev) => ({ ...prev, meals: e.target.value }))
        }
      />
    </div>
  );
};

export default LifestyleSection;
