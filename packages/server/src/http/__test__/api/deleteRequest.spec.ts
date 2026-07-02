import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteRequest } from "../../api/_deleteRequest";
import { makeRequest } from "../../api/_makeRequest";

vi.mock("../../api/_makeRequest", () => ({
	makeRequest: vi.fn(),
}));

describe("deleteRequest", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("successful requests", () => {
		it("should call makeRequest with DELETE method", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource deleted successfully",
				response: {},
				cause: null,
			});

			await deleteRequest({
				url: "https://api.example.com/resource/1",
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "DELETE",
				url: "https://api.example.com/resource/1",
			});
		});

		it("should return success response from makeRequest", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource deleted successfully",
				response: { deleted: true },
				cause: null,
			});

			const result = await deleteRequest({
				url: "https://api.example.com/resource/1",
			});

			expect(result.success).toBe(true);
			expect(result.status).toBe(200);
			expect(result.message).toBe("Resource deleted successfully");
			expect(result.response).toEqual({ deleted: true });
		});

		it("should return 204 No Content response", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 204,
				message: "Resource deleted successfully",
				response: null,
				cause: null,
			});

			const result = await deleteRequest({
				url: "https://api.example.com/resource/1",
			});

			expect(result.success).toBe(true);
			expect(result.status).toBe(204);
			expect(result.response).toBeNull();
		});
	});

	describe("with headers", () => {
		it("should pass headers to makeRequest", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource deleted successfully",
				response: {},
				cause: null,
			});

			await deleteRequest({
				url: "https://api.example.com/resource/1",
				headers: { Authorization: "Bearer token123" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "DELETE",
				url: "https://api.example.com/resource/1",
				headers: { Authorization: "Bearer token123" },
			});
		});

		it("should pass multiple headers to makeRequest", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource deleted successfully",
				response: {},
				cause: null,
			});

			await deleteRequest({
				url: "https://api.example.com/resource/1",
				headers: {
					Authorization: "Bearer token123",
					"X-Custom-Header": "custom-value",
					Accept: "application/json",
				},
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "DELETE",
				url: "https://api.example.com/resource/1",
				headers: {
					Authorization: "Bearer token123",
					"X-Custom-Header": "custom-value",
					Accept: "application/json",
				},
			});
		});

		it("should use undefined as default headers when not provided", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource deleted successfully",
				response: {},
				cause: null,
			});

			await deleteRequest({
				url: "https://api.example.com/resource/1",
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "DELETE",
				url: "https://api.example.com/resource/1",
			});
		});
	});

	describe("with body", () => {
		it("should pass body to makeRequest", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource deleted successfully",
				response: {},
				cause: null,
			});

			await deleteRequest({
				url: "https://api.example.com/resource/1",
				body: { reason: "No longer needed" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "DELETE",
				url: "https://api.example.com/resource/1",
				urlParams: undefined,
				headers: undefined,
				body: { reason: "No longer needed" },
			});
		});

		it("should pass body with headers to makeRequest", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource deleted successfully",
				response: {},
				cause: null,
			});

			await deleteRequest({
				url: "https://api.example.com/resource/1",
				headers: { Authorization: "Bearer token123" },
				body: { ids: [1, 2, 3] },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "DELETE",
				url: "https://api.example.com/resource/1",
				urlParams: undefined,
				headers: { Authorization: "Bearer token123" },
				body: { ids: [1, 2, 3] },
			});
		});

		it("should handle complex body objects", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource deleted successfully",
				response: {},
				cause: null,
			});

			const complexBody = {
				reason: "Cleanup",
				metadata: { deletedBy: "admin", timestamp: "2026-02-05" },
				cascade: true,
			};

			await deleteRequest({
				url: "https://api.example.com/resource/1",
				body: complexBody,
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "DELETE",
				url: "https://api.example.com/resource/1",
				body: complexBody,
			});
		});
	});

	describe("failed requests", () => {
		it("should return failure response for 404 Not Found", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: false,
				status: 404,
				message: "Resource not found",
				response: null,
				cause: null,
			});

			const result = await deleteRequest({
				url: "https://api.example.com/resource/999",
			});

			expect(result.success).toBe(false);
			expect(result.status).toBe(404);
			expect(result.message).toBe("Resource not found");
		});

		it("should return failure response for 401 Unauthorized", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: false,
				status: 401,
				message: "Unauthorized",
				response: null,
				cause: null,
			});

			const result = await deleteRequest({
				url: "https://api.example.com/resource/1",
			});

			expect(result.success).toBe(false);
			expect(result.status).toBe(401);
		});

		it("should return failure response for 403 Forbidden", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: false,
				status: 403,
				message: "Forbidden",
				response: null,
				cause: null,
			});

			const result = await deleteRequest({
				url: "https://api.example.com/resource/1",
			});

			expect(result.success).toBe(false);
			expect(result.status).toBe(403);
		});

		it("should return failure response for 500 Server Error", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: false,
				status: 500,
				message: "Internal Server Error",
				response: null,
				cause: null,
			});

			const result = await deleteRequest({
				url: "https://api.example.com/resource/1",
			});

			expect(result.success).toBe(false);
			expect(result.status).toBe(500);
		});

		it("should include error cause when present", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: false,
				status: 500,
				message: "Internal Server Error",
				response: null,
				cause: "Database connection failed",
			});

			const result = await deleteRequest({
				url: "https://api.example.com/resource/1",
			});

			expect(result.cause).toBe("Database connection failed");
		});
	});

	describe("generic type support", () => {
		it("should support generic response type", async () => {
			interface DeleteResponse {
				deleted: boolean;
				deletedAt: string;
			}

			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource deleted successfully",
				response: { deleted: true, deletedAt: "2026-02-05T10:00:00Z" },
				cause: null,
			});

			const result = await deleteRequest<DeleteResponse>({
				url: "https://api.example.com/resource/1",
			});

			expect(result.success).toBe(true);
			expect(result.response.deleted).toBe(true);
			expect(result.response.deletedAt).toBe("2026-02-05T10:00:00Z");
		});
	});

	describe("URL handling", () => {
		it("should handle URLs with query parameters", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource deleted successfully",
				response: {},
				cause: null,
			});

			await deleteRequest({
				url: "https://api.example.com/resource?force=true",
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "DELETE",
				url: "https://api.example.com/resource?force=true",
			});
		});

		it("should handle URLs with path parameters", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource deleted successfully",
				response: {},
				cause: null,
			});

			await deleteRequest({
				url: "https://api.example.com/users/123/posts/456",
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "DELETE",
				url: "https://api.example.com/users/123/posts/456",
			});
		});
	});

	describe("with urlParams", () => {
		it("should pass single urlParam to makeRequest", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource deleted successfully",
				response: {},
				cause: null,
			});

			await deleteRequest({
				url: "https://api.example.com/resource/:id",
				urlParams: { id: "test-id" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "DELETE",
				url: "https://api.example.com/resource/:id",
				urlParams: { id: "test-id" },
				headers: undefined,
				body: undefined,
			});
		});

		it("should pass multiple urlParams to makeRequest", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource deleted successfully",
				response: {},
				cause: null,
			});

			await deleteRequest({
				url: "https://api.example.com/users/:userId/posts/:postId",
				urlParams: { userId: "123", postId: "456" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "DELETE",
				url: "https://api.example.com/users/:userId/posts/:postId",
				urlParams: { userId: "123", postId: "456" },
				headers: undefined,
				body: undefined,
			});
		});

		it("should pass urlParams with headers and body", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource deleted successfully",
				response: {},
				cause: null,
			});

			await deleteRequest({
				url: "https://api.example.com/resource/:id",
				urlParams: { id: "abc-123" },
				headers: { Authorization: "Bearer token" },
				body: { reason: "cleanup" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "DELETE",
				url: "https://api.example.com/resource/:id",
				urlParams: { id: "abc-123" },
				headers: { Authorization: "Bearer token" },
				body: { reason: "cleanup" },
			});
		});

		it("should handle empty urlParams object", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource deleted successfully",
				response: {},
				cause: null,
			});

			await deleteRequest({ url: "https://api.example.com/resource/static" });

			expect(makeRequest).toHaveBeenCalledWith({
				method: "DELETE",
				url: "https://api.example.com/resource/static",
			});
		});

		it("should handle urlParams with special characters", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource deleted successfully",
				response: {},
				cause: null,
			});

			await deleteRequest({
				url: "https://api.example.com/resource/:id",
				urlParams: { id: "special-id-@#$%" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "DELETE",
				url: "https://api.example.com/resource/:id",
				urlParams: { id: "special-id-@#$%" },
				headers: undefined,
				body: undefined,
			});
		});

		it("should handle urlParams with numeric string values", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource deleted successfully",
				response: {},
				cause: null,
			});

			await deleteRequest({
				url: "https://api.example.com/items/:itemId/versions/:version",
				urlParams: { itemId: "12345", version: "2" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "DELETE",
				url: "https://api.example.com/items/:itemId/versions/:version",
				urlParams: { itemId: "12345", version: "2" },
				headers: undefined,
				body: undefined,
			});
		});

		it("should handle urlParams with UUID values", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource deleted successfully",
				response: {},
				cause: null,
			});

			await deleteRequest({
				url: "https://api.example.com/resource/:uuid",
				urlParams: { uuid: "550e8400-e29b-41d4-a716-446655440000" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "DELETE",
				url: "https://api.example.com/resource/:uuid",
				urlParams: { uuid: "550e8400-e29b-41d4-a716-446655440000" },
				headers: undefined,
				body: undefined,
			});
		});
	});
});
