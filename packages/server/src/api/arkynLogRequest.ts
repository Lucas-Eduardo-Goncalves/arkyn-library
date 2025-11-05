import { ArkynLogService } from "../services/arkynLogService";
import { flushDebugLogs } from "../services/flushDebugLogs";

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
 * @param config - The configuration object for the request.
 * @param config.rawUrl - The raw URL of the request.
 * @param config.status - The HTTP status code associated with the request.
 * @param config.method - The HTTP method used for the request. Can be "POST", "GET", "PUT", "DELETE", or "PATCH".
 * @param config.token - The authentication token for the request.
 * @param config.elapsedTime - The elapsed time for the request in milliseconds.
 * @param config.requestHeaders - The headers sent with the request.
 * @param config.requestBody - The body of the request, if applicable.
 * @param config.queryParams - The query parameters for the request.
 * @param config.responseHeaders - The headers received in the response.
 * @param config.responseBody - The body of the response received.
 *
 * @remarks
 * - This function retrieves the inbox flow configuration using `InboxFlowService.getInboxConfig()`.
 * - If the configuration is not available, the function will return early without performing any action.
 * - In a development environment (`NODE_ENV === "development"`), the function will also return early.
 * - The request is sent as a POST request to the inbox API URL with the provided configuration details.
 * - If an error occurs during the request, it will be logged using the `httpDebug` service.
 *
 * @example
 * ```typescript
 * const config = {
 *   rawUrl: "https://example.com/api/data",
 *   status: 200,
 *   method: "GET",
 *   token: "auth-token-123",
 *   elapsedTime: "150ms",
 *   requestHeaders: { "Accept": "application/json", "Authorization": "Bearer token123" },
 *   requestBody: {},
 *   queryParams: { "page": "1", "limit": "10" },
 *   responseHeaders: { "Content-Type": "application/json" },
 *   responseBody: { "data": "example response" }
 * };
 *
 * await arkynLogRequest(config);
 * ```
 */

async function arkynLogRequest(config: ConfigProps) {
  const arkynService = ArkynLogService.getArkynConfig();
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
    token,
    rawUrl,
  } = config;

  // if (process.env.NODE_ENV === "development") return;

  try {
    const url = new URL(rawUrl);
    let protocol: "http" | "https" = "https";
    if (url.protocol === "http:") protocol = "http";

    const body = JSON.stringify({
      domainUrl: url.protocol + "//" + url.host,
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

    const data = await fetch(apiUrl, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    console.log(await data.json());
  } catch (err) {
    console.log(err);
    flushDebugLogs({
      debugs: [`Error sending request: ${err}`],
      name: "ARKYN_LOG_ERROR",
      scheme: "red",
    });
  }
}

export { arkynLogRequest };
