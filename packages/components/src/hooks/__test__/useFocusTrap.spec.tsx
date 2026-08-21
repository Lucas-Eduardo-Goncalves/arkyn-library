import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { useFocusTrap } from "../useFocusTrap";

function TestHarness({ isActive }: { isActive: boolean }) {
	const containerRef = useRef<HTMLDivElement>(null);
	useFocusTrap(isActive, containerRef);

	return (
		<div>
			<button type="button">Outside trigger</button>
			{isActive && (
				<div ref={containerRef} tabIndex={-1} data-testid="trap">
					<button type="button">First</button>
					<button type="button">Last</button>
				</div>
			)}
		</div>
	);
}

function EmptyTrapHarness({ isActive }: { isActive: boolean }) {
	const containerRef = useRef<HTMLDivElement>(null);
	useFocusTrap(isActive, containerRef);

	return isActive ? (
		<div ref={containerRef} tabIndex={-1} data-testid="empty-trap">
			Just text, no focusable descendants
		</div>
	) : null;
}

describe("useFocusTrap", () => {
	afterEach(() => {
		cleanup();
	});

	it("should do nothing when isActive is false", () => {
		render(<TestHarness isActive={false} />);

		expect(screen.queryByTestId("trap")).not.toBeInTheDocument();
		expect(document.activeElement).toBe(document.body);
	});

	it("should move focus to the first focusable descendant on activation", () => {
		render(<TestHarness isActive />);

		expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
	});

	it("should focus the container itself when it has no focusable descendants", () => {
		render(<EmptyTrapHarness isActive />);

		expect(screen.getByTestId("empty-trap")).toHaveFocus();
	});

	it("should wrap Tab from the last focusable element to the first", async () => {
		const user = userEvent.setup();
		render(<TestHarness isActive />);

		const first = screen.getByRole("button", { name: "First" });
		const last = screen.getByRole("button", { name: "Last" });

		last.focus();
		await user.tab();

		expect(first).toHaveFocus();
	});

	it("should wrap Shift+Tab from the first focusable element to the last", async () => {
		const user = userEvent.setup();
		render(<TestHarness isActive />);

		const first = screen.getByRole("button", { name: "First" });
		const last = screen.getByRole("button", { name: "Last" });

		expect(first).toHaveFocus();
		await user.tab({ shift: true });

		expect(last).toHaveFocus();
	});

	it("should not move focus when Tab is pressed on a middle element (no wrap)", async () => {
		function ThreeButtonHarness({ isActive }: { isActive: boolean }) {
			const containerRef = useRef<HTMLDivElement>(null);
			useFocusTrap(isActive, containerRef);

			return isActive ? (
				<div ref={containerRef} tabIndex={-1}>
					<button type="button">One</button>
					<button type="button">Two</button>
					<button type="button">Three</button>
				</div>
			) : null;
		}

		const user = userEvent.setup();
		render(<ThreeButtonHarness isActive />);

		const two = screen.getByRole("button", { name: "Two" });
		const three = screen.getByRole("button", { name: "Three" });

		two.focus();
		await user.tab();

		expect(three).toHaveFocus();
	});

	it("should restore focus to the previously focused element when deactivated", () => {
		const { rerender } = render(<TestHarness isActive={false} />);

		const trigger = screen.getByRole("button", { name: "Outside trigger" });
		trigger.focus();
		expect(trigger).toHaveFocus();

		rerender(<TestHarness isActive />);
		expect(trigger).not.toHaveFocus();

		rerender(<TestHarness isActive={false} />);
		expect(trigger).toHaveFocus();
	});

	it("should not throw when the whole tree unmounts while the trap is active", () => {
		const { unmount } = render(<TestHarness isActive />);

		expect(() => unmount()).not.toThrow();
	});
});
