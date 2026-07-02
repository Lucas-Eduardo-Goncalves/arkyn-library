import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TableCaption } from "../table/tableCaption";

afterEach(cleanup);

describe("TableCaption", () => {
	it("should render without errors", () => {
		render(
			<table>
				<TableCaption data-testid="table-caption">Orders</TableCaption>
			</table>,
		);

		expect(screen.getByTestId("table-caption")).toBeInTheDocument();
	});

	it("should render as a caption element", () => {
		render(
			<table>
				<TableCaption data-testid="table-caption">Orders</TableCaption>
			</table>,
		);

		expect(screen.getByTestId("table-caption").tagName).toBe("CAPTION");
	});

	it("should render string children", () => {
		render(
			<table>
				<TableCaption>Orders — Q2 2025</TableCaption>
			</table>,
		);

		expect(screen.getByText("Orders — Q2 2025")).toBeInTheDocument();
	});

	it("should render JSX children", () => {
		render(
			<table>
				<TableCaption>
					<strong>Orders</strong>
				</TableCaption>
			</table>,
		);

		expect(screen.getByText("Orders")).toBeInTheDocument();
	});

	it("should render multiple children elements", () => {
		render(
			<table>
				<TableCaption>
					<span>Title</span>
					<span>Subtitle</span>
				</TableCaption>
			</table>,
		);

		expect(screen.getByText("Title")).toBeInTheDocument();
		expect(screen.getByText("Subtitle")).toBeInTheDocument();
	});

	it("should render without children", () => {
		render(
			<table>
				<TableCaption data-testid="table-caption" />
			</table>,
		);

		const content = screen
			.getByTestId("table-caption")
			.querySelector(".arkynTableCaptionContent");
		expect(content).toBeEmptyDOMElement();
	});

	it("should render when all optional properties are omitted", () => {
		render(
			<table>
				<TableCaption data-testid="table-caption" />
			</table>,
		);

		expect(screen.getByTestId("table-caption")).toHaveClass(
			"arkynTableCaption",
		);
	});

	it("should render correctly with all properties filled", () => {
		render(
			<table>
				<TableCaption
					data-testid="table-caption"
					className="custom-class"
					id="caption-id"
				>
					Orders
				</TableCaption>
			</table>,
		);

		const element = screen.getByTestId("table-caption");
		expect(element).toHaveClass("arkynTableCaption", "custom-class");
		expect(element).toHaveAttribute("id", "caption-id");
		expect(screen.getByText("Orders")).toBeInTheDocument();
	});

	it("should wrap children in an arkynTableCaptionContent div", () => {
		render(
			<table>
				<TableCaption data-testid="table-caption">Orders</TableCaption>
			</table>,
		);

		const content = screen
			.getByTestId("table-caption")
			.querySelector(".arkynTableCaptionContent");
		expect(content).toBeInTheDocument();
		expect(content).toHaveTextContent("Orders");
	});

	describe("className merge", () => {
		it("should preserve the base className", () => {
			render(
				<table>
					<TableCaption data-testid="table-caption" />
				</table>,
			);

			expect(screen.getByTestId("table-caption")).toHaveClass(
				"arkynTableCaption",
			);
		});

		it("should merge an external className with the base className", () => {
			render(
				<table>
					<TableCaption data-testid="table-caption" className="custom-class" />
				</table>,
			);

			const element = screen.getByTestId("table-caption");
			expect(element).toHaveClass("arkynTableCaption");
			expect(element).toHaveClass("custom-class");
		});

		it("should include the literal 'undefined' text in className when no className is provided", () => {
			render(
				<table>
					<TableCaption data-testid="table-caption" />
				</table>,
			);

			expect(screen.getByTestId("table-caption").className).toBe(
				"arkynTableCaption undefined",
			);
		});

		it("should render with an empty string className", () => {
			render(
				<table>
					<TableCaption data-testid="table-caption" className="" />
				</table>,
			);

			expect(screen.getByTestId("table-caption")).toHaveClass(
				"arkynTableCaption",
			);
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should forward standard attributes", () => {
			render(
				<table>
					<TableCaption
						data-testid="table-caption"
						title="Caption title"
						aria-label="Table caption"
					/>
				</table>,
			);

			const element = screen.getByTestId("table-caption");
			expect(element).toHaveAttribute("title", "Caption title");
			expect(element).toHaveAttribute("aria-label", "Table caption");
		});

		it("should apply inline styles passed via style prop", () => {
			render(
				<table>
					<TableCaption
						data-testid="table-caption"
						style={{ marginTop: "10px" }}
					/>
				</table>,
			);

			expect(screen.getByTestId("table-caption")).toHaveStyle({
				marginTop: "10px",
			});
		});
	});

	describe("edge cases", () => {
		it("should handle null children without throwing", () => {
			render(
				<table>
					<TableCaption data-testid="table-caption">{null}</TableCaption>
				</table>,
			);

			expect(screen.getByTestId("table-caption")).toBeInTheDocument();
		});

		it("should handle undefined children without throwing", () => {
			render(
				<table>
					<TableCaption data-testid="table-caption">{undefined}</TableCaption>
				</table>,
			);

			expect(screen.getByTestId("table-caption")).toBeInTheDocument();
		});
	});
});
