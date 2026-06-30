import { BadRequest } from "../http/badResponses/badRequest";

/**
 * Decodes a request body into a plain object, trying JSON first then URL-encoded form data.
 * Throws `BadRequest` if neither format can be parsed.
 *
 * @param request - The incoming request whose body will be decoded.
 * @returns The decoded body as a plain object.
 *
 * @example
 * ```typescript
 * export async function action({ request }: ActionFunctionArgs) {
 *   const body = await decodeRequestBody(request);
 *   // body is now a plain JS object
 * }
 * ```
 */

// biome-ignore lint/suspicious/noExplicitAny: intentional
async function decodeRequestBody(request: Request): Promise<any> {
	// biome-ignore lint/suspicious/noExplicitAny: intentional
	let data: any;

	const arrayBuffer = await request.arrayBuffer();
	const text = new TextDecoder().decode(arrayBuffer);

	try {
		data = JSON.parse(text);
	} catch (_jsonError) {
		try {
			if (text.includes("=")) {
				const formData = new URLSearchParams(text);
				data = Object.fromEntries(formData.entries());
			} else {
				throw new BadRequest("Invalid URLSearchParams format");
			}
		} catch (_formDataError) {
			throw new BadRequest("Failed to extract data from request");
		}
	}

	return data;
}

export { decodeRequestBody };
