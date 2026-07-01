import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
	type DrawerContextProps,
	drawerContext,
} from "../../providers/drawerProvider";
import { useDrawer } from "../useDrawer";

function wrapperWithValue(value: DrawerContextProps) {
	return ({ children }: { children: React.ReactNode }) => (
		<drawerContext.Provider value={value}>{children}</drawerContext.Provider>
	);
}

function createContextValue(overrides: Partial<DrawerContextProps> = {}) {
	return {
		drawerIsOpen: vi.fn().mockReturnValue(false),
		drawerData: vi.fn().mockReturnValue(undefined),
		openDrawer: vi.fn(),
		closeDrawer: vi.fn(),
		...overrides,
	};
}

describe("useDrawer", () => {
	it("should throw when used outside of a DrawerProvider", () => {
		let caught: unknown;

		try {
			renderHook(() => useDrawer());
		} catch (error) {
			caught = error;
		}

		expect(caught).toBeInstanceOf(Error);
		expect((caught as Error).message).toBe(
			"useDrawer must be used within a Provider",
		);
	});

	describe("without a key", () => {
		it("should return the raw context object untouched", () => {
			const value = createContextValue();

			const { result } = renderHook(() => useDrawer(), {
				wrapper: wrapperWithValue(value),
			});

			expect(result.current).toBe(value);
		});
	});

	describe("with a key", () => {
		it("should scope drawerIsOpen to the given key", () => {
			const drawerIsOpen = vi.fn().mockReturnValue(true);
			const value = createContextValue({ drawerIsOpen });

			const { result } = renderHook(() => useDrawer("navigation"), {
				wrapper: wrapperWithValue(value),
			});

			expect(result.current.drawerIsOpen).toBe(true);
			expect(drawerIsOpen).toHaveBeenCalledWith("navigation");
		});

		it("should scope drawerData to the given key", () => {
			const data = { section: "products" };
			const drawerData = vi.fn().mockReturnValue(data);
			const value = createContextValue({ drawerData });

			const { result } = renderHook(() => useDrawer("navigation"), {
				wrapper: wrapperWithValue(value),
			});

			expect(result.current.drawerData).toBe(data);
			expect(drawerData).toHaveBeenCalledWith("navigation");
		});

		it("should call the context openDrawer with the key and given data", () => {
			const openDrawer = vi.fn();
			const value = createContextValue({ openDrawer });

			const { result } = renderHook(() => useDrawer("navigation"), {
				wrapper: wrapperWithValue(value),
			});

			result.current.openDrawer({ section: "products" });

			expect(openDrawer).toHaveBeenCalledWith("navigation", {
				section: "products",
			});
		});

		it("should call the context openDrawer with undefined data when none is given", () => {
			const openDrawer = vi.fn();
			const value = createContextValue({ openDrawer });

			const { result } = renderHook(() => useDrawer("navigation"), {
				wrapper: wrapperWithValue(value),
			});

			result.current.openDrawer();

			expect(openDrawer).toHaveBeenCalledWith("navigation", undefined);
		});

		it("should call the context closeDrawer with the key", () => {
			const closeDrawer = vi.fn();
			const value = createContextValue({ closeDrawer });

			const { result } = renderHook(() => useDrawer("navigation"), {
				wrapper: wrapperWithValue(value),
			});

			result.current.closeDrawer();

			expect(closeDrawer).toHaveBeenCalledWith("navigation");
		});

		it("should scope independently per key", () => {
			const drawerIsOpen = vi.fn((key: string) => key === "a");
			const value = createContextValue({ drawerIsOpen });

			const a = renderHook(() => useDrawer("a"), {
				wrapper: wrapperWithValue(value),
			});
			const b = renderHook(() => useDrawer("b"), {
				wrapper: wrapperWithValue(value),
			});

			expect(a.result.current.drawerIsOpen).toBe(true);
			expect(b.result.current.drawerIsOpen).toBe(false);
		});
	});
});
