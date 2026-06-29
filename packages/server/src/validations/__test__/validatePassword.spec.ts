import { describe, expect, it } from "vitest";
import { validatePassword } from "../validatePassword";

describe("validatePassword", () => {
	describe("valid passwords", () => {
		it("should validate password with all required criteria", () => {
			const result = validatePassword("Senha@123");
			expect(result).toBe(true);
		});

		it("should validate password with different special character", () => {
			const result = validatePassword("Password#456");
			expect(result).toBe(true);
		});

		it("should validate password with underscore", () => {
			const result = validatePassword("Test_Pass1");
			expect(result).toBe(true);
		});

		it("should validate password with hyphen", () => {
			const result = validatePassword("Test-Pass1");
			expect(result).toBe(true);
		});

		it("should validate password with multiple special characters", () => {
			const result = validatePassword("P@ssw0rd!");
			expect(result).toBe(true);
		});

		it("should validate longer password", () => {
			const result = validatePassword("MyS3cur3P@ssword!");
			expect(result).toBe(true);
		});

		it("should validate password with all types of special chars", () => {
			const result = validatePassword("Abc123!@#$%");
			expect(result).toBe(true);
		});
	});

	describe("minimum length requirement", () => {
		it("should reject password with less than 8 characters", () => {
			const result = validatePassword("Ab1@");
			expect(result).toBe(false);
		});

		it("should reject password with exactly 7 characters", () => {
			const result = validatePassword("Ab1@xyz");
			expect(result).toBe(false);
		});

		it("should validate password with exactly 8 characters", () => {
			const result = validatePassword("Ab1@xyzw");
			expect(result).toBe(true);
		});

		it("should validate password with 9 characters", () => {
			const result = validatePassword("Ab1@xyzwk");
			expect(result).toBe(true);
		});
	});

	describe("uppercase letter requirement", () => {
		it("should reject password without uppercase letter", () => {
			const result = validatePassword("senha@123");
			expect(result).toBe(false);
		});

		it("should validate password with one uppercase letter", () => {
			const result = validatePassword("Senha@123");
			expect(result).toBe(true);
		});

		it("should validate password with multiple uppercase letters", () => {
			const result = validatePassword("SENHA@123a");
			expect(result).toBe(true);
		});

		it("should validate password with uppercase at end", () => {
			const result = validatePassword("senha@123A");
			expect(result).toBe(true);
		});
	});

	describe("lowercase letter requirement", () => {
		it("should reject password without lowercase letter", () => {
			const result = validatePassword("SENHA@123");
			expect(result).toBe(false);
		});

		it("should validate password with one lowercase letter", () => {
			const result = validatePassword("SENHa@123");
			expect(result).toBe(true);
		});

		it("should validate password with multiple lowercase letters", () => {
			const result = validatePassword("Senha@123");
			expect(result).toBe(true);
		});
	});

	describe("number requirement", () => {
		it("should reject password without number", () => {
			const result = validatePassword("Senha@abc");
			expect(result).toBe(false);
		});

		it("should validate password with one number", () => {
			const result = validatePassword("Senha@ab1");
			expect(result).toBe(true);
		});

		it("should validate password with multiple numbers", () => {
			const result = validatePassword("Senha@123");
			expect(result).toBe(true);
		});

		it("should validate password with numbers at start", () => {
			const result = validatePassword("1Senha@bc");
			expect(result).toBe(true);
		});

		it("should validate password with numbers at end", () => {
			const result = validatePassword("Senha@abc1");
			expect(result).toBe(true);
		});
	});

	describe("special character requirement", () => {
		it("should reject password without special character", () => {
			const result = validatePassword("Senha123");
			expect(result).toBe(false);
		});

		it("should validate password with @ symbol", () => {
			const result = validatePassword("Senha@123");
			expect(result).toBe(true);
		});

		it("should validate password with # symbol", () => {
			const result = validatePassword("Senha#123");
			expect(result).toBe(true);
		});

		it("should validate password with $ symbol", () => {
			const result = validatePassword("Senha$123");
			expect(result).toBe(true);
		});

		it("should validate password with % symbol", () => {
			const result = validatePassword("Senha%123");
			expect(result).toBe(true);
		});

		it("should validate password with ! symbol", () => {
			const result = validatePassword("Senha!123");
			expect(result).toBe(true);
		});

		it("should validate password with * symbol", () => {
			const result = validatePassword("Senha*123");
			expect(result).toBe(true);
		});

		it("should validate password with & symbol", () => {
			const result = validatePassword("Senha&123");
			expect(result).toBe(true);
		});

		it("should validate password with + symbol", () => {
			const result = validatePassword("Senha+123");
			expect(result).toBe(true);
		});

		it("should validate password with - symbol", () => {
			const result = validatePassword("Senha-123");
			expect(result).toBe(true);
		});

		it("should validate password with _ symbol", () => {
			const result = validatePassword("Senha_123");
			expect(result).toBe(true);
		});

		it("should validate password with = symbol", () => {
			const result = validatePassword("Senha=123");
			expect(result).toBe(true);
		});

		it("should validate password with parentheses", () => {
			const result = validatePassword("Senha(123)");
			expect(result).toBe(true);
		});

		it("should validate password with brackets", () => {
			const result = validatePassword("Senha[123]");
			expect(result).toBe(true);
		});

		it("should validate password with braces", () => {
			const result = validatePassword("Senha{123}");
			expect(result).toBe(true);
		});

		it("should validate password with pipe symbol", () => {
			const result = validatePassword("Senha|123");
			expect(result).toBe(true);
		});

		it("should validate password with backslash", () => {
			const result = validatePassword("Senha\\123");
			expect(result).toBe(true);
		});

		it("should validate password with forward slash", () => {
			const result = validatePassword("Senha/123");
			expect(result).toBe(true);
		});

		it("should validate password with comma", () => {
			const result = validatePassword("Senha,123");
			expect(result).toBe(true);
		});

		it("should validate password with period", () => {
			const result = validatePassword("Senha.123");
			expect(result).toBe(true);
		});

		it("should validate password with question mark", () => {
			const result = validatePassword("Senha?123");
			expect(result).toBe(true);
		});

		it("should validate password with colon", () => {
			const result = validatePassword("Senha:123");
			expect(result).toBe(true);
		});

		it("should validate password with semicolon", () => {
			const result = validatePassword("Senha;123");
			expect(result).toBe(true);
		});

		it("should validate password with quotes", () => {
			const result = validatePassword('Senha"123');
			expect(result).toBe(true);
		});

		it("should validate password with tilde", () => {
			const result = validatePassword("Senha~123");
			expect(result).toBe(true);
		});

		it("should validate password with backtick", () => {
			const result = validatePassword("Senha`123");
			expect(result).toBe(true);
		});

		it("should validate password with less than", () => {
			const result = validatePassword("Senha<123");
			expect(result).toBe(true);
		});

		it("should validate password with greater than", () => {
			const result = validatePassword("Senha>123");
			expect(result).toBe(true);
		});
	});

	describe("edge cases", () => {
		it("should reject empty string", () => {
			const result = validatePassword("");
			expect(result).toBe(false);
		});

		it("should reject whitespace only", () => {
			const result = validatePassword("        ");
			expect(result).toBe(false);
		});

		it("should reject password with only lowercase", () => {
			const result = validatePassword("senhasenha");
			expect(result).toBe(false);
		});

		it("should reject password with only uppercase", () => {
			const result = validatePassword("SENHASENHA");
			expect(result).toBe(false);
		});

		it("should reject password with only numbers", () => {
			const result = validatePassword("12345678");
			expect(result).toBe(false);
		});

		it("should reject password with only special characters", () => {
			const result = validatePassword("!@#$%^&*");
			expect(result).toBe(false);
		});

		it("should handle password with spaces", () => {
			const result = validatePassword("Senha @123");
			expect(result).toBe(true);
		});

		it("should validate very long password", () => {
			const result = validatePassword("MySuperSecureP@ssw0rd123456789!");
			expect(result).toBe(true);
		});
	});

	describe("multiple criteria missing", () => {
		it("should reject password missing uppercase and special char", () => {
			const result = validatePassword("senha123");
			expect(result).toBe(false);
		});

		it("should reject password missing lowercase and number", () => {
			const result = validatePassword("SENHA@ABC");
			expect(result).toBe(false);
		});

		it("should reject password missing number and special char", () => {
			const result = validatePassword("SenhaAbc");
			expect(result).toBe(false);
		});

		it("should reject password missing uppercase, number and special char", () => {
			const result = validatePassword("senhasenha");
			expect(result).toBe(false);
		});
	});

	describe("boundary testing", () => {
		it("should validate minimum valid password", () => {
			const result = validatePassword("Aa1@bcde");
			expect(result).toBe(true);
		});

		it("should validate password at exact 8 characters with all criteria", () => {
			const result = validatePassword("Aa1@bcde");
			expect(result).toBe(true);
		});
	});

	describe("real-world scenarios", () => {
		it("should validate common strong password", () => {
			const result = validatePassword("MyPassword123!");
			expect(result).toBe(true);
		});

		it("should validate password with email-like pattern", () => {
			const result = validatePassword("User@mail1");
			expect(result).toBe(true);
		});

		it("should reject common weak password", () => {
			const result = validatePassword("password");
			expect(result).toBe(false);
		});

		it("should reject sequential numbers", () => {
			const result = validatePassword("Password");
			expect(result).toBe(false);
		});

		it("should validate password with mixed case and symbols", () => {
			const result = validatePassword("P@ssW0rd!");
			expect(result).toBe(true);
		});
	});
});
