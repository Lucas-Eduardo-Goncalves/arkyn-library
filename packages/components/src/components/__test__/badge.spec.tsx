import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Badge } from "../badge";

const defaultProps = {
	children: "Label",
};

const renderBadge = (props = {}) => {
	return render(<Badge {...defaultProps} {...props} />);
};

describe("Badge", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Rendering", () => {
		it("should render correctly with default props", () => {
			renderBadge();

			const badge = screen.getByText("Label").closest("div");

			expect(badge).toBeInTheDocument();
			expect(badge).toHaveClass("arkynBadge");
		});

		it("should render children content correctly", () => {
			renderBadge({ children: "New" });

			expect(screen.getByText("New")).toBeInTheDocument();
		});

		it("should render left and right icons when provided", () => {
			const MockIcon = () => <svg data-testid="mock-icon" />;
			renderBadge({ leftIcon: MockIcon, rightIcon: MockIcon });

			const badge = screen.getByText("Label").closest("div");
			const svgs = badge?.querySelectorAll("svg") || [];

			expect(svgs.length).toBeGreaterThanOrEqual(1);
		});
	});

	describe("Default Values", () => {
		it("should have default size of 'lg'", () => {
			renderBadge();

			const badge = screen.getByText("Label").closest("div");
			expect(badge).toHaveClass("lg");
		});

		it("should have default variant of 'ghost'", () => {
			renderBadge();

			const badge = screen.getByText("Label").closest("div");
			expect(badge).toHaveClass("ghost");
		});

		it("should have default scheme of 'primary'", () => {
			renderBadge();

			const badge = screen.getByText("Label").closest("div");
			expect(badge).toHaveClass("primary");
		});
	});

	describe("Props", () => {
		it("should apply size prop correctly", () => {
			renderBadge({ size: "md" });
			const badge = screen.getByText("Label").closest("div");
			expect(badge).toHaveClass("md");
		});

		it("should apply variant prop correctly", () => {
			renderBadge({ variant: "solid" });
			const badge = screen.getByText("Label").closest("div");
			expect(badge).toHaveClass("solid");
		});

		it("should apply scheme prop correctly", () => {
			renderBadge({ scheme: "success" });
			const badge = screen.getByText("Label").closest("div");
			expect(badge).toHaveClass("success");
		});
	});

	describe("ClassName Prop", () => {
		it("should merge custom className with base classes", () => {
			renderBadge({ className: "custom-badge" });
			const badge = screen.getByText("Label").closest("div");
			expect(badge).toHaveClass("arkynBadge");
			expect(badge).toHaveClass("custom-badge");
		});
	});

	describe("HTML Attributes Spreading", () => {
		it("should spread data-* attributes", () => {
			renderBadge({ "data-testid": "custom-badge" });
			expect(screen.getByTestId("custom-badge")).toBeInTheDocument();
		});

		it("should spread id attribute", () => {
			renderBadge({ id: "badge-1" });
			expect(screen.getByText("Label").closest("div")).toHaveAttribute(
				"id",
				"badge-1",
			);
		});

		it("should spread title attribute", () => {
			renderBadge({ title: "Info" });
			expect(screen.getByText("Label").closest("div")).toHaveAttribute(
				"title",
				"Info",
			);
		});
	});

	describe("Accessibility", () => {
		it("should support aria-label", () => {
			renderBadge({ "aria-label": "Status" });
			expect(screen.getByLabelText("Status")).toBeInTheDocument();
		});

		it("should have accessible name from children", () => {
			renderBadge({ children: "Accessible" });
			expect(screen.getByText("Accessible")).toBeInTheDocument();
		});
	});

	describe("Edge Cases", () => {
		it("should handle empty children", () => {
			renderBadge({ children: "" });
			const badge = screen.getByText("").closest("div");
			expect(badge).toBeInTheDocument();
		});

		it("should handle numeric children", () => {
			renderBadge({ children: 123 });
			expect(screen.getByText("123")).toBeInTheDocument();
		});
	});

	describe("Interactions", () => {
		it("should handle click events when provided", async () => {
			const handleClick = vi.fn();
			renderBadge({ onClick: handleClick });

			await userEvent.click(screen.getByText("Label"));
			expect(handleClick).toHaveBeenCalledTimes(1);
		});
	});

	describe("Snapshots", () => {
		it("should match snapshot with default props", () => {
			const { container } = renderBadge();
			expect(container).toMatchSnapshot();
		});
	});
});
