const DateSection = ({ data, setData }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Date
      </label>
      <input
        type="date"
        className="input"
        value={data.date}
        onChange={(e) =>
          setData((prev) => ({ ...prev, date: e.target.value }))
        }
        required
      />
    </div>
  );
};

export default DateSection;
