import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { toastContext } from "../../providers/toastProvider";
import { useToast } from "../useToast";

function wrapperWithValue(value: { showToast: (...args: unknown[]) => void }) {
	return ({ children }: { children: React.ReactNode }) => (
		<toastContext.Provider value={value}>{children}</toastContext.Provider>
	);
}

describe("useToast", () => {
	it("should throw when used outside of a ToastProvider", () => {
		expect(() => renderHook(() => useToast())).toThrow(
			"useToast must be used within a Provider",
		);
	});

	it("should throw an Error instance with the exact expected message", () => {
		let caught: unknown;

		try {
			renderHook(() => useToast());
		} catch (error) {
			caught = error;
		}

		expect(caught).toBeInstanceOf(Error);
		expect((caught as Error).message).toBe(
			"useToast must be used within a Provider",
		);
	});

	it("should return the showToast function from the nearest context", () => {
		const showToast = vi.fn();

		const { result } = renderHook(() => useToast(), {
			wrapper: wrapperWithValue({ showToast }),
		});

		expect(result.current.showToast).toBe(showToast);
	});

	it("should forward calls to the underlying showToast implementation", () => {
		const showToast = vi.fn();

		const { result } = renderHook(() => useToast(), {
			wrapper: wrapperWithValue({ showToast }),
		});

		result.current.showToast({ message: "Saved!", type: "success" });

		expect(showToast).toHaveBeenCalledTimes(1);
		expect(showToast).toHaveBeenCalledWith({
			message: "Saved!",
			type: "success",
		});
	});
});
