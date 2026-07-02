import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FormProvider } from "../../providers/formProvider";
import { RadioBox } from "../radio/radioBox";
import { RadioGroup } from "../radio/radioGroup";

describe("RadioGroup", () => {
	afterEach(() => {
		cleanup();
	});

	it("should render without errors", () => {
		render(<RadioGroup name="gender" />);
	});

	it("should render children", () => {
		render(
			<RadioGroup name="gender">
				<RadioBox value="male">Male</RadioBox>
				<RadioBox value="female">Female</RadioBox>
			</RadioGroup>,
		);

		expect(screen.getByText("Male")).toBeInTheDocument();
		expect(screen.getByText("Female")).toBeInTheDocument();
	});

	it("should render with all optional properties omitted", () => {
		const { container } = render(<RadioGroup name="gender" />);

		const wrapper = container.querySelector(".arkynRadioGroup");
		expect(wrapper).toBeInTheDocument();
		expect(wrapper).toHaveClass("md");
	});

	it("should render with all properties filled", () => {
		render(
			<RadioGroup
				name="gender"
				label="Gender"
				showAsterisk
				defaultValue="male"
				size="lg"
				disabled
				orientation="horizontal"
				className="custom-class"
			>
				<RadioBox value="male">Male</RadioBox>
				<RadioBox value="female">Female</RadioBox>
			</RadioGroup>,
		);

		expect(screen.getByText("Gender")).toBeInTheDocument();
		expect(screen.getByText("Male")).toBeInTheDocument();
	});

	it("should render a hidden input with the given name", () => {
		const { container } = render(<RadioGroup name="gender" />);

		const input = container.querySelector('input[name="gender"]');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute("type", "text");
		expect(input).toHaveAttribute("readonly");
		expect(input).toHaveStyle({ display: "none" });
	});

	it("should set the hidden input default value to an empty string when defaultValue is omitted", () => {
		const { container } = render(<RadioGroup name="gender" />);

		const input = container.querySelector(
			'input[name="gender"]',
		) as HTMLInputElement;

		expect(input.value).toBe("");
	});

	it("should apply defaultValue to the hidden input and mark the matching RadioBox as checked", () => {
		const { container } = render(
			<RadioGroup name="gender" defaultValue="female">
				<RadioBox value="male">Male</RadioBox>
				<RadioBox value="female">Female</RadioBox>
			</RadioGroup>,
		);

		const input = container.querySelector(
			'input[name="gender"]',
		) as HTMLInputElement;
		expect(input.value).toBe("female");

		const femaleLabel = screen.getByText("Female").closest("label");
		expect(femaleLabel).toHaveClass("checkedTrue");
	});

	it("should update selected value when a RadioBox is clicked (uncontrolled)", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<RadioGroup name="gender" defaultValue="male">
				<RadioBox value="male">Male</RadioBox>
				<RadioBox value="female">Female</RadioBox>
			</RadioGroup>,
		);

		await user.click(screen.getByText("Female"));

		const input = container.querySelector(
			'input[name="gender"]',
		) as HTMLInputElement;
		expect(input.value).toBe("female");
	});

	it("should call onChange with the newly selected value", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		render(
			<RadioGroup name="gender" onChange={handleChange}>
				<RadioBox value="male">Male</RadioBox>
				<RadioBox value="female">Female</RadioBox>
			</RadioGroup>,
		);

		await user.click(screen.getByText("Male"));

		expect(handleChange).toHaveBeenCalled();
		expect(handleChange).toHaveBeenCalledWith("male");
		for (const call of handleChange.mock.calls) {
			expect(call[0]).toBe("male");
		}
	});

	it("should not call onChange when it is not provided", async () => {
		const user = userEvent.setup();

		render(
			<RadioGroup name="gender">
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		await expect(user.click(screen.getByText("Male"))).resolves.not.toThrow();
	});

	it("should behave as a controlled component when value is provided", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		const { container, rerender } = render(
			<RadioGroup name="gender" value="male" onChange={handleChange}>
				<RadioBox value="male">Male</RadioBox>
				<RadioBox value="female">Female</RadioBox>
			</RadioGroup>,
		);

		await user.click(screen.getByText("Female"));

		expect(handleChange).toHaveBeenCalledWith("female");

		const input = container.querySelector(
			'input[name="gender"]',
		) as HTMLInputElement;
		expect(input.value).toBe("male");

		rerender(
			<RadioGroup name="gender" value="female" onChange={handleChange}>
				<RadioBox value="male">Male</RadioBox>
				<RadioBox value="female">Female</RadioBox>
			</RadioGroup>,
		);

		expect(input.value).toBe("female");
	});

	it("should propagate size to RadioBox children by default (md)", () => {
		render(
			<RadioGroup name="gender">
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		const label = screen.getByText("Male").closest("label");
		expect(label).toHaveClass("md");
	});

	it("should propagate custom size to RadioBox children", () => {
		render(
			<RadioGroup name="gender" size="lg">
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		const label = screen.getByText("Male").closest("label");
		expect(label).toHaveClass("lg");
	});

	it("should let a RadioBox override the group size", () => {
		render(
			<RadioGroup name="gender" size="lg">
				<RadioBox value="male" size="sm">
					Male
				</RadioBox>
			</RadioGroup>,
		);

		const label = screen.getByText("Male").closest("label");
		expect(label).toHaveClass("sm");
		expect(label).not.toHaveClass("lg");
	});

	it("should reflect size class on the wrapper div", () => {
		const { container, rerender } = render(<RadioGroup name="gender" />);

		expect(container.querySelector(".arkynRadioGroup")).toHaveClass("md");

		rerender(<RadioGroup name="gender" size="sm" />);
		expect(container.querySelector(".arkynRadioGroup")).toHaveClass("sm");
		expect(container.querySelector(".arkynRadioGroup")).not.toHaveClass("md");
	});

	it("should propagate isError to RadioBox children when errorMessage is provided", () => {
		render(
			<RadioGroup name="gender" errorMessage="Required field">
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		const label = screen.getByText("Male").closest("label");
		expect(label).toHaveClass("errorTrue");
	});

	it("should propagate isError=false to RadioBox children by default", () => {
		render(
			<RadioGroup name="gender">
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		const label = screen.getByText("Male").closest("label");
		expect(label).toHaveClass("errorFalse");
	});

	it("should display the errorMessage text", () => {
		render(<RadioGroup name="gender" errorMessage="Required field" />);

		expect(screen.getByText("Required field")).toBeInTheDocument();
	});

	it("should read fieldErrors from FormProvider by field name when errorMessage is not provided", () => {
		render(
			<FormProvider fieldErrors={{ gender: "Please select an option" }}>
				<RadioGroup name="gender" />
			</FormProvider>,
		);

		expect(screen.getByText("Please select an option")).toBeInTheDocument();
	});

	it("should prioritize explicit errorMessage over fieldErrors from FormProvider", () => {
		render(
			<FormProvider fieldErrors={{ gender: "From context" }}>
				<RadioGroup name="gender" errorMessage="Explicit message" />
			</FormProvider>,
		);

		expect(screen.getByText("Explicit message")).toBeInTheDocument();
		expect(screen.queryByText("From context")).not.toBeInTheDocument();
	});

	it("should propagate disabled to RadioBox children", () => {
		render(
			<RadioGroup name="gender" disabled>
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		const button = screen.getByRole("button");
		expect(button).toBeDisabled();

		const label = screen.getByText("Male").closest("label");
		expect(label).toHaveClass("disabledTrue");
	});

	it("should not disable RadioBox children by default", () => {
		render(
			<RadioGroup name="gender">
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		const button = screen.getByRole("button");
		expect(button).not.toBeDisabled();

		const label = screen.getByText("Male").closest("label");
		expect(label).toHaveClass("disabledFalse");
	});

	it("should not allow selecting a value when the group is disabled", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		render(
			<RadioGroup name="gender" disabled onChange={handleChange}>
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		await user.click(screen.getByRole("button"));

		expect(handleChange).not.toHaveBeenCalled();
	});

	it("should render the label when provided", () => {
		render(<RadioGroup name="gender" label="Gender" />);

		expect(screen.getByText("Gender")).toBeInTheDocument();
	});

	it("should not render a label when omitted", () => {
		const { container } = render(<RadioGroup name="gender" />);

		expect(container.querySelector(".arkynFieldLabel")).toBeNull();
	});

	it("should append an asterisk class to the label when showAsterisk is true", () => {
		render(<RadioGroup name="gender" label="Gender" showAsterisk />);

		expect(screen.getByText("Gender")).toHaveClass("asteriskTrue");
	});

	it("should not append an asterisk class to the label by default", () => {
		render(<RadioGroup name="gender" label="Gender" />);

		expect(screen.getByText("Gender")).toHaveClass("asteriskFalse");
	});

	it("should skip the FieldTemplate wrapper when unShowFieldTemplate is true", () => {
		const { container } = render(
			<RadioGroup
				name="gender"
				label="Gender"
				errorMessage="Required"
				unShowFieldTemplate
			>
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		expect(screen.queryByText("Gender")).not.toBeInTheDocument();
		expect(screen.queryByText("Required")).not.toBeInTheDocument();
		expect(container.querySelector(".arkynRadioGroup")).toBeInTheDocument();
	});

	it("should render the FieldTemplate wrapper by default", () => {
		const { container } = render(
			<RadioGroup name="gender" label="Gender">
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		expect(screen.getByText("Gender")).toBeInTheDocument();
		expect(container.querySelector(".arkynRadioGroup")).toBeInTheDocument();
	});

	it("should preserve the base arkynRadioGroup class on the options wrapper regardless of className", () => {
		const { container } = render(
			<RadioGroup name="gender" className="custom-class" />,
		);

		const wrapper = container.querySelector(".arkynRadioGroup");
		expect(wrapper).toHaveClass("arkynRadioGroup");
		expect(wrapper).toHaveClass("md");
	});

	it("should merge external className onto the FieldWrapper while preserving its base class", () => {
		const { container } = render(
			<RadioGroup name="gender" label="Gender" className="custom-class" />,
		);

		const fieldWrapper = container.querySelector(".arkynFieldWrapper");
		expect(fieldWrapper).toHaveClass("arkynFieldWrapper");
		expect(fieldWrapper).toHaveClass("custom-class");
	});

	it("should spread additional native div attributes onto the wrapper", () => {
		const { container } = render(
			<RadioGroup name="gender" data-testid="radio-group-wrapper" />,
		);

		expect(
			container.querySelector('[data-testid="radio-group-wrapper"]'),
		).toBeInTheDocument();
	});

	it("should render multiple RadioBox children and only mark the matching one as checked", () => {
		render(
			<RadioGroup name="plan" defaultValue="pro">
				<RadioBox value="basic">Basic</RadioBox>
				<RadioBox value="pro">Pro</RadioBox>
				<RadioBox value="enterprise">Enterprise</RadioBox>
			</RadioGroup>,
		);

		expect(screen.getByText("Basic").closest("label")).toHaveClass(
			"checkedFalse",
		);
		expect(screen.getByText("Pro").closest("label")).toHaveClass("checkedTrue");
		expect(screen.getByText("Enterprise").closest("label")).toHaveClass(
			"checkedFalse",
		);
	});

	it("should render with an empty string as name gracefully", () => {
		const { container } = render(<RadioGroup name="" />);

		const input = container.querySelector('input[name=""]');
		expect(input).toBeInTheDocument();
	});

	it("should render without children", () => {
		const { container } = render(<RadioGroup name="gender" />);

		expect(container.querySelector(".arkynRadioGroup")).toBeEmptyDOMElement();
	});
});
