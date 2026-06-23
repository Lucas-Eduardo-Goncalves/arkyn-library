import { MonthlyCalendarEvent } from "../monthlyCalendarEvent";
import "./styles.css";

type MonthlyCalendarTableTdProps = {
  day: number;
  month: number;
  year: number;
  dayOwner: "previous" | "current" | "next";
};

function MonthlyCalendarTableTd(props: MonthlyCalendarTableTdProps) {
  const { day, month, year, dayOwner } = props;

  function isToday() {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  }

  return (
    <td className={`arkynMonthlyCalendarTableTd ${dayOwner}`}>
      <p className={isToday() ? "today" : ""}>{day}</p>
      <div className="arkynMonthlyCalendarEventContainer">
        <MonthlyCalendarEvent day={day} month={month} year={year} />
      </div>
    </td>
  );
}

export { MonthlyCalendarTableTd };
