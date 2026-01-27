/**
 * Calculates the installment price and total price for a card payment plan.
 *
 * @remarks
 * **Important:** When the interest amount (`fees`) is equal to 0 or the number of installments (`numberInstallments`) is equal to 1, no interest will be charged.
 *
 * @param {object} props - The input parameters for the calculation.
 * @param {number} props.cashPrice - The total cash price of the product or service.
 * @param {number} props.numberInstallments - The number of installments for the payment plan.
 * @param {number} [props.fees=0.0349] - The interest rate per installment (default is 0.0349).
 *
 * @throws {Error} If `numberInstallments` is less than or equal to 0.
 * @throws {Error} If `fees` is less than 0.
 *
 * @returns {object} An object containing:
 * - `totalPrice`: The total price to be paid, rounded to two decimal places.
 * - `installmentPrice`: The price of each installment, rounded to two decimal places.
 *
 * @example
 * ```typescript
 * const result = calculateCardInstallment({
 *   cashPrice: 1000,
 *   numberInstallments: 12,
 *   fees: 0.02,
 * });
 * console.log(result); // Output: { totalPrice: 1124.62, installmentPrice: 93.72 }
 * ```
 */

function calculateCardInstallment(props: {
  cashPrice: number;
  numberInstallments: number;
  fees?: number;
}): { totalPrice: number; installmentPrice: number } {
  const { cashPrice, numberInstallments, fees = 0.0349 } = props;

  if (fees === 0 || numberInstallments === 1) {
    return {
      totalPrice: cashPrice,
      installmentPrice: cashPrice / numberInstallments,
    };
  }

  if (numberInstallments <= 0) {
    throw new Error("Number of installments must be greater than 0");
  }

  if (fees < 0) {
    throw new Error("Fees must be greater than or equal to 0");
  }

  let numerator = Math.pow(1 + fees, numberInstallments) * fees;
  let denominator = Math.pow(1 + fees, numberInstallments) - 1;

  const installmentPrice = +(cashPrice * (numerator / denominator)).toFixed(2);
  const totalPrice = +(installmentPrice * numberInstallments).toFixed(2);

  return {
    totalPrice: +totalPrice.toFixed(2),
    installmentPrice: +installmentPrice.toFixed(2),
  };
}

export { calculateCardInstallment };
