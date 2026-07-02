import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TabButton } from "../tab/tabButton";
import { TabContainer } from "../tab/tabContainer";

describe("TabButton", () => {
	afterEach(() => {
		cleanup();
	});

	it("should render without errors", () => {
		render(
			<TabContainer>
				<TabButton value="one">One</TabButton>
			</TabContainer>,
		);

		expect(screen.getByRole("button", { name: "One" })).toBeInTheDocument();
	});

	it("should render children text", () => {
		render(
			<TabContainer>
				<TabButton value="one">Overview</TabButton>
			</TabContainer>,
		);

		expect(screen.getByText("Overview")).toBeInTheDocument();
	});

	it("should render JSX children", () => {
		render(
			<TabContainer>
				<TabButton value="one">
					<span>Icon</span>
					<strong>Label</strong>
				</TabButton>
			</TabContainer>,
		);

		expect(screen.getByText("Icon")).toBeInTheDocument();
		expect(screen.getByText("Label")).toBeInTheDocument();
	});

	it("should render as a button element with type button", () => {
		render(
			<TabContainer>
				<TabButton value="one">One</TabButton>
			</TabContainer>,
		);

		const button = screen.getByRole("button", { name: "One" });
		expect(button.tagName).toBe("BUTTON");
		expect(button).toHaveAttribute("type", "button");
	});

	it("should render with all properties filled", () => {
		const onClick = vi.fn();
		render(
			<TabContainer defaultValue="one">
				<TabButton
					value="one"
					disabled={false}
					onClick={onClick}
					className="custom-class"
					id="tab-one"
				>
					One
				</TabButton>
			</TabContainer>,
		);

		const button = screen.getByRole("button", { name: "One" });
		expect(button).toHaveClass("arkynTabButton");
		expect(button).toHaveClass("isActive");
		expect(button).toHaveClass("custom-class");
		expect(button).toHaveAttribute("id", "tab-one");
	});

	describe("active state", () => {
		it("should not have isActive class when its value does not match the current tab", () => {
			render(
				<TabContainer defaultValue="two">
					<TabButton value="one">One</TabButton>
					<TabButton value="two">Two</TabButton>
				</TabContainer>,
			);

			expect(screen.getByRole("button", { name: "One" })).not.toHaveClass(
				"isActive",
			);
		});

		it("should have isActive class when its value matches the current tab", () => {
			render(
				<TabContainer defaultValue="two">
					<TabButton value="one">One</TabButton>
					<TabButton value="two">Two</TabButton>
				</TabContainer>,
			);

			expect(screen.getByRole("button", { name: "Two" })).toHaveClass(
				"isActive",
			);
		});

		it("should not be active when no defaultValue is set", () => {
			render(
				<TabContainer>
					<TabButton value="one">One</TabButton>
				</TabContainer>,
			);

			expect(screen.getByRole("button", { name: "One" })).not.toHaveClass(
				"isActive",
			);
		});

		it("should not be active when its value is an empty string, even if currentTab is also empty", () => {
			render(
				<TabContainer defaultValue="">
					<TabButton value="">Empty</TabButton>
				</TabContainer>,
			);

			expect(screen.getByRole("button", { name: "Empty" })).not.toHaveClass(
				"isActive",
			);
		});

		it("should switch active tab when clicked", async () => {
			const user = userEvent.setup();
			render(
				<TabContainer defaultValue="one">
					<TabButton value="one">One</TabButton>
					<TabButton value="two">Two</TabButton>
				</TabContainer>,
			);

			expect(screen.getByRole("button", { name: "One" })).toHaveClass(
				"isActive",
			);

			await user.click(screen.getByRole("button", { name: "Two" }));

			expect(screen.getByRole("button", { name: "One" })).not.toHaveClass(
				"isActive",
			);
			expect(screen.getByRole("button", { name: "Two" })).toHaveClass(
				"isActive",
			);
		});
	});

	describe("onClick callback", () => {
		it("should be called when clicked", async () => {
			const onClick = vi.fn();
			const user = userEvent.setup();
			render(
				<TabContainer>
					<TabButton value="one" onClick={onClick}>
						One
					</TabButton>
				</TabContainer>,
			);

			await user.click(screen.getByRole("button", { name: "One" }));

			expect(onClick).toHaveBeenCalledTimes(1);
		});

		it("should receive the click event as argument", async () => {
			const onClick = vi.fn();
			const user = userEvent.setup();
			render(
				<TabContainer>
					<TabButton value="one" onClick={onClick}>
						One
					</TabButton>
				</TabContainer>,
			);

			await user.click(screen.getByRole("button", { name: "One" }));

			expect(onClick).toHaveBeenCalledWith(
				expect.objectContaining({ type: "click" }),
			);
		});

		it("should not be called when not clicked", () => {
			const onClick = vi.fn();
			render(
				<TabContainer>
					<TabButton value="one" onClick={onClick}>
						One
					</TabButton>
				</TabContainer>,
			);

			expect(onClick).not.toHaveBeenCalled();
		});

		it("should be called the correct number of times for multiple clicks", async () => {
			const onClick = vi.fn();
			const user = userEvent.setup();
			render(
				<TabContainer>
					<TabButton value="one" onClick={onClick}>
						One
					</TabButton>
				</TabContainer>,
			);

			const button = screen.getByRole("button", { name: "One" });
			await user.click(button);
			await user.click(button);

			expect(onClick).toHaveBeenCalledTimes(2);
		});

		it("should not throw when onClick is omitted and still switch tabs", async () => {
			const user = userEvent.setup();
			render(
				<TabContainer>
					<TabButton value="one">One</TabButton>
					<TabButton value="two">Two</TabButton>
				</TabContainer>,
			);

			await user.click(screen.getByRole("button", { name: "One" }));

			expect(screen.getByRole("button", { name: "One" })).toHaveClass(
				"isActive",
			);
		});

		it("should not be called and not switch tabs when the button is disabled", async () => {
			const onClick = vi.fn();
			const user = userEvent.setup();
			render(
				<TabContainer defaultValue="two">
					<TabButton value="one" disabled onClick={onClick}>
						One
					</TabButton>
					<TabButton value="two">Two</TabButton>
				</TabContainer>,
			);

			await user.click(screen.getByRole("button", { name: "One" }));

			expect(onClick).not.toHaveBeenCalled();
			expect(screen.getByRole("button", { name: "Two" })).toHaveClass(
				"isActive",
			);
		});
	});

	describe("disabled prop", () => {
		it("should default to not disabled when omitted", () => {
			render(
				<TabContainer>
					<TabButton value="one">One</TabButton>
				</TabContainer>,
			);

			expect(screen.getByRole("button", { name: "One" })).not.toBeDisabled();
			expect(screen.getByRole("button", { name: "One" })).not.toHaveClass(
				"isDisabled",
			);
		});

		it("should be disabled when its own disabled prop is true", () => {
			render(
				<TabContainer>
					<TabButton value="one" disabled>
						One
					</TabButton>
				</TabContainer>,
			);

			const button = screen.getByRole("button", { name: "One" });
			expect(button).toBeDisabled();
			expect(button).toHaveClass("isDisabled");
		});

		it("should be disabled when the container disables all tabs, even if its own disabled prop is false", () => {
			render(
				<TabContainer disabled>
					<TabButton value="one" disabled={false}>
						One
					</TabButton>
				</TabContainer>,
			);

			const button = screen.getByRole("button", { name: "One" });
			expect(button).toBeDisabled();
			expect(button).toHaveClass("isDisabled");
		});

		it("should remain enabled when both container and own disabled are false", () => {
			render(
				<TabContainer disabled={false}>
					<TabButton value="one" disabled={false}>
						One
					</TabButton>
				</TabContainer>,
			);

			expect(screen.getByRole("button", { name: "One" })).not.toBeDisabled();
		});

		it("should be disabled when both container and own disabled are true", () => {
			render(
				<TabContainer disabled>
					<TabButton value="one" disabled>
						One
					</TabButton>
				</TabContainer>,
			);

			expect(screen.getByRole("button", { name: "One" })).toBeDisabled();
		});
	});

	describe("className", () => {
		it("should preserve the base className", () => {
			render(
				<TabContainer>
					<TabButton value="one">One</TabButton>
				</TabContainer>,
			);

			expect(screen.getByRole("button", { name: "One" })).toHaveClass(
				"arkynTabButton",
			);
		});

		it("should merge an external className with the base className", () => {
			render(
				<TabContainer>
					<TabButton value="one" className="custom-class">
						One
					</TabButton>
				</TabContainer>,
			);

			const button = screen.getByRole("button", { name: "One" });
			expect(button).toHaveClass("arkynTabButton");
			expect(button).toHaveClass("custom-class");
		});

		it("should still render the base class when className is omitted", () => {
			render(
				<TabContainer>
					<TabButton value="one">One</TabButton>
				</TabContainer>,
			);

			expect(screen.getByRole("button", { name: "One" })).toHaveClass(
				"arkynTabButton",
			);
		});

		it("should combine base, disabled, active and custom classes together", () => {
			render(
				<TabContainer defaultValue="one" disabled>
					<TabButton value="one" className="custom-class">
						One
					</TabButton>
				</TabContainer>,
			);

			const button = screen.getByRole("button", { name: "One" });
			expect(button).toHaveClass("arkynTabButton");
			expect(button).toHaveClass("isDisabled");
			expect(button).toHaveClass("isActive");
			expect(button).toHaveClass("custom-class");
		});
	});

	// describe("ref forwarding", () => {
	// 	it("should forward ref to the underlying button element", () => {
	// 		const ref = createRef<HTMLButtonElement>();
	// 		render(
	// 			<TabContainer>
	// 				<TabButton value="one" ref={ref}>
	// 					One
	// 				</TabButton>
	// 			</TabContainer>,
	// 		);

	// 		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	// 		expect(ref.current?.textContent).toBe("One");
	// 	});
	// });

	describe("accessibility", () => {
		it("should expose a button role", () => {
			render(
				<TabContainer>
					<TabButton value="one">One</TabButton>
				</TabContainer>,
			);

			expect(screen.getByRole("button")).toBeInTheDocument();
		});

		it("should support aria-label", () => {
			render(
				<TabContainer>
					<TabButton value="one" aria-label="First tab">
						One
					</TabButton>
				</TabContainer>,
			);

			expect(
				screen.getByRole("button", { name: "First tab" }),
			).toBeInTheDocument();
		});

		it("should be focusable via keyboard tab navigation", async () => {
			const user = userEvent.setup();
			render(
				<TabContainer>
					<TabButton value="one">One</TabButton>
					<TabButton value="two">Two</TabButton>
				</TabContainer>,
			);

			await user.tab();
			expect(screen.getByRole("button", { name: "One" })).toHaveFocus();

			await user.tab();
			expect(screen.getByRole("button", { name: "Two" })).toHaveFocus();
		});

		it("should not be focusable via keyboard when disabled", async () => {
			const user = userEvent.setup();
			render(
				<TabContainer>
					<TabButton value="one" disabled>
						One
					</TabButton>
					<TabButton value="two">Two</TabButton>
				</TabContainer>,
			);

			await user.tab();
			expect(screen.getByRole("button", { name: "Two" })).toHaveFocus();
		});

		it("should switch tabs when activated with the keyboard", async () => {
			const user = userEvent.setup();
			render(
				<TabContainer defaultValue="one">
					<TabButton value="one">One</TabButton>
					<TabButton value="two">Two</TabButton>
				</TabContainer>,
			);

			await user.tab();
			await user.tab();
			await user.keyboard("{Enter}");

			expect(screen.getByRole("button", { name: "Two" })).toHaveClass(
				"isActive",
			);
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the button element", () => {
			render(
				<TabContainer>
					<TabButton value="one" data-testid="tab-one" name="tab-one">
						One
					</TabButton>
				</TabContainer>,
			);

			const button = screen.getByTestId("tab-one");
			expect(button).toHaveAttribute("name", "tab-one");
		});
	});

	describe("edge cases", () => {
		it("should handle an empty string children", () => {
			render(
				<TabContainer>
					<TabButton value="one">{""}</TabButton>
				</TabContainer>,
			);

			expect(screen.getByRole("button")).toBeInTheDocument();
		});

		it("should render without an active state when rendered without a TabContainer ancestor", () => {
			render(<TabButton value="one">One</TabButton>);

			const button = screen.getByRole("button", { name: "One" });
			expect(button).toHaveClass("arkynTabButton");
			expect(button).not.toHaveClass("isActive");
		});

		it("should throw when clicked without a TabContainer ancestor", async () => {
			// Per the DOM spec, exceptions thrown inside an event listener are
			// reported to the global scope instead of propagating to whoever
			// called `dispatchEvent` — so `user.click(...)` always resolves,
			// even when the click handler throws. Assert on the global `error`
			// event instead of expecting the click promise to reject.
			const user = userEvent.setup();
			render(<TabButton value="one">One</TabButton>);

			const onError = vi.fn((event: ErrorEvent) => {
				event.preventDefault();
			});
			window.addEventListener("error", onError);

			await user.click(screen.getByRole("button", { name: "One" }));

			window.removeEventListener("error", onError);
			expect(onError).toHaveBeenCalledTimes(1);
			expect(onError.mock.calls[0]?.[0]?.error).toBeInstanceOf(TypeError);
		});
	});
});
