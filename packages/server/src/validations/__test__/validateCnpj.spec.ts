import { describe, expect, it } from "vitest";
import { validateCnpj } from "../validateCnpj";

describe("validateCnpj", () => {
	describe("valid CNPJ formats", () => {
		it("should validate CNPJ with standard formatting", () => {
			const result = validateCnpj("11.444.777/0001-61");
			expect(result).toBe(true);
		});

		it("should validate CNPJ without formatting", () => {
			const result = validateCnpj("11444777000161");
			expect(result).toBe(true);
		});

		it("should validate another valid CNPJ", () => {
			const result = validateCnpj("11.222.333/0001-81");
			expect(result).toBe(true);
		});

		it("should validate real company CNPJ", () => {
			const result = validateCnpj("00.000.000/0001-91");
			expect(result).toBe(true);
		});

		it("should validate CNPJ with different formatting", () => {
			const result = validateCnpj("34.028.316/0001-03");
			expect(result).toBe(true);
		});
	});

	describe("invalid CNPJ check digits", () => {
		it("should reject CNPJ with invalid check digits", () => {
			const result = validateCnpj("11.345.678/0001-95");
			expect(result).toBe(false);
		});

		it("should reject CNPJ with wrong first check digit", () => {
			const result = validateCnpj("11.444.777/0001-51");
			expect(result).toBe(false);
		});

		it("should reject CNPJ with wrong second check digit", () => {
			const result = validateCnpj("11.444.777/0001-60");
			expect(result).toBe(false);
		});

		it("should reject CNPJ with both check digits wrong", () => {
			const result = validateCnpj("11.444.777/0001-00");
			expect(result).toBe(false);
		});
	});

	describe("invalid CNPJ length", () => {
		it("should reject CNPJ with less than 14 digits", () => {
			const result = validateCnpj("11.444.777/0001-6");
			expect(result).toBe(false);
		});

		it("should reject CNPJ with more than 14 digits", () => {
			const result = validateCnpj("11.444.777/0001-611");
			expect(result).toBe(false);
		});

		it("should reject CNPJ with only 13 digits", () => {
			const result = validateCnpj("1144477700016");
			expect(result).toBe(false);
		});

		it("should reject CNPJ with 15 digits", () => {
			const result = validateCnpj("114447770001611");
			expect(result).toBe(false);
		});

		it("should reject very short CNPJ", () => {
			const result = validateCnpj("123");
			expect(result).toBe(false);
		});

		it("should reject very long CNPJ", () => {
			const result = validateCnpj("11444777000161123456");
			expect(result).toBe(false);
		});
	});

	describe("CNPJ with all equal digits", () => {
		it("should reject CNPJ with all zeros", () => {
			const result = validateCnpj("00.000.000/0000-00");
			expect(result).toBe(false);
		});

		it("should reject CNPJ with all ones", () => {
			const result = validateCnpj("11.111.111/1111-11");
			expect(result).toBe(false);
		});

		it("should reject CNPJ with all twos", () => {
			const result = validateCnpj("22.222.222/2222-22");
			expect(result).toBe(false);
		});

		it("should reject CNPJ with all threes", () => {
			const result = validateCnpj("33.333.333/3333-33");
			expect(result).toBe(false);
		});

		it("should reject CNPJ with all fours", () => {
			const result = validateCnpj("44.444.444/4444-44");
			expect(result).toBe(false);
		});

		it("should reject CNPJ with all fives", () => {
			const result = validateCnpj("55.555.555/5555-55");
			expect(result).toBe(false);
		});

		it("should reject CNPJ with all sixes", () => {
			const result = validateCnpj("66.666.666/6666-66");
			expect(result).toBe(false);
		});

		it("should reject CNPJ with all sevens", () => {
			const result = validateCnpj("77.777.777/7777-77");
			expect(result).toBe(false);
		});

		it("should reject CNPJ with all eights", () => {
			const result = validateCnpj("88.888.888/8888-88");
			expect(result).toBe(false);
		});

		it("should reject CNPJ with all nines", () => {
			const result = validateCnpj("99.999.999/9999-99");
			expect(result).toBe(false);
		});
	});

	describe("invalid CNPJ formats", () => {
		it("should reject CNPJ with letters", () => {
			const result = validateCnpj("AB.CDE.FGH/IJKL-MN");
			expect(result).toBe(false);
		});

		it("should reject CNPJ with mixed letters and numbers", () => {
			const result = validateCnpj("11.ABC.777/0001-61");
			expect(result).toBe(false);
		});

		it("should reject CNPJ with special characters only", () => {
			const result = validateCnpj("@@.###.$$$/@@@-**");
			expect(result).toBe(false);
		});

		it("should reject CNPJ with spaces", () => {
			const result = validateCnpj("11 444 777 0001 61");
			expect(result).toBe(false);
		});
	});

	describe("edge cases", () => {
		it("should reject empty string", () => {
			const result = validateCnpj("");
			expect(result).toBe(false);
		});

		it("should reject whitespace", () => {
			const result = validateCnpj("   ");
			expect(result).toBe(false);
		});

		it("should reject null-like values", () => {
			const result = validateCnpj("");
			expect(result).toBe(false);
		});

		it("should reject single digit", () => {
			const result = validateCnpj("1");
			expect(result).toBe(false);
		});

		it("should handle CNPJ with leading zeros", () => {
			const result = validateCnpj("00.000.000/0001-91");
			expect(result).toBe(true);
		});

		it("should reject tabs and newlines", () => {
			const result = validateCnpj("\t\n");
			expect(result).toBe(false);
		});
	});

	describe("formatting variations", () => {
		it("should validate CNPJ without dots", () => {
			const result = validateCnpj("11444777/0001-61");
			expect(result).toBe(true);
		});

		it("should validate CNPJ without slash", () => {
			const result = validateCnpj("11.444.777.0001-61");
			expect(result).toBe(true);
		});

		it("should validate CNPJ without hyphen", () => {
			const result = validateCnpj("11.444.777/000161");
			expect(result).toBe(true);
		});

		it("should validate CNPJ with no formatting", () => {
			const result = validateCnpj("11444777000161");
			expect(result).toBe(true);
		});

		it("should handle extra dots and slashes", () => {
			const result = validateCnpj("11...444...777///0001---61");
			expect(result).toBe(false);
		});
	});

	describe("real-world CNPJ examples", () => {
		it("should validate Petrobras CNPJ", () => {
			const result = validateCnpj("33.000.167/0001-01");
			expect(result).toBe(true);
		});

		it("should validate Banco do Brasil CNPJ", () => {
			const result = validateCnpj("00.000.000/0001-91");
			expect(result).toBe(true);
		});

		it("should validate Vale CNPJ", () => {
			const result = validateCnpj("33.592.510/0001-54");
			expect(result).toBe(true);
		});
	});

	describe("boundary testing", () => {
		it("should handle CNPJ with minimum valid structure", () => {
			const result = validateCnpj("12.345.678/0001-95");
			expect(result).toBe(true);
		});

		it("should handle CNPJ at boundary of check digit calculation", () => {
			const result = validateCnpj("11.222.333/0001-81");
			expect(result).toBe(true);
		});
	});

	describe("check digit calculation edge cases", () => {
		it("should correctly calculate when first digit is 0", () => {
			const result = validateCnpj("00.000.000/0001-91");
			expect(result).toBe(true);
		});

		it("should correctly calculate when second digit is 0", () => {
			const result = validateCnpj("11.222.333/0001-81");
			expect(result).toBe(true);
		});

		it("should correctly calculate when both digits are same", () => {
			const result = validateCnpj("34.028.316/0001-03");
			expect(result).toBe(true);
		});
	});

	describe("sequential and pattern CNPJs", () => {
		it("should reject sequential ascending digits", () => {
			const result = validateCnpj("12.345.678/9012-34");
			expect(result).toBe(false);
		});

		it("should reject sequential descending digits", () => {
			const result = validateCnpj("98.765.432/1098-76");
			expect(result).toBe(false);
		});

		it("should reject alternating pattern", () => {
			const result = validateCnpj("12.121.212/1212-12");
			expect(result).toBe(false);
		});
	});
});
