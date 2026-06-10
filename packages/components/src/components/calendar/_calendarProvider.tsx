import { createContext, useContext, useState, type ReactNode } from "react";
import { ViewService, type CalendarMatrix } from "./_viewService";

type CalendarContextProps = {
  valueDate: Date[];
  viewDate: Date;
  currentDate: string;
  currentDay: string;
  currentMonth: string;
  currentYear: string;
  listWeek: string[];
  listMonths: { label: string; value: string }[];
  listYears: { label: string; value: string }[];
  listMatrix: CalendarMatrix;
  changeDay: (day: number, month: number, year: number) => void;
  changeMonth: (month: number) => void;
  changeYear: (year: number) => void;
  nextMonth: () => void;
  previousMonth: () => void;
};

type SingleCalendarProviderProps = {
  children: ReactNode;
  calendarType: "single";
  language?: string;
  onChangeView?: (date: Date) => void;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
};

type RangeCalendarProviderProps = {
  children: ReactNode;
  calendarType: "range";
  language?: string;
  onChangeView?: (date: Date) => void;
  defaultValue?: [Date, Date];
  onChange?: (date: [Date, Date]) => void;
};

type CalendarProviderProps =
  | SingleCalendarProviderProps
  | RangeCalendarProviderProps;

const CalendarContext = createContext({} as CalendarContextProps);

function useCalendar() {
  return useContext(CalendarContext);
}

function CalendarProvider(props: CalendarProviderProps) {
  const language = props.language || "pt-BR";

  const defaultValue: [Date, Date] =
    props.calendarType === "single"
      ? [props.defaultValue || new Date(), props.defaultValue || new Date()]
      : props.defaultValue || [new Date(), new Date()];

  const [viewDate, rawSetViewDate] = useState(new Date());
  const [valueDate, rawSetValueDate] = useState<[Date, Date]>(defaultValue);

  const viewService = new ViewService();

  function setValueDate(value: [Date, Date]) {
    const normalizedValue: [Date, Date] = [
      new Date(value[0]),
      new Date(value[1]),
    ];

    if (props.onChange && props.calendarType === "range") {
      props.onChange(normalizedValue);
    }

    if (props.onChange && props.calendarType === "single") {
      props.onChange(normalizedValue[0]);
    }

    rawSetValueDate(normalizedValue);
  }

  function setViewDate(date: Date) {
    if (props.onChangeView) props.onChangeView(date);
    rawSetViewDate(date);
  }

  return (
    <CalendarContext.Provider
      value={{
        valueDate,
        viewDate,
        currentDate: viewDate.toLocaleDateString(language).slice(3),
        currentDay: viewService.currentDay(viewDate),
        currentMonth: viewService.currentMonth(viewDate),
        currentYear: viewService.currentYear(viewDate),
        listWeek: viewService.listWeek(language),
        listMonths: viewService.listMonths(viewDate, language),
        listYears: viewService.listYears(100),
        listMatrix: viewService.listMatrix(viewDate, valueDate),
        changeDay: (day, month, year) =>
          viewService.changeDay(
            day,
            month,
            year,
            props.calendarType,
            valueDate,
            setValueDate,
            setViewDate,
          ),
        changeMonth: (month) =>
          viewService.changeMonth(month, viewDate, setViewDate),
        changeYear: (year) =>
          viewService.changeYear(year, viewDate, setViewDate),
        nextMonth: () => viewService.nextMonth(viewDate, setViewDate),
        previousMonth: () => viewService.previousMonth(viewDate, setViewDate),
      }}
    >
      {props.children}
    </CalendarContext.Provider>
  );
}

export { CalendarProvider, useCalendar };
