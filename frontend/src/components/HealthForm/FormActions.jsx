const FormActions = ({ isSubmitting }) => {
  return (
    <div className="pt-4">
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving health record…" : "Save Health Record"}
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">
        🔒 Your health data is private and secure
      </p>
    </div>
  );
};

export default FormActions;
