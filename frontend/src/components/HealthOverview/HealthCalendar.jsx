import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const HealthCalendar = ({ logs = [], onDateSelect }) => {
  const [date, setDate] = useState(new Date());

  // 🔹 Convert logs → Set for fast lookup
  const logDates = new Set(
    logs
      .filter((log) => log?.log_date)
      .map((log) =>
        new Date(log.log_date).toDateString()
      )
  );

  // 🔹 Today's date
  const today = new Date().toDateString();

  return (
    <div className="w-full max-w-xs aspect-square bg-white rounded-xl shadow-md p-3">
      <Calendar
        value={date}
        onChange={(selectedDate) => {
          setDate(selectedDate);
          onDateSelect?.(selectedDate); // safe call
        }}
        className="custom-calendar"

        // 🔹 Single letter days (M T W...)
        formatShortWeekday={(locale, date) =>
          ["S", "M", "T", "W", "T", "F", "S"][
            date.getDay()
          ]
        }

        // 🔹 Highlight logic
        tileClassName={({ date }) => {
          const d = date.toDateString();

          if (d === today && logDates.has(d))
            return "today-logged";

          if (logDates.has(d)) return "log-day";

          if (d === today) return "today";

          return null;
        }}

        // 🔹 Tick mark on logged days
        tileContent={({ date }) => {
          const d = date.toDateString();

          if (logDates.has(d)) {
            return (
              <span className="text-green-600 text-xs font-bold">
                ✔
              </span>
            );
          }
        }}
      />
    </div>
  );
};

export default HealthCalendar;