import { describe, expect, it } from "vitest";
import { getScopedParams } from "../getScopedParams";

function createMockRequest(url: string): Request {
	return new Request(url);
}

describe("getScopedParams", () => {
	describe("without scope", () => {
		it("should return all query parameters when no scope is provided", () => {
			const request = createMockRequest(
				"https://example.com?key1=value1&key2=value2",
			);

			const result = getScopedParams(request);

			expect(result.get("key1")).toBe("value1");
			expect(result.get("key2")).toBe("value2");
		});

		it("should return all query parameters when scope is empty string", () => {
			const request = createMockRequest("https://example.com?name=John&age=30");

			const result = getScopedParams(request, "");

			expect(result.get("name")).toBe("John");
			expect(result.get("age")).toBe("30");
		});

		it("should return empty URLSearchParams for URL without query parameters", () => {
			const request = createMockRequest("https://example.com");

			const result = getScopedParams(request);

			expect(result.toString()).toBe("");
		});
	});

	describe("with scope", () => {
		it("should return only scoped parameters", () => {
			const request = createMockRequest(
				"https://example.com?scope:key1=value1&scope:key2=value2&key3=value3",
			);

			const result = getScopedParams(request, "scope");

			expect(result.get("key1")).toBe("value1");
			expect(result.get("key2")).toBe("value2");
			expect(result.get("key3")).toBeNull();
		});

		it("should remove scope prefix from parameter keys", () => {
			const request = createMockRequest(
				"https://example.com?filter:name=John&filter:age=30",
			);

			const result = getScopedParams(request, "filter");

			expect(result.has("filter:name")).toBe(false);
			expect(result.has("filter:age")).toBe(false);
			expect(result.get("name")).toBe("John");
			expect(result.get("age")).toBe("30");
		});

		it("should return empty URLSearchParams when no parameters match the scope", () => {
			const request = createMockRequest(
				"https://example.com?other:key1=value1&key2=value2",
			);

			const result = getScopedParams(request, "scope");

			expect(result.toString()).toBe("");
		});

		it("should handle multiple scopes in URL and filter correctly", () => {
			const request = createMockRequest(
				"https://example.com?user:name=John&admin:role=manager&user:age=30",
			);

			const result = getScopedParams(request, "user");

			expect(result.get("name")).toBe("John");
			expect(result.get("age")).toBe("30");
			expect(result.get("role")).toBeNull();
		});
	});

	describe("edge cases", () => {
		it("should handle encoded URL parameters", () => {
			const request = createMockRequest(
				"https://example.com?scope:key=hello%20world",
			);

			const result = getScopedParams(request, "scope");

			expect(result.get("key")).toBe("hello world");
		});

		it("should handle empty parameter values", () => {
			const request = createMockRequest(
				"https://example.com?scope:key1=&scope:key2=value",
			);

			const result = getScopedParams(request, "scope");

			expect(result.get("key1")).toBe("");
			expect(result.get("key2")).toBe("value");
		});

		it("should handle parameters with special characters in values", () => {
			const request = createMockRequest(
				"https://example.com?scope:email=test%40example.com",
			);

			const result = getScopedParams(request, "scope");

			expect(result.get("email")).toBe("test@example.com");
		});

		it("should handle scope with special characters", () => {
			const request = createMockRequest(
				"https://example.com?my-scope:key=value",
			);

			const result = getScopedParams(request, "my-scope");

			expect(result.get("key")).toBe("value");
		});

		it("should not match partial scope prefixes", () => {
			const request = createMockRequest(
				"https://example.com?scoped:key=value&scope:other=test",
			);

			const result = getScopedParams(request, "scope");

			expect(result.get("other")).toBe("test");
			expect(result.get("d:key")).toBeNull();
			expect(result.get("key")).toBeNull();
		});

		it("should handle duplicate scoped keys", () => {
			const request = createMockRequest(
				"https://example.com?scope:key=value1&scope:key=value2",
			);

			const result = getScopedParams(request, "scope");

			expect(result.getAll("key")).toEqual(["value1", "value2"]);
		});

		it("should handle keys with colons in the value part", () => {
			const request = createMockRequest(
				"https://example.com?scope:time=12:30:00",
			);

			const result = getScopedParams(request, "scope");

			expect(result.get("time")).toBe("12:30:00");
		});

		it("should handle numeric scope", () => {
			const request = createMockRequest("https://example.com?123:key=value");

			const result = getScopedParams(request, "123");

			expect(result.get("key")).toBe("value");
		});
	});

	describe("real-world scenarios", () => {
		it("should filter pagination parameters", () => {
			const request = createMockRequest(
				"https://example.com?pagination:page=1&pagination:limit=10&search=test",
			);

			const result = getScopedParams(request, "pagination");

			expect(result.get("page")).toBe("1");
			expect(result.get("limit")).toBe("10");
			expect(result.get("search")).toBeNull();
		});

		it("should filter filter parameters in a search endpoint", () => {
			const request = createMockRequest(
				"https://example.com/search?filter:status=active&filter:category=tech&sort=date",
			);

			const result = getScopedParams(request, "filter");

			expect(result.get("status")).toBe("active");
			expect(result.get("category")).toBe("tech");
			expect(result.get("sort")).toBeNull();
		});
	});
});
