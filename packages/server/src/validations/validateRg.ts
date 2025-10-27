type ValidateRgFunction = (rawRg: string) => boolean;

/**
 * Validates a Brazilian RG (Registro Geral) in a generic way.
 *
 * This function does a basic structure validation:
 * - Removes non-alphanumeric characters.
 * - Ensures length is reasonable (7–9 digits).
 * - Optionally allows for a final letter (verifier).
 *
 * @param rawRg - RG string, possibly formatted.
 * @returns `true` if format seems valid, otherwise `false`.
 *
 * @example
 * ```ts
 * validateRg("12.345.678-9"); // true
 * validateRg("MG-12.345.678"); // false (not supported)
 * validateRg("12345678X"); // true
 * ```
 */

const validateRg: ValidateRgFunction = (rawRg) => {
  if (!rawRg) return false;

  const validFormat = /^[0-9a-zA-Z.-]+$/.test(rawRg);
  if (!validFormat) return false;

  const rg = rawRg.replace(/[^a-zA-Z0-9]/g, "");

  if (rg.length < 7 || rg.length > 9) return false;

  const isValidFormat = /^[0-9]{7,8}[0-9Xx]?$/.test(rg);

  return isValidFormat;
};

export { validateRg };
