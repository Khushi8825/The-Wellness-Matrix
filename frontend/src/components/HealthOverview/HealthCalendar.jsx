import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const HealthCalendar = ({ logs = [], onDateSelect }) => {
  const [date, setDate] = useState(new Date());

  const logDates = logs
  .filter(log => log?.log_date)
  .map(log => new Date(log.log_date).toDateString());

  return (
    <div className="w-full max-w-xs aspect-square bg-white rounded-xl shadow-md p-3">
      <Calendar
        value={date}
        onChange={(selectedDate) => {
          setDate(selectedDate);
          onDateSelect(selectedDate);
        }}
        className="custom-calendar"
        formatShortWeekday={(locale, date) =>
          ["S", "M", "T", "W", "T", "F", "S"][date.getDay()]
        }
        tileClassName={({ date }) =>
          logDates.includes(date.toDateString())
            ? "log-day"
            : null
        }
      />
    </div>
  );
};

export default HealthCalendar;