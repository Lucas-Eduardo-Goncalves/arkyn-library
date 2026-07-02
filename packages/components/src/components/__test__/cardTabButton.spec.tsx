import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CardTabContainer } from "../../cardTabContainer";
import { CardTabButton } from "../index";

afterEach(() => {
	cleanup();
});

describe("CardTabButton", () => {
	it("should render without errors", () => {
		render(
			<CardTabContainer>
				<CardTabButton value="one">One</CardTabButton>
			</CardTabContainer>,
		);

		expect(screen.getByText("One")).toBeInTheDocument();
	});

	it("should render string children", () => {
		render(
			<CardTabContainer>
				<CardTabButton value="one">Simple text</CardTabButton>
			</CardTabContainer>,
		);

		expect(screen.getByText("Simple text")).toBeInTheDocument();
	});

	it("should render JSX children", () => {
		render(
			<CardTabContainer>
				<CardTabButton value="one">
					<span>JSX child</span>
				</CardTabButton>
			</CardTabContainer>,
		);

		expect(screen.getByText("JSX child")).toBeInTheDocument();
	});

	it("should render when all optional properties are omitted", () => {
		render(
			<CardTabContainer>
				<CardTabButton value="one">One</CardTabButton>
			</CardTabContainer>,
		);

		const element = screen.getByText("One");
		expect(element).toHaveClass("arkynCardTabButton");
		expect(element).not.toBeDisabled();
	});

	it("should render correctly with all properties filled", () => {
		const handleClick = vi.fn();
		render(
			<CardTabContainer defaultValue="one">
				<CardTabButton
					value="one"
					onClick={handleClick}
					className="custom-class"
					data-testid="tab-one"
				>
					One
				</CardTabButton>
			</CardTabContainer>,
		);

		const element = screen.getByTestId("tab-one");
		expect(element).toHaveClass(
			"arkynCardTabButton",
			"isActive",
			"custom-class",
		);
	});

	it("should render as a button element with type=button", () => {
		render(
			<CardTabContainer>
				<CardTabButton value="one">One</CardTabButton>
			</CardTabContainer>,
		);

		const element = screen.getByText("One") as HTMLButtonElement;
		expect(element.tagName).toBe("BUTTON");
		expect(element).toHaveAttribute("type", "button");
	});

	describe("active class", () => {
		it("should not apply isActive class when value does not match current tab", () => {
			render(
				<CardTabContainer defaultValue="one">
					<CardTabButton value="two">Two</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByText("Two")).not.toHaveClass("isActive");
		});

		it("should apply isActive class when value matches current tab", () => {
			render(
				<CardTabContainer defaultValue="two">
					<CardTabButton value="one">One</CardTabButton>
					<CardTabButton value="two">Two</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByText("One")).not.toHaveClass("isActive");
			expect(screen.getByText("Two")).toHaveClass("isActive");
		});

		it("should not apply isActive class when both value and currentTab are empty", () => {
			render(
				<CardTabContainer>
					<CardTabButton value="">Empty</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByText("Empty")).not.toHaveClass("isActive");
		});

		it("should move the isActive class to the newly selected tab on click", async () => {
			const user = userEvent.setup();
			render(
				<CardTabContainer defaultValue="one">
					<CardTabButton value="one">One</CardTabButton>
					<CardTabButton value="two">Two</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByText("One")).toHaveClass("isActive");
			expect(screen.getByText("Two")).not.toHaveClass("isActive");

			await user.click(screen.getByText("Two"));

			expect(screen.getByText("One")).not.toHaveClass("isActive");
			expect(screen.getByText("Two")).toHaveClass("isActive");
		});
	});

	describe("disabled prop", () => {
		it("should not be disabled by default", () => {
			render(
				<CardTabContainer>
					<CardTabButton value="one">One</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByText("One")).not.toBeDisabled();
		});

		it("should be disabled when its own disabled prop is true", () => {
			render(
				<CardTabContainer>
					<CardTabButton value="one" disabled>
						One
					</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByText("One")).toBeDisabled();
			expect(screen.getByText("One")).toHaveClass("isDisabled");
		});

		it("should be disabled when the container disables all tabs", () => {
			render(
				<CardTabContainer disabled>
					<CardTabButton value="one">One</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByText("One")).toBeDisabled();
			expect(screen.getByText("One")).toHaveClass("isDisabled");
		});

		it("should remain disabled when both its own prop and the container disable it", () => {
			render(
				<CardTabContainer disabled>
					<CardTabButton value="one" disabled>
						One
					</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByText("One")).toBeDisabled();
		});

		it("should not disable a sibling tab when only one button sets disabled individually", () => {
			render(
				<CardTabContainer>
					<CardTabButton value="one" disabled>
						One
					</CardTabButton>
					<CardTabButton value="two">Two</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByText("One")).toBeDisabled();
			expect(screen.getByText("Two")).not.toBeDisabled();
		});

		it("should not switch the active tab when clicking a disabled button", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(
				<CardTabContainer defaultValue="two" onChange={handleChange}>
					<CardTabButton value="one" disabled>
						One
					</CardTabButton>
					<CardTabButton value="two">Two</CardTabButton>
				</CardTabContainer>,
			);

			await user.click(screen.getByText("One"));

			expect(handleChange).not.toHaveBeenCalled();
			expect(screen.getByText("Two")).toHaveClass("isActive");
		});
	});

	describe("onClick callback", () => {
		it("should call onClick when clicked", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<CardTabContainer>
					<CardTabButton value="one" onClick={handleClick}>
						One
					</CardTabButton>
				</CardTabContainer>,
			);

			await user.click(screen.getByText("One"));

			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("should call onClick with the click event", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<CardTabContainer>
					<CardTabButton value="one" onClick={handleClick}>
						One
					</CardTabButton>
				</CardTabContainer>,
			);

			await user.click(screen.getByText("One"));

			expect(handleClick).toHaveBeenCalledWith(
				expect.objectContaining({ type: "click" }),
			);
		});

		it("should still switch the active tab even when onClick is provided", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<CardTabContainer defaultValue="one">
					<CardTabButton value="one">One</CardTabButton>
					<CardTabButton value="two" onClick={handleClick}>
						Two
					</CardTabButton>
				</CardTabContainer>,
			);

			await user.click(screen.getByText("Two"));

			expect(handleClick).toHaveBeenCalledTimes(1);
			expect(screen.getByText("Two")).toHaveClass("isActive");
		});

		it("should not call onClick when the button is disabled", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<CardTabContainer>
					<CardTabButton value="one" disabled onClick={handleClick}>
						One
					</CardTabButton>
				</CardTabContainer>,
			);

			await user.click(screen.getByText("One"));

			expect(handleClick).not.toHaveBeenCalled();
		});

		it("should not throw when onClick is omitted and the button is clicked", async () => {
			const user = userEvent.setup();
			render(
				<CardTabContainer>
					<CardTabButton value="one">One</CardTabButton>
				</CardTabContainer>,
			);

			await expect(user.click(screen.getByText("One"))).resolves.not.toThrow();
		});
	});

	describe("className merge", () => {
		it("should preserve the base className", () => {
			render(
				<CardTabContainer>
					<CardTabButton value="one">One</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByText("One")).toHaveClass("arkynCardTabButton");
		});

		it("should merge an external className with the base className", () => {
			render(
				<CardTabContainer>
					<CardTabButton value="one" className="custom-class">
						One
					</CardTabButton>
				</CardTabContainer>,
			);

			const element = screen.getByText("One");
			expect(element).toHaveClass("arkynCardTabButton");
			expect(element).toHaveClass("custom-class");
		});

		it("should merge className together with isActive and isDisabled classes", () => {
			render(
				<CardTabContainer defaultValue="one" disabled>
					<CardTabButton value="one" className="custom-class">
						One
					</CardTabButton>
				</CardTabContainer>,
			);

			const element = screen.getByText("One");
			expect(element).toHaveClass(
				"arkynCardTabButton",
				"isActive",
				"isDisabled",
				"custom-class",
			);
		});

		it("should still render base class when className is omitted", () => {
			render(
				<CardTabContainer>
					<CardTabButton value="one">One</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByText("One").className.trim()).toBe(
				"arkynCardTabButton",
			);
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the button element", () => {
			render(
				<CardTabContainer>
					<CardTabButton value="one" aria-label="First tab">
						One
					</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByText("One")).toHaveAttribute(
				"aria-label",
				"First tab",
			);
		});

		it("should forward id attribute", () => {
			render(
				<CardTabContainer>
					<CardTabButton value="one" id="tab-one-id">
						One
					</CardTabButton>
				</CardTabContainer>,
			);

			expect(document.getElementById("tab-one-id")).toBeInTheDocument();
		});

		it("should forward inline style", () => {
			render(
				<CardTabContainer>
					<CardTabButton value="one" style={{ marginTop: "10px" }}>
						One
					</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByText("One")).toHaveStyle({ marginTop: "10px" });
		});
	});

	describe("accessibility", () => {
		it("should be reachable via getByRole button", () => {
			render(
				<CardTabContainer>
					<CardTabButton value="one">One</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByRole("button", { name: "One" })).toBeInTheDocument();
		});

		it("should support keyboard activation via Enter/Space through native button behavior", async () => {
			const user = userEvent.setup();
			const handleClick = vi.fn();
			render(
				<CardTabContainer>
					<CardTabButton value="one" onClick={handleClick}>
						One
					</CardTabButton>
				</CardTabContainer>,
			);

			await user.tab();
			expect(screen.getByText("One")).toHaveFocus();

			await user.keyboard("{Enter}");
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("should not be focusable via tab when disabled", async () => {
			const user = userEvent.setup();
			render(
				<CardTabContainer>
					<CardTabButton value="one" disabled>
						One
					</CardTabButton>
				</CardTabContainer>,
			);

			await user.tab();
			expect(screen.getByText("One")).not.toHaveFocus();
		});
	});

	describe("edge cases", () => {
		it("should handle multiple buttons with the same value without throwing", () => {
			render(
				<CardTabContainer defaultValue="one">
					<CardTabButton value="one">First</CardTabButton>
					<CardTabButton value="one">Second</CardTabButton>
				</CardTabContainer>,
			);

			expect(screen.getByText("First")).toHaveClass("isActive");
			expect(screen.getByText("Second")).toHaveClass("isActive");
		});

		it("should handle an empty className string without extra whitespace", () => {
			render(
				<CardTabContainer>
					<CardTabButton value="one" className="">
						One
					</CardTabButton>
				</CardTabContainer>,
			);

			const element = screen.getByText("One");
			expect(element.className.trim()).toBe(element.className);
		});
	});
});
