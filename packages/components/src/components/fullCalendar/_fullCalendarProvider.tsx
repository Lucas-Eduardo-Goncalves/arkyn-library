import { createContext, useContext, useState, type ReactNode } from "react";
import {
  ViewService,
  type FullCalendarMatrix,
  type FullCalendarWeekMatrix,
} from "./_viewService";

type FullCalendarEvent = {
  initialDate: Date;
  endDate?: Date;
  title: string;
  data?: any;
  scheme?: "primary" | "success" | "warning" | "danger" | "info";
  onClick?: (data: any) => void;
};

type BlockTimestamp = {
  initialDate: Date;
  endDate: Date;
};

type FullCalendarContextProps = {
  events: FullCalendarEvent[];
  blockedTimestamps: BlockTimestamp[];
  viewDate: Date;
  listHours: number[];
  listWeek: string[];
  listMonthlyMatrix: FullCalendarMatrix;
  listWeeklyMatrix: FullCalendarWeekMatrix;
  nextMonth: () => void;
  nextWeek: () => void;
  nextDay: () => void;
  previousMonth: () => void;
  previousWeek: () => void;
  previousDay: () => void;
  onClickDate?: (date: Date) => void;
};

type FullCalendarProviderProps = {
  events: FullCalendarEvent[];
  blockedTimestamps: BlockTimestamp[];
  children: ReactNode;
  language?: string;
  value?: Date;
  defaultValue?: Date;
  onChangeView?: (date: Date) => void;
  onClickDate?: (date: Date) => void;
};

const FullCalendarContext = createContext({} as FullCalendarContextProps);

function useFullCalendar() {
  return useContext(FullCalendarContext);
}

function FullCalendarProvider(props: FullCalendarProviderProps) {
  const {
    blockedTimestamps,
    children,
    events,
    defaultValue = new Date(),
    language = "pt-BR",
    onChangeView,
    onClickDate,
    value,
  } = props;

  const viewService = new ViewService();
  const listHours = viewService.listHours([8, 18]);

  const [rawViewDate, rawSetViewDate] = useState(defaultValue);
  const viewDate = value || rawViewDate;

  function setViewDate(date: Date) {
    if (onChangeView) onChangeView(date);
    rawSetViewDate(date);
  }

  return (
    <FullCalendarContext.Provider
      value={{
        events,
        blockedTimestamps,
        viewDate,
        listHours,
        listWeek: viewService.listWeek(viewDate, language),
        listMonthlyMatrix: viewService.listMonthlyMatrix(viewDate),
        listWeeklyMatrix: viewService.listWeeklyMatrix(viewDate, listHours),
        nextMonth: () => viewService.nextMonth(viewDate, setViewDate),
        nextWeek: () => viewService.nextWeek(viewDate, setViewDate),
        nextDay: () => viewService.nextDay(viewDate, setViewDate),
        previousMonth: () => viewService.previousMonth(viewDate, setViewDate),
        previousWeek: () => viewService.previousWeek(viewDate, setViewDate),
        previousDay: () => viewService.previousDay(viewDate, setViewDate),
        onClickDate,
      }}
    >
      {children}
    </FullCalendarContext.Provider>
  );
}

export { FullCalendarProvider, useFullCalendar };
