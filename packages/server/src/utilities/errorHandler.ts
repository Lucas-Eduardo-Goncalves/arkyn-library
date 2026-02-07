import { BadGateway } from "../http/badResponses/badGateway";
import { BadRequest } from "../http/badResponses/badRequest";
import { Conflict } from "../http/badResponses/conflict";
import { Forbidden } from "../http/badResponses/forbidden";
import { NotFound } from "../http/badResponses/notFound";
import { NotImplemented } from "../http/badResponses/notImplemented";
import { ServerError } from "../http/badResponses/serverError";
import { Unauthorized } from "../http/badResponses/unauthorized";
import { UnprocessableEntity } from "../http/badResponses/unprocessableEntity";

import { Created } from "../http/successResponses/created";
import { Found } from "../http/successResponses/found";
import { NoContent } from "../http/successResponses/noContent";
import { Success } from "../http/successResponses/success";
import { Updated } from "../http/successResponses/updated";

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
    case error instanceof Response:
      return error;
    case error instanceof Found:
      return error.toResponse();
    case error instanceof Created:
      return error.toResponse();
    case error instanceof Updated:
      return error.toResponse();
    case error instanceof Success:
      return error.toResponse();
    case error instanceof NoContent:
      return error.toResponse();
  }

  switch (true) {
    case error instanceof BadGateway:
      return error.toResponse();
    case error instanceof BadRequest:
      return error.toResponse();
    case error instanceof Conflict:
      return error.toResponse();
    case error instanceof Forbidden:
      return error.toResponse();
    case error instanceof NotFound:
      return error.toResponse();
    case error instanceof NotImplemented:
      return error.toResponse();
    case error instanceof ServerError:
      return error.toResponse();
    case error instanceof Unauthorized:
      return error.toResponse();
    case error instanceof UnprocessableEntity:
      return error.toResponse();
  }

  return new ServerError("Server error", error).toResponse();
}

export { errorHandler };
