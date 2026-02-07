import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { NotFound } from "../../badResponses/notFound";

describe("NotFound", () => {
  let consoleLogSpy: any;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    process.env.NODE_ENV = "development";
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    delete process.env.NODE_ENV;
  });

  describe("constructor", () => {
    it("should create instance with correct default values", () => {
      const error = new NotFound("Resource not found");

      expect(error.name).toBe("NotFound");
      expect(error.status).toBe(404);
      expect(error.statusText).toBe("Resource not found");
    });

    it("should set custom message", () => {
      const error = new NotFound("User not found");

      expect(error.statusText).toBe("User not found");
    });

    it("should set cause when provided", () => {
      const cause = { resourceId: "123", resourceType: "user" };
      const error = new NotFound("User not found", cause);

      expect(error.cause).toBe(JSON.stringify(cause));
    });

    it("should not set cause when not provided", () => {
      const error = new NotFound("Resource not found");

      expect(error.cause).toBeUndefined();
    });

    it("should stringify complex cause object", () => {
      const cause = {
        resource: "document",
        id: "doc-456",
        searchCriteria: {
          title: "My Document",
          author: "John Doe",
        },
      };
      const error = new NotFound("Document not found", cause);

      expect(error.cause).toBe(JSON.stringify(cause));
    });

    it("should call onDebug on instantiation", () => {
      const error = new NotFound("Resource not found");

      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe("makeBody method", () => {
    it("should return correct body structure", () => {
      const error = new NotFound("Resource not found");
      const body = error.makeBody();

      expect(body).toEqual({
        name: "NotFound",
        message: "Resource not found",
        cause: undefined,
      });
    });

    it("should include cause in body when provided", () => {
      const cause = { id: "user-123" };
      const error = new NotFound("User not found", cause);
      const body = error.makeBody();

      expect(body).toEqual({
        name: "NotFound",
        message: "User not found",
        cause: JSON.stringify(cause),
      });
    });
  });

  describe("toResponse method", () => {
    it("should return Response object", () => {
      const error = new NotFound("Resource not found");
      const response = error.toResponse();

      expect(response).toBeInstanceOf(Response);
    });

    it("should have correct status code", () => {
      const error = new NotFound("Resource not found");
      const response = error.toResponse();

      expect(response.status).toBe(404);
    });

    it("should have correct status text", () => {
      const error = new NotFound("Resource not found");
      const response = error.toResponse();

      expect(response.statusText).toBe("Resource not found");
    });

    it("should have correct Content-Type header", () => {
      const error = new NotFound("Resource not found");
      const response = error.toResponse();

      expect(response.headers.get("Content-Type")).toBe("application/json");
    });

    it("should have correct JSON body", async () => {
      const error = new NotFound("Resource not found");
      const response = error.toResponse();
      const body = await response.json();

      expect(body).toEqual({
        name: "NotFound",
        message: "Resource not found",
        cause: undefined,
      });
    });

    it("should include cause in response body", async () => {
      const cause = { userId: "abc-123" };
      const error = new NotFound("User not found", cause);
      const response = error.toResponse();
      const body = await response.json();

      expect(body.cause).toBe(JSON.stringify(cause));
    });

    it("should return valid JSON string", async () => {
      const error = new NotFound("Resource not found");
      const response = error.toResponse();
      const text = await response.text();

      expect(() => JSON.parse(text)).not.toThrow();
    });
  });

  describe("toJson method", () => {
    it("should return Response object", () => {
      const error = new NotFound("Resource not found");
      const response = error.toJson();

      expect(response).toBeInstanceOf(Response);
    });

    it("should have correct status code", () => {
      const error = new NotFound("Resource not found");
      const response = error.toJson();

      expect(response.status).toBe(404);
    });

    it("should have correct status text", () => {
      const error = new NotFound("Resource not found");
      const response = error.toJson();

      expect(response.statusText).toBe("Resource not found");
    });

    it("should have correct JSON body", async () => {
      const error = new NotFound("Resource not found");
      const response = error.toJson();
      const body = await response.json();

      expect(body).toEqual({
        name: "NotFound",
        message: "Resource not found",
        cause: undefined,
      });
    });

    it("should include cause in response body", async () => {
      const cause = { postId: "post-789" };
      const error = new NotFound("Post not found", cause);
      const response = error.toJson();
      const body = await response.json();

      expect(body.cause).toBe(JSON.stringify(cause));
    });

    it("should automatically set Content-Type to application/json", () => {
      const error = new NotFound("Resource not found");
      const response = error.toJson();

      expect(response.headers.get("Content-Type")).toContain(
        "application/json",
      );
    });
  });

  describe("integration scenarios", () => {
    it("should handle user not found scenario", async () => {
      const cause = {
        userId: "user-123",
        searchedBy: "email",
        value: "user@example.com",
      };
      const error = new NotFound("User not found", cause);
      const response = error.toResponse();
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.message).toBe("User not found");
      expect(body.cause).toBe(JSON.stringify(cause));
    });

    it("should handle document not found scenario", async () => {
      const cause = {
        documentId: "doc-456",
        workspace: "my-workspace",
      };
      const error = new NotFound("Document not found in workspace", cause);
      const response = error.toJson();
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.name).toBe("NotFound");
      expect(body.message).toBe("Document not found in workspace");
    });

    it("should handle API endpoint not found scenario", async () => {
      const cause = {
        method: "GET",
        path: "/api/v1/unknown",
      };
      const error = new NotFound("Endpoint not found", cause);
      const response = error.toResponse();
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.cause).toBe(JSON.stringify(cause));
    });

    it("should handle file not found scenario", async () => {
      const error = new NotFound("File not found");
      const response = error.toJson();

      expect(response.status).toBe(404);
      expect(response.statusText).toBe("File not found");
    });

    it("should handle product not found scenario", async () => {
      const cause = {
        productId: "prod-789",
        sku: "SKU-12345",
      };
      const error = new NotFound("Product not found", cause);
      const response = error.toResponse();
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.message).toBe("Product not found");
    });

    it("should handle page not found scenario", async () => {
      const cause = {
        slug: "my-page",
        locale: "en-US",
      };
      const error = new NotFound("Page not found", cause);
      const response = error.toResponse();

      expect(response.status).toBe(404);
    });
  });

  describe("comparison between toResponse and toJson", () => {
    it("should produce equivalent responses", async () => {
      const error = new NotFound("Resource not found");
      const response1 = error.toResponse();
      const response2 = error.toJson();

      const body1 = await response1.json();
      const body2 = await response2.json();

      expect(body1).toEqual(body2);
      expect(response1.status).toBe(response2.status);
      expect(response1.statusText).toBe(response2.statusText);
    });

    it("should produce equivalent responses with cause", async () => {
      const cause = { id: "test-id", type: "resource" };
      const error = new NotFound("Resource not found", cause);
      const response1 = error.toResponse();
      const response2 = error.toJson();

      const body1 = await response1.json();
      const body2 = await response2.json();

      expect(body1).toEqual(body2);
    });
  });

  describe("edge cases", () => {
    it("should handle empty message", () => {
      const error = new NotFound("");

      expect(error.statusText).toBe("");
      expect(error.status).toBe(404);
    });

    it("should handle very long message", () => {
      const longMessage = "A".repeat(1000);
      const error = new NotFound(longMessage);

      expect(error.statusText).toBe(longMessage);
    });

    it("should handle null cause", () => {
      const error = new NotFound("Resource not found", null);

      expect(error.cause).toBeUndefined();
    });

    it("should handle undefined cause explicitly", () => {
      const error = new NotFound("Resource not found", undefined);

      expect(error.cause).toBeUndefined();
    });

    it("should handle array as cause", () => {
      const cause = ["id-1", "id-2", "id-3"];
      const error = new NotFound("Multiple resources not found", cause);

      expect(error.cause).toBe(JSON.stringify(cause));
    });

    it("should handle nested object as cause", () => {
      const cause = {
        search: {
          filters: {
            category: "electronics",
            priceRange: { min: 100, max: 500 },
          },
          pagination: { page: 5, limit: 20 },
        },
      };
      const error = new NotFound("No results found", cause);

      expect(error.cause).toBe(JSON.stringify(cause));
    });

    it("should handle special characters in message", () => {
      const message = 'Not Found: {"resource": "user/123"}';
      const error = new NotFound(message);

      expect(error.statusText).toBe(message);
    });

    it("should handle unicode characters in message", () => {
      const message = "Recurso não encontrado: 找不到资源";
      const error = new NotFound(message);

      expect(error.statusText).toBe(message);
    });

    it("should handle number as cause", () => {
      const error = new NotFound("Resource not found", 404);

      expect(error.cause).toBe("404");
    });

    it("should handle empty object as cause", () => {
      const error = new NotFound("Resource not found", {});

      expect(error.cause).toBe("{}");
    });

    it("should handle empty array as cause", () => {
      const error = new NotFound("Resource not found", []);

      expect(error.cause).toBe("[]");
    });

    it("should handle UUID as resource id in cause", () => {
      const cause = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        type: "user",
      };
      const error = new NotFound("User not found", cause);

      expect(error.cause).toBe(JSON.stringify(cause));
    });
  });
});
