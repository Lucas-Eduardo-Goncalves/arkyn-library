import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ModalFooter } from "../modal/modalFooter";

afterEach(cleanup);

describe("ModalFooter", () => {
	it("should render without errors", () => {
		render(
			<ModalFooter data-testid="modal-footer">
				<button type="button">Cancel</button>
			</ModalFooter>,
		);

		expect(screen.getByTestId("modal-footer")).toBeInTheDocument();
	});

	it("should render as a footer element", () => {
		render(<ModalFooter data-testid="modal-footer" />);

		expect(screen.getByTestId("modal-footer").tagName).toBe("FOOTER");
	});

	it("should render string children", () => {
		render(<ModalFooter>Plain text</ModalFooter>);

		expect(screen.getByText("Plain text")).toBeInTheDocument();
	});

	it("should render JSX children", () => {
		render(
			<ModalFooter>
				<button type="button">Confirm</button>
			</ModalFooter>,
		);

		expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
	});

	it("should render multiple children elements", () => {
		render(
			<ModalFooter>
				<button type="button">Cancel</button>
				<button type="button">Confirm</button>
			</ModalFooter>,
		);

		expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
	});

	it("should render without children", () => {
		render(<ModalFooter data-testid="modal-footer" />);

		expect(screen.getByTestId("modal-footer")).toBeEmptyDOMElement();
	});

	it("should render when all optional properties are omitted", () => {
		render(<ModalFooter data-testid="modal-footer" />);

		const element = screen.getByTestId("modal-footer");
		expect(element).toHaveClass("arkynModalFooter");
		expect(element).toHaveClass("right");
	});

	it("should render correctly with all properties filled", () => {
		render(
			<ModalFooter
				data-testid="modal-footer"
				alignment="between"
				className="custom-class"
			>
				<button type="button">Back</button>
				<button type="button">Next</button>
			</ModalFooter>,
		);

		const element = screen.getByTestId("modal-footer");
		expect(element).toHaveClass("arkynModalFooter", "between", "custom-class");
		expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
	});

	describe("alignment prop", () => {
		it("should default to right when omitted", () => {
			render(<ModalFooter data-testid="modal-footer" />);

			expect(screen.getByTestId("modal-footer")).toHaveClass("right");
		});

		it.each([
			"left",
			"center",
			"right",
			"between",
			"around",
		] as const)("should apply the '%s' alignment class", (alignment) => {
			render(<ModalFooter data-testid="modal-footer" alignment={alignment} />);

			expect(screen.getByTestId("modal-footer")).toHaveClass(alignment);
		});

		it("should replace the alignment class when changed", () => {
			const { rerender } = render(
				<ModalFooter data-testid="modal-footer" alignment="left" />,
			);

			let element = screen.getByTestId("modal-footer");
			expect(element).toHaveClass("left");

			rerender(<ModalFooter data-testid="modal-footer" alignment="around" />);

			element = screen.getByTestId("modal-footer");
			expect(element).toHaveClass("around");
			expect(element).not.toHaveClass("left");
		});
	});

	describe("className merge", () => {
		it("should preserve the base className", () => {
			render(<ModalFooter data-testid="modal-footer" />);

			expect(screen.getByTestId("modal-footer")).toHaveClass(
				"arkynModalFooter",
			);
		});

		it("should merge an external className with the base className", () => {
			render(
				<ModalFooter data-testid="modal-footer" className="custom-class" />,
			);

			const element = screen.getByTestId("modal-footer");
			expect(element).toHaveClass("arkynModalFooter");
			expect(element).toHaveClass("custom-class");
		});

		it("should include the literal 'undefined' text in className when no className is provided", () => {
			render(<ModalFooter data-testid="modal-footer" />);

			expect(screen.getByTestId("modal-footer").className).toBe(
				"arkynModalFooter right undefined",
			);
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the footer element", () => {
			render(
				<ModalFooter data-testid="modal-footer" aria-label="Modal actions" />,
			);

			expect(screen.getByTestId("modal-footer")).toHaveAttribute(
				"aria-label",
				"Modal actions",
			);
		});

		it("should forward id attribute", () => {
			render(<ModalFooter id="footer-id" />);

			expect(document.getElementById("footer-id")).toBeInTheDocument();
		});

		it("should forward inline style", () => {
			render(
				<ModalFooter
					data-testid="modal-footer"
					style={{ marginTop: "10px" }}
				/>,
			);

			expect(screen.getByTestId("modal-footer")).toHaveStyle({
				marginTop: "10px",
			});
		});
	});

	describe("edge cases", () => {
		it("should handle null children without throwing", () => {
			render(<ModalFooter data-testid="modal-footer">{null}</ModalFooter>);

			expect(screen.getByTestId("modal-footer")).toBeInTheDocument();
		});

		it("should handle undefined children without throwing", () => {
			render(<ModalFooter data-testid="modal-footer">{undefined}</ModalFooter>);

			expect(screen.getByTestId("modal-footer")).toBeInTheDocument();
		});
	});
});
