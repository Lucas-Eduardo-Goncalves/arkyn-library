import { describe, expect, it } from "vitest";
import { validateRg } from "../validateRg";

describe("validateRg", () => {
  it("should return true for a valid RG with formatting", () => {
    const validRg = "12.345.678-9";
    expect(validateRg(validRg)).toBe(true);
  });

  it("should return true for a valid RG without formatting", () => {
    const validRg = "123456789";
    expect(validateRg(validRg)).toBe(true);
  });

  it("should return true for a valid RG with a verifier letter", () => {
    const validRg = "12345678X";
    expect(validateRg(validRg)).toBe(true);
  });

  it("should return false for an RG with invalid length (too short)", () => {
    const invalidRg = "123456";
    expect(validateRg(invalidRg)).toBe(false);
  });

  it("should return false for an RG with invalid length (too long)", () => {
    const invalidRg = "1234567890";
    expect(validateRg(invalidRg)).toBe(false);
  });

  it("should return false for an RG with special characters", () => {
    const invalidRg = "12.345.678@9";
    expect(validateRg(invalidRg)).toBe(false);
  });

  it("should return false for an RG with letters in the middle", () => {
    const invalidRg = "12345A678";
    expect(validateRg(invalidRg)).toBe(false);
  });

  it("should return false for an empty RG", () => {
    expect(validateRg("")).toBe(false);
  });

  it("should return false for a null or undefined RG", () => {
    expect(validateRg(null as unknown as string)).toBe(false);
    expect(validateRg(undefined as unknown as string)).toBe(false);
  });
});
