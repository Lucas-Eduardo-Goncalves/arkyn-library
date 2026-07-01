import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useScopedParams } from "../useScopedParams";

describe("useScopedParams", () => {
	describe("getParam", () => {
		it("should read an unscoped param", () => {
			const { result } = renderHook(() => useScopedParams("?page=1"));

			expect(result.current.getParam("page")).toBe("1");
		});

		it("should return null when the param is absent", () => {
			const { result } = renderHook(() => useScopedParams("?page=1"));

			expect(result.current.getParam("sort")).toBeNull();
		});

		it("should return null for an empty search string", () => {
			const { result } = renderHook(() => useScopedParams(""));

			expect(result.current.getParam("page")).toBeNull();
		});

		it("should read a scoped param using the scope prefix", () => {
			const { result } = renderHook(() =>
				useScopedParams("?filters:status=active", "filters"),
			);

			expect(result.current.getParam("status")).toBe("active");
		});

		it("should not read an unscoped param when a scope is set", () => {
			const { result } = renderHook(() =>
				useScopedParams("?status=active", "filters"),
			);

			expect(result.current.getParam("status")).toBeNull();
		});

		it("should default the scope to an empty prefix", () => {
			const { result } = renderHook(() => useScopedParams("?page=2", ""));

			expect(result.current.getParam("page")).toBe("2");
		});
	});

	describe("getScopedSearch", () => {
		it("should build a query string from the given params", () => {
			const { result } = renderHook(() => useScopedParams(""));

			expect(result.current.getScopedSearch({ page: 2, sort: "name" })).toBe(
				"?page=2&sort=name",
			);
		});

		it("should merge new params into the existing search string", () => {
			const { result } = renderHook(() => useScopedParams("?page=1"));

			expect(result.current.getScopedSearch({ sort: "name" })).toBe(
				"?page=1&sort=name",
			);
		});

		it("should overwrite an existing param with the same key", () => {
			const { result } = renderHook(() => useScopedParams("?page=1"));

			expect(result.current.getScopedSearch({ page: 5 })).toBe("?page=5");
		});

		it("should remove a param when its value is undefined", () => {
			const { result } = renderHook(() => useScopedParams("?page=1&sort=name"));

			expect(result.current.getScopedSearch({ sort: undefined })).toBe(
				"?page=1",
			);
		});

		it("should return an empty string when no params remain", () => {
			const { result } = renderHook(() => useScopedParams("?page=1"));

			expect(result.current.getScopedSearch({ page: undefined })).toBe("");
		});

		it("should namespace every key with the scope prefix", () => {
			const { result } = renderHook(() => useScopedParams("", "filters"));

			expect(result.current.getScopedSearch({ status: "active" })).toBe(
				"?filters%3Astatus=active",
			);
		});

		it("should coerce boolean and number values to strings", () => {
			const { result } = renderHook(() => useScopedParams(""));

			expect(
				result.current.getScopedSearch({ closeModal: true, page: 3 }),
			).toBe("?closeModal=true&page=3");
		});

		it("should not mutate the params object passed in", () => {
			const { result } = renderHook(() => useScopedParams(""));
			const params = { page: 1 };

			result.current.getScopedSearch(params);

			expect(params).toEqual({ page: 1 });
		});
	});
});
