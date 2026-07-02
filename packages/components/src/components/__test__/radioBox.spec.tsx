import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { RadioGroup } from "../../radioGroup";
import { RadioBox } from "../index";

describe("RadioBox", () => {
	afterEach(() => {
		cleanup();
	});

	it("should render without errors inside a RadioGroup", () => {
		render(
			<RadioGroup name="gender">
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);
	});

	it("should render its children (string content)", () => {
		render(
			<RadioGroup name="gender">
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		expect(screen.getByText("Male")).toBeInTheDocument();
	});

	it("should render JSX children", () => {
		render(
			<RadioGroup name="gender">
				<RadioBox value="male">
					<span data-testid="jsx-child">Male option</span>
				</RadioBox>
			</RadioGroup>,
		);

		expect(screen.getByTestId("jsx-child")).toBeInTheDocument();
	});

	it("should render as a label wrapping a button", () => {
		render(
			<RadioGroup name="gender">
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		const label = screen.getByText("Male").closest("label");
		const button = screen.getByRole("button");

		expect(label).toBeInTheDocument();
		expect(label).toContainElement(button);
		expect(button).toHaveAttribute("type", "button");
	});

	it("should render multiple RadioBox siblings", () => {
		render(
			<RadioGroup name="plan">
				<RadioBox value="basic">Basic</RadioBox>
				<RadioBox value="pro">Pro</RadioBox>
				<RadioBox value="enterprise">Enterprise</RadioBox>
			</RadioGroup>,
		);

		expect(screen.getAllByRole("button")).toHaveLength(3);
	});

	it("should be checked when its value matches the group's current value", () => {
		render(
			<RadioGroup name="gender" defaultValue="male">
				<RadioBox value="male">Male</RadioBox>
				<RadioBox value="female">Female</RadioBox>
			</RadioGroup>,
		);

		expect(screen.getByText("Male").closest("label")).toHaveClass(
			"checkedTrue",
		);
		expect(screen.getByText("Female").closest("label")).toHaveClass(
			"checkedFalse",
		);
	});

	it("should not be checked when the group has no matching value", () => {
		render(
			<RadioGroup name="gender">
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		expect(screen.getByText("Male").closest("label")).toHaveClass(
			"checkedFalse",
		);
	});

	it("should become checked when clicked", async () => {
		const user = userEvent.setup();

		render(
			<RadioGroup name="gender">
				<RadioBox value="male">Male</RadioBox>
				<RadioBox value="female">Female</RadioBox>
			</RadioGroup>,
		);

		const maleLabel = screen.getByText("Male").closest("label");
		expect(maleLabel).toHaveClass("checkedFalse");

		await user.click(screen.getByText("Male"));

		expect(maleLabel).toHaveClass("checkedTrue");
	});

	it("should switch selection between two RadioBox options when clicked in sequence", async () => {
		const user = userEvent.setup();

		render(
			<RadioGroup name="gender" defaultValue="male">
				<RadioBox value="male">Male</RadioBox>
				<RadioBox value="female">Female</RadioBox>
			</RadioGroup>,
		);

		const maleLabel = screen.getByText("Male").closest("label");
		const femaleLabel = screen.getByText("Female").closest("label");

		expect(maleLabel).toHaveClass("checkedTrue");
		expect(femaleLabel).toHaveClass("checkedFalse");

		await user.click(screen.getByText("Female"));

		expect(maleLabel).toHaveClass("checkedFalse");
		expect(femaleLabel).toHaveClass("checkedTrue");
	});

	it("should call the group's onChange with this option's value when clicked", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		render(
			<RadioGroup name="gender" onChange={handleChange}>
				<RadioBox value="male">Male</RadioBox>
				<RadioBox value="female">Female</RadioBox>
			</RadioGroup>,
		);

		await user.click(screen.getByText("Female"));

		expect(handleChange).toHaveBeenCalledWith("female");
	});

	it("should call the RadioBox's own onClick handler when clicked", async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();

		render(
			<RadioGroup name="gender">
				<RadioBox value="male" onClick={handleClick}>
					Male
				</RadioBox>
			</RadioGroup>,
		);

		await user.click(screen.getByRole("button"));

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("should call the RadioBox's own onFocus handler when focused", () => {
		const handleFocus = vi.fn();

		render(
			<RadioGroup name="gender">
				<RadioBox value="male" onFocus={handleFocus}>
					Male
				</RadioBox>
			</RadioGroup>,
		);

		screen.getByRole("button").focus();

		expect(handleFocus).toHaveBeenCalledTimes(1);
	});

	it("should select the option via keyboard focus (Tab)", async () => {
		const user = userEvent.setup();

		render(
			<RadioGroup name="gender">
				<RadioBox value="male">Male</RadioBox>
				<RadioBox value="female">Female</RadioBox>
			</RadioGroup>,
		);

		await user.tab();

		expect(screen.getByText("Male").closest("label")).toHaveClass(
			"checkedTrue",
		);
	});

	it("should select the next option via keyboard focus (Tab twice)", async () => {
		const user = userEvent.setup();

		render(
			<RadioGroup name="gender">
				<RadioBox value="male">Male</RadioBox>
				<RadioBox value="female">Female</RadioBox>
			</RadioGroup>,
		);

		await user.tab();
		await user.tab();

		expect(screen.getByText("Female").closest("label")).toHaveClass(
			"checkedTrue",
		);
		expect(screen.getByText("Male").closest("label")).toHaveClass(
			"checkedFalse",
		);
	});

	it("should be focusable and activatable with the keyboard (Enter/Space via click semantics)", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		render(
			<RadioGroup name="gender" onChange={handleChange}>
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		const button = screen.getByRole("button");
		button.focus();
		expect(button).toHaveFocus();

		await user.keyboard("{Enter}");

		expect(handleChange).toHaveBeenCalledWith("male");
	});

	it("should inherit size from RadioGroup by default", () => {
		render(
			<RadioGroup name="gender" size="lg">
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		expect(screen.getByText("Male").closest("label")).toHaveClass("lg");
	});

	it("should override the group's size when its own size prop is set", () => {
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

	it("should default to md size when neither the group nor the option specify one", () => {
		render(
			<RadioGroup name="gender">
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		expect(screen.getByText("Male").closest("label")).toHaveClass("md");
	});

	it("should inherit isError from the group when its own isError is not set", () => {
		render(
			<RadioGroup name="gender" errorMessage="Required">
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		expect(screen.getByText("Male").closest("label")).toHaveClass("errorTrue");
	});

	it("should default to errorFalse when the group has no error", () => {
		render(
			<RadioGroup name="gender">
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		expect(screen.getByText("Male").closest("label")).toHaveClass("errorFalse");
	});

	it("should be disabled when the group is disabled, even without its own disabled prop", () => {
		render(
			<RadioGroup name="gender" disabled>
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		const button = screen.getByRole("button");
		expect(button).toBeDisabled();
		expect(screen.getByText("Male").closest("label")).toHaveClass(
			"disabledTrue",
		);
	});

	it("should be disabled when its own disabled prop is set, even if the group is not disabled", () => {
		render(
			<RadioGroup name="gender">
				<RadioBox value="male" disabled>
					Male
				</RadioBox>
				<RadioBox value="female">Female</RadioBox>
			</RadioGroup>,
		);

		expect(screen.getByText("Male").closest("label")).toHaveClass(
			"disabledTrue",
		);
		expect(screen.getByText("Female").closest("label")).toHaveClass(
			"disabledFalse",
		);
	});

	it("should not be disabled by default", () => {
		render(
			<RadioGroup name="gender">
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		expect(screen.getByRole("button")).not.toBeDisabled();
		expect(screen.getByText("Male").closest("label")).toHaveClass(
			"disabledFalse",
		);
	});

	it("should not trigger onChange when clicked while disabled via its own prop", async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		render(
			<RadioGroup name="gender" onChange={handleChange}>
				<RadioBox value="male" disabled>
					Male
				</RadioBox>
			</RadioGroup>,
		);

		await user.click(screen.getByRole("button"));

		expect(handleChange).not.toHaveBeenCalled();
	});

	it("should not trigger onChange when clicked while disabled via the group", async () => {
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

	it("should merge disabled (own + group) correctly when both are false", () => {
		render(
			<RadioGroup name="gender" disabled={false}>
				<RadioBox value="male" disabled={false}>
					Male
				</RadioBox>
			</RadioGroup>,
		);

		expect(screen.getByRole("button")).not.toBeDisabled();
	});

	it("should preserve the base arkynRadioBox class and merge custom className", () => {
		render(
			<RadioGroup name="gender">
				<RadioBox value="male" className="custom-class">
					Male
				</RadioBox>
			</RadioGroup>,
		);

		const label = screen.getByText("Male").closest("label");
		expect(label).toHaveClass("arkynRadioBox");
		expect(label).toHaveClass("custom-class");
	});

	it("should reflect checked, error, disabled and size classes together", () => {
		render(
			<RadioGroup name="gender" size="lg" disabled errorMessage="Required">
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		const label = screen.getByText("Male").closest("label");
		expect(label).toHaveClass("arkynRadioBox");
		expect(label).toHaveClass("lg");
		expect(label).toHaveClass("checkedFalse");
		expect(label).toHaveClass("errorTrue");
		expect(label).toHaveClass("disabledTrue");
	});

	it("should spread additional native button attributes onto the button element", () => {
		render(
			<RadioGroup name="gender">
				<RadioBox value="male" data-testid="male-button">
					Male
				</RadioBox>
			</RadioGroup>,
		);

		expect(screen.getByTestId("male-button")).toBeInTheDocument();
	});

	it("should support aria-label on the button", () => {
		render(
			<RadioGroup name="gender">
				<RadioBox value="male" aria-label="Select male">
					Male
				</RadioBox>
			</RadioGroup>,
		);

		expect(
			screen.getByRole("button", { name: "Select male" }),
		).toBeInTheDocument();
	});

	it("should render without children", () => {
		render(
			<RadioGroup name="gender">
				<RadioBox value="male" data-testid="empty-radio" />
			</RadioGroup>,
		);

		const label = screen.getByTestId("empty-radio").closest("label");
		expect(label).toBeInTheDocument();
	});

	it("should treat an empty string value as not matching a truthy group value", () => {
		render(
			<RadioGroup name="gender" defaultValue="male">
				<RadioBox value="">Unset</RadioBox>
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		expect(screen.getByText("Unset").closest("label")).toHaveClass(
			"checkedFalse",
		);
	});

	it("should keep the hidden input's value in sync when a RadioBox is selected", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<RadioGroup name="gender">
				<RadioBox value="male">Male</RadioBox>
			</RadioGroup>,
		);

		await user.click(screen.getByText("Male"));

		const input = container.querySelector(
			'input[name="gender"]',
		) as HTMLInputElement;
		expect(input.value).toBe("male");
	});
});
