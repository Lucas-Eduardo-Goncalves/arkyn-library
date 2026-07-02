import { flushDebugLogs } from "../..";
import { LogMapperService } from "./_logMapperService";
import { logRequest } from "./_logRequest";

type InputProps = {
	url: string;
	method: "POST" | "PUT" | "DELETE" | "PATCH" | "GET";
	urlParams?: Record<string, string>;
	headers?: HeadersInit;
	// biome-ignore lint/suspicious/noExplicitAny: intentional
	body?: any;
};

// biome-ignore lint/suspicious/noExplicitAny: intentional
type ApiSuccessResponse<T = any> = {
	success: true;
	status: number;
	message: string;
	response: T;
	cause: null;
};

type ApiFailedResponse = {
	success: false;
	status: number;
	message: string;
	// biome-ignore lint/suspicious/noExplicitAny: intentional
	response: any;
	cause: string | Error | null;
};

// biome-ignore lint/suspicious/noExplicitAny: intentional
type ApiResponseDTO<T = any> = ApiSuccessResponse<T> | ApiFailedResponse;

/**
 * Makes an HTTP request using the Fetch API and returns a standardized response.
 *
 * @template {any} T - The expected type of the response data.
 *
 * @param {"POST" | "PUT" | "DELETE" | "PATCH" | "GET"} method - The HTTP method to use for the request. Supported methods are:
 *   - "POST": Create a new resource.
 *   - "PUT": Update an existing resource.
 *   - "DELETE": Remove a resource.
 *   - "PATCH": Partially update a resource.
 *   - "GET": Retrieve a resource.
 * @param {string} url - The URL to which the request is sent.
 * @param {HeadersInit} headers - Optional headers to include in the request. Defaults to an empty object.
 * @param {any} body - Optional body to include in the request. Should be serializable to JSON.
 *
 * @returns {ApiResponseDTO<T>} A promise that resolves to an `ApiResponseDTO<T>` object containing:
 *   - `success`: A boolean indicating whether the request was successful.
 *   - `status`: The HTTP status code of the response.
 *   - `message`: A message describing the result of the request.
 *   - `response`: The parsed JSON response data, or `null` if parsing fails.
 *   - `cause`: Additional error information, if applicable.
 *
 * @example
 * ```typescript
 * import { makeRequest } from "./makeRequest";
 *
 * async function fetchData() {
 *   const response = await makeRequest("GET", "https://api.example.com/data");
 *   if (response.success) {
 *     console.log("Data:", response.response);
 *   } else {
 *     console.error("Error:", response.message);
 *   }
 * }
 * ```
 */

// biome-ignore lint/suspicious/noExplicitAny: intentional
async function makeRequest<T = any>(
	input: InputProps,
): Promise<ApiResponseDTO<T>> {
	let url = input.url;

	if (input.urlParams) {
		Object.entries(input.urlParams).forEach(([key, value]) => {
			url = url.replaceAll(`:${key}`, value);
		});
	}

	const successMessage = {
		POST: "Resource created successfully",
		PUT: "Resource updated successfully",
		DELETE: "Resource deleted successfully",
		PATCH: "Resource patched successfully",
		GET: "Request successful",
	};

	try {
		const startTime = performance.now();

		const headers = { ...input.headers, "Content-Type": "application/json" };
		const response = await fetch(url, {
			headers,
			method: input.method,
			body: input.body ? JSON.stringify(input.body) : undefined,
		});

		const elapsedTime = performance.now() - startTime;
		const status = response.status;

		// biome-ignore lint/suspicious/noExplicitAny: intentional
		let data: any = null;
		try {
			data = await response.json();
		} catch {
			data = null;
		}

		const logData = LogMapperService.handle({
			elapsedTime,
			method: input.method,
			queryParams: new URL(url).searchParams,
			requestHeaders: headers,
			requestBody: input.body,
			responseBody: data,
			responseHeaders: response.headers,
			status,
			rawUrl: input.url,
			urlParams: input.urlParams,
		});

		logRequest(logData);

		if (!response.ok) {
			return {
				success: false,
				status,
				message: data?.message || response.statusText || "Request failed",
				response: data,
				cause: null,
			};
		}

		return {
			success: true,
			status,
			message: data?.message || successMessage[input.method],
			response: data,
			cause: null,
		};
	} catch (err) {
		flushDebugLogs({
			debugs: [`Network error or request failed: ${err}`],
			name: "MakeRequestError",
			scheme: "red",
		});

		return {
			success: false,
			status: 0,
			message: "Network error or request failed",
			response: null,
			cause: err instanceof Error ? err.message : String(err),
		};
	}
}

export { type ApiResponseDTO, makeRequest };
