import { getCaller } from "../services/getCaller";

/**
 * Service for managing HTTP debug configuration and behavior.
 *
 * This service provides functionality to configure how the `getCaller` function
 * identifies the actual caller in the stack trace by allowing specific files
 * to be ignored during stack trace analysis.
 *
 * @example
 * ```typescript
 * // Configure to ignore httpAdapter.ts in stack traces
 * HttpDebugService.setIgnoreFile("httpAdapter.ts");
 *
 * // Now when httpDebug is called from within httpAdapter.ts,
 * // it will show the actual caller (e.g., cart.ts) instead
 * ```
 */
class HttpDebugService {
  /**
   * The name of the file to ignore when analyzing the stack trace.
   * When set, the `getCaller` function will skip stack frames containing this file name.
   */
  static ignoreFile?: string;

  /**
   * Sets the file name to be ignored during stack trace analysis.
   *
   * This method configures the debug service to skip specific files when
   * determining the actual caller of a function. This is useful when you have
   * adapter or wrapper functions that you want to be transparent in the debug output.
   *
   * @param file - The name of the file to ignore in stack traces (e.g., "httpAdapter.ts")
   *
   * @example
   * ```typescript
   * // Ignore the HTTP adapter file so debug shows the actual business logic caller
   * HttpDebugService.setIgnoreFile("httpAdapter.ts");
   * ```
   */
  static setIgnoreFile(file: string) {
    this.ignoreFile = file;
  }
}

/**
 * Logs debug information to the console when in development mode or when the
 * `SHOW_ERRORS_IN_CONSOLE` environment variable is set to "true".
 *
 * This function provides detailed information about the caller function,
 * its location, and the provided body and cause, if any.
 *
 * @param name - A string representing the name or context of the debug log.
 * @param body - The main content or data to be logged.
 * @param cause - (Optional) Additional information or error cause to be logged.
 *
 * @remarks
 * The debug logs are only displayed when the application is running in
 * development mode (`NODE_ENV === "development"`) or when the
 * `SHOW_ERRORS_IN_CONSOLE` environment variable is explicitly set to "true".
 *
 * The logs include:
 * - The name of the debug context.
 * - The caller function name and its location.
 * - The provided body content.
 * - The optional cause, if provided.
 *
 * @example
 * ```typescript
 * httpDebug("FetchUserData", { userId: 123 });
 * ```
 *
 * @example
 * ```typescript
 * httpDebug("FetchUserDataError", { userId: 123 }, new Error("User not found"));
 * ```
 */

function httpDebug(name: string, body: any, cause?: any) {
  const isDebugMode =
    process.env.NODE_ENV === "development" ||
    process.env?.SHOW_ERRORS_IN_CONSOLE === "true";

  if (isDebugMode) {
    const reset = "\x1b[0m";
    const cyan = "\x1b[36m";

    const debugName = `${cyan}[ARKYN-DEBUG]${reset}`;
    const { callerInfo, functionName } = getCaller();

    let consoleData = `${debugName} ${name} initialized\n`;
    consoleData += `${debugName} Caller Function: ${functionName}\n`;
    consoleData += `${debugName} Caller Location: ${callerInfo}\n`;
    consoleData += `${debugName} Body: ${JSON.stringify(body, null, 2)}\n`;

    if (cause) {
      consoleData += `${debugName} Cause: ${JSON.stringify(cause, null, 2)}\n`;
    }

    console.log(consoleData);
  }
}

export { httpDebug, HttpDebugService };
