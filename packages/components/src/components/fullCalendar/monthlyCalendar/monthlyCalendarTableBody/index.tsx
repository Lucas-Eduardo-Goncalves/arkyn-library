import { useFullCalendar } from "../../_fullCalendarProvider";
import { MonthlyCalendarTableTd } from "../monthlyCalendarTableTd";
import "./styles.css";

function MonthlyCalendarTableBody() {
  const fullCalendar = useFullCalendar();

  return (
    <tbody className="arkynMonthlyCalendarTableBody">
      {fullCalendar.listMonthlyMatrix.map((week, weekIndex) => (
        <tr key={weekIndex}>
          {week.map((props, dayIndex) => (
            <MonthlyCalendarTableTd key={dayIndex} {...props} />
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export { MonthlyCalendarTableBody };
