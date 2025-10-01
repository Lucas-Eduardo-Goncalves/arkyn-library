import { flushDebugLogs } from "../../services/flushDebugLogs";
import { getCaller } from "../../services/getCaller";

/**
 * Base class for handling bad HTTP responses with debugging capabilities.
 * Provides logging functionality to track response errors and their context.
 */
class BadResponse {
  /**
   * Logs debug information for bad responses including caller context and response details.
   *
   * @param name - The name/type of the bad response being logged
   * @param body - The response body or error data to be logged
   * @param cause - Optional additional cause information for the error
   *
   * @example
   * ```typescript
   * const badResponse = new BadResponse();
   * badResponse.onDebug("ValidationError", { field: "email", message: "Invalid format" });
   * ```
   */
  onDebug(name: string, body: any, cause?: any) {
    const debugs: string[] = [];
    const { callerInfo, functionName } = getCaller();

    debugs.push(`${name} initialized\n`);
    debugs.push(`Caller Function: ${functionName}\n`);
    debugs.push(`Caller Location: ${callerInfo}\n`);
    debugs.push(`Body: ${JSON.stringify(body, null, 2)}\n`);
    if (cause) debugs.push(`Cause: ${JSON.stringify(cause, null, 2)}\n`);

    flushDebugLogs({ scheme: "red", name: "ARKYN-BAD-RESPONSE-DEBUG", debugs });
  }
}

export { BadResponse };
