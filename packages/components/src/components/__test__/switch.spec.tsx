import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Switch } from "../switch";

describe("Switch", () => {
	afterEach(() => {
		cleanup();
	});

	it("should render without errors", () => {
		render(<Switch name="notifications" />);

		expect(document.querySelector(".arkynSwitch")).toBeInTheDocument();
	});

	it("should render as a button element", () => {
		render(<Switch name="notifications" />);

		const button = document.querySelector(".arkynSwitch") as HTMLElement;
		expect(button.tagName).toBe("BUTTON");
		expect(button).toHaveAttribute("type", "button");
	});

	it("should render when all optional properties are omitted", () => {
		render(<Switch name="notifications" />);

		const button = document.querySelector(".arkynSwitch") as HTMLElement;
		expect(button).toHaveClass("arkynSwitch", "checkedFalse", "lg");
	});

	it("should render correctly with all properties filled", () => {
		const handleCheck = vi.fn();

		render(
			<Switch
				name="theme"
				label="Dark mode"
				size="md"
				value="dark"
				unCheckedValue="light"
				defaultChecked
				onCheck={handleCheck}
				showAsterisk
				orientation="vertical"
				className="custom-class"
				errorMessage="Some error"
			/>,
		);

		const button = document.querySelector(".arkynSwitch") as HTMLElement;
		expect(button).toHaveClass(
			"arkynSwitch",
			"checkedTrue",
			"md",
			"custom-class",
		);
		expect(screen.getByText("Dark mode")).toBeInTheDocument();
		expect(screen.getByText("Some error")).toBeInTheDocument();
	});

	it("should render a hidden input for form submission", () => {
		const { container } = render(<Switch name="notifications" />);

		const input = container.querySelector("input[type='hidden']");
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute("name", "notifications");
	});

	describe("label prop", () => {
		it("should not render a label when omitted", () => {
			render(<Switch name="notifications" />);

			expect(document.querySelector("label")).not.toBeInTheDocument();
		});

		it("should render the label text when provided", () => {
			render(<Switch name="notifications" label="Enable notifications" />);

			expect(screen.getByText("Enable notifications")).toBeInTheDocument();
		});

		it("should render an asterisk class when showAsterisk is true", () => {
			render(
				<Switch name="notifications" label="Required field" showAsterisk />,
			);

			const label = screen.getByText("Required field").closest("label");
			expect(label).toHaveClass("asteriskTrue");
		});

		it("should not render an asterisk class when showAsterisk is omitted", () => {
			render(<Switch name="notifications" label="Optional field" />);

			const label = screen.getByText("Optional field").closest("label");
			expect(label).toHaveClass("asteriskFalse");
		});

		it("should handle an empty label string", () => {
			render(<Switch name="notifications" label="" />);

			expect(document.querySelector("label")).not.toBeInTheDocument();
		});
	});

	describe("unShowFieldTemplate prop", () => {
		it("should render label by default when unShowFieldTemplate is omitted", () => {
			render(<Switch name="notifications" label="Visible label" />);

			expect(screen.getByText("Visible label")).toBeInTheDocument();
		});

		it("should skip the FieldTemplate wrapper (label) when true", () => {
			render(
				<Switch
					name="notifications"
					label="Hidden label"
					unShowFieldTemplate
				/>,
			);

			expect(screen.queryByText("Hidden label")).not.toBeInTheDocument();
			expect(document.querySelector(".arkynSwitch")).toBeInTheDocument();
		});

		it("should skip the error message when unShowFieldTemplate is true", () => {
			render(
				<Switch
					name="notifications"
					errorMessage="This field is required"
					unShowFieldTemplate
				/>,
			);

			expect(
				screen.queryByText("This field is required"),
			).not.toBeInTheDocument();
		});
	});

	describe("size prop", () => {
		it("should apply the default 'lg' size class when omitted", () => {
			render(<Switch name="notifications" />);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			expect(button).toHaveClass("lg");
		});

		it.each([
			"sm",
			"md",
			"lg",
		] as const)("should apply the '%s' size class", (size) => {
			render(<Switch name={`notifications-${size}`} size={size} />);

			const buttons = document.querySelectorAll(".arkynSwitch");
			const button = buttons[buttons.length - 1];
			expect(button).toHaveClass(size);
		});

		it("should not apply classes from other sizes", () => {
			render(<Switch name="notifications" size="sm" />);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			expect(button).not.toHaveClass("md");
			expect(button).not.toHaveClass("lg");
		});

		it("should replace the size class when changed", () => {
			const { rerender } = render(<Switch name="notifications" size="sm" />);

			let button = document.querySelector(".arkynSwitch") as HTMLElement;
			expect(button).toHaveClass("sm");

			rerender(<Switch name="notifications" size="lg" />);
			button = document.querySelector(".arkynSwitch") as HTMLElement;
			expect(button).toHaveClass("lg");
			expect(button).not.toHaveClass("sm");
		});
	});

	describe("checked state (uncontrolled)", () => {
		it("should default to unchecked when defaultChecked is omitted", () => {
			const { container } = render(<Switch name="notifications" />);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			const input = container.querySelector(
				"input[type='hidden']",
			) as HTMLInputElement;
			expect(button).toHaveClass("checkedFalse");
			expect(input.value).toBe("");
		});

		it("should start checked when defaultChecked is true", () => {
			const { container } = render(
				<Switch name="notifications" defaultChecked value="yes" />,
			);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			const input = container.querySelector(
				"input[type='hidden']",
			) as HTMLInputElement;
			expect(button).toHaveClass("checkedTrue");
			expect(input.value).toBe("yes");
		});

		it("should toggle checked state on click", async () => {
			const user = userEvent.setup();
			const { container } = render(<Switch name="notifications" />);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			const input = container.querySelector(
				"input[type='hidden']",
			) as HTMLInputElement;

			expect(button).toHaveClass("checkedFalse");

			await user.click(button);
			expect(button).toHaveClass("checkedTrue");
			expect(input.value).toBe("checked");

			await user.click(button);
			expect(button).toHaveClass("checkedFalse");
			expect(input.value).toBe("");
		});

		it("should toggle checked state on space key press", async () => {
			const user = userEvent.setup();
			render(<Switch name="notifications" />);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			button.focus();

			expect(button).toHaveClass("checkedFalse");

			await user.keyboard(" ");
			expect(button).toHaveClass("checkedTrue");

			await user.keyboard(" ");
			expect(button).toHaveClass("checkedFalse");
		});

		it("should use custom unCheckedValue in the hidden input when unchecked after toggling off", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Switch
					name="theme"
					value="dark"
					unCheckedValue="light"
					defaultChecked
				/>,
			);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			const input = container.querySelector(
				"input[type='hidden']",
			) as HTMLInputElement;

			expect(input.value).toBe("dark");

			await user.click(button);
			expect(input.value).toBe("light");
		});
	});

	describe("checked prop (controlled)", () => {
		it("should reflect controlled checked=true regardless of internal state", () => {
			const { container } = render(
				<Switch
					name="notifications"
					checked
					value="agreed"
					onCheck={vi.fn()}
				/>,
			);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			const input = container.querySelector(
				"input[type='hidden']",
			) as HTMLInputElement;
			expect(button).toHaveClass("checkedTrue");
			expect(input.value).toBe("agreed");
		});

		it("should reflect controlled checked=false regardless of internal state", () => {
			render(<Switch name="notifications" checked={false} onCheck={vi.fn()} />);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			expect(button).toHaveClass("checkedFalse");
		});

		it("should not change visual state on click when controlled and onCheck does not update the prop", async () => {
			const user = userEvent.setup();
			const handleCheck = vi.fn();

			render(
				<Switch name="notifications" checked={false} onCheck={handleCheck} />,
			);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			await user.click(button);

			expect(handleCheck).toHaveBeenCalledTimes(1);
			expect(button).toHaveClass("checkedFalse");
		});
	});

	describe("onCheck callback", () => {
		it("should not be called on render", () => {
			const handleCheck = vi.fn();
			render(<Switch name="notifications" onCheck={handleCheck} />);

			expect(handleCheck).not.toHaveBeenCalled();
		});

		it("should be called once per click", async () => {
			const user = userEvent.setup();
			const handleCheck = vi.fn();
			render(<Switch name="notifications" onCheck={handleCheck} />);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			await user.click(button);

			expect(handleCheck).toHaveBeenCalledTimes(1);
		});

		it("should be called with the default value 'checked' when checking with no custom value", async () => {
			const user = userEvent.setup();
			const handleCheck = vi.fn();
			render(<Switch name="notifications" onCheck={handleCheck} />);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			await user.click(button);

			expect(handleCheck).toHaveBeenCalledWith("checked");
		});

		it("should be called with the custom value when checking", async () => {
			const user = userEvent.setup();
			const handleCheck = vi.fn();
			render(<Switch name="theme" value="dark" onCheck={handleCheck} />);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			await user.click(button);

			expect(handleCheck).toHaveBeenCalledWith("dark");
		});

		it("should be called with unCheckedValue when unchecking", async () => {
			const user = userEvent.setup();
			const handleCheck = vi.fn();
			render(
				<Switch
					name="theme"
					defaultChecked
					value="dark"
					unCheckedValue="light"
					onCheck={handleCheck}
				/>,
			);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			await user.click(button);

			expect(handleCheck).toHaveBeenCalledWith("light");
		});

		it("should be called with an empty string when unchecking without a custom unCheckedValue", async () => {
			const user = userEvent.setup();
			const handleCheck = vi.fn();
			render(
				<Switch
					name="notifications"
					defaultChecked
					value="yes"
					onCheck={handleCheck}
				/>,
			);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			await user.click(button);

			expect(handleCheck).toHaveBeenCalledWith("");
		});

		it("should be called twice after two clicks with alternating values", async () => {
			const user = userEvent.setup();
			const handleCheck = vi.fn();
			render(<Switch name="notifications" value="v1" onCheck={handleCheck} />);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			await user.click(button);
			await user.click(button);

			expect(handleCheck).toHaveBeenCalledTimes(2);
			expect(handleCheck).toHaveBeenNthCalledWith(1, "v1");
			expect(handleCheck).toHaveBeenNthCalledWith(2, "");
		});

		it("should not throw when onCheck is omitted", async () => {
			const user = userEvent.setup();
			render(<Switch name="notifications" />);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			await expect(user.click(button)).resolves.not.toThrow();
		});
	});

	describe("value prop", () => {
		it("should default the hidden input value to 'checked' when value is omitted", async () => {
			const user = userEvent.setup();
			const { container } = render(<Switch name="notifications" />);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			const input = container.querySelector(
				"input[type='hidden']",
			) as HTMLInputElement;

			await user.click(button);
			expect(input.value).toBe("checked");
		});

		it("should use the custom value in the hidden input when checked", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Switch name="notifications" value="custom-val" />,
			);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			const input = container.querySelector(
				"input[type='hidden']",
			) as HTMLInputElement;

			await user.click(button);
			expect(input.value).toBe("custom-val");
		});
	});

	describe("errorMessage prop", () => {
		it("should not render an error message when omitted", () => {
			render(<Switch name="notifications" />);

			expect(document.querySelector("strong")).not.toBeInTheDocument();
		});

		it("should render the error message when provided", () => {
			render(
				<Switch name="notifications" errorMessage="This field is required" />,
			);

			expect(screen.getByText("This field is required")).toBeInTheDocument();
		});

		it("should render the error message inside a strong element", () => {
			render(<Switch name="notifications" errorMessage="Required" />);

			const error = screen.getByText("Required");
			expect(error.tagName).toBe("STRONG");
		});

		it("should handle an empty errorMessage string", () => {
			render(<Switch name="notifications" errorMessage="" />);

			expect(document.querySelector("strong")).not.toBeInTheDocument();
		});
	});

	describe("orientation prop", () => {
		it("should default to 'horizontalReverse' orientation", () => {
			render(<Switch name="notifications" label="Label" />);

			const wrapper = screen
				.getByText("Label")
				.closest("section") as HTMLElement;
			expect(wrapper).toHaveClass("horizontalReverse");
		});

		it.each([
			"horizontal",
			"vertical",
			"horizontalReverse",
		] as const)("should apply the '%s' orientation class to the wrapper", (orientation) => {
			render(
				<Switch
					name={`notifications-${orientation}`}
					label="Label"
					orientation={orientation}
				/>,
			);

			const labels = screen.getAllByText("Label");
			const wrapper = labels[labels.length - 1].closest(
				"section",
			) as HTMLElement;
			expect(wrapper).toHaveClass(orientation);
		});
	});

	describe("className merge", () => {
		it("should apply a custom className to the button root", () => {
			render(<Switch name="notifications" className="custom-class" />);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			expect(button).toHaveClass("arkynSwitch");
			expect(button).toHaveClass("custom-class");
		});

		it("should preserve the base class when className is omitted", () => {
			render(<Switch name="notifications" />);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			expect(button).toHaveClass("arkynSwitch");
		});

		it("should handle an empty className string", () => {
			render(<Switch name="notifications" className="" />);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			expect(button).toHaveClass("arkynSwitch");
		});
	});

	describe("id prop", () => {
		it("should generate an id automatically when omitted", () => {
			const { container } = render(<Switch name="notifications" />);

			const input = container.querySelector("input[type='hidden']");
			expect(input?.id).toBeTruthy();
		});

		it("should use the provided id when specified", () => {
			render(<Switch name="notifications" id="custom-id" />);

			expect(document.getElementById("custom-id")).toBeInTheDocument();
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the button element", () => {
			render(<Switch name="notifications" data-testid="switch-root" />);

			const button = screen.getByTestId("switch-root");
			expect(button).toBeInTheDocument();
		});

		it("should forward aria-label", () => {
			render(<Switch name="notifications" aria-label="Enable notifications" />);

			expect(screen.getByLabelText("Enable notifications")).toBeInTheDocument();
		});

		it("should forward disabled attribute", () => {
			render(<Switch name="notifications" disabled />);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			expect(button).toBeDisabled();
		});

		it("should forward inline style", () => {
			render(<Switch name="notifications" style={{ marginTop: "10px" }} />);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			expect(button).toHaveStyle({ marginTop: "10px" });
		});
	});

	describe("disabled state", () => {
		it("should not toggle checked state when disabled and clicked", async () => {
			const user = userEvent.setup();
			const handleCheck = vi.fn();
			render(<Switch name="notifications" disabled onCheck={handleCheck} />);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			await user.click(button);

			expect(handleCheck).not.toHaveBeenCalled();
			expect(button).toHaveClass("checkedFalse");
		});

		it("should combine disabled with checked state classes", () => {
			render(<Switch name="notifications" disabled defaultChecked />);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			expect(button).toBeDisabled();
			expect(button).toHaveClass("checkedTrue");
		});
	});

	describe("accessibility", () => {
		it("should be focusable via tab", async () => {
			const user = userEvent.setup();
			render(<Switch name="notifications" />);

			await user.tab();

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			expect(button).toHaveFocus();
		});

		it("should not be focusable via tab when disabled", async () => {
			const user = userEvent.setup();
			render(<Switch name="notifications" disabled />);

			await user.tab();

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			expect(button).not.toHaveFocus();
		});

		it("should be identified by an accessible name via aria-label", () => {
			render(<Switch name="notifications" aria-label="Enable notifications" />);

			expect(
				screen.getByRole("button", { name: "Enable notifications" }),
			).toBeInTheDocument();
		});

		it("should support an explicit role override such as 'switch'", () => {
			render(
				<Switch name="notifications" role="switch" aria-checked={false} />,
			);

			expect(screen.getByRole("switch")).toBeInTheDocument();
		});

		it("should reflect aria-checked when passed explicitly and toggled", async () => {
			function ControlledSwitch() {
				const [checked, setChecked] = useState(false);
				return (
					<Switch
						name="notifications"
						role="switch"
						aria-checked={checked}
						checked={checked}
						onCheck={(value: string) => setChecked(!!value)}
					/>
				);
			}

			const user = userEvent.setup();
			render(<ControlledSwitch />);

			const button = screen.getByRole("switch");
			expect(button).toHaveAttribute("aria-checked", "false");

			await user.click(button);
			expect(button).toHaveAttribute("aria-checked", "true");
		});

		it("should render the field wrapper section with an id matching the field name", () => {
			render(<Switch name="notifications" label="Enable" />);

			const label = screen.getByText("Enable");
			const wrapper = label.closest("section") as HTMLElement;
			expect(wrapper).toHaveAttribute("id", "notifications");
		});
	});

	describe("edge cases", () => {
		it("should handle an empty value string", async () => {
			const user = userEvent.setup();
			const { container } = render(<Switch name="notifications" value="" />);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			const input = container.querySelector(
				"input[type='hidden']",
			) as HTMLInputElement;

			await user.click(button);
			expect(input.value).toBe("checked");
		});

		it("should render correctly with a name containing special characters", () => {
			const { container } = render(<Switch name="user[notifications]" />);

			const input = container.querySelector("input[type='hidden']");
			expect(input).toHaveAttribute("name", "user[notifications]");
		});

		it("should not crash when rendered with only the required name prop", () => {
			expect(() => render(<Switch name="minimal" />)).not.toThrow();
		});
	});

	describe("prop interaction: checked + disabled", () => {
		it("should visually render as checked and disabled simultaneously", () => {
			render(
				<Switch name="notifications" checked disabled onCheck={vi.fn()} />,
			);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			expect(button).toHaveClass("checkedTrue");
			expect(button).toBeDisabled();
		});
	});

	describe("prop interaction: size + checked", () => {
		it("should combine size and checked classes correctly", () => {
			render(<Switch name="notifications" size="sm" defaultChecked />);

			const button = document.querySelector(".arkynSwitch") as HTMLElement;
			expect(button).toHaveClass("sm");
			expect(button).toHaveClass("checkedTrue");
		});
	});
});
