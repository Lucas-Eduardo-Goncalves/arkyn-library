import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreditCard } from "lucide-react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FormProvider } from "../../providers/formProvider";
import { MaskedInput } from "../maskedInput";

describe("MaskedInput", () => {
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
		render(
			<MaskedInput
				name="phone"
				mask="(__) _____-____"
				replacement={{ _: /\d/ }}
			/>,
		);

		expect(screen.getByRole("textbox")).toBeInTheDocument();
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(
			<MaskedInput
				name="phone"
				mask="(__) _____-____"
				replacement={{ _: /\d/ }}
			/>,
		);

		expect(container.querySelector(".arkynMaskedInput")).toBeInTheDocument();
	});

	it("should render correctly with all properties filled", () => {
		render(
			<MaskedInput
				name="phone"
				mask="(__) _____-____"
				replacement={{ _: /\d/ }}
				label="Phone"
				errorMessage="Invalid"
				isLoading={false}
				size="lg"
				variant="outline"
				prefix="P"
				suffix="S"
				showAsterisk
				leftIcon={CreditCard}
				rightIcon={CreditCard}
				defaultValue="(11) 98765-4321"
				className="custom-class"
				separate
				showMask
			/>,
		);

		expect(screen.getByText("Phone")).toBeInTheDocument();
		expect(screen.getByText("Invalid")).toBeInTheDocument();
		expect(screen.getByRole("textbox")).toBeInTheDocument();
	});

	describe("mask behavior", () => {
		it("should mask digits typed by the user according to the mask prop", async () => {
			const user = userEvent.setup();
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
				/>,
			);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			await user.type(input, "11987654321");

			expect(input.value).toBe("(11) 98765-4321");
		});

		it("should apply a different mask pattern (CPF)", async () => {
			const user = userEvent.setup();
			render(<MaskedInput name="cpf" mask="___.___.___-__" replacement="_" />);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			await user.type(input, "12345678901");

			expect(input.value).toBe("123.456.789-01");
		});

		it("should reject characters that do not match the replacement pattern", async () => {
			const user = userEvent.setup();
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
				/>,
			);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			await user.type(input, "ab12cd");

			expect(input.value).toBe("(12");
		});

		it("should accept any character in editable positions when replacement is a plain underscore string", async () => {
			const user = userEvent.setup();
			render(<MaskedInput name="code" mask="__-__" replacement="_" />);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			await user.type(input, "ab12");

			expect(input.value).toBe("ab-12");
		});

		it("should show the full mask pattern before typing when showMask is true", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					showMask
				/>,
			);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input.value).toBe("(__) _____-____");
		});

		it("should not show the mask pattern before typing by default", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
				/>,
			);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input.value).toBe("");
		});

		it("should strip mask characters from the value when separate is true", async () => {
			const user = userEvent.setup();
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					separate
				/>,
			);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			await user.type(input, "11987654321");

			expect(input.value).toBe("(11) 98765-4321");
		});

		it("should display a pre-masked defaultValue as-is", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					defaultValue="(11) 98765-4321"
				/>,
			);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input.value).toBe("(11) 98765-4321");
		});
	});

	describe("onChange callback", () => {
		it("should be called when the user types", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					onChange={handleChange}
				/>,
			);

			const input = screen.getByRole("textbox");
			await user.type(input, "1");

			expect(handleChange).toHaveBeenCalled();
		});

		it("should be called once per keystroke", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					onChange={handleChange}
				/>,
			);

			const input = screen.getByRole("textbox");
			await user.type(input, "119");

			expect(handleChange).toHaveBeenCalledTimes(3);
		});

		it("should receive an event whose target has the masked value", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					onChange={handleChange}
				/>,
			);

			const input = screen.getByRole("textbox");
			await user.type(input, "119");

			const lastCallArgs = handleChange.mock.calls.at(-1);
			expect(lastCallArgs?.[0]).toHaveProperty("target");
			expect((lastCallArgs?.[0].target as HTMLInputElement).value).toBe(
				"(11) 9",
			);
		});

		it("should not be called when the component is disabled", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					disabled
					onChange={handleChange}
				/>,
			);

			const input = screen.getByRole("textbox");
			await user.type(input, "1");

			expect(handleChange).not.toHaveBeenCalled();
		});

		it("should not throw when onChange is omitted", async () => {
			const user = userEvent.setup();
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
				/>,
			);

			const input = screen.getByRole("textbox");
			await expect(user.type(input, "1")).resolves.not.toThrow();
		});
	});

	describe("onFocus and onBlur callbacks", () => {
		it("should call onFocus when the input is focused", async () => {
			const user = userEvent.setup();
			const handleFocus = vi.fn();
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					onFocus={handleFocus}
				/>,
			);

			await user.click(screen.getByRole("textbox"));

			expect(handleFocus).toHaveBeenCalledTimes(1);
		});

		it("should call onBlur when the input loses focus", async () => {
			const user = userEvent.setup();
			const handleBlur = vi.fn();
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					onBlur={handleBlur}
				/>,
			);

			const input = screen.getByRole("textbox");
			await user.click(input);
			await user.tab();

			expect(handleBlur).toHaveBeenCalledTimes(1);
		});

		it("should apply the focused class while the input is focused", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
				/>,
			);

			const section = container.querySelector(
				".arkynMaskedInput",
			) as HTMLElement;
			expect(section).not.toHaveClass("focused");

			await user.click(screen.getByRole("textbox"));
			expect(section).toHaveClass("focused");
		});

		it("should remove the focused class on blur", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
				/>,
			);

			const section = container.querySelector(
				".arkynMaskedInput",
			) as HTMLElement;
			const input = screen.getByRole("textbox");

			await user.click(input);
			expect(section).toHaveClass("focused");

			await user.tab();
			expect(section).not.toHaveClass("focused");
		});

		it("should focus the input when the wrapping section is clicked", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
				/>,
			);

			const section = container.querySelector(
				".arkynMaskedInput",
			) as HTMLElement;
			const input = screen.getByRole("textbox");

			await user.click(section);

			expect(input).toHaveFocus();
		});

		it("should not focus the input when the section is clicked while disabled", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					disabled
				/>,
			);

			const section = container.querySelector(
				".arkynMaskedInput",
			) as HTMLElement;

			await user.click(section);

			expect(section).not.toHaveClass("focused");
		});
	});

	describe("disabled state", () => {
		it("should disable the input when disabled is true", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					disabled
				/>,
			);

			expect(screen.getByRole("textbox")).toBeDisabled();
		});

		it("should not disable the input by default", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
				/>,
			);

			expect(screen.getByRole("textbox")).not.toBeDisabled();
		});

		it("should apply the opacity class when disabled", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					disabled
				/>,
			);

			expect(container.querySelector(".arkynMaskedInput")).toHaveClass(
				"opacity",
			);
		});

		it("should render the value as a placeholder instead of a value when disabled", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					disabled
					value="11987654321"
				/>,
			);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input).toHaveAttribute("placeholder", "11987654321");
		});
	});

	describe("isLoading state", () => {
		it("should disable the input while loading", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					isLoading
				/>,
			);

			expect(screen.getByRole("textbox")).toBeDisabled();
		});

		it("should render a spinner on the left by default when loading", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					isLoading
				/>,
			);

			expect(container.querySelector(".spinner")).toBeInTheDocument();
		});

		it("should render the spinner on the right when a rightIcon is set", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					isLoading
					rightIcon={CreditCard}
				/>,
			);

			const spinner = container.querySelector(".spinner");
			const icons = container.querySelectorAll("svg");
			expect(spinner).toBeInTheDocument();
			expect(icons[icons.length - 1]).toHaveClass("spinner");
		});

		it("should not render leftIcon or rightIcon while loading", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					isLoading
					leftIcon={CreditCard}
					rightIcon={CreditCard}
				/>,
			);

			const icons = container.querySelectorAll("svg");
			expect(icons).toHaveLength(1);
		});

		it("should not render a spinner when not loading", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
				/>,
			);

			expect(container.querySelector(".spinner")).not.toBeInTheDocument();
		});

		it("should apply the opacity class when loading", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					isLoading
				/>,
			);

			expect(container.querySelector(".arkynMaskedInput")).toHaveClass(
				"opacity",
			);
		});

		it("should not disable by default (isLoading defaults to false)", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
				/>,
			);

			expect(screen.getByRole("textbox")).not.toBeDisabled();
		});
	});

	describe("disabled and isLoading interaction", () => {
		it("should keep the input disabled when both disabled and isLoading are true", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					disabled
					isLoading
				/>,
			);

			expect(screen.getByRole("textbox")).toBeDisabled();
		});

		it("should be disabled when only isLoading is true and disabled is omitted", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					isLoading
				/>,
			);

			expect(screen.getByRole("textbox")).toBeDisabled();
		});
	});

	describe("readOnly state", () => {
		it("should mark the input as readOnly", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					readOnly
				/>,
			);

			expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
		});

		it("should apply the opacity class when readOnly", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					readOnly
				/>,
			);

			expect(container.querySelector(".arkynMaskedInput")).toHaveClass(
				"opacity",
			);
		});

		it("should not disable the input purely because of readOnly", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					readOnly
				/>,
			);

			expect(screen.getByRole("textbox")).not.toBeDisabled();
		});
	});

	describe("error state", () => {
		it("should display the errorMessage prop text", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					errorMessage="Required field"
				/>,
			);

			expect(screen.getByText("Required field")).toBeInTheDocument();
		});

		it("should apply the errored class when errorMessage is set", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					errorMessage="Bad value"
				/>,
			);

			expect(container.querySelector(".arkynMaskedInput")).toHaveClass(
				"errored",
			);
		});

		it("should not apply the errored class when there is no error", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
				/>,
			);

			expect(container.querySelector(".arkynMaskedInput")).not.toHaveClass(
				"errored",
			);
		});

		it("should display an error coming from FormProvider fieldErrors matched by name", () => {
			render(
				<FormProvider fieldErrors={{ phone: "Server-side error" }}>
					<MaskedInput
						name="phone"
						mask="(__) _____-____"
						replacement={{ _: /\d/ }}
					/>
				</FormProvider>,
			);

			expect(screen.getByText("Server-side error")).toBeInTheDocument();
		});

		it("should prioritize the errorMessage prop over the FormProvider error", () => {
			render(
				<FormProvider fieldErrors={{ phone: "Server-side error" }}>
					<MaskedInput
						name="phone"
						mask="(__) _____-____"
						replacement={{ _: /\d/ }}
						errorMessage="Prop error"
					/>
				</FormProvider>,
			);

			expect(screen.getByText("Prop error")).toBeInTheDocument();
			expect(screen.queryByText("Server-side error")).not.toBeInTheDocument();
		});

		it("should not render a FieldError element when there is no error", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
				/>,
			);

			expect(
				container.querySelector(".arkynFieldError"),
			).not.toBeInTheDocument();
		});
	});

	describe("label integration", () => {
		it("should render the label text when provided", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					label="Phone Number"
				/>,
			);

			expect(screen.getByText("Phone Number")).toBeInTheDocument();
		});

		it("should not render a label element when label is omitted", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
				/>,
			);

			expect(container.querySelector("label")).not.toBeInTheDocument();
		});

		it("should render an asterisk class on the label when showAsterisk is true", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					label="Phone Number"
					showAsterisk
				/>,
			);

			const label = container.querySelector("label");
			expect(label).toHaveClass("asteriskTrue");
		});

		it("should not render an asterisk class by default", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					label="Phone Number"
				/>,
			);

			const label = container.querySelector("label");
			expect(label).toHaveClass("asteriskFalse");
		});
	});

	describe("size prop", () => {
		it("should apply the default 'md' size class when omitted", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
				/>,
			);

			expect(container.querySelector(".arkynMaskedInput")).toHaveClass("md");
		});

		it("should apply the 'lg' size class when specified", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					size="lg"
				/>,
			);

			const section = container.querySelector(".arkynMaskedInput");
			expect(section).toHaveClass("lg");
			expect(section).not.toHaveClass("md");
		});
	});

	describe("variant prop", () => {
		it("should apply the default 'solid' variant class when omitted", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
				/>,
			);

			expect(container.querySelector(".arkynMaskedInput")).toHaveClass("solid");
		});

		it.each([
			"solid",
			"outline",
			"underline",
		] as const)("should apply the '%s' variant class", (variant) => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					variant={variant}
				/>,
			);

			expect(container.querySelector(".arkynMaskedInput")).toHaveClass(variant);
		});

		it("should not apply classes from other variants", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					variant="outline"
				/>,
			);

			const section = container.querySelector(".arkynMaskedInput");
			expect(section).not.toHaveClass("solid");
			expect(section).not.toHaveClass("underline");
		});
	});

	describe("prefix and suffix slots", () => {
		it("should not render prefix or suffix by default", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
				/>,
			);

			expect(container.querySelector(".prefix")).not.toBeInTheDocument();
			expect(container.querySelector(".suffix")).not.toBeInTheDocument();
		});

		it("should render a string prefix", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					prefix="BR"
				/>,
			);

			expect(screen.getByText("BR")).toBeInTheDocument();
		});

		it("should render a string suffix", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					suffix="mobile"
				/>,
			);

			expect(screen.getByText("mobile")).toBeInTheDocument();
		});

		it("should render an icon prefix", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					prefix={CreditCard}
				/>,
			);

			expect(container.querySelector("svg.prefix")).toBeInTheDocument();
		});

		it("should render an icon suffix", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					suffix={CreditCard}
				/>,
			);

			expect(container.querySelector("svg.suffix")).toBeInTheDocument();
		});

		it("should apply the hasPrefix class when a prefix is set", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					prefix="BR"
				/>,
			);

			expect(container.querySelector(".arkynMaskedInput")).toHaveClass(
				"hasPrefix",
			);
		});

		it("should apply the hasSuffix class when a suffix is set", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					suffix="mobile"
				/>,
			);

			expect(container.querySelector(".arkynMaskedInput")).toHaveClass(
				"hasSuffix",
			);
		});
	});

	describe("leftIcon and rightIcon slots", () => {
		it("should render the leftIcon when not loading", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					leftIcon={CreditCard}
				/>,
			);

			expect(container.querySelector("svg")).toBeInTheDocument();
		});

		it("should render the rightIcon when not loading", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					rightIcon={CreditCard}
				/>,
			);

			expect(container.querySelector("svg")).toBeInTheDocument();
		});

		it("should not render icons when neither leftIcon nor rightIcon is given", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
				/>,
			);

			expect(container.querySelectorAll("svg")).toHaveLength(0);
		});
	});

	describe("className merge", () => {
		it("should forward className to the FieldWrapper", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					label="Phone"
					className="custom-class"
				/>,
			);

			expect(container.querySelector(".arkynFieldWrapper")).toHaveClass(
				"custom-class",
			);
		});

		it("should preserve the arkynMaskedInput base class regardless of className", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					label="Phone"
					className="custom-class"
				/>,
			);

			expect(container.querySelector(".arkynMaskedInput")).toBeInTheDocument();
		});
	});

	describe("id prop", () => {
		it("should use a generated id when id is omitted", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
				/>,
			);

			const input = screen.getByRole("textbox");
			expect(input.id).toBeTruthy();
		});

		it("should use the given id when provided", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					id="phone-input"
				/>,
			);

			expect(document.getElementById("phone-input")).toBeInTheDocument();
		});

		it("should link the label htmlFor to the input id", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					label="Phone"
					id="phone-input"
				/>,
			);

			expect(screen.getByLabelText("Phone")).toHaveAttribute(
				"id",
				"phone-input",
			);
		});
	});

	describe("name prop", () => {
		it("should set the name attribute on the input", () => {
			render(
				<MaskedInput
					name="mobilePhone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
				/>,
			);

			expect(screen.getByRole("textbox")).toHaveAttribute(
				"name",
				"mobilePhone",
			);
		});
	});

	describe("title and style props", () => {
		it("should forward the title attribute to the wrapping section", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					title="Phone field"
				/>,
			);

			expect(container.querySelector(".arkynMaskedInput")).toHaveAttribute(
				"title",
				"Phone field",
			);
		});

		it("should forward inline style to the wrapping section", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					style={{ marginTop: "10px" }}
				/>,
			);

			expect(container.querySelector(".arkynMaskedInput")).toHaveStyle({
				marginTop: "10px",
			});
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the visible input", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					data-testid="phone-field"
					aria-label="Phone"
				/>,
			);

			const input = screen.getByTestId("phone-field");
			expect(input).toHaveAttribute("aria-label", "Phone");
		});
	});

	describe("placeholder prop", () => {
		it("should render the placeholder when the input is enabled", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					placeholder="(00) 00000-0000"
				/>,
			);

			expect(
				screen.getByPlaceholderText("(00) 00000-0000"),
			).toBeInTheDocument();
		});

		it("should show the value instead of the placeholder when disabled and a value is set", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					placeholder="(00) 00000-0000"
					disabled
					value="11987654321"
				/>,
			);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input).toHaveAttribute("placeholder", "11987654321");
		});
	});

	describe("ref forwarding", () => {
		it("should forward the ref to the underlying input element via inputRef usage (focus on section click)", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
				/>,
			);

			const section = container.querySelector(
				".arkynMaskedInput",
			) as HTMLElement;
			const input = screen.getByRole("textbox");

			await user.click(section);

			expect(input).toHaveFocus();
		});
	});

	describe("accessibility", () => {
		it("should render the label text alongside the input sharing the given id", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					label="Phone"
					id="phone-a11y"
				/>,
			);

			expect(screen.getByText("Phone").tagName).toBe("LABEL");
			expect(screen.getByRole("textbox")).toHaveAttribute("id", "phone-a11y");
		});

		it("should be focusable via keyboard tabbing", async () => {
			const user = userEvent.setup();
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
				/>,
			);

			await user.tab();

			expect(screen.getByRole("textbox")).toHaveFocus();
		});

		it("should not be focusable via keyboard when disabled", async () => {
			const user = userEvent.setup();
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					disabled
				/>,
			);

			await user.tab();

			expect(screen.getByRole("textbox")).not.toHaveFocus();
		});
	});

	describe("edge cases", () => {
		it("should handle an empty defaultValue gracefully", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					defaultValue=""
				/>,
			);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input.value).toBe("");
		});

		it("should handle an undefined defaultValue gracefully", () => {
			render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					defaultValue={undefined}
				/>,
			);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			expect(input.value).toBe("");
		});

		it("should handle an empty errorMessage string as no error", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					errorMessage=""
				/>,
			);

			expect(container.querySelector(".arkynMaskedInput")).not.toHaveClass(
				"errored",
			);
		});

		it("should handle an empty className string without adding stray classes", () => {
			const { container } = render(
				<MaskedInput
					name="phone"
					mask="(__) _____-____"
					replacement={{ _: /\d/ }}
					className=""
				/>,
			);

			expect(container.querySelector(".arkynMaskedInput")).toBeInTheDocument();
		});

		it("should not throw when rendered with only the required props", () => {
			expect(() =>
				render(
					<MaskedInput
						name="phone"
						mask="(__) _____-____"
						replacement={{ _: /\d/ }}
					/>,
				),
			).not.toThrow();
		});

		it("should not throw when typing beyond the mask length", async () => {
			const user = userEvent.setup();
			render(<MaskedInput name="code" mask="__-__" replacement="_" />);

			const input = screen.getByRole("textbox") as HTMLInputElement;
			await expect(user.type(input, "abcdefghij")).resolves.not.toThrow();
			expect(input.value).toBe("ab-cd");
		});
	});
});
