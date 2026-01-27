import { describe, it, expect } from "vitest";
import { calculateCardInstallment } from "../calculateCardInstallment";

describe("calculateCardInstallment", () => {
  it("should calculate installment with default fees", () => {
    const result = calculateCardInstallment({
      cashPrice: 1000,
      numberInstallments: 12,
    });
    expect(result.totalPrice).toBeGreaterThan(1000);
    expect(result.installmentPrice).toBeGreaterThan(0);

    const calculatedTotal = result.installmentPrice * 12;
    expect(Math.abs(result.totalPrice - calculatedTotal)).toBeLessThan(0.12);
  });

  it("should calculate installment with custom fees", () => {
    const result = calculateCardInstallment({
      cashPrice: 1000,
      numberInstallments: 12,
      fees: 0.02,
    });
    expect(result.totalPrice).toBeCloseTo(1134.72, 2);
    expect(result.installmentPrice).toBeCloseTo(94.56, 2);
  });

  it("should not charge interest when fees is 0", () => {
    const result = calculateCardInstallment({
      cashPrice: 1000,
      numberInstallments: 12,
      fees: 0,
    });
    expect(result.totalPrice).toBe(1000);
    expect(result.installmentPrice).toBeCloseTo(1000 / 12, 2);
  });

  it("should not charge interest when numberInstallments is 1", () => {
    const result = calculateCardInstallment({
      cashPrice: 1000,
      numberInstallments: 1,
      fees: 0.0349,
    });
    expect(result.totalPrice).toBe(1000);
    expect(result.installmentPrice).toBe(1000);
  });

  it("should throw error when numberInstallments is less than or equal to 0", () => {
    expect(() =>
      calculateCardInstallment({
        cashPrice: 1000,
        numberInstallments: 0,
        fees: 0.02,
      }),
    ).toThrow("Number of installments must be greater than 0");

    expect(() =>
      calculateCardInstallment({
        cashPrice: 1000,
        numberInstallments: -5,
        fees: 0.02,
      }),
    ).toThrow("Number of installments must be greater than 0");
  });

  it("should throw error when fees is less than 0", () => {
    expect(() =>
      calculateCardInstallment({
        cashPrice: 1000,
        numberInstallments: 12,
        fees: -0.01,
      }),
    ).toThrow("Fees must be greater than or equal to 0");
  });

  it("should calculate with 2 installments", () => {
    const result = calculateCardInstallment({
      cashPrice: 1000,
      numberInstallments: 2,
      fees: 0.02,
    });
    expect(result.totalPrice).toBeGreaterThan(1000);
    expect(result.installmentPrice).toBeGreaterThan(500);
    expect(result.totalPrice).toBeCloseTo(result.installmentPrice * 2, 1);
  });

  it("should calculate with 24 installments", () => {
    const result = calculateCardInstallment({
      cashPrice: 5000,
      numberInstallments: 24,
      fees: 0.03,
    });
    expect(result.totalPrice).toBeGreaterThan(5000);
    expect(result.installmentPrice).toBeGreaterThan(0);

    const calculatedTotal = result.installmentPrice * 24;
    expect(Math.abs(result.totalPrice - calculatedTotal)).toBeLessThan(0.24);
  });

  it("should round totalPrice and installmentPrice to 2 decimal places", () => {
    const result = calculateCardInstallment({
      cashPrice: 999.99,
      numberInstallments: 7,
      fees: 0.0349,
    });
    expect(
      result.totalPrice.toString().split(".")[1]?.length,
    ).toBeLessThanOrEqual(2);
    expect(
      result.installmentPrice.toString().split(".")[1]?.length,
    ).toBeLessThanOrEqual(2);
  });

  it("should handle small cash prices", () => {
    const result = calculateCardInstallment({
      cashPrice: 10,
      numberInstallments: 3,
      fees: 0.01,
    });
    expect(result.totalPrice).toBeGreaterThan(10);
    expect(result.installmentPrice).toBeGreaterThan(0);
  });

  it("should handle large cash prices", () => {
    const result = calculateCardInstallment({
      cashPrice: 100000,
      numberInstallments: 12,
      fees: 0.02,
    });
    expect(result.totalPrice).toBeGreaterThan(100000);
    expect(result.installmentPrice).toBeGreaterThan(0);
    expect(result.totalPrice).toBeCloseTo(result.installmentPrice * 12, 1);
  });

  it("should calculate correctly with very low fees", () => {
    const result = calculateCardInstallment({
      cashPrice: 1000,
      numberInstallments: 12,
      fees: 0.001,
    });
    expect(result.totalPrice).toBeGreaterThan(1000);
    expect(result.totalPrice).toBeLessThan(1020);
  });

  it("should calculate correctly with high fees", () => {
    const result = calculateCardInstallment({
      cashPrice: 1000,
      numberInstallments: 12,
      fees: 0.1,
    });
    expect(result.totalPrice).toBeGreaterThan(1000);
    expect(result.installmentPrice).toBeGreaterThan(83.33);
  });
});
