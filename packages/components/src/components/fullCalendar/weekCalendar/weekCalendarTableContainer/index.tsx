import type { ReactNode } from "react";
import "./styles.css";

type WeekCalendarTableContainerProps = {
  children: ReactNode;
};

function WeekCalendarTableContainer({
  children,
}: WeekCalendarTableContainerProps) {
  return (
    <div className="arkynWeekCalendarTableContainer">
      <table>{children}</table>
    </div>
  );
}

export { WeekCalendarTableContainer };
