import { describe, expect, it } from "vitest";
import { generateSlug } from "../generateSlug";

describe("generateSlug", () => {
	describe("basic slug generation", () => {
		it("should generate slug from simple string", () => {
			const result = generateSlug("Hello World");
			expect(result).toBe("hello-world");
		});

		it("should convert to lowercase", () => {
			const result = generateSlug("HELLO WORLD");
			expect(result).toBe("hello-world");
		});

		it("should replace spaces with hyphens", () => {
			const result = generateSlug("hello world test");
			expect(result).toBe("hello-world-test");
		});

		it("should handle single word", () => {
			const result = generateSlug("Hello");
			expect(result).toBe("hello");
		});

		it("should handle multiple spaces", () => {
			const result = generateSlug("hello    world");
			expect(result).toBe("hello-world");
		});
	});

	describe("special character removal", () => {
		it("should remove punctuation", () => {
			const result = generateSlug("Hello, World!");
			expect(result).toBe("hello-world");
		});

		it("should remove special characters", () => {
			const result = generateSlug("Hello@#$%World");
			expect(result).toBe("helloworld");
		});

		it("should remove parentheses", () => {
			const result = generateSlug("Hello (World)");
			expect(result).toBe("hello-world");
		});

		it("should remove brackets", () => {
			const result = generateSlug("Hello [World]");
			expect(result).toBe("hello-world");
		});

		it("should remove question marks and exclamations", () => {
			const result = generateSlug("Hello? World!");
			expect(result).toBe("hello-world");
		});

		it("should remove dots", () => {
			const result = generateSlug("Hello.World.Test");
			expect(result).toBe("helloworldtest");
		});

		it("should remove commas and semicolons", () => {
			const result = generateSlug("Hello, World; Test");
			expect(result).toBe("hello-world-test");
		});

		it("should remove quotes", () => {
			const result = generateSlug('Hello "World" Test');
			expect(result).toBe("hello-world-test");
		});

		it("should remove apostrophes", () => {
			const result = generateSlug("It's a test");
			expect(result).toBe("its-a-test");
		});
	});

	describe("accent and diacritic removal", () => {
		it("should remove accents from Portuguese", () => {
			const result = generateSlug("Olá Mundo");
			expect(result).toBe("ola-mundo");
		});

		it("should remove accents from French", () => {
			const result = generateSlug("Café");
			expect(result).toBe("cafe");
		});

		it("should remove accents from Spanish", () => {
			const result = generateSlug("Año Niño");
			expect(result).toBe("ano-nino");
		});

		it("should remove accents from German", () => {
			const result = generateSlug("Über Größe");
			expect(result).toBe("uber-groe");
		});

		it("should handle multiple accented characters", () => {
			const result = generateSlug("Açúcar é ótimo");
			expect(result).toBe("acucar-e-otimo");
		});

		it("should handle circumflex accents", () => {
			const result = generateSlug("Crêpe Château");
			expect(result).toBe("crepe-chateau");
		});

		it("should handle tilde accents", () => {
			const result = generateSlug("São Paulo");
			expect(result).toBe("sao-paulo");
		});

		it("should handle cedilla", () => {
			const result = generateSlug("Français");
			expect(result).toBe("francais");
		});
	});

	describe("hyphen handling", () => {
		it("should preserve existing single hyphens", () => {
			const result = generateSlug("hello-world");
			expect(result).toBe("hello-world");
		});

		it("should collapse multiple hyphens", () => {
			const result = generateSlug("hello---world");
			expect(result).toBe("hello-world");
		});

		it("should trim leading hyphens", () => {
			const result = generateSlug("---hello world");
			expect(result).toBe("hello-world");
		});

		it("should trim trailing hyphens", () => {
			const result = generateSlug("hello world---");
			expect(result).toBe("hello-world");
		});

		it("should trim leading and trailing hyphens", () => {
			const result = generateSlug("---hello world---");
			expect(result).toBe("hello-world");
		});

		it("should handle hyphens created from special characters", () => {
			const result = generateSlug("hello!@#world");
			expect(result).toBe("helloworld");
		});
	});

	describe("number handling", () => {
		it("should preserve numbers", () => {
			const result = generateSlug("Hello 123 World");
			expect(result).toBe("hello-123-world");
		});

		it("should handle numbers at start", () => {
			const result = generateSlug("123 Hello World");
			expect(result).toBe("123-hello-world");
		});

		it("should handle numbers at end", () => {
			const result = generateSlug("Hello World 123");
			expect(result).toBe("hello-world-123");
		});

		it("should handle mixed alphanumeric", () => {
			const result = generateSlug("abc123def456");
			expect(result).toBe("abc123def456");
		});
	});

	describe("edge cases", () => {
		it("should handle empty string", () => {
			const result = generateSlug("");
			expect(result).toBe("");
		});

		it("should handle string with only spaces", () => {
			const result = generateSlug("     ");
			expect(result).toBe("");
		});

		it("should handle string with only special characters", () => {
			const result = generateSlug("!@#$%^&*()");
			expect(result).toBe("");
		});

		it("should handle string with only hyphens", () => {
			const result = generateSlug("-----");
			expect(result).toBe("");
		});

		it("should handle single character", () => {
			const result = generateSlug("a");
			expect(result).toBe("a");
		});

		it("should handle underscores", () => {
			const result = generateSlug("hello_world");
			expect(result).toBe("hello_world");
		});

		it("should handle tabs and newlines", () => {
			const result = generateSlug("hello\tworld\ntest");
			expect(result).toBe("hello-world-test");
		});
	});

	describe("real-world scenarios", () => {
		it("should generate slug from article title", () => {
			const result = generateSlug("The Complete Guide to TypeScript in 2024");
			expect(result).toBe("the-complete-guide-to-typescript-in-2024");
		});

		it("should generate slug from blog post title", () => {
			const result = generateSlug(
				"10 Tips & Tricks for Better Web Development!",
			);
			expect(result).toBe("10-tips-tricks-for-better-web-development");
		});

		it("should generate slug from product name", () => {
			const result = generateSlug("MacBook Pro 16-inch (2023)");
			expect(result).toBe("macbook-pro-16-inch-2023");
		});

		it("should generate slug from Portuguese title", () => {
			const result = generateSlug(
				"Como Programar em JavaScript: Guia Completo",
			);
			expect(result).toBe("como-programar-em-javascript-guia-completo");
		});

		it("should generate slug from URL-like string", () => {
			const result = generateSlug("https://example.com/path");
			expect(result).toBe("httpsexamplecompath");
		});

		it("should generate slug from file name", () => {
			const result = generateSlug("my-document-v2.pdf");
			expect(result).toBe("my-document-v2pdf");
		});

		it("should generate slug from sentence", () => {
			const result = generateSlug("Hello, World! This is a Test.");
			expect(result).toBe("hello-world-this-is-a-test");
		});
	});

	describe("whitespace variations", () => {
		it("should handle leading spaces", () => {
			const result = generateSlug("   hello world");
			expect(result).toBe("hello-world");
		});

		it("should handle trailing spaces", () => {
			const result = generateSlug("hello world   ");
			expect(result).toBe("hello-world");
		});

		it("should handle leading and trailing spaces", () => {
			const result = generateSlug("   hello world   ");
			expect(result).toBe("hello-world");
		});

		it("should handle mixed whitespace", () => {
			const result = generateSlug("hello   world\ttest\nfoo");
			expect(result).toBe("hello-world-test-foo");
		});
	});

	describe("Unicode handling", () => {
		it("should handle emoji", () => {
			const result = generateSlug("Hello 🌍 World");
			expect(result).toBe("hello-world");
		});

		it("should handle multiple emoji", () => {
			const result = generateSlug("Hello 😀 World 🎉");
			expect(result).toBe("hello-world");
		});

		it("should handle Chinese characters", () => {
			const result = generateSlug("你好世界");
			expect(result).toBe("");
		});

		it("should handle Arabic characters", () => {
			const result = generateSlug("مرحبا بالعالم");
			expect(result).toBe("");
		});
	});

	describe("mixed content", () => {
		it("should handle mixed case, spaces, and punctuation", () => {
			const result = generateSlug("Hello, WORLD! This Is A Test.");
			expect(result).toBe("hello-world-this-is-a-test");
		});

		it("should handle accents, numbers, and special chars", () => {
			const result = generateSlug("Café #1 - Best in Town!");
			expect(result).toBe("cafe-1-best-in-town");
		});

		it("should handle complex real-world title", () => {
			const result = generateSlug(
				"React.js vs Vue.js: Which One Should You Choose in 2024?",
			);
			expect(result).toBe(
				"reactjs-vs-vuejs-which-one-should-you-choose-in-2024",
			);
		});
	});

	describe("consistency", () => {
		it("should generate same slug for same input", () => {
			const input = "Hello World Test";
			const result1 = generateSlug(input);
			const result2 = generateSlug(input);
			expect(result1).toBe(result2);
		});

		it("should generate same slug regardless of spacing", () => {
			const result1 = generateSlug("hello world");
			const result2 = generateSlug("hello   world");
			const result3 = generateSlug("hello\tworld");
			expect(result1).toBe(result2);
			expect(result2).toBe(result3);
		});
	});
});
