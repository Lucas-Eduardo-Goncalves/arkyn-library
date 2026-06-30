import { ChevronLeft, ChevronRight } from "lucide-react";

import { CardTabButton } from "../../cardTab/cardTabButton";
import { CardTabContainer } from "../../cardTab/cardTabContainer";
import { IconButton } from "../../iconButton";

import { useFullCalendar } from "../_fullCalendarProvider";
import "./styles.css";

type FullCalendarHeaderProps = {
	viewType: "day" | "week" | "month";
	setViewType: (viewType: "day" | "week" | "month") => void;
};

function FullCalendarHeader(props: FullCalendarHeaderProps) {
	const { setViewType, viewType } = props;
	const fullCalendar = useFullCalendar();

	function handlePrevious() {
		switch (viewType) {
			case "day":
				return fullCalendar.previousDay();
			case "week":
				return fullCalendar.previousWeek();
			case "month":
				return fullCalendar.previousMonth();
		}
	}

	function handleNext() {
		switch (viewType) {
			case "day":
				return fullCalendar.nextDay();
			case "week":
				return fullCalendar.nextWeek();
			case "month":
				return fullCalendar.nextMonth();
		}
	}

	return (
		<div className="arkynFullCalendarHeader">
			<CardTabContainer
				defaultValue={viewType}
				onChange={(value) => setViewType(value as "day" | "week" | "month")}
			>
				<CardTabButton value="day">Dia</CardTabButton>
				<CardTabButton value="week">Semana</CardTabButton>
				<CardTabButton value="month">Mês</CardTabButton>
			</CardTabContainer>

			<div className="arkynFullCalendarHeaderActions">
				<IconButton
					variant="outline"
					icon={ChevronLeft}
					aria-label="Handle previous"
					onClick={() => handlePrevious()}
				/>

				<p>
					{fullCalendar.viewDate.toLocaleDateString("pt-BR", {
						day: "2-digit",
						month: "long",
						year: "numeric",
					})}
				</p>

				<IconButton
					variant="outline"
					icon={ChevronRight}
					aria-label="Handle next"
					onClick={() => handleNext()}
				/>
			</div>
		</div>
	);
}

export { FullCalendarHeader };
