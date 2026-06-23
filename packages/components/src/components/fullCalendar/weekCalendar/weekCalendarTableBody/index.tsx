import { useFullCalendar } from "../../_fullCalendarProvider";
import { ViewService } from "../../_viewService";
import { WeekCalendarTableTd } from "../weekCalendarTableTd";
import "./styles.css";

function WeekCalendarTableBody() {
  const fullCalendar = useFullCalendar();
  const viewService = new ViewService();

  return (
    <tbody className="arkynWeekCalendarTableBody">
      {fullCalendar.listWeeklyMatrix.map((hourRow) => (
        <tr key={hourRow[0].timeInMinutes}>
          <td className="hourTd">
            <p>{viewService.formatHourLabel(hourRow[0].timeInMinutes)}</p>
          </td>

          {hourRow.map((cell, index) => (
            <WeekCalendarTableTd
              key={`${cell.year}-${cell.month}-${cell.day}-${cell.timeInMinutes}-${index}`}
              {...cell}
            />
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export { WeekCalendarTableBody };
