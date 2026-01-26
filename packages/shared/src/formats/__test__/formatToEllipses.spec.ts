import { describe, expect, it } from "vitest";
import { formatToEllipsis } from "../formatToEllipsis";

describe("formatToEllipsis", () => {
  describe("text truncation", () => {
    it("should truncate text longer than maxLength", () => {
      const result = formatToEllipsis("Hello, world!", 5);
      expect(result).toBe("Hello...");
    });

    it("should not truncate text shorter than maxLength", () => {
      const result = formatToEllipsis("Hello", 10);
      expect(result).toBe("Hello");
    });

    it("should not truncate text equal to maxLength", () => {
      const result = formatToEllipsis("Hello", 5);
      expect(result).toBe("Hello");
    });

    it("should truncate long paragraph", () => {
      const longText = "This is a very long text that needs to be truncated";
      const result = formatToEllipsis(longText, 20);
      expect(result).toBe("This is a very long...");
      expect(result.length).toBeLessThanOrEqual(23); // 20 + "..."
    });

    it("should truncate at exact maxLength", () => {
      const result = formatToEllipsis("Hello World", 5);
      expect(result).toBe("Hello...");
    });
  });

  describe("punctuation removal", () => {
    it("should remove trailing comma before ellipsis", () => {
      const result = formatToEllipsis("Hello, world", 6);
      expect(result).toBe("Hello...");
    });

    it("should remove trailing period before ellipsis", () => {
      const result = formatToEllipsis("Hello. World", 6);
      expect(result).toBe("Hello...");
    });

    it("should remove trailing exclamation mark before ellipsis", () => {
      const result = formatToEllipsis("Hello! World", 6);
      expect(result).toBe("Hello...");
    });

    it("should remove trailing question mark before ellipsis", () => {
      const result = formatToEllipsis("Hello? World", 6);
      expect(result).toBe("Hello...");
    });

    it("should remove trailing semicolon before ellipsis", () => {
      const result = formatToEllipsis("Hello; World", 6);
      expect(result).toBe("Hello...");
    });

    it("should remove trailing colon before ellipsis", () => {
      const result = formatToEllipsis("Hello: World", 6);
      expect(result).toBe("Hello...");
    });
  });

  describe("whitespace handling", () => {
    it("should trim trailing spaces before ellipsis", () => {
      const result = formatToEllipsis("Hello     World", 8);
      expect(result).toBe("Hello...");
    });

    it("should trim and remove punctuation", () => {
      const result = formatToEllipsis("Hello,    World", 7);
      expect(result).toBe("Hello...");
    });

    it("should handle tab characters", () => {
      const result = formatToEllipsis("Hello\t\tWorld", 7);
      expect(result).toBe("Hello...");
    });
  });

  describe("edge cases", () => {
    it("should handle empty string", () => {
      const result = formatToEllipsis("", 5);
      expect(result).toBe("");
    });

    it("should handle maxLength of 0", () => {
      const result = formatToEllipsis("Hello", 0);
      expect(result).toBe("...");
    });

    it("should handle maxLength of 1", () => {
      const result = formatToEllipsis("Hello", 1);
      expect(result).toBe("H...");
    });

    it("should handle single character text", () => {
      const result = formatToEllipsis("H", 5);
      expect(result).toBe("H");
    });

    it("should handle text with only spaces", () => {
      const result = formatToEllipsis("     ", 3);
      expect(result).toBe("...");
    });

    it("should handle text with only punctuation", () => {
      const result = formatToEllipsis(".,!?;:", 3);
      expect(result).toBe("...");
    });

    it("should handle very large maxLength", () => {
      const result = formatToEllipsis("Hello", 1000);
      expect(result).toBe("Hello");
    });
  });

  describe("special characters", () => {
    it("should handle text with special symbols", () => {
      const result = formatToEllipsis("Hello@#$%World", 8);
      expect(result).toBe("Hello@#$...");
    });

    it("should handle text with numbers", () => {
      const result = formatToEllipsis("Hello123World", 8);
      expect(result).toBe("Hello123...");
    });

    it("should handle hyphenated words", () => {
      const result = formatToEllipsis("Hello-World-Test", 11);
      expect(result).toBe("Hello-World...");
    });
  });

  describe("real-world scenarios", () => {
    it("should truncate article title", () => {
      const title = "The Complete Guide to TypeScript Development in 2024";
      const result = formatToEllipsis(title, 30);
      expect(result).toBe("The Complete Guide to...");
    });

    it("should truncate user bio", () => {
      const bio =
        "Software engineer passionate about web development, open source, and teaching.";
      const result = formatToEllipsis(bio, 40);
      expect(result.length).toBeLessThanOrEqual(43);
      expect(result).toContain("...");
    });

    it("should truncate product description", () => {
      const description =
        "High-quality, durable product designed for everyday use.";
      const result = formatToEllipsis(description, 25);
      expect(result).toBe("High-quality, durable...");
    });

    it("should not truncate short message", () => {
      const message = "Hi there!";
      const result = formatToEllipsis(message, 20);
      expect(result).toBe("Hi there!");
    });
  });

  describe("multiple punctuation marks", () => {
    it("should remove only last punctuation mark", () => {
      const result = formatToEllipsis("Hello,, World", 7);
      expect(result).toBe("Hello...");
    });

    it("should handle mixed punctuation at end", () => {
      const result = formatToEllipsis("Hello!? World", 7);
      expect(result).toBe("Hello...");
    });
  });

  describe("boundary testing", () => {
    it("should handle maxLength exactly at word boundary", () => {
      const result = formatToEllipsis("Hello World", 5);
      expect(result).toBe("Hello...");
    });

    it("should handle maxLength in middle of word", () => {
      const result = formatToEllipsis("HelloWorld", 7);
      expect(result).toBe("HelloWo...");
    });

    it("should handle maxLength at punctuation", () => {
      const result = formatToEllipsis("Hello, World", 5);
      expect(result).toBe("Hello...");
    });
  });
});
