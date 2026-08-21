import { fireEvent, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useEscapeKey } from "../useEscapeKey";

describe("useEscapeKey", () => {
	it("should not call onEscape when isActive is false", () => {
		const onEscape = vi.fn();
		renderHook(() => useEscapeKey(false, onEscape));

		fireEvent.keyDown(document, { key: "Escape" });

		expect(onEscape).not.toHaveBeenCalled();
	});

	it("should call onEscape when Escape is pressed while active", () => {
		const onEscape = vi.fn();
		renderHook(() => useEscapeKey(true, onEscape));

		fireEvent.keyDown(document, { key: "Escape" });

		expect(onEscape).toHaveBeenCalledTimes(1);
	});

	it("should not call onEscape for other keys", () => {
		const onEscape = vi.fn();
		renderHook(() => useEscapeKey(true, onEscape));

		fireEvent.keyDown(document, { key: "Enter" });

		expect(onEscape).not.toHaveBeenCalled();
	});

	it("should stop listening once isActive becomes false", () => {
		const onEscape = vi.fn();
		const { rerender } = renderHook(
			({ isActive }) => useEscapeKey(isActive, onEscape),
			{ initialProps: { isActive: true } },
		);

		rerender({ isActive: false });
		fireEvent.keyDown(document, { key: "Escape" });

		expect(onEscape).not.toHaveBeenCalled();
	});

	it("should start listening again once isActive becomes true", () => {
		const onEscape = vi.fn();
		const { rerender } = renderHook(
			({ isActive }) => useEscapeKey(isActive, onEscape),
			{ initialProps: { isActive: false } },
		);

		rerender({ isActive: true });
		fireEvent.keyDown(document, { key: "Escape" });

		expect(onEscape).toHaveBeenCalledTimes(1);
	});

	it("should always invoke the latest onEscape callback without needing re-activation", () => {
		const firstCallback = vi.fn();
		const secondCallback = vi.fn();
		const { rerender } = renderHook(
			({ onEscape }) => useEscapeKey(true, onEscape),
			{ initialProps: { onEscape: firstCallback } },
		);

		rerender({ onEscape: secondCallback });
		fireEvent.keyDown(document, { key: "Escape" });

		expect(firstCallback).not.toHaveBeenCalled();
		expect(secondCallback).toHaveBeenCalledTimes(1);
	});

	it("should remove the listener on unmount", () => {
		const onEscape = vi.fn();
		const { unmount } = renderHook(() => useEscapeKey(true, onEscape));

		unmount();
		fireEvent.keyDown(document, { key: "Escape" });

		expect(onEscape).not.toHaveBeenCalled();
	});
});
