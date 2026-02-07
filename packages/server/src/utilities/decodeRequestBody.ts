import { BadRequest } from "../http/badResponses/badRequest";

/**
 * Decodes the body of an incoming request into a JavaScript object.
 *
 * This function attempts to parse the request body in the following order:
 * 1. Tries to parse the body as JSON.
 * 2. If JSON parsing fails, attempts to parse the body as URL-encoded form data.
 * 3. If both parsing attempts fail, logs the errors and returns an empty object.
 *
 * @param {Request} request - The incoming request object containing the body to decode.
 * @returns {Promise<any>} A promise that resolves to the decoded data as a JavaScript object.
 *
 * @throws Logs errors to the console if the request body cannot be read or parsed.
 */

async function decodeRequestBody(request: Request): Promise<any> {
  let data: any;

  const arrayBuffer = await request.arrayBuffer();
  const text = new TextDecoder().decode(arrayBuffer);

  try {
    data = JSON.parse(text);
  } catch (jsonError) {
    try {
      if (text.includes("=")) {
        const formData = new URLSearchParams(text);
        data = Object.fromEntries(formData.entries());
      } else {
        throw new BadRequest("Invalid URLSearchParams format");
      }
    } catch (formDataError) {
      throw new BadRequest("Failed to extract data from request");
    }
  }

  return data;
}

export { decodeRequestBody };
