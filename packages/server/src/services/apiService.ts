import { deleteRequest } from "../api/deleteRequest";
import { getRequest } from "../api/getRequest";
import { patchRequest } from "../api/patchRequest";
import { postRequest } from "../api/postRequest";
import { putRequest } from "../api/putRequest";
import { flushDebugLogs } from "./flushDebugLogs";

type ApiServiceConstructorProps = {
  baseUrl: string;
  baseHeaders?: HeadersInit;
  baseToken?: string | null;
  enableDebug?: boolean;
};

type ApiRequestDataWithoutBodyProps = {
  headers?: HeadersInit;
  token?: string;
};

type ApiRequestDataWithBodyProps = {
  body?: any;
  headers?: HeadersInit;
  token?: string;
};

/**
 * Class representing an API instance to handle HTTP requests with base configurations.
 */

class ApiService {
  private baseUrl: string;
  private baseHeaders?: HeadersInit;
  private baseToken?: string;
  private enableDebug?: boolean;

  /**
   * Creates an instance of ApiService.
   * @param props - The configuration properties for the API instance.
   * @param props.baseUrl - The base URL for the API.
   * @param props.baseHeaders - Optional base headers to include in all requests.
   * @param props.baseToken - Optional base token for authorization.
   * @param props.enableDebug - Optional flag to enable debug logging for requests.
   */

  constructor(props: ApiServiceConstructorProps) {
    this.baseUrl = props.baseUrl;
    this.baseHeaders = props.baseHeaders || undefined;
    this.baseToken = props.baseToken || undefined;
    this.enableDebug = props.enableDebug || false;
  }

  /**
   * Generates the full URL by appending the route to the base URL.
   * @param route - The route to append to the base URL.
   * @returns The full URL as a string.
   */

  private onDebug(endpoint: string, method: string, data: any) {
    if (this.enableDebug) {
      const debugs: string[] = [];

      debugs.push(`Base URL: ${this.baseUrl}`);
      debugs.push(`Endpoint: ${endpoint}`);
      debugs.push(`Method: ${method}`);
      if (data[0]) debugs.push(`Headers: ${JSON.stringify(data[0])}`);
      if (data[1]) debugs.push(`Body: ${JSON.stringify(data[1])}`);

      flushDebugLogs({ debugs, name: "ARKYN-API-DEBUG", scheme: "yellow" });
    }
  }

  private generateURL(route: string) {
    return this.baseUrl + route;
  }

  /**
   * Generates the headers for a request by merging base headers, provided headers, and tokens.
   * @param initHeaders - Initial headers to include in the request.
   * @param token - Optional token to override the base token.
   * @returns The merged headers as a HeadersInit object.
   */

  private generateHeaders(
    initHeaders: HeadersInit,
    token?: string
  ): HeadersInit {
    let headers: HeadersInit = {};
    if (this.baseToken) headers = { Authorization: `Bearer ${this.baseToken}` };
    if (this.baseHeaders) headers = { ...headers, ...this.baseHeaders };

    if (initHeaders) headers = { ...headers, ...initHeaders };
    if (token) headers = { ...headers, Authorization: `Bearer ${token}` };

    return headers;
  }

  /**
   * Sends a get request to the specified endpoint.
   * @param endpoint - The API endpoint to send the get request to.
   * @param data - The request data, including optional headers and token.
   * @returns The API response data.
   */

  async get(endpoint: string, data?: ApiRequestDataWithoutBodyProps) {
    const url = this.generateURL(endpoint);
    const headers = this.generateHeaders(data?.headers || {}, data?.token);

    this.onDebug(endpoint, "get", [headers]);
    return await getRequest(url, headers);
  }

  /**
   * Sends a post request to the specified endpoint.
   * @param endpoint - The API endpoint to send the post request to.
   * @param data - The request data, including body, optional headers, and token.
   * @returns The API response data.
   */

  async post(endpoint: string, data?: ApiRequestDataWithBodyProps) {
    const url = this.generateURL(endpoint);
    const headers = this.generateHeaders(data?.headers || {}, data?.token);
    const body = data?.body;

    this.onDebug(endpoint, "post", [headers, body]);
    return await postRequest(url, headers, body);
  }

  /**
   * Sends a put request to the specified endpoint.
   * @param endpoint - The API endpoint to send the put request to.
   * @param data - The request data, including body, optional headers, and token.
   * @returns The API response data.
   */

  async put(endpoint: string, data?: ApiRequestDataWithBodyProps) {
    const url = this.generateURL(endpoint);
    const headers = this.generateHeaders(data?.headers || {}, data?.token);
    const body = data?.body;

    this.onDebug(endpoint, "put", [headers, body]);
    return await putRequest(url, headers, body);
  }

  /**
   * Sends a patch request to the specified endpoint.
   * @param endpoint - The API endpoint to send the patch request to.
   * @param data - The request data, including body, optional headers, and token.
   * @returns The API response data.
   */

  async patch(endpoint: string, data?: ApiRequestDataWithBodyProps) {
    const url = this.generateURL(endpoint);
    const headers = this.generateHeaders(data?.headers || {}, data?.token);
    const body = data?.body;

    this.onDebug(endpoint, "patch", [headers, body]);
    return await patchRequest(url, headers, body);
  }

  /**
   * Sends a delete request to the specified endpoint.
   * @param endpoint - The API endpoint to send the delete request to.
   * @param data - The request data, including body, optional headers, and token.
   * @returns The API response data.
   */

  async delete(endpoint: string, data?: ApiRequestDataWithBodyProps) {
    const url = this.generateURL(endpoint);
    const headers = this.generateHeaders(data?.headers || {}, data?.token);
    const body = data?.body;

    this.onDebug(endpoint, "delete", [headers, body]);
    return await deleteRequest(url, headers, body);
  }
}

export { ApiService };
