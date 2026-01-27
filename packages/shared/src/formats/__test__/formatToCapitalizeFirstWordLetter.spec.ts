import { describe, it, expect } from "vitest";
import { formatToCapitalizeFirstWordLetter } from "../formatToCapitalizeFirstWordLetter";

describe("formatToCapitalizeFirstWordLetter", () => {
  it("should capitalize first letter of each word in lowercase sentence", () => {
    expect(formatToCapitalizeFirstWordLetter("hello world")).toBe(
      "Hello World",
    );
  });

  it("should format sentence with all uppercase letters", () => {
    expect(formatToCapitalizeFirstWordLetter("HELLO WORLD")).toBe(
      "Hello World",
    );
  });

  it("should format sentence with mixed case letters", () => {
    expect(formatToCapitalizeFirstWordLetter("hELLO WoRLd")).toBe(
      "Hello World",
    );
  });

  it("should handle single word", () => {
    expect(formatToCapitalizeFirstWordLetter("hello")).toBe("Hello");
    expect(formatToCapitalizeFirstWordLetter("WORLD")).toBe("World");
  });

  it("should handle empty string", () => {
    expect(formatToCapitalizeFirstWordLetter("")).toBe("");
  });

  it("should handle multiple words", () => {
    expect(
      formatToCapitalizeFirstWordLetter("javascript is an amazing language"),
    ).toBe("Javascript Is An Amazing Language");
  });

  it("should handle sentence with multiple spaces", () => {
    expect(formatToCapitalizeFirstWordLetter("hello  world")).toBe(
      "Hello  World",
    );
  });

  it("should handle sentence with leading spaces", () => {
    expect(formatToCapitalizeFirstWordLetter("  hello world")).toBe(
      "  Hello World",
    );
  });

  it("should handle sentence with trailing spaces", () => {
    expect(formatToCapitalizeFirstWordLetter("hello world  ")).toBe(
      "Hello World  ",
    );
  });

  it("should handle single character words", () => {
    expect(formatToCapitalizeFirstWordLetter("a b c")).toBe("A B C");
  });

  it("should handle sentence with numbers", () => {
    expect(formatToCapitalizeFirstWordLetter("hello 123 world")).toBe(
      "Hello 123 World",
    );
  });

  it("should handle sentence with special characters", () => {
    expect(formatToCapitalizeFirstWordLetter("hello-world")).toBe(
      "Hello-world",
    );
    expect(formatToCapitalizeFirstWordLetter("hello_world")).toBe(
      "Hello_world",
    );
  });

  it("should handle sentence with punctuation", () => {
    expect(formatToCapitalizeFirstWordLetter("hello, world!")).toBe(
      "Hello, World!",
    );
  });

  it("should handle already capitalized sentence", () => {
    expect(formatToCapitalizeFirstWordLetter("Hello World")).toBe(
      "Hello World",
    );
  });

  it("should handle sentence with apostrophes", () => {
    expect(formatToCapitalizeFirstWordLetter("it's a beautiful day")).toBe(
      "It's A Beautiful Day",
    );
  });

  it("should handle very long sentence", () => {
    const longSentence = "the quick brown fox jumps over the lazy dog";
    expect(formatToCapitalizeFirstWordLetter(longSentence)).toBe(
      "The Quick Brown Fox Jumps Over The Lazy Dog",
    );
  });

  it("should handle sentence with only spaces", () => {
    expect(formatToCapitalizeFirstWordLetter("   ")).toBe("   ");
  });

  it("should handle sentence with tabs", () => {
    expect(formatToCapitalizeFirstWordLetter("hello\tworld")).toBe(
      "Hello\tworld",
    );
  });

  it("should handle sentence with line breaks", () => {
    expect(formatToCapitalizeFirstWordLetter("hello\nworld")).toBe(
      "Hello\nworld",
    );
  });

  it("should handle accented characters", () => {
    expect(formatToCapitalizeFirstWordLetter("café résumé")).toBe(
      "Café Résumé",
    );
  });

  it("should handle sentence with mixed alphanumeric words", () => {
    expect(formatToCapitalizeFirstWordLetter("test123 abc456")).toBe(
      "Test123 Abc456",
    );
  });
});
