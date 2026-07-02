import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AlertContent } from "../alert/alertContent";

describe("AlertContent", () => {
	// RTL's auto-cleanup relies on a global afterEach, which isn't registered
	// since this project doesn't enable vitest "globals" — clean up manually
	// so repeated data-testid queries across tests don't collide.
	afterEach(() => {
		cleanup();
	});

	it("should render without errors", () => {
		render(<AlertContent data-testid="alert-content" />);

		expect(screen.getByTestId("alert-content")).toBeInTheDocument();
	});

	it("should render as a div element", () => {
		render(<AlertContent data-testid="alert-content" />);

		expect(screen.getByTestId("alert-content").tagName).toBe("DIV");
	});

	it("should render string children", () => {
		render(<AlertContent>Simple text content</AlertContent>);

		expect(screen.getByText("Simple text content")).toBeInTheDocument();
	});

	it("should render JSX children", () => {
		render(
			<AlertContent>
				<span>JSX child</span>
			</AlertContent>,
		);

		expect(screen.getByText("JSX child")).toBeInTheDocument();
	});

	it("should render multiple children elements", () => {
		render(
			<AlertContent>
				<h1>Title</h1>
				<p>Description</p>
			</AlertContent>,
		);

		expect(screen.getByText("Title")).toBeInTheDocument();
		expect(screen.getByText("Description")).toBeInTheDocument();
	});

	it("should render conditional children when condition is true", () => {
		const showExtra = true;

		render(
			<AlertContent>
				<p>Base</p>
				{showExtra && <p>Extra</p>}
			</AlertContent>,
		);

		expect(screen.getByText("Base")).toBeInTheDocument();
		expect(screen.getByText("Extra")).toBeInTheDocument();
	});

	it("should not render conditional children when condition is false", () => {
		const showExtra = false;

		render(
			<AlertContent>
				<p>Base</p>
				{showExtra && <p>Extra</p>}
			</AlertContent>,
		);

		expect(screen.getByText("Base")).toBeInTheDocument();
		expect(screen.queryByText("Extra")).not.toBeInTheDocument();
	});

	it("should render without children", () => {
		render(<AlertContent data-testid="alert-content" />);

		expect(screen.getByTestId("alert-content")).toBeEmptyDOMElement();
	});

	it("should apply the base class name", () => {
		render(<AlertContent data-testid="alert-content" />);

		expect(screen.getByTestId("alert-content")).toHaveClass(
			"arkynAlertContent",
		);
	});

	it("should merge a custom className with the base class name", () => {
		render(
			<AlertContent data-testid="alert-content" className="custom-class" />,
		);

		const element = screen.getByTestId("alert-content");
		expect(element).toHaveClass("arkynAlertContent");
		expect(element).toHaveClass("custom-class");
	});

	it("should include the literal 'undefined' text in className when no className is provided", () => {
		render(<AlertContent data-testid="alert-content" />);

		expect(screen.getByTestId("alert-content").className).toBe(
			"arkynAlertContent undefined",
		);
	});

	it("should support multiple custom class names", () => {
		render(
			<AlertContent
				data-testid="alert-content"
				className="class-one class-two"
			/>,
		);

		const element = screen.getByTestId("alert-content");
		expect(element).toHaveClass("arkynAlertContent");
		expect(element).toHaveClass("class-one");
		expect(element).toHaveClass("class-two");
	});

	it("should render with an empty string className", () => {
		render(<AlertContent data-testid="alert-content" className="" />);

		expect(screen.getByTestId("alert-content")).toHaveClass(
			"arkynAlertContent",
		);
	});

	it("should forward standard div HTML attributes", () => {
		render(
			<AlertContent
				data-testid="alert-content"
				id="alert-content-id"
				title="Content title"
			/>,
		);

		const element = screen.getByTestId("alert-content");
		expect(element).toHaveAttribute("id", "alert-content-id");
		expect(element).toHaveAttribute("title", "Content title");
	});

	it("should forward aria attributes", () => {
		render(
			<AlertContent
				data-testid="alert-content"
				aria-label="Alert content region"
				aria-describedby="alert-desc-id"
			/>,
		);

		const element = screen.getByTestId("alert-content");
		expect(element).toHaveAttribute("aria-label", "Alert content region");
		expect(element).toHaveAttribute("aria-describedby", "alert-desc-id");
	});

	it("should apply inline styles passed via style prop", () => {
		render(
			<AlertContent
				data-testid="alert-content"
				style={{ marginTop: "10px" }}
			/>,
		);

		expect(screen.getByTestId("alert-content")).toHaveStyle({
			marginTop: "10px",
		});
	});

	// it("should forward a ref to the underlying div element", () => {
	// 	const ref = createRef<HTMLDivElement>();

	// 	render(<AlertContent ref={ref} data-testid="alert-content" />);

	// 	expect(ref.current).toBeInstanceOf(HTMLDivElement);
	// 	expect(ref.current).toBe(screen.getByTestId("alert-content"));
	// });

	it("should render nested component-like children together", () => {
		function Title({ children }: { children: React.ReactNode }) {
			return <h2>{children}</h2>;
		}
		function Description({ children }: { children: React.ReactNode }) {
			return <p>{children}</p>;
		}

		render(
			<AlertContent>
				<Title>Session expiring</Title>
				<Description>You will be logged out in 5 minutes.</Description>
			</AlertContent>,
		);

		expect(screen.getByText("Session expiring")).toBeInTheDocument();
		expect(
			screen.getByText("You will be logged out in 5 minutes."),
		).toBeInTheDocument();
	});
});
