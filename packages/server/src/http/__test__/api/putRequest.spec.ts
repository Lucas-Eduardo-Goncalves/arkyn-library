import { describe, expect, it, beforeEach, vi } from "vitest";

import { putRequest } from "../../api/putRequest";
import { makeRequest } from "../../api/_makeRequest";

vi.mock("../../api/_makeRequest", () => ({
  makeRequest: vi.fn(),
}));

describe("putRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("successful requests", () => {
    it("should call makeRequest with PUT method", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Resource updated successfully",
        response: {},
        cause: null,
      });

      await putRequest({
        url: "https://api.example.com/resource/1",
        body: { name: "Updated Resource" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "PUT",
        url: "https://api.example.com/resource/1",
        urlParams: undefined,
        headers: undefined,
        body: { name: "Updated Resource" },
      });
    });

    it("should return success response from makeRequest", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Resource updated successfully",
        response: { id: 1, name: "Updated Resource" },
        cause: null,
      });

      const result = await putRequest({
        url: "https://api.example.com/resource/1",
        body: { name: "Updated Resource" },
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.message).toBe("Resource updated successfully");
      expect(result.response).toEqual({ id: 1, name: "Updated Resource" });
    });

    it("should return 201 Created when resource is created via PUT", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 201,
        message: "Resource created successfully",
        response: { id: 1, name: "New Resource" },
        cause: null,
      });

      const result = await putRequest({
        url: "https://api.example.com/resource/1",
        body: { name: "New Resource" },
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe(201);
    });

    it("should return 204 No Content response", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 204,
        message: "Resource updated successfully",
        response: null,
        cause: null,
      });

      const result = await putRequest({
        url: "https://api.example.com/resource/1",
        body: { name: "Updated Resource" },
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe(204);
      expect(result.response).toBeNull();
    });
  });

  describe("with urlParams", () => {
    it("should pass urlParams to makeRequest", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Resource updated successfully",
        response: {},
        cause: null,
      });

      await putRequest({
        url: "https://api.example.com/resource/:id",
        urlParams: { id: "123" },
        body: { name: "Updated Resource" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "PUT",
        url: "https://api.example.com/resource/:id",
        urlParams: { id: "123" },
        headers: undefined,
        body: { name: "Updated Resource" },
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

      await putRequest({
        url: "https://api.example.com/users/:userId/posts/:postId",
        urlParams: { userId: "1", postId: "42" },
        body: { title: "Updated Post" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "PUT",
        url: "https://api.example.com/users/:userId/posts/:postId",
        urlParams: { userId: "1", postId: "42" },
        headers: undefined,
        body: { title: "Updated Post" },
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

      await putRequest({
        url: "https://api.example.com/resource/1",
        urlParams: {},
        body: { name: "Updated Resource" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "PUT",
        url: "https://api.example.com/resource/1",
        urlParams: {},
        headers: undefined,
        body: { name: "Updated Resource" },
      });
    });

    it("should pass urlParams with special characters", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Resource updated successfully",
        response: {},
        cause: null,
      });

      await putRequest({
        url: "https://api.example.com/search/:query",
        urlParams: { query: "hello world" },
        body: { filters: {} },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "PUT",
        url: "https://api.example.com/search/:query",
        urlParams: { query: "hello world" },
        headers: undefined,
        body: { filters: {} },
      });
    });

    it("should pass urlParams combined with headers and body", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Resource updated successfully",
        response: {},
        cause: null,
      });

      await putRequest({
        url: "https://api.example.com/organizations/:orgId/teams/:teamId",
        urlParams: { orgId: "org-123", teamId: "team-456" },
        headers: { Authorization: "Bearer token123" },
        body: { name: "Updated Team", visibility: "public" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "PUT",
        url: "https://api.example.com/organizations/:orgId/teams/:teamId",
        urlParams: { orgId: "org-123", teamId: "team-456" },
        headers: { Authorization: "Bearer token123" },
        body: { name: "Updated Team", visibility: "public" },
      });
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

      await putRequest({
        url: "https://api.example.com/resource/1",
        headers: { Authorization: "Bearer token123" },
        body: { name: "Updated Resource" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "PUT",
        url: "https://api.example.com/resource/1",
        urlParams: undefined,
        headers: { Authorization: "Bearer token123" },
        body: { name: "Updated Resource" },
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

      await putRequest({
        url: "https://api.example.com/resource/1",
        headers: {
          Authorization: "Bearer token123",
          "X-Custom-Header": "custom-value",
          "Content-Type": "application/json",
        },
        body: { name: "Updated Resource" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "PUT",
        url: "https://api.example.com/resource/1",
        urlParams: undefined,
        headers: {
          Authorization: "Bearer token123",
          "X-Custom-Header": "custom-value",
          "Content-Type": "application/json",
        },
        body: { name: "Updated Resource" },
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

      await putRequest({
        url: "https://api.example.com/resource/1",
        headers: { "If-Match": '"etag123"' },
        body: { name: "Updated Resource" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "PUT",
        url: "https://api.example.com/resource/1",
        urlParams: undefined,
        headers: { "If-Match": '"etag123"' },
        body: { name: "Updated Resource" },
      });
    });

    it("should pass If-Unmodified-Since header", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Resource updated successfully",
        response: {},
        cause: null,
      });

      await putRequest({
        url: "https://api.example.com/resource/1",
        headers: { "If-Unmodified-Since": "Wed, 05 Feb 2026 10:00:00 GMT" },
        body: { name: "Updated Resource" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "PUT",
        url: "https://api.example.com/resource/1",
        urlParams: undefined,
        headers: { "If-Unmodified-Since": "Wed, 05 Feb 2026 10:00:00 GMT" },
        body: { name: "Updated Resource" },
      });
    });
  });

  describe("with body", () => {
    it("should pass complete resource body to makeRequest", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Resource updated successfully",
        response: {},
        cause: null,
      });

      const completeResource = {
        id: 1,
        name: "Complete Resource",
        description: "Full description",
        status: "active",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-02-05T10:00:00Z",
      };

      await putRequest({
        url: "https://api.example.com/resource/1",
        body: completeResource,
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "PUT",
        url: "https://api.example.com/resource/1",
        urlParams: undefined,
        headers: undefined,
        body: completeResource,
      });
    });

    it("should handle complex nested body objects", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Resource updated successfully",
        response: {},
        cause: null,
      });

      const complexBody = {
        id: 1,
        name: "Resource",
        metadata: {
          version: 2,
          author: { id: 100, name: "Admin" },
          tags: ["important", "reviewed"],
        },
        items: [
          { id: 1, value: "a" },
          { id: 2, value: "b" },
        ],
        settings: {
          enabled: true,
          config: { timeout: 30, retries: 3 },
        },
      };

      await putRequest({
        url: "https://api.example.com/resource/1",
        body: complexBody,
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "PUT",
        url: "https://api.example.com/resource/1",
        urlParams: undefined,
        headers: undefined,
        body: complexBody,
      });
    });

    it("should handle array body for collection replacement", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Collection replaced successfully",
        response: {},
        cause: null,
      });

      await putRequest({
        url: "https://api.example.com/items",
        body: [
          { id: 1, name: "Item 1" },
          { id: 2, name: "Item 2" },
          { id: 3, name: "Item 3" },
        ],
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "PUT",
        url: "https://api.example.com/items",
        urlParams: undefined,
        headers: undefined,
        body: [
          { id: 1, name: "Item 1" },
          { id: 2, name: "Item 2" },
          { id: 3, name: "Item 3" },
        ],
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

      await putRequest({
        url: "https://api.example.com/resource/1",
        body: {
          id: 1,
          name: "Resource",
          description: null,
          deletedAt: null,
        },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "PUT",
        url: "https://api.example.com/resource/1",
        urlParams: undefined,
        headers: undefined,
        body: { id: 1, name: "Resource", description: null, deletedAt: null },
      });
    });

    it("should handle empty object body", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Resource cleared",
        response: {},
        cause: null,
      });

      await putRequest({
        url: "https://api.example.com/resource/1/settings",
        body: {},
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "PUT",
        url: "https://api.example.com/resource/1/settings",
        urlParams: undefined,
        headers: undefined,
        body: {},
      });
    });

    it("should handle primitive body values", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Value updated",
        response: {},
        cause: null,
      });

      await putRequest({
        url: "https://api.example.com/config/value",
        body: "new-value",
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "PUT",
        url: "https://api.example.com/config/value",
        urlParams: undefined,
        headers: undefined,
        body: "new-value",
      });
    });
  });

  describe("failed requests", () => {
    it("should return failure response for 400 Bad Request", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: false,
        status: 400,
        message: "Invalid request body",
        response: { errors: ["Missing required fields"] },
        cause: null,
      });

      const result = await putRequest({
        url: "https://api.example.com/resource/1",
        body: { incomplete: "data" },
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

      const result = await putRequest({
        url: "https://api.example.com/resource/1",
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

      const result = await putRequest({
        url: "https://api.example.com/resource/1",
        body: { name: "Test" },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(403);
    });

    it("should return failure response for 404 Not Found", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: false,
        status: 404,
        message: "Resource not found",
        response: null,
        cause: null,
      });

      const result = await putRequest({
        url: "https://api.example.com/resource/999",
        body: { name: "Test" },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(404);
    });

    it("should return failure response for 409 Conflict", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: false,
        status: 409,
        message: "Resource conflict - concurrent modification",
        response: null,
        cause: null,
      });

      const result = await putRequest({
        url: "https://api.example.com/resource/1",
        body: { version: 1, name: "Test" },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(409);
    });

    it("should return failure response for 412 Precondition Failed", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: false,
        status: 412,
        message: "Precondition Failed - ETag mismatch",
        response: null,
        cause: null,
      });

      const result = await putRequest({
        url: "https://api.example.com/resource/1",
        headers: { "If-Match": '"old-etag"' },
        body: { name: "Test" },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(412);
    });

    it("should return failure response for 413 Payload Too Large", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: false,
        status: 413,
        message: "Payload Too Large",
        response: null,
        cause: null,
      });

      const result = await putRequest({
        url: "https://api.example.com/resource/1",
        body: { largeData: "x".repeat(10000) },
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(413);
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

      const result = await putRequest({
        url: "https://api.example.com/users/1",
        body: { email: "invalid", age: -5 },
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

      const result = await putRequest({
        url: "https://api.example.com/resource/1",
        body: { name: "Test" },
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
        cause: "Database transaction failed",
      });

      const result = await putRequest({
        url: "https://api.example.com/resource/1",
        body: { name: "Test" },
      });

      expect(result.cause).toBe("Database transaction failed");
    });
  });

  describe("generic type support", () => {
    it("should support generic response type", async () => {
      interface User {
        id: number;
        name: string;
        email: string;
        role: string;
        updatedAt: string;
      }

      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "User updated successfully",
        response: {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          role: "admin",
          updatedAt: "2026-02-05T10:00:00Z",
        },
        cause: null,
      });

      const result = await putRequest<User>({
        url: "https://api.example.com/users/1",
        body: { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.response.id).toBe(1);
        expect(result.response.name).toBe("John Doe");
        expect(result.response.role).toBe("admin");
        expect(result.response.updatedAt).toBe("2026-02-05T10:00:00Z");
      }
    });

    it("should support generic array response type", async () => {
      interface Item {
        id: number;
        name: string;
      }

      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Items replaced successfully",
        response: [
          { id: 1, name: "Item 1" },
          { id: 2, name: "Item 2" },
        ],
        cause: null,
      });

      const result = await putRequest<Item[]>({
        url: "https://api.example.com/items",
        body: [{ name: "Item 1" }, { name: "Item 2" }],
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.response).toHaveLength(2);
        expect(result.response[0].id).toBe(1);
      }
    });

    it("should support complex nested generic type", async () => {
      interface ApiResponse<T> {
        data: T;
        metadata: {
          version: number;
          lastModified: string;
        };
      }

      interface Config {
        settings: Record<string, string>;
      }

      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Config updated",
        response: {
          data: { settings: { theme: "dark", language: "en" } },
          metadata: { version: 2, lastModified: "2026-02-05T10:00:00Z" },
        },
        cause: null,
      });

      const result = await putRequest<ApiResponse<Config>>({
        url: "https://api.example.com/config",
        body: { settings: { theme: "dark", language: "en" } },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.response.data.settings.theme).toBe("dark");
        expect(result.response.metadata.version).toBe(2);
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

      await putRequest({
        url: "https://api.example.com/resource/1?version=2",
        body: { name: "Test" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "PUT",
        url: "https://api.example.com/resource/1?version=2",
        urlParams: undefined,
        headers: undefined,
        body: { name: "Test" },
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

      await putRequest({
        url: "https://api.example.com/users/123/profile",
        body: { bio: "New bio", avatar: "url" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "PUT",
        url: "https://api.example.com/users/123/profile",
        urlParams: undefined,
        headers: undefined,
        body: { bio: "New bio", avatar: "url" },
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

      await putRequest({
        url: "https://api.example.com/organizations/1/teams/2/settings",
        body: { visibility: "public", allowJoin: true },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "PUT",
        url: "https://api.example.com/organizations/1/teams/2/settings",
        urlParams: undefined,
        headers: undefined,
        body: { visibility: "public", allowJoin: true },
      });
    });

    it("should handle URLs with special characters", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Resource updated successfully",
        response: {},
        cause: null,
      });

      await putRequest({
        url: "https://api.example.com/resources/item%20name",
        body: { value: "test" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "PUT",
        url: "https://api.example.com/resources/item%20name",
        urlParams: undefined,
        headers: undefined,
        body: { value: "test" },
      });
    });
  });

  describe("idempotency behavior", () => {
    it("should handle multiple identical PUT requests", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Resource updated successfully",
        response: { id: 1, name: "Resource" },
        cause: null,
      });

      const body = { id: 1, name: "Resource" };

      const result1 = await putRequest({
        url: "https://api.example.com/resource/1",
        body,
      });
      const result2 = await putRequest({
        url: "https://api.example.com/resource/1",
        body,
      });

      expect(result1).toEqual(result2);
      expect(makeRequest).toHaveBeenCalledTimes(2);
    });
  });

  describe("common use cases", () => {
    it("should handle user profile replacement", async () => {
      interface UserProfile {
        id: number;
        name: string;
        email: string;
        bio: string;
        avatar: string;
        settings: { notifications: boolean; theme: string };
      }

      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Profile updated successfully",
        response: {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          bio: "Developer",
          avatar: "https://example.com/avatar.jpg",
          settings: { notifications: true, theme: "dark" },
        },
        cause: null,
      });

      const result = await putRequest<UserProfile>({
        url: "https://api.example.com/users/:id/profile",
        urlParams: { id: "1" },
        body: {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          bio: "Developer",
          avatar: "https://example.com/avatar.jpg",
          settings: { notifications: true, theme: "dark" },
        },
      });

      expect(result.success).toBe(true);
    });

    it("should handle configuration replacement", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Configuration saved",
        response: { applied: true },
        cause: null,
      });

      const result = await putRequest({
        url: "https://api.example.com/app/config",
        body: {
          database: { host: "localhost", port: 5432 },
          cache: { enabled: true, ttl: 3600 },
          features: ["feature1", "feature2"],
        },
      });

      expect(result.success).toBe(true);
    });

    it("should handle document replacement", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Document replaced",
        response: { id: "doc-123", version: 2 },
        cause: null,
      });

      const result = await putRequest({
        url: "https://api.example.com/documents/:docId",
        urlParams: { docId: "doc-123" },
        headers: { "Content-Type": "application/json" },
        body: {
          title: "Updated Document",
          content: "New content here",
          author: "admin",
          published: true,
        },
      });

      expect(result.success).toBe(true);
    });
  });
});
