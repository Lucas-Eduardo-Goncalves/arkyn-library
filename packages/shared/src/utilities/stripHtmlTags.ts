type StripHtmlTagsFunction = (rawHtml: string) => string;

/**
 * Strips HTML tags from a string.
 *
 * This function removes all HTML tags from the provided string by replacing any content
 * that matches the HTML tag pattern with an empty string.
 *
 * @param rawHtml - The HTML string to be processed
 * @returns The input string with all HTML tags removed
 *
 * @example
 * stripHtmlTags("<p>Hello <strong>World</strong></p>"); // "Hello World"
 */

const stripHtmlTags: StripHtmlTagsFunction = (rawHtml) => {
  return rawHtml.replace(/<\/?[^>]+(>|$)/g, "");
};

export { stripHtmlTags };
