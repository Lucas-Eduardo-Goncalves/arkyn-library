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
 * Converts any thrown value into a `Response`. Recognizes all `@arkyn/server` success and error
 * response classes, native `Response` objects, and falls back to a 500 `ServerError` for anything else.
 *
 * Intended to be used as the catch handler of a route action or loader:
 *
 * @param error - The thrown value to convert.
 * @returns A `Response` with the appropriate HTTP status, headers, and JSON body.
 *
 * @example
 * ```typescript
 * export async function action({ request }: ActionFunctionArgs) {
 *   try {
 *     const user = await findUser(id);
 *     if (!user) throw new NotFound("User not found");
 *     return new Success("User retrieved", { user }).toJson();
 *   } catch (error) {
 *     return errorHandler(error);
 *   }
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
