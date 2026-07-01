import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useHydrated } from "../useHydrated";

describe("useHydrated", () => {
	it("should return true once mounted on the client", () => {
		const { result } = renderHook(() => useHydrated());
		expect(result.current).toBe(true);
	});

	it("should return a boolean value", () => {
		const { result } = renderHook(() => useHydrated());
		expect(typeof result.current).toBe("boolean");
	});

	it("should keep returning true across re-renders", () => {
		const { result, rerender } = renderHook(() => useHydrated());

		expect(result.current).toBe(true);
		rerender();
		expect(result.current).toBe(true);
	});

	it("should return the same value on every call for independent instances", () => {
		const first = renderHook(() => useHydrated());
		const second = renderHook(() => useHydrated());

		expect(first.result.current).toBe(second.result.current);
	});
});
