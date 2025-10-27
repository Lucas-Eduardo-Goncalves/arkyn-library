import { describe, expect, it } from "vitest";
import { validatePassword } from "../validatePassword";

describe("validatePassword", () => {
  it("should return true for a valid password", () => {
    const validPassword = "StrongP@ssw0rd!";
    expect(validatePassword(validPassword)).toBe(true);
  });

  it("should return false for a password shorter than the minimum length", () => {
    const shortPassword = "Short1!";
    expect(validatePassword(shortPassword)).toBe(false);
  });

  it("should return false for a password without an uppercase letter", () => {
    const noUppercase = "weakp@ssw0rd!";
    expect(validatePassword(noUppercase)).toBe(false);
  });

  it("should return false for a password without a lowercase letter", () => {
    const noLowercase = "WEAKP@SSW0RD!";
    expect(validatePassword(noLowercase)).toBe(false);
  });

  it("should return false for a password without a number", () => {
    const noNumber = "NoNumber@!";
    expect(validatePassword(noNumber)).toBe(false);
  });

  it("should return false for a password without a special character", () => {
    const noSpecialChar = "NoSpecialChar1";
    expect(validatePassword(noSpecialChar)).toBe(false);
  });

  it("should return false for an empty password", () => {
    expect(validatePassword("")).toBe(false);
  });

  it("should return false for a null or undefined password", () => {
    expect(validatePassword(null as unknown as string)).toBe(false);
    expect(validatePassword(undefined as unknown as string)).toBe(false);
  });
});
