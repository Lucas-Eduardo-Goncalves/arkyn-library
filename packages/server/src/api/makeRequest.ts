import { ArkynLogRequestMapper } from "../mapper/arkynLogRequestMapper";
import { flushDebugLogs } from "../services/flushDebugLogs";
import type { ApiResponseDTO } from "../types/ApiResponseDTO";
import { arkynLogRequest } from "./arkynLogRequest";

/**
 * Makes an HTTP request using the Fetch API and returns a standardized response.
 *
 * @template T - The expected type of the response data.
 * @param method - The HTTP method to use for the request. Supported methods are:
 *   - "POST": Create a new resource.
 *   - "PUT": Update an existing resource.
 *   - "DELETE": Remove a resource.
 *   - "PATCH": Partially update a resource.
 *   - "GET": Retrieve a resource.
 * @param url - The URL to which the request is sent.
 * @param headers - Optional headers to include in the request. Defaults to an empty object.
 * @param body - Optional body to include in the request. Should be serializable to JSON.
 * @returns A promise that resolves to an `ApiResponseDTO<T>` object containing:
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

async function makeRequest<T = any>(
  method: "POST" | "PUT" | "DELETE" | "PATCH" | "GET",
  url: string,
  rawHeaders: HeadersInit = {},
  body?: any
): Promise<ApiResponseDTO<T>> {
  const successMessage = {
    POST: "Resource created successfully",
    PUT: "Resource updated successfully",
    DELETE: "Resource deleted successfully",
    PATCH: "Resource patched successfully",
    GET: "Request successful",
  };

  try {
    const startTime = performance.now();

    const headers = { ...rawHeaders, "Content-Type": "application/json" };
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const elapsedTime = performance.now() - startTime;
    const status = response.status;

    let data: any = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    const logData = ArkynLogRequestMapper.handle({
      elapsedTime,
      method,
      queryParams: new URL(url).searchParams,
      requestHeaders: headers,
      requestBody: body,
      responseBody: data,
      responseHeaders: response.headers,
      status,
      url,
    });

    arkynLogRequest(logData);

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
      message: data?.message || successMessage[method],
      response: data,
      cause: null,
    };
  } catch (err) {
    flushDebugLogs({
      debugs: [`Network error or request failed: ${err}`],
      name: "ARKYN_MAKE_REQUEST_ERROR",
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

export { makeRequest };
