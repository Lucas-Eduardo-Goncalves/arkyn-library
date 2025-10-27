import { describe, it, expect } from "vitest";
import { validateCpf } from "../validateCpf";

describe("validateCpf", () => {
  it("should return false for an empty CPF", () => {
    expect(validateCpf("")).toBe(false);
  });

  it("should return false for a CPF with invalid length", () => {
    expect(validateCpf("123.456")).toBe(false);
    expect(validateCpf("123.456.789.123")).toBe(false);
  });

  it("should return false for a CPF with all digits equal", () => {
    expect(validateCpf("111.111.111-11")).toBe(false);
    expect(validateCpf("222.222.222-22")).toBe(false);
  });

  it("should return false for an invalid CPF", () => {
    expect(validateCpf("123.456.789-19")).toBe(false);
    expect(validateCpf("987.654.321-01")).toBe(false);
  });

  it("should return true for a valid CPF", () => {
    expect(validateCpf("111.444.777-35")).toBe(true);
    expect(validateCpf("935.411.347-80")).toBe(true);
  });

  it("should ignore formatting characters and validate correctly", () => {
    expect(validateCpf("11144477735")).toBe(true);
    expect(validateCpf("935.411.347-80")).toBe(true);
  });

  it("should return false for a CPF with non-digit characters", () => {
    expect(validateCpf("111.444.777-3a")).toBe(false);
    expect(validateCpf("935.411.347-8x")).toBe(false);
  });
});
