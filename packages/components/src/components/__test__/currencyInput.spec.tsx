import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DollarSign } from "lucide-react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FormProvider } from "../../providers/formProvider";
import { CurrencyInput } from "../currencyInput";

describe("CurrencyInput", () => {
	afterEach(() => {
		cleanup();
	});

	it("should render without errors", () => {
		render(<CurrencyInput name="price" locale="USD" />);

		expect(screen.getByRole("textbox")).toBeInTheDocument();
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(<CurrencyInput name="price" locale="USD" />);

		expect(container.querySelector(".arkynCurrencyInput")).toBeInTheDocument();
	});

	it("should render correctly with all properties filled", () => {
		render(
			<CurrencyInput
				name="price"
				locale="USD"
				label="Price"
				errorMessage="Invalid"
				isLoading={false}
				size="lg"
				variant="outline"
				orientation="vertical"
				prefix="P"
				suffix="S"
				showAsterisk
				leftIcon={DollarSign}
				rightIcon={DollarSign}
				max={5000}
				defaultValue={10}
				className="custom-class"
			/>,
		);

		expect(screen.getByText("Price")).toBeInTheDocument();
		expect(screen.getByText("Invalid")).toBeInTheDocument();
		expect(screen.getByRole("textbox")).toBeInTheDocument();
	});

	it("should display the default value formatted for the given locale", () => {
		render(<CurrencyInput name="price" locale="USD" defaultValue={1234.56} />);

		const input = screen.getByRole("textbox") as HTMLInputElement;
		expect(input.value).toBe("$1,234.56");
	});

	it("should display zero as the default masked value when no value is given", () => {
		render(<CurrencyInput name="price" locale="USD" />);

		const input = screen.getByRole("textbox") as HTMLInputElement;
		expect(input.value).toBe("$0.00");
	});

	describe("locale prop", () => {
		it("should format the value according to the BRL locale", () => {
			render(
				<CurrencyInput name="price" locale="BRL" defaultValue={1234.56} />,
			);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input.value).toBe("R$ 1.234,56");
		});

		it("should format the value according to the EUR locale", () => {
			render(
				<CurrencyInput name="price" locale="EUR" defaultValue={1234.56} />,
			);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input.value).toContain("1.234,56");
		});

		it("should reformat the displayed value when the locale prop changes", () => {
			const { rerender } = render(
				<CurrencyInput name="price" locale="USD" defaultValue={1234.56} />,
			);

			let input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input.value).toBe("$1,234.56");

			rerender(
				<CurrencyInput name="price" locale="BRL" defaultValue={1234.56} />,
			);

			input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input.value).toBe("R$ 1.234,56");
		});
	});

	describe("typing behavior", () => {
		it("should mask digits typed by the user according to the locale", async () => {
			const user = userEvent.setup();
			render(<CurrencyInput name="price" locale="USD" />);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			await user.type(input, "1234");

			expect(input.value).toBe("$12.34");
		});

		it("should keep masking correctly as more digits are typed", async () => {
			const user = userEvent.setup();
			render(<CurrencyInput name="price" locale="USD" />);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			await user.type(input, "100000");

			expect(input.value).toBe("$1,000.00");
		});

		it("should store the raw numeric value in the hidden input for form submission", async () => {
			const user = userEvent.setup();
			const { container } = render(<CurrencyInput name="price" locale="USD" />);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			await user.type(input, "1234");

			const hiddenInput = container.querySelector(
				'input[type="hidden"][name="price"]',
			) as HTMLInputElement;
			expect(hiddenInput.value).toBe("12.34");
		});
	});

	describe("onChange callback", () => {
		it("should be called when the user types", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(
				<CurrencyInput name="price" locale="USD" onChange={handleChange} />,
			);

			const input = screen.getByRole("textbox");
			await user.type(input, "5");

			expect(handleChange).toHaveBeenCalled();
		});

		it("should be called once per keystroke", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(
				<CurrencyInput name="price" locale="USD" onChange={handleChange} />,
			);

			const input = screen.getByRole("textbox");
			await user.type(input, "123");

			expect(handleChange).toHaveBeenCalledTimes(3);
		});

		it("should receive the event, the raw numeric string and the masked value", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(
				<CurrencyInput name="price" locale="USD" onChange={handleChange} />,
			);

			const input = screen.getByRole("textbox");
			await user.type(input, "1234");

			const lastCallArgs = handleChange.mock.calls.at(-1);
			expect(lastCallArgs?.[1]).toBe("12.34");
			expect(lastCallArgs?.[2]).toBe("$12.34");
			expect(lastCallArgs?.[0]).toHaveProperty("target");
		});

		it("should not be called when the component is disabled", () => {
			const handleChange = vi.fn();
			render(
				<CurrencyInput
					name="price"
					locale="USD"
					disabled
					onChange={handleChange}
				/>,
			);

			expect(handleChange).not.toHaveBeenCalled();
		});

		it("should not throw when onChange is omitted", async () => {
			const user = userEvent.setup();
			render(<CurrencyInput name="price" locale="USD" />);

			const input = screen.getByRole("textbox");
			await expect(user.type(input, "1")).resolves.not.toThrow();
		});
	});

	describe("onFocus and onBlur callbacks", () => {
		it("should call onFocus when the input is focused", async () => {
			const user = userEvent.setup();
			const handleFocus = vi.fn();
			render(<CurrencyInput name="price" locale="USD" onFocus={handleFocus} />);

			await user.click(screen.getByRole("textbox"));

			expect(handleFocus).toHaveBeenCalledTimes(1);
		});

		it("should call onBlur when the input loses focus", async () => {
			const user = userEvent.setup();
			const handleBlur = vi.fn();
			render(<CurrencyInput name="price" locale="USD" onBlur={handleBlur} />);

			const input = screen.getByRole("textbox");
			await user.click(input);
			await user.tab();

			expect(handleBlur).toHaveBeenCalledTimes(1);
		});

		it("should apply the focused class while the input is focused", async () => {
			const user = userEvent.setup();
			const { container } = render(<CurrencyInput name="price" locale="USD" />);

			const section = container.querySelector(
				".arkynCurrencyInput",
			) as HTMLElement;
			expect(section).not.toHaveClass("focused");

			await user.click(screen.getByRole("textbox"));
			expect(section).toHaveClass("focused");
		});

		it("should remove the focused class on blur", async () => {
			const user = userEvent.setup();
			const { container } = render(<CurrencyInput name="price" locale="USD" />);

			const section = container.querySelector(
				".arkynCurrencyInput",
			) as HTMLElement;

			const input = screen.getByRole("textbox");
			await user.click(input);
			expect(section).toHaveClass("focused");

			await user.tab();
			expect(section).not.toHaveClass("focused");
		});

		it("should focus the input when the wrapping section is clicked", async () => {
			const user = userEvent.setup();
			const { container } = render(<CurrencyInput name="price" locale="USD" />);

			const section = container.querySelector(
				".arkynCurrencyInput",
			) as HTMLElement;
			const input = screen.getByRole("textbox");

			await user.click(section);

			expect(input).toHaveFocus();
		});

		it("should not focus the input when the section is clicked while disabled", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<CurrencyInput name="price" locale="USD" disabled />,
			);

			const section = container.querySelector(
				".arkynCurrencyInput",
			) as HTMLElement;

			await user.click(section);

			expect(section).not.toHaveClass("focused");
		});
	});

	describe("disabled state", () => {
		it("should disable the input when disabled is true", () => {
			render(<CurrencyInput name="price" locale="USD" disabled />);

			expect(screen.getByRole("textbox")).toBeDisabled();
		});

		it("should not disable the input by default", () => {
			render(<CurrencyInput name="price" locale="USD" />);

			expect(screen.getByRole("textbox")).not.toBeDisabled();
		});

		it("should apply the opacity class when disabled", () => {
			const { container } = render(
				<CurrencyInput name="price" locale="USD" disabled />,
			);

			expect(container.querySelector(".arkynCurrencyInput")).toHaveClass(
				"opacity",
			);
		});

		it("should render the masked value as a placeholder instead of a value when disabled", () => {
			render(
				<CurrencyInput
					name="price"
					locale="USD"
					disabled
					defaultValue={99.9}
				/>,
			);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input.value).toBe("");
			expect(input).toHaveAttribute("placeholder", "$99.90");
		});
	});

	describe("isLoading state", () => {
		it("should disable the input while loading", () => {
			render(<CurrencyInput name="price" locale="USD" isLoading />);

			expect(screen.getByRole("textbox")).toBeDisabled();
		});

		it("should render a spinner on the left by default when loading", () => {
			const { container } = render(
				<CurrencyInput name="price" locale="USD" isLoading />,
			);

			expect(container.querySelector(".spinner")).toBeInTheDocument();
		});

		it("should render the spinner on the right when a rightIcon is set", () => {
			const { container } = render(
				<CurrencyInput
					name="price"
					locale="USD"
					isLoading
					rightIcon={DollarSign}
				/>,
			);

			const spinner = container.querySelector(".spinner");
			const icons = container.querySelectorAll("svg");
			expect(spinner).toBeInTheDocument();
			expect(icons[icons.length - 1]).toHaveClass("spinner");
		});

		it("should not render leftIcon or rightIcon while loading", () => {
			const { container } = render(
				<CurrencyInput
					name="price"
					locale="USD"
					isLoading
					leftIcon={DollarSign}
					rightIcon={DollarSign}
				/>,
			);

			const icons = container.querySelectorAll("svg");
			expect(icons).toHaveLength(1);
		});

		it("should not render a spinner when not loading", () => {
			const { container } = render(<CurrencyInput name="price" locale="USD" />);

			expect(container.querySelector(".spinner")).not.toBeInTheDocument();
		});

		it("should apply opacity class when loading", () => {
			const { container } = render(
				<CurrencyInput name="price" locale="USD" isLoading />,
			);

			expect(container.querySelector(".arkynCurrencyInput")).toHaveClass(
				"opacity",
			);
		});
	});

	describe("disabled and isLoading interaction", () => {
		it("should keep the input disabled when both disabled and isLoading are true", () => {
			render(<CurrencyInput name="price" locale="USD" disabled isLoading />);

			expect(screen.getByRole("textbox")).toBeDisabled();
		});

		it("should be disabled when only isLoading is true and disabled is omitted", () => {
			render(<CurrencyInput name="price" locale="USD" isLoading />);

			expect(screen.getByRole("textbox")).toBeDisabled();
		});
	});

	describe("readOnly state", () => {
		it("should mark the input as readOnly", () => {
			render(<CurrencyInput name="price" locale="USD" readOnly />);

			expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
		});

		it("should apply the opacity class when readOnly", () => {
			const { container } = render(
				<CurrencyInput name="price" locale="USD" readOnly />,
			);

			expect(container.querySelector(".arkynCurrencyInput")).toHaveClass(
				"opacity",
			);
		});

		it("should not disable the input purely because of readOnly", () => {
			render(<CurrencyInput name="price" locale="USD" readOnly />);

			expect(screen.getByRole("textbox")).not.toBeDisabled();
		});
	});

	describe("error state", () => {
		it("should display the errorMessage prop text", () => {
			render(
				<CurrencyInput
					name="price"
					locale="USD"
					errorMessage="Required field"
				/>,
			);

			expect(screen.getByText("Required field")).toBeInTheDocument();
		});

		it("should apply the errored class when errorMessage is set", () => {
			const { container } = render(
				<CurrencyInput name="price" locale="USD" errorMessage="Bad value" />,
			);

			expect(container.querySelector(".arkynCurrencyInput")).toHaveClass(
				"errored",
			);
		});

		it("should not apply the errored class when there is no error", () => {
			const { container } = render(<CurrencyInput name="price" locale="USD" />);

			expect(container.querySelector(".arkynCurrencyInput")).not.toHaveClass(
				"errored",
			);
		});

		it("should display an error coming from FormProvider fieldErrors matched by name", () => {
			render(
				<FormProvider fieldErrors={{ price: "Server-side error" }}>
					<CurrencyInput name="price" locale="USD" />
				</FormProvider>,
			);

			expect(screen.getByText("Server-side error")).toBeInTheDocument();
		});

		it("should prioritize the errorMessage prop over the FormProvider error", () => {
			render(
				<FormProvider fieldErrors={{ price: "Server-side error" }}>
					<CurrencyInput name="price" locale="USD" errorMessage="Prop error" />
				</FormProvider>,
			);

			expect(screen.getByText("Prop error")).toBeInTheDocument();
			expect(screen.queryByText("Server-side error")).not.toBeInTheDocument();
		});

		it("should not render a FieldError element when there is no error", () => {
			const { container } = render(<CurrencyInput name="price" locale="USD" />);

			expect(
				container.querySelector(".arkynFieldError"),
			).not.toBeInTheDocument();
		});
	});

	describe("label integration", () => {
		it("should render the label text when provided", () => {
			render(<CurrencyInput name="price" locale="USD" label="Amount" />);

			expect(screen.getByText("Amount")).toBeInTheDocument();
		});

		it("should not render a label element when label is omitted", () => {
			const { container } = render(<CurrencyInput name="price" locale="USD" />);

			expect(container.querySelector("label")).not.toBeInTheDocument();
		});

		it("should render an asterisk on the label when showAsterisk is true", () => {
			const { container } = render(
				<CurrencyInput name="price" locale="USD" label="Amount" showAsterisk />,
			);

			const label = container.querySelector("label");
			expect(label).toHaveClass("asteriskTrue");
		});

		it("should not render an asterisk class by default", () => {
			const { container } = render(
				<CurrencyInput name="price" locale="USD" label="Amount" />,
			);

			const label = container.querySelector("label");
			expect(label).toHaveClass("asteriskFalse");
		});
	});

	describe("unShowFieldTemplate prop", () => {
		it("should skip the FieldTemplate wrapper, label and error when true", () => {
			const { container } = render(
				<CurrencyInput
					name="price"
					locale="USD"
					label="Amount"
					errorMessage="Some error"
					unShowFieldTemplate
				/>,
			);

			expect(
				container.querySelector(".arkynFieldWrapper"),
			).not.toBeInTheDocument();
			expect(screen.queryByText("Amount")).not.toBeInTheDocument();
			expect(screen.queryByText("Some error")).not.toBeInTheDocument();
			expect(
				container.querySelector(".arkynCurrencyInput"),
			).toBeInTheDocument();
		});

		it("should render the FieldTemplate wrapper by default", () => {
			const { container } = render(
				<CurrencyInput name="price" locale="USD" label="Amount" />,
			);

			expect(container.querySelector(".arkynFieldWrapper")).toBeInTheDocument();
		});
	});

	describe("size prop", () => {
		it("should apply the default 'md' size class when omitted", () => {
			const { container } = render(<CurrencyInput name="price" locale="USD" />);

			expect(container.querySelector(".arkynCurrencyInput")).toHaveClass("md");
		});

		it("should apply the 'lg' size class when specified", () => {
			const { container } = render(
				<CurrencyInput name="price" locale="USD" size="lg" />,
			);

			const section = container.querySelector(".arkynCurrencyInput");
			expect(section).toHaveClass("lg");
			expect(section).not.toHaveClass("md");
		});
	});

	describe("variant prop", () => {
		it("should apply the default 'solid' variant class when omitted", () => {
			const { container } = render(<CurrencyInput name="price" locale="USD" />);

			expect(container.querySelector(".arkynCurrencyInput")).toHaveClass(
				"solid",
			);
		});

		it.each([
			"solid",
			"outline",
			"underline",
		] as const)("should apply the '%s' variant class", (variant) => {
			const { container } = render(
				<CurrencyInput name="price" locale="USD" variant={variant} />,
			);

			expect(container.querySelector(".arkynCurrencyInput")).toHaveClass(
				variant,
			);
		});

		it("should not apply classes from other variants", () => {
			const { container } = render(
				<CurrencyInput name="price" locale="USD" variant="outline" />,
			);

			const section = container.querySelector(".arkynCurrencyInput");
			expect(section).not.toHaveClass("solid");
			expect(section).not.toHaveClass("underline");
		});
	});

	describe("orientation prop", () => {
		it("should apply the horizontal class by default via FieldWrapper", () => {
			const { container } = render(
				<CurrencyInput name="price" locale="USD" label="Amount" />,
			);

			expect(container.querySelector(".arkynFieldWrapper")).toHaveClass(
				"vertical",
			);
		});

		it("should apply a custom orientation class when specified", () => {
			const { container } = render(
				<CurrencyInput
					name="price"
					locale="USD"
					label="Amount"
					orientation="horizontal"
				/>,
			);

			expect(container.querySelector(".arkynFieldWrapper")).toHaveClass(
				"horizontal",
			);
		});
	});

	describe("prefix and suffix slots", () => {
		it("should not render prefix or suffix text by default", () => {
			render(<CurrencyInput name="price" locale="USD" />);

			expect(screen.queryByText("$")).not.toBeInTheDocument();
		});

		it("should render a string prefix", () => {
			render(<CurrencyInput name="price" locale="USD" prefix="USD" />);

			expect(screen.getByText("USD")).toBeInTheDocument();
		});

		it("should render a string suffix", () => {
			render(<CurrencyInput name="price" locale="USD" suffix="/mo" />);

			expect(screen.getByText("/mo")).toBeInTheDocument();
		});

		it("should render an icon prefix", () => {
			const { container } = render(
				<CurrencyInput name="price" locale="USD" prefix={DollarSign} />,
			);

			expect(container.querySelector("svg.prefix")).toBeInTheDocument();
		});

		it("should render an icon suffix", () => {
			const { container } = render(
				<CurrencyInput name="price" locale="USD" suffix={DollarSign} />,
			);

			expect(container.querySelector("svg.suffix")).toBeInTheDocument();
		});

		it("should apply the hasPrefix class when a prefix is set", () => {
			const { container } = render(
				<CurrencyInput name="price" locale="USD" prefix="USD" />,
			);

			expect(container.querySelector(".arkynCurrencyInput")).toHaveClass(
				"hasPrefix",
			);
		});

		it("should apply the hasSuffix class when a suffix is set", () => {
			const { container } = render(
				<CurrencyInput name="price" locale="USD" suffix="USD" />,
			);

			expect(container.querySelector(".arkynCurrencyInput")).toHaveClass(
				"hasSuffix",
			);
		});
	});

	describe("leftIcon and rightIcon slots", () => {
		it("should render the leftIcon when not loading", () => {
			const { container } = render(
				<CurrencyInput name="price" locale="USD" leftIcon={DollarSign} />,
			);

			expect(container.querySelector("svg")).toBeInTheDocument();
		});

		it("should render the rightIcon when not loading", () => {
			const { container } = render(
				<CurrencyInput name="price" locale="USD" rightIcon={DollarSign} />,
			);

			expect(container.querySelector("svg")).toBeInTheDocument();
		});

		it("should not render icons when neither leftIcon nor rightIcon is given", () => {
			const { container } = render(<CurrencyInput name="price" locale="USD" />);

			expect(container.querySelectorAll("svg")).toHaveLength(0);
		});
	});

	describe("className merge", () => {
		it("should forward className to the FieldTemplate wrapper", () => {
			const { container } = render(
				<CurrencyInput
					name="price"
					locale="USD"
					label="Amount"
					className="custom-class"
				/>,
			);

			expect(container.querySelector(".arkynFieldWrapper")).toHaveClass(
				"custom-class",
			);
		});

		it("should preserve the arkynCurrencyInput base class regardless of className", () => {
			const { container } = render(
				<CurrencyInput
					name="price"
					locale="USD"
					label="Amount"
					className="custom-class"
				/>,
			);

			expect(
				container.querySelector(".arkynCurrencyInput"),
			).toBeInTheDocument();
		});
	});

	describe("max prop", () => {
		it("should accept a value within the default max", async () => {
			const user = userEvent.setup();
			render(<CurrencyInput name="price" locale="USD" />);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			await user.type(input, "500");

			expect(input.value).toBe("$5.00");
		});

		it("should not update the masked value once a custom max is exceeded", async () => {
			const user = userEvent.setup();
			render(<CurrencyInput name="price" locale="USD" max={5} />);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			await user.type(input, "600");

			expect(input.value).not.toBe("$6.00");
			expect(input.value).toBe("$0.60");
		});

		it("should still call onChange with the calculated masked value even when max is exceeded", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(
				<CurrencyInput
					name="price"
					locale="USD"
					max={5}
					onChange={handleChange}
				/>,
			);

			const input = screen.getByRole("textbox");
			await user.type(input, "600");

			expect(handleChange).toHaveBeenCalled();
			const lastCallArgs = handleChange.mock.calls.at(-1);
			expect(lastCallArgs?.[2]).toBe("$6.00");
		});
	});

	describe("value prop (controlled)", () => {
		it("should reflect a controlled numeric value", () => {
			render(<CurrencyInput name="price" locale="USD" value={50} />);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input.value).toBe("$50.00");
		});

		it("should update the masked value when the controlled value prop changes", () => {
			const { rerender } = render(
				<CurrencyInput name="price" locale="USD" value={50} />,
			);

			let input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input.value).toBe("$50.00");

			rerender(<CurrencyInput name="price" locale="USD" value={75} />);
			input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input.value).toBe("$75.00");
		});
	});

	describe("name prop", () => {
		it("should set the name attribute on the hidden input", () => {
			const { container } = render(
				<CurrencyInput name="totalAmount" locale="USD" />,
			);

			expect(container.querySelector('input[type="hidden"]')).toHaveAttribute(
				"name",
				"totalAmount",
			);
		});
	});

	describe("id prop", () => {
		it("should use a generated id when id is omitted", () => {
			render(<CurrencyInput name="price" locale="USD" />);

			const input = screen.getByRole("textbox");
			expect(input.id).toBeTruthy();
		});

		it("should use the given id when provided", () => {
			render(<CurrencyInput name="price" locale="USD" id="price-input" />);

			expect(document.getElementById("price-input")).toBeInTheDocument();
		});
	});

	describe("title and style props", () => {
		it("should forward the title attribute to the wrapping section", () => {
			const { container } = render(
				<CurrencyInput name="price" locale="USD" title="Price field" />,
			);

			expect(container.querySelector(".arkynCurrencyInput")).toHaveAttribute(
				"title",
				"Price field",
			);
		});

		it("should forward inline style to the wrapping section", () => {
			const { container } = render(
				<CurrencyInput
					name="price"
					locale="USD"
					style={{ marginTop: "10px" }}
				/>,
			);

			expect(container.querySelector(".arkynCurrencyInput")).toHaveStyle({
				marginTop: "10px",
			});
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the visible input", () => {
			render(
				<CurrencyInput
					name="price"
					locale="USD"
					data-testid="price-field"
					aria-label="Price"
				/>,
			);

			const input = screen.getByTestId("price-field");
			expect(input).toHaveAttribute("aria-label", "Price");
		});
	});

	describe("accessibility", () => {
		it("should render the label text alongside the input sharing the given id", () => {
			render(
				<CurrencyInput
					name="price"
					locale="USD"
					label="Amount"
					id="amount-input"
				/>,
			);

			expect(screen.getByText("Amount").tagName).toBe("LABEL");
			expect(screen.getByRole("textbox")).toHaveAttribute("id", "amount-input");
		});

		it("should be focusable via keyboard tabbing", async () => {
			const user = userEvent.setup();
			render(<CurrencyInput name="price" locale="USD" />);

			await user.tab();

			expect(screen.getByRole("textbox")).toHaveFocus();
		});

		it("should not be focusable via keyboard when disabled", async () => {
			const user = userEvent.setup();
			render(<CurrencyInput name="price" locale="USD" disabled />);

			await user.tab();

			expect(screen.getByRole("textbox")).not.toHaveFocus();
		});
	});

	describe("edge cases", () => {
		it("should handle defaultValue of 0", () => {
			render(<CurrencyInput name="price" locale="USD" defaultValue={0} />);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input.value).toBe("$0.00");
		});

		it("should handle an undefined defaultValue gracefully", () => {
			render(
				<CurrencyInput name="price" locale="USD" defaultValue={undefined} />,
			);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input.value).toBe("$0.00");
		});

		it("should handle an empty errorMessage string as no error", () => {
			const { container } = render(
				<CurrencyInput name="price" locale="USD" errorMessage="" />,
			);

			expect(container.querySelector(".arkynCurrencyInput")).not.toHaveClass(
				"errored",
			);
		});

		it("should handle an empty className string without adding stray classes", () => {
			const { container } = render(
				<CurrencyInput name="price" locale="USD" className="" />,
			);

			expect(
				container.querySelector(".arkynCurrencyInput"),
			).toBeInTheDocument();
		});

		it("should not throw when rendered with only the required props", () => {
			expect(() =>
				render(<CurrencyInput name="price" locale="USD" />),
			).not.toThrow();
		});
	});
});
