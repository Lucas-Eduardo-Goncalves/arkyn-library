import { formatJsonObject } from "@arkyn/shared";
import { flushDebugLogs } from "../..";
import { LogService } from "../../services/logService";

type ConfigProps = {
	rawUrl: string;
	status: number;
	method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	token: string | null;
	elapsedTime: number;
	requestHeaders: Record<string, string>;
	requestBody: Record<string, string>;
	queryParams: Record<string, string>;
	responseHeaders: Record<string, string>;
	responseBody: Record<string, string>;
};

/**
 * Sends a request to the inbox flow API with the provided configuration.
 *
 * - This function retrieves the inbox flow configuration using `LogService.getConfig()`.
 * - If the configuration is not available, the function will return early without performing any action.
 * - In a development environment (`NODE_ENV === "development"`), the function will also return early.
 * - The request is sent as a POST request to the inbox API URL with the provided configuration details.
 * - If an error occurs during the request, it will be logged using the `httpDebug` service.
 *
 * @param {ConfigProps} config - The configuration object for the request.
 * @param {string} config.rawUrl - The raw URL of the request.
 * @param {number} config.status - The HTTP status code associated with the request.
 * @param {"GET" | "POST" | "PUT" | "DELETE" | "PATCH"} config.method - The HTTP method used for the request. Can be "POST", "GET", "PUT", "DELETE", or "PATCH".
 * @param {string | null} config.token - The authentication token for the request.
 * @param {number} config.elapsedTime - The elapsed time for the request in milliseconds.
 * @param {Record<string, string>} config.requestHeaders - The headers sent with the request.
 * @param {Record<string, string>} config.requestBody - The body of the request, if applicable.
 * @param {Record<string, string>} config.queryParams - The query parameters for the request.
 * @param {Record<string, string>} config.responseHeaders - The headers received in the response.
 * @param {Record<string, string>} config.responseBody - The body of the response received.
 *
 * @remarks
 *
 * @returns {Promise<void>} A promise that resolves when the request is complete.
 *
 * @example
 * ```typescript
 * const config = {
 *   rawUrl: "https://example.com/api/data",
 *   status: 200,
 *   method: "GET",
 *   token: "auth-token-123",
 *   elapsedTime: 150,
 *   requestHeaders: { "Accept": "application/json", "Authorization": "Bearer token123" },
 *   requestBody: {},
 *   queryParams: { "page": "1", "limit": "10" },
 *   responseHeaders: { "Content-Type": "application/json" },
 *   responseBody: { "data": "example response" }
 * };
 *
 * await logRequest(config);
 * ```
 */

async function logRequest(config: ConfigProps): Promise<void> {
	const arkynService = LogService.getConfig();
	if (!arkynService) return;

	const { userToken, apiUrl, trafficSourceId } = arkynService;

	const {
		elapsedTime,
		method,
		queryParams,
		requestBody,
		requestHeaders,
		responseBody,
		responseHeaders,
		status,
		rawUrl,
	} = config;

	if (process.env.NODE_ENV === "development") return;

	try {
		const url = new URL(rawUrl);

		let protocol: "http" | "https" = "https";
		if (url.protocol === "http:") protocol = "http";

		const body = JSON.stringify({
			domainUrl: `${url.protocol}//${url.host}`,
			pathnameUrl: url.pathname,
			trafficSourceId: trafficSourceId,
			status,
			protocol,
			method: method.toLowerCase(),
			trafficUserId: null,
			elapsedTime,
			requestHeaders: JSON.stringify(requestHeaders),
			requestBody: JSON.stringify(requestBody),
			queryParams: JSON.stringify(queryParams),
			responseHeaders: JSON.stringify(responseHeaders),
			responseBody: JSON.stringify(responseBody),
		});

		const headers = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${userToken}`,
		};

		const fetchResponse = await fetch(apiUrl, {
			method: "POST",
			body,
			headers,
		});

		if (!fetchResponse.ok) {
			const errorText = await fetchResponse.text();
			const errorStatus = fetchResponse.status;
			const errorStatusText = fetchResponse.statusText;
			const jsonResponse = await fetchResponse.json().catch(() => null);

			flushDebugLogs({
				name: "LogError",
				scheme: "red",
				debugs: [
					`Failed to log request.`,
					`Status: ${errorStatus} ${errorStatusText}.`,
					`Status text: ${errorText}.`,
					`JSON Response: ${jsonResponse ? formatJsonObject(jsonResponse, 0) : "No JSON response"}`,
				],
			});
		}
	} catch (err) {
		flushDebugLogs({
			debugs: [`Error sending request: ${err}`],
			name: "LogError",
			scheme: "red",
		});
	}
}

export { logRequest };
