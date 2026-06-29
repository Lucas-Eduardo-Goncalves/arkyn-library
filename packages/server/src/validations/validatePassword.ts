/**
 * Validates a password based on the following rules:
 * - At least 8 characters
 * - At least 1 uppercase letter
 * - At least 1 letter (any case)
 * - At least 1 number
 * - At least 1 special character
 *
 * @param rawPassword - The password string to validate.
 * @returns `true` if the password meets all rules, otherwise `false`.
 *
 * @example
 * ```ts
 * validatePassword("Senha@123"); // true
 * validatePassword("senha123");  // false (no uppercase, no special char)
 * ```
 */

function validatePassword(rawPassword: string): boolean {
	if (!rawPassword) return false;

	const hasMinLength = rawPassword.length >= 8;
	const hasUppercase = /[A-Z]/.test(rawPassword);
	const hasLetter = /[a-z]/.test(rawPassword);
	const hasNumber = /\d/.test(rawPassword);
	const hasSpecialChar = /[!@#$%^&*(),.?":;{}|<>_\-+=~`[\]\\/]/.test(
		rawPassword,
	);

	return [
		hasMinLength,
		hasUppercase,
		hasLetter,
		hasNumber,
		hasSpecialChar,
	].every((condition) => condition);
}

export { validatePassword };
