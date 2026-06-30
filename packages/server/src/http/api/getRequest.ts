import { type ApiResponseDTO, makeRequest } from "./_makeRequest";

type InputProps = {
	url: string;
	urlParams?: Record<string, string>;
	headers?: HeadersInit;
};

/**
 * Sends a GET request to the specified URL with optional headers.
 *
 * @template T - The expected type of the response data.
 * @param {InputProps} input - The options for the GET request, including URL, URL parameters, and headers.
 * @returns {Promise<ApiResponseDTO<T>>} A promise that resolves to the API response.
 */

// biome-ignore lint/suspicious/noExplicitAny: intentional
async function getRequest<T = any>(
	input: InputProps,
): Promise<ApiResponseDTO<T>> {
	return makeRequest({
		method: "GET",
		url: input.url,
		urlParams: input.urlParams,
		headers: input.headers,
	});
}

export { getRequest };
