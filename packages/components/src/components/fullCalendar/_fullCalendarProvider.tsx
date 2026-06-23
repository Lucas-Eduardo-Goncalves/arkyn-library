import { createContext, useContext, useState, type ReactNode } from "react";
import {
  ViewService,
  type FullCalendarMatrix,
  type FullCalendarWeekMatrix,
} from "./_viewService";

type FullCalendarEvent = {
  date: Date;
  endDate?: Date;
  title: string;
  data?: any;
  scheme?: "primary" | "success" | "warning" | "danger" | "info";
  onClick?: (data: any) => void;
};

type FullCalendarContextProps = {
  events: FullCalendarEvent[];
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
};

type FullCalendarProviderProps = {
  events: FullCalendarEvent[];
  children: ReactNode;
  language?: string;
  defaultValue?: Date;
  onChangeView?: (date: Date) => void;
};

const FullCalendarContext = createContext({} as FullCalendarContextProps);

function useFullCalendar() {
  return useContext(FullCalendarContext);
}

function FullCalendarProvider(props: FullCalendarProviderProps) {
  const language = props.language || "pt-BR";
  const viewService = new ViewService();
  const listHours = viewService.listHours([8, 18]);

  const [viewDate, rawSetViewDate] = useState(props.defaultValue || new Date());

  function setViewDate(date: Date) {
    if (props.onChangeView) props.onChangeView(date);
    rawSetViewDate(date);
  }

  return (
    <FullCalendarContext.Provider
      value={{
        events: props.events,
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
      }}
    >
      {props.children}
    </FullCalendarContext.Provider>
  );
}

export { FullCalendarProvider, useFullCalendar };
