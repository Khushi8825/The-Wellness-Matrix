export function VitalsSection() {
  return (
    <div className="section">
      <h3>Vitals</h3>

      <div className="grid-2">
        <input placeholder="Systolic BP" />
        <input placeholder="Diastolic BP" />
        <input placeholder="Heart Rate" />
        <input placeholder="Weight (kg)" />
      </div>
    </div>
  );
}
