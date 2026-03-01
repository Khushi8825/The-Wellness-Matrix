import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const HealthCalendar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="w-full max-w-xs aspect-square bg-white rounded-xl shadow-md p-3 flex items-center justify-center">
      <Calendar
        onChange={setDate}
        value={date}
        className="custom-calendar"
        formatShortWeekday={(locale, date) =>
          ["S", "M", "T", "W", "T", "F", "S"][date.getDay()]
        }
      />
    </div>
  );
};

export default HealthCalendar;
