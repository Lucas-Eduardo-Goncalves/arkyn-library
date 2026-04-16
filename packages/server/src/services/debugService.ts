import path from "node:path";

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

class DebugService {
  /**
   * The name of the file to ignore when analyzing the stack trace.
   * When set, the `getCaller` function will skip stack frames containing this file name.
   */
  static ignoreFiles: string[] = [];

  /**
   * Sets the file name to be ignored during stack trace analysis.
   *
   * This method configures the debug service to skip specific files when
   * determining the actual caller of a function. This is useful when you have
   * adapter or wrapper functions that you want to be transparent in the debug output.
   *
   * @param {string} file - The name of the file to ignore in stack traces (e.g., "httpAdapter.ts")
   *
   * @example
   * ```typescript
   * // Ignore the HTTP adapter file so debug shows the actual business logic caller
   * DebugService.setIgnoreFile("httpAdapter.ts");
   * ```
   */

  static setIgnoreFile(file: string): void {
    this.ignoreFiles.push(file);
  }

  /**
   * Clears all configured ignore files.
   *
   * This method resets the ignore file configuration, allowing all files to be
   * considered in stack trace analysis again.
   *
   * @example
   * ```typescript
   * // Clear all ignore file configurations
   * DebugService.clearIgnoreFiles();
   * ```
   */

  static clearIgnoreFiles(): void {
    this.ignoreFiles = [];
  }

  /**
   * Retrieves information about the caller of the current function.
   *
   * This function analyzes the stack trace to determine the file path and function name
   * of the caller. It excludes stack trace entries related to the `@arkyn/server` package
   * and attempts to resolve the file path relative to the project root directory.
   *
   * @returns An object containing:
   * - `functionName`: The name of the function that called the current function, or "Unknown function" if it cannot be determined.
   * - `callerInfo`: The file path of the caller relative to the project root, or "Unknown caller" if it cannot be determined.
   */

  static getCaller() {
    const projectRoot = process.cwd();

    const err = new Error();
    const stack = err.stack || "";
    const stackLines = stack.split("\n").map((line) => line.trim());

    let callerIndex = 2;

    while (
      callerIndex < stackLines.length &&
      (stackLines[callerIndex].includes("node:internal") ||
        stackLines[callerIndex].includes("/node_modules/"))
    ) {
      callerIndex++;
    }

    if (this.ignoreFiles.length > 0) {
      while (
        callerIndex < stackLines.length &&
        this.ignoreFiles.some((ignoreFile) =>
          stackLines[callerIndex].includes(ignoreFile),
        )
      ) {
        callerIndex++;
      }
    }

    const callerLine = stackLines[callerIndex] || "";

    let functionName = "Unknown function";
    let callerInfo = "Unknown caller";

    const namedFunctionMatch = callerLine.match(/at\s+([^(\s]+)\s+\(([^)]+)\)/);
    if (namedFunctionMatch) {
      functionName = namedFunctionMatch[1];
      callerInfo = namedFunctionMatch[2];
    } else {
      const anonymousFunctionMatch = callerLine.match(/at\s+(.+)/);
      if (anonymousFunctionMatch) {
        callerInfo = anonymousFunctionMatch[1];

        const objectMethodMatch = callerInfo.match(/at\s+([^(\s]+)\s+/);
        if (objectMethodMatch && objectMethodMatch[1] !== "new") {
          functionName = objectMethodMatch[1];
        }
      }
    }

    if (callerInfo.includes("(")) {
      callerInfo = callerInfo.substring(
        callerInfo.indexOf("(") + 1,
        callerInfo.lastIndexOf(")"),
      );
    }

    callerInfo = callerInfo.split(":").slice(0, -2).join(":");

    try {
      callerInfo = path.relative(projectRoot, callerInfo);
    } catch (e) {}

    return { functionName, callerInfo };
  }
}

export { DebugService };
