import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formContext } from "../../providers/formProvider";
import { useForm } from "../useForm";

describe("useForm", () => {
	it("should return the fieldErrors provided by the nearest context value", () => {
		const fieldErrors = { email: "Invalid email" };

		const { result } = renderHook(() => useForm(), {
			wrapper: ({ children }) => (
				<formContext.Provider value={{ fieldErrors }}>
					{children}
				</formContext.Provider>
			),
		});

		expect(result.current.fieldErrors).toBe(fieldErrors);
	});

	it("should reflect an empty fieldErrors object", () => {
		const { result } = renderHook(() => useForm(), {
			wrapper: ({ children }) => (
				<formContext.Provider value={{ fieldErrors: {} }}>
					{children}
				</formContext.Provider>
			),
		});

		expect(result.current.fieldErrors).toEqual({});
	});

	it("should not throw when used outside of a FormProvider", () => {
		expect(() => renderHook(() => useForm())).not.toThrow();
	});

	it("should return the default empty context when used outside a FormProvider", () => {
		const { result } = renderHook(() => useForm());

		expect(result.current.fieldErrors).toBeUndefined();
	});

	it("should reflect a different context value when re-mounted under a new provider", () => {
		const first = renderHook(() => useForm(), {
			wrapper: ({ children }) => (
				<formContext.Provider value={{ fieldErrors: { name: "Required" } }}>
					{children}
				</formContext.Provider>
			),
		});

		const second = renderHook(() => useForm(), {
			wrapper: ({ children }) => (
				<formContext.Provider value={{ fieldErrors: { name: "Too short" } }}>
					{children}
				</formContext.Provider>
			),
		});

		expect(first.result.current.fieldErrors).toEqual({ name: "Required" });
		expect(second.result.current.fieldErrors).toEqual({ name: "Too short" });
	});
});
