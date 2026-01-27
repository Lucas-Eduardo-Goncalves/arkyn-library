import { describe, it, expect } from "vitest";
import { parseLargeFields } from "../parseLargeFields";

describe("parseLargeFields", () => {
  it("should not truncate strings below maxLength", () => {
    const json = JSON.stringify({ name: "John", age: 30 });
    const result = parseLargeFields(json, 50);
    expect(result).toBe(JSON.stringify({ name: "John", age: 30 }));
  });

  it("should truncate strings exceeding maxLength", () => {
    const longString = "a".repeat(100);
    const json = JSON.stringify({ description: longString });
    const result = parseLargeFields(json, 50);
    const parsed = JSON.parse(result);
    expect(parsed.description).toBe(
      "To large information: field as 100 characters",
    );
  });

  it("should use default maxLength of 1000", () => {
    const longString = "a".repeat(1001);
    const json = JSON.stringify({ text: longString });
    const result = parseLargeFields(json);
    const parsed = JSON.parse(result);
    expect(parsed.text).toBe("To large information: field as 1001 characters");
  });

  it("should handle nested objects", () => {
    const json = JSON.stringify({
      user: { name: "John", bio: "a".repeat(100) },
    });
    const result = parseLargeFields(json, 50);
    const parsed = JSON.parse(result);
    expect(parsed.user.name).toBe("John");
    expect(parsed.user.bio).toBe(
      "To large information: field as 100 characters",
    );
  });

  it("should handle arrays", () => {
    const json = JSON.stringify(["short", "a".repeat(100), "another"]);
    const result = parseLargeFields(json, 50);
    const parsed = JSON.parse(result);
    expect(parsed[0]).toBe("short");
    expect(parsed[1]).toBe("To large information: field as 100 characters");
    expect(parsed[2]).toBe("another");
  });

  it("should handle arrays of objects", () => {
    const json = JSON.stringify([
      { id: 1, text: "short" },
      { id: 2, text: "a".repeat(100) },
    ]);
    const result = parseLargeFields(json, 50);
    const parsed = JSON.parse(result);
    expect(parsed[0].text).toBe("short");
    expect(parsed[1].text).toBe(
      "To large information: field as 100 characters",
    );
  });

  it("should handle deeply nested structures", () => {
    const json = JSON.stringify({
      level1: {
        level2: {
          level3: { data: "a".repeat(100) },
        },
      },
    });
    const result = parseLargeFields(json, 50);
    const parsed = JSON.parse(result);
    expect(parsed.level1.level2.level3.data).toBe(
      "To large information: field as 100 characters",
    );
  });

  it("should preserve non-string values", () => {
    const json = JSON.stringify({
      number: 12345,
      boolean: true,
      nullValue: null,
      array: [1, 2, 3],
    });
    const result = parseLargeFields(json, 50);
    expect(result).toBe(json);
  });

  it("should throw error for invalid JSON", () => {
    expect(() => parseLargeFields("invalid json")).toThrow(
      "Invalid JSON string",
    );
  });

  it("should handle empty objects", () => {
    const json = JSON.stringify({});
    const result = parseLargeFields(json, 50);
    expect(result).toBe("{}");
  });

  it("should handle empty arrays", () => {
    const json = JSON.stringify([]);
    const result = parseLargeFields(json, 50);
    expect(result).toBe("[]");
  });

  it("should handle strings exactly at maxLength", () => {
    const exactString = "a".repeat(50);
    const json = JSON.stringify({ text: exactString });
    const result = parseLargeFields(json, 50);
    const parsed = JSON.parse(result);
    expect(parsed.text).toBe(exactString);
  });

  it("should handle strings one character over maxLength", () => {
    const overString = "a".repeat(51);
    const json = JSON.stringify({ text: overString });
    const result = parseLargeFields(json, 50);
    const parsed = JSON.parse(result);
    expect(parsed.text).toBe("To large information: field as 51 characters");
  });
});
