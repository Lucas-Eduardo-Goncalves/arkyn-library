import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { User } from "lucide-react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DatePicker } from "../datePicker";

afterEach(cleanup);

function getDayCell(container: HTMLElement, day: number, owner = "current") {
	const cells = Array.from(
		container.querySelectorAll(`td.${owner}`),
	) as HTMLElement[];
	return cells.find(
		(cell) => cell.querySelector("p")?.textContent === String(day),
	) as HTMLElement;
}

const fixedViewValue = new Date(2026, 5, 1);

describe("DatePicker", () => {
	it("should render without errors", () => {
		render(<DatePicker type="single" name="date" />);
		expect(
			document.querySelector(".arkynDatePickerContainer"),
		).toBeInTheDocument();
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(<DatePicker type="single" name="date" />);

		const section = container.querySelector(
			".arkynDatePickerContainer",
		) as HTMLElement;
		expect(section).toBeInTheDocument();
		expect(section).toHaveClass("solid", "md");
		expect(screen.getByText("Selecione uma data...")).toBeInTheDocument();
	});

	it("should render correctly with all properties filled", () => {
		render(
			<DatePicker
				type="single"
				name="date"
				label="Birth date"
				showAsterisk
				placeholder="Choose a date"
				variant="outline"
				size="lg"
				prefix="Date:"
				leftIcon={User}
				className="custom-wrapper"
			/>,
		);

		expect(screen.getByText("Birth date")).toBeInTheDocument();
		expect(screen.getByText("Birth date")).toHaveClass("asteriskTrue");
		expect(screen.getByText("Choose a date")).toBeInTheDocument();
		expect(screen.getByText("Date:")).toBeInTheDocument();
	});

	it("should render a hidden input with the name prop", () => {
		const { container } = render(<DatePicker type="single" name="date" />);

		const input = container.querySelector("input[type='hidden']");
		expect(input).toHaveAttribute("name", "date");
		expect(input).toHaveValue("");
	});

	it("should not render the calendar before it is opened", () => {
		render(<DatePicker type="single" name="date" />);
		expect(
			document.querySelector(".arkynDatePickerCalendarContainer"),
		).not.toBeInTheDocument();
	});

	describe("open/close behavior", () => {
		it("should open the calendar when the container is clicked", async () => {
			const user = userEvent.setup();
			const { container } = render(<DatePicker type="single" name="date" />);

			const section = container.querySelector(
				".arkynDatePickerContainer",
			) as HTMLElement;
			await user.click(section);

			expect(
				document.querySelector(".arkynDatePickerCalendarContainer"),
			).toBeInTheDocument();
		});

		it("should close the calendar when the overlay is clicked", async () => {
			const user = userEvent.setup();
			const { container } = render(<DatePicker type="single" name="date" />);

			const section = container.querySelector(
				".arkynDatePickerContainer",
			) as HTMLElement;
			await user.click(section);

			const overlay = document.querySelector(
				".arkynDatePickerOverlay",
			) as HTMLElement;
			await user.click(overlay);

			expect(
				document.querySelector(".arkynDatePickerCalendarContainer"),
			).not.toBeInTheDocument();
		});

		it("should not open when disabled", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<DatePicker type="single" name="date" disabled />,
			);

			const section = container.querySelector(
				".arkynDatePickerContainer",
			) as HTMLElement;
			await user.click(section);

			expect(
				document.querySelector(".arkynDatePickerCalendarContainer"),
			).not.toBeInTheDocument();
		});
	});

	describe("single mode", () => {
		it("should call onChange and update the display text when a day is picked", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			const { container } = render(
				<DatePicker
					type="single"
					name="date"
					viewValue={fixedViewValue}
					onChange={handleChange}
				/>,
			);

			const section = container.querySelector(
				".arkynDatePickerContainer",
			) as HTMLElement;
			await user.click(section);

			const dayCell = getDayCell(container, 10);
			await user.click(dayCell);

			expect(handleChange).toHaveBeenCalledTimes(1);
			const calledDate = handleChange.mock.calls[0][0] as Date;
			expect(calledDate.getDate()).toBe(10);
			expect(screen.getByText("10/06/2026")).toBeInTheDocument();
		});

		it("should close the calendar after picking by default", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<DatePicker type="single" name="date" viewValue={fixedViewValue} />,
			);

			const section = container.querySelector(
				".arkynDatePickerContainer",
			) as HTMLElement;
			await user.click(section);
			await user.click(getDayCell(container, 10));

			expect(
				document.querySelector(".arkynDatePickerCalendarContainer"),
			).not.toBeInTheDocument();
		});

		it("should keep the calendar open when closeOnSelect is false", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<DatePicker
					type="single"
					name="date"
					viewValue={fixedViewValue}
					closeOnSelect={false}
				/>,
			);

			const section = container.querySelector(
				".arkynDatePickerContainer",
			) as HTMLElement;
			await user.click(section);
			await user.click(getDayCell(container, 10));

			expect(
				document.querySelector(".arkynDatePickerCalendarContainer"),
			).toBeInTheDocument();
		});

		it("should update the hidden input value with the selected date", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<DatePicker type="single" name="date" viewValue={fixedViewValue} />,
			);

			const section = container.querySelector(
				".arkynDatePickerContainer",
			) as HTMLElement;
			await user.click(section);
			await user.click(getDayCell(container, 10));

			const input = container.querySelector("input[type='hidden']");
			expect(input).toHaveValue("2026-06-10");
		});

		it("should respect a controlled value and not update internally", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			const { container } = render(
				<DatePicker
					type="single"
					name="date"
					viewValue={fixedViewValue}
					value={new Date(2026, 5, 5)}
					onChange={handleChange}
				/>,
			);

			expect(screen.getByText("05/06/2026")).toBeInTheDocument();

			const section = container.querySelector(
				".arkynDatePickerContainer",
			) as HTMLElement;
			await user.click(section);
			await user.click(getDayCell(container, 10));

			expect(handleChange).toHaveBeenCalledTimes(1);
			expect(screen.getByText("05/06/2026")).toBeInTheDocument();
		});
	});

	describe("range mode", () => {
		const seedRange: [Date, Date] = [
			new Date(2026, 5, 5),
			new Date(2026, 5, 10),
		];

		it("should display the formatted range once it changes", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			const { container } = render(
				<DatePicker
					type="range"
					name="range"
					viewValue={fixedViewValue}
					defaultValue={seedRange}
					onChange={handleChange}
				/>,
			);

			expect(screen.getByText("05/06/2026 até 10/06/2026")).toBeInTheDocument();

			const section = container.querySelector(
				".arkynDatePickerContainer",
			) as HTMLElement;
			await user.click(section);
			await user.click(getDayCell(container, 15));

			expect(handleChange).toHaveBeenCalledTimes(1);
			const [start, end] = handleChange.mock.calls[0][0] as [Date, Date];
			expect(start.getDate()).toBe(5);
			expect(end.getDate()).toBe(15);
			expect(screen.getByText("05/06/2026 até 15/06/2026")).toBeInTheDocument();
		});

		it("should keep the calendar open after picking by default", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<DatePicker
					type="range"
					name="range"
					viewValue={fixedViewValue}
					defaultValue={seedRange}
				/>,
			);

			const section = container.querySelector(
				".arkynDatePickerContainer",
			) as HTMLElement;
			await user.click(section);
			await user.click(getDayCell(container, 15));

			expect(
				document.querySelector(".arkynDatePickerCalendarContainer"),
			).toBeInTheDocument();
		});

		it("should close the calendar after picking when closeOnSelect is true", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<DatePicker
					type="range"
					name="range"
					viewValue={fixedViewValue}
					defaultValue={seedRange}
					closeOnSelect
				/>,
			);

			const section = container.querySelector(
				".arkynDatePickerContainer",
			) as HTMLElement;
			await user.click(section);
			await user.click(getDayCell(container, 15));

			expect(
				document.querySelector(".arkynDatePickerCalendarContainer"),
			).not.toBeInTheDocument();
		});

		it("should serialize the hidden input value as a JSON array of ISO-like dates", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<DatePicker
					type="range"
					name="range"
					viewValue={fixedViewValue}
					defaultValue={seedRange}
				/>,
			);

			const section = container.querySelector(
				".arkynDatePickerContainer",
			) as HTMLElement;
			await user.click(section);
			await user.click(getDayCell(container, 15));

			const input = container.querySelector("input[type='hidden']");
			expect(input).toHaveValue(JSON.stringify(["2026-06-05", "2026-06-15"]));
		});

		it("should use a custom rangeSeparator", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<DatePicker
					type="range"
					name="range"
					viewValue={fixedViewValue}
					defaultValue={seedRange}
					rangeSeparator=" - "
				/>,
			);

			const section = container.querySelector(
				".arkynDatePickerContainer",
			) as HTMLElement;
			await user.click(section);
			await user.click(getDayCell(container, 15));

			expect(screen.getByText("05/06/2026 - 15/06/2026")).toBeInTheDocument();
		});
	});

	describe("states", () => {
		it("should apply the errored class and render the error message", () => {
			render(
				<DatePicker
					type="single"
					name="date"
					errorMessage="Selecione uma data válida"
				/>,
			);

			expect(document.querySelector(".arkynDatePickerContainer")).toHaveClass(
				"errored",
			);
			expect(screen.getByText("Selecione uma data válida")).toBeInTheDocument();
		});

		it("should apply the opacity class when disabled, readOnly, or isLoading", () => {
			const { container: disabledContainer } = render(
				<DatePicker type="single" name="d1" disabled />,
			);
			const { container: readOnlyContainer } = render(
				<DatePicker type="single" name="d2" readOnly />,
			);
			const { container: loadingContainer } = render(
				<DatePicker type="single" name="d3" isLoading />,
			);

			expect(
				disabledContainer.querySelector(".arkynDatePickerContainer"),
			).toHaveClass("opacity");
			expect(
				readOnlyContainer.querySelector(".arkynDatePickerContainer"),
			).toHaveClass("opacity");
			expect(
				loadingContainer.querySelector(".arkynDatePickerContainer"),
			).toHaveClass("opacity");
		});

		it("should skip FieldTemplate wrapper when unShowFieldTemplate is true", () => {
			render(
				<DatePicker
					type="single"
					name="date"
					label="Should not render"
					unShowFieldTemplate
				/>,
			);

			expect(screen.queryByText("Should not render")).not.toBeInTheDocument();
		});
	});
});
