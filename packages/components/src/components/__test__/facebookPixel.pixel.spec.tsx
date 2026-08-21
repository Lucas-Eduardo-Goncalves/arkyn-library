import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FacebookPixel } from "../facebookPixel/pixel";

describe("FacebookPixel (pixel.ts)", () => {
	let fbqMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		fbqMock = vi.fn();
		document.body.innerHTML = "<script></script>";
		window.fbq = fbqMock as unknown as typeof window.fbq;
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		// biome-ignore lint/suspicious/noExplicitAny: cleanup test globals
		delete (window as any).fbq;
		// biome-ignore lint/suspicious/noExplicitAny: cleanup test globals
		delete (window as any)._fbq;
	});

	it("should default autoConfig to true when options are omitted", () => {
		const pixel = new FacebookPixel("123456789012345");

		expect(pixel.autoConfig).toBe(true);
	});

	it("should default autoConfig to true when options.autoConfig is undefined", () => {
		const pixel = new FacebookPixel("123456789012345", { debug: true });

		expect(pixel.autoConfig).toBe(true);
	});

	it("should enable autoConfig when options.autoConfig is explicitly true", () => {
		const pixel = new FacebookPixel("123456789012345", { autoConfig: true });

		expect(pixel.autoConfig).toBe(true);
	});

	it("should disable autoConfig when options.autoConfig is explicitly false", () => {
		const pixel = new FacebookPixel("123456789012345", { autoConfig: false });

		expect(pixel.autoConfig).toBe(false);
	});

	it("should call fbq('init', ...) when autoConfig is omitted (default true)", () => {
		const pixel = new FacebookPixel("123456789012345");

		pixel.init();

		expect(fbqMock).toHaveBeenCalledWith("init", "123456789012345", {});
		expect(fbqMock).not.toHaveBeenCalledWith(
			"set",
			"autoConfig",
			false,
			expect.anything(),
		);
	});

	it("should call fbq('init', ...) when autoConfig is explicitly true", () => {
		const pixel = new FacebookPixel("123456789012345", { autoConfig: true });

		pixel.init();

		expect(fbqMock).toHaveBeenCalledWith("init", "123456789012345", {});
	});

	it("should call fbq('set', 'autoConfig', false, ...) when autoConfig is explicitly false", () => {
		const pixel = new FacebookPixel("123456789012345", { autoConfig: false });

		pixel.init();

		expect(fbqMock).toHaveBeenCalledWith(
			"set",
			"autoConfig",
			false,
			"123456789012345",
		);
		expect(fbqMock).not.toHaveBeenCalledWith(
			"init",
			expect.anything(),
			expect.anything(),
		);
	});
});
