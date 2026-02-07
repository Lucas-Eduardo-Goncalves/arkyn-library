import { makeRequest, type ApiResponseDTO } from "./_makeRequest";

type InputProps = {
  url: string;
  urlParams?: Record<string, string>;
  headers?: HeadersInit;
  body?: any;
};

/**
 * Sends a POST request to the specified URL with optional headers and body.
 *
 * @template T - The expected type of the response data.
 * @param {InputProps} input - The options for the POST request, including URL, URL parameters, headers, and body.
 * @returns {Promise<ApiResponseDTO<T>>} A promise that resolves to the API response.
 */

async function postRequest<T = any>(
  input: InputProps,
): Promise<ApiResponseDTO<T>> {
  return makeRequest({
    method: "POST",
    url: input.url,
    urlParams: input.urlParams,
    headers: input.headers,
    body: input.body,
  });
}

export { postRequest };
