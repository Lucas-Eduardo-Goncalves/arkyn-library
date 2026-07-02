import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Search, User } from "lucide-react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FormProvider } from "../../providers/formProvider";
import { Input } from "../input";

// vitest globals are off in this repo, so RTL's auto-cleanup (which only
// registers when it detects a global afterEach) never fires; clean up
// manually so each render starts from an empty document.
afterEach(cleanup);

describe("Input", () => {
	it("should render without errors", () => {
		render(<Input name="username" />);

		expect(document.querySelector(".arkynInput")).toBeInTheDocument();
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(<Input name="username" />);

		const section = container.querySelector(".arkynInput") as HTMLElement;
		expect(section).toBeInTheDocument();
		expect(section).toHaveClass("solid", "md");
		expect(screen.getByRole("textbox")).toBeInTheDocument();
	});

	it("should render correctly with all properties filled", () => {
		const handleChange = vi.fn();
		render(
			<Input
				name="username"
				label="Username"
				showAsterisk
				placeholder="Enter username"
				variant="outline"
				size="lg"
				prefix="https://"
				suffix=".com"
				leftIcon={User}
				rightIcon={Search}
				onChange={handleChange}
				className="custom-wrapper"
			/>,
		);

		expect(screen.getByText("Username")).toBeInTheDocument();
		expect(screen.getByText("Username")).toHaveClass("asteriskTrue");
		expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
		expect(screen.getByText("https://")).toBeInTheDocument();
		expect(screen.getByText(".com")).toBeInTheDocument();
	});

	it("should use the name prop as the input's name attribute", () => {
		render(<Input name="email" />);

		expect(screen.getByRole("textbox")).toHaveAttribute("name", "email");
	});

	describe("label prop", () => {
		it("should not render a label when omitted", () => {
			render(<Input name="username" />);

			expect(screen.queryByText("Username")).not.toBeInTheDocument();
		});

		it("should render the label text when provided", () => {
			render(<Input name="username" label="Username" />);

			expect(screen.getByText("Username")).toBeInTheDocument();
		});
	});

	describe("showAsterisk prop", () => {
		it("should not show an asterisk by default", () => {
			render(<Input name="username" label="Username" />);

			const label = screen.getByText("Username");
			expect(label).toHaveClass("asteriskFalse");
		});

		it("should show an asterisk when showAsterisk is true", () => {
			render(<Input name="username" label="Username" showAsterisk />);

			const label = screen.getByText("Username");
			expect(label).toHaveClass("asteriskTrue");
		});
	});

	describe("value and defaultValue", () => {
		it("should render as an uncontrolled field with defaultValue", () => {
			render(<Input name="username" defaultValue="initial value" />);

			expect(screen.getByRole("textbox")).toHaveValue("initial value");
		});

		it("should render with the controlled value prop", () => {
			render(<Input name="username" value="controlled" onChange={() => {}} />);

			expect(screen.getByRole("textbox")).toHaveValue("controlled");
		});

		it("should render with an empty value when value is an empty string", () => {
			render(<Input name="username" value="" onChange={() => {}} />);

			expect(screen.getByRole("textbox")).toHaveValue("");
		});

		it("should render with no value when both value and defaultValue are omitted", () => {
			render(<Input name="username" />);

			expect(screen.getByRole("textbox")).toHaveValue("");
		});
	});

	describe("onChange event", () => {
		it("should call onChange when the user types", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(<Input name="username" onChange={handleChange} />);

			await user.type(screen.getByRole("textbox"), "abc");

			expect(handleChange).toHaveBeenCalledTimes(3);
		});

		it("should update an uncontrolled input's value as the user types", async () => {
			const user = userEvent.setup();
			render(<Input name="username" />);

			const input = screen.getByRole("textbox");
			await user.type(input, "hello");

			expect(input).toHaveValue("hello");
		});

		it("should receive the native change event as an argument", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(<Input name="username" onChange={handleChange} />);

			await user.type(screen.getByRole("textbox"), "x");

			expect(handleChange).toHaveBeenCalledWith(
				expect.objectContaining({
					target: expect.anything(),
				}),
			);
		});

		it("should not call onChange when not typed into", () => {
			const handleChange = vi.fn();
			render(<Input name="username" onChange={handleChange} />);

			expect(handleChange).not.toHaveBeenCalled();
		});
	});

	describe("onFocus and onBlur events", () => {
		it("should call onFocus when the input is focused", async () => {
			const user = userEvent.setup();
			const handleFocus = vi.fn();
			render(<Input name="username" onFocus={handleFocus} />);

			await user.click(screen.getByRole("textbox"));

			expect(handleFocus).toHaveBeenCalledTimes(1);
		});

		it("should call onBlur when the input loses focus", async () => {
			const user = userEvent.setup();
			const handleBlur = vi.fn();
			render(
				<>
					<Input name="username" onBlur={handleBlur} />
					<button type="button">outside</button>
				</>,
			);

			await user.click(screen.getByRole("textbox"));
			await user.click(screen.getByRole("button"));

			expect(handleBlur).toHaveBeenCalledTimes(1);
		});

		it("should apply the focused class while the input is focused", async () => {
			const user = userEvent.setup();
			const { container } = render(<Input name="username" />);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			expect(section).not.toHaveClass("focused");

			await user.click(screen.getByRole("textbox"));

			expect(section).toHaveClass("focused");
		});

		it("should remove the focused class on blur", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<>
					<Input name="username" />
					<button type="button">outside</button>
				</>,
			);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			await user.click(screen.getByRole("textbox"));
			expect(section).toHaveClass("focused");

			await user.click(screen.getByRole("button"));
			expect(section).not.toHaveClass("focused");
		});

		it("should focus the input when clicking the wrapping section", async () => {
			const user = userEvent.setup();
			const { container } = render(<Input name="username" prefix="https://" />);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			await user.click(section);

			expect(screen.getByRole("textbox")).toHaveFocus();
		});

		it("should not focus the input when clicking the section while disabled", async () => {
			const user = userEvent.setup();
			const { container } = render(<Input name="username" disabled />);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			await user.click(section);

			expect(screen.getByRole("textbox")).not.toHaveFocus();
		});
	});

	describe("placeholder prop", () => {
		it("should not render a placeholder when omitted", () => {
			render(<Input name="username" />);

			expect(screen.getByRole("textbox")).not.toHaveAttribute("placeholder");
		});

		it("should render the placeholder text", () => {
			render(<Input name="username" placeholder="Type here" />);

			expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
		});

		it("should replace the placeholder with the value when disabled and a value is set", () => {
			render(
				<Input
					name="username"
					disabled
					value="actual value"
					placeholder="Type here"
					onChange={() => {}}
				/>,
			);

			expect(screen.getByRole("textbox")).toHaveAttribute(
				"placeholder",
				"actual value",
			);
		});

		it("should keep the original placeholder when disabled without a value", () => {
			render(<Input name="username" disabled placeholder="Type here" />);

			expect(screen.getByRole("textbox")).toHaveAttribute(
				"placeholder",
				"Type here",
			);
		});
	});

	describe("errorMessage prop", () => {
		it("should not render an error message by default", () => {
			render(<Input name="username" />);

			expect(
				document.querySelector(".arkynFieldError"),
			).not.toBeInTheDocument();
		});

		it("should render the errorMessage prop text", () => {
			render(<Input name="username" errorMessage="Field is required" />);

			expect(screen.getByText("Field is required")).toBeInTheDocument();
		});

		it("should apply the errored class to the section when errorMessage is set", () => {
			const { container } = render(
				<Input name="username" errorMessage="Field is required" />,
			);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			expect(section).toHaveClass("errored");
		});

		it("should not apply the errored class when there is no error", () => {
			const { container } = render(<Input name="username" />);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			expect(section).not.toHaveClass("errored");
		});
	});

	describe("fieldErrors from FormProvider", () => {
		it("should render the error matched by the name prop from fieldErrors", () => {
			render(
				<FormProvider fieldErrors={{ username: "Username already taken" }}>
					<Input name="username" />
				</FormProvider>,
			);

			expect(screen.getByText("Username already taken")).toBeInTheDocument();
		});

		it("should not render an error for a field name not present in fieldErrors", () => {
			render(
				<FormProvider fieldErrors={{ email: "Invalid email" }}>
					<Input name="username" />
				</FormProvider>,
			);

			expect(
				document.querySelector(".arkynFieldError"),
			).not.toBeInTheDocument();
		});

		it("should prioritize the errorMessage prop over fieldErrors", () => {
			render(
				<FormProvider fieldErrors={{ username: "From context" }}>
					<Input name="username" errorMessage="From prop" />
				</FormProvider>,
			);

			expect(screen.getByText("From prop")).toBeInTheDocument();
			expect(screen.queryByText("From context")).not.toBeInTheDocument();
		});

		it("should apply the errored class when the error comes from fieldErrors", () => {
			const { container } = render(
				<FormProvider fieldErrors={{ username: "Required" }}>
					<Input name="username" />
				</FormProvider>,
			);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			expect(section).toHaveClass("errored");
		});
	});

	describe("disabled state", () => {
		it("should not be disabled by default", () => {
			render(<Input name="username" />);

			expect(screen.getByRole("textbox")).not.toBeDisabled();
		});

		it("should disable the input when disabled is true", () => {
			render(<Input name="username" disabled />);

			expect(screen.getByRole("textbox")).toBeDisabled();
		});

		it("should apply the disabled class to the section", () => {
			const { container } = render(<Input name="username" disabled />);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			expect(section).toHaveClass("disabled");
		});

		it("should apply the opacity class when disabled", () => {
			const { container } = render(<Input name="username" disabled />);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			expect(section).toHaveClass("opacity");
		});

		it("should not allow typing while disabled", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(<Input name="username" disabled onChange={handleChange} />);

			await user.type(screen.getByRole("textbox"), "abc");

			expect(handleChange).not.toHaveBeenCalled();
		});
	});

	describe("readOnly state", () => {
		it("should not be readOnly by default", () => {
			render(<Input name="username" />);

			expect(screen.getByRole("textbox")).not.toHaveAttribute("readonly");
		});

		it("should set the readOnly attribute when readOnly is true", () => {
			render(<Input name="username" readOnly />);

			expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
		});

		it("should apply the opacity class when readOnly", () => {
			const { container } = render(<Input name="username" readOnly />);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			expect(section).toHaveClass("opacity");
		});

		it("should not apply the disabled class when only readOnly is set", () => {
			const { container } = render(<Input name="username" readOnly />);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			expect(section).not.toHaveClass("disabled");
		});
	});

	describe("isLoading state", () => {
		it("should not show a spinner by default", () => {
			const { container } = render(<Input name="username" />);

			expect(container.querySelector(".spinner")).not.toBeInTheDocument();
		});

		it("should disable the input while loading", () => {
			render(<Input name="username" isLoading />);

			expect(screen.getByRole("textbox")).toBeDisabled();
		});

		it("should apply the opacity class while loading", () => {
			const { container } = render(<Input name="username" isLoading />);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			expect(section).toHaveClass("opacity");
		});

		it("should show the spinner on the left when there is no rightIcon", () => {
			const { container } = render(<Input name="username" isLoading />);

			const icons = container.querySelectorAll("svg");
			expect(icons[0]).toHaveClass("spinner");
		});

		it("should show the spinner on the right when a rightIcon is set", () => {
			const { container } = render(
				<Input name="username" isLoading rightIcon={Search} />,
			);

			const icons = container.querySelectorAll("svg");
			const spinner = Array.from(icons).find((icon) =>
				icon.classList.contains("spinner"),
			);
			expect(spinner).toBeTruthy();
			expect(icons[icons.length - 1]).toBe(spinner);
		});

		it("should hide the leftIcon and rightIcon while loading", () => {
			const { container } = render(
				<Input name="username" isLoading leftIcon={User} rightIcon={Search} />,
			);

			const icons = container.querySelectorAll("svg");
			expect(icons).toHaveLength(1);
			expect(icons[0]).toHaveClass("spinner");
		});
	});

	describe("disabled and isLoading interaction", () => {
		it("should remain disabled when both disabled and isLoading are true", () => {
			render(<Input name="username" disabled isLoading />);

			expect(screen.getByRole("textbox")).toBeDisabled();
		});

		it("should apply the disabled class only from the disabled prop, not isLoading alone", () => {
			const { container } = render(<Input name="username" isLoading />);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			expect(section).not.toHaveClass("disabled");
		});

		it("should be disabled via isLoading even when disabled prop is false", () => {
			render(<Input name="username" disabled={false} isLoading />);

			expect(screen.getByRole("textbox")).toBeDisabled();
		});
	});

	describe("type prop", () => {
		it("should default to type text", () => {
			render(<Input name="username" />);

			expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
		});

		it("should render as a password input", () => {
			const { container } = render(<Input name="password" type="password" />);

			const input = container.querySelector("input");
			expect(input).toHaveAttribute("type", "password");
		});

		it("should render as an email input", () => {
			render(<Input name="email" type="email" />);

			expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
		});

		it("should render as a number input", () => {
			const { container } = render(<Input name="age" type="number" />);

			const input = container.querySelector("input");
			expect(input).toHaveAttribute("type", "number");
		});

		it("should render a hidden input without the FieldTemplate wrapper", () => {
			const { container } = render(
				<Input
					name="token"
					type="hidden"
					label="Token"
					value="secret"
					onChange={() => {}}
				/>,
			);

			const input = container.querySelector("input") as HTMLInputElement;
			expect(input).toHaveAttribute("type", "text");
			expect(input).toHaveStyle({ display: "none" });
			expect(input).toHaveAttribute("readonly");
			expect(container.querySelector(".arkynInput")).not.toBeInTheDocument();
			expect(screen.queryByText("Token")).not.toBeInTheDocument();
		});
	});

	describe("size prop", () => {
		it("should apply the default md size class when omitted", () => {
			const { container } = render(<Input name="username" />);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			expect(section).toHaveClass("md");
		});

		it("should apply the lg size class when specified", () => {
			const { container } = render(<Input name="username" size="lg" />);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			expect(section).toHaveClass("lg");
			expect(section).not.toHaveClass("md");
		});

		it("should use an icon size of 20 for both md and lg", () => {
			const { container: mdContainer } = render(
				<Input name="username" size="md" leftIcon={User} />,
			);
			const { container: lgContainer } = render(
				<Input name="username2" size="lg" leftIcon={User} />,
			);

			expect(mdContainer.querySelector("svg")).toHaveAttribute("width", "20");
			expect(lgContainer.querySelector("svg")).toHaveAttribute("width", "20");
		});
	});

	describe("variant prop", () => {
		it("should apply the default solid variant class when omitted", () => {
			const { container } = render(<Input name="username" />);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			expect(section).toHaveClass("solid");
		});

		it.each([
			"solid",
			"outline",
			"underline",
		] as const)("should apply the '%s' variant class", (variant) => {
			const { container } = render(<Input name="username" variant={variant} />);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			expect(section).toHaveClass(variant);
		});

		it("should replace the variant class when changed", () => {
			const { container, rerender } = render(
				<Input name="username" variant="solid" />,
			);

			let section = container.querySelector(".arkynInput") as HTMLElement;
			expect(section).toHaveClass("solid");

			rerender(<Input name="username" variant="outline" />);
			section = container.querySelector(".arkynInput") as HTMLElement;
			expect(section).toHaveClass("outline");
			expect(section).not.toHaveClass("solid");
		});
	});

	describe("prefix and suffix slots", () => {
		it("should not render prefix or suffix by default", () => {
			render(<Input name="username" />);

			expect(screen.queryByText("https://")).not.toBeInTheDocument();
		});

		it("should render a string prefix", () => {
			render(<Input name="username" prefix="https://" />);

			expect(screen.getByText("https://")).toBeInTheDocument();
		});

		it("should render a string suffix", () => {
			render(<Input name="username" suffix=".com" />);

			expect(screen.getByText(".com")).toBeInTheDocument();
		});

		it("should render an icon prefix", () => {
			const { container } = render(<Input name="username" prefix={Search} />);

			const icon = container.querySelector("svg.prefix");
			expect(icon).toBeInTheDocument();
		});

		it("should render an icon suffix", () => {
			const { container } = render(<Input name="username" suffix={Search} />);

			const icon = container.querySelector("svg.suffix");
			expect(icon).toBeInTheDocument();
		});

		it("should apply the hasPrefix class when a prefix is set", () => {
			const { container } = render(<Input name="username" prefix="https://" />);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			expect(section).toHaveClass("hasPrefix");
		});

		it("should apply the hasSuffix class when a suffix is set", () => {
			const { container } = render(<Input name="username" suffix=".com" />);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			expect(section).toHaveClass("hasSuffix");
		});

		it("should not apply hasPrefix or hasSuffix classes when omitted", () => {
			const { container } = render(<Input name="username" />);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			expect(section).not.toHaveClass("hasPrefix");
			expect(section).not.toHaveClass("hasSuffix");
		});
	});

	describe("leftIcon and rightIcon slots", () => {
		it("should not render icons by default", () => {
			const { container } = render(<Input name="username" />);

			expect(container.querySelectorAll("svg")).toHaveLength(0);
		});

		it("should render the leftIcon", () => {
			const { container } = render(<Input name="username" leftIcon={User} />);

			expect(container.querySelector("svg")).toBeInTheDocument();
		});

		it("should render the rightIcon", () => {
			const { container } = render(
				<Input name="username" rightIcon={Search} />,
			);

			expect(container.querySelector("svg")).toBeInTheDocument();
		});

		it("should render both leftIcon and rightIcon together", () => {
			const { container } = render(
				<Input name="username" leftIcon={User} rightIcon={Search} />,
			);

			expect(container.querySelectorAll("svg")).toHaveLength(2);
		});
	});

	describe("orientation prop", () => {
		it("should forward orientation to the FieldWrapper", () => {
			const { container } = render(
				<Input name="username" label="Username" orientation="vertical" />,
			);

			const wrapper = container.querySelector(".arkynFieldWrapper");
			expect(wrapper).toHaveClass("vertical");
		});

		it("should default the FieldWrapper orientation when omitted", () => {
			const { container } = render(<Input name="username" label="Username" />);

			const wrapper = container.querySelector(".arkynFieldWrapper");
			expect(wrapper).toHaveClass("vertical");
		});

		it("should apply horizontalReverse orientation", () => {
			const { container } = render(
				<Input
					name="username"
					label="Username"
					orientation="horizontalReverse"
				/>,
			);

			const wrapper = container.querySelector(".arkynFieldWrapper");
			expect(wrapper).toHaveClass("horizontalReverse");
		});
	});

	describe("unShowFieldTemplate prop", () => {
		it("should render the FieldTemplate wrapper by default", () => {
			const { container } = render(<Input name="username" label="Username" />);

			expect(container.querySelector(".arkynFieldWrapper")).toBeInTheDocument();
		});

		it("should skip the wrapper, label and error when true", () => {
			const { container } = render(
				<Input
					name="username"
					label="Username"
					errorMessage="Required"
					unShowFieldTemplate
				/>,
			);

			expect(
				container.querySelector(".arkynFieldWrapper"),
			).not.toBeInTheDocument();
			expect(screen.queryByText("Username")).not.toBeInTheDocument();
			expect(screen.queryByText("Required")).not.toBeInTheDocument();
			expect(container.querySelector(".arkynInput")).toBeInTheDocument();
		});
	});

	describe("className merge", () => {
		it("should preserve the base wrapper className", () => {
			const { container } = render(<Input name="username" label="Username" />);

			const wrapper = container.querySelector(".arkynFieldWrapper");
			expect(wrapper).toHaveClass("arkynFieldWrapper");
		});

		it("should merge an external className with the wrapper base className", () => {
			const { container } = render(
				<Input name="username" label="Username" className="custom-class" />,
			);

			const wrapper = container.querySelector(".arkynFieldWrapper");
			expect(wrapper).toHaveClass("arkynFieldWrapper");
			expect(wrapper).toHaveClass("custom-class");
		});

		it("should always preserve the arkynInput base class on the section", () => {
			const { container } = render(<Input name="username" variant="outline" />);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			expect(section).toHaveClass("arkynInput");
			expect(section).toHaveClass("outline");
		});
	});

	describe("id prop", () => {
		it("should forward id to the input element", () => {
			render(<Input name="username" id="custom-id" />);

			expect(document.getElementById("custom-id")).toBeInTheDocument();
		});

		it("should generate an id when none is provided", () => {
			render(<Input name="username" label="Username" />);

			const input = screen.getByRole("textbox");
			expect(input.id).toBeTruthy();
		});
	});

	describe("accessibility", () => {
		it("should support aria-label passthrough", () => {
			render(<Input name="username" aria-label="Username field" />);

			expect(screen.getByLabelText("Username field")).toBeInTheDocument();
		});

		it("should support keyboard tabbing into the input", async () => {
			const user = userEvent.setup();
			render(<Input name="username" />);

			await user.tab();

			expect(screen.getByRole("textbox")).toHaveFocus();
		});

		it("should not be reachable by tab when disabled", async () => {
			const user = userEvent.setup();
			render(<Input name="username" disabled />);

			await user.tab();

			expect(screen.getByRole("textbox")).not.toHaveFocus();
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the input", () => {
			render(<Input name="username" data-testid="username-input" />);

			expect(screen.getByTestId("username-input")).toBeInTheDocument();
		});

		it("should forward the title attribute to the section", () => {
			const { container } = render(
				<Input name="username" title="Enter your username" />,
			);

			const section = container.querySelector(".arkynInput");
			expect(section).toHaveAttribute("title", "Enter your username");
		});

		it("should forward inline style to the section", () => {
			const { container } = render(
				<Input name="username" style={{ marginTop: "10px" }} />,
			);

			const section = container.querySelector(".arkynInput") as HTMLElement;
			expect(section).toHaveStyle({ marginTop: "10px" });
		});

		it("should forward maxLength to the input", () => {
			render(<Input name="username" maxLength={5} />);

			expect(screen.getByRole("textbox")).toHaveAttribute("maxLength", "5");
		});
	});

	describe("edge cases", () => {
		it("should handle an empty string label without rendering a label element", () => {
			render(<Input name="username" label="" />);

			expect(
				document.querySelector(".arkynFieldLabel"),
			).not.toBeInTheDocument();
		});

		it("should handle an empty errorMessage without rendering an error element", () => {
			render(<Input name="username" errorMessage="" />);

			expect(
				document.querySelector(".arkynFieldError"),
			).not.toBeInTheDocument();
		});

		it("should handle fieldErrors being undefined without throwing", () => {
			render(
				<FormProvider fieldErrors={undefined}>
					<Input name="username" />
				</FormProvider>,
			);

			expect(document.querySelector(".arkynInput")).toBeInTheDocument();
		});

		it("should render normally when rendered outside a FormProvider", () => {
			render(<Input name="username" />);

			expect(document.querySelector(".arkynInput")).toBeInTheDocument();
			expect(
				document.querySelector(".arkynFieldError"),
			).not.toBeInTheDocument();
		});
	});
});
