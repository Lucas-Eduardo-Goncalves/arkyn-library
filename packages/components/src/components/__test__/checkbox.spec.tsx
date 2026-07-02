import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FormProvider } from "../../providers/formProvider";
import { Checkbox } from "../checkbox";

describe("Checkbox", () => {
	afterEach(() => {
		cleanup();
	});

	it("should render without errors", () => {
		render(<Checkbox name="terms" />);

		expect(document.querySelector(".arkynCheckbox")).toBeInTheDocument();
	});

	it("should render as a button element", () => {
		render(<Checkbox name="terms" />);

		const button = document.querySelector(".arkynCheckbox") as HTMLElement;
		expect(button.tagName).toBe("BUTTON");
		expect(button).toHaveAttribute("type", "button");
	});

	it("should render when all optional properties are omitted", () => {
		render(<Checkbox name="terms" />);

		const button = document.querySelector(".arkynCheckbox") as HTMLElement;
		expect(button).toHaveClass(
			"arkynCheckbox",
			"md",
			"errorFalse",
			"checkedFalse",
		);
	});

	it("should render correctly with all properties filled", () => {
		const handleCheck = vi.fn();

		render(
			<Checkbox
				name="premium"
				label="Enable premium"
				size="lg"
				value="premium-value"
				defaultChecked
				onCheck={handleCheck}
				showAsterisk
				orientation="vertical"
				className="custom-wrapper"
			/>,
		);

		const button = document.querySelector(".arkynCheckbox") as HTMLElement;
		expect(button).toHaveClass("arkynCheckbox", "lg", "checkedTrue");
		expect(screen.getByText("Enable premium")).toBeInTheDocument();
	});

	it("should render a hidden input for form submission", () => {
		const { container } = render(<Checkbox name="terms" />);

		const input = container.querySelector("input[type='hidden']");
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute("name", "terms");
	});

	it("should render the Check icon inside the button", () => {
		render(<Checkbox name="terms" />);

		const button = document.querySelector(".arkynCheckbox") as HTMLElement;
		expect(button.querySelector("svg")).toBeInTheDocument();
	});

	describe("label prop", () => {
		it("should not render a label when omitted", () => {
			render(<Checkbox name="terms" />);

			expect(document.querySelector("label")).not.toBeInTheDocument();
		});

		it("should render the label text when provided", () => {
			render(<Checkbox name="terms" label="I agree to the terms" />);

			expect(screen.getByText("I agree to the terms")).toBeInTheDocument();
		});

		it("should render an asterisk when showAsterisk is true", () => {
			render(<Checkbox name="terms" label="Required field" showAsterisk />);

			const label = screen.getByText("Required field").closest("label");
			expect(label).toHaveClass("asteriskTrue");
		});

		it("should not render an asterisk class when showAsterisk is omitted", () => {
			render(<Checkbox name="terms" label="Optional field" />);

			const label = screen.getByText("Optional field").closest("label");
			expect(label).toHaveClass("asteriskFalse");
		});
	});

	describe("unShowFieldTemplate prop", () => {
		it("should render label by default when unShowFieldTemplate is omitted", () => {
			render(<Checkbox name="terms" label="Visible label" />);

			expect(screen.getByText("Visible label")).toBeInTheDocument();
		});

		it("should skip the FieldTemplate wrapper (label) when true", () => {
			render(
				<Checkbox name="terms" label="Hidden label" unShowFieldTemplate />,
			);

			expect(screen.queryByText("Hidden label")).not.toBeInTheDocument();
			expect(document.querySelector(".arkynCheckbox")).toBeInTheDocument();
		});

		it("should skip the error message when unShowFieldTemplate is true", () => {
			render(
				<Checkbox
					name="terms"
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
		it("should apply the default 'md' size class when omitted", () => {
			render(<Checkbox name="terms" />);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			expect(button).toHaveClass("md");
		});

		it.each([
			"sm",
			"md",
			"lg",
		] as const)("should apply the '%s' size class", (size) => {
			render(<Checkbox name={`terms-${size}`} size={size} />);

			const buttons = document.querySelectorAll(".arkynCheckbox");
			const button = buttons[buttons.length - 1];
			expect(button).toHaveClass(size);
		});

		it("should not apply classes from other sizes", () => {
			render(<Checkbox name="terms" size="sm" />);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			expect(button).not.toHaveClass("md");
			expect(button).not.toHaveClass("lg");
		});

		it("should replace the size class when changed", () => {
			const { rerender } = render(<Checkbox name="terms" size="sm" />);

			let button = document.querySelector(".arkynCheckbox") as HTMLElement;
			expect(button).toHaveClass("sm");

			rerender(<Checkbox name="terms" size="lg" />);
			button = document.querySelector(".arkynCheckbox") as HTMLElement;
			expect(button).toHaveClass("lg");
			expect(button).not.toHaveClass("sm");
		});
	});

	describe("checked state (uncontrolled)", () => {
		it("should default to unchecked when defaultChecked is omitted", () => {
			const { container } = render(<Checkbox name="terms" />);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			const input = container.querySelector(
				"input[type='hidden']",
			) as HTMLInputElement;
			expect(button).toHaveClass("checkedFalse");
			expect(input.value).toBe("");
		});

		it("should start checked when defaultChecked is true", () => {
			const { container } = render(
				<Checkbox name="terms" defaultChecked value="yes" />,
			);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			const input = container.querySelector(
				"input[type='hidden']",
			) as HTMLInputElement;
			expect(button).toHaveClass("checkedTrue");
			expect(input.value).toBe("yes");
		});

		it("should toggle checked state on click", async () => {
			const user = userEvent.setup();
			const { container } = render(<Checkbox name="terms" />);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
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
			render(<Checkbox name="terms" />);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			button.focus();

			expect(button).toHaveClass("checkedFalse");

			await user.keyboard(" ");
			expect(button).toHaveClass("checkedTrue");

			await user.keyboard(" ");
			expect(button).toHaveClass("checkedFalse");
		});
	});

	describe("checked prop (controlled)", () => {
		it("should reflect controlled checked=true regardless of internal state", () => {
			const { container } = render(
				<Checkbox name="terms" checked value="agreed" onCheck={vi.fn()} />,
			);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			const input = container.querySelector(
				"input[type='hidden']",
			) as HTMLInputElement;
			expect(button).toHaveClass("checkedTrue");
			expect(input.value).toBe("agreed");
		});

		it("should reflect controlled checked=false regardless of internal state", () => {
			render(<Checkbox name="terms" checked={false} onCheck={vi.fn()} />);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			expect(button).toHaveClass("checkedFalse");
		});

		it("should not change visual state on click when controlled and onCheck does not update the prop", async () => {
			const user = userEvent.setup();
			const handleCheck = vi.fn();

			render(<Checkbox name="terms" checked={false} onCheck={handleCheck} />);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			await user.click(button);

			expect(handleCheck).toHaveBeenCalledTimes(1);
			expect(button).toHaveClass("checkedFalse");
		});
	});

	describe("onCheck callback", () => {
		it("should not be called on render", () => {
			const handleCheck = vi.fn();
			render(<Checkbox name="terms" onCheck={handleCheck} />);

			expect(handleCheck).not.toHaveBeenCalled();
		});

		it("should be called once per click", async () => {
			const user = userEvent.setup();
			const handleCheck = vi.fn();
			render(<Checkbox name="terms" onCheck={handleCheck} />);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			await user.click(button);

			expect(handleCheck).toHaveBeenCalledTimes(1);
		});

		it("should be called with the default value 'checked' when checking with no custom value", async () => {
			const user = userEvent.setup();
			const handleCheck = vi.fn();
			render(<Checkbox name="terms" onCheck={handleCheck} />);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			await user.click(button);

			expect(handleCheck).toHaveBeenCalledWith("checked");
		});

		it("should be called with the custom value when checking", async () => {
			const user = userEvent.setup();
			const handleCheck = vi.fn();
			render(
				<Checkbox name="newsletter" value="subscribed" onCheck={handleCheck} />,
			);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			await user.click(button);

			expect(handleCheck).toHaveBeenCalledWith("subscribed");
		});

		it("should be called with an empty string when unchecking", async () => {
			const user = userEvent.setup();
			const handleCheck = vi.fn();
			render(
				<Checkbox
					name="terms"
					defaultChecked
					value="yes"
					onCheck={handleCheck}
				/>,
			);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			await user.click(button);

			expect(handleCheck).toHaveBeenCalledWith("");
		});

		it("should be called twice after two clicks with alternating values", async () => {
			const user = userEvent.setup();
			const handleCheck = vi.fn();
			render(<Checkbox name="terms" value="v1" onCheck={handleCheck} />);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			await user.click(button);
			await user.click(button);

			expect(handleCheck).toHaveBeenCalledTimes(2);
			expect(handleCheck).toHaveBeenNthCalledWith(1, "v1");
			expect(handleCheck).toHaveBeenNthCalledWith(2, "");
		});

		it("should not throw when onCheck is omitted", async () => {
			const user = userEvent.setup();
			render(<Checkbox name="terms" />);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			await expect(user.click(button)).resolves.not.toThrow();
		});
	});

	describe("value prop", () => {
		it("should default the hidden input value to 'checked' when value is omitted", async () => {
			const user = userEvent.setup();
			const { container } = render(<Checkbox name="terms" />);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			const input = container.querySelector(
				"input[type='hidden']",
			) as HTMLInputElement;

			await user.click(button);
			expect(input.value).toBe("checked");
		});

		it("should use the custom value in the hidden input when checked", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Checkbox name="terms" value="custom-val" />,
			);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			const input = container.querySelector(
				"input[type='hidden']",
			) as HTMLInputElement;

			await user.click(button);
			expect(input.value).toBe("custom-val");
		});
	});

	describe("error state", () => {
		it("should apply errorFalse class when there is no error", () => {
			render(<Checkbox name="terms" />);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			expect(button).toHaveClass("errorFalse");
			expect(button).not.toHaveClass("errorTrue");
		});

		it("should apply errorTrue class and render errorMessage when set directly", () => {
			render(<Checkbox name="terms" errorMessage="This field is required" />);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			expect(button).toHaveClass("errorTrue");
			expect(screen.getByText("This field is required")).toBeInTheDocument();
		});

		it("should render the error message inside a strong element", () => {
			render(<Checkbox name="terms" errorMessage="Required" />);

			const error = screen.getByText("Required");
			expect(error.tagName).toBe("STRONG");
		});

		it("should read the error from FormProvider fieldErrors by field name", () => {
			render(
				<FormProvider fieldErrors={{ terms: "You must accept the terms" }}>
					<Checkbox name="terms" />
				</FormProvider>,
			);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			expect(button).toHaveClass("errorTrue");
			expect(screen.getByText("You must accept the terms")).toBeInTheDocument();
		});

		it("should prioritize the direct errorMessage prop over FormProvider fieldErrors", () => {
			render(
				<FormProvider fieldErrors={{ terms: "From provider" }}>
					<Checkbox name="terms" errorMessage="Direct message" />
				</FormProvider>,
			);

			expect(screen.getByText("Direct message")).toBeInTheDocument();
			expect(screen.queryByText("From provider")).not.toBeInTheDocument();
		});

		it("should not render an error message when fieldErrors does not include the field name", () => {
			render(
				<FormProvider fieldErrors={{ other: "Other error" }}>
					<Checkbox name="terms" />
				</FormProvider>,
			);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			expect(button).toHaveClass("errorFalse");
			expect(screen.queryByText("Other error")).not.toBeInTheDocument();
		});

		it("should not throw when rendered without a FormProvider ancestor", () => {
			expect(() => render(<Checkbox name="terms" />)).not.toThrow();
		});
	});

	describe("orientation prop", () => {
		it("should default to 'horizontalReverse' orientation", () => {
			render(<Checkbox name="terms" label="Label" />);

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
				<Checkbox
					name={`terms-${orientation}`}
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

	describe("className merge (wrapper)", () => {
		it("should apply a custom className to the FieldTemplate wrapper", () => {
			render(
				<Checkbox name="terms" label="Label" className="custom-wrapper" />,
			);

			const wrapper = screen
				.getByText("Label")
				.closest("section") as HTMLElement;
			expect(wrapper).toHaveClass("custom-wrapper");
		});

		it("should render without a custom className when omitted", () => {
			render(<Checkbox name="terms" label="Label" />);

			const wrapper = screen
				.getByText("Label")
				.closest("section") as HTMLElement;
			expect(wrapper).toBeInTheDocument();
		});
	});

	describe("id prop", () => {
		it("should generate an id automatically when omitted", () => {
			render(<Checkbox name="terms" />);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			expect(button.id).toBeTruthy();
		});

		it("should use the provided id when specified", () => {
			render(<Checkbox name="terms" id="custom-id" />);

			expect(document.getElementById("custom-id")).toBeInTheDocument();
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the button element", () => {
			render(<Checkbox name="terms" data-testid="checkbox-root" />);

			const button = screen.getByTestId("checkbox-root");
			expect(button).toBeInTheDocument();
		});

		it("should forward aria-label", () => {
			render(<Checkbox name="terms" aria-label="Accept terms" />);

			expect(screen.getByLabelText("Accept terms")).toBeInTheDocument();
		});

		it("should forward disabled attribute", () => {
			render(<Checkbox name="terms" disabled />);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			expect(button).toBeDisabled();
		});

		it("should forward inline style", () => {
			render(<Checkbox name="terms" style={{ marginTop: "10px" }} />);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			expect(button).toHaveStyle({ marginTop: "10px" });
		});
	});

	describe("disabled state", () => {
		it("should not toggle checked state when disabled and clicked", async () => {
			const user = userEvent.setup();
			const handleCheck = vi.fn();
			render(<Checkbox name="terms" disabled onCheck={handleCheck} />);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			await user.click(button);

			expect(handleCheck).not.toHaveBeenCalled();
			expect(button).toHaveClass("checkedFalse");
		});

		it("should combine disabled with error state classes", () => {
			render(<Checkbox name="terms" disabled errorMessage="Required" />);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			expect(button).toBeDisabled();
			expect(button).toHaveClass("errorTrue");
		});
	});

	describe("accessibility", () => {
		it("should be focusable via tab", async () => {
			const user = userEvent.setup();
			render(<Checkbox name="terms" />);

			await user.tab();

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			expect(button).toHaveFocus();
		});

		it("should not be focusable via tab when disabled", async () => {
			const user = userEvent.setup();
			render(<Checkbox name="terms" disabled />);

			await user.tab();

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			expect(button).not.toHaveFocus();
		});

		it("should be identified by an accessible name via aria-label", () => {
			render(<Checkbox name="terms" aria-label="Accept the terms" />);

			expect(
				screen.getByRole("button", { name: "Accept the terms" }),
			).toBeInTheDocument();
		});

		it("should render the field wrapper section with an id matching the field name", () => {
			render(<Checkbox name="terms" label="I agree" />);

			const label = screen.getByText("I agree");
			const wrapper = label.closest("section") as HTMLElement;
			expect(wrapper).toHaveAttribute("id", "terms");
		});
	});

	describe("edge cases", () => {
		it("should handle an empty label string", () => {
			render(<Checkbox name="terms" label="" />);

			expect(document.querySelector("label")).not.toBeInTheDocument();
		});

		it("should handle an empty errorMessage string", () => {
			render(<Checkbox name="terms" errorMessage="" />);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			expect(button).toHaveClass("errorFalse");
		});

		it("should handle an empty className string", () => {
			render(<Checkbox name="terms" label="Label" className="" />);

			const wrapper = screen
				.getByText("Label")
				.closest("section") as HTMLElement;
			expect(wrapper).toBeInTheDocument();
		});

		it("should render correctly with a name containing special characters", () => {
			const { container } = render(<Checkbox name="user[terms]" />);

			const input = container.querySelector("input[type='hidden']");
			expect(input).toHaveAttribute("name", "user[terms]");
		});

		it("should not crash when fieldErrors is undefined via FormProvider", () => {
			expect(() =>
				render(
					<FormProvider fieldErrors={undefined}>
						<Checkbox name="terms" />
					</FormProvider>,
				),
			).not.toThrow();
		});
	});

	describe("prop interaction: checked + disabled", () => {
		it("should visually render as checked and disabled simultaneously", () => {
			render(<Checkbox name="terms" checked disabled onCheck={vi.fn()} />);

			const button = document.querySelector(".arkynCheckbox") as HTMLElement;
			expect(button).toHaveClass("checkedTrue");
			expect(button).toBeDisabled();
		});
	});
});
