import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { SuccessResponse } from "../../successResponses/_successResponse";

describe("SuccessResponse", () => {
  let consoleLogSpy: any;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    process.env.NODE_ENV = "development";
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    delete process.env.NODE_ENV;
    delete process.env.SHOW_ERRORS_IN_CONSOLE;
  });

  describe("constructor and default values", () => {
    it("should create instance with default values", () => {
      const successResponse = new SuccessResponse();

      expect(successResponse.name).toBe("SuccessResponse");
      expect(successResponse.status).toBe(200);
      expect(successResponse.statusText).toBe("OK");
      expect(successResponse.body).toBeNull();
    });

    it("should allow setting custom body", () => {
      const successResponse = new SuccessResponse();
      successResponse.body = { data: "test" };

      expect(successResponse.body).toEqual({ data: "test" });
    });

    it("should allow setting custom status", () => {
      const successResponse = new SuccessResponse();
      successResponse.status = 201;

      expect(successResponse.status).toBe(201);
    });

    it("should allow setting custom statusText", () => {
      const successResponse = new SuccessResponse();
      successResponse.statusText = "Created";

      expect(successResponse.statusText).toBe("Created");
    });

    it("should allow setting custom name", () => {
      const successResponse = new SuccessResponse();
      successResponse.name = "CustomSuccess";

      expect(successResponse.name).toBe("CustomSuccess");
    });
  });

  describe("makeBody method", () => {
    it("should return body with name, message and body", () => {
      const successResponse = new SuccessResponse();
      const body = successResponse.makeBody();

      expect(body).toEqual({
        name: "SuccessResponse",
        message: "OK",
        body: null,
      });
    });

    it("should include body data when set", () => {
      const successResponse = new SuccessResponse();
      successResponse.body = { userId: 123, username: "john_doe" };

      const body = successResponse.makeBody();

      expect(body).toEqual({
        name: "SuccessResponse",
        message: "OK",
        body: { userId: 123, username: "john_doe" },
      });
    });

    it("should return custom message in body", () => {
      const successResponse = new SuccessResponse();
      successResponse.statusText = "Resource created successfully";

      const body = successResponse.makeBody();

      expect(body.message).toBe("Resource created successfully");
    });

    it("should return custom name in body", () => {
      const successResponse = new SuccessResponse();
      successResponse.name = "CreatedResponse";

      const body = successResponse.makeBody();

      expect(body.name).toBe("CreatedResponse");
    });

    it("should handle complex body object", () => {
      const successResponse = new SuccessResponse();
      successResponse.body = {
        user: {
          id: 1,
          name: "John",
          email: "john@example.com",
        },
        metadata: {
          createdAt: "2026-02-02T10:00:00Z",
          updatedAt: "2026-02-02T10:00:00Z",
        },
      };

      const body = successResponse.makeBody();

      expect(body.body).toEqual({
        user: {
          id: 1,
          name: "John",
          email: "john@example.com",
        },
        metadata: {
          createdAt: "2026-02-02T10:00:00Z",
          updatedAt: "2026-02-02T10:00:00Z",
        },
      });
    });

    it("should handle null body", () => {
      const successResponse = new SuccessResponse();
      successResponse.body = null;

      const body = successResponse.makeBody();

      expect(body.body).toBeNull();
    });

    it("should handle array as body", () => {
      const successResponse = new SuccessResponse();
      successResponse.body = [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ];

      const body = successResponse.makeBody();

      expect(body.body).toEqual([
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ]);
    });

    it("should handle primitive values as body", () => {
      const successResponse = new SuccessResponse();
      successResponse.body = "Simple string response";

      const body = successResponse.makeBody();

      expect(body.body).toBe("Simple string response");
    });
  });

  describe("onDebug method", () => {
    it("should call flushDebugLogs in development mode", () => {
      const successResponse = new SuccessResponse();
      successResponse.onDebug();

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it("should include statusText in debug logs", () => {
      const successResponse = new SuccessResponse();
      successResponse.statusText = "Operation successful";
      successResponse.onDebug();

      const loggedMessage = consoleLogSpy.mock.calls[0][0];
      expect(loggedMessage).toContain("Operation successful");
    });

    it("should include body in debug logs when provided", () => {
      const successResponse = new SuccessResponse();
      const body = { data: "test data" };
      successResponse.onDebug(body);

      const loggedMessage = consoleLogSpy.mock.calls[0][0];
      expect(loggedMessage).toContain(JSON.stringify(body));
    });

    it("should include caller function information", () => {
      const successResponse = new SuccessResponse();
      successResponse.onDebug();

      const loggedMessage = consoleLogSpy.mock.calls[0][0];
      expect(loggedMessage).toContain("Caller Function:");
    });

    it("should include caller location information", () => {
      const successResponse = new SuccessResponse();
      successResponse.onDebug();

      const loggedMessage = consoleLogSpy.mock.calls[0][0];
      expect(loggedMessage).toContain("Caller Location:");
    });

    it("should use green color scheme", () => {
      const successResponse = new SuccessResponse();
      successResponse.onDebug();

      const loggedMessage = consoleLogSpy.mock.calls[0][0];
      expect(loggedMessage).toContain("\x1b[32m");
    });

    it("should show name in debug logs", () => {
      const successResponse = new SuccessResponse();
      successResponse.name = "CustomSuccess";
      successResponse.onDebug();

      const loggedMessage = consoleLogSpy.mock.calls[0][0];
      expect(loggedMessage).toContain("[CustomSuccess]");
    });

    it("should not log when not in debug mode", () => {
      process.env.NODE_ENV = "production";
      delete process.env.SHOW_ERRORS_IN_CONSOLE;

      const successResponse = new SuccessResponse();
      successResponse.onDebug();

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it("should log when SHOW_ERRORS_IN_CONSOLE is true", () => {
      process.env.SHOW_ERRORS_IN_CONSOLE = "true";

      const successResponse = new SuccessResponse();
      successResponse.onDebug();

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it("should handle complex body object in debug", () => {
      const successResponse = new SuccessResponse();
      const complexBody = {
        users: [{ id: 1 }, { id: 2 }],
        pagination: { page: 1, total: 10 },
      };
      successResponse.onDebug(complexBody);

      const loggedMessage = consoleLogSpy.mock.calls[0][0];
      expect(loggedMessage).toContain(JSON.stringify(complexBody));
    });

    it("should handle undefined body in debug", () => {
      const successResponse = new SuccessResponse();
      successResponse.onDebug(undefined);

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it("should handle null body in debug", () => {
      const successResponse = new SuccessResponse();
      successResponse.onDebug(null);

      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe("integration scenarios", () => {
    it("should handle complete success response scenario", () => {
      const successResponse = new SuccessResponse();
      successResponse.name = "UserCreated";
      successResponse.status = 201;
      successResponse.statusText = "User created successfully";
      successResponse.body = {
        id: "user-123",
        email: "user@example.com",
        createdAt: "2026-02-02T10:00:00Z",
      };

      const body = successResponse.makeBody();

      expect(body).toEqual({
        name: "UserCreated",
        message: "User created successfully",
        body: {
          id: "user-123",
          email: "user@example.com",
          createdAt: "2026-02-02T10:00:00Z",
        },
      });
      expect(successResponse.status).toBe(201);
    });

    it("should maintain independent instances", () => {
      const response1 = new SuccessResponse();
      response1.name = "Response1";
      response1.status = 200;
      response1.body = { data: "first" };

      const response2 = new SuccessResponse();
      response2.name = "Response2";
      response2.status = 201;
      response2.body = { data: "second" };

      expect(response1.name).toBe("Response1");
      expect(response1.status).toBe(200);
      expect(response1.body).toEqual({ data: "first" });

      expect(response2.name).toBe("Response2");
      expect(response2.status).toBe(201);
      expect(response2.body).toEqual({ data: "second" });
    });

    it("should handle list response scenario", () => {
      const successResponse = new SuccessResponse();
      successResponse.name = "UserList";
      successResponse.statusText = "Users retrieved successfully";
      successResponse.body = {
        users: [
          { id: 1, name: "John" },
          { id: 2, name: "Jane" },
        ],
        total: 2,
        page: 1,
        perPage: 10,
      };

      const body = successResponse.makeBody();

      expect(body.body.users).toHaveLength(2);
      expect(body.body.total).toBe(2);
    });

    it("should handle empty response scenario", () => {
      const successResponse = new SuccessResponse();
      successResponse.name = "NoContent";
      successResponse.status = 204;
      successResponse.statusText = "No Content";
      successResponse.body = null;

      const body = successResponse.makeBody();

      expect(body.body).toBeNull();
      expect(successResponse.status).toBe(204);
    });
  });

  describe("edge cases", () => {
    it("should handle empty string statusText", () => {
      const successResponse = new SuccessResponse();
      successResponse.statusText = "";

      const body = successResponse.makeBody();

      expect(body.message).toBe("");
    });

    it("should handle very long statusText", () => {
      const successResponse = new SuccessResponse();
      const longMessage = "A".repeat(1000);
      successResponse.statusText = longMessage;

      const body = successResponse.makeBody();

      expect(body.message).toBe(longMessage);
    });

    it("should handle special characters in statusText", () => {
      const successResponse = new SuccessResponse();
      successResponse.statusText = 'Success: {"result": "ok"}';

      const body = successResponse.makeBody();

      expect(body.message).toBe('Success: {"result": "ok"}');
    });

    it("should handle unicode characters in statusText", () => {
      const successResponse = new SuccessResponse();
      successResponse.statusText = "Sucesso: 成功";

      const body = successResponse.makeBody();

      expect(body.message).toBe("Sucesso: 成功");
    });

    it("should handle deeply nested body object", () => {
      const successResponse = new SuccessResponse();
      successResponse.body = {
        level1: {
          level2: {
            level3: {
              level4: {
                data: "deeply nested",
              },
            },
          },
        },
      };

      const body = successResponse.makeBody();

      expect(body.body.level1.level2.level3.level4.data).toBe("deeply nested");
    });

    it("should handle body with Date object", () => {
      const successResponse = new SuccessResponse();
      const date = new Date("2026-02-02T10:00:00Z");
      successResponse.body = { createdAt: date };

      const body = successResponse.makeBody();

      expect(body.body.createdAt).toEqual(date);
    });

    it("should handle body with boolean values", () => {
      const successResponse = new SuccessResponse();
      successResponse.body = {
        isActive: true,
        isVerified: false,
      };

      const body = successResponse.makeBody();

      expect(body.body.isActive).toBe(true);
      expect(body.body.isVerified).toBe(false);
    });

    it("should handle body with numeric values", () => {
      const successResponse = new SuccessResponse();
      successResponse.body = {
        count: 42,
        price: 99.99,
        negative: -10,
      };

      const body = successResponse.makeBody();

      expect(body.body.count).toBe(42);
      expect(body.body.price).toBe(99.99);
      expect(body.body.negative).toBe(-10);
    });

    it("should handle body with empty object", () => {
      const successResponse = new SuccessResponse();
      successResponse.body = {};

      const body = successResponse.makeBody();

      expect(body.body).toEqual({});
    });

    it("should handle body with empty array", () => {
      const successResponse = new SuccessResponse();
      successResponse.body = [];

      const body = successResponse.makeBody();

      expect(body.body).toEqual([]);
    });
  });
});
