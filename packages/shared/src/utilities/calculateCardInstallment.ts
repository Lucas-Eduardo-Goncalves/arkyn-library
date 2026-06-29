/**
 * Calculates the per-installment and total price for a card payment plan with compound interest.
 * No interest is applied when `fees` is `0` or `numberInstallments` is `1`.
 *
 * @param props.cashPrice - The base price of the item.
 * @param props.numberInstallments - Number of installments (must be > 0).
 * @param props.fees - Monthly interest rate (defaults to `0.0349`).
 * @returns `{ totalPrice, installmentPrice }` — both rounded to 2 decimal places.
 *
 * @example
 * ```typescript
 * calculateCardInstallment({ cashPrice: 1000, numberInstallments: 12, fees: 0.02 });
 * // { totalPrice: 1124.62, installmentPrice: 93.72 }
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

	const numerator = (1 + fees) ** numberInstallments * fees;
	const denominator = (1 + fees) ** numberInstallments - 1;

	const installmentPrice = +(cashPrice * (numerator / denominator)).toFixed(2);
	const totalPrice = +(installmentPrice * numberInstallments).toFixed(2);

	return {
		totalPrice: +totalPrice.toFixed(2),
		installmentPrice: +installmentPrice.toFixed(2),
	};
}

export { calculateCardInstallment };
