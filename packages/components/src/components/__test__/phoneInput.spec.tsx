import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FormProvider } from "../../providers/formProvider";
import { PhoneInput } from "../phoneInput";

describe("PhoneInput", () => {
	afterEach(() => {
		// @react-input/core starts a self-rescheduling `window.setTimeout` poll
		// loop on focus and only stops it on blur. Its own `unregister` (run on
		// unmount) strips the blur listener without ever clearing that pending
		// timeout, so any test that leaves the input focused permanently leaks
		// it. Blur before `cleanup()` unmounts, while the listener still exists.
		if (document.activeElement instanceof HTMLElement) {
			document.activeElement.blur();
		}
		cleanup();
	});

	it("should render without errors", () => {
		render(<PhoneInput name="phone" />);

		expect(screen.getByRole("textbox")).toBeInTheDocument();
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(<PhoneInput name="phone" />);

		expect(
			container.querySelector(".arkynPhoneInputContainer"),
		).toBeInTheDocument();
	});

	it("should render correctly with all properties filled", () => {
		render(
			<PhoneInput
				name="phone"
				label="Phone"
				errorMessage="Invalid"
				isLoading={false}
				size="lg"
				variant="outline"
				orientation="vertical"
				showAsterisk
				disabled={false}
				readOnly={false}
				defaultValue="+5534999998888"
				defaultCountryIso="BR"
				searchCountryPlaceholder="Search country"
				notFoundCountryText="No country found"
				className="custom-class"
			/>,
		);

		expect(screen.getByText("Phone")).toBeInTheDocument();
		expect(screen.getByText("Invalid")).toBeInTheDocument();
		expect(screen.getByRole("textbox")).toBeInTheDocument();
	});

	it("should not throw when rendered with only the required name prop", () => {
		expect(() => render(<PhoneInput name="phone" />)).not.toThrow();
	});

	describe("mask formatting", () => {
		it("should apply the 9-digit mask once 11 digits are typed", async () => {
			const user = userEvent.setup();
			render(<PhoneInput name="phone" />);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			await user.type(input, "34999998888");

			expect(input.value).toBe("(34) 99999-8888");
		});

		it("should apply the 8-digit mask once 10 digits are typed", async () => {
			const user = userEvent.setup();
			render(<PhoneInput name="phone" />);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			await user.type(input, "3499998888");

			expect(input.value).toBe("(34) 9999-8888");
		});

		it("should progressively mask digits while under 10 digits", async () => {
			const user = userEvent.setup();
			render(<PhoneInput name="phone" />);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			await user.type(input, "34999988");

			expect(input.value).toBe("(34) 9999-88");
		});

		it("should format a defaultValue using the matching country mask", () => {
			render(<PhoneInput name="phone" defaultValue="+5534999998888" />);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input.value).toBe("(34) 99999-8888");
		});

		it("should not exceed the maximum allowed digit length", async () => {
			const user = userEvent.setup();
			render(<PhoneInput name="phone" />);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			await user.type(input, "349999988889999");

			expect(input.value).toBe("(34) 99999-8888");
		});
	});

	describe("onChange callback", () => {
		it("should be called when the user types", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(<PhoneInput name="phone" onChange={handleChange} />);

			const input = screen.getByRole("textbox");
			await user.type(input, "3");

			expect(handleChange).toHaveBeenCalled();
		});

		it("should be called once per keystroke", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(<PhoneInput name="phone" onChange={handleChange} />);

			const input = screen.getByRole("textbox");
			await user.type(input, "349");

			expect(handleChange).toHaveBeenCalledTimes(3);
		});

		it("should receive a numeric string prefixed with the country dial code", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(<PhoneInput name="phone" onChange={handleChange} />);

			const input = screen.getByRole("textbox");
			await user.type(input, "34999998888");

			expect(handleChange).toHaveBeenLastCalledWith("+5534999998888");
		});

		it("should not throw when onChange is omitted", async () => {
			const user = userEvent.setup();
			render(<PhoneInput name="phone" />);

			const input = screen.getByRole("textbox");
			await expect(user.type(input, "3")).resolves.not.toThrow();
		});

		it("should not be called when the component is disabled", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(<PhoneInput name="phone" disabled onChange={handleChange} />);

			const input = screen.getByRole("textbox");
			await user.type(input, "3");

			expect(handleChange).not.toHaveBeenCalled();
		});
	});

	describe("value prop (controlled)", () => {
		it("should reflect a controlled value", () => {
			render(<PhoneInput name="phone" value="34999998888" />);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input.value).toBe("34999998888");
		});

		it("should update the displayed value when the controlled value prop changes", () => {
			const { rerender } = render(
				<PhoneInput name="phone" value="34999998888" />,
			);

			rerender(<PhoneInput name="phone" value="34988887777" />);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input.value).toBe("34988887777");
		});
	});

	describe("hidden input for form submission", () => {
		it("should store the numeric string with the country code", async () => {
			const user = userEvent.setup();
			const { container } = render(<PhoneInput name="phone" />);

			const input = screen.getByRole("textbox");
			await user.type(input, "34999998888");

			const hiddenInput = container.querySelector(
				'input[type="hidden"][name="phone"]',
			) as HTMLInputElement;
			expect(hiddenInput.value).toBe("+5534999998888");
		});

		it("should default the hidden input to the default country code when empty", () => {
			const { container } = render(<PhoneInput name="phone" />);

			const hiddenInput = container.querySelector(
				'input[type="hidden"][name="phone"]',
			) as HTMLInputElement;
			expect(hiddenInput.value).toBe("+55");
		});

		it("should set the name attribute on the hidden input", () => {
			const { container } = render(<PhoneInput name="contactPhone" />);

			expect(container.querySelector('input[type="hidden"]')).toHaveAttribute(
				"name",
				"contactPhone",
			);
		});
	});

	describe("disabled state", () => {
		it("should disable the input when disabled is true", () => {
			render(<PhoneInput name="phone" disabled />);

			expect(screen.getByRole("textbox")).toBeDisabled();
		});

		it("should not disable the input by default", () => {
			render(<PhoneInput name="phone" />);

			expect(screen.getByRole("textbox")).not.toBeDisabled();
		});

		it("should apply the opacity class when disabled", () => {
			const { container } = render(<PhoneInput name="phone" disabled />);

			expect(container.querySelector(".arkynPhoneInputContainer")).toHaveClass(
				"opacity",
			);
		});

		it("should not open the country options when disabled and the selector is clicked", async () => {
			const user = userEvent.setup();
			const { container } = render(<PhoneInput name="phone" disabled />);

			const selector = container.querySelector(
				".phoneInputSelectCountry",
			) as HTMLElement;
			await user.click(selector);

			expect(
				container.querySelector(".arkynPhoneInputCountryOptionsContainer"),
			).not.toBeInTheDocument();
		});
	});

	describe("isLoading state", () => {
		it("should disable the input while loading", () => {
			render(<PhoneInput name="phone" isLoading />);

			expect(screen.getByRole("textbox")).toBeDisabled();
		});

		it("should apply the opacity class when loading", () => {
			const { container } = render(<PhoneInput name="phone" isLoading />);

			expect(container.querySelector(".arkynPhoneInputContainer")).toHaveClass(
				"opacity",
			);
		});

		it("should not apply the opacity class by default", () => {
			const { container } = render(<PhoneInput name="phone" />);

			expect(
				container.querySelector(".arkynPhoneInputContainer"),
			).not.toHaveClass("opacity");
		});
	});

	describe("disabled and isLoading interaction", () => {
		it("should keep the input disabled when both disabled and isLoading are true", () => {
			render(<PhoneInput name="phone" disabled isLoading />);

			expect(screen.getByRole("textbox")).toBeDisabled();
		});

		it("should be disabled when only isLoading is true and disabled is omitted", () => {
			render(<PhoneInput name="phone" isLoading />);

			expect(screen.getByRole("textbox")).toBeDisabled();
		});
	});

	describe("readOnly state", () => {
		it("should mark the input as readOnly", () => {
			render(<PhoneInput name="phone" readOnly />);

			expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
		});

		it("should apply the opacity class when readOnly", () => {
			const { container } = render(<PhoneInput name="phone" readOnly />);

			expect(container.querySelector(".arkynPhoneInputContainer")).toHaveClass(
				"opacity",
			);
		});

		it("should not disable the input purely because of readOnly", () => {
			render(<PhoneInput name="phone" readOnly />);

			expect(screen.getByRole("textbox")).not.toBeDisabled();
		});

		it("should not open the country options when readOnly and the selector is clicked", async () => {
			const user = userEvent.setup();
			const { container } = render(<PhoneInput name="phone" readOnly />);

			const selector = container.querySelector(
				".phoneInputSelectCountry",
			) as HTMLElement;
			await user.click(selector);

			expect(
				container.querySelector(".arkynPhoneInputCountryOptionsContainer"),
			).not.toBeInTheDocument();
		});
	});

	describe("error state", () => {
		it("should display the errorMessage prop text", () => {
			render(<PhoneInput name="phone" errorMessage="Required field" />);

			expect(screen.getByText("Required field")).toBeInTheDocument();
		});

		it("should apply the errored class when errorMessage is set", () => {
			const { container } = render(
				<PhoneInput name="phone" errorMessage="Bad value" />,
			);

			expect(container.querySelector(".arkynPhoneInputContainer")).toHaveClass(
				"errored",
			);
		});

		it("should not apply the errored class when there is no error", () => {
			const { container } = render(<PhoneInput name="phone" />);

			expect(
				container.querySelector(".arkynPhoneInputContainer"),
			).not.toHaveClass("errored");
		});

		it("should display an error coming from FormProvider fieldErrors matched by name", () => {
			render(
				<FormProvider fieldErrors={{ phone: "Server-side error" }}>
					<PhoneInput name="phone" />
				</FormProvider>,
			);

			expect(screen.getByText("Server-side error")).toBeInTheDocument();
		});

		it("should prioritize the errorMessage prop over the FormProvider error", () => {
			render(
				<FormProvider fieldErrors={{ phone: "Server-side error" }}>
					<PhoneInput name="phone" errorMessage="Prop error" />
				</FormProvider>,
			);

			expect(screen.getByText("Prop error")).toBeInTheDocument();
			expect(screen.queryByText("Server-side error")).not.toBeInTheDocument();
		});

		it("should not render a FieldError element when there is no error", () => {
			const { container } = render(<PhoneInput name="phone" />);

			expect(
				container.querySelector(".arkynFieldError"),
			).not.toBeInTheDocument();
		});
	});

	describe("label integration", () => {
		it("should render the label text when provided", () => {
			render(<PhoneInput name="phone" label="Phone number" />);

			expect(screen.getByText("Phone number")).toBeInTheDocument();
		});

		it("should not render a label element when label is omitted", () => {
			const { container } = render(<PhoneInput name="phone" />);

			expect(container.querySelector("label")).not.toBeInTheDocument();
		});

		it("should render an asterisk class on the label when showAsterisk is true", () => {
			const { container } = render(
				<PhoneInput name="phone" label="Phone number" showAsterisk />,
			);

			expect(container.querySelector("label")).toHaveClass("asteriskTrue");
		});

		it("should not apply the asterisk class by default", () => {
			const { container } = render(
				<PhoneInput name="phone" label="Phone number" />,
			);

			expect(container.querySelector("label")).toHaveClass("asteriskFalse");
		});
	});

	describe("unShowFieldTemplate prop", () => {
		it("should skip the FieldTemplate wrapper, label and error when true", () => {
			const { container } = render(
				<PhoneInput
					name="phone"
					label="Phone number"
					errorMessage="Some error"
					unShowFieldTemplate
				/>,
			);

			expect(
				container.querySelector(".arkynFieldWrapper"),
			).not.toBeInTheDocument();
			expect(screen.queryByText("Phone number")).not.toBeInTheDocument();
			expect(screen.queryByText("Some error")).not.toBeInTheDocument();
			expect(
				container.querySelector(".arkynPhoneInputContainer"),
			).toBeInTheDocument();
		});

		it("should render the FieldTemplate wrapper by default", () => {
			const { container } = render(
				<PhoneInput name="phone" label="Phone number" />,
			);

			expect(container.querySelector(".arkynFieldWrapper")).toBeInTheDocument();
		});
	});

	describe("size prop", () => {
		it("should apply the default 'md' size class when omitted", () => {
			const { container } = render(<PhoneInput name="phone" />);

			expect(container.querySelector(".arkynPhoneInputContainer")).toHaveClass(
				"md",
			);
		});

		it("should apply the 'lg' size class when specified", () => {
			const { container } = render(<PhoneInput name="phone" size="lg" />);

			const section = container.querySelector(".arkynPhoneInputContainer");
			expect(section).toHaveClass("lg");
			expect(section).not.toHaveClass("md");
		});
	});

	describe("variant prop", () => {
		it("should apply the default 'solid' variant class when omitted", () => {
			const { container } = render(<PhoneInput name="phone" />);

			expect(container.querySelector(".arkynPhoneInputContainer")).toHaveClass(
				"solid",
			);
		});

		it("should apply the 'outline' variant class when specified", () => {
			const { container } = render(
				<PhoneInput name="phone" variant="outline" />,
			);

			const section = container.querySelector(".arkynPhoneInputContainer");
			expect(section).toHaveClass("outline");
			expect(section).not.toHaveClass("solid");
		});
	});

	describe("orientation prop", () => {
		it("should apply the vertical class by default via FieldWrapper", () => {
			const { container } = render(<PhoneInput name="phone" label="Phone" />);

			expect(container.querySelector(".arkynFieldWrapper")).toHaveClass(
				"vertical",
			);
		});

		it("should apply a custom orientation class when specified", () => {
			const { container } = render(
				<PhoneInput name="phone" label="Phone" orientation="horizontal" />,
			);

			expect(container.querySelector(".arkynFieldWrapper")).toHaveClass(
				"horizontal",
			);
		});
	});

	describe("focused state", () => {
		it("should apply the focused class while the input is focused", async () => {
			const user = userEvent.setup();
			const { container } = render(<PhoneInput name="phone" />);

			const section = container.querySelector(
				".arkynPhoneInputContainer",
			) as HTMLElement;
			expect(section).not.toHaveClass("focused");

			await user.click(screen.getByRole("textbox"));
			expect(section).toHaveClass("focused");
		});

		it("should remove the focused class on blur", async () => {
			const user = userEvent.setup();
			const { container } = render(<PhoneInput name="phone" />);

			const section = container.querySelector(
				".arkynPhoneInputContainer",
			) as HTMLElement;

			const input = screen.getByRole("textbox");
			await user.click(input);
			expect(section).toHaveClass("focused");

			await user.tab();
			expect(section).not.toHaveClass("focused");
		});

		it("should focus the input when the wrapping section is clicked", async () => {
			const user = userEvent.setup();
			const { container } = render(<PhoneInput name="phone" />);

			const section = container.querySelector(
				".arkynPhoneInputContainer",
			) as HTMLElement;
			const input = screen.getByRole("textbox");

			await user.click(section);

			expect(input).toHaveFocus();
		});
	});

	describe("country selector", () => {
		it("should render the default country (Brasil) flag and dial code", () => {
			const { container } = render(<PhoneInput name="phone" />);

			const flag = container.querySelector(".flag") as HTMLImageElement;
			expect(flag).toHaveAttribute("alt", "Brasil");
		});

		it("should accept the defaultCountryIso prop without throwing", () => {
			expect(() =>
				render(<PhoneInput name="phone" defaultCountryIso="US" />),
			).not.toThrow();
		});

		it("should open the country options list when the selector is clicked", async () => {
			const user = userEvent.setup();
			const { container } = render(<PhoneInput name="phone" />);

			const selector = container.querySelector(
				".phoneInputSelectCountry",
			) as HTMLElement;
			await user.click(selector);

			expect(
				container.querySelector(".arkynPhoneInputCountryOptionsContainer"),
			).toBeInTheDocument();
		});

		it("should close the country options when the overlay is clicked", async () => {
			const user = userEvent.setup();
			const { container } = render(<PhoneInput name="phone" />);

			const selector = container.querySelector(
				".phoneInputSelectCountry",
			) as HTMLElement;
			await user.click(selector);
			expect(
				container.querySelector(".arkynPhoneInputCountriesOverlay"),
			).toBeInTheDocument();

			const overlay = container.querySelector(
				".arkynPhoneInputCountriesOverlay",
			) as HTMLElement;
			await user.click(overlay);

			expect(
				container.querySelector(".arkynPhoneInputCountryOptionsContainer"),
			).not.toBeInTheDocument();
		});

		it("should filter the country list using the search input", async () => {
			const user = userEvent.setup();
			const { container } = render(<PhoneInput name="phone" />);

			const selector = container.querySelector(
				".phoneInputSelectCountry",
			) as HTMLElement;
			await user.click(selector);

			const search = screen.getByPlaceholderText("Pesquisar país");
			await user.type(search, "United States");

			const options = container.querySelectorAll(
				".arkynPhoneInputCountryOption",
			);
			expect(options).toHaveLength(1);
			expect(options[0]).toHaveTextContent("United States");
		});

		it("should use a custom search placeholder when provided", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<PhoneInput name="phone" searchCountryPlaceholder="Buscar país" />,
			);

			const selector = container.querySelector(
				".phoneInputSelectCountry",
			) as HTMLElement;
			await user.click(selector);

			expect(screen.getByPlaceholderText("Buscar país")).toBeInTheDocument();
		});

		it("should display the notFoundCountryText when no country matches the search", async () => {
			const user = userEvent.setup();
			const { container } = render(<PhoneInput name="phone" />);

			const selector = container.querySelector(
				".phoneInputSelectCountry",
			) as HTMLElement;
			await user.click(selector);

			const search = screen.getByPlaceholderText("Pesquisar país");
			await user.type(search, "xyzxyzxyz");

			expect(screen.getByText("Nenhum país encontrado")).toBeInTheDocument();
		});

		it("should use a custom notFoundCountryText when provided", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<PhoneInput name="phone" notFoundCountryText="No matches" />,
			);

			const selector = container.querySelector(
				".phoneInputSelectCountry",
			) as HTMLElement;
			await user.click(selector);

			const search = screen.getByPlaceholderText("Pesquisar país");
			await user.type(search, "xyzxyzxyz");

			expect(screen.getByText("No matches")).toBeInTheDocument();
		});

		it("should update the flag and dial code when a different country is selected", async () => {
			const user = userEvent.setup();
			const { container } = render(<PhoneInput name="phone" />);

			const selector = container.querySelector(
				".phoneInputSelectCountry",
			) as HTMLElement;
			await user.click(selector);

			const search = screen.getByPlaceholderText("Pesquisar país");
			await user.type(search, "United States");

			const option = container.querySelector(
				".arkynPhoneInputCountryOption",
			) as HTMLElement;
			await user.click(option);

			expect(
				container.querySelector(".arkynPhoneInputCountryOptionsContainer"),
			).not.toBeInTheDocument();

			const flag = container.querySelector(".flag") as HTMLImageElement;
			expect(flag).toHaveAttribute("alt", "United States");

			const hiddenInput = container.querySelector(
				'input[type="hidden"]',
			) as HTMLInputElement;
			expect(hiddenInput.value).toBe("+1");
		});

		it("should apply the active class to the currently selected country option", async () => {
			const user = userEvent.setup();
			const { container } = render(<PhoneInput name="phone" />);

			const selector = container.querySelector(
				".phoneInputSelectCountry",
			) as HTMLElement;
			await user.click(selector);

			const search = screen.getByPlaceholderText("Pesquisar país");
			await user.type(search, "Brasil");

			const option = container.querySelector(
				".arkynPhoneInputCountryOption",
			) as HTMLElement;
			expect(option).toHaveClass("active");
		});
	});

	describe("className merge", () => {
		it("should forward className to the FieldTemplate wrapper", () => {
			const { container } = render(
				<PhoneInput name="phone" label="Phone" className="custom-class" />,
			);

			expect(container.querySelector(".arkynFieldWrapper")).toHaveClass(
				"custom-class",
			);
		});

		it("should preserve the arkynFieldWrapper base class regardless of className", () => {
			const { container } = render(
				<PhoneInput name="phone" label="Phone" className="custom-class" />,
			);

			expect(container.querySelector(".arkynFieldWrapper")).toHaveClass(
				"arkynFieldWrapper",
			);
		});
	});

	describe("id prop", () => {
		it("should use a generated id when id is omitted", () => {
			render(<PhoneInput name="phone" />);

			const input = screen.getByRole("textbox");
			expect(input.id).toBeTruthy();
		});

		it("should use the given id when provided", () => {
			render(<PhoneInput name="phone" id="phone-input" />);

			expect(document.getElementById("phone-input")).toBeInTheDocument();
		});
	});

	describe("accessibility", () => {
		it("should render the label text alongside the input", () => {
			render(<PhoneInput name="phone" label="Phone number" />);

			expect(screen.getByText("Phone number").tagName).toBe("LABEL");
		});

		it("should be focusable via keyboard tabbing", async () => {
			const user = userEvent.setup();
			render(<PhoneInput name="phone" />);

			await user.tab();

			expect(screen.getByRole("textbox")).toHaveFocus();
		});

		it("should not be focusable via keyboard when disabled", async () => {
			const user = userEvent.setup();
			render(<PhoneInput name="phone" disabled />);

			await user.tab();

			expect(screen.getByRole("textbox")).not.toHaveFocus();
		});
	});

	describe("edge cases", () => {
		it("should handle an empty defaultValue gracefully", () => {
			render(<PhoneInput name="phone" defaultValue="" />);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input.value).toBe("");
		});

		it("should handle an empty errorMessage string as no error", () => {
			const { container } = render(<PhoneInput name="phone" errorMessage="" />);

			expect(
				container.querySelector(".arkynPhoneInputContainer"),
			).not.toHaveClass("errored");
		});

		it("should handle an empty className string without adding stray classes", () => {
			const { container } = render(<PhoneInput name="phone" className="" />);

			expect(
				container.querySelector(".arkynPhoneInputContainer"),
			).toBeInTheDocument();
		});

		it("should not throw when rendered with only the required name prop", () => {
			expect(() => render(<PhoneInput name="phone" />)).not.toThrow();
		});
	});
});
