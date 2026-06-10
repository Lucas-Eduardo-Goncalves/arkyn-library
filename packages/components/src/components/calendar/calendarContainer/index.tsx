import type { ReactNode } from "react";
import "./styles.css";

type CalendarContainerProps = {
  children?: ReactNode;
};

function CalendarContainer({ children }: CalendarContainerProps) {
  return <div className={`arkynCalendarContainer`}>{children}</div>;
}

export { CalendarContainer };
