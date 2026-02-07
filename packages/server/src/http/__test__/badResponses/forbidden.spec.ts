import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { Forbidden } from "../../badResponses/forbidden";

describe("Forbidden", () => {
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
      const error = new Forbidden("Access denied");

      expect(error.name).toBe("Forbidden");
      expect(error.status).toBe(403);
      expect(error.statusText).toBe("Access denied");
    });

    it("should set custom message", () => {
      const error = new Forbidden("Insufficient permissions");

      expect(error.statusText).toBe("Insufficient permissions");
    });

    it("should set cause when provided", () => {
      const cause = { requiredRole: "admin", userRole: "user" };
      const error = new Forbidden("Admin access required", cause);

      expect(error.cause).toBe(JSON.stringify(cause));
    });

    it("should not set cause when not provided", () => {
      const error = new Forbidden("Access denied");

      expect(error.cause).toBeUndefined();
    });

    it("should stringify complex cause object", () => {
      const cause = {
        resource: "document",
        action: "delete",
        requiredPermissions: ["delete:document", "admin"],
        userPermissions: ["read:document", "write:document"],
      };
      const error = new Forbidden("Permission denied", cause);

      expect(error.cause).toBe(JSON.stringify(cause));
    });

    it("should call onDebug on instantiation", () => {
      const error = new Forbidden("Access denied");

      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe("makeBody method", () => {
    it("should return correct body structure", () => {
      const error = new Forbidden("Access denied");
      const body = error.makeBody();

      expect(body).toEqual({
        name: "Forbidden",
        message: "Access denied",
        cause: undefined,
      });
    });

    it("should include cause in body when provided", () => {
      const cause = { reason: "Insufficient privileges" };
      const error = new Forbidden("Access denied", cause);
      const body = error.makeBody();

      expect(body).toEqual({
        name: "Forbidden",
        message: "Access denied",
        cause: JSON.stringify(cause),
      });
    });
  });

  describe("toResponse method", () => {
    it("should return Response object", () => {
      const error = new Forbidden("Access denied");
      const response = error.toResponse();

      expect(response).toBeInstanceOf(Response);
    });

    it("should have correct status code", () => {
      const error = new Forbidden("Access denied");
      const response = error.toResponse();

      expect(response.status).toBe(403);
    });

    it("should have correct status text", () => {
      const error = new Forbidden("Access denied");
      const response = error.toResponse();

      expect(response.statusText).toBe("Access denied");
    });

    it("should have correct Content-Type header", () => {
      const error = new Forbidden("Access denied");
      const response = error.toResponse();

      expect(response.headers.get("Content-Type")).toBe("application/json");
    });

    it("should have correct JSON body", async () => {
      const error = new Forbidden("Access denied");
      const response = error.toResponse();
      const body = await response.json();

      expect(body).toEqual({
        name: "Forbidden",
        message: "Access denied",
        cause: undefined,
      });
    });

    it("should include cause in response body", async () => {
      const cause = { requiredRole: "moderator" };
      const error = new Forbidden("Moderator access required", cause);
      const response = error.toResponse();
      const body = await response.json();

      expect(body.cause).toBe(JSON.stringify(cause));
    });

    it("should return valid JSON string", async () => {
      const error = new Forbidden("Access denied");
      const response = error.toResponse();
      const text = await response.text();

      expect(() => JSON.parse(text)).not.toThrow();
    });
  });

  describe("toJson method", () => {
    it("should return Response object", () => {
      const error = new Forbidden("Access denied");
      const response = error.toJson();

      expect(response).toBeInstanceOf(Response);
    });

    it("should have correct status code", () => {
      const error = new Forbidden("Access denied");
      const response = error.toJson();

      expect(response.status).toBe(403);
    });

    it("should have correct status text", () => {
      const error = new Forbidden("Access denied");
      const response = error.toJson();

      expect(response.statusText).toBe("Access denied");
    });

    it("should have correct JSON body", async () => {
      const error = new Forbidden("Access denied");
      const response = error.toJson();
      const body = await response.json();

      expect(body).toEqual({
        name: "Forbidden",
        message: "Access denied",
        cause: undefined,
      });
    });

    it("should include cause in response body", async () => {
      const cause = { action: "delete", resource: "user" };
      const error = new Forbidden("Cannot delete user", cause);
      const response = error.toJson();
      const body = await response.json();

      expect(body.cause).toBe(JSON.stringify(cause));
    });

    it("should automatically set Content-Type to application/json", () => {
      const error = new Forbidden("Access denied");
      const response = error.toJson();

      expect(response.headers.get("Content-Type")).toContain(
        "application/json",
      );
    });
  });

  describe("integration scenarios", () => {
    it("should handle insufficient role scenario", async () => {
      const cause = {
        requiredRole: "admin",
        userRole: "viewer",
        userId: "user-123",
      };
      const error = new Forbidden("Admin privileges required", cause);
      const response = error.toResponse();
      const body = await response.json();

      expect(response.status).toBe(403);
      expect(body.message).toBe("Admin privileges required");
      expect(body.cause).toBe(JSON.stringify(cause));
    });

    it("should handle missing permissions scenario", async () => {
      const cause = {
        action: "write",
        resource: "posts",
        requiredPermission: "write:posts",
        userPermissions: ["read:posts", "read:users"],
      };
      const error = new Forbidden("Write permission required", cause);
      const response = error.toJson();
      const body = await response.json();

      expect(response.status).toBe(403);
      expect(body.name).toBe("Forbidden");
      expect(body.message).toBe("Write permission required");
    });

    it("should handle resource ownership scenario", async () => {
      const cause = {
        resource: "document",
        resourceId: "doc-456",
        ownerId: "user-789",
        requesterId: "user-123",
      };
      const error = new Forbidden(
        "You can only access your own documents",
        cause,
      );
      const response = error.toResponse();
      const body = await response.json();

      expect(response.status).toBe(403);
      expect(body.cause).toBe(JSON.stringify(cause));
    });

    it("should handle IP restriction scenario", async () => {
      const error = new Forbidden("Access from this IP address is not allowed");
      const response = error.toJson();

      expect(response.status).toBe(403);
      expect(response.statusText).toBe(
        "Access from this IP address is not allowed",
      );
    });

    it("should handle subscription level scenario", async () => {
      const cause = {
        feature: "advanced-analytics",
        requiredPlan: "premium",
        currentPlan: "basic",
      };
      const error = new Forbidden("Premium subscription required", cause);
      const response = error.toResponse();
      const body = await response.json();

      expect(response.status).toBe(403);
      expect(body.message).toBe("Premium subscription required");
    });

    it("should handle account disabled scenario", async () => {
      const cause = {
        reason: "account_suspended",
        suspendedAt: "2024-01-15T10:00:00Z",
      };
      const error = new Forbidden("Your account has been suspended", cause);
      const response = error.toResponse();

      expect(response.status).toBe(403);
    });
  });

  describe("comparison between toResponse and toJson", () => {
    it("should produce equivalent responses", async () => {
      const error = new Forbidden("Access denied");
      const response1 = error.toResponse();
      const response2 = error.toJson();

      const body1 = await response1.json();
      const body2 = await response2.json();

      expect(body1).toEqual(body2);
      expect(response1.status).toBe(response2.status);
      expect(response1.statusText).toBe(response2.statusText);
    });

    it("should produce equivalent responses with cause", async () => {
      const cause = { permission: "admin", required: true };
      const error = new Forbidden("Admin only", cause);
      const response1 = error.toResponse();
      const response2 = error.toJson();

      const body1 = await response1.json();
      const body2 = await response2.json();

      expect(body1).toEqual(body2);
    });
  });

  describe("edge cases", () => {
    it("should handle empty message", () => {
      const error = new Forbidden("");

      expect(error.statusText).toBe("");
      expect(error.status).toBe(403);
    });

    it("should handle very long message", () => {
      const longMessage = "A".repeat(1000);
      const error = new Forbidden(longMessage);

      expect(error.statusText).toBe(longMessage);
    });

    it("should handle null cause", () => {
      const error = new Forbidden("Access denied", null);

      expect(error.cause).toBeUndefined();
    });

    it("should handle undefined cause explicitly", () => {
      const error = new Forbidden("Access denied", undefined);

      expect(error.cause).toBeUndefined();
    });

    it("should handle array as cause", () => {
      const cause = ["permission1", "permission2", "permission3"];
      const error = new Forbidden("Multiple permissions required", cause);

      expect(error.cause).toBe(JSON.stringify(cause));
    });

    it("should handle nested object as cause", () => {
      const cause = {
        permissions: {
          required: ["admin", "moderator"],
          current: ["user"],
        },
        roles: {
          required: ["super-admin"],
          current: ["basic-user"],
        },
      };
      const error = new Forbidden("Insufficient access level", cause);

      expect(error.cause).toBe(JSON.stringify(cause));
    });

    it("should handle special characters in message", () => {
      const message = 'Forbidden: {"error": "access_denied"}';
      const error = new Forbidden(message);

      expect(error.statusText).toBe(message);
    });

    it("should handle unicode characters in message", () => {
      const message = "Acesso negado: 访问被拒绝";
      const error = new Forbidden(message);

      expect(error.statusText).toBe(message);
    });

    it("should handle number as cause", () => {
      const error = new Forbidden("Access denied", 403);

      expect(error.cause).toBe("403");
    });

    it("should handle empty object as cause", () => {
      const error = new Forbidden("Access denied", {});

      expect(error.cause).toBe("{}");
    });

    it("should handle empty array as cause", () => {
      const error = new Forbidden("Access denied", []);

      expect(error.cause).toBe("[]");
    });
  });
});
