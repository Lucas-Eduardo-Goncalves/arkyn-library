import { describe, it, expect } from "vitest";
import { Updated } from "../../successResponses/updated";

describe("Updated", () => {
  describe("Constructor", () => {
    it("should create an Updated instance with message and body", () => {
      const message = "Resource updated successfully";
      const body = { id: 1, name: "Updated Resource" };

      const updated = new Updated(message, body);

      expect(updated.name).toBe("Updated");
      expect(updated.status).toBe(200);
      expect(updated.statusText).toBe(message);
      expect(updated.body).toEqual(body);
    });

    it("should create an Updated instance with message only", () => {
      const message = "Resource updated";

      const updated = new Updated(message);

      expect(updated.name).toBe("Updated");
      expect(updated.status).toBe(200);
      expect(updated.statusText).toBe(message);
      expect(updated.body).toBeNull();
    });

    it("should set body as undefined when body is null", () => {
      const message = "Test message";

      const updated = new Updated(message, null);

      expect(updated.body).toBeNull();
    });

    it("should set body as undefined when body is undefined", () => {
      const message = "Test message";

      const updated = new Updated(message, undefined);

      expect(updated.body).toBeNull();
    });
  });

  describe("toResponse", () => {
    it("should return a Response with correct status and headers", async () => {
      const message = "Updated successfully";
      const body = { data: "updated data" };

      const updated = new Updated(message, body);
      const response = updated.toResponse();

      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(200);
      expect(response.statusText).toBe(message);
      expect(response.headers.get("Content-Type")).toBe("application/json");

      const responseBody = await response.json();
      expect(responseBody).toEqual(body);
    });

    it("should return a Response with undefined body", async () => {
      const message = "Updated without body";

      const updated = new Updated(message);
      const response = updated.toResponse();

      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(200);
      expect(response.statusText).toBe(message);

      const responseBody = await response.json();
      expect(responseBody).toBeNull();
    });

    it("should handle complex body objects", async () => {
      const message = "Complex update";
      const body = {
        user: { id: 1, name: "User 1", email: "user1@example.com" },
        metadata: {
          updatedAt: "2026-02-03T10:00:00Z",
          version: 2,
        },
      };

      const updated = new Updated(message, body);
      const response = updated.toResponse();

      const responseBody = await response.json();
      expect(responseBody).toEqual(body);
    });
  });

  describe("toJson", () => {
    it("should return a Response using Response.json with correct status", async () => {
      const message = "Updated successfully";
      const body = { data: "updated data" };

      const updated = new Updated(message, body);
      const response = updated.toJson();

      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(200);
      expect(response.statusText).toBe(message);

      const responseBody = await response.json();
      expect(responseBody).toEqual(body);
    });

    it("should return a Response with undefined body using toJson", async () => {
      const message = "Updated without body";

      const updated = new Updated(message);
      const response = updated.toJson();

      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toBeNull();
    });

    it("should automatically set Content-Type header to application/json", () => {
      const message = "Test message";
      const body = { updated: true };

      const updated = new Updated(message, body);
      const response = updated.toJson();

      expect(response.headers.get("Content-Type")).toContain(
        "application/json",
      );
    });

    it("should handle arrays as body", async () => {
      const message = "Multiple resources updated";
      const body = [
        { id: 1, name: "Resource 1" },
        { id: 2, name: "Resource 2" },
      ];

      const updated = new Updated(message, body);
      const response = updated.toJson();

      const responseBody = await response.json();
      expect(responseBody).toEqual(body);
    });
  });

  describe("makeBody", () => {
    it("should return a structured body object with all properties", () => {
      const message = "Resource updated";
      const body = { data: "updated" };

      const updated = new Updated(message, body);
      const structuredBody = updated.makeBody();

      expect(structuredBody).toEqual({
        name: "Updated",
        message: message,
        body: body,
      });
    });

    it("should handle undefined body in makeBody", () => {
      const message = "Test message";

      const updated = new Updated(message);
      const structuredBody = updated.makeBody();

      expect(structuredBody).toEqual({
        name: "Updated",
        message: message,
        body: null,
      });
    });
  });

  describe("Property setters and getters", () => {
    it("should allow updating body property", () => {
      const updated = new Updated("Initial message", { initial: true });

      updated.body = { updated: true };

      expect(updated.body).toEqual({ updated: true });
    });

    it("should allow updating statusText property", () => {
      const updated = new Updated("Initial message");

      updated.statusText = "Updated message";

      expect(updated.statusText).toBe("Updated message");
    });

    it("should allow updating status property", () => {
      const updated = new Updated("Test message");

      updated.status = 201;

      expect(updated.status).toBe(201);
    });

    it("should allow updating name property", () => {
      const updated = new Updated("Test message");

      updated.name = "CustomUpdated";

      expect(updated.name).toBe("CustomUpdated");
    });
  });
});
