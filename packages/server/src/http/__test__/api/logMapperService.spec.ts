import { describe, expect, it } from "vitest";

import { LogMapperService } from "../../api/_logMapperService";

describe("LogMapperService", () => {
	describe("handle", () => {
		it("should map basic input properties correctly", () => {
			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/data",
				method: "GET",
				requestHeaders: {},
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 150,
				responseBody: { data: "test" },
				queryParams: new URLSearchParams(),
			});

			expect(result.rawUrl).toBe("https://api.example.com/data");
			expect(result.status).toBe(200);
			expect(result.method).toBe("GET");
			expect(result.elapsedTime).toBe(150);
			expect(result.token).toBeNull();
		});

		it("should return null for requestBody when undefined", () => {
			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/data",
				method: "GET",
				requestHeaders: {},
				responseHeaders: {},
				requestBody: undefined,
				elapsedTime: 100,
				responseBody: {},
				queryParams: new URLSearchParams(),
			});

			expect(result.requestBody).toBeNull();
		});

		it("should return null for responseBody when undefined", () => {
			const result = LogMapperService.handle({
				status: 204,
				rawUrl: "https://api.example.com/data",
				method: "DELETE",
				requestHeaders: {},
				responseHeaders: {},
				requestBody: {},
				elapsedTime: 100,
				responseBody: undefined,
				queryParams: new URLSearchParams(),
			});

			expect(result.responseBody).toBeNull();
		});

		it("should preserve requestBody when provided", () => {
			const requestBody = { name: "test", value: 123 };

			const result = LogMapperService.handle({
				status: 201,
				rawUrl: "https://api.example.com/data",
				method: "POST",
				requestHeaders: {},
				responseHeaders: {},
				requestBody,
				elapsedTime: 100,
				responseBody: {},
				queryParams: new URLSearchParams(),
			});

			expect(result.requestBody).toEqual(requestBody);
		});

		it("should preserve responseBody when provided", () => {
			const responseBody = { id: 1, name: "created" };

			const result = LogMapperService.handle({
				status: 201,
				rawUrl: "https://api.example.com/data",
				method: "POST",
				requestHeaders: {},
				responseHeaders: {},
				requestBody: {},
				elapsedTime: 100,
				responseBody,
				queryParams: new URLSearchParams(),
			});

			expect(result.responseBody).toEqual(responseBody);
		});

		it("should handle all HTTP methods", () => {
			const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;

			methods.forEach((method) => {
				const result = LogMapperService.handle({
					status: 200,
					rawUrl: "https://api.example.com/data",
					method,
					requestHeaders: {},
					responseHeaders: {},
					requestBody: null,
					elapsedTime: 100,
					responseBody: {},
					queryParams: new URLSearchParams(),
				});

				expect(result.method).toBe(method);
			});
		});

		it("should handle various status codes", () => {
			const statusCodes = [200, 201, 204, 400, 401, 403, 404, 500, 502, 503];

			statusCodes.forEach((status) => {
				const result = LogMapperService.handle({
					status,
					rawUrl: "https://api.example.com/data",
					method: "GET",
					requestHeaders: {},
					responseHeaders: {},
					requestBody: null,
					elapsedTime: 100,
					responseBody: {},
					queryParams: new URLSearchParams(),
				});

				expect(result.status).toBe(status);
			});
		});
	});

	describe("mapHeaders - Headers instance", () => {
		it("should map Headers instance to plain object", () => {
			const headers = new Headers({
				"Content-Type": "application/json",
				Authorization: "Bearer token123",
			});

			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/data",
				method: "GET",
				requestHeaders: headers,
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 100,
				responseBody: {},
				queryParams: new URLSearchParams(),
			});

			expect(result.requestHeaders["content-type"]).toBe("application/json");
			expect(result.requestHeaders.authorization).toBe("Bearer token123");
		});

		it("should map response Headers instance", () => {
			const responseHeaders = new Headers({
				"Content-Type": "application/json",
				"X-Request-Id": "req-123",
			});

			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/data",
				method: "GET",
				requestHeaders: {},
				responseHeaders,
				requestBody: null,
				elapsedTime: 100,
				responseBody: {},
				queryParams: new URLSearchParams(),
			});

			expect(result.responseHeaders["content-type"]).toBe("application/json");
			expect(result.responseHeaders["x-request-id"]).toBe("req-123");
		});

		it("should handle empty Headers instance", () => {
			const headers = new Headers();

			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/data",
				method: "GET",
				requestHeaders: headers,
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 100,
				responseBody: {},
				queryParams: new URLSearchParams(),
			});

			expect(result.requestHeaders).toEqual({});
		});
	});

	describe("mapHeaders - plain object", () => {
		it("should map plain object headers with string values", () => {
			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/data",
				method: "GET",
				requestHeaders: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 100,
				responseBody: {},
				queryParams: new URLSearchParams(),
			});

			expect(result.requestHeaders["Content-Type"]).toBe("application/json");
			expect(result.requestHeaders.Accept).toBe("application/json");
		});

		it("should join array header values with comma", () => {
			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/data",
				method: "GET",
				requestHeaders: {
					Accept: ["application/json", "text/plain"],
				} as unknown as HeadersInit,
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 100,
				responseBody: {},
				queryParams: new URLSearchParams(),
			});

			expect(result.requestHeaders.Accept).toBe("application/json, text/plain");
		});

		it("should stringify non-string, non-array header values", () => {
			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/data",
				method: "GET",
				requestHeaders: {
					"X-Custom": { nested: "value" },
				} as unknown as HeadersInit,
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 100,
				responseBody: {},
				queryParams: new URLSearchParams(),
			});

			expect(result.requestHeaders["X-Custom"]).toBe('{"nested":"value"}');
		});

		it("should handle empty plain object headers", () => {
			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/data",
				method: "GET",
				requestHeaders: {},
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 100,
				responseBody: {},
				queryParams: new URLSearchParams(),
			});

			expect(result.requestHeaders).toEqual({});
		});

		it("should handle multiple header types in same request", () => {
			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/data",
				method: "GET",
				requestHeaders: {
					"Content-Type": "application/json",
					"Accept-Encoding": ["gzip", "deflate"],
					"X-Metadata": { version: 1 },
				} as unknown as HeadersInit,
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 100,
				responseBody: {},
				queryParams: new URLSearchParams(),
			});

			expect(result.requestHeaders["Content-Type"]).toBe("application/json");
			expect(result.requestHeaders["Accept-Encoding"]).toBe("gzip, deflate");
			expect(result.requestHeaders["X-Metadata"]).toBe('{"version":1}');
		});
	});

	describe("mapQueryParams", () => {
		it("should map URLSearchParams to plain object", () => {
			const queryParams = new URLSearchParams({
				page: "1",
				limit: "10",
				sort: "desc",
			});

			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/data",
				method: "GET",
				requestHeaders: {},
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 100,
				responseBody: {},
				queryParams,
			});

			expect(result.queryParams).toEqual({
				page: "1",
				limit: "10",
				sort: "desc",
			});
		});

		it("should handle empty URLSearchParams", () => {
			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/data",
				method: "GET",
				requestHeaders: {},
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 100,
				responseBody: {},
				queryParams: new URLSearchParams(),
			});

			expect(result.queryParams).toEqual({});
		});

		it("should handle single query parameter", () => {
			const queryParams = new URLSearchParams({ id: "123" });

			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/data",
				method: "GET",
				requestHeaders: {},
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 100,
				responseBody: {},
				queryParams,
			});

			expect(result.queryParams).toEqual({ id: "123" });
		});

		it("should handle query params with special characters", () => {
			const queryParams = new URLSearchParams({
				search: "hello world",
				filter: "a&b",
				tag: "foo=bar",
			});

			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/data",
				method: "GET",
				requestHeaders: {},
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 100,
				responseBody: {},
				queryParams,
			});

			expect(result.queryParams.search).toBe("hello world");
			expect(result.queryParams.filter).toBe("a&b");
			expect(result.queryParams.tag).toBe("foo=bar");
		});

		it("should handle duplicate keys (takes last value)", () => {
			const queryParams = new URLSearchParams();
			queryParams.append("tag", "first");
			queryParams.append("tag", "second");

			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/data",
				method: "GET",
				requestHeaders: {},
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 100,
				responseBody: {},
				queryParams,
			});

			expect(result.queryParams.tag).toBe("second");
		});

		it("should handle empty string values", () => {
			const queryParams = new URLSearchParams({ empty: "" });

			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/data",
				method: "GET",
				requestHeaders: {},
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 100,
				responseBody: {},
				queryParams,
			});

			expect(result.queryParams.empty).toBe("");
		});
	});

	describe("token handling", () => {
		it("should always return null for token", () => {
			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/data",
				method: "GET",
				requestHeaders: {
					Authorization: "Bearer some-token",
				},
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 100,
				responseBody: {},
				queryParams: new URLSearchParams(),
			});

			expect(result.token).toBeNull();
		});
	});

	describe("complete mapping scenarios", () => {
		it("should map a complete POST request", () => {
			const requestHeaders = new Headers({
				"Content-Type": "application/json",
				Authorization: "Bearer token123",
			});

			const responseHeaders = new Headers({
				"Content-Type": "application/json",
				"X-Request-Id": "req-abc-123",
			});

			const result = LogMapperService.handle({
				status: 201,
				rawUrl: "https://api.example.com/users",
				method: "POST",
				requestHeaders,
				responseHeaders,
				requestBody: { name: "John", email: "john@example.com" },
				elapsedTime: 250,
				responseBody: { id: 1, name: "John", email: "john@example.com" },
				queryParams: new URLSearchParams(),
			});

			expect(result).toEqual({
				rawUrl: "https://api.example.com/users",
				status: 201,
				method: "POST",
				token: null,
				elapsedTime: 250,
				requestHeaders: {
					"content-type": "application/json",
					authorization: "Bearer token123",
				},
				requestBody: { name: "John", email: "john@example.com" },
				queryParams: {},
				responseHeaders: {
					"content-type": "application/json",
					"x-request-id": "req-abc-123",
				},
				responseBody: { id: 1, name: "John", email: "john@example.com" },
			});
		});

		it("should map a complete GET request with query params", () => {
			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/search?q=test&page=1",
				method: "GET",
				requestHeaders: { Accept: "application/json" },
				responseHeaders: { "Content-Type": "application/json" },
				requestBody: null,
				elapsedTime: 100,
				responseBody: { results: [], total: 0 },
				queryParams: new URLSearchParams({ q: "test", page: "1" }),
			});

			expect(result.rawUrl).toBe(
				"https://api.example.com/search?q=test&page=1",
			);
			expect(result.method).toBe("GET");
			expect(result.queryParams).toEqual({ q: "test", page: "1" });
			expect(result.requestBody).toBeNull();
		});

		it("should map a DELETE request with 204 response", () => {
			const result = LogMapperService.handle({
				status: 204,
				rawUrl: "https://api.example.com/resources/123",
				method: "DELETE",
				requestHeaders: { Authorization: "Bearer token" },
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 50,
				responseBody: null,
				queryParams: new URLSearchParams(),
			});

			expect(result.status).toBe(204);
			expect(result.method).toBe("DELETE");
			expect(result.requestBody).toBeNull();
			expect(result.responseBody).toBeNull();
		});

		it("should map a failed request", () => {
			const result = LogMapperService.handle({
				status: 400,
				rawUrl: "https://api.example.com/users",
				method: "POST",
				requestHeaders: { "Content-Type": "application/json" },
				responseHeaders: { "Content-Type": "application/json" },
				requestBody: { invalid: "data" },
				elapsedTime: 30,
				responseBody: {
					error: "Validation failed",
					fields: { name: "required" },
				},
				queryParams: new URLSearchParams(),
			});

			expect(result.status).toBe(400);
			expect(result.responseBody).toEqual({
				error: "Validation failed",
				fields: { name: "required" },
			});
		});
	});

	describe("edge cases", () => {
		it("should handle very long URLs", () => {
			const longUrl = `https://api.example.com/data?${"x".repeat(2000)}`;

			const result = LogMapperService.handle({
				status: 200,
				rawUrl: longUrl,
				method: "GET",
				requestHeaders: {},
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 100,
				responseBody: {},
				queryParams: new URLSearchParams(),
			});

			expect(result.rawUrl).toBe(longUrl);
		});

		it("should handle zero elapsed time", () => {
			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/data",
				method: "GET",
				requestHeaders: {},
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 0,
				responseBody: {},
				queryParams: new URLSearchParams(),
			});

			expect(result.elapsedTime).toBe(0);
		});

		it("should handle very large elapsed time", () => {
			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/data",
				method: "GET",
				requestHeaders: {},
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 999999,
				responseBody: {},
				queryParams: new URLSearchParams(),
			});

			expect(result.elapsedTime).toBe(999999);
		});

		it("should handle complex nested request body", () => {
			const complexBody = {
				user: {
					name: "John",
					addresses: [
						{ street: "123 Main St", city: "NYC" },
						{ street: "456 Oak Ave", city: "LA" },
					],
				},
				metadata: {
					version: 1,
					tags: ["important", "urgent"],
				},
			};

			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/data",
				method: "POST",
				requestHeaders: {},
				responseHeaders: {},
				requestBody: complexBody,
				elapsedTime: 100,
				responseBody: {},
				queryParams: new URLSearchParams(),
			});

			expect(result.requestBody).toEqual(complexBody);
		});

		it("should handle array response body", () => {
			const arrayResponse = [
				{ id: 1, name: "Item 1" },
				{ id: 2, name: "Item 2" },
			];

			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/items",
				method: "GET",
				requestHeaders: {},
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 100,
				responseBody: arrayResponse,
				queryParams: new URLSearchParams(),
			});

			expect(result.responseBody).toEqual(arrayResponse);
		});

		it("should handle primitive response body", () => {
			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/count",
				method: "GET",
				requestHeaders: {},
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 100,
				responseBody: 42,
				queryParams: new URLSearchParams(),
			});

			expect(result.responseBody).toBe(42);
		});

		it("should handle string response body", () => {
			const result = LogMapperService.handle({
				status: 200,
				rawUrl: "https://api.example.com/message",
				method: "GET",
				requestHeaders: {},
				responseHeaders: {},
				requestBody: null,
				elapsedTime: 100,
				responseBody: "Success message",
				queryParams: new URLSearchParams(),
			});

			expect(result.responseBody).toBe("Success message");
		});
	});
});
