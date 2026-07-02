import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Divider } from "../index";

describe("Divider", () => {
	it("should render without errors", () => {
		const { container } = render(<Divider />);

		expect(container.querySelector(".arkynDivider")).toBeInTheDocument();
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(<Divider />);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("arkynDivider");
		expect(element).toHaveClass("horizontal");
	});

	it("should render correctly with all properties filled", () => {
		const { container } = render(
			<Divider
				orientation="vertical"
				className="custom-class"
				id="my-divider"
			/>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("arkynDivider", "vertical", "custom-class");
		expect(element).toHaveAttribute("id", "my-divider");
	});

	it("should render as a div element", () => {
		const { container } = render(<Divider />);

		const element = container.firstChild as HTMLElement;
		expect(element.tagName).toBe("DIV");
	});

	describe("orientation prop", () => {
		it("should apply the default 'horizontal' class when omitted", () => {
			const { container } = render(<Divider />);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("horizontal");
			expect(element).not.toHaveClass("vertical");
		});

		it("should apply the 'horizontal' class when specified explicitly", () => {
			const { container } = render(<Divider orientation="horizontal" />);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("horizontal");
			expect(element).not.toHaveClass("vertical");
		});

		it("should apply the 'vertical' class when specified", () => {
			const { container } = render(<Divider orientation="vertical" />);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("vertical");
			expect(element).not.toHaveClass("horizontal");
		});

		it("should replace the orientation class when changed", () => {
			const { container, rerender } = render(
				<Divider orientation="horizontal" />,
			);

			let element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("horizontal");

			rerender(<Divider orientation="vertical" />);
			element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("vertical");
			expect(element).not.toHaveClass("horizontal");
		});
	});

	describe("className merge", () => {
		it("should preserve the base className", () => {
			const { container } = render(<Divider />);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynDivider");
		});

		it("should merge an external className with the base className", () => {
			const { container } = render(<Divider className="custom-class" />);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynDivider");
			expect(element).toHaveClass("custom-class");
		});

		it("should still render base classes when className is omitted", () => {
			const { container } = render(<Divider />);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynDivider");
			expect(element).toHaveClass("horizontal");
		});

		it("should combine className with the orientation class", () => {
			const { container } = render(
				<Divider orientation="vertical" className="custom-class" />,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynDivider", "vertical", "custom-class");
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the root element", () => {
			const { container } = render(
				<Divider data-testid="divider-root" aria-hidden="true" />,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveAttribute("data-testid", "divider-root");
			expect(element).toHaveAttribute("aria-hidden", "true");
		});

		it("should forward id attribute", () => {
			render(<Divider id="divider-id" />);

			expect(document.getElementById("divider-id")).toBeInTheDocument();
		});

		it("should forward inline style", () => {
			const { container } = render(<Divider style={{ marginTop: "10px" }} />);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveStyle({ marginTop: "10px" });
		});

		it("should merge inline style with the element's own styling", () => {
			const { container } = render(
				<Divider orientation="vertical" style={{ height: "50px" }} />,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("vertical");
			expect(element).toHaveStyle({ height: "50px" });
		});

		it("should support role attribute for accessibility", () => {
			render(<Divider role="separator" data-testid="divider-separator" />);

			expect(document.querySelector('[role="separator"]')).toBeInTheDocument();
		});

		it("should support aria-orientation attribute", () => {
			const { container } = render(
				<Divider
					orientation="vertical"
					aria-orientation="vertical"
					role="separator"
				/>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveAttribute("aria-orientation", "vertical");
		});
	});

	describe("edge cases", () => {
		it("should handle an empty className string", () => {
			const { container } = render(<Divider className="" />);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynDivider");
			expect(element.className.trim()).toBe(element.className);
		});

		it("should not render any children content", () => {
			const { container } = render(<Divider />);

			const element = container.firstChild as HTMLElement;
			expect(element.textContent).toBe("");
		});

		it("should handle undefined orientation by falling back to default", () => {
			const { container } = render(<Divider orientation={undefined} />);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("horizontal");
		});
	});

	describe("orientation and className interaction", () => {
		it("should apply both horizontal orientation and custom className together", () => {
			const { container } = render(
				<Divider orientation="horizontal" className="section-divider" />,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass(
				"arkynDivider",
				"horizontal",
				"section-divider",
			);
		});

		it("should apply both vertical orientation and custom className together", () => {
			const { container } = render(
				<Divider orientation="vertical" className="sidebar-divider" />,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass(
				"arkynDivider",
				"vertical",
				"sidebar-divider",
			);
		});
	});
});
