import { describe, expect, it } from "vitest";
import { formatToCurrency } from "../formatToCurrency";

describe("formatToCurrency", () => {
  describe("USD formatting", () => {
    it("should format USD with prefix", () => {
      const result = formatToCurrency(1234.56, "USD", { showPrefix: true });
      expect(result).toBe("$1,234.56");
    });

    it("should format USD without prefix", () => {
      const result = formatToCurrency(1234.56, "USD", { showPrefix: false });
      expect(result).toBe("1,234.56");
    });

    it("should format USD with default config (prefix shown)", () => {
      const result = formatToCurrency(1234.56, "USD");
      expect(result).toBe("$1,234.56");
    });

    it("should format zero in USD", () => {
      const result = formatToCurrency(0, "USD", { showPrefix: true });
      expect(result).toBe("$0.00");
    });

    it("should format negative value in USD", () => {
      const result = formatToCurrency(-1234.56, "USD", { showPrefix: true });
      expect(result).toContain("1,234.56");
    });

    it("should format large value in USD", () => {
      const result = formatToCurrency(1234567.89, "USD", { showPrefix: true });
      expect(result).toBe("$1,234,567.89");
    });
  });

  describe("BRL formatting", () => {
    it("should format BRL with prefix", () => {
      const result = formatToCurrency(1234.56, "BRL", { showPrefix: true });
      expect(result).toContain("1.234,56");
      expect(result).toContain("R$");
    });

    it("should format BRL without prefix", () => {
      const result = formatToCurrency(1234.56, "BRL", { showPrefix: false });
      expect(result).toBe("1.234,56");
    });

    it("should format BRL with default config (prefix shown)", () => {
      const result = formatToCurrency(1234.56, "BRL");
      expect(result).toContain("1.234,56");
      expect(result).toContain("R$");
    });

    it("should format zero in BRL", () => {
      const result = formatToCurrency(0, "BRL", { showPrefix: true });
      expect(result).toContain("0,00");
    });

    it("should format negative value in BRL", () => {
      const result = formatToCurrency(-1234.56, "BRL", { showPrefix: true });
      expect(result).toContain("1.234,56");
    });

    it("should format large value in BRL", () => {
      const result = formatToCurrency(1234567.89, "BRL", { showPrefix: true });
      expect(result).toContain("1.234.567,89");
    });
  });

  describe("EUR formatting", () => {
    it("should format EUR with prefix", () => {
      const result = formatToCurrency(1234.56, "EUR", { showPrefix: true });
      expect(result).toContain("1.234,56");
      expect(result).toContain("€");
    });

    it("should format EUR without prefix", () => {
      const result = formatToCurrency(1234.56, "EUR", { showPrefix: false });
      expect(result).toBe("1.234,56");
    });

    it("should format zero in EUR", () => {
      const result = formatToCurrency(0, "EUR", { showPrefix: true });
      expect(result).toContain("0,00");
    });

    it("should format large value in EUR", () => {
      const result = formatToCurrency(1234567.89, "EUR", { showPrefix: true });
      expect(result).toContain("1.234.567,89");
    });
  });

  describe("GBP formatting", () => {
    it("should format GBP with prefix", () => {
      const result = formatToCurrency(1234.56, "GBP", { showPrefix: true });
      expect(result).toContain("1,234.56");
      expect(result).toContain("£");
    });

    it("should format GBP without prefix", () => {
      const result = formatToCurrency(1234.56, "GBP", { showPrefix: false });
      expect(result).toBe("1,234.56");
    });

    it("should format zero in GBP", () => {
      const result = formatToCurrency(0, "GBP", { showPrefix: true });
      expect(result).toContain("0.00");
    });
  });

  describe("JPY formatting", () => {
    it("should format JPY with prefix", () => {
      const result = formatToCurrency(1234, "JPY", { showPrefix: true });
      expect(result).toContain("1,234");
      expect(result).toContain("￥");
    });

    it("should format JPY without prefix", () => {
      const result = formatToCurrency(1234, "JPY", { showPrefix: false });
      expect(result).toBe("1,234");
    });

    it("should format JPY without decimals", () => {
      const result = formatToCurrency(1234.56, "JPY", { showPrefix: true });
      expect(result).toContain("1,235");
    });
  });

  describe("edge cases", () => {
    it("should handle very small decimal values", () => {
      const result = formatToCurrency(0.01, "USD", { showPrefix: true });
      expect(result).toBe("$0.01");
    });

    it("should handle very large values", () => {
      const result = formatToCurrency(999999999.99, "USD", {
        showPrefix: true,
      });
      expect(result).toBe("$999,999,999.99");
    });

    it("should handle fractional cents (rounds)", () => {
      const result = formatToCurrency(1.005, "USD", { showPrefix: true });
      expect(result).toContain("1.0");
    });

    it("should format negative zero", () => {
      const result = formatToCurrency(-0, "USD", { showPrefix: true });
      expect(result).toBe("-$0.00");
    });

    it("should handle one cent", () => {
      const result = formatToCurrency(0.01, "BRL", { showPrefix: false });
      expect(result).toBe("0,01");
    });

    it("should handle million values in BRL", () => {
      const result = formatToCurrency(1000000, "BRL", { showPrefix: false });
      expect(result).toBe("1.000.000,00");
    });
  });

  describe("error handling", () => {
    it("should throw error for unsupported currency", () => {
      expect(() => {
        // @ts-expect-error - Testing invalid currency
        formatToCurrency(1234.56, "INVALID");
      }).toThrow("Unsupported currency code");
    });

    it("should throw error for null currency", () => {
      expect(() => {
        // @ts-expect-error - Testing null currency
        formatToCurrency(1234.56, null);
      }).toThrow("Unsupported currency code");
    });

    it("should throw error for undefined currency", () => {
      expect(() => {
        // @ts-expect-error - Testing undefined currency
        formatToCurrency(1234.56, undefined);
      }).toThrow("Unsupported currency code");
    });
  });

  describe("config variations", () => {
    it("should handle empty config object", () => {
      const result = formatToCurrency(1234.56, "USD", {});
      expect(result).toBe("$1,234.56");
    });

    it("should handle undefined config", () => {
      const result = formatToCurrency(1234.56, "USD", undefined);
      expect(result).toBe("$1,234.56");
    });

    it("should respect showPrefix: false for all currencies", () => {
      const usd = formatToCurrency(100, "USD", { showPrefix: false });
      const brl = formatToCurrency(100, "BRL", { showPrefix: false });
      const eur = formatToCurrency(100, "EUR", { showPrefix: false });

      expect(usd).not.toContain("$");
      expect(brl).not.toContain("R$");
      expect(eur).not.toContain("€");
    });

    it("should respect showPrefix: true for all currencies", () => {
      const usd = formatToCurrency(100, "USD", { showPrefix: true });
      const brl = formatToCurrency(100, "BRL", { showPrefix: true });
      const eur = formatToCurrency(100, "EUR", { showPrefix: true });

      expect(usd).toContain("$");
      expect(brl).toContain("R$");
      expect(eur).toContain("€");
    });
  });

  describe("decimal handling", () => {
    it("should round to 2 decimal places for USD", () => {
      const result = formatToCurrency(1234.5678, "USD", { showPrefix: false });
      expect(result).toBe("1,234.57");
    });

    it("should round to 2 decimal places for BRL", () => {
      const result = formatToCurrency(1234.5678, "BRL", { showPrefix: false });
      expect(result).toBe("1.234,57");
    });

    it("should handle single decimal place", () => {
      const result = formatToCurrency(1234.5, "USD", { showPrefix: false });
      expect(result).toBe("1,234.50");
    });

    it("should handle no decimal places", () => {
      const result = formatToCurrency(1234, "USD", { showPrefix: false });
      expect(result).toBe("1,234.00");
    });
  });
});
