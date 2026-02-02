const LifestyleSection = () => {
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
        />
        <input
          type="number"
          placeholder="Exercise (minutes)"
          className="input"
        />
      </div>

      <textarea
        rows="3"
        placeholder="Meals / Notes"
        className="input resize-none"
      />
    </div>
  );
};

export default LifestyleSection;
