import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TableContainer } from "../table/tableContainer";

afterEach(cleanup);

describe("TableContainer", () => {
	it("should render without errors", () => {
		render(
			<TableContainer data-testid="table-container">
				<tbody>
					<tr>
						<td>Row 1</td>
					</tr>
				</tbody>
			</TableContainer>,
		);

		expect(screen.getByTestId("table-container")).toBeInTheDocument();
	});

	it("should render a wrapping div around a table element", () => {
		render(
			<TableContainer data-testid="table-container">
				<tbody>
					<tr>
						<td>Row 1</td>
					</tr>
				</tbody>
			</TableContainer>,
		);

		const wrapper = screen.getByTestId("table-container");
		expect(wrapper.tagName).toBe("DIV");
		expect(wrapper.querySelector("table")).toBeInTheDocument();
	});

	it("should render children inside the table element", () => {
		render(
			<TableContainer data-testid="table-container">
				<tbody>
					<tr>
						<td>Row 1</td>
					</tr>
				</tbody>
			</TableContainer>,
		);

		const table = screen.getByTestId("table-container").querySelector("table");
		expect(table).toContainElement(screen.getByText("Row 1"));
	});

	it("should render multiple children elements", () => {
		render(
			<TableContainer>
				<caption>Users</caption>
				<thead>
					<tr>
						<th>Name</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>John</td>
					</tr>
				</tbody>
			</TableContainer>,
		);

		expect(screen.getByText("Users")).toBeInTheDocument();
		expect(screen.getByText("Name")).toBeInTheDocument();
		expect(screen.getByText("John")).toBeInTheDocument();
	});

	it("should render without children", () => {
		render(<TableContainer data-testid="table-container" />);

		const table = screen.getByTestId("table-container").querySelector("table");
		expect(table).toBeEmptyDOMElement();
	});

	it("should render when all optional properties are omitted", () => {
		render(<TableContainer data-testid="table-container" />);

		expect(screen.getByTestId("table-container")).toHaveClass(
			"arkynTableContainer",
		);
	});

	it("should render correctly with all properties filled", () => {
		render(
			<TableContainer
				data-testid="table-container"
				className="custom-class"
				id="table-id"
			>
				<tbody>
					<tr>
						<td>Row 1</td>
					</tr>
				</tbody>
			</TableContainer>,
		);

		const element = screen.getByTestId("table-container");
		expect(element).toHaveClass("arkynTableContainer", "custom-class");
		expect(element).toHaveAttribute("id", "table-id");
		expect(screen.getByText("Row 1")).toBeInTheDocument();
	});

	describe("className merge", () => {
		it("should preserve the base className", () => {
			render(<TableContainer data-testid="table-container" />);

			expect(screen.getByTestId("table-container")).toHaveClass(
				"arkynTableContainer",
			);
		});

		it("should merge an external className with the base className", () => {
			render(
				<TableContainer
					data-testid="table-container"
					className="custom-class"
				/>,
			);

			const element = screen.getByTestId("table-container");
			expect(element).toHaveClass("arkynTableContainer");
			expect(element).toHaveClass("custom-class");
		});

		it("should include the literal 'undefined' text in className when no className is provided", () => {
			render(<TableContainer data-testid="table-container" />);

			expect(screen.getByTestId("table-container").className).toBe(
				"arkynTableContainer undefined",
			);
		});

		it("should render with an empty string className", () => {
			render(<TableContainer data-testid="table-container" className="" />);

			expect(screen.getByTestId("table-container")).toHaveClass(
				"arkynTableContainer",
			);
		});
	});

	describe("HTML table attributes passthrough", () => {
		it("should forward attributes onto the wrapping div, not the table", () => {
			render(
				<TableContainer
					data-testid="table-container"
					aria-label="Users table"
				/>,
			);

			const element = screen.getByTestId("table-container");
			expect(element).toHaveAttribute("aria-label", "Users table");
			expect(element.querySelector("table")).not.toHaveAttribute("aria-label");
		});

		it("should apply inline styles passed via style prop", () => {
			render(
				<TableContainer
					data-testid="table-container"
					style={{ maxWidth: "600px" }}
				/>,
			);

			expect(screen.getByTestId("table-container")).toHaveStyle({
				maxWidth: "600px",
			});
		});
	});

	describe("edge cases", () => {
		it("should handle null children without throwing", () => {
			render(
				<TableContainer data-testid="table-container">{null}</TableContainer>,
			);

			expect(screen.getByTestId("table-container")).toBeInTheDocument();
		});

		it("should handle undefined children without throwing", () => {
			render(
				<TableContainer data-testid="table-container">
					{undefined}
				</TableContainer>,
			);

			expect(screen.getByTestId("table-container")).toBeInTheDocument();
		});
	});
});
