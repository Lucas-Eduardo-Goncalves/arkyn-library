import { useFullCalendar } from "../../_fullCalendarProvider";
import "./styles.css";

type DayCalendarEventProps = {
  timeInMinutes: number;
};

const SLOT_DURATION_MINUTES = 30;
const OVERLAP_OFFSET_PX = 205;

function DayCalendarEvent(props: DayCalendarEventProps) {
  const { events, viewDate } = useFullCalendar();

  const day = viewDate.getDate();
  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();

  const dayEvents = events
    .map((event, sourceIndex) => ({ event, sourceIndex }))
    .filter(({ event }) => {
      return (
        event.initialDate.getDate() === day &&
        event.initialDate.getMonth() === month &&
        event.initialDate.getFullYear() === year
      );
    })
    .sort((a, b) => {
      const startA = a.event.initialDate.getTime();
      const startB = b.event.initialDate.getTime();

      if (startA !== startB) return startA - startB;

      const endA =
        a.event.endDate?.getTime() ?? startA + SLOT_DURATION_MINUTES * 60_000;
      const endB =
        b.event.endDate?.getTime() ?? startB + SLOT_DURATION_MINUTES * 60_000;

      if (endA !== endB) return endA - endB;
      return a.sourceIndex - b.sourceIndex;
    });

  const dayEventOrderBySourceIndex = new Map(
    dayEvents.map((item, orderIndex) => [item.sourceIndex, orderIndex]),
  );

  const filteredEvents = dayEvents.filter(({ event }) => {
    const dayHour = Math.floor(props.timeInMinutes / 60);
    const dayMinute = props.timeInMinutes % 60;

    function isEventInInterval() {
      const eventHour = event.initialDate.getHours();
      const eventMinute = event.initialDate.getMinutes();

      if (eventHour !== dayHour) return false;
      if (dayMinute === 0) return eventMinute < 30 && eventMinute >= 0;
      if (dayMinute === 30) return eventMinute >= 30 && eventMinute < 60;
    }

    return (
      isEventInInterval() &&
      event.initialDate.getDate() === day &&
      event.initialDate.getMonth() === month &&
      event.initialDate.getFullYear() === year
    );
  });

  if (filteredEvents.length === 0) return <></>;

  function makeEventKey(index: number, sourceIndex: number) {
    return `${day}-${month}-${year}-${sourceIndex}-${index}`;
  }

  function makeHour(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    if (minutes === 0) return `${hours}h`;
    return `${hours}h${minutes}`;
  }

  function getEventRangeInMinutes(event: {
    initialDate: Date;
    endDate?: Date;
  }) {
    const startMinutes =
      event.initialDate.getHours() * 60 + event.initialDate.getMinutes();

    const endMinutes = event.endDate
      ? event.endDate.getHours() * 60 + event.endDate.getMinutes()
      : startMinutes + SLOT_DURATION_MINUTES;

    return {
      startMinutes,
      endMinutes: Math.max(endMinutes, startMinutes + 1),
    };
  }

  function countOverlappingPreviousEvents(
    currentEvent: { initialDate: Date; endDate?: Date },
    sourceIndex: number,
  ) {
    const current = getEventRangeInMinutes(currentEvent);
    const currentOrderIndex = dayEventOrderBySourceIndex.get(sourceIndex);

    if (currentOrderIndex == null) return 0;

    return dayEvents.reduce((count, item, orderIndex) => {
      if (orderIndex >= currentOrderIndex) return count;

      const candidate = getEventRangeInMinutes(item.event);
      const intersects =
        candidate.startMinutes < current.endMinutes &&
        candidate.endMinutes > current.startMinutes;

      if (!intersects) return count;
      return count + 1;
    }, 0);
  }

  function getEventStyle(
    event: { initialDate: Date; endDate?: Date },
    sourceIndex: number,
  ) {
    const { startMinutes, endMinutes } = getEventRangeInMinutes(event);
    const startOffsetInCell = startMinutes - props.timeInMinutes;

    const durationInMinutes = Math.max(endMinutes - startMinutes, 1);
    const top = (startOffsetInCell / SLOT_DURATION_MINUTES) * 100;
    const height = (durationInMinutes / SLOT_DURATION_MINUTES) * 100;
    const overlapOffset =
      countOverlappingPreviousEvents(event, sourceIndex) * OVERLAP_OFFSET_PX;

    return {
      top: `${top}%`,
      height: `${height}%`,
      left: `${overlapOffset}px`,
    };
  }

  function handleEventClick(event: React.MouseEvent, eventData: any) {
    event.stopPropagation();
    eventData.onClick?.(eventData.data);
  }

  return filteredEvents.map(({ event, sourceIndex }, index) => (
    <div
      key={makeEventKey(index, sourceIndex)}
      className={`arkynDayCalendarEvent ${event?.scheme || "primary"}`}
      style={getEventStyle(event, sourceIndex)}
      onClick={(e) => handleEventClick(e, event)}
    >
      <strong>
        {makeHour(event.initialDate)}{" "}
        {event?.endDate && `- ${makeHour(event.endDate)}`}
      </strong>
      <p>{event.title}</p>
    </div>
  ));
}

export { DayCalendarEvent };
