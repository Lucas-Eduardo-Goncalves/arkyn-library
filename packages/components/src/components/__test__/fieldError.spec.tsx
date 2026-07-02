import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FieldError } from "../fieldError";

describe("FieldError", () => {
	it("should render without errors", () => {
		render(<FieldError>This field is required</FieldError>);

		expect(screen.getByText("This field is required")).toBeInTheDocument();
	});

	it("should render a string child", () => {
		render(<FieldError>Invalid email address</FieldError>);

		expect(screen.getByText("Invalid email address")).toBeInTheDocument();
	});

	it("should render a JSX child", () => {
		render(
			<FieldError>
				<span>Custom error markup</span>
			</FieldError>,
		);

		expect(screen.getByText("Custom error markup")).toBeInTheDocument();
	});

	it("should render multiple children", () => {
		render(
			<FieldError>
				<span>Part one</span>
				<span>Part two</span>
			</FieldError>,
		);

		expect(screen.getByText("Part one")).toBeInTheDocument();
		expect(screen.getByText("Part two")).toBeInTheDocument();
	});

	it("should render as a strong element", () => {
		render(<FieldError>Required field</FieldError>);

		const element = screen.getByText("Required field");
		expect(element.tagName).toBe("STRONG");
	});

	it("should return null when children is undefined", () => {
		const { container } = render(<FieldError>{undefined}</FieldError>);

		expect(container).toBeEmptyDOMElement();
	});

	it("should return null when children is an empty string", () => {
		const { container } = render(<FieldError>{""}</FieldError>);

		expect(container).toBeEmptyDOMElement();
	});

	it("should return null when children is null", () => {
		const { container } = render(<FieldError>{null}</FieldError>);

		expect(container).toBeEmptyDOMElement();
	});

	it("should return null when children is false", () => {
		const { container } = render(<FieldError>{false}</FieldError>);

		expect(container).toBeEmptyDOMElement();
	});

	it("should return null when children is zero", () => {
		const { container } = render(<FieldError>{0}</FieldError>);

		expect(container).toBeEmptyDOMElement();
	});

	it("should render when children is a non-empty number", () => {
		render(<FieldError>{404}</FieldError>);

		expect(screen.getByText("404")).toBeInTheDocument();
	});

	it("should render when no optional props are provided besides children", () => {
		render(<FieldError>Minimal usage</FieldError>);

		const element = screen.getByText("Minimal usage");
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass("arkynFieldError");
	});

	it("should apply the base class name by default", () => {
		render(<FieldError>Base class check</FieldError>);

		expect(screen.getByText("Base class check")).toHaveClass("arkynFieldError");
	});

	it("should merge a custom className with the base class name", () => {
		render(
			<FieldError className="custom-class">Merged class check</FieldError>,
		);

		const element = screen.getByText("Merged class check");
		expect(element).toHaveClass("arkynFieldError");
		expect(element).toHaveClass("custom-class");
	});

	it("should include the base class name when no className is provided", () => {
		render(<FieldError>No custom className</FieldError>);

		const element = screen.getByText("No custom className");
		expect(element).toHaveClass("arkynFieldError");
		expect(element.className.startsWith("arkynFieldError")).toBe(true);
	});

	it("should forward arbitrary HTML attributes to the underlying element", () => {
		render(
			<FieldError data-testid="field-error" id="email-error">
				Attribute forwarding
			</FieldError>,
		);

		const element = screen.getByTestId("field-error");
		expect(element).toHaveAttribute("id", "email-error");
	});

	it("should support role and aria attributes for accessibility", () => {
		render(
			<FieldError role="alert" aria-live="assertive">
				Accessible error
			</FieldError>,
		);

		const element = screen.getByRole("alert");
		expect(element).toHaveTextContent("Accessible error");
		expect(element).toHaveAttribute("aria-live", "assertive");
	});

	it("should not have an implicit alert role when none is provided", () => {
		render(<FieldError>No implicit role</FieldError>);

		const element = screen.getByText("No implicit role");
		expect(element).not.toHaveAttribute("role");
	});

	it("should apply inline styles when provided", () => {
		render(
			<FieldError style={{ color: "red" }}>Styled error message</FieldError>,
		);

		expect(screen.getByText("Styled error message")).toHaveStyle({
			color: "rgb(255, 0, 0)",
		});
	});

	it("should support id association via aria-describedby on another element", () => {
		render(
			<>
				<input aria-describedby="email-error" />
				<FieldError id="email-error">Email is invalid</FieldError>
			</>,
		);

		const input = screen.getByRole("textbox");
		expect(input).toHaveAttribute("aria-describedby", "email-error");
		expect(screen.getByText("Email is invalid")).toHaveAttribute(
			"id",
			"email-error",
		);
	});
});
