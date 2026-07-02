import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TableBody } from "../table/tableBody";

afterEach(cleanup);

describe("TableBody", () => {
	it("should render without errors", () => {
		render(
			<table>
				<TableBody>
					<tr>
						<td>Row 1</td>
					</tr>
				</TableBody>
			</table>,
		);

		expect(screen.getByText("Row 1")).toBeInTheDocument();
	});

	it("should render as a tbody element", () => {
		const { container } = render(
			<table>
				<TableBody>
					<tr>
						<td>Row 1</td>
					</tr>
				</TableBody>
			</table>,
		);

		const element = container.querySelector("tbody");
		expect(element).toBeInTheDocument();
		expect(element?.tagName).toBe("TBODY");
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(
			<table>
				<TableBody />
			</table>,
		);

		const element = container.querySelector("tbody");
		expect(element).toHaveClass("arkynTableBody");
	});

	it("should render correctly with all properties filled", () => {
		const { container } = render(
			<table>
				<TableBody
					emptyMessage="Custom empty"
					className="custom-class"
					data-testid="table-body"
				>
					<tr>
						<td>Row 1</td>
					</tr>
				</TableBody>
			</table>,
		);

		const element = container.querySelector("tbody");
		expect(element).toHaveClass("arkynTableBody", "custom-class");
		expect(element).toHaveAttribute("data-testid", "table-body");
		expect(screen.getByText("Row 1")).toBeInTheDocument();
	});

	describe("children rows", () => {
		it("should render a single row child", () => {
			render(
				<table>
					<TableBody>
						<tr>
							<td>Single row</td>
						</tr>
					</TableBody>
				</table>,
			);

			expect(screen.getByText("Single row")).toBeInTheDocument();
		});

		it("should render multiple row children", () => {
			render(
				<table>
					<TableBody>
						<tr>
							<td>Row 1</td>
						</tr>
						<tr>
							<td>Row 2</td>
						</tr>
						<tr>
							<td>Row 3</td>
						</tr>
					</TableBody>
				</table>,
			);

			expect(screen.getByText("Row 1")).toBeInTheDocument();
			expect(screen.getByText("Row 2")).toBeInTheDocument();
			expect(screen.getByText("Row 3")).toBeInTheDocument();
		});

		it("should not render the empty state row when children are present", () => {
			const { container } = render(
				<table>
					<TableBody>
						<tr>
							<td>Row 1</td>
						</tr>
					</TableBody>
				</table>,
			);

			expect(
				container.querySelector(".arkynTableBodyEmptyLine"),
			).not.toBeInTheDocument();
		});

		it("should render the exact number of row children provided", () => {
			const { container } = render(
				<table>
					<TableBody>
						<tr>
							<td>Row 1</td>
						</tr>
						<tr>
							<td>Row 2</td>
						</tr>
					</TableBody>
				</table>,
			);

			const rows = container.querySelectorAll("tbody > tr");
			expect(rows).toHaveLength(2);
		});
	});

	describe("empty state", () => {
		it("should render the default empty message when there are no children", () => {
			render(
				<table>
					<TableBody />
				</table>,
			);

			expect(screen.getByText("Nenhum dado adicionado.")).toBeInTheDocument();
		});

		it("should render the empty state row with the arkynTableBodyEmptyLine class", () => {
			const { container } = render(
				<table>
					<TableBody />
				</table>,
			);

			const emptyRow = container.querySelector(".arkynTableBodyEmptyLine");
			expect(emptyRow).toBeInTheDocument();
			expect(emptyRow?.tagName).toBe("TR");
		});

		it("should render the empty state cell with a full colSpan", () => {
			const { container } = render(
				<table>
					<TableBody />
				</table>,
			);

			const cell = container.querySelector(".arkynTableBodyEmptyLine td");
			expect(cell).toHaveAttribute("colspan", "100");
		});

		it("should render the empty state when children is null", () => {
			render(
				<table>
					<TableBody>{null}</TableBody>
				</table>,
			);

			expect(screen.getByText("Nenhum dado adicionado.")).toBeInTheDocument();
		});

		it("should render the empty state when children is undefined", () => {
			render(
				<table>
					<TableBody>{undefined}</TableBody>
				</table>,
			);

			expect(screen.getByText("Nenhum dado adicionado.")).toBeInTheDocument();
		});

		it("should render the empty state when children is false", () => {
			render(
				<table>
					<TableBody>{false}</TableBody>
				</table>,
			);

			expect(screen.getByText("Nenhum dado adicionado.")).toBeInTheDocument();
		});

		it("should render only one empty state row", () => {
			const { container } = render(
				<table>
					<TableBody />
				</table>,
			);

			const rows = container.querySelectorAll("tbody > tr");
			expect(rows).toHaveLength(1);
		});
	});

	describe("emptyMessage prop", () => {
		it("should use the default message when emptyMessage is omitted", () => {
			render(
				<table>
					<TableBody />
				</table>,
			);

			expect(screen.getByText("Nenhum dado adicionado.")).toBeInTheDocument();
		});

		it("should render a custom emptyMessage when provided", () => {
			render(
				<table>
					<TableBody emptyMessage="No records found" />
				</table>,
			);

			expect(screen.getByText("No records found")).toBeInTheDocument();
			expect(
				screen.queryByText("Nenhum dado adicionado."),
			).not.toBeInTheDocument();
		});

		it("should handle an empty string emptyMessage", () => {
			const { container } = render(
				<table>
					<TableBody emptyMessage="" />
				</table>,
			);

			const cell = container.querySelector(".arkynTableBodyEmptyLine td div");
			expect(cell).toBeInTheDocument();
			expect(cell).toHaveTextContent("");
		});

		it("should not render the custom emptyMessage when children are present", () => {
			render(
				<table>
					<TableBody emptyMessage="No records found">
						<tr>
							<td>Row 1</td>
						</tr>
					</TableBody>
				</table>,
			);

			expect(screen.queryByText("No records found")).not.toBeInTheDocument();
			expect(screen.getByText("Row 1")).toBeInTheDocument();
		});
	});

	describe("className merge", () => {
		it("should preserve the base className", () => {
			const { container } = render(
				<table>
					<TableBody />
				</table>,
			);

			const element = container.querySelector("tbody");
			expect(element).toHaveClass("arkynTableBody");
		});

		it("should merge an external className with the base className", () => {
			const { container } = render(
				<table>
					<TableBody className="custom-class" />
				</table>,
			);

			const element = container.querySelector("tbody");
			expect(element).toHaveClass("arkynTableBody");
			expect(element).toHaveClass("custom-class");
		});

		it("should still render the base class when className is omitted", () => {
			const { container } = render(
				<table>
					<TableBody />
				</table>,
			);

			const element = container.querySelector("tbody");
			expect(element).toHaveClass("arkynTableBody");
		});

		it("should handle an empty className string", () => {
			const { container } = render(
				<table>
					<TableBody className="" />
				</table>,
			);

			const element = container.querySelector("tbody") as HTMLElement;
			expect(element).toHaveClass("arkynTableBody");
			expect(element.className.trim()).toBe(element.className);
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the root element", () => {
			render(
				<table>
					<TableBody data-testid="table-body-root" aria-label="Body section" />
				</table>,
			);

			const element = screen.getByTestId("table-body-root");
			expect(element).toHaveAttribute("aria-label", "Body section");
		});

		it("should forward id attribute", () => {
			render(
				<table>
					<TableBody id="tbody-id" />
				</table>,
			);

			expect(document.getElementById("tbody-id")).toBeInTheDocument();
		});

		it("should forward inline style", () => {
			const { container } = render(
				<table>
					<TableBody style={{ backgroundColor: "red" }} />
				</table>,
			);

			// jest-dom@6.9.1's `toHaveStyle` compares the raw expected value
			// against jsdom's computed style, which serializes named colors as
			// rgb() — asserting the keyword "red" mismatches even though the
			// style is applied correctly. Assert with the serialized form.
			const element = container.querySelector("tbody");
			expect(element).toHaveStyle({ backgroundColor: "rgb(255, 0, 0)" });
		});
	});
});
