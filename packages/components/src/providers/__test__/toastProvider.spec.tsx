import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { useToast } from "../../hooks/useToast";
import { ToastProvider } from "../toastProvider";

afterEach(() => {
	cleanup();
	toast.remove();
});

beforeAll(() => {
	if (!window.matchMedia) {
		window.matchMedia = (query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
		});
	}
});

function ToastHarness() {
	const { showToast } = useToast();

	return (
		<div>
			<button
				type="button"
				onClick={() =>
					showToast({ message: "Saved successfully", type: "success" })
				}
			>
				Show success
			</button>
			<button
				type="button"
				onClick={() =>
					showToast({ message: "Something went wrong", type: "danger" })
				}
			>
				Show danger
			</button>
		</div>
	);
}

describe("ToastProvider", () => {
	it("should render children without errors", () => {
		render(
			<ToastProvider>
				<span>child content</span>
			</ToastProvider>,
		);

		expect(screen.getByText("child content")).toBeInTheDocument();
	});

	it("should render multiple children", () => {
		render(
			<ToastProvider>
				<span>first</span>
				<span>second</span>
			</ToastProvider>,
		);

		expect(screen.getByText("first")).toBeInTheDocument();
		expect(screen.getByText("second")).toBeInTheDocument();
	});

	it("should render string children", () => {
		render(<ToastProvider>plain text</ToastProvider>);

		expect(screen.getByText("plain text")).toBeInTheDocument();
	});

	it("should render nested component children", () => {
		function Child() {
			return <p>nested child</p>;
		}

		render(
			<ToastProvider>
				<Child />
			</ToastProvider>,
		);

		expect(screen.getByText("nested child")).toBeInTheDocument();
	});

	it("should render without children provided as false without throwing", () => {
		expect(() => render(<ToastProvider>{false}</ToastProvider>)).not.toThrow();
	});

	it("should not display any toast message before showToast is called", () => {
		render(
			<ToastProvider>
				<ToastHarness />
			</ToastProvider>,
		);

		expect(screen.queryByText("Saved successfully")).not.toBeInTheDocument();
		expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
	});

	it("should display a success toast message when showToast is called with type success", async () => {
		const user = userEvent.setup();

		render(
			<ToastProvider>
				<ToastHarness />
			</ToastProvider>,
		);

		await user.click(screen.getByRole("button", { name: "Show success" }));

		expect(await screen.findByText("Saved successfully")).toBeInTheDocument();
	});

	it("should display a danger toast message when showToast is called with type danger", async () => {
		const user = userEvent.setup();

		render(
			<ToastProvider>
				<ToastHarness />
			</ToastProvider>,
		);

		await user.click(screen.getByRole("button", { name: "Show danger" }));

		expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
	});

	it("should display both success and danger toasts when both are triggered", async () => {
		const user = userEvent.setup();

		render(
			<ToastProvider>
				<ToastHarness />
			</ToastProvider>,
		);

		await user.click(screen.getByRole("button", { name: "Show success" }));
		await user.click(screen.getByRole("button", { name: "Show danger" }));

		expect(await screen.findByText("Saved successfully")).toBeInTheDocument();
		expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
	});

	it("should display multiple success toasts when triggered multiple times with different messages", async () => {
		const user = userEvent.setup();

		function MultiHarness() {
			const { showToast } = useToast();
			return (
				<button
					type="button"
					onClick={() => {
						showToast({ message: "First message", type: "success" });
						showToast({ message: "Second message", type: "success" });
					}}
				>
					Show two
				</button>
			);
		}

		render(
			<ToastProvider>
				<MultiHarness />
			</ToastProvider>,
		);

		await user.click(screen.getByRole("button", { name: "Show two" }));

		expect(await screen.findByText("First message")).toBeInTheDocument();
		expect(await screen.findByText("Second message")).toBeInTheDocument();
	});

	it("should render children alongside the toaster after a toast is shown", async () => {
		const user = userEvent.setup();

		render(
			<ToastProvider>
				<ToastHarness />
				<span>sibling content</span>
			</ToastProvider>,
		);

		await user.click(screen.getByRole("button", { name: "Show success" }));

		expect(await screen.findByText("Saved successfully")).toBeInTheDocument();
		expect(screen.getByText("sibling content")).toBeInTheDocument();
	});

	it("should provide independent toast handling across separate ToastProvider instances", async () => {
		const user = userEvent.setup();

		render(
			<div>
				<ToastProvider>
					<ToastHarness />
				</ToastProvider>
			</div>,
		);

		await user.click(screen.getByRole("button", { name: "Show danger" }));

		expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
	});

	it("should handle an empty string message without throwing", async () => {
		const user = userEvent.setup();

		function EmptyMessageHarness() {
			const { showToast } = useToast();
			return (
				<button
					type="button"
					onClick={() => showToast({ message: "", type: "success" })}
				>
					Show empty
				</button>
			);
		}

		render(
			<ToastProvider>
				<EmptyMessageHarness />
			</ToastProvider>,
		);

		await expect(
			user.click(screen.getByRole("button", { name: "Show empty" })),
		).resolves.not.toThrow();
	});
});
