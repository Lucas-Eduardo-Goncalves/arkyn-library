import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AlertTitle } from "../alert/alertTitle";

afterEach(() => {
	cleanup();
});

describe("AlertTitle", () => {
	it("should render without errors", () => {
		render(<AlertTitle>Title text</AlertTitle>);

		expect(screen.getByText("Title text")).toBeInTheDocument();
	});

	it("should render as a div element", () => {
		render(<AlertTitle>Content</AlertTitle>);

		const element = screen.getByText("Content");
		expect(element.tagName).toBe("DIV");
	});

	it("should apply the base class name", () => {
		render(<AlertTitle>Content</AlertTitle>);

		expect(screen.getByText("Content")).toHaveClass("arkynAlertTitle");
	});

	it("should render string children", () => {
		render(<AlertTitle>Simple text</AlertTitle>);

		expect(screen.getByText("Simple text")).toBeInTheDocument();
	});

	it("should render JSX children", () => {
		render(
			<AlertTitle>
				<span data-testid="child">Nested content</span>
			</AlertTitle>,
		);

		expect(screen.getByTestId("child")).toBeInTheDocument();
	});

	it("should render multiple children elements", () => {
		render(
			<AlertTitle>
				<span data-testid="first">First</span>
				<span data-testid="second">Second</span>
			</AlertTitle>,
		);

		expect(screen.getByTestId("first")).toBeInTheDocument();
		expect(screen.getByTestId("second")).toBeInTheDocument();
	});

	it("should render conditional children correctly", () => {
		const showExtra = false;

		render(
			<AlertTitle>
				<span data-testid="always">Always here</span>
				{showExtra && <span data-testid="conditional">Conditional</span>}
			</AlertTitle>,
		);

		expect(screen.getByTestId("always")).toBeInTheDocument();
		expect(screen.queryByTestId("conditional")).not.toBeInTheDocument();
	});

	it("should render without children", () => {
		const { container } = render(<AlertTitle />);

		const element = container.firstChild as HTMLElement;
		expect(element).toBeInTheDocument();
		expect(element).toBeEmptyDOMElement();
	});

	it("should render with an empty string as children", () => {
		const { container } = render(<AlertTitle>{""}</AlertTitle>);

		const element = container.firstChild as HTMLElement;
		expect(element).toBeInTheDocument();
		expect(element).toBeEmptyDOMElement();
	});

	it("should merge external className with the base class name", () => {
		render(<AlertTitle className="custom-class">Content</AlertTitle>);

		const element = screen.getByText("Content");
		expect(element).toHaveClass("arkynAlertTitle");
		expect(element).toHaveClass("custom-class");
	});

	it("should render only the base class name string when no className is provided", () => {
		render(<AlertTitle>Content</AlertTitle>);

		const element = screen.getByText("Content");
		expect(element).toHaveClass("arkynAlertTitle");
		expect(element.className).toBe("arkynAlertTitle undefined");
	});

	it("should support multiple external classes", () => {
		render(<AlertTitle className="class-one class-two">Content</AlertTitle>);

		const element = screen.getByText("Content");
		expect(element).toHaveClass("arkynAlertTitle");
		expect(element).toHaveClass("class-one");
		expect(element).toHaveClass("class-two");
	});

	it("should spread additional HTML attributes onto the div", () => {
		render(
			<AlertTitle id="alert-title" data-testid="alert-title-el">
				Content
			</AlertTitle>,
		);

		const element = screen.getByTestId("alert-title-el");
		expect(element).toHaveAttribute("id", "alert-title");
	});

	it("should support aria attributes", () => {
		render(<AlertTitle aria-label="Alert title">Content</AlertTitle>);

		expect(screen.getByLabelText("Alert title")).toBeInTheDocument();
	});

	it("should apply inline styles received via props", () => {
		render(
			<AlertTitle style={{ color: "rgb(255, 0, 0)" }}>Content</AlertTitle>,
		);

		const element = screen.getByText("Content");
		expect(element).toHaveStyle({ color: "rgb(255, 0, 0)" });
	});

	it("should call onClick handler when clicked", async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();

		render(<AlertTitle onClick={handleClick}>Content</AlertTitle>);

		await user.click(screen.getByText("Content"));

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("should not call onClick handler when not clicked", () => {
		const handleClick = vi.fn();

		render(<AlertTitle onClick={handleClick}>Content</AlertTitle>);

		expect(handleClick).not.toHaveBeenCalled();
	});

	it("should call onClick handler with the event object", async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();

		render(<AlertTitle onClick={handleClick}>Content</AlertTitle>);

		await user.click(screen.getByText("Content"));

		expect(handleClick).toHaveBeenCalledWith(
			expect.objectContaining({ type: "click" }),
		);
	});

	// it("should forward a ref to the underlying div element", () => {
	// 	const ref = createRef<HTMLDivElement>();

	// 	render(<AlertTitle ref={ref}>Content</AlertTitle>);

	// 	expect(ref.current).toBeInstanceOf(HTMLDivElement);
	// 	expect(ref.current?.textContent).toBe("Content");
	// });
});
