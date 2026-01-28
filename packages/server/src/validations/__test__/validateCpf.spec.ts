import { describe, expect, it } from "vitest";
import { validateCpf } from "../validateCpf";

describe("validateCpf", () => {
  describe("valid CPF formats", () => {
    it("should validate CPF with standard formatting", () => {
      const result = validateCpf("111.444.777-35");
      expect(result).toBe(true);
    });

    it("should validate CPF without formatting", () => {
      const result = validateCpf("11144477735");
      expect(result).toBe(true);
    });

    it("should validate another valid CPF", () => {
      const result = validateCpf("123.456.789-19");
      expect(result).toBe(false);
    });

    it("should validate real CPF example 1", () => {
      const result = validateCpf("529.982.247-25");
      expect(result).toBe(true);
    });

    it("should validate real CPF example 2", () => {
      const result = validateCpf("464.242.660-46");
      expect(result).toBe(true);
    });

    it("should validate CPF with different formatting", () => {
      const result = validateCpf("576.025.440-56");
      expect(result).toBe(true);
    });
  });

  describe("invalid CPF check digits", () => {
    it("should reject CPF with invalid check digits", () => {
      const result = validateCpf("123.456.789-00");
      expect(result).toBe(false);
    });

    it("should reject CPF with wrong first check digit", () => {
      const result = validateCpf("111.444.777-45");
      expect(result).toBe(false);
    });

    it("should reject CPF with wrong second check digit", () => {
      const result = validateCpf("111.444.777-34");
      expect(result).toBe(false);
    });

    it("should reject CPF with both check digits wrong", () => {
      const result = validateCpf("111.444.777-00");
      expect(result).toBe(false);
    });

    it("should reject CPF with incremented check digits", () => {
      const result = validateCpf("111.444.777-36");
      expect(result).toBe(false);
    });
  });

  describe("invalid CPF length", () => {
    it("should reject CPF with less than 11 digits", () => {
      const result = validateCpf("111.444.777-3");
      expect(result).toBe(false);
    });

    it("should reject CPF with more than 11 digits", () => {
      const result = validateCpf("111.444.777-355");
      expect(result).toBe(false);
    });

    it("should reject CPF with only 10 digits", () => {
      const result = validateCpf("1114447773");
      expect(result).toBe(false);
    });

    it("should reject CPF with 12 digits", () => {
      const result = validateCpf("111444777355");
      expect(result).toBe(false);
    });

    it("should reject very short CPF", () => {
      const result = validateCpf("123");
      expect(result).toBe(false);
    });

    it("should reject very long CPF", () => {
      const result = validateCpf("11144477735123456");
      expect(result).toBe(false);
    });
  });

  describe("CPF with all equal digits", () => {
    it("should reject CPF with all zeros", () => {
      const result = validateCpf("000.000.000-00");
      expect(result).toBe(false);
    });

    it("should reject CPF with all ones", () => {
      const result = validateCpf("111.111.111-11");
      expect(result).toBe(false);
    });

    it("should reject CPF with all twos", () => {
      const result = validateCpf("222.222.222-22");
      expect(result).toBe(false);
    });

    it("should reject CPF with all threes", () => {
      const result = validateCpf("333.333.333-33");
      expect(result).toBe(false);
    });

    it("should reject CPF with all fours", () => {
      const result = validateCpf("444.444.444-44");
      expect(result).toBe(false);
    });

    it("should reject CPF with all fives", () => {
      const result = validateCpf("555.555.555-55");
      expect(result).toBe(false);
    });

    it("should reject CPF with all sixes", () => {
      const result = validateCpf("666.666.666-66");
      expect(result).toBe(false);
    });

    it("should reject CPF with all sevens", () => {
      const result = validateCpf("777.777.777-77");
      expect(result).toBe(false);
    });

    it("should reject CPF with all eights", () => {
      const result = validateCpf("888.888.888-88");
      expect(result).toBe(false);
    });

    it("should reject CPF with all nines", () => {
      const result = validateCpf("999.999.999-99");
      expect(result).toBe(false);
    });
  });

  describe("invalid CPF formats", () => {
    it("should reject CPF with letters", () => {
      const result = validateCpf("ABC.DEF.GHI-JK");
      expect(result).toBe(false);
    });

    it("should reject CPF with mixed letters and numbers", () => {
      const result = validateCpf("111.ABC.777-35");
      expect(result).toBe(false);
    });

    it("should reject CPF with special characters only", () => {
      const result = validateCpf("@@@.###.$$$-**");
      expect(result).toBe(false);
    });

    it("should reject CPF with spaces", () => {
      const result = validateCpf("111 444 777 35");
      expect(result).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should reject empty string", () => {
      const result = validateCpf("");
      expect(result).toBe(false);
    });

    it("should reject whitespace", () => {
      const result = validateCpf("   ");
      expect(result).toBe(false);
    });

    it("should reject null-like values", () => {
      const result = validateCpf("");
      expect(result).toBe(false);
    });

    it("should reject single digit", () => {
      const result = validateCpf("1");
      expect(result).toBe(false);
    });

    it("should handle CPF with leading zeros", () => {
      const result = validateCpf("000.111.222-85");
      expect(result).toBe(true);
    });

    it("should reject tabs and newlines", () => {
      const result = validateCpf("\t\n");
      expect(result).toBe(false);
    });
  });

  describe("formatting variations", () => {
    it("should validate CPF without dots", () => {
      const result = validateCpf("111444777-35");
      expect(result).toBe(true);
    });

    it("should validate CPF without hyphen", () => {
      const result = validateCpf("111.444.77735");
      expect(result).toBe(true);
    });

    it("should validate CPF with no formatting", () => {
      const result = validateCpf("11144477735");
      expect(result).toBe(true);
    });

    it("should handle extra dots and hyphens", () => {
      const result = validateCpf("111...444...777---35");
      expect(result).toBe(false);
    });

    it("should handle mixed formatting characters", () => {
      const result = validateCpf("111/444/777-35");
      expect(result).toBe(true);
    });
  });

  describe("real-world CPF examples", () => {
    it("should validate CPF example 1", () => {
      const result = validateCpf("503.775.420-83");
      expect(result).toBe(true);
    });

    it("should validate CPF example 2", () => {
      const result = validateCpf("019.391.450-66");
      expect(result).toBe(true);
    });

    it("should validate CPF example 3", () => {
      const result = validateCpf("046.042.260-08");
      expect(result).toBe(true);
    });

    it("should validate CPF example 4", () => {
      const result = validateCpf("425.385.430-37");
      expect(result).toBe(true);
    });

    it("should validate CPF starting with zero", () => {
      const result = validateCpf("020.085.550-62");
      expect(result).toBe(true);
    });
  });

  describe("boundary testing", () => {
    it("should handle CPF with minimum valid structure", () => {
      const result = validateCpf("000.000.001-91");
      expect(result).toBe(true);
    });

    it("should handle CPF at boundary of check digit calculation", () => {
      const result = validateCpf("111.222.333-96");
      expect(result).toBe(true);
    });
  });

  describe("check digit calculation edge cases", () => {
    it("should correctly calculate when first digit is 0", () => {
      const result = validateCpf("023.456.789-09");
      expect(result).toBe(false);
    });

    it("should correctly calculate when second digit is 0", () => {
      const result = validateCpf("904.889.520-00");
      expect(result).toBe(true);
    });

    it("should correctly calculate when both digits are same", () => {
      const result = validateCpf("529.982.247-25");
      expect(result).toBe(true);
    });

    it("should handle CPF where rest is less than 2", () => {
      const result = validateCpf("191.925.617-57");
      expect(result).toBe(false);
    });
  });

  describe("sequential and pattern CPFs", () => {
    it("should reject sequential ascending digits", () => {
      const result = validateCpf("123.456.789-10");
      expect(result).toBe(false);
    });

    it("should reject sequential descending digits", () => {
      const result = validateCpf("987.654.321-10");
      expect(result).toBe(false);
    });

    it("should reject alternating pattern", () => {
      const result = validateCpf("121.212.121-21");
      expect(result).toBe(false);
    });

    it("should reject repeating pairs", () => {
      const result = validateCpf("112.233.445-56");
      expect(result).toBe(false);
    });
  });
});
