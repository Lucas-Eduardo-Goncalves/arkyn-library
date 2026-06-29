import { describe, expect, it } from "vitest";
import { generateColorByString } from "../generateColorByString";

describe("generateColorByString", () => {
	describe("color generation consistency", () => {
		it("should generate the same color for the same string", () => {
			const color1 = generateColorByString("hello");
			const color2 = generateColorByString("hello");
			expect(color1).toBe(color2);
		});

		it("should generate different colors for different strings", () => {
			const color1 = generateColorByString("hello");
			const color2 = generateColorByString("world");
			expect(color1).not.toBe(color2);
		});

		it("should be deterministic", () => {
			const results = Array.from({ length: 10 }, () =>
				generateColorByString("test"),
			);
			const allSame = results.every((color) => color === results[0]);
			expect(allSame).toBe(true);
		});

		it("should generate consistent colors across multiple calls", () => {
			const string = "consistent";
			const colors = [
				generateColorByString(string),
				generateColorByString(string),
				generateColorByString(string),
			];
			expect(new Set(colors).size).toBe(1);
		});
	});

	describe("hex color format validation", () => {
		it("should return a valid hex color format", () => {
			const color = generateColorByString("test");
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});

		it("should always start with #", () => {
			const color = generateColorByString("example");
			expect(color.charAt(0)).toBe("#");
		});

		it("should have exactly 7 characters", () => {
			const color = generateColorByString("color");
			expect(color.length).toBe(7);
		});

		it("should contain only valid hex characters", () => {
			const color = generateColorByString("validation");
			const hexRegex = /^#[0-9a-f]+$/;
			expect(hexRegex.test(color)).toBe(true);
		});

		it("should pad with zeros when needed", () => {
			const color = generateColorByString("a");
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
			expect(color.length).toBe(7);
		});
	});

	describe("different input strings", () => {
		it("should generate color for single character", () => {
			const color = generateColorByString("a");
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});

		it("should generate color for long string", () => {
			const longString = "a".repeat(1000);
			const color = generateColorByString(longString);
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});

		it("should generate color for numeric string", () => {
			const color = generateColorByString("123456");
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});

		it("should generate color for alphanumeric string", () => {
			const color = generateColorByString("abc123");
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});

		it("should generate color for string with spaces", () => {
			const color = generateColorByString("hello world");
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});

		it("should generate color for string with special characters", () => {
			const color = generateColorByString("hello@world!");
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});

		it("should generate different colors for uppercase and lowercase", () => {
			const color1 = generateColorByString("HELLO");
			const color2 = generateColorByString("hello");
			expect(color1).not.toBe(color2);
		});
	});

	describe("edge cases", () => {
		it("should handle empty string", () => {
			const color = generateColorByString("");
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});

		it("should handle whitespace string", () => {
			const color = generateColorByString("   ");
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});

		it("should handle newline characters", () => {
			const color = generateColorByString("hello\nworld");
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});

		it("should handle tab characters", () => {
			const color = generateColorByString("hello\tworld");
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});

		it("should handle Unicode characters", () => {
			const color = generateColorByString("hello 🌍");
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});

		it("should handle emoji", () => {
			const color = generateColorByString("😀😁😂");
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});

		it("should handle Chinese characters", () => {
			const color = generateColorByString("你好世界");
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});
	});

	describe("real-world scenarios", () => {
		it("should generate color for user name", () => {
			const color = generateColorByString("John Doe");
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});

		it("should generate color for email", () => {
			const color = generateColorByString("user@example.com");
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});

		it("should generate color for UUID", () => {
			const color = generateColorByString(
				"550e8400-e29b-41d4-a716-446655440000",
			);
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});

		it("should generate different colors for similar names", () => {
			const color1 = generateColorByString("John Doe");
			const color2 = generateColorByString("Jane Doe");
			expect(color1).not.toBe(color2);
		});

		it("should generate color for file path", () => {
			const color = generateColorByString("/path/to/file.txt");
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});

		it("should generate color for URL", () => {
			const color = generateColorByString("https://example.com");
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});
	});

	describe("collision resistance", () => {
		it("should generate different colors for slightly different strings", () => {
			const color1 = generateColorByString("test1");
			const color2 = generateColorByString("test2");
			expect(color1).not.toBe(color2);
		});

		it("should generate different colors for strings with swapped characters", () => {
			const color1 = generateColorByString("ab");
			const color2 = generateColorByString("ba");
			expect(color1).not.toBe(color2);
		});

		it("should generate many unique colors", () => {
			const colors = new Set();
			for (let i = 0; i < 100; i++) {
				colors.add(generateColorByString(`string${i}`));
			}
			// Should have high uniqueness (at least 95% unique)
			expect(colors.size).toBeGreaterThan(95);
		});
	});

	describe("RGB component validation", () => {
		it("should generate valid RGB values", () => {
			const color = generateColorByString("test");
			const r = parseInt(color.substring(1, 3), 16);
			const g = parseInt(color.substring(3, 5), 16);
			const b = parseInt(color.substring(5, 7), 16);

			expect(r).toBeGreaterThanOrEqual(0);
			expect(r).toBeLessThanOrEqual(255);
			expect(g).toBeGreaterThanOrEqual(0);
			expect(g).toBeLessThanOrEqual(255);
			expect(b).toBeGreaterThanOrEqual(0);
			expect(b).toBeLessThanOrEqual(255);
		});

		it("should handle edge RGB values correctly", () => {
			// Test various strings to ensure RGB values are properly clamped
			const strings = ["min", "max", "mid", "test", "example"];
			strings.forEach((str) => {
				const color = generateColorByString(str);
				const r = parseInt(color.substring(1, 3), 16);
				const g = parseInt(color.substring(3, 5), 16);
				const b = parseInt(color.substring(5, 7), 16);

				expect(Number.isNaN(r)).toBe(false);
				expect(Number.isNaN(g)).toBe(false);
				expect(Number.isNaN(b)).toBe(false);
			});
		});
	});

	describe("special string patterns", () => {
		it("should handle repeated characters", () => {
			const color = generateColorByString("aaaaaaa");
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});

		it("should handle alternating characters", () => {
			const color = generateColorByString("ababababab");
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});

		it("should handle palindrome strings", () => {
			const color = generateColorByString("racecar");
			expect(color).toMatch(/^#[0-9a-f]{6}$/);
		});
	});
});
