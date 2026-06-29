import { describe, expect, it } from "vitest";
import { validateEmail } from "../validateEmail";

describe("validateEmail", () => {
	describe("valid email formats", () => {
		it("should validate standard email format", async () => {
			const result = await validateEmail("user@gmail.com");
			expect(result).toBe(true);
		});

		it("should validate email with subdomain", async () => {
			const result = await validateEmail("user@mail.google.com");
			expect(result).toBe(true);
		});

		it("should validate email with numbers", async () => {
			const result = await validateEmail("user123@gmail.com");
			expect(result).toBe(true);
		});

		it("should validate email with dots in local part", async () => {
			const result = await validateEmail("first.last@gmail.com");
			expect(result).toBe(true);
		});

		it("should validate email with hyphen in domain", async () => {
			const result = await validateEmail("user@my-domain.com");
			expect(result).toBe(true);
		});

		it("should validate email with plus sign", async () => {
			const result = await validateEmail("user+tag@gmail.com");
			expect(result).toBe(true);
		});

		it("should validate email with underscore", async () => {
			const result = await validateEmail("user_name@gmail.com");
			expect(result).toBe(true);
		});
	});

	describe("valid email with special characters", () => {
		it("should validate email with allowed special chars", async () => {
			const result = await validateEmail("user.name+tag@gmail.com");
			expect(result).toBe(true);
		});

		it("should validate email with percent sign", async () => {
			const result = await validateEmail("user%test@gmail.com");
			expect(result).toBe(true);
		});

		it("should validate email with apostrophe", async () => {
			const result = await validateEmail("o'neil@gmail.com");
			expect(result).toBe(true);
		});
	});

	describe("invalid email formats", () => {
		it("should reject email without @", async () => {
			const result = await validateEmail("usergmail.com");
			expect(result).toBe(false);
		});

		it("should reject email with multiple @", async () => {
			const result = await validateEmail("user@@gmail.com");
			expect(result).toBe(false);
		});

		it("should reject email without domain", async () => {
			const result = await validateEmail("user@");
			expect(result).toBe(false);
		});

		it("should reject email without local part", async () => {
			const result = await validateEmail("@gmail.com");
			expect(result).toBe(false);
		});

		it("should reject email with spaces", async () => {
			const result = await validateEmail("user name@gmail.com");
			expect(result).toBe(false);
		});

		it("should reject email with invalid characters", async () => {
			const result = await validateEmail("user#name@gmail.com");
			expect(result).toBe(false);
		});
	});

	describe("local part validation", () => {
		it("should reject email starting with dot", async () => {
			const result = await validateEmail(".user@gmail.com");
			expect(result).toBe(false);
		});

		it("should reject email ending with dot before @", async () => {
			const result = await validateEmail("user.@gmail.com");
			expect(result).toBe(false);
		});

		it("should reject email with consecutive dots", async () => {
			const result = await validateEmail("user..name@gmail.com");
			expect(result).toBe(false);
		});

		it("should reject local part longer than 64 characters", async () => {
			const longLocal = "a".repeat(65);
			const result = await validateEmail(`${longLocal}@gmail.com`);
			expect(result).toBe(false);
		});

		it("should validate local part with 64 characters", async () => {
			const longLocal = "a".repeat(64);
			const result = await validateEmail(`${longLocal}@gmail.com`);
			expect(result).toBe(true);
		});

		it("should reject empty local part", async () => {
			const result = await validateEmail("@gmail.com");
			expect(result).toBe(false);
		});
	});

	describe("domain part validation", () => {
		it("should reject domain starting with dot", async () => {
			const result = await validateEmail("user@.gmail.com");
			expect(result).toBe(false);
		});

		it("should reject domain ending with dot", async () => {
			const result = await validateEmail("user@gmail.com.");
			expect(result).toBe(false);
		});

		it("should reject domain starting with hyphen", async () => {
			const result = await validateEmail("user@-gmail.com");
			expect(result).toBe(false);
		});

		it("should reject domain ending with hyphen", async () => {
			const result = await validateEmail("user@gmail-.com");
			expect(result).toBe(false);
		});

		it("should reject domain without TLD", async () => {
			const result = await validateEmail("user@gmail");
			expect(result).toBe(false);
		});

		it("should reject domain with single character TLD", async () => {
			const result = await validateEmail("user@gmail.c");
			expect(result).toBe(false);
		});

		it("should reject domain longer than 253 characters", async () => {
			const longDomain = `${"a".repeat(250)}.com`;
			const result = await validateEmail(`user@${longDomain}`);
			expect(result).toBe(false);
		});

		it("should reject domain label longer than 63 characters", async () => {
			const longLabel = "a".repeat(64);
			const result = await validateEmail(`user@${longLabel}.com`);
			expect(result).toBe(false);
		});

		it("should reject TLD with numbers", async () => {
			const result = await validateEmail("user@gmail.c0m");
			expect(result).toBe(false);
		});

		it("should reject domain with special characters", async () => {
			const result = await validateEmail("user@gm@il.com");
			expect(result).toBe(false);
		});
	});

	describe("DNS validation", () => {
		it("should validate email with valid DNS records", async () => {
			const result = await validateEmail("test@gmail.com");
			expect(result).toBe(true);
		});

		it("should reject email with invalid domain (no DNS)", async () => {
			const result = await validateEmail(
				"user@thisisnotarealdomain123456789.com",
			);
			expect(result).toBe(false);
		});

		it("should validate email with MX records", async () => {
			const result = await validateEmail("user@outlook.com");
			expect(result).toBe(true);
		});

		it("should validate email with A records", async () => {
			const result = await validateEmail("user@github.com");
			expect(result).toBe(true);
		});
	});

	describe("edge cases", () => {
		it("should reject empty string", async () => {
			const result = await validateEmail("");
			expect(result).toBe(false);
		});

		it("should reject whitespace only", async () => {
			const result = await validateEmail("   ");
			expect(result).toBe(false);
		});

		it("should handle email with leading whitespace", async () => {
			const result = await validateEmail("  user@gmail.com");
			expect(result).toBe(true);
		});

		it("should handle email with trailing whitespace", async () => {
			const result = await validateEmail("user@gmail.com  ");
			expect(result).toBe(true);
		});

		it("should reject email with only @", async () => {
			const result = await validateEmail("@");
			expect(result).toBe(false);
		});

		it("should reject email with only domain", async () => {
			const result = await validateEmail("gmail.com");
			expect(result).toBe(false);
		});
	});

	describe("real-world email providers", () => {
		it("should validate Gmail address", async () => {
			const result = await validateEmail("test@gmail.com");
			expect(result).toBe(true);
		});

		it("should validate Outlook address", async () => {
			const result = await validateEmail("test@outlook.com");
			expect(result).toBe(true);
		});

		it("should validate Yahoo address", async () => {
			const result = await validateEmail("test@yahoo.com");
			expect(result).toBe(true);
		});

		it("should validate Hotmail address", async () => {
			const result = await validateEmail("test@hotmail.com");
			expect(result).toBe(true);
		});

		it("should validate custom domain", async () => {
			const result = await validateEmail("test@company.com");
			expect(result).toBe(true);
		});
	});

	describe("case sensitivity", () => {
		it("should handle uppercase domain", async () => {
			const result = await validateEmail("user@GMAIL.COM");
			expect(result).toBe(true);
		});

		it("should handle mixed case domain", async () => {
			const result = await validateEmail("user@GmAiL.CoM");
			expect(result).toBe(true);
		});

		it("should handle uppercase local part", async () => {
			const result = await validateEmail("USER@gmail.com");
			expect(result).toBe(true);
		});
	});

	describe("international domains", () => {
		it("should validate email with country TLD", async () => {
			const result = await validateEmail("user@example.co.uk");
			expect(result).toBe(true);
		});

		it("should validate email with multiple subdomains", async () => {
			const result = await validateEmail("user@mail.company.co.uk");
			expect(result).toBe(true);
		});
	});

	describe("boundary testing", () => {
		it("should validate minimum valid email", async () => {
			const result = await validateEmail("a@bc.de");
			expect(result).toBe(true);
		});

		it("should validate email at local part max length", async () => {
			const localPart = "a".repeat(64);
			const result = await validateEmail(`${localPart}@gmail.com`);
			expect(result).toBe(true);
		});
	});
});
