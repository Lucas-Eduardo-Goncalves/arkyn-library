import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDrawer } from "../../hooks/useDrawer";
import { DrawerProvider } from "../drawerProvider";

afterEach(() => {
	cleanup();
});

type HarnessProps = {
	drawerKey: string;
	openData?: unknown;
};

function DrawerHarness({ drawerKey, openData }: HarnessProps) {
	const { drawerIsOpen, drawerData, openDrawer, closeDrawer } =
		useDrawer<unknown>(drawerKey);

	return (
		<div>
			<span data-testid={`status-${drawerKey}`}>
				{drawerIsOpen ? "open" : "closed"}
			</span>
			<span data-testid={`data-${drawerKey}`}>
				{JSON.stringify(drawerData ?? null)}
			</span>
			<button type="button" onClick={() => openDrawer(openData)}>
				open-{drawerKey}
			</button>
			<button type="button" onClick={() => closeDrawer()}>
				close-{drawerKey}
			</button>
		</div>
	);
}

describe("DrawerProvider", () => {
	it("should render children without errors", () => {
		render(
			<DrawerProvider>
				<span>child content</span>
			</DrawerProvider>,
		);

		expect(screen.getByText("child content")).toBeInTheDocument();
	});

	it("should render multiple children", () => {
		render(
			<DrawerProvider>
				<span>first</span>
				<span>second</span>
			</DrawerProvider>,
		);

		expect(screen.getByText("first")).toBeInTheDocument();
		expect(screen.getByText("second")).toBeInTheDocument();
	});

	it("should start with drawers closed and data undefined", () => {
		render(
			<DrawerProvider>
				<DrawerHarness drawerKey="navigation" />
			</DrawerProvider>,
		);

		expect(screen.getByTestId("status-navigation")).toHaveTextContent("closed");
		expect(screen.getByTestId("data-navigation")).toHaveTextContent("null");
	});

	it("should open a drawer when openDrawer is called", async () => {
		const user = userEvent.setup();

		render(
			<DrawerProvider>
				<DrawerHarness drawerKey="navigation" />
			</DrawerProvider>,
		);

		await user.click(screen.getByRole("button", { name: "open-navigation" }));

		expect(screen.getByTestId("status-navigation")).toHaveTextContent("open");
	});

	it("should close a drawer when closeDrawer is called", async () => {
		const user = userEvent.setup();

		render(
			<DrawerProvider>
				<DrawerHarness drawerKey="navigation" />
			</DrawerProvider>,
		);

		await user.click(screen.getByRole("button", { name: "open-navigation" }));
		expect(screen.getByTestId("status-navigation")).toHaveTextContent("open");

		await user.click(screen.getByRole("button", { name: "close-navigation" }));
		expect(screen.getByTestId("status-navigation")).toHaveTextContent("closed");
	});

	it("should store and expose data passed to openDrawer", async () => {
		const user = userEvent.setup();

		render(
			<DrawerProvider>
				<DrawerHarness
					drawerKey="filters"
					openData={{ category: "electronics" }}
				/>
			</DrawerProvider>,
		);

		await user.click(screen.getByRole("button", { name: "open-filters" }));

		expect(screen.getByTestId("data-filters")).toHaveTextContent(
			JSON.stringify({ category: "electronics" }),
		);
	});

	it("should clear data when a drawer is closed and reopened without data", async () => {
		const user = userEvent.setup();

		function ReopenHarness() {
			const { drawerData, openDrawer, closeDrawer } = useDrawer<{
				category: string;
			}>("filters");

			return (
				<div>
					<span data-testid="data-filters">
						{JSON.stringify(drawerData ?? null)}
					</span>
					<button
						type="button"
						onClick={() => openDrawer({ category: "electronics" })}
					>
						open-with-data
					</button>
					<button type="button" onClick={() => closeDrawer()}>
						close
					</button>
					<button type="button" onClick={() => openDrawer()}>
						open-without-data
					</button>
				</div>
			);
		}

		render(
			<DrawerProvider>
				<ReopenHarness />
			</DrawerProvider>,
		);

		await user.click(screen.getByRole("button", { name: "open-with-data" }));
		expect(screen.getByTestId("data-filters")).toHaveTextContent(
			JSON.stringify({ category: "electronics" }),
		);

		await user.click(screen.getByRole("button", { name: "close" }));
		await user.click(screen.getByRole("button", { name: "open-without-data" }));

		expect(screen.getByTestId("data-filters")).toHaveTextContent("null");
	});

	it("should replace data with the most recent openDrawer call for the same key", async () => {
		const user = userEvent.setup();

		function MultiOpenHarness() {
			const { drawerData, openDrawer } = useDrawer<{ step: number }>("wizard");

			return (
				<div>
					<span data-testid="data-wizard">
						{JSON.stringify(drawerData ?? null)}
					</span>
					<button type="button" onClick={() => openDrawer({ step: 1 })}>
						open-step-1
					</button>
					<button type="button" onClick={() => openDrawer({ step: 2 })}>
						open-step-2
					</button>
				</div>
			);
		}

		render(
			<DrawerProvider>
				<MultiOpenHarness />
			</DrawerProvider>,
		);

		await user.click(screen.getByRole("button", { name: "open-step-1" }));
		expect(screen.getByTestId("data-wizard")).toHaveTextContent(
			JSON.stringify({ step: 1 }),
		);

		await user.click(screen.getByRole("button", { name: "open-step-2" }));
		expect(screen.getByTestId("data-wizard")).toHaveTextContent(
			JSON.stringify({ step: 2 }),
		);
	});

	it("should keep drawer open when reopened with new data", async () => {
		const user = userEvent.setup();

		render(
			<DrawerProvider>
				<DrawerHarness drawerKey="filters" openData={{ category: "books" }} />
			</DrawerProvider>,
		);

		await user.click(screen.getByRole("button", { name: "open-filters" }));
		await user.click(screen.getByRole("button", { name: "open-filters" }));

		expect(screen.getByTestId("status-filters")).toHaveTextContent("open");
	});

	it("should manage independent state per drawer key", async () => {
		const user = userEvent.setup();

		render(
			<DrawerProvider>
				<DrawerHarness drawerKey="navigation" />
				<DrawerHarness drawerKey="filters" />
			</DrawerProvider>,
		);

		await user.click(screen.getByRole("button", { name: "open-navigation" }));

		expect(screen.getByTestId("status-navigation")).toHaveTextContent("open");
		expect(screen.getByTestId("status-filters")).toHaveTextContent("closed");
	});

	it("should not affect other drawers when closing one", async () => {
		const user = userEvent.setup();

		render(
			<DrawerProvider>
				<DrawerHarness drawerKey="navigation" />
				<DrawerHarness drawerKey="filters" />
			</DrawerProvider>,
		);

		await user.click(screen.getByRole("button", { name: "open-navigation" }));
		await user.click(screen.getByRole("button", { name: "open-filters" }));

		await user.click(screen.getByRole("button", { name: "close-navigation" }));

		expect(screen.getByTestId("status-navigation")).toHaveTextContent("closed");
		expect(screen.getByTestId("status-filters")).toHaveTextContent("open");
	});

	it("should do nothing when closing a drawer that was never opened", async () => {
		const user = userEvent.setup();

		render(
			<DrawerProvider>
				<DrawerHarness drawerKey="navigation" />
			</DrawerProvider>,
		);

		await user.click(screen.getByRole("button", { name: "close-navigation" }));

		expect(screen.getByTestId("status-navigation")).toHaveTextContent("closed");
	});

	it("should support opening the same drawer twice without duplicating entries", async () => {
		const user = userEvent.setup();

		render(
			<DrawerProvider>
				<DrawerHarness drawerKey="navigation" openData={{ section: "main" }} />
			</DrawerProvider>,
		);

		await user.click(screen.getByRole("button", { name: "open-navigation" }));
		await user.click(screen.getByRole("button", { name: "open-navigation" }));

		expect(screen.getByTestId("status-navigation")).toHaveTextContent("open");
		expect(screen.getByTestId("data-navigation")).toHaveTextContent(
			JSON.stringify({ section: "main" }),
		);
	});

	it("should throw when useDrawer is used outside of a DrawerProvider", () => {
		function Consumer() {
			useDrawer("navigation");
			return null;
		}

		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});

		expect(() => render(<Consumer />)).toThrow(
			"useDrawer must be used within a Provider",
		);

		consoleErrorSpy.mockRestore();
	});
});
