import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TableHeader } from "../table/tableHeader";

afterEach(cleanup);

describe("TableHeader", () => {
	it("should render without errors", () => {
		render(
			<table>
				<TableHeader>
					<th>Name</th>
				</TableHeader>
			</table>,
		);

		expect(screen.getByText("Name")).toBeInTheDocument();
	});

	it("should render as a thead element", () => {
		const { container } = render(
			<table>
				<TableHeader>
					<th>Name</th>
				</TableHeader>
			</table>,
		);

		const element = container.querySelector("thead");
		expect(element).toBeInTheDocument();
		expect(element?.tagName).toBe("THEAD");
	});

	it("should render a single th child", () => {
		render(
			<table>
				<TableHeader>
					<th>Name</th>
				</TableHeader>
			</table>,
		);

		expect(screen.getByText("Name")).toBeInTheDocument();
	});

	it("should render multiple th children", () => {
		render(
			<table>
				<TableHeader>
					<th>Name</th>
					<th>Email</th>
					<th>Status</th>
				</TableHeader>
			</table>,
		);

		expect(screen.getByText("Name")).toBeInTheDocument();
		expect(screen.getByText("Email")).toBeInTheDocument();
		expect(screen.getByText("Status")).toBeInTheDocument();
	});

	it("should render without children", () => {
		const { container } = render(
			<table>
				<TableHeader />
			</table>,
		);

		expect(container.querySelector("thead")).toBeInTheDocument();
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(
			<table>
				<TableHeader />
			</table>,
		);

		const element = container.querySelector("thead");
		expect(element).toHaveClass("arkynTableHeader");
	});

	it("should render correctly with all properties filled", () => {
		const { container } = render(
			<table>
				<TableHeader className="custom-class" data-testid="table-header">
					<th>Name</th>
				</TableHeader>
			</table>,
		);

		const element = container.querySelector("thead");
		expect(element).toHaveClass("arkynTableHeader", "custom-class");
		expect(element).toHaveAttribute("data-testid", "table-header");
		expect(screen.getByText("Name")).toBeInTheDocument();
	});

	describe("structure", () => {
		it("should wrap children in a single tr", () => {
			const { container } = render(
				<table>
					<TableHeader>
						<th>Name</th>
						<th>Email</th>
					</TableHeader>
				</table>,
			);

			const rows = container.querySelectorAll("thead > tr");
			expect(rows).toHaveLength(2);
			const headerRow = rows[0];
			expect(headerRow.querySelectorAll("th")).toHaveLength(2);
		});

		it("should render a spacing row after the header row", () => {
			const { container } = render(
				<table>
					<TableHeader>
						<th>Name</th>
					</TableHeader>
				</table>,
			);

			const rows = container.querySelectorAll("thead > tr");
			expect(rows).toHaveLength(2);
			expect(rows[1]).toHaveClass("spacingRow");
		});

		it("should render the exact number of th children provided", () => {
			const { container } = render(
				<table>
					<TableHeader>
						<th>Name</th>
						<th>Email</th>
						<th>Status</th>
					</TableHeader>
				</table>,
			);

			const headerRow = container.querySelector("thead > tr");
			expect(headerRow?.querySelectorAll("th")).toHaveLength(3);
		});
	});

	describe("className merge", () => {
		it("should preserve the base className", () => {
			const { container } = render(
				<table>
					<TableHeader />
				</table>,
			);

			expect(container.querySelector("thead")).toHaveClass("arkynTableHeader");
		});

		it("should merge an external className with the base className", () => {
			const { container } = render(
				<table>
					<TableHeader className="custom-class" />
				</table>,
			);

			const element = container.querySelector("thead");
			expect(element).toHaveClass("arkynTableHeader");
			expect(element).toHaveClass("custom-class");
		});

		it("should include the literal 'undefined' text in className when no className is provided", () => {
			const { container } = render(
				<table>
					<TableHeader />
				</table>,
			);

			expect((container.querySelector("thead") as HTMLElement).className).toBe(
				"arkynTableHeader undefined",
			);
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the thead element", () => {
			const { container } = render(
				<table>
					<TableHeader aria-label="Table header" />
				</table>,
			);

			expect(container.querySelector("thead")).toHaveAttribute(
				"aria-label",
				"Table header",
			);
		});

		it("should forward id attribute", () => {
			render(
				<table>
					<TableHeader id="thead-id" />
				</table>,
			);

			expect(document.getElementById("thead-id")).toBeInTheDocument();
		});
	});

	describe("edge cases", () => {
		it("should handle null children without throwing", () => {
			const { container } = render(
				<table>
					<TableHeader>{null}</TableHeader>
				</table>,
			);

			expect(container.querySelector("thead")).toBeInTheDocument();
		});

		it("should handle undefined children without throwing", () => {
			const { container } = render(
				<table>
					<TableHeader>{undefined}</TableHeader>
				</table>,
			);

			expect(container.querySelector("thead")).toBeInTheDocument();
		});
	});
});
