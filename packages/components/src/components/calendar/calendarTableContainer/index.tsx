import type { ReactNode } from "react";
import "./styles.css";

type CalendarTableContainerProps = {
  children: ReactNode;
};

function CalendarTableContainer({ children }: CalendarTableContainerProps) {
  return <table className="arkynCalendarTableContainer">{children}</table>;
}

export { CalendarTableContainer };
