import { describe, expect, it } from "vitest";
import { validateCep } from "../validateCep";

describe("validateCep", () => {
  it("should return true for a valid CEP with formatting", () => {
    const validCep = "12345-678";
    expect(validateCep(validCep)).toBe(true);
  });

  it("should return true for a valid CEP without formatting", () => {
    const validCep = "12345678";
    expect(validateCep(validCep)).toBe(true);
  });

  it("should return false for a CEP with letters", () => {
    const invalidCep = "ABCDE-123";
    expect(validateCep(invalidCep)).toBe(false);
  });

  it("should return false for a CEP with special characters", () => {
    const invalidCep = "12345@678";
    expect(validateCep(invalidCep)).toBe(false);
  });

  it("should return false for a CEP with invalid length", () => {
    const shortCep = "12345";
    const longCep = "123456789";
    expect(validateCep(shortCep)).toBe(false);
    expect(validateCep(longCep)).toBe(false);
  });

  it("should return false for an empty CEP", () => {
    expect(validateCep("")).toBe(false);
  });

  it("should return false for a null or undefined CEP", () => {
    expect(validateCep(null as unknown as string)).toBe(false);
    expect(validateCep(undefined as unknown as string)).toBe(false);
  });
});
