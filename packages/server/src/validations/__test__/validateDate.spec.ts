import { describe, it, expect } from "vitest";
import { validateDate } from "../validateDate";

describe("validateDate", () => {
  it("should return true for valid dates in DD/MM/YYYY format", () => {
    expect(validateDate("31/12/2023")).toBe(true);
    expect(validateDate("29/02/2024", { inputFormat: "DD/MM/YYYY" })).toBe(
      true
    ); // Leap year
  });

  it("should return false for invalid dates in DD/MM/YYYY format", () => {
    expect(validateDate("31/04/2023", { inputFormat: "DD/MM/YYYY" })).toBe(
      false
    ); // April has 30 days
    expect(validateDate("29/02/2023", { inputFormat: "DD/MM/YYYY" })).toBe(
      false
    ); // Not a leap year
    expect(validateDate("32/01/2023", { inputFormat: "DD/MM/YYYY" })).toBe(
      false
    ); // Invalid day
  });

  it("should return true for valid dates in MM-DD-YYYY format", () => {
    expect(validateDate("12-31-2023", { inputFormat: "MM-DD-YYYY" })).toBe(
      true
    );
  });

  it("should return false for invalid dates in MM-DD-YYYY format", () => {
    expect(validateDate("04-31-2023", { inputFormat: "MM-DD-YYYY" })).toBe(
      false
    ); // April has 30 days
    expect(validateDate("02-29-2023", { inputFormat: "MM-DD-YYYY" })).toBe(
      false
    ); // Not a leap year
    expect(validateDate("13-01-2023", { inputFormat: "MM-DD-YYYY" })).toBe(
      false
    ); // Invalid month
  });

  it("should return true for valid dates in YYYY-MM-DD format", () => {
    expect(validateDate("2023-12-31", { inputFormat: "YYYY-MM-DD" })).toBe(
      true
    );
    expect(validateDate("2024-02-29", { inputFormat: "YYYY-MM-DD" })).toBe(
      true
    ); // Leap year
  });

  it("should return false for invalid dates in YYYY-MM-DD format", () => {
    expect(validateDate("2023-04-31", { inputFormat: "YYYY-MM-DD" })).toBe(
      false
    ); // April has 30 days
    expect(validateDate("2023-02-29", { inputFormat: "YYYY-MM-DD" })).toBe(
      false
    ); // Not a leap year
    expect(validateDate("2023-13-01", { inputFormat: "YYYY-MM-DD" })).toBe(
      false
    ); // Invalid month
  });

  it("should respect minYear and maxYear configuration", () => {
    expect(validateDate("01/01/1899", { minYear: 1900 })).toBe(false); // Below minYear
    expect(validateDate("01/01/1900", { minYear: 1900 })).toBe(true); // Equal to minYear
    expect(validateDate("31/12/3001", { maxYear: 3000 })).toBe(false); // Above maxYear
    expect(validateDate("31/12/3000", { maxYear: 3000 })).toBe(true); // Equal to maxYear
  });

  it("should throw an error for unsupported date formats", () => {
    expect(() =>
      validateDate("2023.12.31", { inputFormat: "YYYY.MM.DD" } as any)
    ).toThrow("Invalid date format");
  });

  it("should return false for completely invalid date strings", () => {
    expect(validateDate("invalid-date")).toBe(false);
    expect(validateDate("12345678")).toBe(false);
    expect(validateDate("")).toBe(false);
  });
});
