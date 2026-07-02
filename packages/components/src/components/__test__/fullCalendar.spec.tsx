import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FullCalendar } from "../fullCalendar";

function getMonthlyDayCell(
	container: HTMLElement,
	day: number,
	owner = "current",
) {
	const cells = Array.from(
		container.querySelectorAll(`td.arkynMonthlyCalendarTableTd.${owner}`),
	) as HTMLElement[];
	return cells.find(
		(cell) => cell.querySelector("p")?.textContent === String(day),
	);
}

async function switchView(
	user: ReturnType<typeof userEvent.setup>,
	label: string,
) {
	await user.click(screen.getByText(label));
}

describe("FullCalendar", () => {
	afterEach(() => {
		cleanup();
	});

	it("should render without errors", () => {
		const { container } = render(<FullCalendar />);

		expect(
			container.querySelector(".arkynFullCalendarContainer"),
		).toBeInTheDocument();
	});

	it("should render the header and month view by default when all optional properties are omitted", () => {
		const { container } = render(<FullCalendar />);

		expect(
			container.querySelector(".arkynFullCalendarHeader"),
		).toBeInTheDocument();
		expect(
			container.querySelector(".arkynMonthlyCalendarTableContainer"),
		).toBeInTheDocument();
		expect(
			container.querySelector(".arkynWeekCalendarTableContainer"),
		).not.toBeInTheDocument();
		expect(
			container.querySelector(".arkynDayCalendarContainer"),
		).not.toBeInTheDocument();
	});

	it("should render correctly with all properties filled", () => {
		const onChangeView = vi.fn();
		const onClickDate = vi.fn();
		const viewValue = new Date(2026, 5, 15);

		render(
			<FullCalendar
				viewValue={viewValue}
				defaultViewValue={viewValue}
				events={[
					{
						title: "Team standup",
						initialDate: new Date(2026, 5, 15, 9, 0),
						endDate: new Date(2026, 5, 15, 9, 30),
						scheme: "success",
						onClick: vi.fn(),
					},
				]}
				blockedTimestamps={[
					{
						initialDate: new Date(2026, 5, 20, 0, 0),
						endDate: new Date(2026, 5, 20, 23, 59),
					},
				]}
				onChangeView={onChangeView}
				onClickDate={onClickDate}
			/>,
		);

		expect(screen.getByText("15 de junho de 2026")).toBeInTheDocument();
		expect(screen.getByText("Team standup")).toBeInTheDocument();
	});

	describe("view switching (CardTab)", () => {
		it("should render the day, week and month tab buttons", () => {
			render(<FullCalendar />);

			expect(screen.getByText("Dia")).toBeInTheDocument();
			expect(screen.getByText("Semana")).toBeInTheDocument();
			expect(screen.getByText("Mês")).toBeInTheDocument();
		});

		it("should switch to day view when the 'Dia' tab is clicked", async () => {
			const user = userEvent.setup();
			const { container } = render(<FullCalendar />);

			await switchView(user, "Dia");

			expect(
				container.querySelector(".arkynDayCalendarContainer"),
			).toBeInTheDocument();
			expect(
				container.querySelector(".arkynMonthlyCalendarTableContainer"),
			).not.toBeInTheDocument();
			expect(
				container.querySelector(".arkynWeekCalendarTableContainer"),
			).not.toBeInTheDocument();
		});

		it("should switch to week view when the 'Semana' tab is clicked", async () => {
			const user = userEvent.setup();
			const { container } = render(<FullCalendar />);

			await switchView(user, "Semana");

			expect(
				container.querySelector(".arkynWeekCalendarTableContainer"),
			).toBeInTheDocument();
			expect(
				container.querySelector(".arkynMonthlyCalendarTableContainer"),
			).not.toBeInTheDocument();
			expect(
				container.querySelector(".arkynDayCalendarContainer"),
			).not.toBeInTheDocument();
		});

		it("should switch back to month view when the 'Mês' tab is clicked after another view", async () => {
			const user = userEvent.setup();
			const { container } = render(<FullCalendar />);

			await switchView(user, "Semana");
			await switchView(user, "Mês");

			expect(
				container.querySelector(".arkynMonthlyCalendarTableContainer"),
			).toBeInTheDocument();
			expect(
				container.querySelector(".arkynWeekCalendarTableContainer"),
			).not.toBeInTheDocument();
		});
	});

	describe("navigation (month view)", () => {
		it("should go to the next month when the next button is clicked", async () => {
			const user = userEvent.setup();
			const onChangeView = vi.fn();
			render(
				<FullCalendar
					defaultViewValue={new Date(2026, 5, 15)}
					onChangeView={onChangeView}
				/>,
			);

			await user.click(screen.getByLabelText("Handle next"));

			expect(onChangeView).toHaveBeenCalledTimes(1);
			const calledDate = onChangeView.mock.calls[0][0] as Date;
			expect(calledDate.getMonth()).toBe(6);
			expect(calledDate.getFullYear()).toBe(2026);
			expect(screen.getByText("15 de julho de 2026")).toBeInTheDocument();
		});

		it("should go to the previous month when the previous button is clicked", async () => {
			const user = userEvent.setup();
			const onChangeView = vi.fn();
			render(
				<FullCalendar
					defaultViewValue={new Date(2026, 5, 15)}
					onChangeView={onChangeView}
				/>,
			);

			await user.click(screen.getByLabelText("Handle previous"));

			expect(onChangeView).toHaveBeenCalledTimes(1);
			const calledDate = onChangeView.mock.calls[0][0] as Date;
			expect(calledDate.getMonth()).toBe(4);
			expect(screen.getByText("15 de maio de 2026")).toBeInTheDocument();
		});

		it("should not call onChangeView until navigation happens", () => {
			const onChangeView = vi.fn();
			render(
				<FullCalendar
					defaultViewValue={new Date(2026, 5, 15)}
					onChangeView={onChangeView}
				/>,
			);

			expect(onChangeView).not.toHaveBeenCalled();
		});

		it("should not move the view when the calendar is controlled via viewValue", async () => {
			const user = userEvent.setup();
			const onChangeView = vi.fn();
			render(
				<FullCalendar
					viewValue={new Date(2026, 5, 15)}
					onChangeView={onChangeView}
				/>,
			);

			await user.click(screen.getByLabelText("Handle next"));

			expect(onChangeView).toHaveBeenCalledTimes(1);
			expect(screen.getByText("15 de junho de 2026")).toBeInTheDocument();
		});

		it("should handle December to January month rollover on next button", async () => {
			const user = userEvent.setup();
			const onChangeView = vi.fn();
			render(
				<FullCalendar
					defaultViewValue={new Date(2026, 11, 15)}
					onChangeView={onChangeView}
				/>,
			);

			await user.click(screen.getByLabelText("Handle next"));

			const calledDate = onChangeView.mock.calls[0][0] as Date;
			expect(calledDate.getMonth()).toBe(0);
			expect(calledDate.getFullYear()).toBe(2027);
		});
	});

	describe("navigation (week view)", () => {
		it("should go to the next week when the next button is clicked in week view", async () => {
			const user = userEvent.setup();
			const onChangeView = vi.fn();
			render(
				<FullCalendar
					defaultViewValue={new Date(2026, 5, 1)}
					onChangeView={onChangeView}
				/>,
			);

			await switchView(user, "Semana");
			await user.click(screen.getByLabelText("Handle next"));

			expect(onChangeView).toHaveBeenCalledTimes(1);
			const calledDate = onChangeView.mock.calls[0][0] as Date;
			expect(calledDate.getDate()).toBe(8);
		});

		it("should go to the previous week when the previous button is clicked in week view", async () => {
			const user = userEvent.setup();
			const onChangeView = vi.fn();
			render(
				<FullCalendar
					defaultViewValue={new Date(2026, 5, 15)}
					onChangeView={onChangeView}
				/>,
			);

			await switchView(user, "Semana");
			await user.click(screen.getByLabelText("Handle previous"));

			expect(onChangeView).toHaveBeenCalledTimes(1);
			const calledDate = onChangeView.mock.calls[0][0] as Date;
			expect(calledDate.getDate()).toBe(8);
		});
	});

	describe("navigation (day view)", () => {
		it("should go to the next day when the next button is clicked in day view", async () => {
			const user = userEvent.setup();
			const onChangeView = vi.fn();
			render(
				<FullCalendar
					defaultViewValue={new Date(2026, 5, 15)}
					onChangeView={onChangeView}
				/>,
			);

			await switchView(user, "Dia");
			await user.click(screen.getByLabelText("Handle next"));

			expect(onChangeView).toHaveBeenCalledTimes(1);
			const calledDate = onChangeView.mock.calls[0][0] as Date;
			expect(calledDate.getDate()).toBe(16);
		});

		it("should go to the previous day when the previous button is clicked in day view", async () => {
			const user = userEvent.setup();
			const onChangeView = vi.fn();
			render(
				<FullCalendar
					defaultViewValue={new Date(2026, 5, 15)}
					onChangeView={onChangeView}
				/>,
			);

			await switchView(user, "Dia");
			await user.click(screen.getByLabelText("Handle previous"));

			expect(onChangeView).toHaveBeenCalledTimes(1);
			const calledDate = onChangeView.mock.calls[0][0] as Date;
			expect(calledDate.getDate()).toBe(14);
		});
	});

	describe("onClickDate (month view)", () => {
		it("should call onClickDate with the clicked date", async () => {
			const user = userEvent.setup();
			const onClickDate = vi.fn();
			const { container } = render(
				<FullCalendar
					viewValue={new Date(2026, 5, 1)}
					onClickDate={onClickDate}
				/>,
			);

			const dayCell = getMonthlyDayCell(container, 10) as HTMLElement;
			await user.click(dayCell);

			expect(onClickDate).toHaveBeenCalledTimes(1);
			const calledDate = onClickDate.mock.calls[0][0] as Date;
			expect(calledDate.getDate()).toBe(10);
			expect(calledDate.getMonth()).toBe(5);
			expect(calledDate.getFullYear()).toBe(2026);
		});

		it("should not call onClickDate when the date falls within blockedTimestamps", async () => {
			const user = userEvent.setup();
			const onClickDate = vi.fn();
			const { container } = render(
				<FullCalendar
					viewValue={new Date(2026, 5, 1)}
					blockedTimestamps={[
						{
							initialDate: new Date(2026, 5, 10, 0, 0),
							endDate: new Date(2026, 5, 10, 23, 59),
						},
					]}
					onClickDate={onClickDate}
				/>,
			);

			const dayCell = getMonthlyDayCell(container, 10) as HTMLElement;
			await user.click(dayCell);

			expect(onClickDate).not.toHaveBeenCalled();
			expect(dayCell).toHaveClass("blocked");
		});

		it("should not throw when onClickDate is omitted and a day is clicked", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<FullCalendar viewValue={new Date(2026, 5, 1)} />,
			);

			const dayCell = getMonthlyDayCell(container, 10) as HTMLElement;
			await expect(user.click(dayCell)).resolves.not.toThrow();
		});
	});

	describe("events prop", () => {
		it("should render an event on the correct day cell in month view", () => {
			const { container } = render(
				<FullCalendar
					viewValue={new Date(2026, 5, 1)}
					events={[
						{
							title: "Team standup",
							initialDate: new Date(2026, 5, 15, 9, 0),
						},
					]}
				/>,
			);

			const dayCell = getMonthlyDayCell(container, 15) as HTMLElement;
			expect(within(dayCell).getByText("Team standup")).toBeInTheDocument();
			expect(within(dayCell).getByText("9h")).toBeInTheDocument();
		});

		it("should render start and end hour when endDate is provided", () => {
			const { container } = render(
				<FullCalendar
					viewValue={new Date(2026, 5, 1)}
					events={[
						{
							title: "Team standup",
							initialDate: new Date(2026, 5, 15, 9, 0),
							endDate: new Date(2026, 5, 15, 9, 30),
						},
					]}
				/>,
			);

			const dayCell = getMonthlyDayCell(container, 15) as HTMLElement;
			expect(within(dayCell).getByText("9h - 9h30")).toBeInTheDocument();
		});

		it("should default the event scheme to 'primary' when omitted", () => {
			const { container } = render(
				<FullCalendar
					viewValue={new Date(2026, 5, 1)}
					events={[
						{
							title: "Team standup",
							initialDate: new Date(2026, 5, 15, 9, 0),
						},
					]}
				/>,
			);

			expect(
				container.querySelector(".arkynMonthlyCalendarEvent.primary"),
			).toBeInTheDocument();
		});

		it("should apply a custom scheme class to the event", () => {
			const { container } = render(
				<FullCalendar
					viewValue={new Date(2026, 5, 1)}
					events={[
						{
							title: "Team standup",
							initialDate: new Date(2026, 5, 15, 9, 0),
							scheme: "danger",
						},
					]}
				/>,
			);

			expect(
				container.querySelector(".arkynMonthlyCalendarEvent.danger"),
			).toBeInTheDocument();
			expect(
				container.querySelector(".arkynMonthlyCalendarEvent.primary"),
			).not.toBeInTheDocument();
		});

		it("should call the event's onClick with data when the event block is clicked", async () => {
			const user = userEvent.setup();
			const onEventClick = vi.fn();
			const onClickDate = vi.fn();
			const eventData = { id: 42 };

			render(
				<FullCalendar
					viewValue={new Date(2026, 5, 1)}
					onClickDate={onClickDate}
					events={[
						{
							title: "Team standup",
							initialDate: new Date(2026, 5, 15, 9, 0),
							data: eventData,
							onClick: onEventClick,
						},
					]}
				/>,
			);

			await user.click(screen.getByText("Team standup"));

			expect(onEventClick).toHaveBeenCalledTimes(1);
			expect(onEventClick).toHaveBeenCalledWith(eventData);
			expect(onClickDate).not.toHaveBeenCalled();
		});

		it("should not render any event block when events is an empty array", () => {
			const { container } = render(
				<FullCalendar viewValue={new Date(2026, 5, 1)} events={[]} />,
			);

			expect(
				container.querySelector(".arkynMonthlyCalendarEvent"),
			).not.toBeInTheDocument();
		});

		it("should render multiple events on the same day", () => {
			const { container } = render(
				<FullCalendar
					viewValue={new Date(2026, 5, 1)}
					events={[
						{ title: "Event A", initialDate: new Date(2026, 5, 15, 9, 0) },
						{ title: "Event B", initialDate: new Date(2026, 5, 15, 14, 0) },
					]}
				/>,
			);

			const dayCell = getMonthlyDayCell(container, 15) as HTMLElement;
			expect(within(dayCell).getByText("Event A")).toBeInTheDocument();
			expect(within(dayCell).getByText("Event B")).toBeInTheDocument();
		});
	});

	describe("blockedTimestamps prop", () => {
		it("should mark a day within a blocked range with the 'blocked' class", () => {
			const { container } = render(
				<FullCalendar
					viewValue={new Date(2026, 5, 1)}
					blockedTimestamps={[
						{
							initialDate: new Date(2026, 5, 10, 0, 0),
							endDate: new Date(2026, 5, 12, 23, 59),
						},
					]}
				/>,
			);

			expect(getMonthlyDayCell(container, 10)).toHaveClass("blocked");
			expect(getMonthlyDayCell(container, 11)).toHaveClass("blocked");
			expect(getMonthlyDayCell(container, 12)).toHaveClass("blocked");
		});

		it("should not mark days outside the blocked range", () => {
			const { container } = render(
				<FullCalendar
					viewValue={new Date(2026, 5, 1)}
					blockedTimestamps={[
						{
							initialDate: new Date(2026, 5, 10, 0, 0),
							endDate: new Date(2026, 5, 12, 23, 59),
						},
					]}
				/>,
			);

			expect(getMonthlyDayCell(container, 9)).not.toHaveClass("blocked");
			expect(getMonthlyDayCell(container, 13)).not.toHaveClass("blocked");
		});

		it("should not mark any day as blocked when blockedTimestamps is omitted", () => {
			const { container } = render(
				<FullCalendar viewValue={new Date(2026, 5, 1)} />,
			);

			expect(container.querySelector(".blocked")).not.toBeInTheDocument();
		});

		it("should not mark any day as blocked when blockedTimestamps is an empty array", () => {
			const { container } = render(
				<FullCalendar
					viewValue={new Date(2026, 5, 1)}
					blockedTimestamps={[]}
				/>,
			);

			expect(container.querySelector(".blocked")).not.toBeInTheDocument();
		});
	});

	describe("viewValue / defaultViewValue props", () => {
		it("should render the current date's month/year label when both are omitted", () => {
			const today = new Date();
			render(<FullCalendar />);

			const expectedLabel = today.toLocaleDateString("pt-BR", {
				day: "2-digit",
				month: "long",
				year: "numeric",
			});

			expect(screen.getByText(expectedLabel)).toBeInTheDocument();
		});

		it("should render the viewValue date label when controlled", () => {
			render(<FullCalendar viewValue={new Date(2020, 0, 10)} />);

			expect(screen.getByText("10 de janeiro de 2020")).toBeInTheDocument();
		});

		it("should render the defaultViewValue date label when uncontrolled", () => {
			render(<FullCalendar defaultViewValue={new Date(2021, 8, 5)} />);

			expect(screen.getByText("05 de setembro de 2021")).toBeInTheDocument();
		});
	});

	describe("month matrix rendering", () => {
		it("should render a full multiple-of-7 grid of day cells for the month matrix", () => {
			const { container } = render(
				<FullCalendar viewValue={new Date(2026, 5, 1)} />,
			);

			const cells = container.querySelectorAll(".arkynMonthlyCalendarTableTd");
			expect(cells.length).toBeGreaterThan(0);
			expect(cells.length % 7).toBe(0);
		});

		it("should mark days from previous and next month with owner classes", () => {
			const { container } = render(
				<FullCalendar viewValue={new Date(2026, 5, 1)} />,
			);

			expect(
				container.querySelectorAll(".arkynMonthlyCalendarTableTd.previous")
					.length,
			).toBeGreaterThan(0);
			expect(
				container.querySelectorAll(".arkynMonthlyCalendarTableTd.next").length,
			).toBeGreaterThan(0);
			expect(
				container.querySelectorAll(".arkynMonthlyCalendarTableTd.current"),
			).toHaveLength(30);
		});

		it("should mark today's cell with the 'today' class", () => {
			const today = new Date();
			const { container } = render(<FullCalendar viewValue={today} />);

			const todayCell = getMonthlyDayCell(container, today.getDate());
			expect(todayCell?.querySelector("p")).toHaveClass("today");
		});

		it("should render the week day headers", () => {
			const { container } = render(
				<FullCalendar viewValue={new Date(2026, 5, 1)} />,
			);

			const header = container.querySelector(
				".arkynMonthlyCalendarTableHeader",
			) as HTMLElement;
			const ths = within(header).getAllByRole("columnheader");
			expect(ths).toHaveLength(7);
			expect(ths[0]).toHaveTextContent("Dom.");
		});
	});

	describe("week view rendering", () => {
		it("should render the week table structure", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<FullCalendar viewValue={new Date(2026, 5, 15)} />,
			);

			await switchView(user, "Semana");

			expect(
				container.querySelector(".arkynWeekCalendarTableHeader"),
			).toBeInTheDocument();
			expect(
				container.querySelector(".arkynWeekCalendarTableBody"),
			).toBeInTheDocument();
		});

		it("should render an event within the correct week time slot", async () => {
			const user = userEvent.setup();
			render(
				<FullCalendar
					viewValue={new Date(2026, 5, 15)}
					events={[
						{
							title: "Weekly sync",
							initialDate: new Date(2026, 5, 15, 9, 0),
						},
					]}
				/>,
			);

			await switchView(user, "Semana");

			expect(screen.getByText("Weekly sync")).toBeInTheDocument();
		});

		it("should call onClickDate with the clicked time slot in week view", async () => {
			const user = userEvent.setup();
			const onClickDate = vi.fn();
			const { container } = render(
				<FullCalendar
					viewValue={new Date(2026, 5, 15)}
					onClickDate={onClickDate}
				/>,
			);

			await switchView(user, "Semana");

			const cell = container.querySelector(
				".arkynWeekCalendarTableTd.current",
			) as HTMLElement;
			await user.click(cell);

			expect(onClickDate).toHaveBeenCalledTimes(1);
		});

		it("should not call onClickDate for a blocked slot in week view", async () => {
			const user = userEvent.setup();
			const onClickDate = vi.fn();
			const viewValue = new Date(2026, 5, 15);
			const { container } = render(
				<FullCalendar
					viewValue={viewValue}
					onClickDate={onClickDate}
					blockedTimestamps={[
						{
							initialDate: new Date(2026, 5, 14, 0, 0),
							endDate: new Date(2026, 5, 20, 23, 59),
						},
					]}
				/>,
			);

			await switchView(user, "Semana");

			const cell = container.querySelector(
				".arkynWeekCalendarTableTd.current.blocked",
			) as HTMLElement;
			expect(cell).toBeInTheDocument();
			await user.click(cell);

			expect(onClickDate).not.toHaveBeenCalled();
		});
	});

	describe("day view rendering", () => {
		it("should render a row for each configured hour", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<FullCalendar viewValue={new Date(2026, 5, 15)} />,
			);

			await switchView(user, "Dia");

			const rows = container.querySelectorAll(".arkynDayCalendarRow");
			expect(rows.length).toBeGreaterThan(0);
		});

		it("should render an event within the correct day time slot", async () => {
			const user = userEvent.setup();
			render(
				<FullCalendar
					viewValue={new Date(2026, 5, 15)}
					events={[
						{
							title: "Daily check-in",
							initialDate: new Date(2026, 5, 15, 9, 0),
						},
					]}
				/>,
			);

			await switchView(user, "Dia");

			expect(screen.getByText("Daily check-in")).toBeInTheDocument();
		});

		it("should call onClickDate when a day view row is clicked", async () => {
			const user = userEvent.setup();
			const onClickDate = vi.fn();
			const { container } = render(
				<FullCalendar
					viewValue={new Date(2026, 5, 15)}
					onClickDate={onClickDate}
				/>,
			);

			await switchView(user, "Dia");

			const row = container.querySelector(
				".arkynDayCalendarRow",
			) as HTMLElement;
			await user.click(row);

			expect(onClickDate).toHaveBeenCalledTimes(1);
		});

		it("should not call onClickDate when the current view date is blocked in day view", async () => {
			const user = userEvent.setup();
			const onClickDate = vi.fn();
			const viewValue = new Date(2026, 5, 15);
			const { container } = render(
				<FullCalendar
					viewValue={viewValue}
					onClickDate={onClickDate}
					blockedTimestamps={[
						{
							initialDate: new Date(2026, 5, 14, 0, 0),
							endDate: new Date(2026, 5, 20, 23, 59),
						},
					]}
				/>,
			);

			await switchView(user, "Dia");

			const row = container.querySelector(
				".arkynDayCalendarRow.blocked",
			) as HTMLElement;
			expect(row).toBeInTheDocument();
			await user.click(row);

			expect(onClickDate).not.toHaveBeenCalled();
		});
	});

	describe("accessibility", () => {
		it("should render navigation buttons with accessible labels", () => {
			render(<FullCalendar />);

			expect(screen.getByLabelText("Handle previous")).toBeInTheDocument();
			expect(screen.getByLabelText("Handle next")).toBeInTheDocument();
		});

		it("should render the month grid as a table", () => {
			render(<FullCalendar />);

			expect(screen.getByRole("table")).toBeInTheDocument();
		});

		it("should render week day headers as columnheader roles", () => {
			render(<FullCalendar />);

			expect(screen.getAllByRole("columnheader")).toHaveLength(7);
		});

		it("should support keyboard activation of navigation buttons", async () => {
			const user = userEvent.setup();
			const onChangeView = vi.fn();
			render(
				<FullCalendar
					defaultViewValue={new Date(2026, 5, 15)}
					onChangeView={onChangeView}
				/>,
			);

			screen.getByLabelText("Handle next").focus();
			await user.keyboard("{Enter}");

			expect(onChangeView).toHaveBeenCalledTimes(1);
		});
	});

	describe("edge cases", () => {
		it("should not throw when events is omitted entirely", () => {
			expect(() => render(<FullCalendar />)).not.toThrow();
		});

		it("should handle leap-year February correctly", () => {
			const { container } = render(
				<FullCalendar viewValue={new Date(2024, 1, 1)} />,
			);

			expect(
				container.querySelectorAll(".arkynMonthlyCalendarTableTd.current"),
			).toHaveLength(29);
		});

		it("should handle non-leap-year February correctly", () => {
			const { container } = render(
				<FullCalendar viewValue={new Date(2026, 1, 1)} />,
			);

			expect(
				container.querySelectorAll(".arkynMonthlyCalendarTableTd.current"),
			).toHaveLength(28);
		});

		it("should ignore events without a matching day without throwing", () => {
			const { container } = render(
				<FullCalendar
					viewValue={new Date(2026, 5, 1)}
					events={[
						{
							title: "Far future event",
							initialDate: new Date(2099, 0, 1, 10, 0),
						},
					]}
				/>,
			);

			expect(
				container.querySelector(".arkynMonthlyCalendarEvent"),
			).not.toBeInTheDocument();
		});
	});
});
