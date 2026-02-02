const FormActions = () => {
  return (
    <div className="pt-4">
      <button
        type="submit"
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition"
      >
        Save Health Record
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">
        🔒 Your health data is private and secure
      </p>
    </div>
  );
};

export default FormActions;
