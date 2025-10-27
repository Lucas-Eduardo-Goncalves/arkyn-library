import { describe, it, expect } from "vitest";
import { validatePhone } from "../validatePhone";

describe("validatePhone", () => {
  it("should return true for valid Brazilian phone numbers", () => {
    expect(validatePhone("+55 32912345678")).toBe(true); // Valid with 9th digit
    expect(validatePhone("+55 3212345678")).toBe(true); // Valid without 9th digit
  });

  it("should return false for invalid Brazilian phone numbers", () => {
    expect(validatePhone("+5532912345678")).toBe(false); // Missing space
    expect(validatePhone("+55 123456789")).toBe(false); // Invalid format
  });

  it("should return true for valid American Samoa phone numbers", () => {
    expect(validatePhone("+1-684 1234567")).toBe(true); // Valid format
  });

  it("should return false for invalid phone numbers", () => {
    expect(validatePhone("+1-684 12345")).toBe(false); // Too few digits
    expect(validatePhone("+99 1234567890")).toBe(false); // Non-existent country code
  });

  it("should return true for valid phone numbers from other countries", () => {
    expect(validatePhone("+44 1234567890")).toBe(true); // Example for UK
    expect(validatePhone("+91 9876543210")).toBe(true); // Example for India
  });

  it("should return false for phone numbers with incorrect prefixes", () => {
    expect(validatePhone("+44-20 12345678")).toBe(false); // Invalid prefix for UK
    expect(validatePhone("+91-80 12345678")).toBe(false); // Invalid prefix for India
  });

  it("should handle edge cases gracefully", () => {
    expect(validatePhone("")).toBe(false); // Empty string
    expect(validatePhone("+55")).toBe(false); // Only country code
    expect(validatePhone("+55 329123456789")).toBe(false); // Too many digits
  });
});
