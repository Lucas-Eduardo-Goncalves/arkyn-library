import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FieldWrapper } from "../fieldWrapper";

describe("FieldWrapper", () => {
	it("should render without errors", () => {
		render(<FieldWrapper>Field content</FieldWrapper>);

		expect(screen.getByText("Field content")).toBeInTheDocument();
	});

	it("should render as a section element", () => {
		const { container } = render(<FieldWrapper>Content</FieldWrapper>);

		const element = container.firstChild as HTMLElement;
		expect(element.tagName).toBe("SECTION");
	});

	it("should render string children", () => {
		render(<FieldWrapper>Simple text</FieldWrapper>);

		expect(screen.getByText("Simple text")).toBeInTheDocument();
	});

	it("should render JSX children", () => {
		render(
			<FieldWrapper>
				<span>JSX child</span>
			</FieldWrapper>,
		);

		expect(screen.getByText("JSX child")).toBeInTheDocument();
	});

	it("should render multiple children elements", () => {
		render(
			<FieldWrapper>
				<label htmlFor="email">Email</label>
				<input id="email" />
				<span>Error message</span>
			</FieldWrapper>,
		);

		expect(screen.getByText("Email")).toBeInTheDocument();
		expect(screen.getByRole("textbox")).toBeInTheDocument();
		expect(screen.getByText("Error message")).toBeInTheDocument();
	});

	it("should render conditional children", () => {
		const showError = false;

		render(
			<FieldWrapper>
				<span>Label</span>
				{showError && <span>Error</span>}
			</FieldWrapper>,
		);

		expect(screen.getByText("Label")).toBeInTheDocument();
		expect(screen.queryByText("Error")).not.toBeInTheDocument();
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(<FieldWrapper>Content</FieldWrapper>);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("arkynFieldWrapper");
		expect(element).toHaveClass("vertical");
	});

	it("should render correctly with all properties filled", () => {
		const { container } = render(
			<FieldWrapper
				orientation="horizontal"
				className="custom-class"
				id="field-id"
			>
				Content
			</FieldWrapper>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass(
			"arkynFieldWrapper",
			"horizontal",
			"custom-class",
		);
		expect(element).toHaveAttribute("id", "field-id");
	});

	describe("orientation prop", () => {
		it("should apply the default 'vertical' orientation class when omitted", () => {
			const { container } = render(<FieldWrapper>Content</FieldWrapper>);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("vertical");
			expect(element).not.toHaveClass("horizontal");
			expect(element).not.toHaveClass("horizontalReverse");
		});

		it("should apply the 'vertical' orientation class when specified explicitly", () => {
			const { container } = render(
				<FieldWrapper orientation="vertical">Content</FieldWrapper>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("vertical");
		});

		it("should apply the 'horizontal' orientation class when specified", () => {
			const { container } = render(
				<FieldWrapper orientation="horizontal">Content</FieldWrapper>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("horizontal");
			expect(element).not.toHaveClass("vertical");
			expect(element).not.toHaveClass("horizontalReverse");
		});

		it("should apply the 'horizontalReverse' orientation class when specified", () => {
			const { container } = render(
				<FieldWrapper orientation="horizontalReverse">Content</FieldWrapper>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("horizontalReverse");
			expect(element).not.toHaveClass("vertical");
			expect(element).not.toHaveClass("horizontal");
		});

		it("should replace the orientation class when changed", () => {
			const { container, rerender } = render(
				<FieldWrapper orientation="horizontal">Content</FieldWrapper>,
			);

			let element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("horizontal");

			rerender(<FieldWrapper orientation="vertical">Content</FieldWrapper>);
			element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("vertical");
			expect(element).not.toHaveClass("horizontal");
		});
	});

	describe("id prop", () => {
		it("should not set an id attribute when omitted", () => {
			const { container } = render(<FieldWrapper>Content</FieldWrapper>);

			const element = container.firstChild as HTMLElement;
			expect(element).not.toHaveAttribute("id");
		});

		it("should forward the id attribute when provided", () => {
			render(<FieldWrapper id="custom-id">Content</FieldWrapper>);

			expect(document.getElementById("custom-id")).toBeInTheDocument();
		});
	});

	describe("className merge", () => {
		it("should preserve the base className", () => {
			const { container } = render(<FieldWrapper>Content</FieldWrapper>);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynFieldWrapper");
		});

		it("should merge an external className with the base className", () => {
			const { container } = render(
				<FieldWrapper className="custom-class">Content</FieldWrapper>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynFieldWrapper");
			expect(element).toHaveClass("custom-class");
		});

		it("should combine className with the orientation class", () => {
			const { container } = render(
				<FieldWrapper orientation="horizontalReverse" className="custom-class">
					Content
				</FieldWrapper>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass(
				"arkynFieldWrapper",
				"horizontalReverse",
				"custom-class",
			);
		});

		it("should still render base classes when className is omitted", () => {
			const { container } = render(<FieldWrapper>Content</FieldWrapper>);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynFieldWrapper");
			expect(element).toHaveClass("vertical");
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the root element", () => {
			render(
				<FieldWrapper data-testid="field-wrapper-root" aria-label="Email field">
					Content
				</FieldWrapper>,
			);

			const element = screen.getByTestId("field-wrapper-root");
			expect(element).toHaveAttribute("aria-label", "Email field");
		});

		it("should forward inline style", () => {
			const { container } = render(
				<FieldWrapper style={{ marginTop: "10px" }}>Content</FieldWrapper>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveStyle({ marginTop: "10px" });
		});
	});

	describe("edge cases", () => {
		it("should handle null children without throwing", () => {
			const { container } = render(<FieldWrapper>{null}</FieldWrapper>);

			expect(container.querySelector(".arkynFieldWrapper")).toBeInTheDocument();
		});

		it("should handle undefined children without throwing", () => {
			const { container } = render(<FieldWrapper>{undefined}</FieldWrapper>);

			expect(container.querySelector(".arkynFieldWrapper")).toBeInTheDocument();
		});

		it("should handle empty string children", () => {
			const { container } = render(<FieldWrapper>{""}</FieldWrapper>);

			const element = container.querySelector(".arkynFieldWrapper");
			expect(element).toBeInTheDocument();
			expect(element).toHaveTextContent("");
		});

		it("should handle an empty className string", () => {
			const { container } = render(
				<FieldWrapper className="">Content</FieldWrapper>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynFieldWrapper");
		});
	});
});
