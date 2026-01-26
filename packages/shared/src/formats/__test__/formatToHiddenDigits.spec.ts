import { describe, expect, it } from "vitest";
import { formatToHiddenDigits } from "../formatToHiddenDigits";

describe("formatToHiddenDigits", () => {
  describe("basic digit hiding", () => {
    it("should hide first 3 digits by default", () => {
      const result = formatToHiddenDigits("1234567890", { range: 3 });
      expect(result).toBe("***4567890");
    });

    it("should hide digits with default options", () => {
      const result = formatToHiddenDigits("1234567890", {});
      expect(result).toBe("***4567890");
    });

    it("should hide specific number of first digits", () => {
      const result = formatToHiddenDigits("1234567890", { range: 5 });
      expect(result).toBe("*****67890");
    });

    it("should hide all digits when range equals total digits", () => {
      const result = formatToHiddenDigits("12345", { range: 5 });
      expect(result).toBe("*****");
    });

    it("should not hide any digits when range is 0", () => {
      const result = formatToHiddenDigits("1234567890", { range: 0 });
      expect(result).toBe("1234567890");
    });
  });

  describe("negative range (hide last digits)", () => {
    it("should hide last 3 digits with negative range", () => {
      const result = formatToHiddenDigits("1234567890", { range: -3 });
      expect(result).toBe("1234567***");
    });

    it("should hide last 5 digits with negative range", () => {
      const result = formatToHiddenDigits("1234567890", { range: -5 });
      expect(result).toBe("12345*****");
    });

    it("should hide last digit with -1 range", () => {
      const result = formatToHiddenDigits("1234567890", { range: -1 });
      expect(result).toBe("123456789*");
    });

    it("should hide all digits with negative range equal to total", () => {
      const result = formatToHiddenDigits("12345", { range: -5 });
      expect(result).toBe("*****");
    });
  });

  describe("tuple range [start, end]", () => {
    it("should hide digits in specific range", () => {
      const result = formatToHiddenDigits("1234567890", { range: [4, 6] });
      expect(result).toBe("123***7890");
    });

    it("should hide middle digits", () => {
      const result = formatToHiddenDigits("1234567890", { range: [3, 7] });
      expect(result).toBe("12*****890");
    });

    it("should hide single digit with range [n, n]", () => {
      const result = formatToHiddenDigits("1234567890", { range: [5, 5] });
      expect(result).toBe("1234*67890");
    });

    it("should hide first digit with range [1, 1]", () => {
      const result = formatToHiddenDigits("1234567890", { range: [1, 1] });
      expect(result).toBe("*234567890");
    });

    it("should hide last digit with range [10, 10]", () => {
      const result = formatToHiddenDigits("1234567890", { range: [10, 10] });
      expect(result).toBe("123456789*");
    });

    it("should hide all digits with full range", () => {
      const result = formatToHiddenDigits("12345", { range: [1, 5] });
      expect(result).toBe("*****");
    });
  });

  describe("custom hider character", () => {
    it("should use custom hider character", () => {
      const result = formatToHiddenDigits("1234567890", {
        range: 3,
        hider: "#",
      });
      expect(result).toBe("###4567890");
    });

    it("should use dot as hider", () => {
      const result = formatToHiddenDigits("1234567890", {
        range: 3,
        hider: ".",
      });
      expect(result).toBe("...4567890");
    });

    it("should use X as hider", () => {
      const result = formatToHiddenDigits("1234567890", {
        range: 3,
        hider: "X",
      });
      expect(result).toBe("XXX4567890");
    });

    it("should use underscore as hider", () => {
      const result = formatToHiddenDigits("1234567890", {
        range: [4, 6],
        hider: "_",
      });
      expect(result).toBe("123___7890");
    });
  });

  describe("formatted inputs (with special characters)", () => {
    it("should hide digits in phone number format", () => {
      const result = formatToHiddenDigits("123-456-7890", { range: 3 });
      expect(result).toBe("***-456-7890");
    });

    it("should hide digits in CPF format", () => {
      const result = formatToHiddenDigits("123.456.789-09", {
        range: [4, 6],
        hider: "*",
      });

      expect(result).toBe("123.***.789-09");
    });

    it("should hide digits in credit card format", () => {
      const result = formatToHiddenDigits("1234 5678 9012 3456", {
        range: [5, 12],
      });
      expect(result).toBe("1234 **** **** 3456");
    });

    it("should preserve formatting characters", () => {
      const result = formatToHiddenDigits("(123) 456-7890", { range: 3 });
      expect(result).toBe("(***) 456-7890");
    });

    it("should handle dots and hyphens", () => {
      const result = formatToHiddenDigits("12.34-56.78", { range: [3, 6] });
      expect(result).toBe("12.**-**.78");
    });
  });

  describe("edge cases", () => {
    it("should handle empty string", () => {
      const result = formatToHiddenDigits("", { range: 3 });
      expect(result).toBe("");
    });

    it("should handle string with no digits", () => {
      const result = formatToHiddenDigits("abcdef", { range: 3 });
      expect(result).toBe("abcdef");
    });

    it("should handle string with only special characters", () => {
      const result = formatToHiddenDigits("---///...", { range: 3 });
      expect(result).toBe("---///...");
    });

    it("should handle single digit", () => {
      const result = formatToHiddenDigits("5", { range: 1 });
      expect(result).toBe("*");
    });

    it("should handle mixed alphanumeric", () => {
      const result = formatToHiddenDigits("abc123def456", { range: 3 });
      expect(result).toBe("abc***def456");
    });

    it("should handle range larger than total digits", () => {
      const result = formatToHiddenDigits("12345", { range: 10 });
      expect(result).toBe("*****");
    });

    it("should handle negative range larger than total digits", () => {
      const result = formatToHiddenDigits("12345", { range: -10 });
      expect(result).toBe("*****");
    });
  });

  describe("real-world scenarios", () => {
    it("should hide SSN middle digits", () => {
      const result = formatToHiddenDigits("123-45-6789", {
        range: [4, 5],
        hider: "*",
      });
      expect(result).toBe("123-**-6789");
    });

    it("should hide credit card middle numbers", () => {
      const result = formatToHiddenDigits("4532 1488 0343 6467", {
        range: [5, 12],
        hider: "*",
      });
      expect(result).toBe("4532 **** **** 6467");
    });

    it("should hide CPF first digits", () => {
      const result = formatToHiddenDigits("123.456.789-09", { range: 3 });
      expect(result).toBe("***.456.789-09");
    });

    it("should hide phone number area code", () => {
      const result = formatToHiddenDigits("(11) 98765-4321", {
        range: [1, 2],
        hider: "*",
      });
      expect(result).toBe("(**) 98765-4321");
    });

    it("should hide last 4 digits of account number", () => {
      const result = formatToHiddenDigits("1234-5678-9012-3456", {
        range: -4,
        hider: "X",
      });
      expect(result).toBe("1234-5678-9012-XXXX");
    });
  });

  describe("boundary testing", () => {
    it("should handle range starting at 0", () => {
      const result = formatToHiddenDigits("1234567890", { range: [0, 3] });
      expect(result).toBe("***4567890");
    });

    it("should handle range exceeding digit count", () => {
      const result = formatToHiddenDigits("12345", { range: [1, 10] });
      expect(result).toBe("*****");
    });

    it("should handle reversed range [higher, lower]", () => {
      const result = formatToHiddenDigits("1234567890", { range: [6, 4] });
      expect(result).toBe("1234567890"); // No digits in range
    });
  });

  describe("special formatting preservation", () => {
    it("should preserve spaces", () => {
      const result = formatToHiddenDigits("12 34 56 78", { range: [3, 4] });
      expect(result).toBe("12 ** 56 78");
    });

    it("should preserve parentheses", () => {
      const result = formatToHiddenDigits("(123)456", { range: 3 });
      expect(result).toBe("(***)456");
    });

    it("should preserve slashes", () => {
      const result = formatToHiddenDigits("12/34/56", { range: [3, 4] });
      expect(result).toBe("12/**/56");
    });

    it("should preserve multiple special characters", () => {
      const result = formatToHiddenDigits("12-34.56/78", { range: [5, 6] });
      expect(result).toBe("12-34.**/78");
    });
  });
});
