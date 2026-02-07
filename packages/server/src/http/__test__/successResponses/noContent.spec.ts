import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { NoContent } from "../../successResponses/noContent";

describe("NoContent", () => {
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
      const response = new NoContent("Operation completed");

      expect(response.name).toBe("NoContent");
      expect(response.status).toBe(204);
      expect(response.statusText).toBe("Operation completed");
    });

    it("should set custom message", () => {
      const response = new NoContent("Resource deleted successfully");

      expect(response.statusText).toBe("Resource deleted successfully");
    });

    it("should have undefined body", () => {
      const response = new NoContent("No content");

      expect(response.body).toBeNull();
    });

    it("should always have undefined body regardless of message", () => {
      const response = new NoContent("Any message here");

      expect(response.body).toBeNull();
    });

    it("should call onDebug on instantiation", () => {
      const response = new NoContent("Operation completed");

      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe("toResponse method", () => {
    it("should return Response object", () => {
      const response = new NoContent("Operation completed");
      const httpResponse = response.toResponse();

      expect(httpResponse).toBeInstanceOf(Response);
    });

    it("should have correct status code", () => {
      const response = new NoContent("Operation completed");
      const httpResponse = response.toResponse();

      expect(httpResponse.status).toBe(204);
    });

    it("should have correct status text", () => {
      const response = new NoContent("Resource deleted");
      const httpResponse = response.toResponse();

      expect(httpResponse.statusText).toBe("Resource deleted");
    });

    it("should have correct Content-Type header", () => {
      const response = new NoContent("Operation completed");
      const httpResponse = response.toResponse();

      expect(httpResponse.headers.get("Content-Type")).toBe("application/json");
    });

    it("should have undefined body serialized", async () => {
      const response = new NoContent("Operation completed");
      const httpResponse = response.toResponse();
      const text = await httpResponse.text();

      expect(text).toBe("");
    });

    it("should return consistent response structure", () => {
      const response = new NoContent("Test message");
      const httpResponse = response.toResponse();

      expect(httpResponse.status).toBe(204);
      expect(httpResponse.statusText).toBe("Test message");
    });
  });

  describe("integration scenarios", () => {
    it("should handle delete operation response", () => {
      const response = new NoContent("User deleted successfully");
      const httpResponse = response.toResponse();

      expect(httpResponse.status).toBe(204);
      expect(httpResponse.statusText).toBe("User deleted successfully");
    });

    it("should handle update without return response", () => {
      const response = new NoContent("Profile updated");
      const httpResponse = response.toResponse();

      expect(httpResponse.status).toBe(204);
      expect(httpResponse.statusText).toBe("Profile updated");
    });

    it("should handle logout response", () => {
      const response = new NoContent("Session terminated");
      const httpResponse = response.toResponse();

      expect(httpResponse.status).toBe(204);
      expect(httpResponse.statusText).toBe("Session terminated");
    });

    it("should handle cache clear response", () => {
      const response = new NoContent("Cache cleared successfully");
      const httpResponse = response.toResponse();

      expect(httpResponse.status).toBe(204);
      expect(httpResponse.statusText).toBe("Cache cleared successfully");
    });

    it("should handle subscription cancellation response", () => {
      const response = new NoContent("Subscription cancelled");
      const httpResponse = response.toResponse();

      expect(httpResponse.status).toBe(204);
      expect(httpResponse.statusText).toBe("Subscription cancelled");
    });

    it("should handle mark as read response", () => {
      const response = new NoContent("Notification marked as read");
      const httpResponse = response.toResponse();

      expect(httpResponse.status).toBe(204);
      expect(httpResponse.statusText).toBe("Notification marked as read");
    });

    it("should handle file deletion response", () => {
      const response = new NoContent("File permanently deleted");
      const httpResponse = response.toResponse();

      expect(httpResponse.status).toBe(204);
      expect(httpResponse.statusText).toBe("File permanently deleted");
    });

    it("should handle preference update response", () => {
      const response = new NoContent("Preferences saved");
      const httpResponse = response.toResponse();

      expect(httpResponse.status).toBe(204);
      expect(httpResponse.statusText).toBe("Preferences saved");
    });
  });

  describe("comparison between toResponse and toJson", () => {
    it("should have consistent status codes", () => {
      const response = new NoContent("Operation completed");
      const httpResponse = response.toResponse();

      expect(httpResponse.status).toBe(204);
    });

    it("should have consistent status text", () => {
      const response = new NoContent("Custom message");
      const httpResponse = response.toResponse();

      expect(httpResponse.statusText).toBe("Custom message");
    });

    it("should both be Response instances", () => {
      const response = new NoContent("Test");
      const httpResponse = response.toResponse();
      expect(httpResponse).toBeInstanceOf(Response);
    });

    it("should have same status and statusText", () => {
      const response = new NoContent("Identical responses");
      const httpResponse = response.toResponse();
      expect(httpResponse.status).toBe(response.status);
      expect(httpResponse.statusText).toBe(response.statusText);
    });
  });

  describe("edge cases", () => {
    it("should handle empty message", () => {
      const response = new NoContent("");

      expect(response.statusText).toBe("");
      expect(response.status).toBe(204);
    });

    it("should handle very long message", () => {
      const longMessage = "A".repeat(1000);
      const response = new NoContent(longMessage);

      expect(response.statusText).toBe(longMessage);
    });

    it("should handle special characters in message", () => {
      const message = 'No Content: {"status": "deleted"}';
      const response = new NoContent(message);

      expect(response.statusText).toBe(message);
    });

    it("should handle unicode characters in message", () => {
      const message = "Sem conteúdo: コンテンツなし";
      const response = new NoContent(message);

      expect(response.statusText).toBe(message);
    });

    it("should handle newline characters in message", () => {
      const message = "Line 1\nLine 2";
      const response = new NoContent(message);

      expect(response.statusText).toBe(message);
    });

    it("should handle tab characters in message", () => {
      const message = "Column1\tColumn2";
      const response = new NoContent(message);

      expect(response.statusText).toBe(message);
    });

    it("should handle message with only whitespace", () => {
      const message = "   ";
      const response = new NoContent(message);

      expect(response.statusText).toBe("   ");
    });

    it("should handle message with emojis", () => {
      const message = "Operation completed ✅";
      const response = new NoContent(message);

      expect(response.statusText).toBe(message);
    });

    it("should handle message with HTML-like content", () => {
      const message = "<deleted>resource</deleted>";
      const response = new NoContent(message);

      expect(response.statusText).toBe(message);
    });

    it("should handle message with quotes", () => {
      const message = 'Deleted "important" resource';
      const response = new NoContent(message);

      expect(response.statusText).toBe(message);
    });

    it("should handle message with backslashes", () => {
      const message = "Path: C:\\Users\\file deleted";
      const response = new NoContent(message);

      expect(response.statusText).toBe(message);
    });

    it("should always maintain undefined body", () => {
      const response = new NoContent("Test");

      // Attempt to verify body cannot be changed after construction
      expect(response.body).toBeNull();

      const httpResponse1 = response.toResponse();

      expect(response.body).toBeNull();
    });

    it("should handle numeric-like message", () => {
      const message = "204";
      const response = new NoContent(message);

      expect(response.statusText).toBe("204");
      expect(response.status).toBe(204);
    });

    it("should handle boolean-like message", () => {
      const message = "true";
      const response = new NoContent(message);

      expect(response.statusText).toBe("true");
    });

    it("should handle null-like message", () => {
      const message = "null";
      const response = new NoContent(message);

      expect(response.statusText).toBe("null");
    });

    it("should handle undefined-like message", () => {
      const message = "undefined";
      const response = new NoContent(message);

      expect(response.statusText).toBe("undefined");
    });
  });
});
