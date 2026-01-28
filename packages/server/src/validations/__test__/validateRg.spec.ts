import { describe, expect, it } from "vitest";
import { validateRg } from "../validateRg";

describe("validateRg", () => {
  describe("valid RG formats", () => {
    it("should validate RG with standard formatting", () => {
      const result = validateRg("12.345.678-9");
      expect(result).toBe(true);
    });

    it("should validate RG without formatting", () => {
      const result = validateRg("123456789");
      expect(result).toBe(true);
    });

    it("should validate RG with 8 digits and verifier", () => {
      const result = validateRg("12.345.678-X");
      expect(result).toBe(true);
    });

    it("should validate RG with lowercase x verifier", () => {
      const result = validateRg("12.345.678-x");
      expect(result).toBe(true);
    });

    it("should validate RG with uppercase X verifier", () => {
      const result = validateRg("12345678X");
      expect(result).toBe(true);
    });

    it("should validate RG with 7 digits", () => {
      const result = validateRg("1.234.567-8");
      expect(result).toBe(true);
    });

    it("should validate RG with 8 digits without verifier", () => {
      const result = validateRg("12.345.678");
      expect(result).toBe(true);
    });

    it("should validate RG with 9 digits", () => {
      const result = validateRg("123456789");
      expect(result).toBe(true);
    });
  });

  describe("valid RG with X verifier", () => {
    it("should validate RG ending with uppercase X", () => {
      const result = validateRg("12345678X");
      expect(result).toBe(true);
    });

    it("should validate RG ending with lowercase x", () => {
      const result = validateRg("12345678x");
      expect(result).toBe(true);
    });

    it("should validate formatted RG with X", () => {
      const result = validateRg("12.345.678-X");
      expect(result).toBe(true);
    });

    it("should validate formatted RG with x", () => {
      const result = validateRg("12.345.678-x");
      expect(result).toBe(true);
    });
  });

  describe("invalid RG length", () => {
    it("should reject RG with less than 7 digits", () => {
      const result = validateRg("123456");
      expect(result).toBe(false);
    });

    it("should reject RG with more than 9 characters", () => {
      const result = validateRg("1234567890");
      expect(result).toBe(false);
    });

    it("should reject very short RG", () => {
      const result = validateRg("123");
      expect(result).toBe(false);
    });

    it("should reject very long RG", () => {
      const result = validateRg("12345678901234");
      expect(result).toBe(false);
    });

    it("should reject RG with only 6 digits", () => {
      const result = validateRg("1.234.56");
      expect(result).toBe(false);
    });

    it("should reject RG with 10 digits", () => {
      const result = validateRg("12.345.678.90");
      expect(result).toBe(false);
    });
  });

  describe("invalid RG formats", () => {
    it("should reject RG with letters in the middle", () => {
      const result = validateRg("12A45678");
      expect(result).toBe(false);
    });

    it("should reject RG with multiple letters", () => {
      const result = validateRg("1234567XY");
      expect(result).toBe(false);
    });

    it("should reject RG starting with letter", () => {
      const result = validateRg("A12345678");
      expect(result).toBe(false);
    });

    it("should reject RG with letter in middle position", () => {
      const result = validateRg("1234X5678");
      expect(result).toBe(false);
    });

    it("should reject RG with special characters other than dot and hyphen", () => {
      const result = validateRg("12@345#678");
      expect(result).toBe(false);
    });

    it("should reject RG with spaces", () => {
      const result = validateRg("12 345 678");
      expect(result).toBe(false);
    });

    it("should reject RG with slashes", () => {
      const result = validateRg("12/345/678");
      expect(result).toBe(false);
    });

    it("should reject RG with parentheses", () => {
      const result = validateRg("(12)345678");
      expect(result).toBe(false);
    });
  });

  describe("formatting variations", () => {
    it("should validate RG with dots only", () => {
      const result = validateRg("12.345.6789");
      expect(result).toBe(true);
    });

    it("should validate RG with hyphen only", () => {
      const result = validateRg("12345678-9");
      expect(result).toBe(true);
    });

    it("should validate RG with both dots and hyphen", () => {
      const result = validateRg("12.345.678-9");
      expect(result).toBe(true);
    });

    it("should validate RG without any formatting", () => {
      const result = validateRg("123456789");
      expect(result).toBe(true);
    });

    it("should handle multiple dots", () => {
      const result = validateRg("12..345..678");
      expect(result).toBe(true);
    });

    it("should handle multiple hyphens", () => {
      const result = validateRg("12345678--9");
      expect(result).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should reject empty string", () => {
      const result = validateRg("");
      expect(result).toBe(false);
    });

    it("should reject whitespace", () => {
      const result = validateRg("   ");
      expect(result).toBe(false);
    });

    it("should reject only dots and hyphens", () => {
      const result = validateRg("..--..--");
      expect(result).toBe(false);
    });

    it("should reject only letters", () => {
      const result = validateRg("ABCDEFGH");
      expect(result).toBe(false);
    });

    it("should handle RG with leading zeros", () => {
      const result = validateRg("00.123.456-7");
      expect(result).toBe(true);
    });

    it("should handle RG with all zeros except verifier", () => {
      const result = validateRg("00.000.000-1");
      expect(result).toBe(true);
    });

    it("should reject tabs and newlines", () => {
      const result = validateRg("\t\n");
      expect(result).toBe(false);
    });
  });

  describe("real-world RG examples", () => {
    it("should validate São Paulo RG format", () => {
      const result = validateRg("12.345.678-9");
      expect(result).toBe(true);
    });

    it("should validate Rio de Janeiro RG format", () => {
      const result = validateRg("12.345.678-X");
      expect(result).toBe(true);
    });

    it("should validate Minas Gerais RG format", () => {
      const result = validateRg("12.345.678");
      expect(result).toBe(true);
    });

    it("should validate RG with 7 digits common format", () => {
      const result = validateRg("1234567");
      expect(result).toBe(true);
    });
  });

  describe("boundary testing", () => {
    it("should validate minimum length RG (7 digits)", () => {
      const result = validateRg("1234567");
      expect(result).toBe(true);
    });

    it("should validate maximum length RG (9 characters)", () => {
      const result = validateRg("12345678X");
      expect(result).toBe(true);
    });

    it("should reject RG just below minimum (6 digits)", () => {
      const result = validateRg("123456");
      expect(result).toBe(false);
    });

    it("should reject RG just above maximum (10 characters)", () => {
      const result = validateRg("123456789X");
      expect(result).toBe(false);
    });
  });

  describe("verifier digit validation", () => {
    it("should validate numeric verifier", () => {
      const result = validateRg("12345678-9");
      expect(result).toBe(true);
    });

    it("should validate X verifier at the end", () => {
      const result = validateRg("12345678-X");
      expect(result).toBe(true);
    });

    it("should validate x verifier at the end", () => {
      const result = validateRg("12345678-x");
      expect(result).toBe(true);
    });

    it("should reject letter verifier other than X", () => {
      const result = validateRg("12345678-Y");
      expect(result).toBe(false);
    });

    it("should reject letter verifier other than X (lowercase)", () => {
      const result = validateRg("12345678-y");
      expect(result).toBe(false);
    });
  });

  describe("state-specific formats", () => {
    it("should validate RG without verifier digit", () => {
      const result = validateRg("12345678");
      expect(result).toBe(true);
    });

    it("should validate RG with verifier digit", () => {
      const result = validateRg("123456789");
      expect(result).toBe(true);
    });

    it("should validate RG with X verifier (common in some states)", () => {
      const result = validateRg("12345678X");
      expect(result).toBe(true);
    });
  });
});
