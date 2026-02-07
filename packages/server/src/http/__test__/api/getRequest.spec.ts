import { describe, expect, it, beforeEach, vi } from "vitest";

import { getRequest } from "../../api/getRequest";
import { makeRequest } from "../../api/_makeRequest";

vi.mock("../../api/_makeRequest", () => ({
  makeRequest: vi.fn(),
}));

describe("getRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("successful requests", () => {
    it("should call makeRequest with GET method", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Data retrieved successfully",
        response: {},
        cause: null,
      });

      await getRequest({
        url: "https://api.example.com/data",
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "GET",
        url: "https://api.example.com/data",
        headers: undefined,
        urlParams: undefined,
      });
    });

    it("should return success response from makeRequest", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Data retrieved successfully",
        response: { id: 1, name: "Test" },
        cause: null,
      });

      const result = await getRequest({
        url: "https://api.example.com/data",
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.message).toBe("Data retrieved successfully");
      expect(result.response).toEqual({ id: 1, name: "Test" });
    });

    it("should return response with array data", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Data retrieved successfully",
        response: [{ id: 1 }, { id: 2 }, { id: 3 }],
        cause: null,
      });

      const result = await getRequest({
        url: "https://api.example.com/items",
      });

      expect(result.success).toBe(true);
      expect(result.response).toHaveLength(3);
    });

    it("should handle empty response", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Data retrieved successfully",
        response: null,
        cause: null,
      });

      const result = await getRequest({
        url: "https://api.example.com/empty",
      });

      expect(result.success).toBe(true);
      expect(result.response).toBeNull();
    });
  });

  describe("with headers", () => {
    it("should pass headers to makeRequest", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Data retrieved successfully",
        response: {},
        cause: null,
      });

      await getRequest({
        url: "https://api.example.com/data",
        headers: { Authorization: "Bearer token123" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "GET",
        url: "https://api.example.com/data",
        headers: { Authorization: "Bearer token123" },
      });
    });

    it("should pass multiple headers to makeRequest", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Data retrieved successfully",
        response: {},
        cause: null,
      });

      await getRequest({
        url: "https://api.example.com/data",
        headers: {
          Authorization: "Bearer token123",
          "X-Custom-Header": "custom-value",
          Accept: "application/json",
        },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "GET",
        url: "https://api.example.com/data",
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
        message: "Data retrieved successfully",
        response: {},
        cause: null,
      });

      await getRequest({
        url: "https://api.example.com/data",
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "GET",
        url: "https://api.example.com/data",
        headers: undefined,
      });
    });

    it("should pass cache control headers", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Data retrieved successfully",
        response: {},
        cause: null,
      });

      await getRequest({
        url: "https://api.example.com/data",
        headers: {
          "Cache-Control": "no-cache",
          "If-None-Match": '"etag123"',
        },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "GET",
        url: "https://api.example.com/data",
        headers: {
          "Cache-Control": "no-cache",
          "If-None-Match": '"etag123"',
        },
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

      const result = await getRequest({
        url: "https://api.example.com/notfound",
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

      const result = await getRequest({
        url: "https://api.example.com/protected",
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

      const result = await getRequest({
        url: "https://api.example.com/forbidden",
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

      const result = await getRequest({
        url: "https://api.example.com/error",
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

      const result = await getRequest({ url: "https://api.example.com/error" });
      expect(result.cause).toBe("Database connection failed");
    });

    it("should return failure response for 304 Not Modified", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: false,
        status: 304,
        message: "Not Modified",
        response: null,
        cause: null,
      });

      const result = await getRequest({
        url: "https://api.example.com/cached",
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe(304);
    });
  });

  describe("generic type support", () => {
    it("should support generic response type", async () => {
      interface User {
        id: number;
        name: string;
        email: string;
      }

      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Data retrieved successfully",
        response: { id: 1, name: "John", email: "john@example.com" },
        cause: null,
      });

      const result = await getRequest<User>({
        url: "https://api.example.com/user/1",
      });

      expect(result.success).toBe(true);
      expect(result.response.id).toBe(1);
      expect(result.response.name).toBe("John");
      expect(result.response.email).toBe("john@example.com");
    });

    it("should support generic array response type", async () => {
      interface Item {
        id: number;
        title: string;
      }

      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Data retrieved successfully",
        response: [
          { id: 1, title: "Item 1" },
          { id: 2, title: "Item 2" },
        ],
        cause: null,
      });

      const result = await getRequest<Item[]>({
        url: "https://api.example.com/items",
      });

      expect(result.success).toBe(true);
      expect(result.response).toHaveLength(2);
      expect(result.response[0].title).toBe("Item 1");
    });
  });

  describe("URL handling", () => {
    it("should handle URLs with query parameters", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Data retrieved successfully",
        response: {},
        cause: null,
      });

      await getRequest({ url: "https://api.example.com/search?q=test&page=1" });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "GET",
        url: "https://api.example.com/search?q=test&page=1",
      });
    });

    it("should handle URLs with path parameters", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Data retrieved successfully",
        response: {},
        cause: null,
      });

      await getRequest({ url: "https://api.example.com/users/123/posts/456" });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "GET",
        url: "https://api.example.com/users/123/posts/456",
      });
    });

    it("should handle URLs with fragments", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Data retrieved successfully",
        response: {},
        cause: null,
      });

      await getRequest({ url: "https://api.example.com/page#section" });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "GET",
        url: "https://api.example.com/page#section",
      });
    });

    it("should handle URLs with special characters encoded", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Data retrieved successfully",
        response: {},
        cause: null,
      });

      await getRequest({
        url: "https://api.example.com/search?q=hello%20world&filter=a%26b",
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "GET",
        url: "https://api.example.com/search?q=hello%20world&filter=a%26b",
      });
    });
  });

  describe("with urlParams", () => {
    it("should pass single urlParam to makeRequest", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Data retrieved successfully",
        response: {},
        cause: null,
      });

      await getRequest({
        url: "https://api.example.com/users/:id",
        urlParams: { id: "123" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "GET",
        url: "https://api.example.com/users/:id",
        urlParams: { id: "123" },
      });
    });

    it("should pass multiple urlParams to makeRequest", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Data retrieved successfully",
        response: {},
        cause: null,
      });

      await getRequest({
        url: "https://api.example.com/users/:userId/posts/:postId",
        urlParams: { userId: "123", postId: "456" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "GET",
        url: "https://api.example.com/users/:userId/posts/:postId",
        urlParams: { userId: "123", postId: "456" },
      });
    });

    it("should pass urlParams with headers", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Data retrieved successfully",
        response: {},
        cause: null,
      });

      await getRequest({
        url: "https://api.example.com/users/:id",
        urlParams: { id: "abc-123" },
        headers: { Authorization: "Bearer token" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "GET",
        url: "https://api.example.com/users/:id",
        urlParams: { id: "abc-123" },
        headers: { Authorization: "Bearer token" },
      });
    });

    it("should handle empty urlParams object", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Data retrieved successfully",
        response: {},
        cause: null,
      });

      await getRequest({ url: "https://api.example.com/users/static" });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "GET",
        url: "https://api.example.com/users/static",
        urlParams: undefined,
        headers: undefined,
      });
    });

    it("should handle urlParams with special characters", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Data retrieved successfully",
        response: {},
        cause: null,
      });

      await getRequest({
        url: "https://api.example.com/users/:id",
        urlParams: { id: "special-id-@#$%" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "GET",
        url: "https://api.example.com/users/:id",
        urlParams: { id: "special-id-@#$%" },
        headers: undefined,
      });
    });

    it("should handle urlParams with UUID values", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Data retrieved successfully",
        response: {},
        cause: null,
      });

      await getRequest({
        url: "https://api.example.com/resources/:uuid",
        urlParams: { uuid: "550e8400-e29b-41d4-a716-446655440000" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "GET",
        url: "https://api.example.com/resources/:uuid",
        urlParams: { uuid: "550e8400-e29b-41d4-a716-446655440000" },
        headers: undefined,
      });
    });

    it("should handle urlParams with numeric string values", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Data retrieved successfully",
        response: {},
        cause: null,
      });

      await getRequest({
        url: "https://api.example.com/items/:itemId/versions/:version",
        urlParams: { itemId: "12345", version: "2" },
      });

      expect(makeRequest).toHaveBeenCalledWith({
        method: "GET",
        url: "https://api.example.com/items/:itemId/versions/:version",
        urlParams: { itemId: "12345", version: "2" },
        headers: undefined,
      });
    });
  });

  describe("does not pass body", () => {
    it("should not pass body parameter to makeRequest", async () => {
      vi.mocked(makeRequest).mockResolvedValue({
        success: true,
        status: 200,
        message: "Data retrieved successfully",
        response: {},
        cause: null,
      });

      await getRequest({ url: "https://api.example.com/data" });

      expect(makeRequest).toHaveBeenCalledWith({
        headers: undefined,
        method: "GET",
        url: "https://api.example.com/data",
        urlParams: undefined,
      });

      expect(makeRequest).toHaveBeenCalledTimes(1);
    });
  });
});
