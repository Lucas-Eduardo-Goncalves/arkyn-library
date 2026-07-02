import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { useModal } from "../../hooks/useModal";
import { ModalProvider } from "../modalProvider";

afterEach(() => {
	cleanup();
});

type UserData = { id: number; name: string };

function KeyedModalHarness({ label = "delete" }: { label?: string }) {
	const { modalIsOpen, modalData, openModal, closeModal } =
		useModal<UserData>(label);

	return (
		<div data-testid={`harness-${label}`}>
			<span data-testid={`status-${label}`}>
				{modalIsOpen ? "open" : "closed"}
			</span>
			<span data-testid={`data-${label}`}>
				{modalData ? `${modalData.id}-${modalData.name}` : "no-data"}
			</span>
			<button type="button" onClick={() => openModal({ id: 1, name: "Ana" })}>
				Open {label}
			</button>
			<button type="button" onClick={() => closeModal()}>
				Close {label}
			</button>
		</div>
	);
}

function UnkeyedModalHarness() {
	const { modalIsOpen, modalData, openModal, closeModal, closeAll } =
		useModal<UserData>();

	return (
		<div data-testid="harness-unkeyed">
			<span data-testid="status-users">
				{modalIsOpen("users") ? "open" : "closed"}
			</span>
			<span data-testid="data-users">
				{(() => {
					const data = modalData("users");
					return data ? `${data.id}-${data.name}` : "no-data";
				})()}
			</span>
			<button
				type="button"
				onClick={() => openModal("users", { id: 2, name: "Bob" })}
			>
				Open users
			</button>
			<button type="button" onClick={() => closeModal("users")}>
				Close users
			</button>
			<button type="button" onClick={() => openModal("no-data-modal")}>
				Open no-data-modal
			</button>
			<button type="button" onClick={() => closeAll()}>
				Close all
			</button>
		</div>
	);
}

describe("ModalProvider", () => {
	it("should render children without errors", () => {
		render(
			<ModalProvider>
				<span>child content</span>
			</ModalProvider>,
		);

		expect(screen.getByText("child content")).toBeInTheDocument();
	});

	it("should render multiple children", () => {
		render(
			<ModalProvider>
				<span>first</span>
				<span>second</span>
			</ModalProvider>,
		);

		expect(screen.getByText("first")).toBeInTheDocument();
		expect(screen.getByText("second")).toBeInTheDocument();
	});

	it("should render string children", () => {
		render(<ModalProvider>plain text</ModalProvider>);

		expect(screen.getByText("plain text")).toBeInTheDocument();
	});

	it("should render nested component children", () => {
		function Child() {
			return <p>nested child</p>;
		}

		render(
			<ModalProvider>
				<Child />
			</ModalProvider>,
		);

		expect(screen.getByText("nested child")).toBeInTheDocument();
	});

	it("should start with modalIsOpen false and modalData undefined for a keyed modal", () => {
		render(
			<ModalProvider>
				<KeyedModalHarness />
			</ModalProvider>,
		);

		expect(screen.getByTestId("status-delete")).toHaveTextContent("closed");
		expect(screen.getByTestId("data-delete")).toHaveTextContent("no-data");
	});

	it("should open a keyed modal and expose its data when openModal is called", async () => {
		const user = userEvent.setup();

		render(
			<ModalProvider>
				<KeyedModalHarness />
			</ModalProvider>,
		);

		await user.click(screen.getByRole("button", { name: "Open delete" }));

		expect(screen.getByTestId("status-delete")).toHaveTextContent("open");
		expect(screen.getByTestId("data-delete")).toHaveTextContent("1-Ana");
	});

	it("should close a keyed modal and clear its data when closeModal is called", async () => {
		const user = userEvent.setup();

		render(
			<ModalProvider>
				<KeyedModalHarness />
			</ModalProvider>,
		);

		await user.click(screen.getByRole("button", { name: "Open delete" }));
		expect(screen.getByTestId("status-delete")).toHaveTextContent("open");

		await user.click(screen.getByRole("button", { name: "Close delete" }));

		expect(screen.getByTestId("status-delete")).toHaveTextContent("closed");
		expect(screen.getByTestId("data-delete")).toHaveTextContent("no-data");
	});

	it("should update the data of an already open modal when opened again with new data", async () => {
		const user = userEvent.setup();

		function Harness() {
			const { modalData, openModal } = useModal<UserData>("edit");

			return (
				<div>
					<span data-testid="edit-data">
						{modalData ? `${modalData.id}-${modalData.name}` : "no-data"}
					</span>
					<button
						type="button"
						onClick={() => openModal({ id: 1, name: "Ana" })}
					>
						Open first
					</button>
					<button
						type="button"
						onClick={() => openModal({ id: 2, name: "Bruno" })}
					>
						Open second
					</button>
				</div>
			);
		}

		render(
			<ModalProvider>
				<Harness />
			</ModalProvider>,
		);

		await user.click(screen.getByRole("button", { name: "Open first" }));
		expect(screen.getByTestId("edit-data")).toHaveTextContent("1-Ana");

		await user.click(screen.getByRole("button", { name: "Open second" }));
		expect(screen.getByTestId("edit-data")).toHaveTextContent("2-Bruno");
	});

	it("should open a modal without data using the unkeyed openModal signature", async () => {
		const user = userEvent.setup();

		function Reader() {
			const { modalIsOpen, modalData } = useModal<UserData>("no-data-modal");
			return (
				<span data-testid="no-data-modal-status">
					{modalIsOpen ? "open" : "closed"}-{modalData ? "has-data" : "no-data"}
				</span>
			);
		}

		render(
			<ModalProvider>
				<UnkeyedModalHarness />
				<Reader />
			</ModalProvider>,
		);

		expect(screen.getByTestId("no-data-modal-status")).toHaveTextContent(
			"closed-no-data",
		);

		await user.click(
			screen.getByRole("button", { name: "Open no-data-modal" }),
		);

		expect(screen.getByTestId("no-data-modal-status")).toHaveTextContent(
			"open-no-data",
		);
	});

	it("should manage state independently for different keys", async () => {
		const user = userEvent.setup();

		render(
			<ModalProvider>
				<KeyedModalHarness label="delete" />
				<KeyedModalHarness label="edit" />
			</ModalProvider>,
		);

		await user.click(screen.getByRole("button", { name: "Open delete" }));

		expect(screen.getByTestId("status-delete")).toHaveTextContent("open");
		expect(screen.getByTestId("status-edit")).toHaveTextContent("closed");
		expect(screen.getByTestId("data-edit")).toHaveTextContent("no-data");
	});

	it("should not affect other keys when closing one modal", async () => {
		const user = userEvent.setup();

		render(
			<ModalProvider>
				<KeyedModalHarness label="delete" />
				<KeyedModalHarness label="edit" />
			</ModalProvider>,
		);

		await user.click(screen.getByRole("button", { name: "Open delete" }));
		await user.click(screen.getByRole("button", { name: "Open edit" }));

		expect(screen.getByTestId("status-delete")).toHaveTextContent("open");
		expect(screen.getByTestId("status-edit")).toHaveTextContent("open");

		await user.click(screen.getByRole("button", { name: "Close delete" }));

		expect(screen.getByTestId("status-delete")).toHaveTextContent("closed");
		expect(screen.getByTestId("status-edit")).toHaveTextContent("open");
	});

	it("should use the unkeyed useModal form to open and read a named modal", async () => {
		const user = userEvent.setup();

		render(
			<ModalProvider>
				<UnkeyedModalHarness />
			</ModalProvider>,
		);

		expect(screen.getByTestId("status-users")).toHaveTextContent("closed");

		await user.click(screen.getByRole("button", { name: "Open users" }));

		expect(screen.getByTestId("status-users")).toHaveTextContent("open");
		expect(screen.getByTestId("data-users")).toHaveTextContent("2-Bob");
	});

	it("should close a modal opened via the unkeyed useModal form", async () => {
		const user = userEvent.setup();

		render(
			<ModalProvider>
				<UnkeyedModalHarness />
			</ModalProvider>,
		);

		await user.click(screen.getByRole("button", { name: "Open users" }));
		expect(screen.getByTestId("status-users")).toHaveTextContent("open");

		await user.click(screen.getByRole("button", { name: "Close users" }));

		expect(screen.getByTestId("status-users")).toHaveTextContent("closed");
		expect(screen.getByTestId("data-users")).toHaveTextContent("no-data");
	});

	it("should close every open modal when closeAll is called", async () => {
		const user = userEvent.setup();

		render(
			<ModalProvider>
				<KeyedModalHarness label="delete" />
				<KeyedModalHarness label="edit" />
				<UnkeyedModalHarness />
			</ModalProvider>,
		);

		await user.click(screen.getByRole("button", { name: "Open delete" }));
		await user.click(screen.getByRole("button", { name: "Open edit" }));
		await user.click(screen.getByRole("button", { name: "Open users" }));

		expect(screen.getByTestId("status-delete")).toHaveTextContent("open");
		expect(screen.getByTestId("status-edit")).toHaveTextContent("open");
		expect(screen.getByTestId("status-users")).toHaveTextContent("open");

		await user.click(screen.getByRole("button", { name: "Close all" }));

		expect(screen.getByTestId("status-delete")).toHaveTextContent("closed");
		expect(screen.getByTestId("status-edit")).toHaveTextContent("closed");
		expect(screen.getByTestId("status-users")).toHaveTextContent("closed");
	});

	it("should keep modalIsOpen false for a key that was never opened", () => {
		render(
			<ModalProvider>
				<KeyedModalHarness label="never-opened" />
			</ModalProvider>,
		);

		expect(screen.getByTestId("status-never-opened")).toHaveTextContent(
			"closed",
		);
	});

	it("should manage a real key of 'unnamed' independently from other keys", async () => {
		const user = userEvent.setup();

		render(
			<ModalProvider>
				<KeyedModalHarness label="unnamed" />
				<KeyedModalHarness label="delete" />
			</ModalProvider>,
		);

		expect(screen.getByTestId("status-unnamed")).toHaveTextContent("closed");

		await user.click(screen.getByRole("button", { name: "Open unnamed" }));

		expect(screen.getByTestId("status-unnamed")).toHaveTextContent("open");
		expect(screen.getByTestId("status-delete")).toHaveTextContent("closed");
	});

	it("should render without children provided as false without throwing", () => {
		expect(() => render(<ModalProvider>{false}</ModalProvider>)).not.toThrow();
	});

	it("should provide independent modal state across separate ModalProvider instances", async () => {
		const user = userEvent.setup();

		render(
			<div>
				<ModalProvider>
					<KeyedModalHarness label="provider-a" />
				</ModalProvider>
				<ModalProvider>
					<KeyedModalHarness label="provider-b" />
				</ModalProvider>
			</div>,
		);

		await user.click(screen.getByRole("button", { name: "Open provider-a" }));

		expect(screen.getByTestId("status-provider-a")).toHaveTextContent("open");
		expect(screen.getByTestId("status-provider-b")).toHaveTextContent("closed");
	});
});
