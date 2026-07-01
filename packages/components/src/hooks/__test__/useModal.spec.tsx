import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
	type ModalContextProps,
	modalContext,
} from "../../providers/modalProvider";
import { useModal } from "../useModal";

function wrapperWithValue(value: ModalContextProps) {
	return ({ children }: { children: React.ReactNode }) => (
		<modalContext.Provider value={value}>{children}</modalContext.Provider>
	);
}

function createContextValue(overrides: Partial<ModalContextProps> = {}) {
	return {
		modalIsOpen: vi.fn().mockReturnValue(false),
		modalData: vi.fn().mockReturnValue(undefined),
		openModal: vi.fn(),
		closeModal: vi.fn(),
		closeAll: vi.fn(),
		...overrides,
	};
}

describe("useModal", () => {
	it("should throw when used outside of a ModalProvider", () => {
		let caught: unknown;

		try {
			renderHook(() => useModal());
		} catch (error) {
			caught = error;
		}

		expect(caught).toBeInstanceOf(Error);
		expect((caught as Error).message).toBe(
			"useModal must be used within a Provider",
		);
	});

	describe("without a key", () => {
		it("should return the raw context object untouched", () => {
			const value = createContextValue();

			const { result } = renderHook(() => useModal(), {
				wrapper: wrapperWithValue(value),
			});

			expect(result.current).toBe(value);
		});
	});

	describe("with a key", () => {
		it("should scope modalIsOpen to the given key", () => {
			const modalIsOpen = vi.fn().mockReturnValue(true);
			const value = createContextValue({ modalIsOpen });

			const { result } = renderHook(() => useModal("confirm-delete"), {
				wrapper: wrapperWithValue(value),
			});

			expect(result.current.modalIsOpen).toBe(true);
			expect(modalIsOpen).toHaveBeenCalledWith("confirm-delete");
		});

		it("should scope modalData to the given key", () => {
			const data = { id: 42 };
			const modalData = vi.fn().mockReturnValue(data);
			const value = createContextValue({ modalData });

			const { result } = renderHook(() => useModal("confirm-delete"), {
				wrapper: wrapperWithValue(value),
			});

			expect(result.current.modalData).toBe(data);
			expect(modalData).toHaveBeenCalledWith("confirm-delete");
		});

		it("should call the context openModal with the key and given data", () => {
			const openModal = vi.fn();
			const value = createContextValue({ openModal });

			const { result } = renderHook(() => useModal("confirm-delete"), {
				wrapper: wrapperWithValue(value),
			});

			result.current.openModal({ id: 7 });

			expect(openModal).toHaveBeenCalledWith("confirm-delete", { id: 7 });
		});

		it("should call the context openModal with undefined data when none is given", () => {
			const openModal = vi.fn();
			const value = createContextValue({ openModal });

			const { result } = renderHook(() => useModal("confirm-delete"), {
				wrapper: wrapperWithValue(value),
			});

			result.current.openModal();

			expect(openModal).toHaveBeenCalledWith("confirm-delete", undefined);
		});

		it("should call the context closeModal with the key", () => {
			const closeModal = vi.fn();
			const value = createContextValue({ closeModal });

			const { result } = renderHook(() => useModal("confirm-delete"), {
				wrapper: wrapperWithValue(value),
			});

			result.current.closeModal();

			expect(closeModal).toHaveBeenCalledWith("confirm-delete");
		});

		it("should scope independently per key", () => {
			const modalIsOpen = vi.fn((key: string) => key === "a");
			const value = createContextValue({ modalIsOpen });

			const a = renderHook(() => useModal("a"), {
				wrapper: wrapperWithValue(value),
			});
			const b = renderHook(() => useModal("b"), {
				wrapper: wrapperWithValue(value),
			});

			expect(a.result.current.modalIsOpen).toBe(true);
			expect(b.result.current.modalIsOpen).toBe(false);
		});
	});
});
