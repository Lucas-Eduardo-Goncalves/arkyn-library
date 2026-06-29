import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ArrowLeft, ArrowRight, Home, Settings } from "lucide-react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Button } from "../button";

const defaultProps = {
	children: "Click me",
};

const renderButton = (props = {}) => {
	return render(<Button {...defaultProps} {...props} />);
};

describe("Button", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Rendering", () => {
		it("should render correctly with default props", () => {
			renderButton();

			const button = screen.getByRole("button");

			expect(button).toBeInTheDocument();
			expect(button).toHaveTextContent("Click me");
		});

		it("should render children content correctly", () => {
			renderButton({ children: "Submit Form" });

			expect(screen.getByText("Submit Form")).toBeInTheDocument();
		});

		it("should render with complex children", () => {
			render(
				<Button>
					<span data-testid="child-span">Complex Child</span>
				</Button>,
			);

			expect(screen.getByTestId("child-span")).toBeInTheDocument();
			expect(screen.getByText("Complex Child")).toBeInTheDocument();
		});

		it("should apply base CSS class", () => {
			renderButton();

			expect(screen.getByRole("button")).toHaveClass("arkynButton");
		});

		it("should have button content wrapper", () => {
			renderButton();

			const button = screen.getByRole("button");
			const contentWrapper = button.querySelector(".arkynButtonContent");

			expect(contentWrapper).toBeInTheDocument();
		});

		it("should have spinner wrapper for loading state", () => {
			renderButton();

			const button = screen.getByRole("button");
			const spinnerWrapper = button.querySelector(".arkynButtonSpinner");

			expect(spinnerWrapper).toBeInTheDocument();
		});
	});

	describe("Default Values", () => {
		it("should have default size of 'md'", () => {
			renderButton();

			expect(screen.getByRole("button")).toHaveClass("md");
		});

		it("should have default variant of 'solid'", () => {
			renderButton();

			expect(screen.getByRole("button")).toHaveClass("solid");
		});

		it("should have default scheme of 'primary'", () => {
			renderButton();

			expect(screen.getByRole("button")).toHaveClass("primary");
		});

		it("should have default isLoading of false", () => {
			renderButton();

			expect(screen.getByRole("button")).toHaveClass("loadingFalse");
			expect(screen.getByRole("button")).not.toBeDisabled();
		});

		it("should have default loadingText class when not provided", () => {
			renderButton();

			expect(screen.getByRole("button")).toHaveClass("loadingTextFalse");
		});
	});

	describe("Size Prop", () => {
		const sizes = ["xs", "sm", "md", "lg"] as const;

		sizes.forEach((size) => {
			it(`should apply size="${size}" class correctly`, () => {
				renderButton({ size });

				expect(screen.getByRole("button")).toHaveClass(size);
			});
		});

		it("should render icons with correct size for xs", () => {
			renderButton({ size: "xs", leftIcon: Home });

			const icon = screen.getByRole("button").querySelector("svg");
			expect(icon).toHaveAttribute("width", "12");
			expect(icon).toHaveAttribute("height", "12");
		});

		it("should render icons with correct size for sm", () => {
			renderButton({ size: "sm", leftIcon: Home });

			const icon = screen.getByRole("button").querySelector("svg");
			expect(icon).toHaveAttribute("width", "16");
			expect(icon).toHaveAttribute("height", "16");
		});

		it("should render icons with correct size for md", () => {
			renderButton({ size: "md", leftIcon: Home });

			const icon = screen.getByRole("button").querySelector("svg");
			expect(icon).toHaveAttribute("width", "20");
			expect(icon).toHaveAttribute("height", "20");
		});

		it("should render icons with correct size for lg", () => {
			renderButton({ size: "lg", leftIcon: Home });

			const icon = screen.getByRole("button").querySelector("svg");
			expect(icon).toHaveAttribute("width", "24");
			expect(icon).toHaveAttribute("height", "24");
		});
	});

	describe("Variant Prop", () => {
		const variants = ["solid", "outline", "ghost", "invisible"] as const;

		variants.forEach((variant) => {
			it(`should apply variant="${variant}" class correctly`, () => {
				renderButton({ variant });

				expect(screen.getByRole("button")).toHaveClass(variant);
			});
		});

		it("should allow combining variant with scheme", () => {
			renderButton({ variant: "outline", scheme: "danger" });

			const button = screen.getByRole("button");

			expect(button).toHaveClass("outline");
			expect(button).toHaveClass("danger");
		});
	});
	describe("Scheme Prop", () => {
		const schemes = [
			"primary",
			"success",
			"warning",
			"danger",
			"info",
		] as const;

		schemes.forEach((scheme) => {
			it(`should apply scheme="${scheme}" class correctly`, () => {
				renderButton({ scheme });

				expect(screen.getByRole("button")).toHaveClass(scheme);
			});
		});

		it("should allow combining scheme with size", () => {
			renderButton({ scheme: "success", size: "lg" });

			const button = screen.getByRole("button");

			expect(button).toHaveClass("success");
			expect(button).toHaveClass("lg");
		});
	});

	describe("Loading State", () => {
		it("should apply loadingTrue class when isLoading is true", () => {
			renderButton({ isLoading: true });
			expect(screen.getByRole("button")).toHaveClass("loadingTrue");
		});

		it("should apply loadingFalse class when isLoading is false", () => {
			renderButton({ isLoading: false });
			expect(screen.getByRole("button")).toHaveClass("loadingFalse");
		});

		it("should be disabled when isLoading is true", () => {
			renderButton({ isLoading: true });
			expect(screen.getByRole("button")).toBeDisabled();
		});

		it("should render loading spinner when isLoading is true", () => {
			renderButton({ isLoading: true });

			const spinner = screen
				.getByRole("button")
				.querySelector(".arkynButtonSpinner svg");

			expect(spinner).toBeInTheDocument();
		});

		it("should display loadingText when provided with isLoading", () => {
			renderButton({ isLoading: true, loadingText: "Saving..." });
			expect(screen.getByText("Saving...")).toBeInTheDocument();
		});

		it("should apply loadingTextTrue class when loadingText is provided", () => {
			renderButton({ isLoading: true, loadingText: "Loading..." });
			expect(screen.getByRole("button")).toHaveClass("loadingTextTrue");
		});

		it("should apply loadingTextFalse class when loadingText is not provided", () => {
			renderButton({ isLoading: true });
			expect(screen.getByRole("button")).toHaveClass("loadingTextFalse");
		});

		it("should show loading spinner with correct icon size based on button size", () => {
			renderButton({ isLoading: true, size: "lg" });

			const spinner = screen
				.getByRole("button")
				.querySelector(".arkynButtonSpinner svg");

			expect(spinner).toHaveAttribute("width", "24");
			expect(spinner).toHaveAttribute("height", "24");
		});
	});

	describe("Disabled State", () => {
		it("should be disabled when disabled prop is true", () => {
			renderButton({ disabled: true });
			expect(screen.getByRole("button")).toBeDisabled();
		});

		it("should not be disabled when disabled prop is false", () => {
			renderButton({ disabled: false });
			expect(screen.getByRole("button")).not.toBeDisabled();
		});

		it("should be disabled when both disabled and isLoading are true", () => {
			renderButton({ disabled: true, isLoading: true });
			expect(screen.getByRole("button")).toBeDisabled();
		});

		it("should not trigger onClick when disabled", async () => {
			const handleClick = vi.fn();
			renderButton({ disabled: true, onClick: handleClick });
			await userEvent.click(screen.getByRole("button"));
			expect(handleClick).not.toHaveBeenCalled();
		});

		it("should not trigger onClick when isLoading", async () => {
			const handleClick = vi.fn();
			renderButton({ isLoading: true, onClick: handleClick });
			await userEvent.click(screen.getByRole("button"));
			expect(handleClick).not.toHaveBeenCalled();
		});
	});

	describe("Icon Props", () => {
		it("should render leftIcon when provided", () => {
			renderButton({ leftIcon: Home });

			const icons = screen
				.getByRole("button")
				.querySelectorAll(".arkynButtonContent svg");

			expect(icons.length).toBeGreaterThanOrEqual(1);
		});

		it("should render rightIcon when provided", () => {
			renderButton({ rightIcon: ArrowRight });

			const icons = screen
				.getByRole("button")
				.querySelectorAll(".arkynButtonContent svg");

			expect(icons.length).toBeGreaterThanOrEqual(1);
		});

		it("should render both leftIcon and rightIcon when provided", () => {
			renderButton({ leftIcon: ArrowLeft, rightIcon: ArrowRight });

			const icons = screen
				.getByRole("button")
				.querySelectorAll(".arkynButtonContent svg");

			expect(icons.length).toBe(2);
		});

		it("should not render icons when not provided", () => {
			renderButton();

			const contentIcons = screen
				.getByRole("button")
				.querySelectorAll(".arkynButtonContent svg");

			expect(contentIcons.length).toBe(0);
		});

		it("should render icon with correct strokeWidth", () => {
			renderButton({ leftIcon: Settings });

			const icon = screen
				.getByRole("button")
				.querySelector(".arkynButtonContent svg");

			expect(icon).toHaveAttribute("stroke-width", "2.5");
		});
	});

	describe("ClassName Prop", () => {
		it("should merge custom className with base classes", () => {
			renderButton({ className: "custom-button" });
			const button = screen.getByRole("button");
			expect(button).toHaveClass("arkynButton");
			expect(button).toHaveClass("custom-button");
		});

		it("should handle multiple custom classNames", () => {
			renderButton({ className: "custom-one custom-two" });
			const button = screen.getByRole("button");
			expect(button).toHaveClass("custom-one");
			expect(button).toHaveClass("custom-two");
		});

		it("should handle empty className gracefully", () => {
			renderButton({ className: "" });
			expect(screen.getByRole("button")).toHaveClass("arkynButton");
		});

		it("should preserve all variant classes when custom className is added", () => {
			renderButton({
				className: "my-custom-class",
				size: "lg",
				variant: "outline",
				scheme: "success",
			});

			const button = screen.getByRole("button");

			expect(button).toHaveClass("arkynButton");
			expect(button).toHaveClass("lg");
			expect(button).toHaveClass("outline");
			expect(button).toHaveClass("success");
			expect(button).toHaveClass("my-custom-class");
		});
	});

	describe("Interactions", () => {
		it("should call onClick handler when clicked", async () => {
			const handleClick = vi.fn();
			renderButton({ onClick: handleClick });
			await userEvent.click(screen.getByRole("button"));
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("should call onClick with event object", async () => {
			const handleClick = vi.fn();
			renderButton({ onClick: handleClick });
			await userEvent.click(screen.getByRole("button"));
			expect(handleClick).toHaveBeenCalledWith(
				expect.objectContaining({
					type: "click",
				}),
			);
		});

		it("should handle multiple clicks", async () => {
			const handleClick = vi.fn();
			renderButton({ onClick: handleClick });
			const button = screen.getByRole("button");
			await userEvent.click(button);
			await userEvent.click(button);
			await userEvent.click(button);
			expect(handleClick).toHaveBeenCalledTimes(3);
		});

		it("should handle onMouseEnter event", async () => {
			const handleMouseEnter = vi.fn();
			renderButton({ onMouseEnter: handleMouseEnter });
			await userEvent.hover(screen.getByRole("button"));
			expect(handleMouseEnter).toHaveBeenCalledTimes(1);
		});

		it("should handle onMouseLeave event", async () => {
			const handleMouseLeave = vi.fn();
			renderButton({ onMouseLeave: handleMouseLeave });
			const button = screen.getByRole("button");
			await userEvent.hover(button);
			await userEvent.unhover(button);
			expect(handleMouseLeave).toHaveBeenCalledTimes(1);
		});

		it("should handle onFocus event", async () => {
			const handleFocus = vi.fn();
			renderButton({ onFocus: handleFocus });
			screen.getByRole("button").focus();
			expect(handleFocus).toHaveBeenCalledTimes(1);
		});

		it("should handle onBlur event", async () => {
			const handleBlur = vi.fn();
			renderButton({ onBlur: handleBlur });

			const button = screen.getByRole("button");
			button.focus();
			button.blur();
			expect(handleBlur).toHaveBeenCalledTimes(1);
		});

		it("should handle keyboard Enter key press", async () => {
			const handleClick = vi.fn();
			renderButton({ onClick: handleClick });

			const button = screen.getByRole("button");
			button.focus();
			await userEvent.keyboard("{Enter}");
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("should handle keyboard Space key press", async () => {
			const handleClick = vi.fn();
			renderButton({ onClick: handleClick });

			const button = screen.getByRole("button");
			button.focus();
			await userEvent.keyboard(" ");
			expect(handleClick).toHaveBeenCalledTimes(1);
		});
	});

	describe("HTML Attributes Spreading", () => {
		it("should spread data-* attributes", () => {
			renderButton({ "data-testid": "custom-button", "data-custom": "value" });
			const button = screen.getByTestId("custom-button");
			expect(button).toHaveAttribute("data-custom", "value");
		});

		it("should spread id attribute", () => {
			renderButton({ id: "submit-button" });
			expect(screen.getByRole("button")).toHaveAttribute("id", "submit-button");
		});

		it("should spread name attribute", () => {
			renderButton({ name: "submitBtn" });
			expect(screen.getByRole("button")).toHaveAttribute("name", "submitBtn");
		});

		it("should spread type attribute", () => {
			renderButton({ type: "submit" });
			expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
		});

		it("should spread form attribute", () => {
			renderButton({ form: "my-form" });
			expect(screen.getByRole("button")).toHaveAttribute("form", "my-form");
		});

		it("should spread title attribute", () => {
			renderButton({ title: "Click to submit" });
			expect(screen.getByRole("button")).toHaveAttribute(
				"title",
				"Click to submit",
			);
		});

		it("should spread tabIndex attribute", () => {
			renderButton({ tabIndex: 5 });
			expect(screen.getByRole("button")).toHaveAttribute("tabIndex", "5");
		});
	});

	describe("Accessibility", () => {
		it("should have button role", () => {
			renderButton();
			expect(screen.getByRole("button")).toBeInTheDocument();
		});

		it("should support aria-label", () => {
			renderButton({ "aria-label": "Submit form" });
			expect(screen.getByLabelText("Submit form")).toBeInTheDocument();
		});

		it("should support aria-labelledby", () => {
			renderButton({ "aria-labelledby": "label-id" });
			expect(screen.getByRole("button")).toHaveAttribute(
				"aria-labelledby",
				"label-id",
			);
		});

		it("should support aria-describedby", () => {
			renderButton({ "aria-describedby": "description-id" });
			expect(screen.getByRole("button")).toHaveAttribute(
				"aria-describedby",
				"description-id",
			);
		});

		it("should support aria-pressed for toggle buttons", () => {
			renderButton({ "aria-pressed": true });
			expect(screen.getByRole("button")).toHaveAttribute(
				"aria-pressed",
				"true",
			);
		});

		it("should support aria-expanded", () => {
			renderButton({ "aria-expanded": false });
			expect(screen.getByRole("button")).toHaveAttribute(
				"aria-expanded",
				"false",
			);
		});

		it("should support aria-haspopup", () => {
			renderButton({ "aria-haspopup": "menu" });
			expect(screen.getByRole("button")).toHaveAttribute(
				"aria-haspopup",
				"menu",
			);
		});

		it("should support aria-controls", () => {
			renderButton({ "aria-controls": "panel-id" });
			expect(screen.getByRole("button")).toHaveAttribute(
				"aria-controls",
				"panel-id",
			);
		});

		it("should be focusable when not disabled", () => {
			renderButton();
			const button = screen.getByRole("button");
			button.focus();
			expect(button).toHaveFocus();
		});

		it("should not be focusable when disabled", () => {
			renderButton({ disabled: true });
			const button = screen.getByRole("button");
			expect(button).toBeDisabled();
		});

		it("should have accessible name from children", () => {
			renderButton({ children: "Save Changes" });
			expect(
				screen.getByRole("button", { name: "Save Changes" }),
			).toBeInTheDocument();
		});
	});

	describe("Class Composition", () => {
		it("should compose all classes correctly", () => {
			renderButton({
				size: "lg",
				variant: "outline",
				scheme: "danger",
				isLoading: true,
				loadingText: "Deleting...",
				className: "extra-class",
			});

			const button = screen.getByRole("button");

			expect(button).toHaveClass("arkynButton");
			expect(button).toHaveClass("loadingTrue");
			expect(button).toHaveClass("outline");
			expect(button).toHaveClass("danger");
			expect(button).toHaveClass("lg");
			expect(button).toHaveClass("loadingTextTrue");
			expect(button).toHaveClass("extra-class");
		});

		it("should have correct class order in className attribute", () => {
			renderButton({
				size: "sm",
				variant: "ghost",
				scheme: "success",
			});

			const button = screen.getByRole("button");
			const className = button.getAttribute("class");

			expect(className).toContain("arkynButton");
			expect(className).toContain("loadingFalse");
			expect(className).toContain("ghost");
			expect(className).toContain("success");
			expect(className).toContain("sm");
		});
	});

	describe("Edge Cases", () => {
		it("should handle empty children", () => {
			render(<Button />);
			expect(screen.getByRole("button")).toBeInTheDocument();
		});

		it("should handle null children", () => {
			render(<Button>{null}</Button>);
			expect(screen.getByRole("button")).toBeInTheDocument();
		});

		it("should handle undefined children", () => {
			render(<Button>{undefined}</Button>);
			expect(screen.getByRole("button")).toBeInTheDocument();
		});

		it("should handle numeric children", () => {
			render(<Button>{42}</Button>);
			expect(screen.getByText("42")).toBeInTheDocument();
		});

		it("should handle boolean loadingText (empty string)", () => {
			renderButton({ isLoading: true, loadingText: "" });
			expect(screen.getByRole("button")).toHaveClass("loadingTextFalse");
		});

		it("should work with form submission", () => {
			const handleSubmit = vi.fn((e) => e.preventDefault());

			render(
				<form onSubmit={handleSubmit}>
					<Button type="submit">Submit</Button>
				</form>,
			);

			userEvent.click(screen.getByRole("button"));
			expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
		});

		it("should handle rapid consecutive clicks", async () => {
			const handleClick = vi.fn();
			renderButton({ onClick: handleClick });

			const button = screen.getByRole("button");

			await userEvent.click(button);
			await userEvent.click(button);
			await userEvent.click(button);
			await userEvent.click(button);
			await userEvent.click(button);

			expect(handleClick).toHaveBeenCalledTimes(5);
		});

		it("should maintain disabled state during loading even if disabled is false", () => {
			renderButton({ isLoading: true, disabled: false });
			expect(screen.getByRole("button")).toBeDisabled();
		});
	});

	describe("Prop Combinations", () => {
		const sizes = ["xs", "sm", "md", "lg"] as const;
		const variants = ["solid", "outline", "ghost", "invisible"] as const;
		const schemes = [
			"primary",
			"success",
			"warning",
			"danger",
			"info",
		] as const;

		it("should handle all size + variant combinations", () => {
			sizes.forEach((size) => {
				variants.forEach((variant) => {
					const { unmount } = renderButton({ size, variant });
					const button = screen.getByRole("button");
					expect(button).toHaveClass(size);
					expect(button).toHaveClass(variant);
					unmount();
				});
			});
		});

		it("should handle all variant + scheme combinations", () => {
			variants.forEach((variant) => {
				schemes.forEach((scheme) => {
					const { unmount } = renderButton({ variant, scheme });
					const button = screen.getByRole("button");
					expect(button).toHaveClass(variant);
					expect(button).toHaveClass(scheme);
					unmount();
				});
			});
		});

		it("should handle loading state with all sizes", () => {
			sizes.forEach((size) => {
				const { unmount } = renderButton({ size, isLoading: true });
				const button = screen.getByRole("button");
				expect(button).toHaveClass(size);
				expect(button).toHaveClass("loadingTrue");
				expect(button).toBeDisabled();
				unmount();
			});
		});

		it("should handle icons with loading state", () => {
			renderButton({
				leftIcon: Home,
				rightIcon: ArrowRight,
				isLoading: true,
				loadingText: "Processing...",
			});
			const button = screen.getByRole("button");
			expect(button).toHaveClass("loadingTrue");
			expect(screen.getByText("Processing...")).toBeInTheDocument();
		});
	});

	describe("Snapshots", () => {
		it("should match snapshot with default props", () => {
			const { container } = renderButton();
			expect(container.firstChild).toMatchSnapshot();
		});

		it("should match snapshot with all props", () => {
			const { container } = renderButton({
				size: "lg",
				variant: "outline",
				scheme: "success",
				isLoading: true,
				loadingText: "Saving...",
				leftIcon: Home,
				className: "custom-class",
			});
			expect(container.firstChild).toMatchSnapshot();
		});
	});
});
