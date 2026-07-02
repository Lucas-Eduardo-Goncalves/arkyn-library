import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TableFooter } from "../table/tableFooter";

afterEach(cleanup);

describe("TableFooter", () => {
	it("should render without errors", () => {
		render(
			<table>
				<TableFooter>Footer content</TableFooter>
			</table>,
		);

		expect(screen.getByText("Footer content")).toBeInTheDocument();
	});

	it("should render as a tfoot element", () => {
		const { container } = render(
			<table>
				<TableFooter>Footer content</TableFooter>
			</table>,
		);

		const element = container.querySelector("tfoot");
		expect(element).toBeInTheDocument();
		expect(element?.tagName).toBe("TFOOT");
	});

	it("should render string children", () => {
		render(
			<table>
				<TableFooter>Plain text</TableFooter>
			</table>,
		);

		expect(screen.getByText("Plain text")).toBeInTheDocument();
	});

	it("should render JSX children", () => {
		render(
			<table>
				<TableFooter>
					<button type="button">Next page</button>
				</TableFooter>
			</table>,
		);

		expect(
			screen.getByRole("button", { name: "Next page" }),
		).toBeInTheDocument();
	});

	it("should render multiple children elements", () => {
		render(
			<table>
				<TableFooter>
					<span>Page 1 of 5</span>
					<button type="button">Next</button>
				</TableFooter>
			</table>,
		);

		expect(screen.getByText("Page 1 of 5")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
	});

	it("should render without children", () => {
		const { container } = render(
			<table>
				<TableFooter />
			</table>,
		);

		expect(container.querySelector("tfoot")).toBeInTheDocument();
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(
			<table>
				<TableFooter />
			</table>,
		);

		const element = container.querySelector("tfoot");
		expect(element).toHaveClass("arkynTableFooter");
	});

	it("should render correctly with all properties filled", () => {
		const { container } = render(
			<table>
				<TableFooter className="custom-class" data-testid="table-footer">
					Footer content
				</TableFooter>
			</table>,
		);

		const element = container.querySelector("tfoot");
		expect(element).toHaveClass("arkynTableFooter", "custom-class");
		expect(element).toHaveAttribute("data-testid", "table-footer");
		expect(screen.getByText("Footer content")).toBeInTheDocument();
	});

	describe("structure", () => {
		it("should render a spacing row before the content row", () => {
			const { container } = render(
				<table>
					<TableFooter>Footer content</TableFooter>
				</table>,
			);

			const rows = container.querySelectorAll("tfoot > tr");
			expect(rows).toHaveLength(2);
			expect(rows[0]).toHaveClass("spacingRow");
		});

		it("should wrap children in a th with a full colSpan", () => {
			const { container } = render(
				<table>
					<TableFooter>Footer content</TableFooter>
				</table>,
			);

			const cell = container.querySelector("tfoot tr:last-child th");
			expect(cell).toHaveAttribute("colspan", "100");
			expect(cell).toHaveTextContent("Footer content");
		});

		it("should wrap children in an arkynTableFooterContent div", () => {
			const { container } = render(
				<table>
					<TableFooter>Footer content</TableFooter>
				</table>,
			);

			const content = container.querySelector(".arkynTableFooterContent");
			expect(content).toBeInTheDocument();
			expect(content).toHaveTextContent("Footer content");
		});
	});

	describe("className merge", () => {
		it("should preserve the base className", () => {
			const { container } = render(
				<table>
					<TableFooter />
				</table>,
			);

			expect(container.querySelector("tfoot")).toHaveClass("arkynTableFooter");
		});

		it("should merge an external className with the base className", () => {
			const { container } = render(
				<table>
					<TableFooter className="custom-class" />
				</table>,
			);

			const element = container.querySelector("tfoot");
			expect(element).toHaveClass("arkynTableFooter");
			expect(element).toHaveClass("custom-class");
		});

		it("should include the literal 'undefined' text in className when no className is provided", () => {
			const { container } = render(
				<table>
					<TableFooter />
				</table>,
			);

			expect((container.querySelector("tfoot") as HTMLElement).className).toBe(
				"arkynTableFooter undefined",
			);
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the tfoot element", () => {
			const { container } = render(
				<table>
					<TableFooter aria-label="Table footer" />
				</table>,
			);

			expect(container.querySelector("tfoot")).toHaveAttribute(
				"aria-label",
				"Table footer",
			);
		});

		it("should forward id attribute", () => {
			render(
				<table>
					<TableFooter id="tfoot-id" />
				</table>,
			);

			expect(document.getElementById("tfoot-id")).toBeInTheDocument();
		});
	});

	describe("edge cases", () => {
		it("should handle null children without throwing", () => {
			const { container } = render(
				<table>
					<TableFooter>{null}</TableFooter>
				</table>,
			);

			expect(container.querySelector("tfoot")).toBeInTheDocument();
		});

		it("should handle undefined children without throwing", () => {
			const { container } = render(
				<table>
					<TableFooter>{undefined}</TableFooter>
				</table>,
			);

			expect(container.querySelector("tfoot")).toBeInTheDocument();
		});
	});
});
