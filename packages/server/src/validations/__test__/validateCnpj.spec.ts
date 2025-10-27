import { describe, expect, it } from "vitest";
import { validateCnpj } from "../validateCnpj";

describe("validateCnpj", () => {
  it("should return true for a valid CNPJ", () => {
    const validCnpj = "11.444.777/0001-61";
    expect(validateCnpj(validCnpj)).toBe(true);
  });

  it("should return false for an invalid CNPJ", () => {
    const invalidCnpj = "12.345.679/0001-95";
    expect(validateCnpj(invalidCnpj)).toBe(false);
  });

  it("should return false for a CNPJ with all digits equal", () => {
    const invalidCnpj = "11111111111111";
    expect(validateCnpj(invalidCnpj)).toBe(false);
  });

  it("should return false for a CNPJ with invalid length", () => {
    const shortCnpj = "12345678";
    const longCnpj = "123456789012345";
    expect(validateCnpj(shortCnpj)).toBe(false);
    expect(validateCnpj(longCnpj)).toBe(false);
  });

  it("should return false for an empty CNPJ", () => {
    expect(validateCnpj("")).toBe(false);
  });

  it("should return false for a null or undefined CNPJ", () => {
    expect(validateCnpj(null as unknown as string)).toBe(false);
    expect(validateCnpj(undefined as unknown as string)).toBe(false);
  });

  it("should handle CNPJs with non-digit characters", () => {
    const validCnpj = "11.444.777/0001-61";
    const formattedCnpj = "11444777000161";
    expect(validateCnpj(validCnpj)).toBe(true);
    expect(validateCnpj(formattedCnpj)).toBe(true);
  });
});
