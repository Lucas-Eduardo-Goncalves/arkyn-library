import { deleteRequest } from "../http/api/deleteRequest";
import { getRequest } from "../http/api/getRequest";
import { patchRequest } from "../http/api/patchRequest";
import { postRequest } from "../http/api/postRequest";
import { putRequest } from "../http/api/putRequest";
import { flushDebugLogs } from "../utilities/flushDebugLogs";

type ApiServiceConstructorProps = {
  baseUrl: string;
  baseHeaders?: HeadersInit;
  baseToken?: string | null;
  enableDebug?: boolean;
};

type ApiRequestDataWithoutBodyProps = {
  headers?: HeadersInit;
  token?: string;
  urlParams?: Record<string, string>;
};

type ApiRequestDataWithBodyProps = {
  body?: any;
  headers?: HeadersInit;
  token?: string;
  urlParams?: Record<string, string>;
};

class ApiService {
  private baseUrl: string;
  private baseHeaders?: HeadersInit;
  private baseToken?: string;
  private enableDebug?: boolean;

  constructor(props: ApiServiceConstructorProps) {
    this.baseUrl = props.baseUrl;
    this.baseHeaders = props.baseHeaders || undefined;
    this.baseToken = props.baseToken || undefined;
    this.enableDebug = props.enableDebug || false;
  }

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

  private generateHeaders(
    initHeaders: HeadersInit,
    token?: string,
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
    const headers = this.generateHeaders(data?.headers || {}, data?.token);

    this.onDebug(endpoint, "get", [headers]);
    return await getRequest({
      url: this.baseUrl + endpoint,
      urlParams: data?.urlParams || {},
      headers,
    });
  }

  /**
   * Sends a post request to the specified endpoint.
   * @param endpoint - The API endpoint to send the post request to.
   * @param data - The request data, including body, optional headers, and token.
   * @returns The API response data.
   */

  async post(endpoint: string, data?: ApiRequestDataWithBodyProps) {
    const headers = this.generateHeaders(data?.headers || {}, data?.token);
    const body = data?.body;

    this.onDebug(endpoint, "post", [headers, body]);
    return await postRequest({
      url: this.baseUrl + endpoint,
      urlParams: data?.urlParams || {},
      headers,
      body,
    });
  }

  /**
   * Sends a put request to the specified endpoint.
   * @param endpoint - The API endpoint to send the put request to.
   * @param data - The request data, including body, optional headers, and token.
   * @returns The API response data.
   */

  async put(endpoint: string, data?: ApiRequestDataWithBodyProps) {
    const headers = this.generateHeaders(data?.headers || {}, data?.token);
    const body = data?.body;

    this.onDebug(endpoint, "put", [headers, body]);
    return await putRequest({
      url: this.baseUrl + endpoint,
      urlParams: data?.urlParams || {},
      headers,
      body,
    });
  }

  /**
   * Sends a patch request to the specified endpoint.
   * @param endpoint - The API endpoint to send the patch request to.
   * @param data - The request data, including body, optional headers, and token.
   * @returns The API response data.
   */

  async patch(endpoint: string, data?: ApiRequestDataWithBodyProps) {
    const headers = this.generateHeaders(data?.headers || {}, data?.token);
    const body = data?.body;

    this.onDebug(endpoint, "patch", [headers, body]);
    return await patchRequest({
      url: this.baseUrl + endpoint,
      urlParams: data?.urlParams || {},
      headers,
      body,
    });
  }

  /**
   * Sends a delete request to the specified endpoint.
   * @param endpoint - The API endpoint to send the delete request to.
   * @param data - The request data, including body, optional headers, and token.
   * @returns The API response data.
   */

  async delete(endpoint: string, data?: ApiRequestDataWithBodyProps) {
    const headers = this.generateHeaders(data?.headers || {}, data?.token);
    const body = data?.body;

    this.onDebug(endpoint, "delete", [headers, body]);
    return await deleteRequest({
      url: this.baseUrl + endpoint,
      urlParams: data?.urlParams || {},
      headers,
      body,
    });
  }
}

export { ApiService };
