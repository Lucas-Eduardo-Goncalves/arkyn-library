import { describe, expect, it, beforeEach, vi } from "vitest";

import { postRequest } from "../../api/postRequest";
import { makeRequest } from "../../api/_makeRequest";

vi.mock("../../api/_makeRequest", () => ({
  makeRequest: vi.fn(),
}));

describe("postRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("successful requests", () => {
    it("should call makeRequest with POST method", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resource created successfully",
        response: {},
        cause: null,
      });

      await postRequest({
        url: "https://api.example.com/resources",
        body: { name: "New Resource" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/resources",
        urlParams: undefined,
        headers: undefined,
        body: { name: "New Resource" },
      });
    });

    it("should return success response from makeRequest", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resource created successfully",
        response: { id: 1, name: "New Resource" },
        cause: null,
      });

      const result = await postRequest({
        url: "https://api.example.com/resources",
        body: { name: "New Resource" },
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe(201);
      expect(result.message).toBe("Resource created successfully");
      expect(result.response).toEqual({ id: 1, name: "New Resource" });
    });

    it("should return 200 OK response", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Request processed successfully",
        response: { result: "success" },
        cause: null,
      });

      const result = await postRequest({
        url: "https://api.example.com/process",
        body: { data: "test" },
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
    });

    it("should return 204 No Content response", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 204,
        message: "Resource created successfully",
        response: null,
        cause: null,
      });

      const result = await postRequest({
        url: "https://api.example.com/resources",
        body: { name: "New Resource" },
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
        status: 201,
        message: "Resource created successfully",
        response: {},
        cause: null,
      });

      await postRequest({
        url: "https://api.example.com/resources",
        headers: { Authorization: "Bearer token123" },
        body: { name: "New Resource" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/resources",
        urlParams: undefined,
        headers: { Authorization: "Bearer token123" },
        body: { name: "New Resource" },
      });
    });

    it("should pass multiple headers to makeRequest", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resource created successfully",
        response: {},
        cause: null,
      });

      await postRequest({
        url: "https://api.example.com/resources",
        headers: {
          Authorization: "Bearer token123",
          "X-Custom-Header": "custom-value",
          "X-Request-ID": "req-123",
        },
        body: { name: "New Resource" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/resources",
        urlParams: undefined,
        headers: {
          Authorization: "Bearer token123",
          "X-Custom-Header": "custom-value",
          "X-Request-ID": "req-123",
        },
        body: { name: "New Resource" },
      });
    });

    it("should use undefined as default headers when not provided", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resource created successfully",
        response: {},
        cause: null,
      });

      await postRequest({
        url: "https://api.example.com/resources",
        body: { name: "New Resource" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/resources",
        urlParams: undefined,
        headers: undefined,
        body: { name: "New Resource" },
      });
    });

    it("should pass Content-Type header for different formats", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resource created successfully",
        response: {},
        cause: null,
      });

      await postRequest({
        url: "https://api.example.com/upload",
        headers: { "Content-Type": "multipart/form-data" },
        body: { file: "data" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/upload",
        urlParams: undefined,
        headers: { "Content-Type": "multipart/form-data" },
        body: { file: "data" },
      });
    });
  });

  describe("with body", () => {
    it("should pass simple body to makeRequest", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resource created successfully",
        response: {},
        cause: null,
      });

      await postRequest({
        url: "https://api.example.com/resources",
        body: { name: "Test" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/resources",
        urlParams: undefined,
        headers: undefined,
        body: { name: "Test" },
      });
    });

    it("should handle complex body objects", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resource created successfully",
        response: {},
        cause: null,
      });

      const complexBody = {
        name: "New Resource",
        description: "A detailed description",
        metadata: {
          createdBy: "admin",
          tags: ["tag1", "tag2", "tag3"],
          settings: { enabled: true, priority: 1 },
        },
        items: [{ id: 1 }, { id: 2 }],
      };

      await postRequest({
        url: "https://api.example.com/resources",
        body: complexBody,
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/resources",
        urlParams: undefined,
        headers: undefined,
        body: complexBody,
      });
    });

    it("should handle array body", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resources created successfully",
        response: {},
        cause: null,
      });

      await postRequest({
        url: "https://api.example.com/resources/batch",
        body: [
          { name: "Resource 1" },
          { name: "Resource 2" },
          { name: "Resource 3" },
        ],
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/resources/batch",
        urlParams: undefined,
        headers: undefined,
        body: [
          { name: "Resource 1" },
          { name: "Resource 2" },
          { name: "Resource 3" },
        ],
      });
    });

    it("should handle null values in body", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resource created successfully",
        response: {},
        cause: null,
      });

      await postRequest({
        url: "https://api.example.com/resources",
        body: {
          name: "Test",
          description: null,
          optional: null,
        },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/resources",
        urlParams: undefined,
        headers: undefined,
        body: { name: "Test", description: null, optional: null },
      });
    });

    it("should handle empty object body", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resource created successfully",
        response: {},
        cause: null,
      });

      await postRequest({
        url: "https://api.example.com/trigger",
        body: {},
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/trigger",
        urlParams: undefined,
        headers: undefined,
        body: {},
      });
    });

    it("should handle primitive body values", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Request processed successfully",
        response: {},
        cause: null,
      });

      await postRequest({
        url: "https://api.example.com/echo",
        body: "raw string data",
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/echo",
        urlParams: undefined,
        headers: undefined,
        body: "raw string data",
      });
    });
  });

  describe("failed requests", () => {
    it("should return failure response for 400 Bad Request", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: false,
        status: 400,
        message: "Invalid request body",
        response: { errors: ["Missing required field"] },
        cause: null,
      });

      const result = await postRequest({
        url: "https://api.example.com/resources",
        body: { invalid: "data" },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(result.message).toBe("Invalid request body");
    });

    it("should return failure response for 401 Unauthorized", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: false,
        status: 401,
        message: "Unauthorized",
        response: null,
        cause: null,
      });

      const result = await postRequest({
        url: "https://api.example.com/resources",
        body: { name: "Test" },
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

      const result = await postRequest({
        url: "https://api.example.com/resources",
        body: { name: "Test" },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(403);
    });

    it("should return failure response for 404 Not Found", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: false,
        status: 404,
        message: "Endpoint not found",
        response: null,
        cause: null,
      });

      const result = await postRequest({
        url: "https://api.example.com/unknown",
        body: { name: "Test" },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
    });

    it("should return failure response for 409 Conflict", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: false,
        status: 409,
        message: "Resource already exists",
        response: null,
        cause: null,
      });

      const result = await postRequest({
        url: "https://api.example.com/resources",
        body: { name: "Duplicate" },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(409);
    });

    it("should return failure response for 422 Unprocessable Entity", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: false,
        status: 422,
        message: "Validation failed",
        response: {
          errors: {
            email: "Invalid email format",
            age: "Must be a positive number",
          },
        },
        cause: null,
      });

      const result = await postRequest({
        url: "https://api.example.com/users",
        body: { email: "invalid", age: -5 },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(422);
    });

    it("should return failure response for 429 Too Many Requests", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: false,
        status: 429,
        message: "Rate limit exceeded",
        response: null,
        cause: null,
      });

      const result = await postRequest({
        url: "https://api.example.com/resources",
        body: { name: "Test" },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(429);
    });

    it("should return failure response for 500 Server Error", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: false,
        status: 500,
        message: "Internal Server Error",
        response: null,
        cause: null,
      });

      const result = await postRequest({
        url: "https://api.example.com/resources",
        body: { name: "Test" },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(500);
    });

    it("should return failure response for 502 Bad Gateway", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: false,
        status: 502,
        message: "Bad Gateway",
        response: null,
        cause: null,
      });

      const result = await postRequest({
        url: "https://api.example.com/resources",
        body: { name: "Test" },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(502);
    });

    it("should return failure response for 503 Service Unavailable", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: false,
        status: 503,
        message: "Service Unavailable",
        response: null,
        cause: null,
      });

      const result = await postRequest({
        url: "https://api.example.com/resources",
        body: { name: "Test" },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(503);
    });

    it("should include error cause when present", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: false,
        status: 500,
        message: "Internal Server Error",
        response: null,
        cause: "Database connection failed",
      });

      const result = await postRequest({
        url: "https://api.example.com/resources",
        body: { name: "Test" },
      });

      expect(result.cause).toBe("Database connection failed");
    });
  });

  describe("generic type support", () => {
    it("should support generic response type", async () => {
      interface User {
        id: number;
        name: string;
        email: string;
        createdAt: string;
      }

      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "User created successfully",
        response: {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          createdAt: "2026-02-05T10:00:00Z",
        },
        cause: null,
      });

      const result = await postRequest<User>({
        url: "https://api.example.com/users",
        body: { name: "John Doe", email: "john@example.com" },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.response.id).toBe(1);
        expect(result.response.name).toBe("John Doe");
        expect(result.response.createdAt).toBe("2026-02-05T10:00:00Z");
      }
    });

    it("should support generic array response type", async () => {
      interface CreatedItem {
        id: number;
        name: string;
      }

      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Items created successfully",
        response: [
          { id: 1, name: "Item 1" },
          { id: 2, name: "Item 2" },
        ],
        cause: null,
      });

      const result = await postRequest<CreatedItem[]>({
        url: "https://api.example.com/items/batch",
        body: [{ name: "Item 1" }, { name: "Item 2" }],
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.response).toHaveLength(2);
        expect(result.response[0].id).toBe(1);
      }
    });

    it("should support nested generic response type", async () => {
      interface PaginatedResponse<T> {
        data: T[];
        total: number;
        page: number;
      }

      interface Item {
        id: number;
        name: string;
      }

      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Search completed",
        response: {
          data: [{ id: 1, name: "Found Item" }],
          total: 1,
          page: 1,
        },
        cause: null,
      });

      const result = await postRequest<PaginatedResponse<Item>>({
        url: "https://api.example.com/search",
        body: { query: "test" },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.response.data).toHaveLength(1);
        expect(result.response.total).toBe(1);
      }
    });
  });

  describe("URL handling", () => {
    it("should handle URLs with query parameters", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resource created successfully",
        response: {},
        cause: null,
      });

      await postRequest({
        url: "https://api.example.com/resources?async=true",
        body: { name: "Test" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/resources?async=true",
        urlParams: undefined,
        headers: undefined,
        body: { name: "Test" },
      });
    });

    it("should handle URLs with path parameters", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resource created successfully",
        response: {},
        cause: null,
      });

      await postRequest({
        url: "https://api.example.com/users/123/posts",
        body: { title: "New Post" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/users/123/posts",
        urlParams: undefined,
        headers: undefined,
        body: { title: "New Post" },
      });
    });

    it("should handle URLs with nested resources", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resource created successfully",
        response: {},
        cause: null,
      });

      await postRequest({
        url: "https://api.example.com/organizations/1/teams/2/members",
        body: { userId: 100 },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/organizations/1/teams/2/members",
        urlParams: undefined,
        headers: undefined,
        body: { userId: 100 },
      });
    });

    it("should handle URLs with special characters", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resource created successfully",
        response: {},
        cause: null,
      });

      await postRequest({
        url: "https://api.example.com/search?q=hello%20world",
        body: { filter: "test" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/search?q=hello%20world",
        urlParams: undefined,
        headers: undefined,
        body: { filter: "test" },
      });
    });
  });

  describe("with urlParams", () => {
    it("should pass single urlParam to makeRequest", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resource created successfully",
        response: {},
        cause: null,
      });

      await postRequest({
        url: "https://api.example.com/users/:userId/posts",
        urlParams: { userId: "123" },
        body: { title: "New Post" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/users/:userId/posts",
        urlParams: { userId: "123" },
        headers: undefined,
        body: { title: "New Post" },
      });
    });

    it("should pass multiple urlParams to makeRequest", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resource created successfully",
        response: {},
        cause: null,
      });

      await postRequest({
        url: "https://api.example.com/orgs/:orgId/teams/:teamId/members",
        urlParams: { orgId: "org-1", teamId: "team-2" },
        body: { userId: 100 },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/orgs/:orgId/teams/:teamId/members",
        urlParams: { orgId: "org-1", teamId: "team-2" },
        headers: undefined,
        body: { userId: 100 },
      });
    });

    it("should pass urlParams with headers and body", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resource created successfully",
        response: {},
        cause: null,
      });

      await postRequest({
        url: "https://api.example.com/users/:id/settings",
        urlParams: { id: "abc-123" },
        headers: { Authorization: "Bearer token" },
        body: { theme: "dark" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/users/:id/settings",
        urlParams: { id: "abc-123" },
        headers: { Authorization: "Bearer token" },
        body: { theme: "dark" },
      });
    });

    it("should handle empty urlParams object", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resource created successfully",
        response: {},
        cause: null,
      });

      await postRequest({
        url: "https://api.example.com/resources",
        urlParams: {},
        body: { name: "Test" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/resources",
        urlParams: {},
        headers: undefined,
        body: { name: "Test" },
      });
    });

    it("should handle urlParams with special characters", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resource created successfully",
        response: {},
        cause: null,
      });

      await postRequest({
        url: "https://api.example.com/resources/:id/items",
        urlParams: { id: "special-id-@#$%" },
        body: { name: "Item" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/resources/:id/items",
        urlParams: { id: "special-id-@#$%" },
        headers: undefined,
        body: { name: "Item" },
      });
    });

    it("should handle urlParams with UUID values", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resource created successfully",
        response: {},
        cause: null,
      });

      await postRequest({
        url: "https://api.example.com/containers/:uuid/files",
        urlParams: { uuid: "550e8400-e29b-41d4-a716-446655440000" },
        body: { filename: "document.pdf" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/containers/:uuid/files",
        urlParams: { uuid: "550e8400-e29b-41d4-a716-446655440000" },
        headers: undefined,
        body: { filename: "document.pdf" },
      });
    });

    it("should handle urlParams with numeric string values", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resource created successfully",
        response: {},
        cause: null,
      });

      await postRequest({
        url: "https://api.example.com/items/:itemId/versions/:version/comments",
        urlParams: { itemId: "12345", version: "2" },
        body: { text: "Great version!" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "POST",
        url: "https://api.example.com/items/:itemId/versions/:version/comments",
        urlParams: { itemId: "12345", version: "2" },
        headers: undefined,
        body: { text: "Great version!" },
      });
    });
  });

  describe("common use cases", () => {
    it("should handle login request", async () => {
      interface LoginResponse {
        token: string;
        refreshToken: string;
        expiresIn: number;
      }

      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Login successful",
        response: {
          token: "jwt-token",
          refreshToken: "refresh-token",
          expiresIn: 3600,
        },
        cause: null,
      });

      const result = await postRequest<LoginResponse>({
        url: "https://api.example.com/auth/login",
        body: { email: "user@example.com", password: "password123" },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.response.token).toBe("jwt-token");
      }
    });

    it("should handle file upload metadata", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Upload initiated",
        response: { uploadUrl: "https://storage.example.com/upload/123" },
        cause: null,
      });

      const result = await postRequest({
        url: "https://api.example.com/uploads",
        headers: { "X-File-Size": "1024" },
        body: { filename: "document.pdf", contentType: "application/pdf" },
      });

      expect(result.success).toBe(true);
    });

    it("should handle webhook registration", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Webhook registered",
        response: { id: "webhook-123", secret: "webhook-secret" },
        cause: null,
      });

      const result = await postRequest({
        url: "https://api.example.com/webhooks",
        body: {
          url: "https://myapp.com/webhook",
          events: ["order.created", "order.updated"],
        },
      });

      expect(result.success).toBe(true);
    });
  });
});
