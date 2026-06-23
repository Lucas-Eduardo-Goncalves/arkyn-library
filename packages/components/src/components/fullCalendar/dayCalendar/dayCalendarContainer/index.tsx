import type { ReactNode } from "react";
import "./styles.css";

type DayCalendarContainerProps = {
  children: ReactNode;
};

function DayCalendarContainer({ children }: DayCalendarContainerProps) {
  return <div className="arkynDayCalendarContainer">{children}</div>;
}

export { DayCalendarContainer };
