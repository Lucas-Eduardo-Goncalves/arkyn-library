import { type ApiResponseDTO, makeRequest } from "./_makeRequest";

type InputProps = {
	url: string;
	urlParams?: Record<string, string>;
	headers?: HeadersInit;
	body?: any;
};

/**
 * Sends a DELETE request to the specified URL with optional headers and body.
 *
 * @template T - The expected type of the response data.
 * @param {InputProps} input - The options for the DELETE request, including URL, URL parameters, headers, and body.
 * @returns {Promise<ApiResponseDTO<T>>} A promise that resolves to the API response.
 */

async function deleteRequest<T = any>(
	input: InputProps,
): Promise<ApiResponseDTO<T>> {
	return makeRequest({
		method: "DELETE",
		url: input.url,
		urlParams: input.urlParams,
		headers: input.headers,
		body: input.body,
	});
}

export { deleteRequest };
