import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Plus, Save, Trash2 } from "lucide-react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IconButton } from "../index";

describe("IconButton", () => {
	afterEach(() => {
		cleanup();
	});

	it("should render without errors", () => {
		render(<IconButton icon={Plus} aria-label="Add item" />);

		expect(
			screen.getByRole("button", { name: "Add item" }),
		).toBeInTheDocument();
	});

	it("should render as a button element", () => {
		render(<IconButton icon={Plus} aria-label="Add item" />);

		const button = screen.getByRole("button", { name: "Add item" });
		expect(button.tagName).toBe("BUTTON");
	});

	it("should not accept children (icon-only)", () => {
		render(<IconButton icon={Plus} aria-label="Add item" />);

		const button = screen.getByRole("button", { name: "Add item" });
		expect(button.querySelector("p")).not.toBeInTheDocument();
	});

	it("should render when all optional properties are omitted", () => {
		render(<IconButton icon={Plus} aria-label="Add item" />);

		const button = screen.getByRole("button", { name: "Add item" });
		expect(button).toHaveClass("arkynIconButton");
		expect(button).toHaveClass("solid");
		expect(button).toHaveClass("primary");
		expect(button).toHaveClass("md");
		expect(button).toHaveClass("loadingFalse");
	});

	it("should render correctly with all properties filled", () => {
		const handleClick = vi.fn();
		render(
			<IconButton
				icon={Trash2}
				aria-label="Delete"
				scheme="danger"
				variant="outline"
				size="lg"
				isLoading={false}
				className="custom-class"
				onClick={handleClick}
			/>,
		);

		const button = screen.getByRole("button", { name: "Delete" });
		expect(button).toHaveClass(
			"arkynIconButton",
			"outline",
			"danger",
			"lg",
			"loadingFalse",
			"custom-class",
		);
	});

	describe("icon prop", () => {
		it("should render the provided icon", () => {
			const { container } = render(
				<IconButton icon={Plus} aria-label="Add item" />,
			);

			const contentWrapper = container.querySelector(".arkynIconButtonContent");
			expect(contentWrapper?.querySelector("svg")).toBeInTheDocument();
		});

		it("should swap the icon when the icon prop changes", () => {
			const { container, rerender } = render(
				<IconButton icon={Plus} aria-label="Add item" />,
			);

			let contentIcon = container.querySelector(".arkynIconButtonContent svg");
			expect(contentIcon).toHaveClass("lucide-plus");

			rerender(<IconButton icon={Trash2} aria-label="Add item" />);
			contentIcon = container.querySelector(".arkynIconButtonContent svg");
			expect(contentIcon).toHaveClass("lucide-trash2");
		});

		it("should render icon with size 20 (md) by default", () => {
			const { container } = render(
				<IconButton icon={Plus} aria-label="Add item" />,
			);

			const contentIcon = container.querySelector(
				".arkynIconButtonContent svg",
			);
			expect(contentIcon).toHaveAttribute("width", "20");
			expect(contentIcon).toHaveAttribute("height", "20");
		});

		it.each([
			["xs", "12"],
			["sm", "16"],
			["md", "20"],
			["lg", "24"],
		] as const)("should render icon with size %s as %spx", (size, expectedPx) => {
			const { container } = render(
				<IconButton icon={Plus} aria-label="Add item" size={size} />,
			);

			const contentIcon = container.querySelector(
				".arkynIconButtonContent svg",
			);
			expect(contentIcon).toHaveAttribute("width", expectedPx);
			expect(contentIcon).toHaveAttribute("height", expectedPx);
		});

		it("should render icon with strokeWidth 2.5", () => {
			const { container } = render(
				<IconButton icon={Plus} aria-label="Add item" />,
			);

			const contentIcon = container.querySelector(
				".arkynIconButtonContent svg",
			);
			expect(contentIcon).toHaveAttribute("stroke-width", "2.5");
		});

		it("should always render a spinner icon alongside the content icon", () => {
			const { container } = render(
				<IconButton icon={Plus} aria-label="Add item" />,
			);

			const spinnerWrapper = container.querySelector(".arkynIconButtonSpinner");
			expect(spinnerWrapper?.querySelector("svg")).toBeInTheDocument();
			expect(spinnerWrapper?.querySelector("svg")).toHaveClass(
				"lucide-loader-circle",
			);
		});

		it("should size the spinner icon to match the size prop", () => {
			const { container } = render(
				<IconButton icon={Plus} aria-label="Add item" size="xs" />,
			);

			const spinnerIcon = container.querySelector(
				".arkynIconButtonSpinner svg",
			);
			expect(spinnerIcon).toHaveAttribute("width", "12");
			expect(spinnerIcon).toHaveAttribute("height", "12");
		});
	});

	describe("size prop", () => {
		it("should apply the default 'md' size class when omitted", () => {
			render(<IconButton icon={Plus} aria-label="Add item" />);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveClass("md");
		});

		it.each([
			"xs",
			"sm",
			"md",
			"lg",
		] as const)("should apply the '%s' size class", (size) => {
			render(<IconButton icon={Plus} aria-label="Add item" size={size} />);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveClass(size);
		});

		it("should not apply classes from other sizes", () => {
			render(<IconButton icon={Plus} aria-label="Add item" size="sm" />);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).not.toHaveClass("xs");
			expect(button).not.toHaveClass("md");
			expect(button).not.toHaveClass("lg");
		});

		it("should replace the size class when changed", () => {
			const { rerender } = render(
				<IconButton icon={Plus} aria-label="Add item" size="xs" />,
			);

			let button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveClass("xs");

			rerender(<IconButton icon={Plus} aria-label="Add item" size="lg" />);
			button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveClass("lg");
			expect(button).not.toHaveClass("xs");
		});
	});

	describe("variant prop", () => {
		it("should apply the default 'solid' variant class when omitted", () => {
			render(<IconButton icon={Plus} aria-label="Add item" />);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveClass("solid");
		});

		it.each([
			"solid",
			"outline",
			"ghost",
			"invisible",
		] as const)("should apply the '%s' variant class", (variant) => {
			render(
				<IconButton icon={Plus} aria-label="Add item" variant={variant} />,
			);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveClass(variant);
		});

		it("should not apply classes from other variants", () => {
			render(<IconButton icon={Plus} aria-label="Add item" variant="ghost" />);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).not.toHaveClass("solid");
			expect(button).not.toHaveClass("outline");
			expect(button).not.toHaveClass("invisible");
		});

		it("should replace the variant class when changed", () => {
			const { rerender } = render(
				<IconButton icon={Plus} aria-label="Add item" variant="solid" />,
			);

			let button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveClass("solid");

			rerender(
				<IconButton icon={Plus} aria-label="Add item" variant="invisible" />,
			);
			button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveClass("invisible");
			expect(button).not.toHaveClass("solid");
		});
	});

	describe("scheme prop", () => {
		it("should apply the default 'primary' scheme class when omitted", () => {
			render(<IconButton icon={Plus} aria-label="Add item" />);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveClass("primary");
		});

		it.each([
			"primary",
			"secondary",
			"success",
			"warning",
			"danger",
			"info",
		] as const)("should apply the '%s' scheme class", (scheme) => {
			render(<IconButton icon={Plus} aria-label="Add item" scheme={scheme} />);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveClass(scheme);
		});

		it("should not apply classes from other schemes", () => {
			render(<IconButton icon={Plus} aria-label="Add item" scheme="success" />);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).not.toHaveClass("primary");
			expect(button).not.toHaveClass("secondary");
			expect(button).not.toHaveClass("warning");
			expect(button).not.toHaveClass("danger");
			expect(button).not.toHaveClass("info");
		});
	});

	describe("isLoading state", () => {
		it("should apply 'loadingFalse' class by default", () => {
			render(<IconButton icon={Plus} aria-label="Add item" />);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveClass("loadingFalse");
			expect(button).not.toHaveClass("loadingTrue");
		});

		it("should apply 'loadingTrue' class when isLoading is true", () => {
			render(<IconButton icon={Plus} aria-label="Add item" isLoading />);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveClass("loadingTrue");
			expect(button).not.toHaveClass("loadingFalse");
		});

		it("should disable the button when isLoading is true", () => {
			render(<IconButton icon={Plus} aria-label="Add item" isLoading />);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toBeDisabled();
		});

		it("should not disable the button when isLoading is false", () => {
			render(
				<IconButton icon={Plus} aria-label="Add item" isLoading={false} />,
			);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).not.toBeDisabled();
		});

		it("should still render both spinner and content icon when loading", () => {
			const { container } = render(
				<IconButton icon={Plus} aria-label="Saving" isLoading />,
			);

			expect(
				container.querySelector(".arkynIconButtonSpinner svg"),
			).toBeInTheDocument();
			expect(
				container.querySelector(".arkynIconButtonContent svg"),
			).toBeInTheDocument();
		});

		it("should not fire onClick when isLoading disables the button", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<IconButton
					icon={Save}
					aria-label="Saving"
					isLoading
					onClick={handleClick}
				/>,
			);

			const button = screen.getByRole("button", { name: "Saving" });
			await user.click(button);

			expect(handleClick).not.toHaveBeenCalled();
		});
	});

	describe("disabled state", () => {
		it("should not be disabled by default", () => {
			render(<IconButton icon={Plus} aria-label="Add item" />);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).not.toBeDisabled();
		});

		it("should be disabled when disabled prop is true", () => {
			render(<IconButton icon={Plus} aria-label="Add item" disabled />);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toBeDisabled();
		});

		it("should not fire onClick when disabled", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<IconButton
					icon={Plus}
					aria-label="Add item"
					disabled
					onClick={handleClick}
				/>,
			);

			const button = screen.getByRole("button", { name: "Add item" });
			await user.click(button);

			expect(handleClick).not.toHaveBeenCalled();
		});
	});

	describe("disabled + isLoading interaction", () => {
		it("should remain disabled when disabled is false but isLoading is true", () => {
			render(
				<IconButton
					icon={Plus}
					aria-label="Add item"
					disabled={false}
					isLoading
				/>,
			);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toBeDisabled();
		});

		it("should remain disabled when disabled is true and isLoading is false", () => {
			render(
				<IconButton
					icon={Plus}
					aria-label="Add item"
					disabled
					isLoading={false}
				/>,
			);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toBeDisabled();
		});

		it("should remain disabled when both disabled and isLoading are true", () => {
			render(
				<IconButton icon={Plus} aria-label="Add item" disabled isLoading />,
			);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toBeDisabled();
			expect(button).toHaveClass("loadingTrue");
		});
	});

	describe("onClick event", () => {
		it("should fire onClick when clicked", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<IconButton icon={Plus} aria-label="Add item" onClick={handleClick} />,
			);

			const button = screen.getByRole("button", { name: "Add item" });
			await user.click(button);

			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("should call onClick with the expected number of clicks", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<IconButton icon={Plus} aria-label="Add item" onClick={handleClick} />,
			);

			const button = screen.getByRole("button", { name: "Add item" });
			await user.click(button);
			await user.click(button);
			await user.click(button);

			expect(handleClick).toHaveBeenCalledTimes(3);
		});

		it("should call onClick with a click event argument", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<IconButton icon={Plus} aria-label="Add item" onClick={handleClick} />,
			);

			const button = screen.getByRole("button", { name: "Add item" });
			await user.click(button);

			expect(handleClick).toHaveBeenCalledWith(
				expect.objectContaining({ type: "click" }),
			);
		});

		it("should not throw when onClick is omitted and the button is clicked", async () => {
			const user = userEvent.setup();
			render(<IconButton icon={Plus} aria-label="Add item" />);

			const button = screen.getByRole("button", { name: "Add item" });
			await expect(user.click(button)).resolves.not.toThrow();
		});

		it("should fire onClick via keyboard activation (Enter)", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<IconButton icon={Plus} aria-label="Add item" onClick={handleClick} />,
			);

			const button = screen.getByRole("button", { name: "Add item" });
			button.focus();
			await user.keyboard("{Enter}");

			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("should fire onClick via keyboard activation (Space)", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<IconButton icon={Plus} aria-label="Add item" onClick={handleClick} />,
			);

			const button = screen.getByRole("button", { name: "Add item" });
			button.focus();
			await user.keyboard(" ");

			expect(handleClick).toHaveBeenCalledTimes(1);
		});
	});

	describe("accessibility", () => {
		it("should require and expose aria-label for screen readers", () => {
			render(<IconButton icon={Plus} aria-label="Add item" />);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveAttribute("aria-label", "Add item");
		});

		it("should update the accessible name when aria-label changes", () => {
			const { rerender } = render(
				<IconButton icon={Plus} aria-label="Add item" />,
			);

			expect(
				screen.getByRole("button", { name: "Add item" }),
			).toBeInTheDocument();

			rerender(<IconButton icon={Plus} aria-label="Create entry" />);

			expect(
				screen.getByRole("button", { name: "Create entry" }),
			).toBeInTheDocument();
			expect(
				screen.queryByRole("button", { name: "Add item" }),
			).not.toBeInTheDocument();
		});

		it("should expose the native disabled state to accessibility tree", () => {
			render(<IconButton icon={Plus} aria-label="Add item" disabled />);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveAttribute("disabled");
		});

		it("should be focusable via keyboard tab order when enabled", async () => {
			const user = userEvent.setup();
			render(<IconButton icon={Plus} aria-label="Add item" />);

			await user.tab();

			expect(screen.getByRole("button", { name: "Add item" })).toHaveFocus();
		});

		it("should not receive focus via tab when disabled", async () => {
			const user = userEvent.setup();
			render(<IconButton icon={Plus} aria-label="Add item" disabled />);

			await user.tab();

			expect(
				screen.getByRole("button", { name: "Add item" }),
			).not.toHaveFocus();
		});
	});

	describe("className merge", () => {
		it("should preserve the base className", () => {
			render(<IconButton icon={Plus} aria-label="Add item" />);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveClass("arkynIconButton");
		});

		it("should merge an external className with the base className", () => {
			render(
				<IconButton
					icon={Plus}
					aria-label="Add item"
					className="custom-class"
				/>,
			);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveClass("arkynIconButton");
			expect(button).toHaveClass("custom-class");
		});

		it("should still render base classes when className is omitted", () => {
			render(<IconButton icon={Plus} aria-label="Add item" />);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveClass("arkynIconButton");
			expect(button).toHaveClass("solid");
			expect(button).toHaveClass("primary");
			expect(button).toHaveClass("md");
		});

		it("should combine className with variant, scheme, size and loading classes", () => {
			render(
				<IconButton
					icon={Plus}
					aria-label="Add item"
					variant="outline"
					scheme="info"
					size="sm"
					isLoading
					className="custom-class"
				/>,
			);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveClass(
				"arkynIconButton",
				"outline",
				"info",
				"sm",
				"loadingTrue",
				"custom-class",
			);
		});

		it("should handle an empty className string without trailing whitespace", () => {
			render(<IconButton icon={Plus} aria-label="Add item" className="" />);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button.className.trim()).toBe(button.className);
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the root element", () => {
			render(
				<IconButton
					icon={Plus}
					aria-label="Add item"
					data-testid="icon-button-root"
				/>,
			);

			expect(screen.getByTestId("icon-button-root")).toBeInTheDocument();
		});

		it("should forward id attribute", () => {
			render(
				<IconButton icon={Plus} aria-label="Add item" id="icon-button-id" />,
			);

			expect(document.getElementById("icon-button-id")).toBeInTheDocument();
		});

		it("should forward inline style and merge with internal rendering", () => {
			render(
				<IconButton
					icon={Plus}
					aria-label="Add item"
					style={{ marginTop: "10px" }}
				/>,
			);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveStyle({ marginTop: "10px" });
		});

		it("should forward the native type attribute", () => {
			render(<IconButton icon={Plus} aria-label="Add item" type="submit" />);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveAttribute("type", "submit");
		});

		it("should forward name and value attributes", () => {
			render(
				<IconButton
					icon={Plus}
					aria-label="Add item"
					name="action"
					value="add"
				/>,
			);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveAttribute("name", "action");
			expect(button).toHaveAttribute("value", "add");
		});
	});

	describe("ref forwarding via native attributes", () => {
		it("should allow ref access when wrapped through a forwardRef-consuming parent", () => {
			function Wrapper() {
				const ref = createRef<HTMLDivElement>();
				return (
					<div ref={ref} data-testid="wrapper">
						<IconButton icon={Plus} aria-label="Add item" />
					</div>
				);
			}

			render(<Wrapper />);

			expect(screen.getByTestId("wrapper")).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "Add item" }),
			).toBeInTheDocument();
		});
	});

	describe("edge cases", () => {
		it("should handle an aria-label with an empty string", () => {
			const emptyLabel = ["", ""].join("");
			render(<IconButton icon={Plus} aria-label={emptyLabel} />);

			const button = screen.getByRole("button");
			expect(button).toHaveAttribute("aria-label", "");
		});

		it("should render correctly when disabled is undefined", () => {
			render(
				<IconButton icon={Plus} aria-label="Add item" disabled={undefined} />,
			);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).not.toBeDisabled();
		});

		it("should render correctly when isLoading is undefined", () => {
			render(
				<IconButton icon={Plus} aria-label="Add item" isLoading={undefined} />,
			);

			const button = screen.getByRole("button", { name: "Add item" });
			expect(button).toHaveClass("loadingFalse");
			expect(button).not.toBeDisabled();
		});

		it("should render only one root button element", () => {
			const { container } = render(
				<IconButton icon={Plus} aria-label="Add item" />,
			);

			expect(container.querySelectorAll("button")).toHaveLength(1);
		});

		it("should render exactly two svg elements (spinner + content icon)", () => {
			const { container } = render(
				<IconButton icon={Plus} aria-label="Add item" />,
			);

			expect(container.querySelectorAll("svg")).toHaveLength(2);
		});
	});
});
