import { useFullCalendar } from "../../_fullCalendarProvider";
import "./styles.css";

type MonthlyCalendarEventProps = {
  day: number;
  month: number;
  year: number;
};

function MonthlyCalendarEvent(props: MonthlyCalendarEventProps) {
  const { events } = useFullCalendar();

  const filteredEvents = events.filter((event) => {
    return (
      event.date.getDate() === props.day &&
      event.date.getMonth() === props.month &&
      event.date.getFullYear() === props.year
    );
  });

  if (filteredEvents.length === 0) return <></>;

  function makeEventKey(index: number) {
    return `${props.day}-${props.month}-${props.year}-${index}`;
  }

  function makeHour(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    if (minutes === 0) return `${hours}h`;
    return `${hours}h${minutes}`;
  }

  return filteredEvents.map((event, index) => (
    <div
      key={makeEventKey(index)}
      className={`arkynMonthlyCalendarEvent ${event?.scheme || "primary"}`}
      onClick={() => event.onClick?.(event.data)}
    >
      <strong>
        {makeHour(event.date)}{" "}
        {event?.endDate && `- ${makeHour(event.endDate)}`}
      </strong>
      <p>{event.title}</p>
    </div>
  ));
}

export { MonthlyCalendarEvent };
