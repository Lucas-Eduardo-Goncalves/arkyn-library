import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useModal } from "../useModal";
import { useSearchAutomation } from "../useSearchAutomation";
import { useToast } from "../useToast";

vi.mock("../useModal", () => ({ useModal: vi.fn() }));
vi.mock("../useToast", () => ({ useToast: vi.fn() }));

describe("useSearchAutomation", () => {
	const closeAll = vi.fn();
	const showToast = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		// biome-ignore lint/suspicious/noExplicitAny: partial mock of the context return type
		vi.mocked(useModal).mockReturnValue({ closeAll } as any);
		// biome-ignore lint/suspicious/noExplicitAny: partial mock of the context return type
		vi.mocked(useToast).mockReturnValue({ showToast } as any);
	});

	it("should do nothing for an empty search string", () => {
		renderHook(() => useSearchAutomation(""));

		expect(closeAll).not.toHaveBeenCalled();
		expect(showToast).not.toHaveBeenCalled();
	});

	it("should close all modals when closeModal=true", () => {
		renderHook(() => useSearchAutomation("?closeModal=true"));

		expect(closeAll).toHaveBeenCalledTimes(1);
	});

	it("should not close modals when closeModal is absent", () => {
		renderHook(() => useSearchAutomation("?message=hi"));

		expect(closeAll).not.toHaveBeenCalled();
	});

	it("should show a success toast when type=success", () => {
		renderHook(() => useSearchAutomation("?message=Saved!&type=success"));

		expect(showToast).toHaveBeenCalledWith({
			message: "Saved!",
			type: "success",
		});
	});

	it("should show a danger toast when type=danger", () => {
		renderHook(() => useSearchAutomation("?message=Failed!&type=danger"));

		expect(showToast).toHaveBeenCalledWith({
			message: "Failed!",
			type: "danger",
		});
	});

	it("should not show a toast when message is absent", () => {
		renderHook(() => useSearchAutomation("?type=success"));

		expect(showToast).not.toHaveBeenCalled();
	});

	it("should show a danger toast based on a bad response name even without type", () => {
		renderHook(() =>
			useSearchAutomation("?message=Invalid+payload&name=BadRequest"),
		);

		expect(showToast).toHaveBeenCalledWith({
			message: "Invalid payload",
			type: "danger",
		});
	});

	it("should show a success toast based on a success response name even without type", () => {
		renderHook(() => useSearchAutomation("?message=Item+created&name=Created"));

		expect(showToast).toHaveBeenCalledWith({
			message: "Item created",
			type: "success",
		});
	});

	it("should not duplicate the toast when the message equals the bad response name itself", () => {
		renderHook(() =>
			useSearchAutomation("?message=BadRequest&name=BadRequest"),
		);

		expect(showToast).not.toHaveBeenCalled();
	});

	it("should not duplicate the toast when the message equals the success response name itself", () => {
		renderHook(() => useSearchAutomation("?message=Created&name=Created"));

		expect(showToast).not.toHaveBeenCalled();
	});

	it("should read params using the given scope prefix", () => {
		renderHook(() =>
			useSearchAutomation(
				"?filters:closeModal=true&filters:message=Applied!&filters:type=success",
				"filters",
			),
		);

		expect(closeAll).toHaveBeenCalledTimes(1);
		expect(showToast).toHaveBeenCalledWith({
			message: "Applied!",
			type: "success",
		});
	});

	it("should ignore unscoped params when a scope is provided", () => {
		renderHook(() =>
			useSearchAutomation(
				"?closeModal=true&message=hi&type=success",
				"filters",
			),
		);

		expect(closeAll).not.toHaveBeenCalled();
		expect(showToast).not.toHaveBeenCalled();
	});

	it("should re-run side effects when the search string changes between renders", () => {
		const { rerender } = renderHook(
			({ search }) => useSearchAutomation(search),
			{ initialProps: { search: "?message=First&type=success" } },
		);

		expect(showToast).toHaveBeenCalledWith({
			message: "First",
			type: "success",
		});

		rerender({ search: "?message=Second&type=success" });

		expect(showToast).toHaveBeenCalledWith({
			message: "Second",
			type: "success",
		});
		expect(showToast).toHaveBeenCalledTimes(2);
	});
});
