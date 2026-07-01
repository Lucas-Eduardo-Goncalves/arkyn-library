import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useSlider } from "../useSlider";

describe("useSlider", () => {
	describe("initial value", () => {
		it("should default to 0 when no defaultValue is provided", () => {
			const { result } = renderHook(() => useSlider());
			const [value] = result.current;

			expect(value).toBe(0);
		});

		it("should use the provided defaultValue when within range", () => {
			const { result } = renderHook(() => useSlider(42));
			const [value] = result.current;

			expect(value).toBe(42);
		});

		it("should clamp a negative defaultValue to 0", () => {
			const { result } = renderHook(() => useSlider(-10));
			const [value] = result.current;

			expect(value).toBe(0);
		});

		it("should clamp a defaultValue above 100 to 100", () => {
			const { result } = renderHook(() => useSlider(250));
			const [value] = result.current;

			expect(value).toBe(100);
		});

		it("should accept the boundary value 0", () => {
			const { result } = renderHook(() => useSlider(0));
			const [value] = result.current;

			expect(value).toBe(0);
		});

		it("should accept the boundary value 100", () => {
			const { result } = renderHook(() => useSlider(100));
			const [value] = result.current;

			expect(value).toBe(100);
		});
	});

	describe("changeSliderValue", () => {
		it("should update the value within range", () => {
			const { result } = renderHook(() => useSlider(0));

			act(() => {
				const [, setValue] = result.current;
				setValue(55);
			});

			const [value] = result.current;
			expect(value).toBe(55);
		});

		it("should clamp negative updates to 0", () => {
			const { result } = renderHook(() => useSlider(50));

			act(() => {
				const [, setValue] = result.current;
				setValue(-30);
			});

			const [value] = result.current;
			expect(value).toBe(0);
		});

		it("should clamp updates above 100 to 100", () => {
			const { result } = renderHook(() => useSlider(50));

			act(() => {
				const [, setValue] = result.current;
				setValue(999);
			});

			const [value] = result.current;
			expect(value).toBe(100);
		});

		it("should accept the boundary value 0", () => {
			const { result } = renderHook(() => useSlider(50));

			act(() => {
				const [, setValue] = result.current;
				setValue(0);
			});

			const [value] = result.current;
			expect(value).toBe(0);
		});

		it("should accept the boundary value 100", () => {
			const { result } = renderHook(() => useSlider(50));

			act(() => {
				const [, setValue] = result.current;
				setValue(100);
			});

			const [value] = result.current;
			expect(value).toBe(100);
		});

		it("should return a stable tuple shape [value, setValue]", () => {
			const { result } = renderHook(() => useSlider());

			expect(Array.isArray(result.current)).toBe(true);
			expect(result.current).toHaveLength(2);
			expect(typeof result.current[0]).toBe("number");
			expect(typeof result.current[1]).toBe("function");
		});
	});
});
