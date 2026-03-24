/**
 * Flushes debug logs to the console with colored output in development mode.
 *
 * This function only outputs logs when running in development mode or when
 * the DEBUG_MODE environment variable is set to "true".
 * Each log entry is prefixed with a colored name tag based on the specified color scheme.
 *
 * @param {object} props - Configuration object for debug logging.
 * @param {string} props.name - The name/label to display before each log entry (e.g., "API", "Database").
 * @param {"yellow" | "cyan" | "red" | "green"} props.scheme - The color scheme for the name tag:
 *   - "yellow": Warning-level logs
 *   - "cyan": Info-level logs
 *   - "red": Error-level logs
 *   - "green": Success-level logs
 * @param {string[]} props.debugs - Array of debug messages to be logged.
 *
 * @returns {void}
 *
 * @example
 * ```typescript
 * // Log API request information
 * flushDebugLogs({
 *   name: "API",
 *   scheme: "cyan",
 *   debugs: ["POST /api/users", "Status: 201", "Response time: 45ms"]
 * });
 * // Output:
 * // [API] POST /api/users
 * // [API] Status: 201
 * // [API] Response time: 45ms
 *
 * // Log error messages
 * flushDebugLogs({
 *   name: "ERROR",
 *   scheme: "red",
 *   debugs: ["Database connection failed", "Retrying in 5s..."]
 * });
 * ```
 */

function flushDebugLogs(props: {
  scheme: "yellow" | "cyan" | "red" | "green";
  name: string;
  debugs: string[];
}): void {
  const isDebugMode =
    process.env.NODE_ENV === "development" ||
    process.env?.DEBUG_MODE === "true";

  if (isDebugMode) {
    const reset = "\x1b[0m";

    const colors = {
      yellow: "\x1b[33m",
      cyan: "\x1b[36m",
      red: "\x1b[31m",
      green: "\x1b[32m",
    };

    const debugName = `${colors[props.scheme]}[${props.name}]${reset}`;
    let consoleData = `\n`;

    props.debugs.forEach((debug, index) => {
      consoleData += `${debugName} ${debug.trim()}`;
      if (index < props.debugs.length - 1) consoleData += `\n`;
    });

    console.log(consoleData);
  }
}

export { flushDebugLogs };
