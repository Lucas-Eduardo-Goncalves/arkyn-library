import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AlertDescription } from "../index";

afterEach(() => {
	cleanup();
});

describe("AlertDescription", () => {
	it("should render without errors", () => {
		render(<AlertDescription>Description text</AlertDescription>);

		expect(screen.getByText("Description text")).toBeInTheDocument();
	});

	it("should render as a div element", () => {
		render(<AlertDescription>Content</AlertDescription>);

		const element = screen.getByText("Content");
		expect(element.tagName).toBe("DIV");
	});

	it("should apply the base class name", () => {
		render(<AlertDescription>Content</AlertDescription>);

		expect(screen.getByText("Content")).toHaveClass("arkynAlertDescription");
	});

	it("should render string children", () => {
		render(<AlertDescription>Simple text</AlertDescription>);

		expect(screen.getByText("Simple text")).toBeInTheDocument();
	});

	it("should render JSX children", () => {
		render(
			<AlertDescription>
				<span data-testid="child">Nested content</span>
			</AlertDescription>,
		);

		expect(screen.getByTestId("child")).toBeInTheDocument();
	});

	it("should render multiple children elements", () => {
		render(
			<AlertDescription>
				<span data-testid="first">First</span>
				<span data-testid="second">Second</span>
			</AlertDescription>,
		);

		expect(screen.getByTestId("first")).toBeInTheDocument();
		expect(screen.getByTestId("second")).toBeInTheDocument();
	});

	it("should render conditional children correctly", () => {
		const showExtra = false;

		render(
			<AlertDescription>
				<span data-testid="always">Always here</span>
				{showExtra && <span data-testid="conditional">Conditional</span>}
			</AlertDescription>,
		);

		expect(screen.getByTestId("always")).toBeInTheDocument();
		expect(screen.queryByTestId("conditional")).not.toBeInTheDocument();
	});

	it("should render without children", () => {
		const { container } = render(<AlertDescription />);

		const element = container.firstChild as HTMLElement;
		expect(element).toBeInTheDocument();
		expect(element).toBeEmptyDOMElement();
	});

	it("should render with an empty string as children", () => {
		const { container } = render(<AlertDescription>{""}</AlertDescription>);

		const element = container.firstChild as HTMLElement;
		expect(element).toBeInTheDocument();
		expect(element).toBeEmptyDOMElement();
	});

	it("should merge external className with the base class name", () => {
		render(
			<AlertDescription className="custom-class">Content</AlertDescription>,
		);

		const element = screen.getByText("Content");
		expect(element).toHaveClass("arkynAlertDescription");
		expect(element).toHaveClass("custom-class");
	});

	it("should render only the base class name string when no className is provided", () => {
		render(<AlertDescription>Content</AlertDescription>);

		const element = screen.getByText("Content");
		expect(element).toHaveClass("arkynAlertDescription");
		expect(element.className).toBe("arkynAlertDescription undefined");
	});

	it("should support multiple external classes", () => {
		render(
			<AlertDescription className="class-one class-two">
				Content
			</AlertDescription>,
		);

		const element = screen.getByText("Content");
		expect(element).toHaveClass("arkynAlertDescription");
		expect(element).toHaveClass("class-one");
		expect(element).toHaveClass("class-two");
	});

	it("should spread additional HTML attributes onto the div", () => {
		render(
			<AlertDescription id="alert-desc" data-testid="alert-description">
				Content
			</AlertDescription>,
		);

		const element = screen.getByTestId("alert-description");
		expect(element).toHaveAttribute("id", "alert-desc");
	});

	it("should support aria attributes", () => {
		render(
			<AlertDescription aria-label="Alert description">
				Content
			</AlertDescription>,
		);

		expect(screen.getByLabelText("Alert description")).toBeInTheDocument();
	});

	it("should apply inline styles received via props", () => {
		render(
			<AlertDescription style={{ color: "rgb(255, 0, 0)" }}>
				Content
			</AlertDescription>,
		);

		const element = screen.getByText("Content");
		expect(element).toHaveStyle({ color: "rgb(255, 0, 0)" });
	});

	it("should call onClick handler when clicked", async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();

		render(<AlertDescription onClick={handleClick}>Content</AlertDescription>);

		await user.click(screen.getByText("Content"));

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("should not call onClick handler when not clicked", () => {
		const handleClick = vi.fn();

		render(<AlertDescription onClick={handleClick}>Content</AlertDescription>);

		expect(handleClick).not.toHaveBeenCalled();
	});

	it("should call onClick handler with the event object", async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();

		render(<AlertDescription onClick={handleClick}>Content</AlertDescription>);

		await user.click(screen.getByText("Content"));

		expect(handleClick).toHaveBeenCalledWith(
			expect.objectContaining({ type: "click" }),
		);
	});

	it("should forward a ref to the underlying div element", () => {
		const ref = createRef<HTMLDivElement>();

		render(<AlertDescription ref={ref}>Content</AlertDescription>);

		expect(ref.current).toBeInstanceOf(HTMLDivElement);
		expect(ref.current?.textContent).toBe("Content");
	});
});
