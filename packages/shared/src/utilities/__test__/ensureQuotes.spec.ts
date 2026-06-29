import { describe, expect, it } from "vitest";
import { ensureQuotes } from "../ensureQuotes";

describe("ensureQuotes", () => {
	it("should add double quotes to unquoted string", () => {
		const result = ensureQuotes("hello");
		expect(result).toBe('"hello"');
	});

	it("should not add quotes if string already has double quotes", () => {
		const result = ensureQuotes('"hello"');
		expect(result).toBe('"hello"');
	});

	it("should not add quotes if string already has single quotes", () => {
		const result = ensureQuotes("'hello'");
		expect(result).toBe("'hello'");
	});

	it("should handle empty string", () => {
		const result = ensureQuotes("");
		expect(result).toBe('""');
	});

	it("should handle string with spaces", () => {
		const result = ensureQuotes("hello world");
		expect(result).toBe('"hello world"');
	});

	it("should handle string with special characters", () => {
		const result = ensureQuotes("hello@world.com");
		expect(result).toBe('"hello@world.com"');
	});

	it("should handle string with numbers", () => {
		const result = ensureQuotes("12345");
		expect(result).toBe('"12345"');
	});

	it("should handle URL string", () => {
		const result = ensureQuotes("https://example.com");
		expect(result).toBe('"https://example.com"');
	});

	it("should handle string with quotes in the middle", () => {
		const result = ensureQuotes('hello"world');
		expect(result).toBe('"hello"world"');
	});

	it("should not add quotes if only starts with quote", () => {
		const result = ensureQuotes('"hello');
		expect(result).toBe('""hello"');
	});

	it("should not add quotes if only ends with quote", () => {
		const result = ensureQuotes('hello"');
		expect(result).toBe('"hello""');
	});

	it("should handle string with mixed quotes inside", () => {
		const result = ensureQuotes('it\'s a "test"');
		expect(result).toBe('"it\'s a "test""');
	});

	it("should handle string with only opening single quote", () => {
		const result = ensureQuotes("'hello");
		expect(result).toBe('"\'hello"');
	});

	it("should handle string with only closing single quote", () => {
		const result = ensureQuotes("hello'");
		expect(result).toBe('"hello\'"');
	});

	it("should handle string with mixed quote types at start and end", () => {
		const result = ensureQuotes("\"hello'");
		expect(result).toBe('""hello\'"');
	});

	it("should handle already quoted empty string with double quotes", () => {
		const result = ensureQuotes('""');
		expect(result).toBe('""');
	});

	it("should handle already quoted empty string with single quotes", () => {
		const result = ensureQuotes("''");
		expect(result).toBe("''");
	});

	it("should handle string with line breaks", () => {
		const result = ensureQuotes("hello\nworld");
		expect(result).toBe('"hello\nworld"');
	});

	it("should handle string with tabs", () => {
		const result = ensureQuotes("hello\tworld");
		expect(result).toBe('"hello\tworld"');
	});

	it("should handle path-like strings", () => {
		const result = ensureQuotes("/path/to/file");
		expect(result).toBe('"/path/to/file"');
	});
});
