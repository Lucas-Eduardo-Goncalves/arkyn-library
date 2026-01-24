import { describe, expect, it } from "vitest";
import { formatToCpf } from "../formatToCpf";

describe("formatToCpf", () => {
  describe("valid CPF formatting", () => {
    it("should format a valid 11-digit CPF", () => {
      const result = formatToCpf("12345678909");
      expect(result).toBe("123.456.789-09");
    });

    it("should format a CPF that already has formatting", () => {
      const result = formatToCpf("123.456.789-09");
      expect(result).toBe("123.456.789-09");
    });

    it("should format a CPF with dots only", () => {
      const result = formatToCpf("123.456.789.09");
      expect(result).toBe("123.456.789-09");
    });

    it("should format a CPF with spaces", () => {
      const result = formatToCpf("123 456 789 09");
      expect(result).toBe("123.456.789-09");
    });

    it("should format a CPF with mixed special characters", () => {
      const result = formatToCpf("123.456.789/09");
      expect(result).toBe("123.456.789-09");
    });

    it("should format a CPF with hyphens only", () => {
      const result = formatToCpf("123-456-789-09");
      expect(result).toBe("123.456.789-09");
    });

    it("should format a CPF with slashes", () => {
      const result = formatToCpf("123/456/789/09");
      expect(result).toBe("123.456.789-09");
    });

    it("should format a real CPF", () => {
      const result = formatToCpf("11122233344");
      expect(result).toBe("111.222.333-44");
    });

    it("should format a CPF starting with zeros", () => {
      const result = formatToCpf("00000000011");
      expect(result).toBe("000.000.000-11");
    });

    it("should format a CPF with parentheses", () => {
      const result = formatToCpf("(123)(456)(789)(09)");
      expect(result).toBe("123.456.789-09");
    });
  });

  describe("error handling", () => {
    it("should throw error for CPF with less than 11 digits", () => {
      expect(() => {
        formatToCpf("1234567890");
      }).toThrow("CPF must be contain 11 numeric digits: 1234567890");
    });

    it("should throw error for CPF with more than 11 digits", () => {
      expect(() => {
        formatToCpf("123456789012");
      }).toThrow("CPF must be contain 11 numeric digits: 123456789012");
    });

    it("should throw error for empty string", () => {
      expect(() => {
        formatToCpf("");
      }).toThrow("CPF must be contain 11 numeric digits: ");
    });

    it("should throw error for only special characters", () => {
      expect(() => {
        formatToCpf("...---///");
      }).toThrow("CPF must be contain 11 numeric digits: ...---///");
    });

    it("should throw error for letters only", () => {
      expect(() => {
        formatToCpf("abcdefghijk");
      }).toThrow("CPF must be contain 11 numeric digits: abcdefghijk");
    });

    it("should throw error for mixed letters and numbers", () => {
      expect(() => {
        formatToCpf("123456abc09");
      }).toThrow("CPF must be contain 11 numeric digits: 123456abc09");
    });

    it("should throw error for CPF with only 1 digit", () => {
      expect(() => {
        formatToCpf("1");
      }).toThrow("CPF must be contain 11 numeric digits: 1");
    });

    it("should throw error for CPF with only 9 digits", () => {
      expect(() => {
        formatToCpf("123456789");
      }).toThrow("CPF must be contain 11 numeric digits: 123456789");
    });

    it("should throw error for CPF with 10 digits", () => {
      expect(() => {
        formatToCpf("1234567890");
      }).toThrow("CPF must be contain 11 numeric digits: 1234567890");
    });

    it("should throw error for CPF with 12 digits", () => {
      expect(() => {
        formatToCpf("123456789012");
      }).toThrow("CPF must be contain 11 numeric digits: 123456789012");
    });
  });

  describe("edge cases", () => {
    it("should handle CPF with all zeros", () => {
      const result = formatToCpf("00000000000");
      expect(result).toBe("000.000.000-00");
    });

    it("should handle CPF with all nines", () => {
      const result = formatToCpf("99999999999");
      expect(result).toBe("999.999.999-99");
    });

    it("should handle CPF with multiple dots", () => {
      const result = formatToCpf("123..456..789..09");
      expect(result).toBe("123.456.789-09");
    });

    it("should handle CPF with multiple hyphens", () => {
      const result = formatToCpf("123--456--789--09");
      expect(result).toBe("123.456.789-09");
    });

    it("should handle CPF with tabs and newlines", () => {
      const result = formatToCpf("12345678\t9\n09");
      expect(result).toBe("123.456.789-09");
    });

    it("should handle CPF with leading and trailing spaces", () => {
      const result = formatToCpf("  12345678909  ");
      expect(result).toBe("123.456.789-09");
    });

    it("should handle CPF with mixed formatting styles", () => {
      const result = formatToCpf("123.456-789/09");
      expect(result).toBe("123.456.789-09");
    });

    it("should handle CPF with underscores", () => {
      const result = formatToCpf("123_456_789_09");
      expect(result).toBe("123.456.789-09");
    });
  });
});
