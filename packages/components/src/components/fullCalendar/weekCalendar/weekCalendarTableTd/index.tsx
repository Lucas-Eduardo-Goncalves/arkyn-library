import { WeekCalendarEvent } from "../weekCalendarEvent";
import "./styles.css";

type WeekCalendarTableTdProps = {
  day: number;
  month: number;
  year: number;
  dayOwner: "previous" | "current" | "next";
  timeInMinutes: number;
};

function WeekCalendarTableTd(props: WeekCalendarTableTdProps) {
  const { day, month, year, dayOwner, timeInMinutes } = props;

  function isToday() {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  }

  return (
    <td
      className={`arkynWeekCalendarTableTd ${dayOwner} ${isToday() ? "today" : ""}`}
      data-day={day}
      data-time={timeInMinutes}
    >
      <div className="arkynWeekCalendarTableTdContent">
        <WeekCalendarEvent
          day={day}
          month={month}
          year={year}
          timeInMinutes={timeInMinutes}
        />
      </div>
    </td>
  );
}

export { WeekCalendarTableTd };
