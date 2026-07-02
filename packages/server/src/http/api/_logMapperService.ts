/**
 * Input properties for log mapping.
 *
 * @typedef {object} InputProps
 * @property {number} status - HTTP response status code.
 * @property {string} url - The request URL.
 * @property {"GET" | "POST" | "PUT" | "DELETE" | "PATCH"} method - HTTP method used.
 * @property {HeadersInit} requestHeaders - Headers sent with the request.
 * @property {HeadersInit} responseHeaders - Headers received in the response.
 * @property {any} requestBody - Body of the request.
 * @property {number} elapsedTime - Time elapsed for the request in milliseconds.
 * @property {any} responseBody - Body of the response.
 * @property {URLSearchParams} queryParams - Query parameters from the URL.
 */
type InputProps = {
	status: number;
	rawUrl: string;
	urlParams?: Record<string, string>;
	method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	requestHeaders: HeadersInit;
	responseHeaders: HeadersInit;
	// biome-ignore lint/suspicious/noExplicitAny: intentional
	requestBody: any;
	elapsedTime: number;
	// biome-ignore lint/suspicious/noExplicitAny: intentional
	responseBody: any;
	queryParams: URLSearchParams;
};

/**
 * Output properties after log mapping transformation.
 *
 * @typedef {object} OutputProps
 * @property {string} rawUrl - The original request URL.
 * @property {number} status - HTTP response status code.
 * @property {"GET" | "POST" | "PUT" | "DELETE" | "PATCH"} method - HTTP method used.
 * @property {string | null} token - Authentication token (if present).
 * @property {number} elapsedTime - Time elapsed for the request in milliseconds.
 * @property {Record<string, string>} requestHeaders - Mapped request headers.
 * @property {Record<string, string>} requestBody - Mapped request body.
 * @property {Record<string, string>} queryParams - Mapped query parameters.
 * @property {Record<string, string>} responseHeaders - Mapped response headers.
 * @property {any} responseBody - The response body.
 */
type OutputProps = {
	rawUrl: string;
	status: number;
	method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	token: string | null;
	elapsedTime: number;
	requestHeaders: Record<string, string>;
	requestBody: Record<string, string>;
	queryParams: Record<string, string>;
	responseHeaders: Record<string, string>;
	// biome-ignore lint/suspicious/noExplicitAny: intentional
	responseBody: any;
};

/**
 * Static service for mapping HTTP request/response data into a standardized log format.
 *
 * Provides utilities to transform headers and query parameters into plain objects,
 * and produces a unified output structure for logging purposes.
 */
class LogMapperService {
	/**
	 * Converts various header formats into a plain key-value object.
	 *
	 * @param {HeadersInit} headers - The headers to map.
	 * @returns {Record<string, string>} A plain object with header key-value pairs.
	 * @private
	 */
	private static mapHeaders(headers: HeadersInit): Record<string, string> {
		if (headers instanceof Headers) {
			return Object.fromEntries(headers.entries());
		} else if (typeof headers === "object") {
			return Object.entries(headers).reduce(
				(acc, [key, value]) => {
					if (typeof value === "string") acc[key] = value;
					else if (Array.isArray(value)) acc[key] = value.join(", ");
					else acc[key] = JSON.stringify(value);
					return acc;
				},
				{} as Record<string, string>,
			);
		}
		return {};
	}

	/**
	 * Converts URLSearchParams into a plain key-value object.
	 *
	 * @param {URLSearchParams} queryParams - The query parameters to map.
	 * @returns {Record<string, string>} A plain object with query parameter key-value pairs.
	 * @private
	 */
	private static mapQueryParams(
		queryParams: URLSearchParams,
	): Record<string, string> {
		const params: Record<string, string> = {};

		queryParams.forEach((value, key) => {
			params[key] = value;
		});

		return params;
	}

	/**
	 * Transforms raw HTTP request/response data into a standardized log output format.
	 *
	 * @param {InputProps} props - The input properties containing request/response data.
	 * @returns {OutputProps} The mapped output object ready for logging.
	 */
	static handle(props: InputProps): OutputProps {
		return {
			rawUrl: props.rawUrl,
			status: props.status,
			method: props.method,
			token: null,
			elapsedTime: props.elapsedTime,
			requestHeaders: LogMapperService.mapHeaders(props.requestHeaders),
			requestBody: props.requestBody || null,
			queryParams: {
				...LogMapperService.mapQueryParams(props.queryParams),
				...props.urlParams,
			},
			responseHeaders: LogMapperService.mapHeaders(props.responseHeaders),
			responseBody: props.responseBody || null,
		};
	}
}

export { LogMapperService };
