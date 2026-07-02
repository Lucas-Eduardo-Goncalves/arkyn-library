import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeRequest } from "../../api/_makeRequest";
import { patchRequest } from "../../api/_patchRequest";

vi.mock("../../api/_makeRequest", () => ({
	makeRequest: vi.fn(),
}));

describe("patchRequest", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("successful requests", () => {
		it("should call makeRequest with PATCH method", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource updated successfully",
				response: {},
				cause: null,
			});

			await patchRequest({
				url: "https://api.example.com/resource/1",
				body: { name: "Updated" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "PATCH",
				url: "https://api.example.com/resource/1",
				urlParams: undefined,
				headers: undefined,
				body: { name: "Updated" },
			});
		});

		it("should return success response from makeRequest", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource updated successfully",
				response: { id: 1, name: "Updated" },
				cause: null,
			});

			const result = await patchRequest({
				url: "https://api.example.com/resource/1",
				body: { name: "Updated" },
			});

			expect(result.success).toBe(true);
			expect(result.status).toBe(200);
			expect(result.message).toBe("Resource updated successfully");
			expect(result.response).toEqual({ id: 1, name: "Updated" });
		});

		it("should return 204 No Content response", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 204,
				message: "Resource updated successfully",
				response: null,
				cause: null,
			});

			const result = await patchRequest({
				url: "https://api.example.com/resource/1",
				body: { status: "active" },
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
				message: "Resource updated successfully",
				response: {},
				cause: null,
			});

			await patchRequest({
				url: "https://api.example.com/resource/1",
				headers: { Authorization: "Bearer token123" },
				body: { name: "Updated" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "PATCH",
				url: "https://api.example.com/resource/1",
				urlParams: undefined,
				headers: { Authorization: "Bearer token123" },
				body: { name: "Updated" },
			});
		});

		it("should pass multiple headers to makeRequest", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource updated successfully",
				response: {},
				cause: null,
			});

			await patchRequest({
				url: "https://api.example.com/resource/1",
				headers: {
					Authorization: "Bearer token123",
					"X-Custom-Header": "custom-value",
					Accept: "application/json",
				},
				body: { name: "Updated" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "PATCH",
				url: "https://api.example.com/resource/1",
				urlParams: undefined,
				headers: {
					Authorization: "Bearer token123",
					"X-Custom-Header": "custom-value",
					Accept: "application/json",
				},
				body: { name: "Updated" },
			});
		});

		it("should use undefined as default headers when not provided", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource updated successfully",
				response: {},
				cause: null,
			});

			await patchRequest({
				url: "https://api.example.com/resource/1",
				body: { name: "Updated" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "PATCH",
				url: "https://api.example.com/resource/1",
				urlParams: undefined,
				headers: undefined,
				body: { name: "Updated" },
			});
		});

		it("should pass If-Match header for conditional updates", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource updated successfully",
				response: {},
				cause: null,
			});

			await patchRequest({
				url: "https://api.example.com/resource/1",
				headers: { "If-Match": '"etag123"' },
				body: { name: "Updated" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "PATCH",
				url: "https://api.example.com/resource/1",
				urlParams: undefined,
				headers: { "If-Match": '"etag123"' },
				body: { name: "Updated" },
			});
		});
	});

	describe("with body", () => {
		it("should pass simple body to makeRequest", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource updated successfully",
				response: {},
				cause: null,
			});

			await patchRequest({
				url: "https://api.example.com/resource/1",
				body: { status: "active" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "PATCH",
				url: "https://api.example.com/resource/1",
				urlParams: undefined,
				headers: undefined,
				body: { status: "active" },
			});
		});

		it("should handle complex body objects", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource updated successfully",
				response: {},
				cause: null,
			});

			const complexBody = {
				name: "Updated Name",
				metadata: { version: 2, updatedBy: "admin" },
				tags: ["tag1", "tag2"],
			};

			await patchRequest({
				url: "https://api.example.com/resource/1",
				body: complexBody,
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "PATCH",
				url: "https://api.example.com/resource/1",
				urlParams: undefined,
				headers: undefined,
				body: complexBody,
			});
		});

		it("should handle partial update with single field", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource updated successfully",
				response: { id: 1, email: "new@example.com" },
				cause: null,
			});

			await patchRequest({
				url: "https://api.example.com/users/1",
				body: { email: "new@example.com" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "PATCH",
				url: "https://api.example.com/users/1",
				urlParams: undefined,
				headers: undefined,
				body: { email: "new@example.com" },
			});
		});

		it("should handle null values in body", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource updated successfully",
				response: {},
				cause: null,
			});

			await patchRequest({
				url: "https://api.example.com/resource/1",
				body: { description: null },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "PATCH",
				url: "https://api.example.com/resource/1",
				urlParams: undefined,
				headers: undefined,
				body: { description: null },
			});
		});

		it("should handle array body", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resources updated successfully",
				response: {},
				cause: null,
			});

			await patchRequest({
				url: "https://api.example.com/resources",
				body: [
					{ id: 1, status: "active" },
					{ id: 2, status: "inactive" },
				],
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "PATCH",
				url: "https://api.example.com/resources",
				urlParams: undefined,
				headers: undefined,
				body: [
					{ id: 1, status: "active" },
					{ id: 2, status: "inactive" },
				],
			});
		});
	});

	describe("failed requests", () => {
		it("should return failure response for 400 Bad Request", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: false,
				status: 400,
				message: "Invalid request body",
				response: null,
				cause: null,
			});

			const result = await patchRequest({
				url: "https://api.example.com/resource/1",
				body: { invalid: "data" },
			});

			expect(result.success).toBe(false);
			expect(result.status).toBe(400);
			expect(result.message).toBe("Invalid request body");
		});

		it("should return failure response for 404 Not Found", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: false,
				status: 404,
				message: "Resource not found",
				response: null,
				cause: null,
			});

			const result = await patchRequest({
				url: "https://api.example.com/resource/999",
				body: { name: "Updated" },
			});

			expect(result.success).toBe(false);
			expect(result.status).toBe(404);
		});

		it("should return failure response for 401 Unauthorized", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: false,
				status: 401,
				message: "Unauthorized",
				response: null,
				cause: null,
			});

			const result = await patchRequest({
				url: "https://api.example.com/resource/1",
				body: { name: "Updated" },
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

			const result = await patchRequest({
				url: "https://api.example.com/resource/1",
				body: { name: "Updated" },
			});

			expect(result.success).toBe(false);
			expect(result.status).toBe(403);
		});

		it("should return failure response for 409 Conflict", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: false,
				status: 409,
				message: "Resource conflict",
				response: null,
				cause: null,
			});

			const result = await patchRequest({
				url: "https://api.example.com/resource/1",
				body: { version: 1 },
			});

			expect(result.success).toBe(false);
			expect(result.status).toBe(409);
		});

		it("should return failure response for 412 Precondition Failed", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: false,
				status: 412,
				message: "Precondition Failed",
				response: null,
				cause: null,
			});

			const result = await patchRequest({
				url: "https://api.example.com/resource/1",
				headers: { "If-Match": '"old-etag"' },
				body: { name: "Updated" },
			});

			expect(result.success).toBe(false);
			expect(result.status).toBe(412);
		});

		it("should return failure response for 422 Unprocessable Entity", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: false,
				status: 422,
				message: "Validation failed",
				response: { errors: { name: "Name is required" } },
				cause: null,
			});

			const result = await patchRequest({
				url: "https://api.example.com/resource/1",
				body: { name: "" },
			});

			expect(result.success).toBe(false);
			expect(result.status).toBe(422);
		});

		it("should return failure response for 500 Server Error", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: false,
				status: 500,
				message: "Internal Server Error",
				response: null,
				cause: null,
			});

			const result = await patchRequest({
				url: "https://api.example.com/resource/1",
				body: { name: "Updated" },
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
				cause: "Database update failed",
			});

			const result = await patchRequest({
				url: "https://api.example.com/resource/1",
				body: { name: "Updated" },
			});

			expect(result.cause).toBe("Database update failed");
		});
	});

	describe("generic type support", () => {
		it("should support generic response type", async () => {
			interface User {
				id: number;
				name: string;
				email: string;
				updatedAt: string;
			}

			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "User updated successfully",
				response: {
					id: 1,
					name: "John Updated",
					email: "john@example.com",
					updatedAt: "2026-02-05T10:00:00Z",
				},
				cause: null,
			});

			const result = await patchRequest<User>({
				url: "https://api.example.com/users/1",
				body: { name: "John Updated" },
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.response.id).toBe(1);
				expect(result.response.name).toBe("John Updated");
				expect(result.response.updatedAt).toBe("2026-02-05T10:00:00Z");
			}
		});

		it("should support partial response type", async () => {
			interface PartialUser {
				id: number;
				name?: string;
				email?: string;
			}

			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "User updated successfully",
				response: { id: 1, name: "Updated Name" },
				cause: null,
			});

			const result = await patchRequest<PartialUser>({
				url: "https://api.example.com/users/1",
				body: { name: "Updated Name" },
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.response.id).toBe(1);
				expect(result.response.name).toBe("Updated Name");
				expect(result.response.email).toBeUndefined();
			}
		});
	});

	describe("URL handling", () => {
		it("should handle URLs with query parameters", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource updated successfully",
				response: {},
				cause: null,
			});

			await patchRequest({
				url: "https://api.example.com/resource?version=2",
				body: { name: "Updated" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "PATCH",
				url: "https://api.example.com/resource?version=2",
				urlParams: undefined,
				headers: undefined,
				body: { name: "Updated" },
			});
		});

		it("should handle URLs with path parameters", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource updated successfully",
				response: {},
				cause: null,
			});

			await patchRequest({
				url: "https://api.example.com/users/123/profile",
				body: { bio: "Updated bio" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "PATCH",
				url: "https://api.example.com/users/123/profile",
				urlParams: undefined,
				headers: undefined,
				body: { bio: "Updated bio" },
			});
		});

		it("should handle URLs with nested resources", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource updated successfully",
				response: {},
				cause: null,
			});

			await patchRequest({
				url: "https://api.example.com/organizations/1/teams/2/members/3",
				body: { role: "admin" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "PATCH",
				url: "https://api.example.com/organizations/1/teams/2/members/3",
				urlParams: undefined,
				headers: undefined,
				body: { role: "admin" },
			});
		});
	});

	describe("with urlParams", () => {
		it("should pass single urlParam to makeRequest", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource updated successfully",
				response: {},
				cause: null,
			});

			await patchRequest({
				url: "https://api.example.com/resource/:id",
				urlParams: { id: "123" },
				body: { name: "Updated" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "PATCH",
				url: "https://api.example.com/resource/:id",
				urlParams: { id: "123" },
				headers: undefined,
				body: { name: "Updated" },
			});
		});

		it("should pass multiple urlParams to makeRequest", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource updated successfully",
				response: {},
				cause: null,
			});

			await patchRequest({
				url: "https://api.example.com/users/:userId/posts/:postId",
				urlParams: { userId: "123", postId: "456" },
				body: { title: "Updated Title" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "PATCH",
				url: "https://api.example.com/users/:userId/posts/:postId",
				urlParams: { userId: "123", postId: "456" },
				headers: undefined,
				body: { title: "Updated Title" },
			});
		});

		it("should pass urlParams with headers and body", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource updated successfully",
				response: {},
				cause: null,
			});

			await patchRequest({
				url: "https://api.example.com/resource/:id",
				urlParams: { id: "abc-123" },
				headers: { Authorization: "Bearer token" },
				body: { status: "active" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "PATCH",
				url: "https://api.example.com/resource/:id",
				urlParams: { id: "abc-123" },
				headers: { Authorization: "Bearer token" },
				body: { status: "active" },
			});
		});

		it("should handle empty urlParams object", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource updated successfully",
				response: {},
				cause: null,
			});

			await patchRequest({
				url: "https://api.example.com/resource/static",
				urlParams: {},
				body: { name: "Updated" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "PATCH",
				url: "https://api.example.com/resource/static",
				urlParams: {},
				headers: undefined,
				body: { name: "Updated" },
			});
		});

		it("should handle urlParams with special characters", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource updated successfully",
				response: {},
				cause: null,
			});

			await patchRequest({
				url: "https://api.example.com/resource/:id",
				urlParams: { id: "special-id-@#$%" },
				body: { name: "Updated" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "PATCH",
				url: "https://api.example.com/resource/:id",
				urlParams: { id: "special-id-@#$%" },
				headers: undefined,
				body: { name: "Updated" },
			});
		});

		it("should handle urlParams with UUID values", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource updated successfully",
				response: {},
				cause: null,
			});

			await patchRequest({
				url: "https://api.example.com/resource/:uuid",
				urlParams: { uuid: "550e8400-e29b-41d4-a716-446655440000" },
				body: { active: true },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "PATCH",
				url: "https://api.example.com/resource/:uuid",
				urlParams: { uuid: "550e8400-e29b-41d4-a716-446655440000" },
				headers: undefined,
				body: { active: true },
			});
		});

		it("should handle urlParams with numeric string values", async () => {
			vi.mocked(makeRequest).mockResolvedValue({
				success: true,
				status: 200,
				message: "Resource updated successfully",
				response: {},
				cause: null,
			});

			await patchRequest({
				url: "https://api.example.com/items/:itemId/versions/:version",
				urlParams: { itemId: "12345", version: "2" },
				body: { content: "Updated content" },
			});

			expect(makeRequest).toHaveBeenCalledWith({
				method: "PATCH",
				url: "https://api.example.com/items/:itemId/versions/:version",
				urlParams: { itemId: "12345", version: "2" },
				headers: undefined,
				body: { content: "Updated content" },
			});
		});
	});
});
