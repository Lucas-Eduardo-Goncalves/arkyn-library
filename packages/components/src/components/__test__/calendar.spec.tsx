import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Calendar } from "../index";

function getDayCell(container: HTMLElement, day: number, owner = "current") {
	const cells = Array.from(
		container.querySelectorAll(`td.${owner}`),
	) as HTMLElement[];
	return cells.find(
		(cell) => cell.querySelector("p")?.textContent === String(day),
	);
}

function getDisplayedMonthLabel(viewDate: Date) {
	const formatter = new Intl.DateTimeFormat("pt-BR", { month: "long" });
	const shiftedMonth = new Date(
		viewDate.getFullYear(),
		viewDate.getMonth() + 1,
		1,
	);
	const label = formatter.format(shiftedMonth);
	return label.charAt(0).toUpperCase() + label.slice(1);
}

describe("Calendar", () => {
	afterEach(() => {
		cleanup();
	});

	it("should render without errors", () => {
		const { container } = render(<Calendar type="single" />);

		expect(
			container.querySelector(".arkynCalendarContainer"),
		).toBeInTheDocument();
	});

	it("should render the table structure with header and body", () => {
		const { container } = render(<Calendar type="single" />);

		expect(
			container.querySelector(".arkynCalendarTableContainer"),
		).toBeInTheDocument();
		expect(
			container.querySelector(".arkynCalendarTableHeader"),
		).toBeInTheDocument();
		expect(
			container.querySelector(".arkynCalendarTableBody"),
		).toBeInTheDocument();
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(<Calendar type="single" />);

		expect(container.querySelector(".arkynCalendarHeader")).toBeInTheDocument();
		expect(container.querySelectorAll("td").length).toBeGreaterThan(0);
	});

	it("should render correctly with all single-mode properties filled", () => {
		const onChange = vi.fn();
		const onChangeView = vi.fn();
		const viewValue = new Date(2026, 5, 15);

		render(
			<Calendar
				type="single"
				variant="complete"
				defaultValue={viewValue}
				viewValue={viewValue}
				onChange={onChange}
				onChangeView={onChangeView}
			/>,
		);

		expect(
			screen.getByText(getDisplayedMonthLabel(viewValue)),
		).toBeInTheDocument();
		expect(screen.getByText("2026")).toBeInTheDocument();
	});

	it("should render correctly with all range-mode properties filled", () => {
		const onChange = vi.fn();
		const onChangeView = vi.fn();
		const viewValue = new Date(2026, 5, 1);

		render(
			<Calendar
				type="range"
				variant="complete"
				defaultValue={[new Date(2026, 5, 1), new Date(2026, 5, 15)]}
				viewValue={viewValue}
				onChange={onChange}
				onChangeView={onChangeView}
			/>,
		);

		expect(
			screen.getByText(getDisplayedMonthLabel(viewValue)),
		).toBeInTheDocument();
		expect(screen.getByText("2026")).toBeInTheDocument();
	});

	describe("initial rendered month/date", () => {
		it("should render the week day headers", () => {
			const { container } = render(<Calendar type="single" />);

			const header = container.querySelector(
				".arkynCalendarTableHeader",
			) as HTMLElement;
			const ths = within(header).getAllByRole("columnheader");
			expect(ths).toHaveLength(7);
			expect(ths[0]).toHaveTextContent("Dom.");
		});

		it("should render the month/year selects reflecting the default view (current date)", () => {
			render(<Calendar type="single" />);

			const now = new Date();

			expect(screen.getByText(getDisplayedMonthLabel(now))).toBeInTheDocument();
			expect(screen.getByText(String(now.getFullYear()))).toBeInTheDocument();
		});

		it("should render the viewValue month/year when controlled", () => {
			const viewValue = new Date(2020, 0, 10);
			render(<Calendar type="single" viewValue={viewValue} />);

			expect(
				screen.getByText(getDisplayedMonthLabel(viewValue)),
			).toBeInTheDocument();
			expect(screen.getByText("2020")).toBeInTheDocument();
		});

		it("should render the defaultViewValue month/year when uncontrolled", () => {
			const defaultViewValue = new Date(2021, 8, 5);
			render(<Calendar type="single" defaultViewValue={defaultViewValue} />);

			expect(
				screen.getByText(getDisplayedMonthLabel(defaultViewValue)),
			).toBeInTheDocument();
			expect(screen.getByText("2021")).toBeInTheDocument();
		});

		it("should render a full 5-week (35-cell) month matrix for June 2026", () => {
			const { container } = render(
				<Calendar type="single" viewValue={new Date(2026, 5, 1)} />,
			);

			expect(container.querySelectorAll("td")).toHaveLength(35);
		});

		it("should render a 6-week (42-cell) month matrix when the month spans 6 weeks", () => {
			const { container } = render(
				<Calendar type="single" viewValue={new Date(2026, 7, 1)} />,
			);

			expect(container.querySelectorAll("td")).toHaveLength(42);
		});

		it("should mark days from the previous and next month with owner classes", () => {
			const { container } = render(
				<Calendar type="single" viewValue={new Date(2026, 5, 1)} />,
			);

			expect(container.querySelectorAll("td.previous").length).toBeGreaterThan(
				0,
			);
			expect(container.querySelectorAll("td.next").length).toBeGreaterThan(0);
			expect(container.querySelectorAll("td.current").length).toBe(30);
		});

		it("should mark today's cell with the 'today' class", () => {
			const today = new Date();
			const { container } = render(
				<Calendar type="single" viewValue={today} />,
			);

			const todayCell = getDayCell(container, today.getDate());
			expect(todayCell).toHaveClass("today");
		});
	});

	describe("type prop", () => {
		it("should render in single mode selecting only one day as checked", () => {
			const { container } = render(
				<Calendar
					type="single"
					viewValue={new Date(2026, 5, 1)}
					defaultValue={new Date(2026, 5, 10)}
				/>,
			);

			const checkedCells = container.querySelectorAll("td.checkedDay");
			expect(checkedCells).toHaveLength(1);
			expect(checkedCells[0].querySelector("p")).toHaveTextContent("10");
		});

		it("should render in range mode marking start, end and middle days", () => {
			const { container } = render(
				<Calendar
					type="range"
					viewValue={new Date(2026, 5, 1)}
					defaultValue={[new Date(2026, 5, 5), new Date(2026, 5, 10)]}
				/>,
			);

			const checkedCells = container.querySelectorAll("td.checkedDay");
			const middleCells = container.querySelectorAll("td.middleDay");
			expect(checkedCells).toHaveLength(2);
			expect(middleCells).toHaveLength(4);
		});
	});

	describe("variant prop", () => {
		it("should default to 'complete' variant showing month/year selects when omitted", () => {
			const { container } = render(<Calendar type="single" />);

			expect(
				container.querySelector(".calendarMonthSelect"),
			).toBeInTheDocument();
			expect(
				container.querySelector(".calendarYearSelect"),
			).toBeInTheDocument();
		});

		it("should render 'complete' variant explicitly with navigation arrows and selects", () => {
			const { container } = render(
				<Calendar type="single" variant="complete" />,
			);

			const buttons = container.querySelectorAll(".arkynCalendarButton");
			expect(buttons).toHaveLength(2);
			expect(
				container.querySelector(".calendarMonthSelect"),
			).toBeInTheDocument();
		});

		it("should render 'basic' variant with only prev/next buttons and a date label", () => {
			const { container } = render(<Calendar type="single" variant="basic" />);

			const buttons = container.querySelectorAll(".arkynCalendarButton");
			expect(buttons).toHaveLength(2);
			expect(
				container.querySelector(".calendarMonthSelect"),
			).not.toBeInTheDocument();
			expect(
				container.querySelector(".calendarYearSelect"),
			).not.toBeInTheDocument();
		});

		it("should render the basic header date label in MM/YYYY format", () => {
			render(
				<Calendar
					type="single"
					variant="basic"
					viewValue={new Date(2026, 5, 15)}
				/>,
			);

			expect(screen.getByText("06/2026")).toBeInTheDocument();
		});
	});

	describe("navigation between months", () => {
		it("should go to the next month when the next button is clicked", async () => {
			const user = userEvent.setup();
			const onChangeView = vi.fn();
			render(
				<Calendar
					type="single"
					variant="basic"
					viewValue={undefined}
					defaultViewValue={new Date(2026, 5, 15)}
					onChangeView={onChangeView}
				/>,
			);

			const buttons = screen.getAllByRole("button");
			await user.click(buttons[1]);

			expect(onChangeView).toHaveBeenCalledTimes(1);
			const calledDate = onChangeView.mock.calls[0][0] as Date;
			expect(calledDate.getMonth()).toBe(6);
			expect(calledDate.getFullYear()).toBe(2026);
			expect(screen.getByText("07/2026")).toBeInTheDocument();
		});

		it("should go to the previous month when the previous button is clicked", async () => {
			const user = userEvent.setup();
			const onChangeView = vi.fn();
			render(
				<Calendar
					type="single"
					variant="basic"
					defaultViewValue={new Date(2026, 5, 15)}
					onChangeView={onChangeView}
				/>,
			);

			const buttons = screen.getAllByRole("button");
			await user.click(buttons[0]);

			expect(onChangeView).toHaveBeenCalledTimes(1);
			const calledDate = onChangeView.mock.calls[0][0] as Date;
			expect(calledDate.getMonth()).toBe(4);
			expect(screen.getByText("05/2026")).toBeInTheDocument();
		});

		it("should not call onChangeView until navigation happens", () => {
			const onChangeView = vi.fn();
			render(
				<Calendar
					type="single"
					variant="basic"
					defaultViewValue={new Date(2026, 5, 15)}
					onChangeView={onChangeView}
				/>,
			);

			expect(onChangeView).not.toHaveBeenCalled();
		});

		it("should navigate months via the month select in complete variant", async () => {
			const user = userEvent.setup();
			const onChangeView = vi.fn();
			const { container } = render(
				<Calendar
					type="single"
					variant="complete"
					defaultViewValue={new Date(2026, 5, 15)}
					onChangeView={onChangeView}
				/>,
			);

			const monthSelectContainer = container.querySelector(
				".calendarMonthSelect .arkynSelectContainer",
			) as HTMLElement;
			await user.click(monthSelectContainer);

			const option = within(monthSelectContainer).getByText("Janeiro");
			await user.click(option);

			expect(onChangeView).toHaveBeenCalledTimes(1);
			const calledDate = onChangeView.mock.calls[0][0] as Date;
			expect(calledDate.getMonth()).toBe(0);
		});

		it("should navigate years via the year select in complete variant", async () => {
			const user = userEvent.setup();
			const onChangeView = vi.fn();
			const { container } = render(
				<Calendar
					type="single"
					variant="complete"
					defaultViewValue={new Date(2026, 5, 15)}
					onChangeView={onChangeView}
				/>,
			);

			const yearSelectContainer = container.querySelector(
				".calendarYearSelect .arkynSelectContainer",
			) as HTMLElement;
			await user.click(yearSelectContainer);

			const option = within(yearSelectContainer).getByText("2020");
			await user.click(option);

			expect(onChangeView).toHaveBeenCalledTimes(1);
			const calledDate = onChangeView.mock.calls[0][0] as Date;
			expect(calledDate.getFullYear()).toBe(2020);
		});

		it("should not move the view when the calendar is controlled via viewValue", async () => {
			const user = userEvent.setup();
			const onChangeView = vi.fn();
			render(
				<Calendar
					type="single"
					variant="basic"
					viewValue={new Date(2026, 5, 15)}
					onChangeView={onChangeView}
				/>,
			);

			const buttons = screen.getAllByRole("button");
			await user.click(buttons[1]);

			expect(onChangeView).toHaveBeenCalledTimes(1);
			expect(screen.getByText("06/2026")).toBeInTheDocument();
		});
	});

	describe("selecting a date (single mode)", () => {
		it("should call onChange with the selected date when a day is clicked", async () => {
			const user = userEvent.setup();
			const onChange = vi.fn();
			const { container } = render(
				<Calendar
					type="single"
					viewValue={new Date(2026, 5, 1)}
					onChange={onChange}
				/>,
			);

			const dayCell = getDayCell(container, 10) as HTMLElement;
			await user.click(dayCell);

			expect(onChange).toHaveBeenCalledTimes(1);
			const calledDate = onChange.mock.calls[0][0] as Date;
			expect(calledDate.getDate()).toBe(10);
			expect(calledDate.getMonth()).toBe(5);
			expect(calledDate.getFullYear()).toBe(2026);
		});

		it("should visually mark the clicked day as checked when uncontrolled", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Calendar type="single" defaultViewValue={new Date(2026, 5, 1)} />,
			);

			const dayCell = getDayCell(container, 20) as HTMLElement;
			await user.click(dayCell);

			expect(dayCell).toHaveClass("checkedDay");
		});

		it("should not update the visual selection when value is controlled externally", async () => {
			const user = userEvent.setup();
			const onChange = vi.fn();
			const { container } = render(
				<Calendar
					type="single"
					viewValue={new Date(2026, 5, 1)}
					value={new Date(2026, 5, 5)}
					onChange={onChange}
				/>,
			);

			const dayCell = getDayCell(container, 20) as HTMLElement;
			await user.click(dayCell);

			expect(onChange).toHaveBeenCalledTimes(1);
			expect(dayCell).not.toHaveClass("checkedDay");
			const originalSelected = getDayCell(container, 5) as HTMLElement;
			expect(originalSelected).toHaveClass("checkedDay");
		});

		it("should call onChangeView alongside onChange when a day from another month is clicked", async () => {
			const user = userEvent.setup();
			const onChange = vi.fn();
			const onChangeView = vi.fn();
			const { container } = render(
				<Calendar
					type="single"
					defaultViewValue={new Date(2026, 5, 15)}
					onChange={onChange}
					onChangeView={onChangeView}
				/>,
			);

			const nextMonthCell = container.querySelector("td.next") as HTMLElement;
			await user.click(nextMonthCell);

			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChangeView).toHaveBeenCalledTimes(1);
		});
	});

	describe("selecting a date (range mode)", () => {
		it("should call onChange with a [start, end] tuple when extending the range", async () => {
			const user = userEvent.setup();
			const onChange = vi.fn();
			const { container } = render(
				<Calendar
					type="range"
					viewValue={new Date(2026, 5, 1)}
					defaultValue={[new Date(2026, 5, 5), new Date(2026, 5, 10)]}
					onChange={onChange}
				/>,
			);

			const dayCell = getDayCell(container, 15) as HTMLElement;
			await user.click(dayCell);

			expect(onChange).toHaveBeenCalledTimes(1);
			const [start, end] = onChange.mock.calls[0][0] as [Date, Date];
			expect(start.getDate()).toBe(5);
			expect(end.getDate()).toBe(15);
		});

		it("should collapse the range to a single day when clicking the current start day", async () => {
			const user = userEvent.setup();
			const onChange = vi.fn();
			const { container } = render(
				<Calendar
					type="range"
					viewValue={new Date(2026, 5, 1)}
					defaultValue={[new Date(2026, 5, 5), new Date(2026, 5, 10)]}
					onChange={onChange}
				/>,
			);

			const dayCell = getDayCell(container, 5) as HTMLElement;
			await user.click(dayCell);

			expect(onChange).toHaveBeenCalledTimes(1);
			const [start, end] = onChange.mock.calls[0][0] as [Date, Date];
			expect(start.getDate()).toBe(5);
			expect(end.getDate()).toBe(5);
		});

		it("should extend the start when clicking a day before the current range", async () => {
			const user = userEvent.setup();
			const onChange = vi.fn();
			const { container } = render(
				<Calendar
					type="range"
					viewValue={new Date(2026, 5, 1)}
					defaultValue={[new Date(2026, 5, 5), new Date(2026, 5, 10)]}
					onChange={onChange}
				/>,
			);

			const dayCell = getDayCell(container, 1) as HTMLElement;
			await user.click(dayCell);

			expect(onChange).toHaveBeenCalledTimes(1);
			const [start, end] = onChange.mock.calls[0][0] as [Date, Date];
			expect(start.getDate()).toBe(1);
			expect(end.getDate()).toBe(10);
		});
	});

	describe("value prop (controlled)", () => {
		it("should mark the given single value date as checked", () => {
			const { container } = render(
				<Calendar
					type="single"
					viewValue={new Date(2026, 5, 1)}
					value={new Date(2026, 5, 20)}
				/>,
			);

			const dayCell = getDayCell(container, 20) as HTMLElement;
			expect(dayCell).toHaveClass("checkedDay");
		});

		it("should mark the given range value as checked/middle days", () => {
			const { container } = render(
				<Calendar
					type="range"
					viewValue={new Date(2026, 5, 1)}
					value={[new Date(2026, 5, 3), new Date(2026, 5, 6)]}
				/>,
			);

			expect(container.querySelectorAll("td.checkedDay")).toHaveLength(2);
			expect(container.querySelectorAll("td.middleDay")).toHaveLength(2);
		});
	});

	describe("defaultValue prop (uncontrolled)", () => {
		it("should mark the defaultValue single date as checked initially", () => {
			const { container } = render(
				<Calendar
					type="single"
					viewValue={new Date(2026, 5, 1)}
					defaultValue={new Date(2026, 5, 8)}
				/>,
			);

			const dayCell = getDayCell(container, 8) as HTMLElement;
			expect(dayCell).toHaveClass("checkedDay");
		});

		it("should default to today when defaultValue is omitted (single)", () => {
			const today = new Date();
			const { container } = render(
				<Calendar type="single" viewValue={today} />,
			);

			const dayCell = getDayCell(container, today.getDate()) as HTMLElement;
			expect(dayCell).toHaveClass("checkedDay");
		});

		it("should default to today for both range bounds when defaultValue is omitted (range)", () => {
			const today = new Date();
			const { container } = render(<Calendar type="range" viewValue={today} />);

			expect(container.querySelectorAll("td.checkedDay")).toHaveLength(1);
			const dayCell = getDayCell(container, today.getDate()) as HTMLElement;
			expect(dayCell).toHaveClass("checkedDay");
		});
	});

	describe("accessibility", () => {
		it("should render navigation buttons with type='button'", () => {
			render(<Calendar type="single" variant="basic" />);

			for (const button of screen.getAllByRole("button")) {
				expect(button).toHaveAttribute("type", "button");
			}
		});

		it("should render week day headers as columnheader roles", () => {
			render(<Calendar type="single" />);

			expect(screen.getAllByRole("columnheader")).toHaveLength(7);
		});

		it("should render the day grid as a table", () => {
			render(<Calendar type="single" />);

			expect(screen.getByRole("table")).toBeInTheDocument();
		});

		it("should support keyboard activation of navigation buttons", async () => {
			const user = userEvent.setup();
			const onChangeView = vi.fn();
			render(
				<Calendar
					type="single"
					variant="basic"
					defaultViewValue={new Date(2026, 5, 15)}
					onChangeView={onChangeView}
				/>,
			);

			const buttons = screen.getAllByRole("button");
			buttons[1].focus();
			await user.keyboard("{Enter}");

			expect(onChangeView).toHaveBeenCalledTimes(1);
		});
	});

	describe("edge cases", () => {
		it("should not throw when no callbacks are provided and a day is clicked", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Calendar type="single" viewValue={new Date(2026, 5, 1)} />,
			);

			const dayCell = getDayCell(container, 10) as HTMLElement;
			await expect(user.click(dayCell)).resolves.not.toThrow();
		});

		it("should handle leap-year February correctly", () => {
			const { container } = render(
				<Calendar type="single" viewValue={new Date(2024, 1, 1)} />,
			);

			expect(container.querySelectorAll("td.current")).toHaveLength(29);
		});

		it("should handle non-leap-year February correctly", () => {
			const { container } = render(
				<Calendar type="single" viewValue={new Date(2026, 1, 1)} />,
			);

			expect(container.querySelectorAll("td.current")).toHaveLength(28);
		});

		it("should handle December to January month rollover on next button", async () => {
			const user = userEvent.setup();
			const onChangeView = vi.fn();
			render(
				<Calendar
					type="single"
					variant="basic"
					defaultViewValue={new Date(2026, 11, 15)}
					onChangeView={onChangeView}
				/>,
			);

			const buttons = screen.getAllByRole("button");
			await user.click(buttons[1]);

			const calledDate = onChangeView.mock.calls[0][0] as Date;
			expect(calledDate.getMonth()).toBe(0);
			expect(calledDate.getFullYear()).toBe(2027);
		});

		it("should handle January to December month rollback on previous button", async () => {
			const user = userEvent.setup();
			const onChangeView = vi.fn();
			render(
				<Calendar
					type="single"
					variant="basic"
					defaultViewValue={new Date(2026, 0, 15)}
					onChangeView={onChangeView}
				/>,
			);

			const buttons = screen.getAllByRole("button");
			await user.click(buttons[0]);

			const calledDate = onChangeView.mock.calls[0][0] as Date;
			expect(calledDate.getMonth()).toBe(11);
			expect(calledDate.getFullYear()).toBe(2025);
		});
	});

	describe("type + variant interaction", () => {
		it("should render range mode with basic variant (simplified header, range selection)", async () => {
			const user = userEvent.setup();
			const onChange = vi.fn();
			const { container } = render(
				<Calendar
					type="range"
					variant="basic"
					viewValue={new Date(2026, 5, 1)}
					defaultValue={[new Date(2026, 5, 5), new Date(2026, 5, 10)]}
					onChange={onChange}
				/>,
			);

			expect(
				container.querySelector(".calendarMonthSelect"),
			).not.toBeInTheDocument();

			const dayCell = getDayCell(container, 15) as HTMLElement;
			await user.click(dayCell);

			expect(onChange).toHaveBeenCalledTimes(1);
			expect(Array.isArray(onChange.mock.calls[0][0])).toBe(true);
		});
	});
});
