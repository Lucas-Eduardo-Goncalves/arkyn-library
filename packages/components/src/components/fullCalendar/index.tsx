import { useState } from "react";
import { FullCalendarProvider } from "./_fullCalendarProvider";
import { DayCalendar } from "./dayCalendar";
import { FullCalendarContainer } from "./fullCalendarContainer";
import { FullCalendarHeader } from "./fullCalendarHeader";
import { MonthlyCalendar } from "./monthlyCalendar";
import { WeekCalendar } from "./weekCalendar";

/**
 * Represents a single event rendered on the calendar.
 */
type FullCalendarEvent = {
  /** Display label shown on the event block. */
  title: string;
  /** Start date and time of the event. */
  initialDate: Date;
  /** End date and time of the event. */
  endDate?: Date;
  /** Arbitrary payload forwarded to the `onClick` callback. */
  data?: any;
  /**
   * Color scheme applied to the event block.
   * - `primary`: default blue.
   * - `success`: green.
   * - `warning`: yellow.
   * - `danger`: red.
   * - `info`: light blue.
   *
   * @default "primary"
   */
  scheme?: "primary" | "success" | "warning" | "danger" | "info";
  /** Callback fired when the user clicks the event. Receives `data` as argument. */
  onClick?: (data: any) => void;
};

/**
 * Represents a blocked (unavailable) time range on the calendar.
 */
type BlockTimestamp = {
  /** Start of the blocked range. */
  initialDate: Date;
  /** End of the blocked range. */
  endDate: Date;
};

/**
 * Props for the FullCalendar component.
 */
type FullCalendarProps = {
  /** Controlled value for the currently focused date. */
  viewValue?: Date;
  /** Initial focused date when the calendar mounts. */
  defaultViewValue?: Date;
  /** List of events to display across day, week, and month views. */
  events?: FullCalendarEvent[];
  /** Time ranges that should be visually marked as unavailable. */
  blockedTimestamps?: BlockTimestamp[];
  /** Callback fired when the user navigates to a different period. */
  onChangeView?: (date: Date) => void;
  /** Callback fired when the user clicks a date cell. */
  onClickDate?: (date: Date) => void;
};

/**
 * Full-featured calendar component with day, week, and month views.
 *
 * Renders a switchable calendar that supports event display, blocked time
 * ranges, and date navigation. Internal state and business logic are managed
 * by `FullCalendarProvider`, keeping the public API minimal.
 *
 * @param props FullCalendar properties.
 * @returns Calendar UI with a view switcher header and the active view grid.
 *
 * @example
 * // Basic usage with events
 * <FullCalendar
 *   defaultValue={new Date()}
 *   events={[
 *     {
 *       title: "Team standup",
 *       initialDate: new Date(2026, 5, 22, 9, 0),
 *       endDate: new Date(2026, 5, 22, 9, 30),
 *       scheme: "primary",
 *       onClick: (data) => console.log("Event clicked:", data),
 *     },
 *   ]}
 *   onChangeView={(date) => console.log("Viewing:", date)}
 *   onClickDate={(date) => console.log("Date clicked:", date)}
 * />
 *
 * @example
 * // With blocked timestamps
 * <FullCalendar
 *   defaultValue={new Date()}
 *   blockedTimestamps={[
 *     {
 *       initialDate: new Date(2026, 5, 22, 12, 0),
 *       endDate: new Date(2026, 5, 22, 13, 0),
 *     },
 *   ]}
 * />
 */
function FullCalendar(props: FullCalendarProps) {
  const [viewType, setViewType] = useState<"day" | "week" | "month">("month");

  return (
    <FullCalendarProvider
      events={props.events || []}
      viewValue={props.viewValue}
      defaultViewValue={props.defaultViewValue}
      onChangeView={props.onChangeView}
      blockedTimestamps={props.blockedTimestamps || []}
      onClickDate={props.onClickDate}
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
