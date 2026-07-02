import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FieldLabel } from "../fieldLabel";

describe("FieldLabel", () => {
	it("should render without errors", () => {
		render(<FieldLabel>Email</FieldLabel>);

		expect(screen.getByText("Email")).toBeInTheDocument();
	});

	it("should render as a label element", () => {
		render(<FieldLabel>Tag check</FieldLabel>);

		const element = screen.getByText("Tag check");
		expect(element.tagName).toBe("LABEL");
	});

	it("should render a string child", () => {
		render(<FieldLabel>Full Name</FieldLabel>);

		expect(screen.getByText("Full Name")).toBeInTheDocument();
	});

	it("should render a JSX child", () => {
		render(
			<FieldLabel>
				<span>Custom label markup</span>
			</FieldLabel>,
		);

		expect(screen.getByText("Custom label markup")).toBeInTheDocument();
	});

	it("should render multiple children", () => {
		render(
			<FieldLabel>
				<span>Part one</span>
				<span>Part two</span>
			</FieldLabel>,
		);

		expect(screen.getByText("Part one")).toBeInTheDocument();
		expect(screen.getByText("Part two")).toBeInTheDocument();
	});

	it("should render when no optional props are provided besides children", () => {
		render(<FieldLabel>Minimal usage</FieldLabel>);

		const element = screen.getByText("Minimal usage");
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass("arkynFieldLabel");
	});

	it("should render correctly with all properties filled", () => {
		render(
			<FieldLabel
				htmlFor="email"
				showAsterisk
				className="custom-class"
				id="email-label"
				data-testid="field-label"
			>
				Email Address
			</FieldLabel>,
		);

		const element = screen.getByTestId("field-label");
		expect(element).toHaveTextContent("Email Address");
		expect(element).toHaveAttribute("for", "email");
		expect(element).toHaveAttribute("id", "email-label");
		expect(element).toHaveClass("arkynFieldLabel");
		expect(element).toHaveClass("asteriskTrue");
		expect(element).toHaveClass("custom-class");
	});

	it("should default showAsterisk to false when omitted", () => {
		render(<FieldLabel>No asterisk prop</FieldLabel>);

		const element = screen.getByText("No asterisk prop");
		expect(element).toHaveClass("asteriskFalse");
		expect(element).not.toHaveClass("asteriskTrue");
	});

	it("should apply asteriskFalse class when showAsterisk is explicitly false", () => {
		render(<FieldLabel showAsterisk={false}>Optional field</FieldLabel>);

		const element = screen.getByText("Optional field");
		expect(element).toHaveClass("asteriskFalse");
		expect(element).not.toHaveClass("asteriskTrue");
	});

	it("should apply asteriskTrue class when showAsterisk is true", () => {
		render(<FieldLabel showAsterisk>Required field</FieldLabel>);

		const element = screen.getByText("Required field");
		expect(element).toHaveClass("asteriskTrue");
		expect(element).not.toHaveClass("asteriskFalse");
	});

	it("should render the asterisk indicator visually via the asteriskTrue class", () => {
		const { container } = render(
			<FieldLabel showAsterisk>Required field</FieldLabel>,
		);

		const label = container.querySelector("label");
		expect(label).toHaveClass("asteriskTrue");
	});

	it("should not include the asteriskTrue class when the asterisk is hidden", () => {
		const { container } = render(<FieldLabel>Non-required field</FieldLabel>);

		const label = container.querySelector("label");
		expect(label).not.toHaveClass("asteriskTrue");
		expect(label).toHaveClass("asteriskFalse");
	});

	it("should associate the label with a form field via htmlFor", () => {
		render(
			<>
				<FieldLabel htmlFor="username">Username</FieldLabel>
				<input id="username" />
			</>,
		);

		const input = screen.getByLabelText("Username");
		expect(input).toBeInTheDocument();
	});

	it("should not throw when htmlFor is omitted", () => {
		render(<FieldLabel>No htmlFor</FieldLabel>);

		const element = screen.getByText("No htmlFor");
		expect(element).not.toHaveAttribute("for");
	});

	it("should forward the id attribute to the underlying label element", () => {
		render(<FieldLabel id="custom-id">With id</FieldLabel>);

		expect(screen.getByText("With id")).toHaveAttribute("id", "custom-id");
	});

	it("should apply the base class name by default", () => {
		render(<FieldLabel>Base class check</FieldLabel>);

		expect(screen.getByText("Base class check")).toHaveClass("arkynFieldLabel");
	});

	it("should merge a custom className with the base class name", () => {
		render(
			<FieldLabel className="custom-class">Merged class check</FieldLabel>,
		);

		const element = screen.getByText("Merged class check");
		expect(element).toHaveClass("arkynFieldLabel");
		expect(element).toHaveClass("custom-class");
	});

	it("should preserve the asterisk state class alongside a custom className", () => {
		render(
			<FieldLabel showAsterisk className="custom-class">
				Merged with asterisk
			</FieldLabel>,
		);

		const element = screen.getByText("Merged with asterisk");
		expect(element).toHaveClass("arkynFieldLabel");
		expect(element).toHaveClass("asteriskTrue");
		expect(element).toHaveClass("custom-class");
	});

	it("should include the base class name when no className is provided", () => {
		render(<FieldLabel>No custom className</FieldLabel>);

		const element = screen.getByText("No custom className");
		expect(element.className.startsWith("arkynFieldLabel")).toBe(true);
	});

	it("should trim trailing whitespace when no custom className is provided", () => {
		render(<FieldLabel>Trimmed className</FieldLabel>);

		const element = screen.getByText("Trimmed className");
		expect(element.className.endsWith(" ")).toBe(false);
	});

	it("should forward arbitrary HTML attributes to the underlying element", () => {
		render(
			<FieldLabel data-testid="field-label-attrs" title="Field title">
				Attribute forwarding
			</FieldLabel>,
		);

		const element = screen.getByTestId("field-label-attrs");
		expect(element).toHaveAttribute("title", "Field title");
	});

	// it("should forward a ref to the underlying label element", () => {
	// 	const ref = createRef<HTMLLabelElement>();
	// 	render(<FieldLabel ref={ref}>Ref test</FieldLabel>);

	// 	expect(ref.current).not.toBeNull();
	// 	expect(ref.current?.tagName).toBe("LABEL");
	// 	expect(ref.current?.textContent).toBe("Ref test");
	// });

	it("should apply inline styles when provided", () => {
		render(<FieldLabel style={{ color: "red" }}>Styled label</FieldLabel>);

		expect(screen.getByText("Styled label")).toHaveStyle({
			color: "rgb(255, 0, 0)",
		});
	});

	it("should support aria attributes for accessibility", () => {
		render(
			<FieldLabel aria-label="Accessible label" data-testid="field-label-aria">
				Accessible content
			</FieldLabel>,
		);

		const element = screen.getByTestId("field-label-aria");
		expect(element).toHaveAttribute("aria-label", "Accessible label");
	});

	it("should render an empty string child without throwing", () => {
		const { container } = render(<FieldLabel>{""}</FieldLabel>);

		const label = container.querySelector("label");
		expect(label).toBeInTheDocument();
		expect(label).toHaveTextContent("");
	});

	it("should render when children is undefined", () => {
		const { container } = render(<FieldLabel>{undefined}</FieldLabel>);

		const label = container.querySelector("label");
		expect(label).toBeInTheDocument();
	});

	it("should render a numeric child", () => {
		render(<FieldLabel>{404}</FieldLabel>);

		expect(screen.getByText("404")).toBeInTheDocument();
	});
});
