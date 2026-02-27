import { Success } from "./success";

/**
 * Handles errors and success responses, converting them into standard HTTP Response objects.
 *
 * This function acts as a centralized error and response handler that processes various
 * response types (both success and error responses) and converts them into HTTP Response
 * objects. If the error is not recognized, it defaults to returning a ServerError response.
 *
 * @param {any} error - The error or response object to be handled. Can be:
 *   - A native Response object
 *   - A success response instance (Found, Created, Updated, Success, NoContent)
 *   - An error response instance (BadGateway, BadRequest, Conflict, Forbidden, NotFound, NotImplemented, ServerError, Unauthorized, UnprocessableEntity)
 *   - Any other error object (will be wrapped in ServerError)
 *
 * @returns {Response} A standard HTTP Response object with appropriate status code, headers, and body
 *
 * @example
 * ```typescript
 * // Handling a success response
 * try {
 *   const result = await someOperation();
 *   throw new Success("Operation successful", result);
 * } catch (error) {
 *   return errorHandler(error);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Handling an error response
 * try {
 *   const user = await findUser(id);
 *   if (!user) throw new NotFound("User not found");
 * } catch (error) {
 *   return errorHandler(error);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Handling unexpected errors
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   return errorHandler(error); // Returns ServerError response
 * }
 * ```
 */
function errorHandler(error: any): Response {
  switch (true) {
    case error instanceof Success:
      return error.toJson();
  }
}

export { errorHandler };
