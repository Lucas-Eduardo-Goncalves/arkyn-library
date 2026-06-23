import { useState } from "react";
import { FullCalendarProvider } from "./_fullCalendarProvider";
import { DayCalendar } from "./dayCalendar";
import { FullCalendarContainer } from "./fullCalendarContainer";
import { FullCalendarHeader } from "./fullCalendarHeader";
import { MonthlyCalendar } from "./monthlyCalendar";
import { WeekCalendar } from "./weekCalendar";

type FullCalendarEvent = {
  /** Event label shown on the calendar chip. Required. */
  title: string;
  /** Event start date/time. Required. */
  date: Date;
  /** Event end date/time. When omitted the event is treated as a point in time. */
  endDate?: Date;
  /** Arbitrary payload forwarded to `onClick`. */
  data?: any;
  /** Color scheme for the event chip. @default "primary" */
  scheme?: "primary" | "success" | "warning" | "danger" | "info";
  /** Callback fired when the user clicks the event chip. Receives `data`. */
  onClick?: (data: any) => void;
};

type FullCalendarProps = {
  /** Initial view to render. @default "month" */
  defaultView?: "day" | "week" | "month";
  /** Initial selected date. Defaults to today. */
  defaultValue?: Date;
  /** Array of events to display on the calendar. */
  events?: FullCalendarEvent[];
  /** Callback fired when the selected date changes. Receives the new `Date`. */
  onChange?: (date: Date) => void;
  /** Callback fired when the user navigates to a different period. Receives the current `Date`. */
  onChangeView?: (date: Date) => void;
};

/**
 * FullCalendar — interactive calendar with day, week, and month views.
 *
 * Renders a navigable calendar that displays a list of events. The active view
 * can be switched at runtime via the built-in header controls.
 *
 * @param props.defaultView - Initial view to render (`"day"` | `"week"` | `"month"`). Default: `"month"`
 * @param props.defaultValue - Initial selected date. Defaults to today.
 * @param props.events - Array of events to display on the calendar.
 * @param props.events[].title - Event label shown on the calendar.
 * @param props.events[].date - Event start date/time.
 * @param props.events[].endDate - Event end date/time (optional).
 * @param props.events[].data - Arbitrary payload forwarded to `onClick`.
 * @param props.events[].scheme - Color scheme for the event chip (`"primary"` | `"success"` | `"warning"` | `"danger"` | `"info"`).
 * @param props.events[].onClick - Fires when the user clicks the event — receives `data`.
 * @param props.onChange - Fires when the selected date changes — receives the new `Date`.
 * @param props.onChangeView - Fires when the user navigates to a different period — receives the current `Date`.
 *
 * @returns FullCalendar JSX element.
 *
 * @example
 * ```tsx
 * // Basic monthly calendar
 * <FullCalendar />
 *
 * // Start on week view with a pre-selected date
 * <FullCalendar defaultView="week" defaultValue={new Date("2025-06-01")} />
 *
 * // With events
 * <FullCalendar
 *   events={[
 *     {
 *       title: "Team meeting",
 *       date: new Date("2025-06-13T10:00:00"),
 *       endDate: new Date("2025-06-13T11:00:00"),
 *       scheme: "primary",
 *       data: { meetingId: 42 },
 *       onClick: ({ meetingId }) => openMeeting(meetingId),
 *     },
 *     {
 *       title: "Deadline",
 *       date: new Date("2025-06-20"),
 *       scheme: "danger",
 *     },
 *   ]}
 *   onChangeView={(date) => fetchEventsForMonth(date)}
 * />
 * ```
 */
function FullCalendar(props: FullCalendarProps) {
  const [viewType, setViewType] = useState(props.defaultView || "month");

  return (
    <FullCalendarProvider
      events={props.events || []}
      defaultValue={props.defaultValue}
      onChangeView={props.onChangeView}
    >
      <FullCalendarContainer>
        <FullCalendarHeader viewType={viewType} setViewType={setViewType} />
        {viewType === "day" && <DayCalendar />}
        {viewType === "month" && <MonthlyCalendar />}
        {viewType === "week" && <WeekCalendar />}
      </FullCalendarContainer>
    </FullCalendarProvider>
  );
}

export { FullCalendar };
