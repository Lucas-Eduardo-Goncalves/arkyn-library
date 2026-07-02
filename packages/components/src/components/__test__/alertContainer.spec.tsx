import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AlertContainer } from "../alert/alertContainer";
import { AlertDescription } from "../alert/alertDescription";
import { AlertTitle } from "../alert/alertTitle";

describe("AlertContainer", () => {
	it("should render without errors", () => {
		render(<AlertContainer scheme="info">Content</AlertContainer>);

		expect(screen.getByText("Content")).toBeInTheDocument();
	});

	it("should render string children", () => {
		render(<AlertContainer scheme="info">Simple text</AlertContainer>);

		expect(screen.getByText("Simple text")).toBeInTheDocument();
	});

	it("should render JSX children", () => {
		render(
			<AlertContainer scheme="info">
				<span>JSX child</span>
			</AlertContainer>,
		);

		expect(screen.getByText("JSX child")).toBeInTheDocument();
	});

	it("should render multiple children", () => {
		render(
			<AlertContainer scheme="info">
				<span>First</span>
				<span>Second</span>
			</AlertContainer>,
		);

		expect(screen.getByText("First")).toBeInTheDocument();
		expect(screen.getByText("Second")).toBeInTheDocument();
	});

	it("should render without children", () => {
		const { container } = render(<AlertContainer scheme="info" />);

		expect(container.querySelector(".arkynAlertContainer")).toBeInTheDocument();
	});

	it.each([
		"success",
		"danger",
		"warning",
		"info",
	] as const)("should apply the '%s' scheme class", (scheme) => {
		const { container } = render(
			<AlertContainer scheme={scheme}>Content</AlertContainer>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass(scheme);
	});

	it("should not apply classes from other schemes", () => {
		const { container } = render(
			<AlertContainer scheme="success">Content</AlertContainer>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).not.toHaveClass("danger");
		expect(element).not.toHaveClass("warning");
		expect(element).not.toHaveClass("info");
	});

	it("should preserve the base className", () => {
		const { container } = render(
			<AlertContainer scheme="info">Content</AlertContainer>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("arkynAlertContainer");
	});

	it("should merge an external className with the base className", () => {
		const { container } = render(
			<AlertContainer scheme="info" className="custom-class">
				Content
			</AlertContainer>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("arkynAlertContainer");
		expect(element).toHaveClass("custom-class");
		expect(element).toHaveClass("info");
	});

	it("should still render base classes when className is omitted", () => {
		const { container } = render(
			<AlertContainer scheme="info">Content</AlertContainer>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("arkynAlertContainer");
		expect(element).toHaveClass("info");
		expect(element).toHaveClass("nonExistsAlertTitle");
	});

	it("should apply 'nonExistsAlertTitle' when there is no AlertTitle among children", () => {
		const { container } = render(
			<AlertContainer scheme="info">
				<span>No title here</span>
			</AlertContainer>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("nonExistsAlertTitle");
		expect(element).not.toHaveClass("existsAlertTitle");
	});

	it("should apply 'nonExistsAlertTitle' when there are no children at all", () => {
		const { container } = render(<AlertContainer scheme="info" />);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("nonExistsAlertTitle");
	});

	it("should apply 'existsAlertTitle' when AlertTitle is a direct child", () => {
		const { container } = render(
			<AlertContainer scheme="info">
				<AlertTitle>Title</AlertTitle>
			</AlertContainer>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("existsAlertTitle");
		expect(element).not.toHaveClass("nonExistsAlertTitle");
	});

	it("should apply 'existsAlertTitle' when AlertTitle is nested inside another element", () => {
		const { container } = render(
			<AlertContainer scheme="info">
				<div>
					<span>
						<AlertTitle>Nested title</AlertTitle>
					</span>
				</div>
			</AlertContainer>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("existsAlertTitle");
		expect(element).not.toHaveClass("nonExistsAlertTitle");
	});

	it("should apply 'existsAlertTitle' when AlertTitle is present among sibling elements", () => {
		const { container } = render(
			<AlertContainer scheme="info">
				<AlertTitle>Title</AlertTitle>
				<AlertDescription>Description</AlertDescription>
			</AlertContainer>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("existsAlertTitle");
	});

	it("should apply 'existsAlertTitle' when AlertTitle is found inside an array of children", () => {
		const items = [
			<span key="a">Item A</span>,
			<AlertTitle key="b">Title in array</AlertTitle>,
		];

		const { container } = render(
			<AlertContainer scheme="info">{items}</AlertContainer>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("existsAlertTitle");
	});

	it("should render all children content passed through", () => {
		render(
			<AlertContainer scheme="danger">
				<AlertTitle>Payment failed</AlertTitle>
				<AlertDescription>Please try again.</AlertDescription>
			</AlertContainer>,
		);

		expect(screen.getByText("Payment failed")).toBeInTheDocument();
		expect(screen.getByText("Please try again.")).toBeInTheDocument();
	});

	it("should spread additional HTML attributes onto the root element", () => {
		render(
			<AlertContainer scheme="info" data-testid="alert-root" aria-label="Alert">
				Content
			</AlertContainer>,
		);

		const element = screen.getByTestId("alert-root");
		expect(element).toHaveAttribute("aria-label", "Alert");
	});

	it("should render as a div element", () => {
		const { container } = render(
			<AlertContainer scheme="info">Content</AlertContainer>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element.tagName).toBe("DIV");
	});

	it("should handle null children as not containing an AlertTitle", () => {
		const { container } = render(
			<AlertContainer scheme="info">{null}</AlertContainer>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("nonExistsAlertTitle");
	});

	it("should handle boolean and undefined children without throwing", () => {
		const { container } = render(
			<AlertContainer scheme="info">
				{false}
				{undefined}
				<span>Visible</span>
			</AlertContainer>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element).toHaveClass("nonExistsAlertTitle");
		expect(screen.getByText("Visible")).toBeInTheDocument();
	});
});
