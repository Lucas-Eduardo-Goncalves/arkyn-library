import { beforeEach, describe, expect, it, vi } from "vitest";

import { makeRequest } from "../../api/_makeRequest";

vi.mock("../../..", () => ({
	flushDebugLogs: vi.fn(),
}));

vi.mock("../../api/_logRequest", () => ({
	logRequest: vi.fn(),
}));

vi.mock("../../services/logMapperService", () => ({
	LogMapperService: {
		handle: vi.fn().mockReturnValue({
			rawUrl: "https://api.example.com/data",
			status: 200,
			method: "GET",
			token: null,
			elapsedTime: 100,
			requestHeaders: {},
			requestBody: {},
			queryParams: {},
			responseHeaders: {},
			responseBody: {},
		}),
	},
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("makeRequest", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("successful requests", () => {
		it("should return success true for successful GET request", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({ data: "test" }),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "GET",
				url: "https://api.example.com/data",
			});

			expect(result.success).toBe(true);
			expect(result.status).toBe(200);
			expect(result.response).toEqual({ data: "test" });
		});

		it("should return success true for successful POST request", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 201,
				statusText: "Created",
				json: vi.fn().mockResolvedValue({ id: 1 }),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "POST",
				url: "https://api.example.com/data",
				body: { name: "test" },
			});

			expect(result.success).toBe(true);
			expect(result.status).toBe(201);
			expect(result.response).toEqual({ id: 1 });
		});

		it("should return success true for successful PUT request", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({ updated: true }),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "PUT",
				url: "https://api.example.com/data/1",
				body: { name: "updated" },
			});

			expect(result.success).toBe(true);
			expect(result.status).toBe(200);
		});

		it("should return success true for successful DELETE request", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({ deleted: true }),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "DELETE",
				url: "https://api.example.com/data/1",
			});

			expect(result.success).toBe(true);
			expect(result.status).toBe(200);
		});

		it("should return success true for successful PATCH request", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({ patched: true }),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "PATCH",
				url: "https://api.example.com/data/1",
				body: { field: "value" },
			});

			expect(result.success).toBe(true);
			expect(result.status).toBe(200);
		});
	});

	describe("success messages", () => {
		it("should return correct message for GET request", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "GET",
				url: "https://api.example.com/data",
			});

			expect(result.message).toBe("Request successful");
		});

		it("should return correct message for POST request", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 201,
				statusText: "Created",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "POST",
				url: "https://api.example.com/data",
			});

			expect(result.message).toBe("Resource created successfully");
		});

		it("should return correct message for PUT request", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "PUT",
				url: "https://api.example.com/data/1",
			});

			expect(result.message).toBe("Resource updated successfully");
		});

		it("should return correct message for DELETE request", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "DELETE",
				url: "https://api.example.com/data/1",
			});

			expect(result.message).toBe("Resource deleted successfully");
		});

		it("should return correct message for PATCH request", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "PATCH",
				url: "https://api.example.com/data/1",
			});

			expect(result.message).toBe("Resource patched successfully");
		});

		it("should use message from response if available", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({ message: "Custom success message" }),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "GET",
				url: "https://api.example.com/data",
			});

			expect(result.message).toBe("Custom success message");
		});
	});

	describe("failed requests", () => {
		it("should return success false for 400 Bad Request", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 400,
				statusText: "Bad Request",
				json: vi.fn().mockResolvedValue({ message: "Invalid input" }),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "POST",
				url: "https://api.example.com/data",
			});

			expect(result.success).toBe(false);
			expect(result.status).toBe(400);
			expect(result.message).toBe("Invalid input");
		});

		it("should return success false for 401 Unauthorized", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 401,
				statusText: "Unauthorized",
				json: vi.fn().mockResolvedValue({ message: "Authentication required" }),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "GET",
				url: "https://api.example.com/data",
			});

			expect(result.success).toBe(false);
			expect(result.status).toBe(401);
			expect(result.message).toBe("Authentication required");
		});

		it("should return success false for 403 Forbidden", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 403,
				statusText: "Forbidden",
				json: vi.fn().mockResolvedValue({ message: "Access denied" }),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "GET",
				url: "https://api.example.com/data",
			});

			expect(result.success).toBe(false);
			expect(result.status).toBe(403);
			expect(result.message).toBe("Access denied");
		});

		it("should return success false for 404 Not Found", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 404,
				statusText: "Not Found",
				json: vi.fn().mockResolvedValue({ message: "Resource not found" }),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "GET",
				url: "https://api.example.com/data/1",
			});

			expect(result.success).toBe(false);
			expect(result.status).toBe(404);
			expect(result.message).toBe("Resource not found");
		});

		it("should return success false for 500 Server Error", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 500,
				statusText: "Internal Server Error",
				json: vi.fn().mockResolvedValue({ message: "Server error occurred" }),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "GET",
				url: "https://api.example.com/data",
			});

			expect(result.success).toBe(false);
			expect(result.status).toBe(500);
			expect(result.message).toBe("Server error occurred");
		});

		it("should use statusText if no message in response", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 422,
				statusText: "Unprocessable Entity",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "POST",
				url: "https://api.example.com/data",
			});

			expect(result.success).toBe(false);
			expect(result.message).toBe("Unprocessable Entity");
		});

		it("should use default message if no message and no statusText", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 500,
				statusText: "",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "POST",
				url: "https://api.example.com/data",
			});

			expect(result.success).toBe(false);
			expect(result.message).toBe("Request failed");
		});

		it("should include response data on failure", async () => {
			const responseData = { errors: { name: "Required" }, code: "VALIDATION" };
			mockFetch.mockResolvedValue({
				ok: false,
				status: 400,
				statusText: "Bad Request",
				json: vi.fn().mockResolvedValue(responseData),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "POST",
				url: "https://api.example.com/data",
			});

			expect(result.success).toBe(false);
			expect(result.response).toEqual(responseData);
		});
	});

	describe("network errors", () => {
		it("should handle network errors gracefully", async () => {
			mockFetch.mockRejectedValue(new Error("Network error"));

			const result = await makeRequest({
				method: "GET",
				url: "https://api.example.com/data",
			});

			expect(result.success).toBe(false);
			expect(result.status).toBe(0);
			expect(result.message).toBe("Network error or request failed");
			expect(result.response).toBeNull();
			expect(result.cause).toBe("Network error");
		});

		it("should handle timeout errors", async () => {
			mockFetch.mockRejectedValue(new Error("Request timeout"));

			const result = await makeRequest({
				method: "GET",
				url: "https://api.example.com/data",
			});

			expect(result.success).toBe(false);
			expect(result.cause).toBe("Request timeout");
		});

		it("should handle non-Error thrown values", async () => {
			mockFetch.mockRejectedValue("String error");

			const result = await makeRequest({
				method: "GET",
				url: "https://api.example.com/data",
			});

			expect(result.success).toBe(false);
			expect(result.cause).toBe("String error");
		});

		it("should call flushDebugLogs on network error", async () => {
			const { flushDebugLogs } = await import("../../..");
			mockFetch.mockRejectedValue(new Error("Connection refused"));

			await makeRequest({
				method: "GET",
				url: "https://api.example.com/data",
			});

			expect(flushDebugLogs).toHaveBeenCalledWith({
				debugs: [expect.stringContaining("Network error or request failed:")],
				name: "MakeRequestError",
				scheme: "red",
			});
		});
	});

	describe("request configuration", () => {
		it("should call fetch with correct method", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			await makeRequest({
				method: "POST",
				url: "https://api.example.com/data",
			});

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/data",
				expect.objectContaining({ method: "POST" }),
			);
		});

		it("should include Content-Type header", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			await makeRequest({
				method: "GET",
				url: "https://api.example.com/data",
			});

			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.objectContaining({
						"Content-Type": "application/json",
					}),
				}),
			);
		});

		it("should merge custom headers with Content-Type", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			await makeRequest({
				method: "GET",
				url: "https://api.example.com/data",
				headers: {
					Authorization: "Bearer token123",
					"X-Custom-Header": "custom-value",
				},
			});

			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: {
						Authorization: "Bearer token123",
						"X-Custom-Header": "custom-value",
						"Content-Type": "application/json",
					},
				}),
			);
		});

		it("should stringify body when provided", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 201,
				statusText: "Created",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			const body = { name: "test", value: 123 };
			await makeRequest({
				method: "POST",
				url: "https://api.example.com/data",
				body,
			});

			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					body: JSON.stringify(body),
				}),
			);
		});

		it("should not include body when not provided", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			await makeRequest({
				method: "GET",
				url: "https://api.example.com/data",
			});

			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					body: undefined,
				}),
			);
		});

		it("should use empty headers object when not provided", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			await makeRequest({
				method: "GET",
				url: "https://api.example.com/data",
			});

			expect(mockFetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: { "Content-Type": "application/json" },
				}),
			);
		});
	});

	describe("response parsing", () => {
		it("should handle valid JSON response", async () => {
			const responseData = { id: 1, name: "test" };
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue(responseData),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "GET",
				url: "https://api.example.com/data",
			});

			expect(result.response).toEqual(responseData);
		});

		it("should handle invalid JSON response gracefully", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 204,
				statusText: "No Content",
				json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "DELETE",
				url: "https://api.example.com/data/1",
			});

			expect(result.success).toBe(true);
			expect(result.response).toBeNull();
		});

		it("should handle empty response body", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 204,
				statusText: "No Content",
				json: vi.fn().mockRejectedValue(new SyntaxError("Unexpected end")),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "DELETE",
				url: "https://api.example.com/data/1",
			});

			expect(result.success).toBe(true);
			expect(result.response).toBeNull();
		});
	});

	describe("logging", () => {
		it("should call logRequest after successful request", async () => {
			const { logRequest } = await import("../../api/_logRequest");
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			await makeRequest({
				method: "GET",
				url: "https://api.example.com/data",
			});

			expect(logRequest).toHaveBeenCalled();
		});

		it("should call logRequest after failed request", async () => {
			const { logRequest } = await import("../../api/_logRequest");
			mockFetch.mockResolvedValue({
				ok: false,
				status: 400,
				statusText: "Bad Request",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			await makeRequest({
				method: "POST",
				url: "https://api.example.com/data",
			});

			expect(logRequest).toHaveBeenCalled();
		});
	});

	describe("cause handling", () => {
		it("should set cause to null on successful request", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "GET",
				url: "https://api.example.com/data",
			});

			expect(result.cause).toBeNull();
		});

		it("should set cause to null on failed HTTP response", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 400,
				statusText: "Bad Request",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			const result = await makeRequest({
				method: "POST",
				url: "https://api.example.com/data",
			});

			expect(result.cause).toBeNull();
		});

		it("should set cause to error message on network error", async () => {
			mockFetch.mockRejectedValue(new Error("Connection refused"));

			const result = await makeRequest({
				method: "GET",
				url: "https://api.example.com/data",
			});

			expect(result.cause).toBe("Connection refused");
		});
	});

	describe("with urlParams", () => {
		it("should replace single url param in URL", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({ id: 123 }),
				headers: new Headers(),
			});

			await makeRequest({
				method: "GET",
				url: "https://api.example.com/users/:id",
				urlParams: { id: "123" },
			});

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/users/123",
				expect.any(Object),
			);
		});

		it("should replace multiple url params in URL", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			await makeRequest({
				method: "GET",
				url: "https://api.example.com/users/:userId/posts/:postId",
				urlParams: { userId: "123", postId: "456" },
			});

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/users/123/posts/456",
				expect.any(Object),
			);
		});

		it("should handle urlParams with special characters", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			await makeRequest({
				method: "DELETE",
				url: "https://api.example.com/resources/:id",
				urlParams: { id: "abc-123-xyz" },
			});

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/resources/abc-123-xyz",
				expect.any(Object),
			);
		});

		it("should handle urlParams with UUID values", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			await makeRequest({
				method: "GET",
				url: "https://api.example.com/items/:uuid",
				urlParams: { uuid: "550e8400-e29b-41d4-a716-446655440000" },
			});

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/items/550e8400-e29b-41d4-a716-446655440000",
				expect.any(Object),
			);
		});

		it("should handle urlParams with headers and body", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			await makeRequest({
				method: "PUT",
				url: "https://api.example.com/users/:id",
				urlParams: { id: "123" },
				headers: { Authorization: "Bearer token" },
				body: { name: "Updated Name" },
			});

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/users/123",
				expect.objectContaining({
					method: "PUT",
					headers: expect.objectContaining({
						Authorization: "Bearer token",
					}),
					body: JSON.stringify({ name: "Updated Name" }),
				}),
			);
		});

		it("should handle empty urlParams object", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			await makeRequest({
				method: "GET",
				url: "https://api.example.com/static/path",
				urlParams: {},
			});

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/static/path",
				expect.any(Object),
			);
		});

		it("should handle urlParams with numeric string values", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			await makeRequest({
				method: "GET",
				url: "https://api.example.com/items/:itemId/versions/:version",
				urlParams: { itemId: "12345", version: "2" },
			});

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/items/12345/versions/2",
				expect.any(Object),
			);
		});

		it("should replace all occurrences of the same param", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			await makeRequest({
				method: "GET",
				url: "https://api.example.com/:id/related/:id",
				urlParams: { id: "123" },
			});

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/123/related/123",
				expect.any(Object),
			);
		});

		it("should not modify URL when urlParams is undefined", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				statusText: "OK",
				json: vi.fn().mockResolvedValue({}),
				headers: new Headers(),
			});

			await makeRequest({
				method: "GET",
				url: "https://api.example.com/data",
			});

			expect(mockFetch).toHaveBeenCalledWith(
				"https://api.example.com/data",
				expect.any(Object),
			);
		});
	});
});
