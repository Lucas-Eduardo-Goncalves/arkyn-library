import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Save, Trash } from "lucide-react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "../index";

afterEach(() => {
	cleanup();
});

describe("Button", () => {
	it("should render without errors", () => {
		render(<Button>Click me</Button>);

		expect(
			screen.getByRole("button", { name: "Click me" }),
		).toBeInTheDocument();
	});

	it("should render string children", () => {
		render(<Button>Simple text</Button>);

		expect(screen.getByText("Simple text")).toBeInTheDocument();
	});

	it("should render JSX children", () => {
		render(
			<Button>
				<span>JSX child</span>
			</Button>,
		);

		expect(screen.getByText("JSX child")).toBeInTheDocument();
	});

	it("should render multiple children", () => {
		render(
			<Button>
				<span>First</span>
				<span>Second</span>
			</Button>,
		);

		expect(screen.getByText("First")).toBeInTheDocument();
		expect(screen.getByText("Second")).toBeInTheDocument();
	});

	it("should render without children", () => {
		render(<Button aria-label="empty-button" />);

		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("should render as a button element", () => {
		render(<Button>Click me</Button>);

		expect(screen.getByRole("button").tagName).toBe("BUTTON");
	});

	it("should render with all optional properties omitted", () => {
		render(<Button>Default</Button>);

		const button = screen.getByRole("button");
		expect(button).toHaveClass("arkynButton");
		expect(button).toHaveClass("solid");
		expect(button).toHaveClass("primary");
		expect(button).toHaveClass("md");
		expect(button).toHaveClass("loadingFalse");
		expect(button).toHaveClass("loadingTextFalse");
		expect(button).not.toBeDisabled();
	});

	it("should render with all properties filled", () => {
		const onClick = vi.fn();

		render(
			<Button
				variant="outline"
				size="lg"
				scheme="danger"
				isLoading={false}
				loadingText="Saving..."
				leftIcon={Save}
				rightIcon={Trash}
				onClick={onClick}
				className="custom-class"
				type="submit"
				aria-label="Delete item"
			>
				Delete
			</Button>,
		);

		const button = screen.getByRole("button", { name: "Delete item" });
		expect(button).toHaveClass("outline");
		expect(button).toHaveClass("danger");
		expect(button).toHaveClass("lg");
		expect(button).toHaveClass("custom-class");
		expect(button).toHaveAttribute("type", "submit");
		expect(screen.getByText("Delete")).toBeInTheDocument();
	});

	it.each([
		"xs",
		"sm",
		"md",
		"lg",
	] as const)("should apply the '%s' size class", (size) => {
		render(<Button size={size}>Click me</Button>);

		expect(screen.getByRole("button")).toHaveClass(size);
	});

	it("should default to 'md' size when size is omitted", () => {
		render(<Button>Click me</Button>);

		expect(screen.getByRole("button")).toHaveClass("md");
	});

	it.each([
		"solid",
		"outline",
		"ghost",
		"invisible",
	] as const)("should apply the '%s' variant class", (variant) => {
		render(<Button variant={variant}>Click me</Button>);

		expect(screen.getByRole("button")).toHaveClass(variant);
	});

	it("should default to 'solid' variant when variant is omitted", () => {
		render(<Button>Click me</Button>);

		expect(screen.getByRole("button")).toHaveClass("solid");
	});

	it.each([
		"primary",
		"secondary",
		"success",
		"warning",
		"danger",
		"info",
	] as const)("should apply the '%s' scheme class", (scheme) => {
		render(<Button scheme={scheme}>Click me</Button>);

		expect(screen.getByRole("button")).toHaveClass(scheme);
	});

	it("should default to 'primary' scheme when scheme is omitted", () => {
		render(<Button>Click me</Button>);

		expect(screen.getByRole("button")).toHaveClass("primary");
	});

	it("should not apply classes from other sizes, variants or schemes", () => {
		render(
			<Button size="sm" variant="ghost" scheme="success">
				Click me
			</Button>,
		);

		const button = screen.getByRole("button");
		expect(button).not.toHaveClass("xs");
		expect(button).not.toHaveClass("md");
		expect(button).not.toHaveClass("lg");
		expect(button).not.toHaveClass("solid");
		expect(button).not.toHaveClass("outline");
		expect(button).not.toHaveClass("invisible");
		expect(button).not.toHaveClass("primary");
		expect(button).not.toHaveClass("secondary");
		expect(button).not.toHaveClass("warning");
		expect(button).not.toHaveClass("danger");
		expect(button).not.toHaveClass("info");
	});

	it("should preserve the base className", () => {
		render(<Button>Click me</Button>);

		expect(screen.getByRole("button")).toHaveClass("arkynButton");
	});

	it("should merge an external className with the base className", () => {
		render(<Button className="custom-class">Click me</Button>);

		const button = screen.getByRole("button");
		expect(button).toHaveClass("arkynButton");
		expect(button).toHaveClass("custom-class");
	});

	it("should still render base classes when className is omitted", () => {
		render(<Button>Click me</Button>);

		const button = screen.getByRole("button");
		expect(button).toHaveClass("arkynButton");
		expect(button).toHaveClass("solid");
		expect(button).toHaveClass("primary");
		expect(button).toHaveClass("md");
	});

	it("should apply 'loadingFalse' class by default", () => {
		render(<Button>Click me</Button>);

		expect(screen.getByRole("button")).toHaveClass("loadingFalse");
		expect(screen.getByRole("button")).not.toHaveClass("loadingTrue");
	});

	it("should apply 'loadingTrue' class when isLoading is true", () => {
		render(<Button isLoading>Click me</Button>);

		expect(screen.getByRole("button")).toHaveClass("loadingTrue");
		expect(screen.getByRole("button")).not.toHaveClass("loadingFalse");
	});

	it("should apply 'loadingTextFalse' class when loadingText is omitted", () => {
		render(<Button>Click me</Button>);

		expect(screen.getByRole("button")).toHaveClass("loadingTextFalse");
	});

	it("should apply 'loadingTextTrue' class when loadingText is provided", () => {
		render(
			<Button isLoading loadingText="Saving...">
				Click me
			</Button>,
		);

		expect(screen.getByRole("button")).toHaveClass("loadingTextTrue");
		expect(screen.getByRole("button")).not.toHaveClass("loadingTextFalse");
	});

	it("should render the loadingText content when isLoading is true", () => {
		render(
			<Button isLoading loadingText="Saving...">
				Click me
			</Button>,
		);

		expect(screen.getByText("Saving...")).toBeInTheDocument();
	});

	it("should still render loadingText content in the DOM when isLoading is false, hidden only via the loadingFalse class", () => {
		render(<Button loadingText="Saving...">Click me</Button>);

		expect(screen.getByText("Saving...")).toBeInTheDocument();
		expect(screen.getByRole("button")).toHaveClass("loadingFalse");
	});

	it("should disable the button when isLoading is true", () => {
		render(<Button isLoading>Click me</Button>);

		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("should not disable the button when isLoading is false", () => {
		render(<Button isLoading={false}>Click me</Button>);

		expect(screen.getByRole("button")).not.toBeDisabled();
	});

	it("should disable the button when disabled is true", () => {
		render(<Button disabled>Click me</Button>);

		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("should not disable the button when disabled is omitted", () => {
		render(<Button>Click me</Button>);

		expect(screen.getByRole("button")).not.toBeDisabled();
	});

	it("should remain disabled when both disabled and isLoading are true", () => {
		render(
			<Button disabled isLoading>
				Click me
			</Button>,
		);

		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("should remain disabled when disabled is true and isLoading is false", () => {
		render(
			<Button disabled isLoading={false}>
				Click me
			</Button>,
		);

		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("should call onClick when clicked", async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(<Button onClick={onClick}>Click me</Button>);
		await user.click(screen.getByRole("button"));

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("should call onClick with the click event argument", async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(<Button onClick={onClick}>Click me</Button>);
		await user.click(screen.getByRole("button"));

		expect(onClick).toHaveBeenCalledWith(
			expect.objectContaining({ type: "click" }),
		);
	});

	it("should call onClick multiple times for multiple clicks", async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(<Button onClick={onClick}>Click me</Button>);
		await user.click(screen.getByRole("button"));
		await user.click(screen.getByRole("button"));
		await user.click(screen.getByRole("button"));

		expect(onClick).toHaveBeenCalledTimes(3);
	});

	it("should not call onClick when disabled", async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(
			<Button disabled onClick={onClick}>
				Click me
			</Button>,
		);
		await user.click(screen.getByRole("button"));

		expect(onClick).not.toHaveBeenCalled();
	});

	it("should not call onClick when isLoading is true", async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(
			<Button isLoading onClick={onClick}>
				Click me
			</Button>,
		);
		await user.click(screen.getByRole("button"));

		expect(onClick).not.toHaveBeenCalled();
	});

	it("should not render an icon inside the content area when leftIcon and rightIcon are omitted", () => {
		const { container } = render(<Button>Click me</Button>);

		const content = container.querySelector(".arkynButtonContent");
		expect(content?.querySelector("svg")).not.toBeInTheDocument();
	});

	it("should render leftIcon when provided", () => {
		const { container } = render(<Button leftIcon={Save}>Save</Button>);

		const content = container.querySelector(".arkynButtonContent");
		expect(content?.querySelector("svg")).toBeInTheDocument();
	});

	it("should render rightIcon when provided", () => {
		const { container } = render(<Button rightIcon={Trash}>Delete</Button>);

		const content = container.querySelector(".arkynButtonContent");
		expect(content?.querySelector("svg")).toBeInTheDocument();
	});

	it("should render both leftIcon and rightIcon together", () => {
		const { container } = render(
			<Button leftIcon={Save} rightIcon={Trash}>
				Action
			</Button>,
		);

		const content = container.querySelector(".arkynButtonContent");
		expect(content?.querySelectorAll("svg").length).toBe(2);
	});

	it("should render leftIcon before children and rightIcon after children in the content", () => {
		const { container } = render(
			<Button leftIcon={Save} rightIcon={Trash}>
				Action
			</Button>,
		);

		const content = container.querySelector(".arkynButtonContent");
		expect(content?.firstElementChild?.tagName).toBe("svg");
		expect(content?.lastElementChild?.tagName).toBe("svg");
	});

	it("should size icons according to the button size", () => {
		const { container } = render(
			<Button leftIcon={Save} size="lg">
				Save
			</Button>,
		);

		const icon = container.querySelector(".arkynButtonContent svg");
		expect(icon).toHaveAttribute("width", "24");
		expect(icon).toHaveAttribute("height", "24");
	});

	it("should use the default md icon size when size is omitted", () => {
		const { container } = render(<Button leftIcon={Save}>Save</Button>);

		const icon = container.querySelector(".arkynButtonContent svg");
		expect(icon).toHaveAttribute("width", "20");
		expect(icon).toHaveAttribute("height", "20");
	});

	it("should forward the type attribute", () => {
		render(<Button type="submit">Submit</Button>);

		expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
	});

	it("should forward the aria-label attribute", () => {
		render(<Button aria-label="Custom label">Click me</Button>);

		expect(
			screen.getByRole("button", { name: "Custom label" }),
		).toBeInTheDocument();
	});

	it("should forward arbitrary HTML attributes such as data-testid", () => {
		render(<Button data-testid="my-button">Click me</Button>);

		expect(screen.getByTestId("my-button")).toBeInTheDocument();
	});

	it("should forward the name attribute", () => {
		render(<Button name="submit-btn">Click me</Button>);

		expect(screen.getByRole("button")).toHaveAttribute("name", "submit-btn");
	});

	it("should support keyboard focus", async () => {
		const user = userEvent.setup();

		render(<Button>Click me</Button>);
		await user.tab();

		expect(screen.getByRole("button")).toHaveFocus();
	});

	it("should not be focusable via tab when disabled", async () => {
		const user = userEvent.setup();

		render(<Button disabled>Click me</Button>);
		await user.tab();

		expect(screen.getByRole("button")).not.toHaveFocus();
	});

	it("should trigger onClick when activated with the keyboard Enter key", async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(<Button onClick={onClick}>Click me</Button>);
		screen.getByRole("button").focus();
		await user.keyboard("{Enter}");

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("should trigger onClick when activated with the keyboard Space key", async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(<Button onClick={onClick}>Click me</Button>);
		screen.getByRole("button").focus();
		await user.keyboard(" ");

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("should forward the ref to the underlying button element", () => {
		const ref = createRef<HTMLButtonElement>();

		render(<Button ref={ref}>Click me</Button>);

		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
		expect(ref.current).toBe(screen.getByRole("button"));
	});

	it("should handle empty string children without throwing", () => {
		render(<Button>{""}</Button>);

		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("should handle null and undefined children without throwing", () => {
		render(<Button>{null}</Button>);

		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("should render an accessible name from text content", () => {
		render(<Button>Confirm order</Button>);

		expect(
			screen.getByRole("button", { name: "Confirm order" }),
		).toBeInTheDocument();
	});

	it("should support aria-disabled being set explicitly via rest props", () => {
		render(<Button aria-disabled="true">Click me</Button>);

		expect(screen.getByRole("button")).toHaveAttribute("aria-disabled", "true");
	});
});
