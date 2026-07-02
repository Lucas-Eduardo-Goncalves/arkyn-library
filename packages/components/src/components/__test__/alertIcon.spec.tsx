import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AlertContainer } from "../../alertContainer";
import { AlertIcon } from "../index";

describe("AlertIcon", () => {
	// RTL's auto-cleanup relies on a global afterEach, which isn't registered
	// since this project doesn't enable vitest "globals" — clean up manually
	// so repeated data-testid queries across tests don't collide.
	afterEach(() => {
		cleanup();
	});

	it("should render without errors inside an AlertContainer", () => {
		const { container } = render(
			<AlertContainer scheme="info">
				<AlertIcon />
			</AlertContainer>,
		);

		expect(container.querySelector("svg")).toBeInTheDocument();
	});

	it("should render as an svg element", () => {
		const { container } = render(
			<AlertContainer scheme="info">
				<AlertIcon />
			</AlertContainer>,
		);

		expect(container.querySelector("svg")?.tagName).toBe("svg");
	});

	it.each([
		["success", "lucide-circle-check"],
		["danger", "lucide-circle-x"],
		["warning", "lucide-triangle-alert"],
		["info", "lucide-info"],
	] as const)("should render the '%s' scheme default icon", (scheme, lucideClass) => {
		const { container } = render(
			<AlertContainer scheme={scheme}>
				<AlertIcon />
			</AlertContainer>,
		);

		const svg = container.querySelector("svg");
		expect(svg).toHaveClass(lucideClass);
	});

	it("should not render icons from other schemes", () => {
		const { container } = render(
			<AlertContainer scheme="success">
				<AlertIcon />
			</AlertContainer>,
		);

		const svg = container.querySelector("svg");
		expect(svg).not.toHaveClass("lucide-circle-x");
		expect(svg).not.toHaveClass("lucide-triangle-alert");
		expect(svg).not.toHaveClass("lucide-info");
	});

	it("should switch the rendered icon when the scheme changes", () => {
		const { container, rerender } = render(
			<AlertContainer scheme="success">
				<AlertIcon />
			</AlertContainer>,
		);

		expect(container.querySelector("svg")).toHaveClass("lucide-circle-check");

		rerender(
			<AlertContainer scheme="danger">
				<AlertIcon />
			</AlertContainer>,
		);

		expect(container.querySelector("svg")).toHaveClass("lucide-circle-x");
		expect(container.querySelector("svg")).not.toHaveClass(
			"lucide-circle-check",
		);
	});

	it("should apply the base class name", () => {
		const { container } = render(
			<AlertContainer scheme="info">
				<AlertIcon />
			</AlertContainer>,
		);

		expect(container.querySelector("svg")).toHaveClass("arkynAlertIcon");
	});

	it("should apply the scheme class name alongside the base class name", () => {
		const { container } = render(
			<AlertContainer scheme="warning">
				<AlertIcon />
			</AlertContainer>,
		);

		const svg = container.querySelector("svg");
		expect(svg).toHaveClass("arkynAlertIcon");
		expect(svg).toHaveClass("warning");
	});

	it("should merge a custom className with the base and scheme class names", () => {
		render(
			<AlertContainer scheme="danger">
				<AlertIcon className="custom-icon" data-testid="alert-icon" />
			</AlertContainer>,
		);

		const svg = screen.getByTestId("alert-icon");
		expect(svg).toHaveClass("arkynAlertIcon");
		expect(svg).toHaveClass("danger");
		expect(svg).toHaveClass("custom-icon");
	});

	it("should include the literal 'undefined' text in className when no className is provided", () => {
		render(
			<AlertContainer scheme="info">
				<AlertIcon data-testid="alert-icon" />
			</AlertContainer>,
		);

		expect(screen.getByTestId("alert-icon").getAttribute("class")).toBe(
			"lucide lucide-info arkynAlertIcon info undefined",
		);
	});

	it("should render with an empty string className", () => {
		render(
			<AlertContainer scheme="info">
				<AlertIcon className="" data-testid="alert-icon" />
			</AlertContainer>,
		);

		expect(screen.getByTestId("alert-icon")).toHaveClass("arkynAlertIcon");
	});

	it("should forward standard svg attributes such as size and color", () => {
		render(
			<AlertContainer scheme="info">
				<AlertIcon data-testid="alert-icon" size={32} color="red" />
			</AlertContainer>,
		);

		const svg = screen.getByTestId("alert-icon");
		expect(svg).toHaveAttribute("width", "32");
		expect(svg).toHaveAttribute("height", "32");
		expect(svg).toHaveAttribute("stroke", "red");
	});

	it("should forward the strokeWidth prop", () => {
		render(
			<AlertContainer scheme="info">
				<AlertIcon data-testid="alert-icon" strokeWidth={4} />
			</AlertContainer>,
		);

		expect(screen.getByTestId("alert-icon")).toHaveAttribute(
			"stroke-width",
			"4",
		);
	});

	it("should forward aria attributes", () => {
		render(
			<AlertContainer scheme="info">
				<AlertIcon data-testid="alert-icon" aria-label="Information" />
			</AlertContainer>,
		);

		expect(screen.getByTestId("alert-icon")).toHaveAttribute(
			"aria-label",
			"Information",
		);
	});

	it("should be hidden from accessibility tree by default", () => {
		render(
			<AlertContainer scheme="info">
				<AlertIcon data-testid="alert-icon" />
			</AlertContainer>,
		);

		expect(screen.getByTestId("alert-icon")).toHaveAttribute(
			"aria-hidden",
			"true",
		);
	});

	it("should allow overriding aria-hidden", () => {
		render(
			<AlertContainer scheme="info">
				<AlertIcon data-testid="alert-icon" aria-hidden="false" />
			</AlertContainer>,
		);

		expect(screen.getByTestId("alert-icon")).toHaveAttribute(
			"aria-hidden",
			"false",
		);
	});

	it("should apply inline styles passed via style prop", () => {
		render(
			<AlertContainer scheme="info">
				<AlertIcon data-testid="alert-icon" style={{ marginTop: "10px" }} />
			</AlertContainer>,
		);

		expect(screen.getByTestId("alert-icon")).toHaveStyle({
			marginTop: "10px",
		});
	});

	it("should render alongside sibling alert sub-components", () => {
		render(
			<AlertContainer scheme="success">
				<AlertIcon data-testid="alert-icon" />
				<span>Operation completed</span>
			</AlertContainer>,
		);

		expect(screen.getByTestId("alert-icon")).toBeInTheDocument();
		expect(screen.getByText("Operation completed")).toBeInTheDocument();
	});
});
