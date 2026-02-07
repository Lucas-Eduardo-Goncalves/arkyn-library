import { describe, it, expect } from "vitest";
import { decodeRequestBody } from "../decodeRequestBody";
import { BadRequest } from "../../http/badResponses/badRequest";

function createMockRequest(body: string, contentType?: string): Request {
  const headers = new Headers();
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  return new Request("http://localhost", {
    method: "POST",
    body,
    headers,
  });
}

describe("decodeRequestBody", () => {
  describe("JSON parsing", () => {
    it("should parse valid JSON body", async () => {
      const jsonBody = JSON.stringify({ name: "John", age: 30 });
      const request = createMockRequest(jsonBody, "application/json");

      const result = await decodeRequestBody(request);

      expect(result).toEqual({ name: "John", age: 30 });
    });

    it("should parse nested JSON objects", async () => {
      const jsonBody = JSON.stringify({
        user: { name: "John", address: { city: "NYC" } },
      });
      const request = createMockRequest(jsonBody, "application/json");

      const result = await decodeRequestBody(request);

      expect(result).toEqual({
        user: { name: "John", address: { city: "NYC" } },
      });
    });

    it("should parse JSON arrays", async () => {
      const jsonBody = JSON.stringify([1, 2, 3]);
      const request = createMockRequest(jsonBody, "application/json");

      const result = await decodeRequestBody(request);

      expect(result).toEqual([1, 2, 3]);
    });

    it("should parse JSON with special characters", async () => {
      const jsonBody = JSON.stringify({ message: "Hello, 世界! 🌍" });
      const request = createMockRequest(jsonBody, "application/json");

      const result = await decodeRequestBody(request);

      expect(result).toEqual({ message: "Hello, 世界! 🌍" });
    });
  });

  describe("URLSearchParams parsing", () => {
    it("should parse valid URL-encoded form data", async () => {
      const formBody = "name=John&age=30";
      const request = createMockRequest(
        formBody,
        "application/x-www-form-urlencoded",
      );

      const result = await decodeRequestBody(request);

      expect(result).toEqual({ name: "John", age: "30" });
    });

    it("should parse URL-encoded data with special characters", async () => {
      const formBody = "message=Hello%20World&symbol=%26";
      const request = createMockRequest(
        formBody,
        "application/x-www-form-urlencoded",
      );

      const result = await decodeRequestBody(request);

      expect(result).toEqual({ message: "Hello World", symbol: "&" });
    });

    it("should parse URL-encoded data with empty values", async () => {
      const formBody = "name=&age=30";
      const request = createMockRequest(
        formBody,
        "application/x-www-form-urlencoded",
      );

      const result = await decodeRequestBody(request);

      expect(result).toEqual({ name: "", age: "30" });
    });

    it("should handle single key-value pair", async () => {
      const formBody = "key=value";
      const request = createMockRequest(formBody);

      const result = await decodeRequestBody(request);

      expect(result).toEqual({ key: "value" });
    });
  });

  describe("Error handling", () => {
    it("should throw BadRequest for invalid format without equals sign", async () => {
      const invalidBody = "invalid body without equals";
      const request = createMockRequest(invalidBody);

      await expect(decodeRequestBody(request)).rejects.toThrow(BadRequest);
    });

    it("should throw BadRequest for plain text that is not JSON or form data", async () => {
      const plainText = "just some plain text";
      const request = createMockRequest(plainText);

      await expect(decodeRequestBody(request)).rejects.toThrow(BadRequest);
    });

    it("should throw BadRequest for malformed JSON", async () => {
      const malformedJson = '{ "name": "John", }';
      const request = createMockRequest(malformedJson);

      await expect(decodeRequestBody(request)).rejects.toThrow(BadRequest);
    });
  });

  describe("Edge cases", () => {
    it("should parse empty JSON object", async () => {
      const jsonBody = "{}";
      const request = createMockRequest(jsonBody, "application/json");

      const result = await decodeRequestBody(request);

      expect(result).toEqual({});
    });

    it("should parse empty JSON array", async () => {
      const jsonBody = "[]";
      const request = createMockRequest(jsonBody, "application/json");

      const result = await decodeRequestBody(request);

      expect(result).toEqual([]);
    });

    it("should parse JSON null value", async () => {
      const jsonBody = "null";
      const request = createMockRequest(jsonBody, "application/json");

      const result = await decodeRequestBody(request);

      expect(result).toBeNull();
    });

    it("should parse JSON boolean values", async () => {
      const jsonBody = JSON.stringify({ active: true, deleted: false });
      const request = createMockRequest(jsonBody, "application/json");

      const result = await decodeRequestBody(request);

      expect(result).toEqual({ active: true, deleted: false });
    });

    it("should parse JSON numeric values", async () => {
      const jsonBody = JSON.stringify({ integer: 42, float: 3.14 });
      const request = createMockRequest(jsonBody, "application/json");

      const result = await decodeRequestBody(request);

      expect(result).toEqual({ integer: 42, float: 3.14 });
    });
  });
});
