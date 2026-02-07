/**
 * Decodes an error message from a given request data object or response object.
 *
 * This function attempts to extract a meaningful error message from the provided
 * `data` or `response` objects by checking various properties in a specific order.
 * If no valid error message is found, it returns a default message: "Missing error message".
 *
 * @param {any} data - The data object that may contain error information. It can have properties
 * such as `message`, `error`, or `error.message` that are checked for a string value.
 * @param {Response} response - The response object that may contain a `statusText` property
 * representing the HTTP status text.
 * @returns {string} A string representing the decoded error message, or a default message
 * if no error message is found.
 */

function decodeRequestErrorMessage(data: any, response: Response): string {
  if (data?.message && typeof data?.message === "string") {
    return data?.message;
  }

  if (data?.error && typeof data?.error === "string") {
    return data?.error;
  }

  if (data?.error?.message && typeof data?.error?.message === "string") {
    return data?.error?.message;
  }

  if (response?.statusText && typeof response?.statusText === "string") {
    return response?.statusText;
  }

  return "Missing error message";
}

export { decodeRequestErrorMessage };
