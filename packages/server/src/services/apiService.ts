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

type DebugConfig = {
  headers?: HeadersInit;
  body?: any;
  response?: any;
  status: number;
  message: string;
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

  private onDebug(endpoint: string, method: string, data: DebugConfig) {
    if (this.enableDebug) {
      const debugs: string[] = [];
      const json = (data: any) => (data ? JSON.stringify(data, null, 2) : null);

      debugs.push(`Base URL: ${this.baseUrl}`);
      debugs.push(`Endpoint: ${endpoint}`);
      debugs.push(`Method: ${method}`);
      debugs.push(`Status: ${data.status}`);
      debugs.push(`Message: ${data.message}`);
      debugs.push(`Headers: ${json(data.headers)}`);
      debugs.push(`Body: ${json(data.body)}`);
      debugs.push(`Response: ${json(data.response)}`);

      flushDebugLogs({ debugs, name: "ApiDebug", scheme: "yellow" });
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

    const response = await getRequest({
      url: this.baseUrl + endpoint,
      urlParams: data?.urlParams || {},
      headers,
    });

    this.onDebug(endpoint, "get", {
      headers,
      message: response.message,
      status: response.status,
      response: response.response,
    });

    return response;
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

    const response = await postRequest({
      url: this.baseUrl + endpoint,
      urlParams: data?.urlParams || {},
      headers,
      body,
    });

    this.onDebug(endpoint, "post", {
      headers,
      body,
      message: response.message,
      status: response.status,
      response: response.response,
    });

    return response;
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

    const response = await putRequest({
      url: this.baseUrl + endpoint,
      urlParams: data?.urlParams || {},
      headers,
      body,
    });

    this.onDebug(endpoint, "put", {
      headers,
      body,
      message: response.message,
      status: response.status,
      response: response.response,
    });

    return response;
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

    const response = await patchRequest({
      url: this.baseUrl + endpoint,
      urlParams: data?.urlParams || {},
      headers,
      body,
    });

    this.onDebug(endpoint, "patch", {
      headers,
      body,
      message: response.message,
      status: response.status,
      response: response.response,
    });

    return response;
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

    const response = await deleteRequest({
      url: this.baseUrl + endpoint,
      urlParams: data?.urlParams || {},
      headers,
      body,
    });

    this.onDebug(endpoint, "delete", {
      headers,
      body,
      message: response.message,
      status: response.status,
      response: response.response,
    });

    return response;
  }
}

export { ApiService };
