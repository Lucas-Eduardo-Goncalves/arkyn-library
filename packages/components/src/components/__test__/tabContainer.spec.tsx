import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TabButton } from "../../tabButton";
import { TabContainer } from "../index";

describe("TabContainer", () => {
	afterEach(() => {
		cleanup();
	});

	it("should render without errors", () => {
		render(
			<TabContainer>
				<TabButton value="one">One</TabButton>
			</TabContainer>,
		);

		expect(screen.getByText("One")).toBeInTheDocument();
	});

	it("should render children", () => {
		render(
			<TabContainer>
				<TabButton value="one">One</TabButton>
				<TabButton value="two">Two</TabButton>
			</TabContainer>,
		);

		expect(screen.getByText("One")).toBeInTheDocument();
		expect(screen.getByText("Two")).toBeInTheDocument();
	});

	it("should render multiple children elements", () => {
		render(
			<TabContainer>
				<TabButton value="one">One</TabButton>
				<TabButton value="two">Two</TabButton>
				<TabButton value="three">Three</TabButton>
			</TabContainer>,
		);

		expect(screen.getAllByRole("button")).toHaveLength(3);
	});

	it("should render as a nav element", () => {
		const { container } = render(
			<TabContainer>
				<TabButton value="one">One</TabButton>
			</TabContainer>,
		);

		const element = container.firstChild as HTMLElement;
		expect(element.tagName).toBe("NAV");
	});

	it("should render with all properties filled", () => {
		const onChange = vi.fn();
		render(
			<TabContainer
				defaultValue="one"
				disabled
				onChange={onChange}
				className="custom-class"
				id="tabs"
			>
				<TabButton value="one">One</TabButton>
			</TabContainer>,
		);

		const button = screen.getByRole("button", { name: "One" });
		expect(button).toBeDisabled();
		expect(button).toHaveClass("isActive");
		expect(document.getElementById("tabs")).toBeInTheDocument();
	});

	describe("defaultValue prop", () => {
		it("should have no active tab when defaultValue is omitted", () => {
			render(
				<TabContainer>
					<TabButton value="one">One</TabButton>
					<TabButton value="two">Two</TabButton>
				</TabContainer>,
			);

			expect(screen.getByRole("button", { name: "One" })).not.toHaveClass(
				"isActive",
			);
			expect(screen.getByRole("button", { name: "Two" })).not.toHaveClass(
				"isActive",
			);
		});

		it("should mark the tab matching defaultValue as active", () => {
			render(
				<TabContainer defaultValue="two">
					<TabButton value="one">One</TabButton>
					<TabButton value="two">Two</TabButton>
				</TabContainer>,
			);

			expect(screen.getByRole("button", { name: "One" })).not.toHaveClass(
				"isActive",
			);
			expect(screen.getByRole("button", { name: "Two" })).toHaveClass(
				"isActive",
			);
		});

		it("should not mark any tab as active when defaultValue matches no tab", () => {
			render(
				<TabContainer defaultValue="unknown">
					<TabButton value="one">One</TabButton>
					<TabButton value="two">Two</TabButton>
				</TabContainer>,
			);

			expect(screen.getByRole("button", { name: "One" })).not.toHaveClass(
				"isActive",
			);
			expect(screen.getByRole("button", { name: "Two" })).not.toHaveClass(
				"isActive",
			);
		});
	});

	describe("onChange callback", () => {
		it("should be called when a tab is clicked", async () => {
			const onChange = vi.fn();
			const user = userEvent.setup();
			render(
				<TabContainer onChange={onChange}>
					<TabButton value="one">One</TabButton>
					<TabButton value="two">Two</TabButton>
				</TabContainer>,
			);

			await user.click(screen.getByRole("button", { name: "Two" }));

			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChange).toHaveBeenCalledWith("two");
		});

		it("should be called once per click and receive the correct value each time", async () => {
			const onChange = vi.fn();
			const user = userEvent.setup();
			render(
				<TabContainer onChange={onChange}>
					<TabButton value="one">One</TabButton>
					<TabButton value="two">Two</TabButton>
				</TabContainer>,
			);

			await user.click(screen.getByRole("button", { name: "One" }));
			await user.click(screen.getByRole("button", { name: "Two" }));

			expect(onChange).toHaveBeenCalledTimes(2);
			expect(onChange).toHaveBeenNthCalledWith(1, "one");
			expect(onChange).toHaveBeenNthCalledWith(2, "two");
		});

		it("should not throw and still update active tab when onChange is omitted", async () => {
			const user = userEvent.setup();
			render(
				<TabContainer>
					<TabButton value="one">One</TabButton>
					<TabButton value="two">Two</TabButton>
				</TabContainer>,
			);

			await user.click(screen.getByRole("button", { name: "Two" }));

			expect(screen.getByRole("button", { name: "Two" })).toHaveClass(
				"isActive",
			);
		});
	});

	describe("disabled prop", () => {
		it("should default to not disabled", () => {
			render(
				<TabContainer>
					<TabButton value="one">One</TabButton>
				</TabContainer>,
			);

			expect(screen.getByRole("button", { name: "One" })).not.toBeDisabled();
		});

		it("should disable all tab buttons when true", () => {
			render(
				<TabContainer disabled>
					<TabButton value="one">One</TabButton>
					<TabButton value="two">Two</TabButton>
				</TabContainer>,
			);

			expect(screen.getByRole("button", { name: "One" })).toBeDisabled();
			expect(screen.getByRole("button", { name: "Two" })).toBeDisabled();
		});

		it("should prevent tab switching when container is disabled", async () => {
			const onChange = vi.fn();
			const user = userEvent.setup();
			render(
				<TabContainer disabled onChange={onChange}>
					<TabButton value="one">One</TabButton>
					<TabButton value="two">Two</TabButton>
				</TabContainer>,
			);

			await user.click(screen.getByRole("button", { name: "Two" }));

			expect(onChange).not.toHaveBeenCalled();
		});
	});

	describe("className", () => {
		it("should preserve the base className", () => {
			const { container } = render(
				<TabContainer>
					<TabButton value="one">One</TabButton>
				</TabContainer>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynTabContainer");
		});

		it("should merge an external className with the base className", () => {
			const { container } = render(
				<TabContainer className="custom-class">
					<TabButton value="one">One</TabButton>
				</TabContainer>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynTabContainer");
			expect(element).toHaveClass("custom-class");
		});

		it("should still render the base class when className is omitted", () => {
			const { container } = render(
				<TabContainer>
					<TabButton value="one">One</TabButton>
				</TabContainer>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynTabContainer");
		});

		it("should handle an empty className string without duplicating whitespace", () => {
			const { container } = render(
				<TabContainer className="">
					<TabButton value="one">One</TabButton>
				</TabContainer>,
			);

			const element = container.firstChild as HTMLElement;
			expect(element).toHaveClass("arkynTabContainer");
			expect(element.className.trim()).toBe(element.className);
		});
	});

	describe("HTML attributes passthrough", () => {
		it("should spread additional HTML attributes onto the nav element", () => {
			render(
				<TabContainer data-testid="tab-nav" aria-label="Sections">
					<TabButton value="one">One</TabButton>
				</TabContainer>,
			);

			const element = screen.getByTestId("tab-nav");
			expect(element).toHaveAttribute("aria-label", "Sections");
		});

		it("should forward id attribute", () => {
			render(
				<TabContainer id="tab-id">
					<TabButton value="one">One</TabButton>
				</TabContainer>,
			);

			expect(document.getElementById("tab-id")).toBeInTheDocument();
		});
	});

	describe("edge cases", () => {
		it("should handle a single child without throwing", () => {
			render(
				<TabContainer>
					<TabButton value="one">One</TabButton>
				</TabContainer>,
			);

			expect(screen.getByText("One")).toBeInTheDocument();
		});

		it("should handle an empty string defaultValue", () => {
			render(
				<TabContainer defaultValue="">
					<TabButton value="one">One</TabButton>
				</TabContainer>,
			);

			expect(screen.getByRole("button", { name: "One" })).not.toHaveClass(
				"isActive",
			);
		});
	});
});
