import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useScrollLock } from "../useScrollLock";

describe("useScrollLock", () => {
	afterEach(() => {
		document.body.style.overflow = "";
		document.body.style.paddingRight = "";
	});

	it("should not change body styles when isLocked is false", () => {
		renderHook(() => useScrollLock(false));

		expect(document.body.style.overflow).toBe("");
		expect(document.body.style.paddingRight).toBe("");
	});

	it("should set overflow to hidden when isLocked is true", () => {
		renderHook(() => useScrollLock(true));

		expect(document.body.style.overflow).toBe("hidden");
	});

	it("should compensate the scrollbar width with paddingRight", () => {
		renderHook(() => useScrollLock(true));

		expect(document.body.style.paddingRight).toMatch(/^\d+px$/);
	});

	it("should add on top of any pre-existing paddingRight", () => {
		document.body.style.paddingRight = "10px";

		renderHook(() => useScrollLock(true));

		const appliedPadding = parseInt(document.body.style.paddingRight, 10);
		expect(appliedPadding).toBeGreaterThanOrEqual(10);
	});

	it("should restore the original styles on unmount", () => {
		document.body.style.overflow = "auto";
		document.body.style.paddingRight = "4px";

		const { unmount } = renderHook(() => useScrollLock(true));
		unmount();

		expect(document.body.style.overflow).toBe("auto");
		expect(document.body.style.paddingRight).toBe("4px");
	});

	it("should restore the original styles when isLocked flips to false", () => {
		document.body.style.overflow = "auto";
		document.body.style.paddingRight = "4px";

		const { rerender } = renderHook(({ isLocked }) => useScrollLock(isLocked), {
			initialProps: { isLocked: true },
		});

		rerender({ isLocked: false });

		expect(document.body.style.overflow).toBe("auto");
		expect(document.body.style.paddingRight).toBe("4px");
	});

	it("should not throw when unmounted while isLocked is false", () => {
		const { unmount } = renderHook(() => useScrollLock(false));

		expect(() => unmount()).not.toThrow();
	});
});
