/**
 * Generates a URL-friendly slug from a given string.
 *
 * The function performs the following transformations:
 * - Normalizes the string to remove diacritical marks (e.g., accents).
 * - Removes non-alphanumeric characters except for spaces and hyphens.
 * - Replaces spaces with hyphens.
 * - Converts the string to lowercase.
 * - Collapses multiple consecutive hyphens into a single hyphen.
 * - Trims leading and trailing hyphens.
 *
 * @param {string} string - The input string to be converted into a slug.
 *
 * @returns {string} A URL-friendly slug derived from the input string.
 *
 * @example
 * ```typescript
 * const slug = generateSlug("Hello, World! This is a Test.");
 * console.log(slug); // Outputs: "hello-world-this-is-a-test"
 * ```
 */

function generateSlug(prop: string): string {
  let slug = prop.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  slug = slug
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();

  slug = slug.replace(/-{2,}/g, "-");

  slug = slug.replace(/^-+|-+$/g, "");

  return slug;
}

export { generateSlug };
