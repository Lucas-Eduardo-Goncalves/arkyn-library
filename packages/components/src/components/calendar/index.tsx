import { CalendarProvider } from "./_calendarProvider";
import { CalendarContainer } from "./calendarContainer";
import { CalendarHeader } from "./calendarHeader";
import { CalendarTableBody } from "./calendarTableBody";
import { CalendarTableContainer } from "./calendarTableContainer";
import { CalendarTableHeader } from "./calendarTableHeader";

/**
 * Props for Calendar single-date selection mode.
 */
type SingleCalendarProps = {
  /** Sets single-date selection mode. */
  type: "single";
  /**
   * Defines the visual/behavioral variant.
   * - `basic`: simplified header.
   * - `complete`: full navigation experience.
   *
   * @default "complete"
   */
  variant?: "basic" | "complete";
  /** Initial selected date. */
  defaultValue?: Date;
  /** Callback fired when the selected date changes. */
  onChange?: (date: Date) => void;
  /** Callback fired when the view (month/year) changes. */
  onChangeView?: (date: Date) => void;
};

/**
 * Props for Calendar range selection mode.
 */
type RangeCalendarProps = {
  /** Sets range selection mode. */
  type: "range";
  /**
   * Defines the visual/behavioral variant.
   * - `basic`: simplified header.
   * - `complete`: full navigation experience.
   *
   * @default "complete"
   */
  variant?: "basic" | "complete";
  /** Initial selected range in `[start, end]` format. */
  defaultValue?: [Date, Date];
  /** Callback fired when the selected range changes. */
  onChange?: (date: [Date, Date]) => void;
  /** Callback fired when the view (month/year) changes. */
  onChangeView?: (date: Date) => void;
};

/**
 * Discriminated union of Calendar props.
 */
type CalendarProps = SingleCalendarProps | RangeCalendarProps;

/**
 * Reusable calendar component with support for two selection modes:
 * single date (`single`) and range (`range`).
 *
 * The component encapsulates calendar state and navigation rules through
 * `CalendarProvider`, exposing a simple API for forms, filters,
 * and scheduling flows.
 *
 * @param props Calendar properties (`single` or `range` mode).
 * @returns Calendar UI structure with header and date grid.
 *
 * @example
 * // Single-date selection
 * <Calendar
 *   type="single"
 *   variant="complete"
 *   defaultValue={new Date()}
 *   onChange={(date) => {
 *     console.log("Selected date:", date);
 *   }}
 *   onChangeView={(viewDate) => {
 *     console.log("Current view:", viewDate);
 *   }}
 * />
 *
 * @example
 * // Range selection
 * <Calendar
 *   type="range"
 *   variant="basic"
 *   defaultValue={[new Date(2026, 5, 1), new Date(2026, 5, 15)]}
 *   onChange={([start, end]) => {
 *     console.log("Range:", start, end);
 *   }}
 *   onChangeView={(viewDate) => {
 *     console.log("Focused month:", viewDate);
 *   }}
 * />
 */
function Calendar(props: CalendarProps) {
  const variant = props.variant || "complete";

  if (props.type === "range") {
    return (
      <CalendarProvider
        defaultValue={props.defaultValue}
        calendarType="range"
        onChange={props.onChange}
        onChangeView={props.onChangeView}
      >
        <CalendarContainer>
          <CalendarHeader basicMode={variant.includes("basic")} />
          <CalendarTableContainer>
            <CalendarTableHeader />
            <CalendarTableBody />
          </CalendarTableContainer>
        </CalendarContainer>
      </CalendarProvider>
    );
  }

  return (
    <CalendarProvider
      defaultValue={props.defaultValue}
      calendarType="single"
      onChange={props.onChange}
      onChangeView={props.onChangeView}
    >
      <CalendarContainer>
        <CalendarHeader basicMode={variant.includes("basic")} />
        <CalendarTableContainer>
          <CalendarTableHeader />
          <CalendarTableBody />
        </CalendarTableContainer>
      </CalendarContainer>
    </CalendarProvider>
  );
}

export { Calendar };
