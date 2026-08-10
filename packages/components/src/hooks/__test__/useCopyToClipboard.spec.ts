import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCopyToClipboard } from "../useCopyToClipboard";

describe("useCopyToClipboard", () => {
	const writeText = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		Object.assign(navigator, { clipboard: { writeText } });
		document.execCommand = vi.fn().mockReturnValue(true);
	});

	afterEach(() => {
		// biome-ignore lint/suspicious/noExplicitAny: cleaning up a test-only stub
		delete (navigator as any).clipboard;
	});

	it("should copy text using navigator.clipboard and resolve to true", async () => {
		writeText.mockResolvedValue(undefined);

		const { result } = renderHook(() => useCopyToClipboard());
		const success = await result.current.copyToClipboard("hello world");

		expect(writeText).toHaveBeenCalledWith("hello world");
		expect(success).toBe(true);
	});

	it("should fall back to document.execCommand when navigator.clipboard rejects", async () => {
		writeText.mockRejectedValue(new Error("insecure context"));

		const { result } = renderHook(() => useCopyToClipboard());
		const success = await result.current.copyToClipboard("hello world");

		expect(document.execCommand).toHaveBeenCalledWith("copy");
		expect(success).toBe(true);
	});

	it("should create and remove a temporary textarea when falling back", async () => {
		writeText.mockRejectedValue(new Error("insecure context"));
		const appendSpy = vi.spyOn(document.body, "appendChild");
		const removeSpy = vi.spyOn(document.body, "removeChild");

		const { result } = renderHook(() => useCopyToClipboard());
		await result.current.copyToClipboard("hello world");

		expect(appendSpy).toHaveBeenCalledWith(
			expect.objectContaining({ tagName: "TEXTAREA" }),
		);
		expect(removeSpy).toHaveBeenCalledWith(
			expect.objectContaining({ tagName: "TEXTAREA" }),
		);
	});

	it("should resolve to false when both clipboard and fallback fail", async () => {
		writeText.mockRejectedValue(new Error("insecure context"));
		document.execCommand = vi.fn().mockImplementation(() => {
			throw new Error("execCommand not supported");
		});

		const { result } = renderHook(() => useCopyToClipboard());
		const success = await result.current.copyToClipboard("hello world");

		expect(success).toBe(false);
	});

	it("should resolve to false when execCommand returns false", async () => {
		writeText.mockRejectedValue(new Error("insecure context"));
		document.execCommand = vi.fn().mockReturnValue(false);

		const { result } = renderHook(() => useCopyToClipboard());
		const success = await result.current.copyToClipboard("hello world");

		expect(success).toBe(false);
	});

	it("should remove the temporary textarea even when execCommand throws", async () => {
		writeText.mockRejectedValue(new Error("insecure context"));
		document.execCommand = vi.fn().mockImplementation(() => {
			throw new Error("execCommand not supported");
		});
		const removeSpy = vi.spyOn(document.body, "removeChild");

		const { result } = renderHook(() => useCopyToClipboard());
		await result.current.copyToClipboard("hello world");

		expect(removeSpy).toHaveBeenCalledWith(
			expect.objectContaining({ tagName: "TEXTAREA" }),
		);
	});

	it("should return a stable copyToClipboard reference shape across renders", () => {
		const { result, rerender } = renderHook(() => useCopyToClipboard());

		expect(typeof result.current.copyToClipboard).toBe("function");
		rerender();
		expect(typeof result.current.copyToClipboard).toBe("function");
	});
});
