import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Pagination } from "../index";

function getPageButtons() {
	return screen
		.getAllByRole("button")
		.filter((button) => /^\d+$/.test(button.textContent || ""));
}

describe("Pagination", () => {
	afterEach(() => {
		cleanup();
	});

	it("should render without errors", () => {
		render(<Pagination totalCountRegisters={200} currentPage={1} />);

		expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
	});

	it("should render with the base className", () => {
		const { container } = render(
			<Pagination totalCountRegisters={200} currentPage={1} />,
		);

		expect(container.firstChild).toHaveClass("arkynPagination");
	});

	it("should replace the base className with an external className since the component does not merge them", () => {
		const { container } = render(
			<Pagination
				totalCountRegisters={200}
				currentPage={1}
				className="custom-class"
			/>,
		);

		expect(container.firstChild).toHaveClass("custom-class");
		expect(container.firstChild).not.toHaveClass("arkynPagination");
	});

	it("should spread other html attributes onto the root div", () => {
		render(
			<Pagination
				totalCountRegisters={200}
				currentPage={1}
				data-testid="pagination-root"
				title="pagination"
			/>,
		);

		const root = screen.getByTestId("pagination-root");
		expect(root).toHaveAttribute("title", "pagination");
	});

	it("should render the current page as a disabled button", () => {
		render(<Pagination totalCountRegisters={200} currentPage={5} />);

		const currentButton = screen.getByRole("button", { name: "5" });
		expect(currentButton).toBeDisabled();
		expect(currentButton).toHaveClass("arkynPaginationCurrentButton");
	});

	it("should render sibling pages around the current page using the default siblingsCount", () => {
		render(<Pagination totalCountRegisters={200} currentPage={5} />);

		const pages = getPageButtons().map((button) => button.textContent);
		expect(pages).toEqual(["1", "3", "4", "5", "6", "7", "10"]);
	});

	it("should render fewer siblings when siblingsCount is customized", () => {
		render(
			<Pagination
				totalCountRegisters={200}
				currentPage={5}
				siblingsCount={1}
			/>,
		);

		const pages = getPageButtons().map((button) => button.textContent);
		expect(pages).toEqual(["1", "4", "5", "6", "10"]);
	});

	it("should render an ellipsis on both sides when the current page is in the middle", () => {
		render(<Pagination totalCountRegisters={200} currentPage={5} />);

		expect(document.querySelectorAll(".arkynPaginationSpread")).toHaveLength(2);
	});

	it("should not render a leading page 1 or ellipsis when the current page is near the start", () => {
		render(<Pagination totalCountRegisters={200} currentPage={1} />);

		const pages = getPageButtons().map((button) => button.textContent);
		expect(pages).toEqual(["1", "2", "3", "10"]);
		expect(document.querySelectorAll(".arkynPaginationSpread")).toHaveLength(1);
	});

	it("should not render a trailing last page or ellipsis when the current page is near the end", () => {
		render(<Pagination totalCountRegisters={200} currentPage={10} />);

		const pages = getPageButtons().map((button) => button.textContent);
		expect(pages).toEqual(["1", "8", "9", "10"]);
		expect(document.querySelectorAll(".arkynPaginationSpread")).toHaveLength(1);
	});

	it("should render a single page button when there is only one page", () => {
		render(<Pagination totalCountRegisters={20} currentPage={1} />);

		const pages = getPageButtons().map((button) => button.textContent);
		expect(pages).toEqual(["1"]);
		expect(document.querySelectorAll(".arkynPaginationSpread")).toHaveLength(0);
	});

	it("should respect a custom registerPerPage when computing the last page", () => {
		render(
			<Pagination
				totalCountRegisters={100}
				currentPage={1}
				registerPerPage={10}
			/>,
		);

		const pages = getPageButtons().map((button) => button.textContent);
		expect(pages[pages.length - 1]).toBe("10");
	});

	it("should disable the previous chevron button on the first page", () => {
		render(<Pagination totalCountRegisters={200} currentPage={1} />);

		const buttons = screen.getAllByRole("button");
		const previousButton = buttons[0];
		expect(previousButton).toHaveClass("arkynChevronPageButton");
		expect(previousButton).toBeDisabled();
	});

	it("should enable the previous chevron button when not on the first page", () => {
		render(<Pagination totalCountRegisters={200} currentPage={5} />);

		const buttons = screen.getAllByRole("button");
		const previousButton = buttons[0];
		expect(previousButton).not.toBeDisabled();
	});

	it("should disable the next chevron button on the last page", () => {
		render(<Pagination totalCountRegisters={200} currentPage={10} />);

		const buttons = screen.getAllByRole("button");
		const nextButton = buttons[buttons.length - 1];
		expect(nextButton).toHaveClass("arkynChevronPageButton");
		expect(nextButton).toBeDisabled();
	});

	it("should enable the next chevron button when not on the last page", () => {
		render(<Pagination totalCountRegisters={200} currentPage={5} />);

		const buttons = screen.getAllByRole("button");
		const nextButton = buttons[buttons.length - 1];
		expect(nextButton).not.toBeDisabled();
	});

	it("should disable both chevron buttons when there is only one page", () => {
		render(<Pagination totalCountRegisters={20} currentPage={1} />);

		const buttons = screen.getAllByRole("button");
		expect(buttons[0]).toBeDisabled();
		expect(buttons[buttons.length - 1]).toBeDisabled();
	});

	it("should call onChange with currentPage - 1 when clicking any sibling button before the current page", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<Pagination
				totalCountRegisters={200}
				currentPage={5}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole("button", { name: "3" }));

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(4);
	});

	it("should call onChange with currentPage + 1 when clicking any sibling button after the current page", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<Pagination
				totalCountRegisters={200}
				currentPage={5}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole("button", { name: "7" }));

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(6);
	});

	it("should call onChange with page 1 when clicking the leading page button", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<Pagination
				totalCountRegisters={200}
				currentPage={5}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole("button", { name: "1" }));

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(1);
	});

	it("should call onChange with the last page when clicking the trailing page button", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<Pagination
				totalCountRegisters={200}
				currentPage={5}
				onChange={onChange}
			/>,
		);

		await user.click(screen.getByRole("button", { name: "10" }));

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(10);
	});

	it("should call onChange with the next page when clicking the next chevron", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<Pagination
				totalCountRegisters={200}
				currentPage={5}
				onChange={onChange}
			/>,
		);

		const buttons = screen.getAllByRole("button");
		await user.click(buttons[buttons.length - 1]);

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(6);
	});

	it("should call onChange with the previous page when clicking the previous chevron", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<Pagination
				totalCountRegisters={200}
				currentPage={5}
				onChange={onChange}
			/>,
		);

		const buttons = screen.getAllByRole("button");
		await user.click(buttons[0]);

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(4);
	});

	it("should not throw and not call onChange when clicking the disabled previous chevron on the first page", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<Pagination
				totalCountRegisters={200}
				currentPage={1}
				onChange={onChange}
			/>,
		);

		const buttons = screen.getAllByRole("button");
		await user.click(buttons[0]);

		expect(onChange).not.toHaveBeenCalled();
	});

	it("should not throw and not call onChange when clicking the disabled next chevron on the last page", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<Pagination
				totalCountRegisters={200}
				currentPage={10}
				onChange={onChange}
			/>,
		);

		const buttons = screen.getAllByRole("button");
		await user.click(buttons[buttons.length - 1]);

		expect(onChange).not.toHaveBeenCalled();
	});

	it("should not throw when onChange is omitted and a page button is clicked", async () => {
		const user = userEvent.setup();

		render(<Pagination totalCountRegisters={200} currentPage={5} />);

		await expect(
			user.click(screen.getByRole("button", { name: "7" })),
		).resolves.not.toThrow();
	});

	it("should render zero pages gracefully when totalCountRegisters is zero", () => {
		render(<Pagination totalCountRegisters={0} currentPage={1} />);

		const buttons = screen.getAllByRole("button");
		expect(buttons[0]).toBeDisabled();
		expect(buttons[buttons.length - 1]).toBeDisabled();
	});

	it("should render an ellipsis element containing an icon", () => {
		render(<Pagination totalCountRegisters={200} currentPage={5} />);

		const spreads = document.querySelectorAll(".arkynPaginationSpread");
		expect(spreads.length).toBeGreaterThan(0);
		expect(spreads[0].querySelector("svg")).toBeInTheDocument();
	});
});
