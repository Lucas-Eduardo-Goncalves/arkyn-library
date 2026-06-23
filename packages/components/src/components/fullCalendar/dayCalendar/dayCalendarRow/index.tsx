import { ViewService } from "../../_viewService";
import { DayCalendarEvent } from "../dayCalendarEvent";
import "./styles.css";

type DayCalendarRowProps = {
  hour: number;
  timeInMinutes: number;
};

function DayCalendarRow({ hour, timeInMinutes }: DayCalendarRowProps) {
  const viewService = new ViewService();

  return (
    <div className="arkynDayCalendarRow" data-time={timeInMinutes}>
      <p>{viewService.formatHourLabel(hour)}</p>

      <div className="arkynDayCalendarRowContent">
        <DayCalendarEvent timeInMinutes={timeInMinutes} />
      </div>
    </div>
  );
}

export { DayCalendarRow, type DayCalendarRowProps };
