import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FormProvider } from "../../providers/formProvider";
import { Textarea } from "../textarea";

afterEach(cleanup);

describe("Textarea", () => {
	it("should render without errors", () => {
		render(<Textarea name="description" />);

		expect(document.querySelector(".arkynTextarea")).toBeInTheDocument();
	});

	it("should render when all optional properties are omitted", () => {
		const { container } = render(<Textarea name="description" />);

		const section = container.querySelector(".arkynTextarea") as HTMLElement;
		expect(section).toBeInTheDocument();
		expect(section).toHaveClass("solid", "md");
		expect(screen.getByRole("textbox")).toBeInTheDocument();
	});

	it("should render correctly with all properties filled", () => {
		const handleChange = vi.fn();
		render(
			<Textarea
				name="bio"
				label="Biography"
				showAsterisk
				placeholder="Tell us about yourself"
				variant="outline"
				size="lg"
				rows={5}
				onChange={handleChange}
				className="custom-wrapper"
			/>,
		);

		expect(screen.getByText("Biography")).toBeInTheDocument();
		expect(screen.getByText("Biography")).toHaveClass("asteriskTrue");
		expect(
			screen.getByPlaceholderText("Tell us about yourself"),
		).toBeInTheDocument();
		expect(screen.getByRole("textbox")).toHaveAttribute("rows", "5");
	});

	it("should use the name prop as the textarea's name attribute", () => {
		render(<Textarea name="message" />);

		expect(screen.getByRole("textbox")).toHaveAttribute("name", "message");
	});

	describe("label prop", () => {
		it("should not render a label when omitted", () => {
			render(<Textarea name="description" />);

			expect(screen.queryByText("Description")).not.toBeInTheDocument();
		});

		it("should render the label text when provided", () => {
			render(<Textarea name="description" label="Description" />);

			expect(screen.getByText("Description")).toBeInTheDocument();
		});
	});

	describe("showAsterisk prop", () => {
		it("should not show an asterisk by default", () => {
			render(<Textarea name="description" label="Description" />);

			expect(screen.getByText("Description")).toHaveClass("asteriskFalse");
		});

		it("should show an asterisk when showAsterisk is true", () => {
			render(<Textarea name="description" label="Description" showAsterisk />);

			expect(screen.getByText("Description")).toHaveClass("asteriskTrue");
		});
	});

	describe("value and defaultValue", () => {
		it("should render as an uncontrolled field with defaultValue", () => {
			render(<Textarea name="description" defaultValue="initial value" />);

			expect(screen.getByRole("textbox")).toHaveValue("initial value");
		});

		it("should render with the controlled value prop", () => {
			render(
				<Textarea name="description" value="controlled" onChange={() => {}} />,
			);

			expect(screen.getByRole("textbox")).toHaveValue("controlled");
		});

		it("should render with an empty value when value is an empty string", () => {
			render(<Textarea name="description" value="" onChange={() => {}} />);

			expect(screen.getByRole("textbox")).toHaveValue("");
		});

		it("should render with no value when both value and defaultValue are omitted", () => {
			render(<Textarea name="description" />);

			expect(screen.getByRole("textbox")).toHaveValue("");
		});
	});

	describe("onChange event", () => {
		it("should call onChange when the user types", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(<Textarea name="description" onChange={handleChange} />);

			await user.type(screen.getByRole("textbox"), "abc");

			expect(handleChange).toHaveBeenCalledTimes(3);
		});

		it("should update an uncontrolled textarea's value as the user types", async () => {
			const user = userEvent.setup();
			render(<Textarea name="description" />);

			const textarea = screen.getByRole("textbox");
			await user.type(textarea, "hello");

			expect(textarea).toHaveValue("hello");
		});

		it("should receive the native change event as an argument", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(<Textarea name="description" onChange={handleChange} />);

			await user.type(screen.getByRole("textbox"), "x");

			expect(handleChange).toHaveBeenCalledWith(
				expect.objectContaining({
					target: expect.anything(),
				}),
			);
		});

		it("should not call onChange when not typed into", () => {
			const handleChange = vi.fn();
			render(<Textarea name="description" onChange={handleChange} />);

			expect(handleChange).not.toHaveBeenCalled();
		});
	});

	describe("onFocus and onBlur events", () => {
		it("should call onFocus when the textarea is focused", async () => {
			const user = userEvent.setup();
			const handleFocus = vi.fn();
			render(<Textarea name="description" onFocus={handleFocus} />);

			await user.click(screen.getByRole("textbox"));

			expect(handleFocus).toHaveBeenCalledTimes(1);
		});

		it("should call onBlur when the textarea loses focus", async () => {
			const user = userEvent.setup();
			const handleBlur = vi.fn();
			render(
				<>
					<Textarea name="description" onBlur={handleBlur} />
					<button type="button">outside</button>
				</>,
			);

			await user.click(screen.getByRole("textbox"));
			await user.click(screen.getByRole("button"));

			expect(handleBlur).toHaveBeenCalledTimes(1);
		});

		it("should apply the focusedTrue class while the textarea is focused", async () => {
			const user = userEvent.setup();
			const { container } = render(<Textarea name="description" />);

			const section = container.querySelector(".arkynTextarea") as HTMLElement;
			expect(section).toHaveClass("focusedFalse");

			await user.click(screen.getByRole("textbox"));

			expect(section).toHaveClass("focusedTrue");
		});

		it("should remove the focusedTrue class on blur", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<>
					<Textarea name="description" />
					<button type="button">outside</button>
				</>,
			);

			const section = container.querySelector(".arkynTextarea") as HTMLElement;
			await user.click(screen.getByRole("textbox"));
			expect(section).toHaveClass("focusedTrue");

			await user.click(screen.getByRole("button"));
			expect(section).toHaveClass("focusedFalse");
		});

		it("should focus the textarea when clicking the wrapping section", async () => {
			const user = userEvent.setup();
			const { container } = render(<Textarea name="description" />);

			const section = container.querySelector(".arkynTextarea") as HTMLElement;
			await user.click(section);

			expect(screen.getByRole("textbox")).toHaveFocus();
		});

		it("should not focus the textarea when clicking the section while disabled", async () => {
			const user = userEvent.setup();
			const { container } = render(<Textarea name="description" disabled />);

			const section = container.querySelector(".arkynTextarea") as HTMLElement;
			await user.click(section);

			expect(screen.getByRole("textbox")).not.toHaveFocus();
		});
	});

	describe("placeholder prop", () => {
		it("should not render a placeholder when omitted", () => {
			render(<Textarea name="description" />);

			expect(screen.getByRole("textbox")).not.toHaveAttribute("placeholder");
		});

		it("should render the placeholder text", () => {
			render(<Textarea name="description" placeholder="Type here" />);

			expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
		});

		it("should replace the placeholder with the value when disabled and a value is set", () => {
			render(
				<Textarea
					name="description"
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
			render(<Textarea name="description" disabled placeholder="Type here" />);

			expect(screen.getByRole("textbox")).toHaveAttribute(
				"placeholder",
				"Type here",
			);
		});
	});

	describe("errorMessage prop", () => {
		it("should not render an error message by default", () => {
			render(<Textarea name="description" />);

			expect(
				document.querySelector(".arkynFieldError"),
			).not.toBeInTheDocument();
		});

		it("should render the errorMessage prop text", () => {
			render(<Textarea name="description" errorMessage="Field is required" />);

			expect(screen.getByText("Field is required")).toBeInTheDocument();
		});

		it("should apply the errorTrue class to the section when errorMessage is set", () => {
			const { container } = render(
				<Textarea name="description" errorMessage="Field is required" />,
			);

			const section = container.querySelector(".arkynTextarea") as HTMLElement;
			expect(section).toHaveClass("errorTrue");
		});

		it("should apply the errorFalse class when there is no error", () => {
			const { container } = render(<Textarea name="description" />);

			const section = container.querySelector(".arkynTextarea") as HTMLElement;
			expect(section).toHaveClass("errorFalse");
		});
	});

	describe("fieldErrors from FormProvider", () => {
		it("should render the error matched by the name prop from fieldErrors", () => {
			render(
				<FormProvider fieldErrors={{ description: "Description is invalid" }}>
					<Textarea name="description" />
				</FormProvider>,
			);

			expect(screen.getByText("Description is invalid")).toBeInTheDocument();
		});

		it("should not render an error for a field name not present in fieldErrors", () => {
			render(
				<FormProvider fieldErrors={{ email: "Invalid email" }}>
					<Textarea name="description" />
				</FormProvider>,
			);

			expect(
				document.querySelector(".arkynFieldError"),
			).not.toBeInTheDocument();
		});

		it("should prioritize the errorMessage prop over fieldErrors", () => {
			render(
				<FormProvider fieldErrors={{ description: "From context" }}>
					<Textarea name="description" errorMessage="From prop" />
				</FormProvider>,
			);

			expect(screen.getByText("From prop")).toBeInTheDocument();
			expect(screen.queryByText("From context")).not.toBeInTheDocument();
		});

		it("should apply the errorTrue class when the error comes from fieldErrors", () => {
			const { container } = render(
				<FormProvider fieldErrors={{ description: "Required" }}>
					<Textarea name="description" />
				</FormProvider>,
			);

			const section = container.querySelector(".arkynTextarea") as HTMLElement;
			expect(section).toHaveClass("errorTrue");
		});
	});

	describe("disabled state", () => {
		it("should not be disabled by default", () => {
			render(<Textarea name="description" />);

			expect(screen.getByRole("textbox")).not.toBeDisabled();
		});

		it("should disable the textarea when disabled is true", () => {
			render(<Textarea name="description" disabled />);

			expect(screen.getByRole("textbox")).toBeDisabled();
		});

		it("should apply the opacityTrue class when disabled", () => {
			const { container } = render(<Textarea name="description" disabled />);

			const section = container.querySelector(".arkynTextarea") as HTMLElement;
			expect(section).toHaveClass("opacityTrue");
		});

		it("should not allow typing while disabled", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();
			render(<Textarea name="description" disabled onChange={handleChange} />);

			await user.type(screen.getByRole("textbox"), "abc");

			expect(handleChange).not.toHaveBeenCalled();
		});
	});

	describe("readOnly state", () => {
		it("should not be readOnly by default", () => {
			render(<Textarea name="description" />);

			expect(screen.getByRole("textbox")).not.toHaveAttribute("readonly");
		});

		it("should set the readOnly attribute when readOnly is true", () => {
			render(<Textarea name="description" readOnly />);

			expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
		});

		it("should apply the opacityTrue class when readOnly", () => {
			const { container } = render(<Textarea name="description" readOnly />);

			const section = container.querySelector(".arkynTextarea") as HTMLElement;
			expect(section).toHaveClass("opacityTrue");
		});
	});

	describe("disabled and readOnly interaction", () => {
		it("should apply opacityTrue when both disabled and readOnly are true", () => {
			const { container } = render(
				<Textarea name="description" disabled readOnly />,
			);

			const section = container.querySelector(".arkynTextarea") as HTMLElement;
			expect(section).toHaveClass("opacityTrue");
		});

		it("should apply opacityFalse when neither disabled nor readOnly is set", () => {
			const { container } = render(<Textarea name="description" />);

			const section = container.querySelector(".arkynTextarea") as HTMLElement;
			expect(section).toHaveClass("opacityFalse");
		});
	});

	describe("size prop", () => {
		it("should apply the default md size class when omitted", () => {
			const { container } = render(<Textarea name="description" />);

			const section = container.querySelector(".arkynTextarea") as HTMLElement;
			expect(section).toHaveClass("md");
		});

		it("should apply the lg size class when specified", () => {
			const { container } = render(<Textarea name="description" size="lg" />);

			const section = container.querySelector(".arkynTextarea") as HTMLElement;
			expect(section).toHaveClass("lg");
			expect(section).not.toHaveClass("md");
		});
	});

	describe("variant prop", () => {
		it("should apply the default solid variant class when omitted", () => {
			const { container } = render(<Textarea name="description" />);

			const section = container.querySelector(".arkynTextarea") as HTMLElement;
			expect(section).toHaveClass("solid");
		});

		it.each([
			"solid",
			"outline",
		] as const)("should apply the '%s' variant class", (variant) => {
			const { container } = render(
				<Textarea name="description" variant={variant} />,
			);

			const section = container.querySelector(".arkynTextarea") as HTMLElement;
			expect(section).toHaveClass(variant);
		});

		it("should replace the variant class when changed", () => {
			const { container, rerender } = render(
				<Textarea name="description" variant="solid" />,
			);

			let section = container.querySelector(".arkynTextarea") as HTMLElement;
			expect(section).toHaveClass("solid");

			rerender(<Textarea name="description" variant="outline" />);
			section = container.querySelector(".arkynTextarea") as HTMLElement;
			expect(section).toHaveClass("outline");
			expect(section).not.toHaveClass("solid");
		});
	});

	describe("className merge", () => {
		it("should preserve the base wrapper className", () => {
			render(<Textarea name="description" label="Description" />);

			const wrapper = document.querySelector(".arkynFieldWrapper");
			expect(wrapper).toHaveClass("arkynFieldWrapper");
		});

		it("should merge an external className with the wrapper base className", () => {
			render(
				<Textarea
					name="description"
					label="Description"
					className="custom-class"
				/>,
			);

			const wrapper = document.querySelector(".arkynFieldWrapper");
			expect(wrapper).toHaveClass("arkynFieldWrapper");
			expect(wrapper).toHaveClass("custom-class");
		});

		it("should always preserve the arkynTextarea base class on the section", () => {
			const { container } = render(
				<Textarea name="description" variant="outline" />,
			);

			const section = container.querySelector(".arkynTextarea") as HTMLElement;
			expect(section).toHaveClass("arkynTextarea");
			expect(section).toHaveClass("outline");
		});
	});

	describe("id prop", () => {
		it("should forward id to the textarea element", () => {
			render(<Textarea name="description" id="custom-id" />);

			expect(document.getElementById("custom-id")).toBeInTheDocument();
		});

		it("should generate an id when none is provided", () => {
			render(<Textarea name="description" label="Description" />);

			const textarea = screen.getByRole("textbox");
			expect(textarea.id).toBeTruthy();
		});

		it("should associate the label with the textarea via htmlFor", () => {
			render(<Textarea name="description" label="Description" id="desc-id" />);

			expect(screen.getByLabelText("Description")).toBe(
				screen.getByRole("textbox"),
			);
		});
	});

	describe("accessibility", () => {
		it("should support aria-label passthrough", () => {
			render(<Textarea name="description" aria-label="Description field" />);

			expect(screen.getByLabelText("Description field")).toBeInTheDocument();
		});

		it("should support keyboard tabbing into the textarea", async () => {
			const user = userEvent.setup();
			render(<Textarea name="description" />);

			await user.tab();

			expect(screen.getByRole("textbox")).toHaveFocus();
		});

		it("should not be reachable by tab when disabled", async () => {
			const user = userEvent.setup();
			render(<Textarea name="description" disabled />);

			await user.tab();

			expect(screen.getByRole("textbox")).not.toHaveFocus();
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the textarea", () => {
			render(<Textarea name="description" data-testid="description-input" />);

			expect(screen.getByTestId("description-input")).toBeInTheDocument();
		});

		it("should forward the title attribute to the section", () => {
			const { container } = render(
				<Textarea name="description" title="Enter a description" />,
			);

			const section = container.querySelector(".arkynTextarea");
			expect(section).toHaveAttribute("title", "Enter a description");
		});

		it("should forward inline style to the section", () => {
			const { container } = render(
				<Textarea name="description" style={{ marginTop: "10px" }} />,
			);

			const section = container.querySelector(".arkynTextarea") as HTMLElement;
			expect(section).toHaveStyle({ marginTop: "10px" });
		});

		it("should forward rows to the textarea", () => {
			render(<Textarea name="description" rows={8} />);

			expect(screen.getByRole("textbox")).toHaveAttribute("rows", "8");
		});

		it("should forward maxLength to the textarea", () => {
			render(<Textarea name="description" maxLength={100} />);

			expect(screen.getByRole("textbox")).toHaveAttribute("maxLength", "100");
		});
	});

	describe("edge cases", () => {
		it("should handle an empty string label without rendering a label element", () => {
			render(<Textarea name="description" label="" />);

			expect(
				document.querySelector(".arkynFieldLabel"),
			).not.toBeInTheDocument();
		});

		it("should handle an empty errorMessage without rendering an error element", () => {
			render(<Textarea name="description" errorMessage="" />);

			expect(
				document.querySelector(".arkynFieldError"),
			).not.toBeInTheDocument();
		});

		it("should handle fieldErrors being undefined without throwing", () => {
			render(
				<FormProvider fieldErrors={undefined}>
					<Textarea name="description" />
				</FormProvider>,
			);

			expect(document.querySelector(".arkynTextarea")).toBeInTheDocument();
		});

		it("should render normally when rendered outside a FormProvider", () => {
			render(<Textarea name="description" />);

			expect(document.querySelector(".arkynTextarea")).toBeInTheDocument();
			expect(
				document.querySelector(".arkynFieldError"),
			).not.toBeInTheDocument();
		});
	});
});
